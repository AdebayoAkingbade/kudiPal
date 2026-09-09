CREATE TABLE IF NOT EXISTS marketplace.merchant_whatsapp_channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES marketplace.users(id) ON DELETE CASCADE,
    phone_number_id VARCHAR(80) NOT NULL UNIQUE,
    display_phone_number VARCHAR(32) NOT NULL,
    waba_id VARCHAR(80) NOT NULL,
    business_portfolio_id VARCHAR(80),
    access_token_secret_ref VARCHAR(255),
    verify_token VARCHAR(120) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING_VERIFICATION',
    quality_rating VARCHAR(30),
    throughput_level VARCHAR(30),
    webhook_subscribed BOOLEAN NOT NULL DEFAULT FALSE,
    default_channel BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT merchant_whatsapp_channels_status_valid CHECK (
        status IN ('PENDING_VERIFICATION', 'ACTIVE', 'DISABLED', 'REJECTED', 'MIGRATION_REQUIRED')
    )
);

CREATE INDEX IF NOT EXISTS idx_merchant_whatsapp_channels_user_id
    ON marketplace.merchant_whatsapp_channels(user_id);

CREATE INDEX IF NOT EXISTS idx_merchant_whatsapp_channels_waba_id
    ON marketplace.merchant_whatsapp_channels(waba_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_merchant_whatsapp_channels_one_default_per_user
    ON marketplace.merchant_whatsapp_channels(user_id)
    WHERE default_channel;

CREATE TRIGGER merchant_whatsapp_channels_touch_updated_at
    BEFORE UPDATE ON marketplace.merchant_whatsapp_channels
    FOR EACH ROW EXECUTE FUNCTION marketplace.touch_updated_at();

ALTER TABLE marketplace.merchant_whatsapp_channels ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_merchant_whatsapp_channels ON marketplace.merchant_whatsapp_channels
    USING (current_setting('app.current_tenant_id', true) IS NULL OR user_id::text = current_setting('app.current_tenant_id', true));
