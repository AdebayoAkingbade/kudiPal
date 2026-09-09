# AI Marketplace Plan

This is the working direction for KudiPal's WhatsApp-first marketplace.

## Buyer Language

Supported request families should include:

- Product search: `I want a brown timberland shoe vendor close to me`.
- Service search: `I need a woman that can serve as my laundry agent`.
- Errand search: `I need an erand boy`.

The NLP layer should extract intent, item or service, attributes, budget, urgency, typed location, and whether a WhatsApp location pin is required.

## Retrieval And Ranking

RAG should retrieve from:

- Seller inventory and service listings.
- Seller coverage areas and live availability.
- Location coordinates and delivery radius.
- Reviews, complaints, dispute history, and successful fulfillment outcomes.
- Seller policies such as pickup, delivery, refund, and payment rules.

Ranking should combine semantic relevance, geospatial distance, price fit, availability, trust score, response speed, and payment safety.

## Harness Engineering

Keep a golden dataset of real and synthetic WhatsApp messages, expected slots, expected safety decisions, and acceptable seller rankings. Every prompt, parser, retrieval rule, and ranking change should run against this harness before release.

The existing backend already stores training examples and exports a JSONL dataset at `/api/marketplace/ops/dataset`.

## Loop Engineering

The core loops are:

- Buyer loop: request, location, options, choice, payment, delivery confirmation.
- Seller loop: availability check, accept or decline, fulfillment note, completion.
- Trust loop: outcome, rating, complaint, refund, risk scoring.
- AI loop: failed extraction, corrected extraction, prompt versioning, retrieval tuning, regression testing.

## Next Backend Slice

The current backend has text-based matching. The next production-quality slice should add:

- WhatsApp location message handling.
- Latitude and longitude on marketplace entities.
- PostGIS or earth-distance indexing.
- Service listings for laundry agents and errand runners, not only products.
- Distance-aware ranking tests.
