# Manifestic tenant provisioning runbook

Status: implementation draft · Owner: Erik / Manifestic · Review: before production rollout

## Purpose

Create a repeatable path from a new HighLevel sub-account to a tenant-scoped Manifestic Command Center without copying another client’s identity, data, branding, credentials, or menu configuration.

## Required sequence

1. Create the sub-account from the approved reusable snapshot. Record the snapshot name/version and the new HighLevel location ID.
2. Keep the account synthetic or empty until the provisioning check passes. Do not attach a paid add-on, import contacts, or connect a client mailbox during this test.
3. Create the location record in `command_center_tenants` with the location ID, company ID, client name, and `onboarding_status = 'pending'`.
4. Set the HighLevel dashboard widget to the stable tenant launcher URL:
   `https://orbis-landing-mauve.vercel.app/widget?locationId=<EXACT_LOCATION_ID>&launcherKey=<ROTATABLE_LOCATION_KEY>`
   The launcher rejects a bare location ID, validates the location-scoped key server-side, and exchanges it for an HttpOnly fresh signed handoff. Never save a URL containing a client name, review key, or signed embed token, and never record the launcher key in chat, docs, source, or logs.
   Before declaring the widget ready, compare the key in the saved GHL URL with the server-side key resolver for that exact location. A `403` or “not authorized for the requested location” means the launcher-key map is out of sync; repair the tenant-scoped secret override or rotate the saved URL, then reload and re-test. Do not weaken the check to accept any key for a registered location.
5. Add six location-specific custom menu entries—Content Review, Deliverables, Documents, Intelligence, Support, and Voice AI—using the same stable launcher plus the appropriate section query. Keep each client’s six rows assigned only to that client; do not make one Calvenn URL serve Jesse.
6. Open the new account and confirm the embedded dashboard requests the active HighLevel signed context. The saved main widget must use the stable launcher—not a static `/dashboard?...&embedToken=` URL. Confirm the iframe, live-data links, and tenant registry all resolve to the new location.
7. Run onboarding:
   - confirm business name, website, service area, timezone, primary CTA, and contact details;
   - scan the website for title, `og:image`, favicon, and theme color;
   - let the owner approve or correct the logo and colors;
   - use the upload fallback when discovery does not find a usable logo;
   - save as `brand_review`, then mark `ready` only after human approval.
8. Configure native HighLevel connections and permissions one at a time. Verify each connection in the new location before enabling an automation.
9. Verify the left menu, dashboard widget, branding, and empty-state behavior after refresh and location switch. Use the in-app browser to click all six custom entries and verify the target tenant, section, and no-login result. A bare location-only launcher must return an authorization failure.
   For Content Review specifically, confirm the command-center top navigation (Getting Started, Dashboard, Inbox, Calendar, Opportunities, Content Review, Web & Insights), all seven visible in one row with `scrollWidth === clientWidth`, `Live HighLevel data`, and one nested private review workspace for the same tenant/agent and active batch. The shell loading by itself is not sufficient.
10. Record every pass/fail result in the client `PROJECT.md`, including evidence, missing assets, and the next gate. Never report `READY` from a saved form, deployment, or URL readback alone.

## Scalable HighLevel credential path

Use the agency OAuth path as the default for reusable onboarding. Each new location is exchanged for a location-scoped token and must pass a read-only location identity check before the dashboard reports `CONNECTED`. A location PIT is the controlled manual fallback and must always be created from inside the target sub-account; never use the agency PIT for client CRM reads and never reuse a PIT across locations.

When creating a location PIT, select the minimum read-only dashboard scopes: `locations.readonly`, `contacts.readonly`, `conversations.readonly`, `calendars.readonly`, `calendars/events.readonly`, `opportunities.readonly`, and `locations/tasks.readonly` when tasks are displayed. Store the value only in the approved server-side secret store keyed by the exact location ID. Do not paste it into chat, source files, logs, browser URLs, or the reusable snapshot. Verify location, conversations, calendars, opportunities, and tasks read-only before marking the tenant connected. A location `200` plus CRM `401` means the PIT is valid but under-scoped; stop rotating and create a correctly scoped location PIT or use OAuth.

1. Create a private HighLevel Marketplace app targeted at `Sub-account`, installable by `Agency only`, with bulk installation enabled. Request only the read scopes required by the dashboard.
2. Configure the app callback as `https://orbis-landing-mauve.vercel.app/api/highlevel-oauth?flow=callback`.
3. Configure the AppInstall webhook as `https://orbis-landing-mauve.vercel.app/api/highlevel-oauth`.
4. Store the app client ID, client secret, OAuth scopes, callback URI, state secret, and encryption secret only as server-side deployment variables. Never put access or refresh tokens in browser code, a widget URL, logs, chat, or source control.
5. Start the one-time agency installation at `/api/highlevel-oauth?flow=start`. The callback stores the agency access/refresh pair encrypted in Supabase.
6. On each AppInstall event, verify the HighLevel signature, record the webhook ID idempotently, call HighLevel `POST /oauth/location-token` with the new `companyId` and `locationId`, and store the returned location access/refresh pair encrypted.
7. If a webhook is delayed, the first read-only dashboard request performs the same location-token exchange on demand. Existing tenant profiles are never overwritten; new locations begin as `pending` until onboarding supplies approved brand data.
8. Refresh expiring tokens server-side. OAuth access tokens are short-lived; the refresh token is rotated and replaced atomically in the secure store.

Required server variables for the OAuth path: `HIGHLEVEL_OAUTH_CLIENT_ID`, `HIGHLEVEL_OAUTH_CLIENT_SECRET`, `HIGHLEVEL_OAUTH_REDIRECT_URI`, `HIGHLEVEL_OAUTH_SCOPES`, `HIGHLEVEL_OAUTH_STATE_SECRET`, `COMMAND_CENTER_OAUTH_ENCRYPTION_KEY`, `SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY`.

The OAuth tables are defined in `supabase/migrations/20260824_command_center_highlevel_oauth.sql`. The migration must be applied before installing the app or accepting the webhook. Until then, the dashboard must remain honestly unavailable for locations without an explicit scoped server credential.

## Acceptance checks

- No rendered page or link contains Calvenn’s location ID when the active location is another tenant.
- No dashboard API request uses a location ID different from the authenticated session.
- No client gets another tenant’s logo, review URL, content batch, conversation, pipeline, or credentials.
- The widget is present after a fresh login and after switching locations.
- The saved widget URL is the stable `/widget?locationId=...&launcherKey=...` launcher, not a stale `/dashboard?...&embedToken=...` URL. The launcher key is rotatable and location-scoped.
- A fresh authorized load of the launcher redirects to a dashboard without putting the bearer token in the URL, and the rendered dashboard is authenticated without a second login. A bare location-only launcher is rejected.
- All six client-specific menu rows are present, assigned to the intended account, and click-tested in the app browser; a second client remains unchanged.
- The launcher key embedded in the saved GHL URL matches the server-side tenant resolver, and the authorized load does not show a location authorization error.
- The Content Review module resolves a tenant-scoped review URL/key and active batch; review keys are stored only in a sensitive server-side map or per-tenant override.
- A six-family default pack has 18 distinct media URLs, three per family, mapped to stable content IDs and verified against the client manifest/contact sheet. If an owner rejects post-composited overlays, replace media in place with the approved clean or model-integrated-text asset and increment only the media version; do not create a duplicate queue.
- Setup Center clearly shows whether branding is pending, under review, or approved.
- Live data remains honestly unavailable until a scoped HighLevel credential is provisioned.
- OAuth connections and webhook records are server-only and protected by RLS; the browser receives only tenant-scoped data.

## Production gates

- Apply the Supabase migration and configure the service-role key on the server; never put it in browser code.
- Decide whether the production launcher uses HighLevel signed context through the Manifestic white-label origin or a server-side agency OAuth path.
- Add a scoped token/OAuth path for each location before claiming live data readiness.
- Apply the tenant and OAuth migrations before configuring the Marketplace callback/webhook.
- Complete the first agency installation and verify the disposable location through a read-only dashboard refresh.
- Test the generic widget on the disposable account first; then update Calvenn only after the test passes.
- Deployment and live HighLevel widget changes require Erik’s explicit approval.
