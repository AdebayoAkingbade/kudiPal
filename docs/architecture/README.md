# KudiPal Architecture

KudiPal is a WhatsApp-first commerce and business operating system for African SMEs. The backend is a Java 21 Spring Boot 3 service backed by PostgreSQL, Redis, AWS SQS, Paystack, Meta WhatsApp Cloud API, and OpenAI structured outputs.

## System Context

```mermaid
flowchart LR
    Buyer[Buyer on WhatsApp] --> Meta[Meta WhatsApp Cloud API]
    Seller[Seller on WhatsApp] --> Meta
    Meta --> API[KudiPal Backend]
    API --> OpenAI[OpenAI structured intent extraction]
    API --> Postgres[(RDS PostgreSQL)]
    API --> Redis[(ElastiCache Redis)]
    API --> SQS[AWS SQS queues]
    API --> Paystack[Paystack]
    Paystack --> API
    API --> CloudWatch[CloudWatch logs and metrics]
```

## Buyer Journey

```mermaid
sequenceDiagram
    participant B as Buyer
    participant W as WhatsApp
    participant K as KudiPal
    participant AI as OpenAI
    participant DB as PostgreSQL
    participant P as Paystack
    participant S as Seller

    B->>W: I want timberland brown shoe, budget 35000, Lekki
    W->>K: Webhook
    K->>AI: Structured intent request
    AI-->>K: BUY_REQUEST JSON
    K->>DB: Search and rank inventory
    K-->>B: Top 3 sellers
    B->>K: Select seller
    K-->>S: New customer request
    S->>K: Accept
    K->>P: Initialize transaction
    P-->>K: Payment link
    K-->>B: Payment link
    P->>K: charge.success webhook
    K->>DB: Idempotent payment update
    K-->>B: Payment confirmed
    K-->>S: Payment confirmed
```

## Ranking

Seller ranking uses:

- 40 percent distance or location fit
- 30 percent price fit
- 20 percent reputation
- 10 percent response speed

Product relevance is a filter before scoring so unrelated inventory does not rank simply because it is nearby or cheap.

## Scale Notes

The target scale of 1 million SMEs requires tenant-aware data access, partitioning hot event tables by month at higher volume, SQS decoupling for webhook bursts, Redis-backed rate limits, read replicas for analytics, and asynchronous insight generation.
