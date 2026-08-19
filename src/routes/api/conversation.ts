import { createFileRoute } from "@tanstack/react-router";
import { applySessionCookies, getCalvennSession } from "../../lib/command-center-auth";

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

function asArray(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value)
    ? value.filter((item): item is Record<string, unknown> =>
        Boolean(item && typeof item === "object"),
      )
    : [];
}

export const Route = createFileRoute("/api/conversation")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const auth = await getCalvennSession(request);
        if (!auth.session)
          return applySessionCookies(json({ error: "authentication_required" }, 401), auth.cookies);
        const conversationId = new URL(request.url).searchParams.get("conversationId")?.trim();
        if (!conversationId) return json({ error: "missing_conversation_id" }, 400);
        const token =
          process.env.HIGHLEVEL_PRIVATE_INTEGRATION_TOKEN ?? process.env.HIGHLEVEL_ACCESS_TOKEN;
        if (!token) return json({ error: "missing_credentials" }, 503);
        const response = await fetch(
          `${HIGHLEVEL_API}/conversations/${encodeURIComponent(conversationId)}/messages?limit=50`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
              Version: HIGHLEVEL_VERSION,
            },
          },
        );
        const body = (await response.json().catch(() => ({}))) as Record<string, unknown>;
        if (!response.ok)
          return json(
            { error: "highlevel_unavailable", status: response.status },
            response.status >= 500 ? 502 : response.status,
          );
        const envelope = (body.messages ?? body) as Record<string, unknown>;
        const messages = asArray(envelope.messages ?? body.messages).map((message) => ({
          id: text(message.id, message.messageId),
          body: text(message.body, message.text, "No message body"),
          direction: text(message.direction, message.messageDirection, "unknown"),
          type: text(message.messageType, message.type, "message"),
          dateAdded: text(message.dateAdded, message.createdAt),
          status: text(message.status),
          attachments: Array.isArray(message.attachments)
            ? message.attachments.filter((item): item is string => typeof item === "string")
            : [],
        }));
        return applySessionCookies(
          json({
            conversationId,
            readOnly: true,
            messages,
            nextPage: Boolean(envelope.nextPage),
            lastMessageId: text(envelope.lastMessageId),
          }),
          auth.cookies,
        );
      },
    },
  },
});
