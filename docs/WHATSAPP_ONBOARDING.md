# WhatsApp Cloud API Onboarding

KudiPal has three WhatsApp setup modes:

- Meta test number for early development.
- KudiPal platform number for staging and production marketplace traffic.
- Merchant channels so each SME can connect its own WhatsApp Business Platform number.

## 1. Meta Test Number

Use this first to test webhook shape, message parsing, and reply behavior without risking a real customer-facing number.

1. Go to <https://developers.facebook.com/apps/>.
2. Create or open a Meta app.
3. Add the WhatsApp product.
4. Open WhatsApp > API Setup or Quickstart.
5. Use the generated test phone number, temporary access token, test `phone_number_id`, and WhatsApp Business Account ID.
6. Add your personal WhatsApp number as an allowed recipient in the test recipients list.
7. Configure KudiPal:

```bash
WHATSAPP_CLOUD_ACCESS_TOKEN=<temporary-test-token>
WHATSAPP_CLOUD_PHONE_NUMBER_ID=<test-phone-number-id>
WHATSAPP_CLOUD_VERIFY_TOKEN=<your-local-verify-token>
```

For local webhook testing, expose the backend:

```bash
ngrok http 8081
```

Then set the Meta webhook callback URL to:

```text
https://<ngrok-domain>/api/webhook/whatsapp
```

Subscribe to the `messages` webhook field.

## 2. Real Dedicated Production Number

Use a dedicated phone number, not a personal number. This number becomes a WhatsApp Business Platform number controlled by Meta Cloud API.

1. Create or select a Meta Business Portfolio in Meta Business Suite.
2. Create or select a WhatsApp Business Account.
3. Complete business verification before scaling traffic.
4. In WhatsApp Manager, add a phone number for KudiPal.
5. Verify the number by SMS or voice OTP.
6. Submit and wait for display name approval.
7. Generate a system-user access token with:
   - `whatsapp_business_messaging`
   - `whatsapp_business_management`
   - `business_management` when managing WABA/phone resources.
8. Add a payment method when required for production messaging.
9. Create approved templates for outbound reminders, order status, and payment nudges.

Backend config:

```bash
WHATSAPP_CLOUD_ACCESS_TOKEN=<production-system-user-token>
WHATSAPP_CLOUD_PHONE_NUMBER_ID=<production-phone-number-id>
WHATSAPP_CLOUD_VERIFY_TOKEN=<strong-random-token>
```

Webhook URL:

```text
https://api.kudipal.com/api/webhook/whatsapp
```

## 3. KudiPal Platform Number

This is the central number buyers can message directly. It should be owned by KudiPal's Meta Business Portfolio and used for marketplace discovery:

```text
Buyer -> KudiPal Platform Number -> KudiPal matching engine -> Seller notification -> Paystack payment
```

Use this number for:

- Buyer product search.
- Marketplace-wide support.
- Seller discovery.
- Platform announcements.

Do not overload this number for every merchant's branded traffic at high scale. At scale, merchants should connect their own channels.

## 4. Merchant Channel Onboarding

KudiPal now supports registering each merchant's WhatsApp Cloud API channel.

Register a channel:

```bash
curl -X POST http://localhost:8081/api/marketplace/channels/whatsapp \
  -H "Authorization: Bearer <jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "businessName": "Lekki Boots",
    "sellerPhone": "+2348012345678",
    "location": "Lekki",
    "phoneNumberId": "123456789012345",
    "displayPhoneNumber": "+2348012345678",
    "wabaId": "987654321098765",
    "businessPortfolioId": "112233445566",
    "accessTokenSecretRef": "kudipal/prod/merchants/lekki-boots/whatsapp",
    "verifyToken": "merchant-specific-verify-token",
    "defaultChannel": true
  }'
```

List a seller's channels:

```bash
curl http://localhost:8081/api/marketplace/channels/whatsapp/seller/+2348012345678 \
  -H "Authorization: Bearer <jwt>"
```

When Meta sends a webhook, KudiPal reads:

```text
entry[].changes[].value.metadata.phone_number_id
```

and resolves it to the merchant channel. This lets one central webhook endpoint route messages for many merchants.

## 5. Paystack Rollout

Use Paystack test mode until all of these work reliably:

- Payment initialization.
- `charge.success` webhook signature verification.
- Idempotent payment replay.
- Invoice status update.
- Buyer and seller payment confirmation.
- Reconciliation report.

Switch to live mode only after webhook replay tests and ledger reconciliation pass.
