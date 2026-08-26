import { createFileRoute } from "@tanstack/react-router";
import {
  applySessionCookies,
  getCalvennSession,
  hasCommandCenterCapability,
} from "../../lib/command-center-auth";
import { resolveHighLevelTokenForLocation } from "../../lib/highlevel-token";
import { normalizeReplyChannel, replyBlockedReason, replyPolicy } from "../../lib/reply-policy";
import { hasAllowedOrigin, hasValidCsrfToken } from "../../lib/reply-security";
import {
  appendReplyAudit,
  hashReplyBody,
  reserveReply,
  updateReplyStatus,
} from "../../lib/reply-ledger";

const HIGHLEVEL_API = "https://services.leadconnectorhq.com";
const HIGHLEVEL_VERSION = "v3";
const MAX_REPLY_LENGTH = 2_000;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "cache-control": "no-store", "content-type": "application/json; charset=utf-8" },
  });
}

function text(...values: unknown[]) {
  return (
    values
      .find((value): value is string => typeof value === "string" && value.trim().length > 0)
      ?.trim() ?? ""
  );
}

function asRecord(value: unknown) {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function asArray(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value)
    ? value.filter((item): item is Record<string, unknown> =>
        Boolean(item && typeof item === "object"),
      )
    : [];
}

function applyCookies(response: Response, cookies?: string[]) {
  return applySessionCookies(response, cookies);
}

async function readJson(request: Request) {
  try {
    return (await request.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export const Route = createFileRoute("/api/reply")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const auth = await getCalvennSession(request);
        if (!auth.session)
          return applyCookies(json({ error: "authentication_required" }, 401), auth.cookies);
        if (!hasCommandCenterCapability(auth.session, "inbox.reply"))
          return applyCookies(json({ error: "reply_not_authorized" }, 403), auth.cookies);
        if (!hasAllowedOrigin(request))
          return applyCookies(json({ error: "origin_not_allowed" }, 403), auth.cookies);
        if (!hasValidCsrfToken(request))
          return applyCookies(json({ error: "csrf_failed" }, 403), auth.cookies);

        const body = await readJson(request);
        const conversationId =
          typeof body.conversationId === "string" ? body.conversationId.trim() : "";
        const idempotencyKey =
          typeof body.idempotencyKey === "string" ? body.idempotencyKey.trim() : "";
        const message = typeof body.message === "string" ? body.message.trim() : "";
        if (!conversationId || !idempotencyKey || !message)
          return applyCookies(
            json({ error: "conversation_message_and_idempotency_required" }, 400),
            auth.cookies,
          );
        if (!/^[A-Za-z0-9._:-]{16,120}$/.test(idempotencyKey))
          return applyCookies(json({ error: "invalid_idempotency_key" }, 400), auth.cookies);
        if (message.length > MAX_REPLY_LENGTH)
          return applyCookies(
            json({ error: "message_too_long", maxLength: MAX_REPLY_LENGTH }, 400),
            auth.cookies,
          );

        const token = await resolveHighLevelTokenForLocation(auth.session.locationId);
        if (!token) return applyCookies(json({ error: "missing_credentials" }, 503), auth.cookies);

        const ownershipUrl = new URL(`${HIGHLEVEL_API}/conversations/search`);
        ownershipUrl.searchParams.set("locationId", auth.session.locationId);
        ownershipUrl.searchParams.set("id", conversationId);
        ownershipUrl.searchParams.set("status", "all");
        ownershipUrl.searchParams.set("limit", "1");
        const ownershipResponse = await fetch(ownershipUrl, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            Version: HIGHLEVEL_VERSION,
          },
        });
        const ownershipBody = asRecord(await ownershipResponse.json().catch(() => ({})));
        if (!ownershipResponse.ok)
          return applyCookies(json({ error: "highlevel_unavailable" }, 502), auth.cookies);
        const ownedConversation = asArray(ownershipBody.conversations).find(
          (conversation) => text(conversation.id, conversation.conversationId) === conversationId,
        );
        if (!ownedConversation)
          return applyCookies(json({ error: "conversation_not_found" }, 404), auth.cookies);

        const contact = asRecord(ownedConversation.contact);
        const contactId = text(ownedConversation.contactId, contact.id);
        const phone = text(ownedConversation.phone, contact.phone, contact.phoneNumber);
        const channel = normalizeReplyChannel(
          ownedConversation.type,
          ownedConversation.channel,
          ownedConversation.lastMessageType,
        );
        const policy = replyPolicy();
        const senderAllowed = policy.senderEmails.has(auth.session.email.toLowerCase());
        const blockedReason = replyBlockedReason({
          channel,
          phone,
          writesEnabled: policy.writesEnabled,
          liveSendEnabled: policy.liveSendEnabled,
          senderAllowed,
          contactId,
          syntheticOnly: policy.syntheticOnly,
          sinkMode: policy.sinkMode,
          syntheticContactIds: policy.syntheticContactIds,
        });
        if (blockedReason)
          return applyCookies(
            json(
              { error: "reply_blocked", reason: blockedReason },
              blockedReason === "writes_disabled" ? 409 : 403,
            ),
            auth.cookies,
          );

        const bodyHash = await hashReplyBody(message);
        let reservation;
        try {
          reservation = await reserveReply({
            idempotencyKey,
            locationId: auth.session.locationId,
            conversationId,
            contactId,
            actorUserId: auth.session.id,
            actorEmail: auth.session.email,
            channel,
            bodyHash,
            bodyLength: message.length,
          });
        } catch {
          return applyCookies(json({ error: "reply_ledger_unavailable" }, 503), auth.cookies);
        }
        if (!reservation.created)
          return applyCookies(
            json({ error: "duplicate_reply_attempt", status: reservation.record.status }, 409),
            auth.cookies,
          );

        const ledgerId = text(reservation.record.id);
        try {
          await appendReplyAudit({
            ledgerId,
            idempotencyKey,
            eventType: "reply_reserved",
            locationId: auth.session.locationId,
            conversationId,
            contactId,
            actorUserId: auth.session.id,
            actorEmail: auth.session.email,
            metadata: {
              channel,
              bodyLength: message.length,
              mode: policy.liveSendEnabled ? "live" : "synthetic_sink",
            },
          });
        } catch {
          await updateReplyStatus(idempotencyKey, "failed").catch(() => undefined);
          return applyCookies(json({ error: "reply_audit_unavailable" }, 503), auth.cookies);
        }

        if (policy.liveSendEnabled) {
          try {
            const sendResponse = await fetch(`${HIGHLEVEL_API}/conversations/messages`, {
              method: "POST",
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
                Version: HIGHLEVEL_VERSION,
                "content-type": "application/json",
              },
              body: JSON.stringify({
                type: "SMS",
                contactId,
                message,
                status: "pending",
                toNumber: phone,
              }),
            });
            const sendBody = asRecord(await sendResponse.json().catch(() => ({})));
            if (!sendResponse.ok) throw new Error(`highlevel_send_${sendResponse.status}`);
            const providerMessageId = text(sendBody.messageId, sendBody.id);
            await updateReplyStatus(idempotencyKey, "sent", providerMessageId || undefined);
            await appendReplyAudit({
              ledgerId,
              idempotencyKey,
              eventType: "reply_sent",
              locationId: auth.session.locationId,
              conversationId,
              contactId,
              actorUserId: auth.session.id,
              actorEmail: auth.session.email,
              metadata: { channel, mode: "live", externalSend: true, providerMessageId },
            });
            return applyCookies(
              json({
                ok: true,
                mode: "live",
                sent: true,
                conversationId,
                providerMessageId: providerMessageId || undefined,
                status: "queued",
              }),
              auth.cookies,
            );
          } catch {
            await updateReplyStatus(idempotencyKey, "failed").catch(() => undefined);
            await appendReplyAudit({
              ledgerId,
              idempotencyKey,
              eventType: "reply_send_failed",
              locationId: auth.session.locationId,
              conversationId,
              contactId,
              actorUserId: auth.session.id,
              actorEmail: auth.session.email,
              metadata: { channel, mode: "live", externalSend: false },
            }).catch(() => undefined);
            return applyCookies(json({ error: "highlevel_send_failed" }, 502), auth.cookies);
          }
        }

        // Synthetic mode exercises the complete guardrail path without calling
        // HighLevel's outbound message endpoint.
        try {
          await updateReplyStatus(idempotencyKey, "simulated");
          await appendReplyAudit({
            ledgerId,
            idempotencyKey,
            eventType: "reply_simulated",
            locationId: auth.session.locationId,
            conversationId,
            contactId,
            actorUserId: auth.session.id,
            actorEmail: auth.session.email,
            metadata: { channel, mode: "synthetic_sink", externalSend: false },
          });
        } catch {
          await updateReplyStatus(idempotencyKey, "failed").catch(() => undefined);
          return applyCookies(
            json({ error: "reply_audit_finalize_unavailable" }, 503),
            auth.cookies,
          );
        }
        return applyCookies(
          json({
            ok: true,
            mode: "synthetic_sink",
            sent: false,
            conversationId,
            status: "simulated",
          }),
          auth.cookies,
        );
      },
    },
  },
});
