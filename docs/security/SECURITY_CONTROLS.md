# KudiPal Security Controls

## Application Security

- JWT resource-server authentication protects all APIs except WhatsApp and Paystack webhooks.
- Webhook validation is required for Paystack HMAC signatures and Meta verification tokens.
- Validation uses Jakarta Bean Validation and centralized JSON error handling.
- SQL injection protection is handled through Spring Data JPA parameter binding and Flyway-managed schema.
- Output sent to WhatsApp must be plain text generated from server-side templates, not raw user-controlled markup.
- CSRF is disabled only for stateless JWT APIs; browser session endpoints must use CSRF tokens if added.
- Rate limiting should be enforced at AWS WAF and Redis application counters for webhook and API paths.

## Data Protection

- PII fields should be encrypted before persistence using AES-256-GCM with keys sourced from AWS Secrets Manager or KMS.
- Payment card data is never collected or stored by KudiPal; Paystack-hosted payment links keep the platform out of card data scope.
- PostgreSQL row-level security policies isolate tenant-owned tables by `app.current_tenant_id`.
- Audit logs capture actor, action, resource, before/after JSON, IP address, and user agent.
- Secrets must not be committed. Runtime secrets live in AWS Secrets Manager and local development uses environment variables.

## OWASP Coverage

- Broken access control: tenant-scoped repositories, JWT auth, RLS, and least-privilege AWS IAM.
- Cryptographic failures: TLS everywhere, encrypted RDS storage, AES-256-GCM for PII, no stored card data.
- Injection: ORM binding, validation, and no ad hoc SQL concatenation.
- Insecure design: idempotent payment processing, audit logging, DLQs, and explicit threat boundaries.
- Security misconfiguration: production config is environment-driven; debug logging is off by default.
- Vulnerable components: CI should run dependency review and image scanning before release.
- Identification/auth failures: JWT validation with issuer/JWKS or configured HMAC fallback.
- Software/data integrity failures: GitHub Actions builds immutable containers from reviewed source.
- Logging/monitoring failures: Actuator metrics, CloudWatch logs, Grafana dashboards, Prometheus alerts.
- SSRF: outbound calls are restricted to configured Paystack, Meta, and OpenAI endpoints.

## Enterprise Review Checklist

- Enable AWS WAF managed rules and per-IP throttling on the public load balancer.
- Rotate Paystack, WhatsApp, OpenAI, and PII encryption keys at least quarterly.
- Set strict CORS origins for production dashboards.
- Configure SAST, dependency scanning, secret scanning, and container scanning in CI.
- Run annual penetration tests and payment-flow threat modeling.
