import { createFileRoute } from "@tanstack/react-router";
import {
  applySessionCookies,
  getCalvennSession,
  hasCommandCenterCapability,
} from "../../lib/command-center-auth";
import { resolveHighLevelTokenForLocation } from "../../lib/highlevel-token";
import {
  maskPhone,
  normalizeReplyChannel,
  replyBlockedReason,
  replyPolicy,
} from "../../lib/reply-policy";
import { issueCsrfToken } from "../../lib/reply-security";

const HIGHLEVEL_API = "https://services.leadconnectorhq.com";
const HIGHLEVEL_VERSION = "v3";

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

export const Route = createFileRoute("/api/reply-capability")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const auth = await getCalvennSession(request);
        if (!auth.session)
          return applySessionCookies(json({ error: "authentication_required" }, 401), auth.cookies);
        if (!hasCommandCenterCapability(auth.session, "inbox.reply"))
          return applySessionCookies(
            json({
              error: "reply_not_authorized",
              replyable: false,
              readOnly: true,
              mode: "disabled",
              reason: "inbox_reply_not_authorized",
            }),
            auth.cookies,
          );

        const conversationId = new URL(request.url).searchParams.get("conversationId")?.trim();
        if (!conversationId)
          return applySessionCookies(json({ error: "missing_conversation_id" }, 400), auth.cookies);

        const token = await resolveHighLevelTokenForLocation(auth.session.locationId);
        if (!token)
          return applySessionCookies(json({ error: "missing_credentials" }, 503), auth.cookies);

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
          return applySessionCookies(
            json(
              { error: "highlevel_unavailable", status: ownershipResponse.status },
              ownershipResponse.status >= 500 ? 502 : ownershipResponse.status,
            ),
            auth.cookies,
          );

        const ownedConversation = asArray(ownershipBody.conversations).find(
          (conversation) => text(conversation.id, conversation.conversationId) === conversationId,
        );
        if (!ownedConversation)
          return applySessionCookies(json({ error: "conversation_not_found" }, 404), auth.cookies);

        const contact = asRecord(ownedConversation.contact);
        const channel = normalizeReplyChannel(
          ownedConversation.type,
          ownedConversation.channel,
          ownedConversation.lastMessageType,
        );
        const phone = text(ownedConversation.phone, contact.phone, contact.phoneNumber);
        const policy = replyPolicy();
        const senderAllowed = policy.senderEmails.has(auth.session.email.toLowerCase());
        const contactId = text(ownedConversation.contactId, contact.id);
        const csrf = issueCsrfToken(request);
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

        return applySessionCookies(
          json({
            conversationId,
            readOnly: !policy.liveSendEnabled,
            writesEnabled: policy.writesEnabled,
            mode: policy.liveSendEnabled ? "live" : policy.sinkMode ? "synthetic_sink" : "disabled",
            liveSendEnabled: policy.liveSendEnabled,
            actorCanReply: senderAllowed,
            channel,
            supportedChannels: ["sms"],
            contactId: contactId || undefined,
            contactPhone: phone ? maskPhone(phone) : undefined,
            replyable: blockedReason === null,
            reason: blockedReason,
            csrfToken: csrf.token,
          }),
          [...(auth.cookies ?? []), ...(csrf.cookie ? [csrf.cookie] : [])],
        );
      },
    },
  },
});
