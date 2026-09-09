CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;

CREATE SCHEMA IF NOT EXISTS marketplace;

CREATE TABLE marketplace.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(32) UNIQUE NOT NULL,
    business_name VARCHAR(255) NOT NULL,
    location VARCHAR(120),
    latitude NUMERIC(9,6),
    longitude NUMERIC(9,6),
    rating NUMERIC(3,2) NOT NULL DEFAULT 3.50,
    response_speed_seconds INTEGER NOT NULL DEFAULT 900,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT users_rating_valid CHECK (rating >= 0 AND rating <= 5),
    CONSTRAINT users_response_speed_positive CHECK (response_speed_seconds >= 0)
);

CREATE TABLE marketplace.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES marketplace.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    encrypted_pii JSONB NOT NULL DEFAULT '{}'::jsonb,
    total_spent BIGINT NOT NULL DEFAULT 0,
    last_seen TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT customers_total_spent_non_negative CHECK (total_spent >= 0),
    CONSTRAINT customers_phone_per_user_unique UNIQUE (user_id, phone)
);

CREATE TABLE marketplace.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES marketplace.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(80),
    price BIGINT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    search_vector TSVECTOR GENERATED ALWAYS AS (to_tsvector('simple', coalesce(name, '') || ' ' || coalesce(sku, ''))) STORED,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT products_price_non_negative CHECK (price >= 0),
    CONSTRAINT products_quantity_non_negative CHECK (quantity >= 0)
);

CREATE TABLE marketplace.requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_phone VARCHAR(32) NOT NULL,
    product VARCHAR(255) NOT NULL,
    budget BIGINT NOT NULL,
    location VARCHAR(120) NOT NULL,
    status VARCHAR(40) NOT NULL DEFAULT 'OPEN',
    matched_user_id UUID REFERENCES marketplace.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT requests_budget_non_negative CHECK (budget >= 0),
    CONSTRAINT requests_status_valid CHECK (status IN ('OPEN', 'MATCHED', 'CLOSED'))
);

CREATE TABLE marketplace.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES marketplace.users(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES marketplace.customers(id) ON DELETE SET NULL,
    request_id UUID REFERENCES marketplace.requests(id) ON DELETE SET NULL,
    buyer_phone VARCHAR(32) NOT NULL,
    product VARCHAR(255) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    amount BIGINT NOT NULL,
    status VARCHAR(60) NOT NULL DEFAULT 'PENDING_SELLER_ACCEPTANCE',
    seller_note VARCHAR(255),
    idempotency_key VARCHAR(120),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT orders_quantity_positive CHECK (quantity > 0),
    CONSTRAINT orders_amount_non_negative CHECK (amount >= 0)
);

CREATE TABLE marketplace.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES marketplace.orders(id) ON DELETE CASCADE,
    amount BIGINT NOT NULL,
    payment_link TEXT,
    payment_reference VARCHAR(120) UNIQUE,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT invoices_amount_non_negative CHECK (amount >= 0),
    CONSTRAINT invoices_status_valid CHECK (status IN ('PENDING', 'PAID', 'FAILED', 'EXPIRED'))
);

CREATE TABLE marketplace.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES marketplace.invoices(id) ON DELETE CASCADE,
    amount BIGINT NOT NULL,
    status VARCHAR(40) NOT NULL,
    paid_at TIMESTAMP,
    provider_reference VARCHAR(120),
    raw_provider_event JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT transactions_amount_non_negative CHECK (amount >= 0)
);

CREATE TABLE marketplace.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES marketplace.users(id) ON DELETE SET NULL,
    conversation_phone VARCHAR(32) NOT NULL,
    direction VARCHAR(10) NOT NULL,
    sender VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    metadata_json TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT messages_direction_valid CHECK (direction IN ('inbound', 'outbound')),
    CONSTRAINT messages_sender_valid CHECK (sender IN ('buyer', 'seller', 'ai', 'system'))
);

CREATE TABLE marketplace.conversation_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(32) NOT NULL UNIQUE,
    role VARCHAR(20) NOT NULL,
    state VARCHAR(60) NOT NULL,
    active_request_id UUID REFERENCES marketplace.requests(id) ON DELETE SET NULL,
    active_order_id UUID REFERENCES marketplace.orders(id) ON DELETE SET NULL,
    option_payload_json TEXT,
    last_inbound_at TIMESTAMP,
    last_outbound_at TIMESTAMP,
    reminder_sent_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE marketplace.prompt_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version_label VARCHAR(60) NOT NULL UNIQUE,
    prompt_text TEXT NOT NULL,
    notes TEXT,
    active BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE marketplace.training_examples (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    raw_message TEXT NOT NULL,
    detected_intent VARCHAR(40) NOT NULL,
    extracted_product VARCHAR(255),
    extracted_budget BIGINT NOT NULL DEFAULT 0,
    extracted_location VARCHAR(120),
    source VARCHAR(20) NOT NULL,
    confidence NUMERIC(4,3) NOT NULL DEFAULT 0,
    prompt_version_id UUID REFERENCES marketplace.prompt_versions(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT training_confidence_valid CHECK (confidence >= 0 AND confidence <= 1)
);

CREATE TABLE marketplace.payment_webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider VARCHAR(30) NOT NULL,
    event_id VARCHAR(160),
    reference VARCHAR(120),
    signature_hash VARCHAR(160) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'RECEIVED',
    payload JSONB NOT NULL,
    processed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT payment_webhook_provider_event_unique UNIQUE (provider, event_id),
    CONSTRAINT payment_webhook_provider_reference_unique UNIQUE (provider, reference, signature_hash)
);

CREATE TABLE marketplace.audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID,
    actor_id UUID,
    actor_type VARCHAR(40) NOT NULL DEFAULT 'system',
    action VARCHAR(120) NOT NULL,
    resource_type VARCHAR(120) NOT NULL,
    resource_id UUID,
    ip_address INET,
    user_agent TEXT,
    before_state JSONB,
    after_state JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_marketplace_users_location ON marketplace.users(location);
CREATE INDEX idx_marketplace_users_active_rating ON marketplace.users(active, rating DESC);
CREATE INDEX idx_marketplace_customers_user_id ON marketplace.customers(user_id);
CREATE INDEX idx_marketplace_customers_last_seen ON marketplace.customers(user_id, last_seen DESC);
CREATE INDEX idx_marketplace_products_user_id ON marketplace.products(user_id);
CREATE INDEX idx_marketplace_products_name ON marketplace.products USING gin(search_vector);
CREATE INDEX idx_marketplace_products_active_price ON marketplace.products(active, price);
CREATE INDEX idx_marketplace_requests_status ON marketplace.requests(status);
CREATE INDEX idx_marketplace_requests_product_location ON marketplace.requests(product, location);
CREATE INDEX idx_marketplace_orders_user_id ON marketplace.orders(user_id);
CREATE INDEX idx_marketplace_orders_buyer_phone ON marketplace.orders(buyer_phone);
CREATE INDEX idx_marketplace_orders_status_created ON marketplace.orders(status, created_at);
CREATE INDEX idx_marketplace_invoices_reference ON marketplace.invoices(payment_reference);
CREATE INDEX idx_marketplace_transactions_invoice_id ON marketplace.transactions(invoice_id);
CREATE INDEX idx_marketplace_transactions_provider_reference ON marketplace.transactions(provider_reference);
CREATE INDEX idx_marketplace_messages_phone ON marketplace.messages(conversation_phone);
CREATE INDEX idx_marketplace_messages_user_created ON marketplace.messages(user_id, created_at DESC);
CREATE INDEX idx_marketplace_sessions_phone ON marketplace.conversation_sessions(phone);
CREATE INDEX idx_marketplace_training_examples_created_at ON marketplace.training_examples(created_at);
CREATE INDEX idx_marketplace_audit_tenant_created ON marketplace.audit_log(tenant_id, created_at DESC);

CREATE OR REPLACE FUNCTION marketplace.touch_updated_at()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_touch_updated_at BEFORE UPDATE ON marketplace.users FOR EACH ROW EXECUTE FUNCTION marketplace.touch_updated_at();
CREATE TRIGGER customers_touch_updated_at BEFORE UPDATE ON marketplace.customers FOR EACH ROW EXECUTE FUNCTION marketplace.touch_updated_at();
CREATE TRIGGER products_touch_updated_at BEFORE UPDATE ON marketplace.products FOR EACH ROW EXECUTE FUNCTION marketplace.touch_updated_at();
CREATE TRIGGER requests_touch_updated_at BEFORE UPDATE ON marketplace.requests FOR EACH ROW EXECUTE FUNCTION marketplace.touch_updated_at();
CREATE TRIGGER orders_touch_updated_at BEFORE UPDATE ON marketplace.orders FOR EACH ROW EXECUTE FUNCTION marketplace.touch_updated_at();
CREATE TRIGGER invoices_touch_updated_at BEFORE UPDATE ON marketplace.invoices FOR EACH ROW EXECUTE FUNCTION marketplace.touch_updated_at();
CREATE TRIGGER transactions_touch_updated_at BEFORE UPDATE ON marketplace.transactions FOR EACH ROW EXECUTE FUNCTION marketplace.touch_updated_at();
CREATE TRIGGER messages_touch_updated_at BEFORE UPDATE ON marketplace.messages FOR EACH ROW EXECUTE FUNCTION marketplace.touch_updated_at();
CREATE TRIGGER sessions_touch_updated_at BEFORE UPDATE ON marketplace.conversation_sessions FOR EACH ROW EXECUTE FUNCTION marketplace.touch_updated_at();
CREATE TRIGGER prompt_versions_touch_updated_at BEFORE UPDATE ON marketplace.prompt_versions FOR EACH ROW EXECUTE FUNCTION marketplace.touch_updated_at();
CREATE TRIGGER training_examples_touch_updated_at BEFORE UPDATE ON marketplace.training_examples FOR EACH ROW EXECUTE FUNCTION marketplace.touch_updated_at();

ALTER TABLE marketplace.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_customers ON marketplace.customers
    USING (current_setting('app.current_tenant_id', true) IS NULL OR user_id::text = current_setting('app.current_tenant_id', true));
CREATE POLICY tenant_products ON marketplace.products
    USING (current_setting('app.current_tenant_id', true) IS NULL OR user_id::text = current_setting('app.current_tenant_id', true));
CREATE POLICY tenant_orders ON marketplace.orders
    USING (current_setting('app.current_tenant_id', true) IS NULL OR user_id::text = current_setting('app.current_tenant_id', true));
CREATE POLICY tenant_invoices ON marketplace.invoices
    USING (
        current_setting('app.current_tenant_id', true) IS NULL
        OR EXISTS (
            SELECT 1 FROM marketplace.orders o
            WHERE o.id = order_id AND o.user_id::text = current_setting('app.current_tenant_id', true)
        )
    );
CREATE POLICY tenant_transactions ON marketplace.transactions
    USING (
        current_setting('app.current_tenant_id', true) IS NULL
        OR EXISTS (
            SELECT 1 FROM marketplace.invoices i
            JOIN marketplace.orders o ON o.id = i.order_id
            WHERE i.id = invoice_id AND o.user_id::text = current_setting('app.current_tenant_id', true)
        )
    );
CREATE POLICY tenant_messages ON marketplace.messages
    USING (current_setting('app.current_tenant_id', true) IS NULL OR user_id IS NULL OR user_id::text = current_setting('app.current_tenant_id', true));
