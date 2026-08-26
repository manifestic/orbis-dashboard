import { createFileRoute } from "@tanstack/react-router";
import { applySessionCookies, getCalvennSession } from "../../lib/command-center-auth";
import { createAiReview, AiReviewLedgerError } from "../../lib/ai-review-ledger";
import { hasAllowedOrigin, hasValidCsrfToken, issueCsrfToken } from "../../lib/reply-security";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "cache-control": "no-store", "content-type": "application/json; charset=utf-8" },
  });
}

function applyCookies(response: Response, sessionCookies?: string[], csrfCookie?: string) {
  applySessionCookies(response, sessionCookies);
  if (csrfCookie) response.headers.append("Set-Cookie", csrfCookie);
  return response;
}

async function readJson(request: Request) {
  try {
    return (await request.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function text(value: unknown, name: string, maxLength = 500) {
  const normalized = typeof value === "string" ? value.trim() : "";
  if (!normalized) throw new Error(`${name}_required`);
  if (normalized.length > maxLength) throw new Error(`${name}_too_long`);
  return normalized;
}

function duration(value: unknown) {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isInteger(parsed) || parsed < 15 || parsed > 240)
    throw new Error("duration_minutes_invalid");
  return parsed;
}

function requestIdempotencyKey(value: unknown) {
  const normalized = typeof value === "string" ? value.trim() : "";
  return /^[A-Za-z0-9._:-]{16,120}$/.test(normalized) ? normalized : "";
}

export const Route = createFileRoute("/api/calendar-request")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const auth = await getCalvennSession(request);
        if (!auth.session)
          return applyCookies(json({ error: "authentication_required" }, 401), auth.cookies);
        const csrf = issueCsrfToken(request);
        return applyCookies(json({ csrfToken: csrf.token }), auth.cookies, csrf.cookie);
      },
      POST: async ({ request }) => {
        const auth = await getCalvennSession(request);
        if (!auth.session)
          return applyCookies(json({ error: "authentication_required" }, 401), auth.cookies);
        if (!hasAllowedOrigin(request))
          return applyCookies(json({ error: "origin_not_allowed" }, 403), auth.cookies);
        if (!hasValidCsrfToken(request))
          return applyCookies(json({ error: "csrf_failed" }, 403), auth.cookies);

        const csrf = issueCsrfToken(request);
        try {
          const body = await readJson(request);
          if (body.action !== "create")
            return applyCookies(json({ error: "unsupported_action" }, 400), auth.cookies, csrf.cookie);

          const idempotencyKey = requestIdempotencyKey(body.idempotencyKey);
          if (!idempotencyKey)
            return applyCookies(json({ error: "idempotency_key_required" }, 400), auth.cookies, csrf.cookie);

          const calendarType = text(body.calendarType, "calendar_type");
          const serviceName = text(body.serviceName, "service_name");
          const durationMinutes = duration(body.durationMinutes);
          const availability = text(body.availability, "availability");
          const bufferRules = text(body.bufferRules, "buffer_rules");
          const assignedUser = text(body.assignedUser, "assigned_user");
          const bookingPageDestination = text(body.bookingPageDestination, "booking_page_destination");
          const conversationId = `calendar-request:${idempotencyKey}`;
          const requestDraft = JSON.stringify({
            requestType: "booking_calendar_setup",
            reviewDestination: "Manifestic Ops",
            calendarType,
            serviceName,
            durationMinutes,
            availability,
            bufferRules,
            assignedUser,
            bookingPageDestination,
            status: "draft",
            nativeCalendarCreated: false,
            notificationSent: false,
          });

          const stored = await createAiReview({
            locationId: auth.session.locationId,
            conversationId,
            actor: { userId: auth.session.id, email: auth.session.email },
            idempotencyKey,
            contract: {
              contractVersion: "1",
              status: "ready",
              mode: "provider",
              provider: "manifestic_ops",
              summary: `Booking calendar setup request: ${serviceName}`,
              nextAction: "Manifestic Ops reviews the draft and manually creates the native HighLevel calendar after owner approval.",
              draft: requestDraft,
              riskFlags: ["requires_owner_approval", "no_native_calendar_created", "no_notification_sent"],
              evidence: [],
              contextCompleteness: "complete",
              source: { conversationId, messageCount: 0 },
              review: { requiresHumanApproval: true, sendsMessages: false, changesHighLevel: false },
            },
          });

          return applyCookies(
            json({
              csrfToken: csrf.token,
              requestId: stored.review.id,
              requestStatus: "draft",
              message: "Draft request saved for Manifestic Ops review. Nothing was created or sent.",
            }),
            auth.cookies,
            csrf.cookie,
          );
        } catch (error) {
          const status = error instanceof AiReviewLedgerError && error.code === "invalid" ? 400 : 503;
          return applyCookies(
            json({ error: error instanceof Error ? error.message : "calendar_request_unavailable" }, status),
            auth.cookies,
            csrf.cookie,
          );
        }
      },
    },
  },
});
