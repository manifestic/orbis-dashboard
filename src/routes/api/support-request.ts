import { createFileRoute } from "@tanstack/react-router";
import { applySessionCookies, getCalvennSession } from "../../lib/command-center-auth";
import { createAiReview } from "../../lib/ai-review-ledger";
import { hasAllowedOrigin, hasValidCsrfToken, issueCsrfToken } from "../../lib/reply-security";

const SUPPORT_RECIPIENT = "ops@manifestic.ai";
const CATEGORIES = new Set(["Dashboard", "Content Review", "Web & Insights", "Voice AI", "Other"]);

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "cache-control": "no-store", "content-type": "application/json; charset=utf-8" },
  });
}

function applyCookies(response: Response, cookies?: string[], csrfCookie?: string) {
  applySessionCookies(response, cookies);
  if (csrfCookie) response.headers.append("Set-Cookie", csrfCookie);
  return response;
}

function text(value: unknown, name: string, maxLength: number, required = true) {
  const normalized = typeof value === "string" ? value.trim() : "";
  if (required && !normalized) throw new Error(`${name}_required`);
  if (normalized.length > maxLength) throw new Error(`${name}_too_long`);
  return normalized;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ?? character);
}

async function notifyOps(input: { category: string; message: string; clientName: string; locationId: string; requesterEmail: string; requestId: string }) {
  const apiKey = (process.env.RESEND_API_KEY ?? "").trim();
  const from = (process.env.MANIFESTIC_SUPPORT_FROM_EMAIL ?? "").trim();
  if (!apiKey || !from) throw new Error("support_notifications_unconfigured");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "Idempotency-Key": `manifestic-support-${input.requestId}` },
    body: JSON.stringify({
      from,
      to: [SUPPORT_RECIPIENT],
      reply_to: input.requesterEmail,
      subject: `[Command Center support] ${input.category} · ${input.clientName}`,
      html: `<h2>Command Center support request</h2><p><strong>Client:</strong> ${escapeHtml(input.clientName)}</p><p><strong>Location:</strong> ${escapeHtml(input.locationId)}</p><p><strong>Requester:</strong> ${escapeHtml(input.requesterEmail)}</p><p><strong>Category:</strong> ${escapeHtml(input.category)}</p><p><strong>Request:</strong><br />${escapeHtml(input.message).replace(/\n/g, "<br />")}</p><p><strong>Request ID:</strong> ${escapeHtml(input.requestId)}</p><p>No HighLevel changes were made by this form.</p>`,
    }),
  });
  if (!response.ok) throw new Error("support_notification_failed");
}

export const Route = createFileRoute("/api/support-request")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const auth = await getCalvennSession(request);
        if (!auth.session) return applyCookies(json({ error: "authentication_required" }, 401), auth.cookies);
        const csrf = issueCsrfToken(request);
        return applyCookies(json({ csrfToken: csrf.token }), auth.cookies, csrf.cookie);
      },
      POST: async ({ request }) => {
        const auth = await getCalvennSession(request);
        if (!auth.session) return applyCookies(json({ error: "authentication_required" }, 401), auth.cookies);
        if (!hasAllowedOrigin(request)) return applyCookies(json({ error: "origin_not_allowed" }, 403), auth.cookies);
        if (!hasValidCsrfToken(request)) return applyCookies(json({ error: "csrf_failed" }, 403), auth.cookies);
        const csrf = issueCsrfToken(request);
        try {
          const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
          if (body.action !== "create") throw new Error("unsupported_action");
          const category = text(body.category, "category", 80);
          if (!CATEGORIES.has(category)) throw new Error("category_invalid");
          const message = text(body.message, "message", 4000);
          const requestId = text(body.idempotencyKey, "idempotency_key", 120);
          const conversationId = `support-request:${requestId}`;
          const draft = JSON.stringify({ requestType: "client_support", category, message, status: "submitted", highLevelChangesMade: false });
          const stored = await createAiReview({
            locationId: auth.session.locationId,
            conversationId,
            actor: { userId: auth.session.id, email: auth.session.email },
            idempotencyKey: requestId,
            contract: {
              contractVersion: "1", status: "ready", mode: "provider", provider: "manifestic_ops",
              summary: `Client support request: ${category}`,
              nextAction: "Manifestic Ops reviews the request and responds through the approved support channel.",
              draft, riskFlags: ["tenant_scoped", "requires_ops_review", "no_highlevel_write"], evidence: [], contextCompleteness: "complete",
              source: { conversationId, messageCount: 0 },
              review: { requiresHumanApproval: true, sendsMessages: false, changesHighLevel: false },
            },
          });
          await notifyOps({ category, message, clientName: auth.session.clientName, locationId: auth.session.locationId, requesterEmail: auth.session.email, requestId });
          return applyCookies(json({ csrfToken: csrf.token, requestId: stored.review.id, requestStatus: "submitted", message: "Your request was sent to Manifestic Ops." }), auth.cookies, csrf.cookie);
        } catch (error) {
          const message = error instanceof Error ? error.message : "support_request_unavailable";
          const status = message.endsWith("_required") || message.endsWith("_too_long") || message.endsWith("_invalid") ? 400 : 503;
          return applyCookies(json({ error: message }, status), auth.cookies, csrf.cookie);
        }
      },
    },
  },
});
