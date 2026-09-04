export type TenantBrandProfile = {
  locationId: string;
  companyId?: string;
  clientName: string;
  websiteUrl?: string;
  logoUrl?: string;
  primaryColor?: string;
  accentColor?: string;
  inkColor?: string;
  mutedColor?: string;
  onboardingStatus?: "pending" | "brand_review" | "ready";
};

const TABLE = "command_center_tenants";
const BUILT_IN_TENANT_PROFILES: TenantBrandProfile[] = [
  {
    locationId: "HDgk8bXoo6ZE8BAnxFXr",
    clientName: "Anovite Builder",
    websiteUrl: "https://anovite.com",
    logoUrl: "/assets/anovite-brand-logo.png",
    primaryColor: "#73bff0",
    accentColor: "#1f789f",
    inkColor: "#12344a",
    mutedColor: "#4f6b7b",
    onboardingStatus: "ready",
  },
  {
    locationId: "yI8j40OmqLKKHFdQ1goC",
    clientName: "Adventure North Realty, LLC",
    websiteUrl: "https://jesse-house-quest.lovable.app",
    logoUrl: "/assets/adventure-north-realty-logo.png",
    primaryColor: "#208020",
    accentColor: "#09090f",
    inkColor: "#202020",
    mutedColor: "#526052",
    onboardingStatus: "ready",
  },
];

function supabaseAdminConfig() {
  const url = (process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(
    /\/$/,
    "",
  );
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "";
  return url && key ? { url, key } : null;
}

function envTenants(): TenantBrandProfile[] {
  const candidates: TenantBrandProfile[] = [...BUILT_IN_TENANT_PROFILES];
  const previewLocationId = process.env.COMMAND_CENTER_TEST_LOCATION_ID?.trim() ?? "";
  const previewClientName = process.env.COMMAND_CENTER_TEST_CLIENT_NAME?.trim() ?? "";
  if (previewLocationId && previewClientName)
    candidates.push(
      {
        locationId: previewLocationId,
        clientName: previewClientName,
        onboardingStatus: "pending",
      },
    );
  for (const raw of [
    process.env.COMMAND_CENTER_TENANTS_JSON,
    process.env.COMMAND_CENTER_TENANTS_JSON_EXTRA,
    process.env.COMMAND_CENTER_TENANTS_JSON_BGN,
  ]) {
    if (!raw?.trim()) continue;
    try {
      const parsed = JSON.parse(raw) as unknown;
      const values = Array.isArray(parsed) ? parsed : Object.values(parsed ?? {});
      candidates.push(...values
      .filter((value): value is Record<string, unknown> =>
        Boolean(value && typeof value === "object"),
      )
      .map((tenant) => ({
        locationId: typeof tenant.locationId === "string" ? tenant.locationId.trim() : "",
        companyId: typeof tenant.companyId === "string" ? tenant.companyId.trim() : undefined,
        clientName: typeof tenant.clientName === "string" ? tenant.clientName.trim() : "",
        websiteUrl: typeof tenant.websiteUrl === "string" ? tenant.websiteUrl.trim() : undefined,
        logoUrl: typeof tenant.logoUrl === "string" ? tenant.logoUrl.trim() : undefined,
        primaryColor:
          typeof tenant.primaryColor === "string" ? tenant.primaryColor.trim() : undefined,
        accentColor: typeof tenant.accentColor === "string" ? tenant.accentColor.trim() : undefined,
        inkColor: typeof tenant.inkColor === "string" ? tenant.inkColor.trim() : undefined,
        mutedColor: typeof tenant.mutedColor === "string" ? tenant.mutedColor.trim() : undefined,
        onboardingStatus:
          tenant.onboardingStatus === "ready" || tenant.onboardingStatus === "brand_review"
            ? tenant.onboardingStatus
            : "pending",
      }))
      .filter((tenant) => tenant.locationId && tenant.clientName));
    } catch {
      // Ignore one malformed optional tenant map while preserving other entries.
    }
  }
  return [...new Map(candidates.map((tenant) => [tenant.locationId, tenant])).values()];
}

function normalize(row: Record<string, unknown>): TenantBrandProfile | null {
  const locationId = typeof row.location_id === "string" ? row.location_id.trim() : "";
  const clientName = typeof row.client_name === "string" ? row.client_name.trim() : "";
  if (!locationId || !clientName) return null;
  const onboardingStatus =
    row.onboarding_status === "ready" || row.onboarding_status === "brand_review"
      ? row.onboarding_status
      : "pending";
  return {
    locationId,
    companyId: typeof row.company_id === "string" ? row.company_id.trim() : undefined,
    clientName,
    websiteUrl: typeof row.website_url === "string" ? row.website_url.trim() : undefined,
    logoUrl: typeof row.logo_url === "string" ? row.logo_url.trim() : undefined,
    primaryColor: typeof row.primary_color === "string" ? row.primary_color.trim() : undefined,
    accentColor: typeof row.accent_color === "string" ? row.accent_color.trim() : undefined,
    inkColor: typeof row.ink_color === "string" ? row.ink_color.trim() : undefined,
    mutedColor: typeof row.muted_color === "string" ? row.muted_color.trim() : undefined,
    onboardingStatus,
  };
}

export async function getTenantByLocation(locationId: string): Promise<TenantBrandProfile | null> {
  const normalizedId = locationId.trim();
  if (!normalizedId) return null;
  const config = supabaseAdminConfig();
  if (config) {
    try {
      const response = await fetch(
        `${config.url}/rest/v1/${TABLE}?location_id=eq.${encodeURIComponent(normalizedId)}&select=*&limit=1`,
        {
          headers: { apikey: config.key, Authorization: `Bearer ${config.key}` },
          cache: "no-store",
        },
      );
      if (response.ok) {
        const rows = (await response.json().catch(() => [])) as unknown;
        const record =
          Array.isArray(rows) && rows[0] && typeof rows[0] === "object"
            ? normalize(rows[0] as Record<string, unknown>)
            : null;
        if (record) return record;
      }
    } catch {
      // Environment configuration remains a safe fallback while the registry is unavailable.
    }
  }
  return envTenants().find((tenant) => tenant.locationId === normalizedId) ?? null;
}

export async function saveTenantProfile(profile: TenantBrandProfile): Promise<TenantBrandProfile> {
  const config = supabaseAdminConfig();
  if (!config) throw new Error("The tenant registry is not configured on this deployment.");
  const row = {
    location_id: profile.locationId.trim(),
    company_id: profile.companyId?.trim() || null,
    client_name: profile.clientName.trim(),
    website_url: profile.websiteUrl?.trim() || null,
    logo_url: profile.logoUrl?.trim() || null,
    primary_color: profile.primaryColor?.trim() || null,
    accent_color: profile.accentColor?.trim() || null,
    ink_color: profile.inkColor?.trim() || null,
    muted_color: profile.mutedColor?.trim() || null,
    onboarding_status: profile.onboardingStatus ?? "pending",
    updated_at: new Date().toISOString(),
  };
  const response = await fetch(`${config.url}/rest/v1/${TABLE}`, {
    method: "POST",
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${config.key}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify(row),
  });
  if (!response.ok) throw new Error("The tenant profile could not be saved.");
  const rows = (await response.json().catch(() => [])) as unknown;
  const saved =
    Array.isArray(rows) && rows[0] && typeof rows[0] === "object"
      ? normalize(rows[0] as Record<string, unknown>)
      : null;
  if (!saved) throw new Error("The tenant registry returned no saved profile.");
  return saved;
}
