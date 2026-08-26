# Client onboarding specification

## Outcome

A new client should enter a prepared HighLevel sub-account, approve their business identity, and understand what is ready without manually rebuilding the workspace.

## Two entry modes

- Guided text: short steps with save/resume state.
- Guided voice: the same questions read and answered conversationally; voice is an interface choice, not a second data model.

## Questions and sources

| Area                                     | First source                                      | Owner approval |
| ---------------------------------------- | ------------------------------------------------- | -------------- |
| Business name and website                | checkout/sub-account record                       | Yes            |
| Logo                                     | website `og:image`, favicon, then upload fallback | Yes            |
| Colors                                   | website theme color plus sampled brand palette    | Yes            |
| Services and service area                | website and client answers                        | Yes            |
| Primary CTA                              | client answer                                     | Yes            |
| Time zone and business hours             | location record, then client confirmation         | Yes            |
| Calendar, email, SMS, social connections | native HighLevel setup                            | Yes            |
| AI tone and claims                       | client interview and approved source files        | Yes            |

## State model

`pending → brand_review → ready`

No onboarding draft may publish content, send a message, change permissions, or activate a paid connection. Each location has its own record keyed by HighLevel `location_id`.

## Current implementation

- Tenant registry: `command_center_tenants`.
- Server-side brand discovery: `POST /api/tenant` with `action = discover_brand`.
- Tenant profile read/save: `GET /api/tenant` and `PUT /api/tenant`.
- Client surface: `/setup-tile?mode=setup`.
- Dashboard identity: authenticated HighLevel context plus the tenant registry; query-string client identity is not trusted for data access.

## Future additions

- Secure logo upload to a private tenant-scoped storage path.
- Voice interview adapter using the approved voice provider.
- Agency post-checkout webhook that creates the tenant record and queues the Setup Center.
- Provisioning audit record with snapshot version, menu/widget IDs, connection checks, and approval timestamps.
