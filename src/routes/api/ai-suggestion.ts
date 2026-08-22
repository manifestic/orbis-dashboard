import { createFileRoute } from "@tanstack/react-router";
import {
  applySessionCookies,
  getCalvennSession,
  hasCommandCenterCapability,
} from "../../lib/command-center-auth";
import { createAiSuggestion } from "../../lib/ai-suggestion";
import {
  AiReviewLedgerError,
  createAiReview,
  updateAiReview,
  type AiReviewAction,
} from "../../lib/ai-review-ledger";
import { highLevelTokenForLocation } from "../../lib/highlevel-token";
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

function actorFromSession(session: { id: string; email: string }) {
  return {
    userId: session.id,
    email: session.email || "embedded-highlevel-session",
  };
}

async function readJson(request: Request) {
  try {
    return (await request.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function idempotencyKey(value: unknown) {
  const normalized = typeof value === "string" ? value.trim() : "";
  return /^[A-Za-z0-9._:-]{16,120}$/.test(normalized) ? normalized : "";
}

function ledgerStatus(error: AiReviewLedgerError) {
  if (error.code === "invalid") return 400;
  if (error.code === "not_found") return 404;
  if (error.code === "conflict") return 409;
  return 503;
}

export const Route = createFileRoute("/api/ai-suggestion")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const auth = await getCalvennSession(request);
        if (!auth.session)
          return applyCookies(json({ error: "authentication_required" }, 401), auth.cookies);

        const conversationId = new URL(request.url).searchParams.get("conversationId")?.trim();
        if (!conversationId)
          return applyCookies(json({ error: "missing_conversation_id" }, 400), auth.cookies);

        const result = await createAiSuggestion({
          locationId: auth.session.locationId,
          token: highLevelTokenForLocation(auth.session.locationId),
          conversationId,
        });
        const csrf = issueCsrfToken(request);

        return applyCookies(json({ ...result, csrfToken: csrf.token }), auth.cookies, csrf.cookie);
      },
      POST: async ({ request }) => {
        const auth = await getCalvennSession(request);
        if (!auth.session)
          return applyCookies(json({ error: "authentication_required" }, 401), auth.cookies);
        if (!hasCommandCenterCapability(auth.session, "inbox.read"))
          return applyCookies(json({ error: "ai_review_not_authorized" }, 403), auth.cookies);
        if (!hasAllowedOrigin(request))
          return applyCookies(json({ error: "origin_not_allowed" }, 403), auth.cookies);
        if (!hasValidCsrfToken(request))
          return applyCookies(json({ error: "csrf_failed" }, 403), auth.cookies);

        const body = await readJson(request);
        const action = typeof body.action === "string" ? body.action.trim() : "";
        const csrf = issueCsrfToken(request);
        const actor = actorFromSession(auth.session);

        try {
          if (action === "create") {
            const conversationId =
              typeof body.conversationId === "string" ? body.conversationId.trim() : "";
            const requestIdempotencyKey = idempotencyKey(body.idempotencyKey);
            if (!conversationId || !requestIdempotencyKey)
              return applyCookies(
                json({ error: "conversation_and_idempotency_required" }, 400),
                auth.cookies,
                csrf.cookie,
              );

            const result = await createAiSuggestion({
              locationId: auth.session.locationId,
              token: highLevelTokenForLocation(auth.session.locationId),
              conversationId,
            });
            if (result.status !== "ready")
              return applyCookies(
                json({ ...result, csrfToken: csrf.token }, 409),
                auth.cookies,
                csrf.cookie,
              );

            const stored = await createAiReview({
              locationId: auth.session.locationId,
              conversationId,
              actor,
              idempotencyKey: requestIdempotencyKey,
              contract: result,
            });
            return applyCookies(
              json({
                ...result,
                csrfToken: csrf.token,
                reviewId: stored.review.id,
                reviewStatus: stored.review.status,
                reviewCreated: stored.created,
              }),
              auth.cookies,
              csrf.cookie,
            );
          }

          const reviewId = typeof body.reviewId === "string" ? body.reviewId.trim() : "";
          const requestIdempotencyKey = idempotencyKey(body.idempotencyKey);
          const editedDraft = typeof body.editedDraft === "string" ? body.editedDraft : undefined;
          const allowedActions = new Set<AiReviewAction>([
            "approved",
            "rejected",
            "dismissed",
            "expired",
          ]);
          if (!reviewId || !requestIdempotencyKey || !allowedActions.has(action as AiReviewAction))
            return applyCookies(
              json({ error: "review_action_and_idempotency_required" }, 400),
              auth.cookies,
              csrf.cookie,
            );

          const updated = await updateAiReview({
            locationId: auth.session.locationId,
            reviewId,
            action: action as AiReviewAction,
            actor,
            idempotencyKey: requestIdempotencyKey,
            editedDraft,
          });
          return applyCookies(
            json({
              csrfToken: csrf.token,
              reviewId: updated.review.id,
              reviewStatus: updated.review.status,
              reviewCreated: updated.created,
              editedDraft: updated.review.editedDraft,
              draftVersion: updated.review.draftVersion,
            }),
            auth.cookies,
            csrf.cookie,
          );
        } catch (error) {
          if (error instanceof AiReviewLedgerError)
            return applyCookies(
              json({ error: error.message, code: error.code }, ledgerStatus(error)),
              auth.cookies,
              csrf.cookie,
            );
          return applyCookies(
            json({ error: "ai_review_storage_unavailable" }, 503),
            auth.cookies,
            csrf.cookie,
          );
        }
      },
    },
  },
});
