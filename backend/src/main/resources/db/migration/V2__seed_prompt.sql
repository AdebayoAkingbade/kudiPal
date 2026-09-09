INSERT INTO marketplace.prompt_versions (version_label, prompt_text, notes, active)
VALUES (
    'kudipal-structured-intents-v1',
    'Return structured JSON only. Detect one of BUY_REQUEST, SELLER_ACCEPT, SELLER_DECLINE, RECORD_SALE, CREATE_INVOICE, CUSTOMER_SUPPORT, INVENTORY_UPDATE. Support English, Nigerian Pidgin, and broken English. Extract product, budget, location, amount, quantity, and confidence when present.',
    'Initial production prompt contract for WhatsApp marketplace operations.',
    TRUE
)
ON CONFLICT (version_label) DO NOTHING;
