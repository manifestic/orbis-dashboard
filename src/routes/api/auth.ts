import { createFileRoute } from "@tanstack/react-router";
import {
  applySessionCookies,
  authConfigStatus,
  clearSessionCookies,
  getCalvennSession,
  loginHighLevelContext,
  loginCalvenn,
  revokeCalvennSession,
} from "../../lib/command-center-auth";

const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const ATTEMPT_WINDOW_MS = 60_000;
const MAX_ATTEMPTS_PER_WINDOW = 8;

function requestKey(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  ).slice(0, 120);
}

function loginRateLimit(request: Request) {
  const now = Date.now();
  const key = requestKey(request);
  const current = loginAttempts.get(key);
  if (!current || current.resetAt <= now) {
    loginAttempts.set(key, { count: 1, resetAt: now + ATTEMPT_WINDOW_MS });
    return { allowed: true, retryAfter: 0 };
  }
  if (current.count >= MAX_ATTEMPTS_PER_WINDOW)
    return { allowed: false, retryAfter: Math.ceil((current.resetAt - now) / 1000) };
  current.count += 1;
  return { allowed: true, retryAfter: 0 };
}

function clearLoginRateLimit(request: Request) {
  loginAttempts.delete(requestKey(request));
}

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
                locationId: result.session.locationId,
                role: result.session.role,
                capabilities: result.session.capabilities,
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
        let body: {
          action?: unknown;
          email?: unknown;
          password?: unknown;
          encryptedData?: unknown;
        } = {};
        try {
          body = (await request.json()) as typeof body;
        } catch {
          /* fall through to validation */
        }
        if (body.action === "logout") {
          await revokeCalvennSession(request);
          return applySessionCookies(json({ authenticated: false }), clearSessionCookies());
        }
        if (body.action === "highlevel_context") {
          if (typeof body.encryptedData !== "string" || !body.encryptedData.trim())
            return json({ authenticated: false, error: "signed_context_required" }, 400);
          const result = await loginHighLevelContext(body.encryptedData);
          if (!result.ok)
            return json(
              { authenticated: false, error: "invalid_signed_context", message: result.message },
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
                locationId: result.user.locationId,
                role: result.user.role,
                capabilities: result.user.capabilities,
              },
            }),
            result.cookies,
          );
        }
        if (
          typeof body.email !== "string" ||
          typeof body.password !== "string" ||
          !body.email.trim() ||
          !body.password
        )
          return json({ error: "email_and_password_required" }, 400);
        const rateLimit = loginRateLimit(request);
        if (!rateLimit.allowed)
          return new Response(
            JSON.stringify({ authenticated: false, error: "too_many_attempts" }),
            {
              status: 429,
              headers: {
                "cache-control": "no-store",
                "content-type": "application/json; charset=utf-8",
                "retry-after": String(rateLimit.retryAfter),
              },
            },
          );
        try {
          const result = await loginCalvenn(body.email.trim(), body.password);
          if (!result.ok)
            return json(
              { authenticated: false, error: "invalid_login", message: result.message },
              401,
            );
          clearLoginRateLimit(request);
          return applySessionCookies(
            json({
              authenticated: true,
              user: {
                id: result.user.id,
                email: result.user.email,
                displayName: result.user.displayName,
                clientName: result.user.clientName,
                locationId: result.user.locationId,
                role: result.user.role,
                capabilities: result.user.capabilities,
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
