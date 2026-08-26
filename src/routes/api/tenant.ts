import { createFileRoute } from "@tanstack/react-router";
import { applySessionCookies, getCalvennSession } from "../../lib/command-center-auth";
import {
  getTenantByLocation,
  saveTenantProfile,
  type TenantBrandProfile,
} from "../../lib/tenant-registry";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "cache-control": "no-store", "content-type": "application/json; charset=utf-8" },
  });
}

function safeWebsiteUrl(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    const host = url.hostname.toLowerCase();
    if (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "0.0.0.0" ||
      host === "::1" ||
      host.endsWith(".local") ||
      host.startsWith("10.") ||
      host.startsWith("192.168.") ||
      /^172\.(1[6-9]|2\d|3[0-1])\./.test(host)
    )
      return null;
    return url;
  } catch {
    return null;
  }
}

function firstMatch(html: string, patterns: RegExp[]) {
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return match[1].replace(/&amp;/g, "&").trim();
  }
  return "";
}

async function discoverBrand(websiteUrl: string) {
  const url = safeWebsiteUrl(websiteUrl);
  if (!url) throw new Error("Enter a public http(s) website URL.");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "User-Agent": "Manifestic-Brand-Discovery/1.0",
      },
    });
    if (!response.ok) throw new Error(`The website returned ${response.status}.`);
    const html = (await response.text()).slice(0, 2_000_000);
    const title = firstMatch(html, [/<title[^>]*>([^<]+)<\/title>/i]);
    const logoUrl = firstMatch(html, [
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
      /<link[^>]+rel=["'][^"']*icon[^"']*["'][^>]+href=["']([^"']+)["']/i,
    ]);
    const themeColor = firstMatch(html, [
      /<meta[^>]+name=["']theme-color["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']theme-color["']/i,
    ]);
    return {
      websiteUrl: url.toString(),
      title,
      logoUrl: logoUrl ? new URL(logoUrl, url).toString() : "",
      primaryColor: /^#[0-9a-f]{3,8}$/i.test(themeColor) ? themeColor : "",
      status: "review_required" as const,
    };
  } finally {
    clearTimeout(timeout);
  }
}

export const Route = createFileRoute("/api/tenant")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const auth = await getCalvennSession(request);
        if (!auth.session)
          return applySessionCookies(json({ error: "authentication_required" }, 401), auth.cookies);
        const profile = await getTenantByLocation(auth.session.locationId);
        return applySessionCookies(
          json({
            profile: profile ?? {
              locationId: auth.session.locationId,
              companyId: auth.session.companyId,
              clientName: auth.session.clientName,
              onboardingStatus: "pending",
            },
          }),
          auth.cookies,
        );
      },
      POST: async ({ request }) => {
        const auth = await getCalvennSession(request);
        if (!auth.session)
          return applySessionCookies(json({ error: "authentication_required" }, 401), auth.cookies);
        let body: { action?: unknown; websiteUrl?: unknown } = {};
        try {
          body = (await request.json()) as typeof body;
        } catch {
          /* validation below */
        }
        if (body.action !== "discover_brand")
          return applySessionCookies(json({ error: "unsupported_action" }, 400), auth.cookies);
        try {
          return applySessionCookies(
            json({ discovery: await discoverBrand(String(body.websiteUrl ?? "")) }),
            auth.cookies,
          );
        } catch (error) {
          return applySessionCookies(
            json(
              {
                error: "brand_discovery_failed",
                message: error instanceof Error ? error.message : "Brand discovery failed.",
              },
              422,
            ),
            auth.cookies,
          );
        }
      },
      PUT: async ({ request }) => {
        const auth = await getCalvennSession(request);
        if (!auth.session)
          return applySessionCookies(json({ error: "authentication_required" }, 401), auth.cookies);
        let body: Partial<TenantBrandProfile> = {};
        try {
          body = (await request.json()) as Partial<TenantBrandProfile>;
        } catch {
          return applySessionCookies(json({ error: "invalid_json" }, 400), auth.cookies);
        }
        if (body.locationId && body.locationId !== auth.session.locationId)
          return applySessionCookies(json({ error: "tenant_mismatch" }, 403), auth.cookies);
        const profile: TenantBrandProfile = {
          locationId: auth.session.locationId,
          companyId: auth.session.companyId,
          clientName:
            typeof body.clientName === "string" && body.clientName.trim()
              ? body.clientName.trim()
              : auth.session.clientName,
          websiteUrl: safeWebsiteUrl(body.websiteUrl)?.toString(),
          logoUrl: typeof body.logoUrl === "string" ? body.logoUrl.trim() : undefined,
          primaryColor:
            typeof body.primaryColor === "string" ? body.primaryColor.trim() : undefined,
          accentColor: typeof body.accentColor === "string" ? body.accentColor.trim() : undefined,
          inkColor: typeof body.inkColor === "string" ? body.inkColor.trim() : undefined,
          mutedColor: typeof body.mutedColor === "string" ? body.mutedColor.trim() : undefined,
          onboardingStatus: body.onboardingStatus === "ready" ? "ready" : "brand_review",
        };
        try {
          return applySessionCookies(
            json({ profile: await saveTenantProfile(profile) }),
            auth.cookies,
          );
        } catch (error) {
          return applySessionCookies(
            json(
              {
                error: "tenant_profile_not_configured",
                message:
                  error instanceof Error ? error.message : "Tenant profile could not be saved.",
              },
              503,
            ),
            auth.cookies,
          );
        }
      },
    },
  },
});
