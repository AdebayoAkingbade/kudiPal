package com.example.demo.marketplace.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterWhatsAppChannelRequest(
    @NotBlank @Size(max = 255) String businessName,
    @NotBlank @Pattern(regexp = "^[0-9+ ]{8,20}$") String sellerPhone,
    @Size(max = 120) String location,
    @NotBlank @Size(max = 80) String phoneNumberId,
    @NotBlank @Size(max = 32) String displayPhoneNumber,
    @NotBlank @Size(max = 80) String wabaId,
    @Size(max = 80) String businessPortfolioId,
    @Size(max = 255) String accessTokenSecretRef,
    @NotBlank @Size(max = 120) String verifyToken,
    boolean defaultChannel
) {
}
