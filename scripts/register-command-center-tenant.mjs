#!/usr/bin/env node

const args = new Map();
for (let index = 2; index < process.argv.length; index += 1) {
  const value = process.argv[index];
  if (!value?.startsWith("--")) continue;
  args.set(value.slice(2), process.argv[index + 1] ?? "");
  index += 1;
}

const locationId = String(args.get("location-id") ?? "").trim();
const companyId = String(args.get("company-id") ?? "").trim();
const clientName = String(args.get("client-name") ?? "").trim();
const websiteUrl = String(args.get("website-url") ?? "").trim();
if (!locationId || !companyId || !clientName) {
  console.error("Usage: node scripts/register-command-center-tenant.mjs --location-id <id> --company-id <id> --client-name <name> [--website-url <url>]");
  process.exit(2);
}

const baseUrl = (process.env.SUPABASE_URL ?? "").replace(/\/$/, "");
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
if (!baseUrl || !serviceKey) {
  console.error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be available in the environment.");
  process.exit(2);
}

const response = await fetch(`${baseUrl}/rest/v1/command_center_tenants`, {
  method: "POST",
  headers: {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    "Content-Type": "application/json",
    Prefer: "resolution=merge-duplicates,return=representation",
  },
  body: JSON.stringify({
    location_id: locationId,
    company_id: companyId,
    client_name: clientName,
    website_url: websiteUrl || null,
    onboarding_status: "pending",
    updated_at: new Date().toISOString(),
  }),
});

if (!response.ok) {
  console.error(`Tenant registration failed with HTTP ${response.status}.`);
  process.exit(1);
}

console.log(JSON.stringify({
  registered: true,
  locationId,
  clientName,
  onboardingStatus: "pending",
  widgetUrl: "https://orbis-landing-mauve.vercel.app/dashboard",
  setupUrl: "https://orbis-landing-mauve.vercel.app/setup-tile?mode=setup",
}, null, 2));
