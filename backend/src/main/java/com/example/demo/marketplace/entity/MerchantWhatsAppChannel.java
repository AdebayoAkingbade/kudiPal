package com.example.demo.marketplace.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "merchant_whatsapp_channels", schema = "marketplace")
public class MerchantWhatsAppChannel extends BaseMarketplaceEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private MarketplaceUser user;

    @Column(name = "phone_number_id", nullable = false, unique = true, length = 80)
    private String phoneNumberId;

    @Column(name = "display_phone_number", nullable = false, length = 32)
    private String displayPhoneNumber;

    @Column(name = "waba_id", nullable = false, length = 80)
    private String wabaId;

    @Column(name = "business_portfolio_id", length = 80)
    private String businessPortfolioId;

    @Column(name = "access_token_secret_ref", length = 255)
    private String accessTokenSecretRef;

    @Column(name = "verify_token", nullable = false, length = 120)
    private String verifyToken;

    @Column(nullable = false, length = 30)
    private String status = "PENDING_VERIFICATION";

    @Column(name = "quality_rating", length = 30)
    private String qualityRating;

    @Column(name = "throughput_level", length = 30)
    private String throughputLevel;

    @Column(name = "webhook_subscribed", nullable = false)
    private boolean webhookSubscribed;

    @Column(name = "default_channel", nullable = false)
    private boolean defaultChannel;

    public MarketplaceUser getUser() {
        return user;
    }

    public void setUser(MarketplaceUser user) {
        this.user = user;
    }

    public String getPhoneNumberId() {
        return phoneNumberId;
    }

    public void setPhoneNumberId(String phoneNumberId) {
        this.phoneNumberId = phoneNumberId;
    }

    public String getDisplayPhoneNumber() {
        return displayPhoneNumber;
    }

    public void setDisplayPhoneNumber(String displayPhoneNumber) {
        this.displayPhoneNumber = displayPhoneNumber;
    }

    public String getWabaId() {
        return wabaId;
    }

    public void setWabaId(String wabaId) {
        this.wabaId = wabaId;
    }

    public String getBusinessPortfolioId() {
        return businessPortfolioId;
    }

    public void setBusinessPortfolioId(String businessPortfolioId) {
        this.businessPortfolioId = businessPortfolioId;
    }

    public String getAccessTokenSecretRef() {
        return accessTokenSecretRef;
    }

    public void setAccessTokenSecretRef(String accessTokenSecretRef) {
        this.accessTokenSecretRef = accessTokenSecretRef;
    }

    public String getVerifyToken() {
        return verifyToken;
    }

    public void setVerifyToken(String verifyToken) {
        this.verifyToken = verifyToken;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getQualityRating() {
        return qualityRating;
    }

    public void setQualityRating(String qualityRating) {
        this.qualityRating = qualityRating;
    }

    public String getThroughputLevel() {
        return throughputLevel;
    }

    public void setThroughputLevel(String throughputLevel) {
        this.throughputLevel = throughputLevel;
    }

    public boolean isWebhookSubscribed() {
        return webhookSubscribed;
    }

    public void setWebhookSubscribed(boolean webhookSubscribed) {
        this.webhookSubscribed = webhookSubscribed;
    }

    public boolean isDefaultChannel() {
        return defaultChannel;
    }

    public void setDefaultChannel(boolean defaultChannel) {
        this.defaultChannel = defaultChannel;
    }
}
