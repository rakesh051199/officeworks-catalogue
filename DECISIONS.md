# Decisions and assumptions

## Assumptions where the brief was unclear

- **Featured products** are the five highest-rated catalogue items, ranked by `rating.rate` then `rating.count`. The entrepreneur “chooses” them by that rule rather than a CMS flag, because Fake Store has no featured field.
- **Category pages** use the same ranking. The first three products are “top rated”; the rest are “additional”. Three is a judgement call so a typical Fake Store category (about four items) still shows both sections when possible.
- **Search** is a case-insensitive substring match on title and description. Category name is not searched, so results stay about the product itself. An empty term is a 400, not “return everything”.
- **Enquiry** collects name, email, optional phone, and a message. The sales inbox receives one email that includes the product id and title. The customer sees an in-app “Thank you” page. There is no customer confirmation email (that would need a real provider and invite spam/abuse in a PoC).
- **Look and feel** is a simple tokenised theme, not a branded storefront. Creative work is still incoming; tokens (`--accent`, `--bg`) are the seam for later design.

## Requirements dropped or simplified

- No authentication, cart, checkout, or persistence. Out of the MVP acceptance criteria.
- No pagination. Fake Store’s catalogue is small enough to load in one request.
- No production AWS deploy or IaC. Compose is local-only; adapters stay host-agnostic so SES/ECS can land later without rewriting the app.
- No end-to-end browser suite. Backend HTTP tests plus a few React tests cover the critical path inside the time-box.

## How this can grow past the PoC

- Replace `FakeStoreProductSource` with a database or PIM adapter; ranking and search stay in domain code (or move behind the same port if search becomes Elasticsearch).
- Replace `SmtpEmailProvider` with SES (or any provider) without changing enquiry validation or the UI.
- Swap CSS tokens or the React client without changing the API contract.
- Add auth, CMS-managed featured flags, and enquiry storage as new modules beside the existing ports.

## What I would do with another day

- Persist enquiries and add a tiny sales inbox view.
- Cache Fake Store responses and add a health check that fails if the source is down.
- Let merchandisers pin featured products instead of deriving them from rating.
- Add Playwright coverage for the enquiry path against Mailpit.
- Sketch an AWS deploy: ECS/Fargate for API, CloudFront for the web app, SES for email.
