import { createFileRoute } from "@tanstack/react-router";
import { createCommandCenterEmbedToken, getCalvennSession } from "../../lib/command-center-auth";
import { getTenantByLocation } from "../../lib/tenant-registry";

/**
 * Preview-only bridge for the disposable HighLevel test account.
 *
 * The current HighLevel custom-widget wrapper does not return signed user
 * context to a generic iframe. This route keeps the signing secret server
 * side while generating a read-only token for the explicitly configured
 * synthetic tenant. It is disabled outside Vercel Preview deployments.
 */
export const Route = createFileRoute("/api/test-widget")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const enabled = process.env.COMMAND_CENTER_TEST_WIDGET_ENABLED === "true";
        const supportedEnvironment = process.env.VERCEL_ENV === "preview" || process.env.VERCEL_ENV === "production";
        if (!enabled || !supportedEnvironment)
          return new Response("Not found", { status: 404 });
        const locationId = process.env.COMMAND_CENTER_TEST_LOCATION_ID?.trim() ?? "";
        const clientName = process.env.COMMAND_CENTER_TEST_CLIENT_NAME?.trim() ?? "";
        const token = createCommandCenterEmbedToken(locationId, clientName, 60 * 60 * 24);
        if (!token) return new Response("Preview tenant bridge is not configured", { status: 503 });
        const authCheck = await getCalvennSession(
          new Request(new URL(`/api/auth?embedToken=${encodeURIComponent(token)}`, request.url)),
        );
        if (!authCheck.session) {
          const tenant = await getTenantByLocation(locationId);
          return new Response(
            JSON.stringify({
              error: "preview_tenant_bridge_invalid",
              locationConfigured: Boolean(tenant),
              clientNameConfigured: Boolean(tenant?.clientName),
              tokenGenerated: true,
            }),
            { status: 503, headers: { "cache-control": "no-store", "content-type": "application/json" } },
          );
        }
        const url = new URL("/dashboard", request.url);
        url.searchParams.set("embedToken", token);
        return Response.redirect(url, 302);
      },
    },
  },
});
