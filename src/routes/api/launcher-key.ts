import { createFileRoute } from "@tanstack/react-router";
import {
  commandCenterLauncherKeyForLocation,
  getCalvennSession,
} from "../../lib/command-center-auth";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "cache-control": "no-store", "content-type": "application/json; charset=utf-8" },
  });
}

export const Route = createFileRoute("/api/launcher-key")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const locationId = new URL(request.url).searchParams.get("locationId")?.trim() ?? "";
        if (!locationId) return json({ error: "location_required" }, 400);
        const result = await getCalvennSession(request);
        if (!result.session || result.session.locationId !== locationId)
          return json({ error: "location_not_authorized" }, 403);
        const launcherKey = commandCenterLauncherKeyForLocation(locationId);
        return launcherKey ? json({ launcherKey }) : json({ error: "launcher_unavailable" }, 503);
      },
    },
  },
});
