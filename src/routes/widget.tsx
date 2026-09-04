import { createFileRoute } from "@tanstack/react-router";
import {
  commandCenterLauncherKeyForLocation,
  createCommandCenterEmbedCookie,
  createCommandCenterEmbedToken,
} from "../lib/command-center-auth";
import { getTenantByLocation } from "../lib/tenant-registry";

function message(body: string, status: number) {
  return new Response(body, {
    status,
    headers: { "cache-control": "no-store", "content-type": "text/plain; charset=utf-8" },
  });
}

/**
 * Stable HighLevel widget launcher.
 *
 * HighLevel stores the widget URL, so saving a signed embed token directly in
 * that URL eventually leaves a tenant with an old secret/signature. This
 * route stores a location-scoped launcher key in HighLevel. The key is not the
 * dashboard bearer token; the server exchanges it for an HttpOnly cookie and
 * carries a short-lived signed fallback only in the redirect fragment when a
 * browser blocks the cross-site iframe cookie. The saved GHL URL never contains
 * the signed token.
 */
export const Route = createFileRoute("/widget")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const source = new URL(request.url);
        const locationId = source.searchParams.get("locationId")?.trim() ?? "";
        if (!locationId) return message("A HighLevel location is required.", 400);

        const expectedKey = commandCenterLauncherKeyForLocation(locationId);
        const suppliedKey = source.searchParams.get("launcherKey")?.trim() ?? "";
        if (!expectedKey || !suppliedKey || suppliedKey !== expectedKey)
          return message("This Command Center link is not authorized for the requested location.", 403);

        const tenant = await getTenantByLocation(locationId);
        if (!tenant) return message("This HighLevel location is not registered.", 404);
        const token = createCommandCenterEmbedToken(locationId, tenant.clientName);
        if (!token) return message("Command Center signing is not configured.", 503);

        const destination = new URL("/dashboard", source.origin);
        destination.searchParams.set("locationId", locationId);
        const section = source.searchParams.get("section")?.trim();
        if (section) destination.searchParams.set("section", section);
        // The fragment is not sent in HTTP requests or referrers. The dashboard
        // reads it only to recover when the iframe cannot retain Set-Cookie.
        destination.hash = `embedToken=${encodeURIComponent(token)}`;
        return new Response(null, {
          status: 302,
          headers: {
            location: destination.toString(),
            "set-cookie": createCommandCenterEmbedCookie(token),
            "cache-control": "no-store, no-cache, must-revalidate",
          },
        });
      },
    },
  },
});
