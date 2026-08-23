import { createFileRoute } from "@tanstack/react-router";
import { applySessionCookies, getCalvennSession } from "../../lib/command-center-auth";
import { AiReviewLedgerError, createAiReview } from "../../lib/ai-review-ledger";
import { hasAllowedOrigin, hasValidCsrfToken, issueCsrfToken } from "../../lib/reply-security";

const SUPPORT_RECIPIENT = "ops@manifestic.ai";
const SUPPORT_CATEGORIES = new Set([
  "Documents & Contracts",
  "Templates",
  "Dashboard",
  "Inbox",
  "Calendar",
  "Other",
]);

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

function text(value: unknown, name: string, maxLength: number, required = true) {
  const normalized = typeof value === "string" ? value.trim() : "";
  if (required && !normalized) throw new Error(`${name}_required`);
  if (normalized.length > maxLength) throw new Error(`${name}_too_long`);
  return normalized;
}

function idempotencyKey(value: unknown) {
  const normalized = typeof value === "string" ? value.trim() : "";
  return /^[A-Za-z0-9._:-]{16,120}$/.test(normalized) ? normalized : "";
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>'"]/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ??
      character,
  );
}

async function notifyOps(input: {
  idempotencyKey: string;
  category: string;
  message: string;
  screenshotUrl: string;
  contactContext: string;
  clientName: string;
  locationId: string;
  requesterEmail: string;
}) {
  const apiKey = (process.env.RESEND_API_KEY ?? "").trim();
  const from = (process.env.MANIFESTIC_SUPPORT_FROM_EMAIL ?? "").trim();
  if (!apiKey || !from) throw new Error("support_notifications_unconfigured");

  const safe = {
    idempotencyKey: escapeHtml(input.idempotencyKey),
    category: escapeHtml(input.category),
    message: escapeHtml(input.message).replace(/\n/g, "<br />"),
    screenshotUrl: escapeHtml(input.screenshotUrl),
    contactContext: escapeHtml(input.contactContext).replace(/\n/g, "<br />"),
    clientName: escapeHtml(input.clientName),
    locationId: escapeHtml(input.locationId),
    requesterEmail: escapeHtml(input.requesterEmail),
  };
  const optionalContext = safe.contactContext || "Not provided";
  const optionalScreenshot = safe.screenshotUrl
    ? `<p><strong>Screenshot:</strong> <a href="${safe.screenshotUrl}">${safe.screenshotUrl}</a></p>`
    : "<p><strong>Screenshot:</strong> Not provided</p>";
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `manifestic-support-${input.idempotencyKey}`,
    },
    body: JSON.stringify({
      from,
      to: [SUPPORT_RECIPIENT],
      reply_to: input.requesterEmail,
      subject: `[Command Center support] ${input.category} · ${input.clientName}`,
      html: `<h2>Command Center support request</h2><p><strong>Client:</strong> ${safe.clientName}</p><p><strong>Location:</strong> ${safe.locationId}</p><p><strong>Requester:</strong> ${safe.requesterEmail}</p><p><strong>Category:</strong> ${safe.category}</p><p><strong>Request:</strong><br />${safe.message}</p><p><strong>Contact context:</strong><br />${optionalContext}</p>${optionalScreenshot}<p><strong>Request ID:</strong> ${safe.idempotencyKey}</p><p>No HighLevel changes were made by this form.</p>`,
    }),
  });
  if (!response.ok) throw new Error("support_notification_failed");
}

export const Route = createFileRoute("/api/support-request")({
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
            return applyCookies(
              json({ error: "unsupported_action" }, 400),
              auth.cookies,
              csrf.cookie,
            );
          const requestKey = idempotencyKey(body.idempotencyKey);
          if (!requestKey)
            return applyCookies(
              json({ error: "idempotency_key_required" }, 400),
              auth.cookies,
              csrf.cookie,
            );
          const category = text(body.category, "category", 80);
          if (!SUPPORT_CATEGORIES.has(category))
            return applyCookies(
              json({ error: "category_invalid" }, 400),
              auth.cookies,
              csrf.cookie,
            );
          const message = text(body.message, "message", 4000);
          const screenshotUrl = text(body.screenshotUrl, "screenshot_url", 1000, false);
          if (screenshotUrl && !/^https?:\/\//i.test(screenshotUrl))
            return applyCookies(
              json({ error: "screenshot_url_invalid" }, 400),
              auth.cookies,
              csrf.cookie,
            );
          const contactContext = text(body.contactContext, "contact_context", 1000, false);
          const conversationId = `support-request:${requestKey}`;
          const draft = JSON.stringify({
            requestType: "client_support",
            notificationTarget: SUPPORT_RECIPIENT,
            category,
            message,
            screenshotUrl,
            contactContext,
            status: "submitted",
            highLevelChangesMade: false,
          });
          const stored = await createAiReview({
            locationId: auth.session.locationId,
            conversationId,
            actor: { userId: auth.session.id, email: auth.session.email },
            idempotencyKey: requestKey,
            contract: {
              contractVersion: "1",
              status: "ready",
              mode: "provider",
              provider: "manifestic_ops",
              summary: `Client support request: ${category}`,
              nextAction:
                "Manifestic Ops reviews the request and responds through the approved support channel.",
              draft,
              riskFlags: ["tenant_scoped", "requires_ops_review", "no_highlevel_write"],
              evidence: [],
              contextCompleteness: "complete",
              source: { conversationId, messageCount: 0 },
              review: {
                requiresHumanApproval: true,
                sendsMessages: false,
                changesHighLevel: false,
              },
            },
          });
          await notifyOps({
            idempotencyKey: requestKey,
            category,
            message,
            screenshotUrl,
            contactContext,
            clientName: auth.session.clientName,
            locationId: auth.session.locationId,
            requesterEmail: auth.session.email,
          });
          return applyCookies(
            json({
              csrfToken: csrf.token,
              requestId: stored.review.id,
              requestStatus: "submitted",
              message: "Your request was sent to Manifestic Ops.",
            }),
            auth.cookies,
            csrf.cookie,
          );
        } catch (error) {
          const message = error instanceof Error ? error.message : "support_request_unavailable";
          const status =
            message.endsWith("_required") ||
            message.endsWith("_too_long") ||
            message.endsWith("_invalid")
              ? 400
              : 503;
          return applyCookies(json({ error: message }, status), auth.cookies, csrf.cookie);
        }
      },
    },
  },
});
