import { createFileRoute } from "@tanstack/react-router";
import {
  completeHighLevelOAuth,
  handleHighLevelWebhook,
  highLevelOAuthInstallUrl,
} from "../../lib/highlevel-oauth";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "cache-control": "no-store", "content-type": "application/json; charset=utf-8" },
  });
}

export const Route = createFileRoute("/api/highlevel-oauth")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        if (url.searchParams.get("flow") === "start") {
          try {
            return Response.redirect(highLevelOAuthInstallUrl(), 302);
          } catch (error) {
            return json(
              {
                error: "oauth_not_configured",
                message:
                  error instanceof Error ? error.message : "HighLevel OAuth is not configured.",
              },
              503,
            );
          }
        }
        const code = url.searchParams.get("code")?.trim() ?? "";
        const state = url.searchParams.get("state")?.trim() ?? "";
        if (!code || !state) return json({ error: "oauth_callback_missing_parameters" }, 400);
        try {
          await completeHighLevelOAuth(code, state);
          return Response.redirect(new URL("/setup-tile?oauth=connected", url.origin), 303);
        } catch (error) {
          return json(
            {
              error: "oauth_callback_failed",
              message:
                error instanceof Error ? error.message : "HighLevel OAuth could not be completed.",
            },
            502,
          );
        }
      },
      POST: async ({ request }) => {
        const rawBody = await request.text();
        try {
          const result = await handleHighLevelWebhook(
            rawBody,
            request.headers.get("x-ghl-signature") ?? "",
            request.headers.get("x-wh-signature") ?? "",
          );
          return json(result);
        } catch {
          return json({ error: "invalid_highlevel_webhook" }, 401);
        }
      },
    },
  },
});
