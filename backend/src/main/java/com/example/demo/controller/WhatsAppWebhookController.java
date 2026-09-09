package com.example.demo.controller;

import com.example.demo.marketplace.entity.MerchantWhatsAppChannel;
import com.example.demo.marketplace.service.MerchantWhatsAppChannelService;
import com.example.demo.marketplace.service.MarketplaceChatService;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/webhook/whatsapp")
public class WhatsAppWebhookController {

    private final MarketplaceChatService marketplaceChatService;
    private final MerchantWhatsAppChannelService channelService;

    @Value("${whatsapp.cloud.verify-token:kudipal-verify-token}")
    private String verifyToken;

    public WhatsAppWebhookController(MarketplaceChatService marketplaceChatService,
                                     MerchantWhatsAppChannelService channelService) {
        this.marketplaceChatService = marketplaceChatService;
        this.channelService = channelService;
    }

    @GetMapping
    public ResponseEntity<String> verifyWebhook(@RequestParam(name = "hub.mode", required = false) String mode,
                                                @RequestParam(name = "hub.verify_token", required = false) String token,
                                                @RequestParam(name = "hub.challenge", required = false) String challenge) {
        if ("subscribe".equals(mode) && verifyToken.equals(token)) {
            return ResponseEntity.ok(challenge == null ? "" : challenge);
        }
        return ResponseEntity.status(403).body("Invalid verify token");
    }

    @PostMapping
    public ResponseEntity<Void> receiveMessage(@RequestBody JsonNode payload) {
        JsonNode entries = payload.path("entry");
        if (!entries.isArray()) {
            return ResponseEntity.ok().build();
        }

        for (JsonNode entry : entries) {
            for (JsonNode change : entry.path("changes")) {
                JsonNode value = change.path("value");
                String receivingPhoneNumberId = value.path("metadata").path("phone_number_id").asText("");
                channelService.findByPhoneNumberId(receivingPhoneNumberId)
                    .ifPresentOrElse(
                        channel -> logRoutedChannel(channel, receivingPhoneNumberId),
                        () -> logUnknownChannel(receivingPhoneNumberId)
                    );
                JsonNode messages = value.path("messages");
                if (!messages.isArray()) {
                    continue;
                }

                for (JsonNode message : messages) {
                    if (!"text".equals(message.path("type").asText())) {
                        continue;
                    }

                    String from = message.path("from").asText("");
                    String body = message.path("text").path("body").asText("");
                    if (!from.isBlank() && !body.isBlank()) {
                        marketplaceChatService.handleIncomingText(from, body, payload);
                    }
                }
            }
        }

        return ResponseEntity.ok().build();
    }

    private void logRoutedChannel(MerchantWhatsAppChannel channel, String phoneNumberId) {
        System.out.println("Routing WhatsApp webhook for phone_number_id=" + phoneNumberId +
            " to merchant=" + channel.getUser().getBusinessName());
    }

    private void logUnknownChannel(String phoneNumberId) {
        if (phoneNumberId != null && !phoneNumberId.isBlank()) {
            System.out.println("Received WhatsApp webhook for unregistered phone_number_id=" + phoneNumberId);
        }
    }
}
