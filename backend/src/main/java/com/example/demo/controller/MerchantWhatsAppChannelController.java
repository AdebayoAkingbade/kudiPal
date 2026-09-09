package com.example.demo.controller;

import com.example.demo.marketplace.dto.RegisterWhatsAppChannelRequest;
import com.example.demo.marketplace.dto.WhatsAppChannelResponse;
import com.example.demo.marketplace.service.MerchantWhatsAppChannelService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Pattern;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Validated
@RestController
@RequestMapping("/api/marketplace/channels/whatsapp")
public class MerchantWhatsAppChannelController {

    private final MerchantWhatsAppChannelService channelService;

    public MerchantWhatsAppChannelController(MerchantWhatsAppChannelService channelService) {
        this.channelService = channelService;
    }

    @PostMapping
    public ResponseEntity<WhatsAppChannelResponse> registerChannel(@Valid @RequestBody RegisterWhatsAppChannelRequest request) {
        return ResponseEntity.ok(channelService.registerChannel(request));
    }

    @GetMapping("/seller/{sellerPhone}")
    public ResponseEntity<List<WhatsAppChannelResponse>> listSellerChannels(
        @PathVariable @Pattern(regexp = "^[0-9+ ]{8,20}$") String sellerPhone) {
        return ResponseEntity.ok(channelService.listChannelsForSeller(sellerPhone));
    }
}
