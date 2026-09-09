# KudiPal

KudiPal is a WhatsApp-first commerce and business operating system for African SMEs.

It helps merchants make more money, save time, and avoid losing money by combining WhatsApp commerce workflows, seller matching, payments, inventory operations, customer records, reminders, and weekly business insights.

## What Is Included

- Java 21 Spring Boot 3 backend
- PostgreSQL schema with Flyway migrations, indexes, audit logging, idempotency tables, and row-level security
- Meta WhatsApp Cloud API webhook flow
- Paystack payment initialization and webhook validation
- OpenAI structured intent extraction support
- REST API scaffolding, OpenAPI metadata, DTO/error-handling pattern
- Dockerfile and Docker Compose local stack
- GitHub Actions CI
- AWS ECS Fargate/RDS/Secrets Manager/SQS baseline
- Grafana dashboard and Prometheus alert rules
- Architecture, deployment, and security documentation

## Core Buyer Flow

1. Buyer sends a WhatsApp message such as `I want to buy a timberland brown shoe, budget 35000, location Lekki`.
2. KudiPal detects `BUY_REQUEST` and extracts product, budget, and location.
3. Inventory is searched and sellers are ranked by distance, price, reputation, and response speed.
4. Buyer chooses one of the top 3 sellers.
5. Seller accepts or declines.
6. Paystack payment link is generated.
7. Payment webhook updates the order idempotently and notifies both parties.
8. Automated reminders nudge inactive buyers.

## Local Development

```bash
docker compose up --build
```

Backend:

- API: `http://localhost:8081`
- OpenAPI UI: `http://localhost:8081/swagger-ui.html`
- Health: `http://localhost:8081/actuator/health`

Frontend:

```bash
npm install
npm run dev
```

## Documentation

- [Architecture](docs/architecture/README.md)
- [AI Marketplace Plan](docs/architecture/AI_MARKETPLACE_PLAN.md)
- [Frontend Route Structure](docs/frontend/ROUTE_STRUCTURE.md)
- [API](docs/API.md)
- [Deployment](docs/DEPLOYMENT.md)
- [Security Controls](docs/security/SECURITY_CONTROLS.md)
- [WhatsApp Onboarding](docs/WHATSAPP_ONBOARDING.md)

## Production Notes

Before launch, configure production JWT issuer/JWKS, strict CORS origins, AWS WAF rules, Secrets Manager values, Paystack live keys, Meta WhatsApp app credentials, OpenAI key, and AES-256-GCM PII encryption keys. Run dependency scanning, SAST, container scanning, and a payment-flow security review before enabling live payments.
