import { createFileRoute } from "@tanstack/react-router";
import { applySessionCookies, getCalvennSession } from "../../lib/command-center-auth";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "cache-control": "no-store", "content-type": "application/json; charset=utf-8" },
  });
}

export const Route = createFileRoute("/api/review-url")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const auth = await getCalvennSession(request);
        if (!auth.session)
          return applySessionCookies(json({ configured: false, error: "authentication_required" }, 401), auth.cookies);
        const requestedLocationId = new URL(request.url).searchParams.get("locationId")?.trim();
        if (requestedLocationId && requestedLocationId !== auth.session.locationId)
          return applySessionCookies(json({ configured: false, error: "tenant_mismatch" }, 403), auth.cookies);

        const raw = process.env.COMMAND_CENTER_REVIEW_URLS_JSON?.trim() || "{}";
        let reviewUrl = "";
        try {
          const parsed = JSON.parse(raw) as Record<string, unknown>;
          const value = parsed[auth.session.locationId];
          if (typeof value === "string") reviewUrl = value.trim();
        } catch {
          // Treat an invalid optional mapping as no review link, never as a live link.
        }
        return applySessionCookies(json({ configured: Boolean(reviewUrl), reviewUrl: reviewUrl || null }), auth.cookies);
      },
    },
  },
});
