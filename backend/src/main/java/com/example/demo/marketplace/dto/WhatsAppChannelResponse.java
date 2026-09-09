package com.example.demo.marketplace.dto;

import com.example.demo.marketplace.entity.MerchantWhatsAppChannel;

import java.util.UUID;

public record WhatsAppChannelResponse(
    UUID id,
    UUID merchantId,
    String businessName,
    String phoneNumberId,
    String displayPhoneNumber,
    String wabaId,
    String businessPortfolioId,
    String accessTokenSecretRef,
    String status,
    String qualityRating,
    String throughputLevel,
    boolean webhookSubscribed,
    boolean defaultChannel
) {
    public static WhatsAppChannelResponse from(MerchantWhatsAppChannel channel) {
        return new WhatsAppChannelResponse(
            channel.getId(),
            channel.getUser().getId(),
            channel.getUser().getBusinessName(),
            channel.getPhoneNumberId(),
            channel.getDisplayPhoneNumber(),
            channel.getWabaId(),
            channel.getBusinessPortfolioId(),
            channel.getAccessTokenSecretRef(),
            channel.getStatus(),
            channel.getQualityRating(),
            channel.getThroughputLevel(),
            channel.isWebhookSubscribed(),
            channel.isDefaultChannel()
        );
    }
}
