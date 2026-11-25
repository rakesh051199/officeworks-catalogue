# Agent instructions

This is a take-home product catalogue PoC.

- Keep the client talking only to this backend. Do not call Fake Store from the frontend.
- Product ranking, search matching, and enquiry validation belong in the backend domain layer.
- Swap product data and email through `ProductSource` and `EmailProvider` ports, not by rewriting routes or UI.
- Do not add paid third-party accounts. Local email goes through Mailpit.
- Do not commit secrets. Use `.env.example`.
- Prefer a small, explainable change over extra features.
