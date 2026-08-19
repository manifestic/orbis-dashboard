import { createFileRoute } from "@tanstack/react-router";
import {
  applySessionCookies,
  authConfigStatus,
  clearSessionCookies,
  getCalvennSession,
  loginCalvenn,
} from "../../lib/command-center-auth";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "cache-control": "no-store", "content-type": "application/json; charset=utf-8" },
  });
}

export const Route = createFileRoute("/api/auth")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const result = await getCalvennSession(request);
          if (!result.session)
            return applySessionCookies(
              json({ authenticated: false, auth: authConfigStatus() }, 401),
              result.cookies,
            );
          return applySessionCookies(
            json({
              authenticated: true,
              user: {
                id: result.session.id,
                email: result.session.email,
                displayName: result.session.displayName,
                clientName: result.session.clientName,
              },
            }),
            result.cookies,
          );
        } catch (error) {
          return json(
            {
              authenticated: false,
              error: "auth_unavailable",
              message: error instanceof Error ? error.message : "Authentication is unavailable.",
            },
            503,
          );
        }
      },
      POST: async ({ request }) => {
        let body: { action?: unknown; email?: unknown; password?: unknown } = {};
        try {
          body = (await request.json()) as typeof body;
        } catch {
          /* fall through to validation */
        }
        if (body.action === "logout")
          return applySessionCookies(json({ authenticated: false }), clearSessionCookies());
        if (
          typeof body.email !== "string" ||
          typeof body.password !== "string" ||
          !body.email.trim() ||
          !body.password
        )
          return json({ error: "email_and_password_required" }, 400);
        try {
          const result = await loginCalvenn(body.email.trim(), body.password);
          if (!result.ok)
            return json(
              { authenticated: false, error: "invalid_login", message: result.message },
              401,
            );
          return applySessionCookies(
            json({
              authenticated: true,
              user: {
                id: result.user.id,
                email: result.user.email,
                displayName: result.user.displayName,
                clientName: result.user.clientName,
              },
            }),
            result.cookies,
          );
        } catch (error) {
          return json(
            {
              authenticated: false,
              error: "auth_unavailable",
              message: error instanceof Error ? error.message : "Authentication is unavailable.",
            },
            503,
          );
        }
      },
    },
  },
});
