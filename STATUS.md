# Source and deployment evidence — 2026-10-27

- This branch is an isolated hackathon source snapshot in a **public** pre-existing business-architecture repository. It is not the repository's default branch.
- Source was retrieved from Cloudflare's active ES-module Worker endpoint on the preparation date; not reconstructed from screenshots.
- The deployed Worker name is `pyme-os-paypal-ai-hackathon`.
- D1 database is `pyme-os-paypal-hackathon-db`, jurisdiction EU, with quotes, audit, webhooks and integration-settings tables.
- D1 and Workers AI bindings have been verified through Cloudflare's configuration API.
- Cloudflare accepted source upload and reported the production deployment receiving 100% of Worker traffic.
- No PayPal Sandbox credentials are configured on the Worker at the time of preparation. PayPal API calls and signed webhook deliveries are **not independently verified**.
- Generated UI images in Devpost are conceptual, not screenshots of completed financial operations.
- No secret values are committed. All keys must be configured as Worker secrets or local ignored files.
- GitHub branch's purpose is reproducible source and review; prior foundation architecture remains unchanged on its default branch.
