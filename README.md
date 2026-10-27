# PYME OS — AI Commerce & Payment Agent

**PayPal AI Hackathon 2026** · open-source source snapshot · PayPal **Sandbox only**

A prototype that prepares small-business quotations using Cloudflare Workers AI for **advice**, requires human authorization for payment-related actions, and integrates PayPal REST Orders v2 with D1 audit records.

**Current status (27 Oct 2026):** The corresponding Cloudflare Worker has been deployed with D1 and AI bindings. Private PayPal Sandbox app credentials and verified end-to-end buyer approval/capture have **not** been connected or observed. No real money, commercial earnings or completed payment proof is claimed.

## Public demonstration

Worker: https://pyme-os-paypal-ai-hackathon.manuel-gago-eduextrem.workers.dev/

Check infrastructure: `/api/health` (status indicators only; not evidence of successful payments).

The HTML dashboard is embedded in `src/worker.mjs`; this branch contains a **retrieved source snapshot of the deployed Worker**, not the earlier independent Vite frontend experiment. The business-domain idea originates in PYME OS, but this hackathon branch is isolated from the foundation project.

## Key capabilities in source

- Authenticated quotation CRUD subset: create and list quotations with exact EUR-cent validation.
- Cloudflare D1 persistence: quotes, audit events and webhook ID in `integration_settings`.
- Real Workers AI inference: service-scope suggestions; human sets price.
- PayPal Sandbox OAuth 2.0, Orders v2 creation, explicit capture request after buyer approval.
- Checked PayPal signature verification via the official webhook verification API.
- Idempotent capture/order request IDs and duplicate webhook-event guard.
- Administrator-protected endpoint to register a Sandbox webhook using PayPal REST API.
- Failure states are reported; no fabricated payment, AI or revenue responses.

## Getting started (Cloudflare Workers)

Prerequisites: Cloudflare account with Workers, D1 and Workers AI; a PayPal **Sandbox merchant application**; a **Sandbox buyer** account. Never enter Live credentials. Local tooling uses Wrangler; **runtime does not run Node.js**.

```sh
npm install
cp .dev.vars.example .dev.vars
# Edit .dev.vars locally, never commit it
npx wrangler d1 migrations apply DB --local
npx wrangler dev
```

In `wrangler.jsonc`, replace the example D1 UUID with the ID of a database in your own Cloudflare account if you are forking. The configuration currently points to the project's pre-created EU D1 database.

Deploy with `npx wrangler deploy` after setting bindings and protected secrets:

```sh
npx wrangler secret put ADMIN_API_KEY
npx wrangler secret put PAYPAL_CLIENT_ID
npx wrangler secret put PAYPAL_CLIENT_SECRET
npx wrangler deploy
```

Required: `ADMIN_API_KEY` (random 16+ character secret), `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET` from the **Sandbox** application. The registered PayPal webhook ID can be stored in D1 through the administrator-only `POST /api/paypal/register-webhook` route, or set with `npx wrangler secret put PAYPAL_WEBHOOK_ID`.

## API

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | Responsive dashboard |
| GET | `/api/health` | Configuration indicators |
| GET | `/api/quotes` | Protected list of quotes |
| POST | `/api/quotes` | Protected quote creation (`customer`, `description`, `amount: "25.00"`) |
| GET | `/api/events` | Protected audit history |
| POST | `/api/ai/suggest` | Genuine AI service-scope inference |
| POST | `/api/quotes/:id/order` | Sandbox order creation, `{"confirm":true}` |
| POST | `/api/quotes/:id/capture` | Sandbox capture, `{"confirm":true}` |
| POST | `/api/paypal/register-webhook` | Register/reuse webhook in Sandbox |
| POST | `/api/paypal/webhook` | Verify signed PayPal event |

The protected routes require `Authorization: Bearer <ADMIN_API_KEY>`. Keep this key private and do not include it in Devpost screenshots, video descriptions or repository files.

## Payment demo workflow (requires Sandbox setup)

Create and review a quotation -> authorize PayPal Sandbox order -> follow PayPal approval URL using a **Sandbox buyer** -> explicitly capture approved order -> inspect PayPal response and D1 event trail -> check webhook delivery in Developer Dashboard.

PayPal transactions on Sandbox are not payments from real customers. The public demonstration requires authorized test credentials; reviewers can alternatively deploy a fork with their own Sandbox app.

## Technical stack

Cloudflare Workers (ES modules), JavaScript and embedded HTML/CSS frontend, Cloudflare D1 (SQLite), Cloudflare Workers AI, PayPal REST API / OAuth 2.0 / Orders v2 / Webhook Verify API. This deployed snapshot is **not built with Vite**; the separately drafted Vite UI is not presented as this deployment's source.

## Limitations

No live payment mode, multi-tenant user accounts, production hardening or operational revenue claims. End-to-end tests, authenticated live HTTP validation, abuse prevention and accessible judge-demo accounts remain incomplete. Before commercial use, add tenant isolation, reconciliation after capture failures, transactional concurrency protection, CSRF defenses, rate limiting, logging redaction and security review.

See [STATUS.md](STATUS.md). Licensed under [MIT](LICENSE).
