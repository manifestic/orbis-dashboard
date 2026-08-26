# SaaS provisioning sequence

This is the checkout-to-ready flow for the Manifestic snapshot. Agency OAuth is the default credential path; every new location is provisioned and verified by location before it can report live data. The sequence can still be run manually while the checkout webhook/job is being completed.

1. Checkout creates or identifies the HighLevel sub-account.
2. The approved snapshot is loaded.
3. The AppInstall webhook receives the new location ID and company ID, records the tenant, and exchanges the agency OAuth token for a location-scoped token. For a controlled manual fallback, create a new PIT from inside that exact sub-account with the minimum CRM read scopes; never use the agency PIT or another location's token. `register-command-center-tenant.mjs` remains the manual backfill path while the migration is being applied.
4. The generic dashboard widget and Setup Center menu link are provisioned.
5. The client opens Setup Center and completes text or voice onboarding.
6. Brand discovery creates a reviewable suggestion; the client approves or corrects it.
7. The tenant record moves from `pending` to `brand_review` to `ready`.
8. Native HighLevel connections are verified per location; the Command Center resolves the encrypted OAuth token for that location and refreshes it server-side when needed.
9. A provisioning audit records the snapshot version, widget/menu IDs, readiness checks, and unresolved items.

## Manual PIT fallback contract

- Create the PIT inside the target sub-account.
- Minimum read scopes: `locations.readonly`, `contacts.readonly`, `conversations.readonly`, `calendars.readonly`, `calendars/events.readonly`, `opportunities.readonly`, and `locations/tasks.readonly` when shown in the dashboard.
- Store the token only in the approved secret store under the exact location ID; never place it in chat, Markdown, source control, logs, or widget URLs.
- Verify location, conversations, calendars, opportunities, and tasks read-only before reporting `CONNECTED`.
- If location reads work but CRM reads return `401`, treat the PIT as under-scoped and stop rotating it. Use a correctly scoped location PIT or OAuth/location-token provisioning.

No step should import another client’s contacts, expose another client’s dashboard, send a message, or activate a paid connection automatically.

## Implementation order

1. Prove the disposable test account.
2. Add the agency webhook/job only after the manual sequence passes.
3. Add checkout metadata and coupon/free-test handling.
4. Add voice onboarding using the same tenant record and approval states.

## OAuth provisioning contract

- Marketplace app: private, target user `Sub-account`, agency-only installation, bulk installation enabled.
- Callback: `/api/highlevel-oauth?flow=callback`.
- Webhook: `/api/highlevel-oauth` with HighLevel `X-GHL-Signature` verification.
- Token exchange: the agency OAuth callback stores the agency token; AppInstall or first read-only dashboard access calls `POST /oauth/location-token` for the specific `companyId` and `locationId`.
- Storage: encrypted access/refresh tokens in `command_center_highlevel_oauth`; idempotency in `command_center_highlevel_webhooks`; both tables deny anon/authenticated access through RLS.
- Fail-closed rule: a global credential is never used for another location. The legacy global token is accepted only for `CALVENN_LOCATION_ID` or an explicit `HIGHLEVEL_GLOBAL_TOKEN_LOCATION_ID`.
