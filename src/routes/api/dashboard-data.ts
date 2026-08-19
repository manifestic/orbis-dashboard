import { createFileRoute } from "@tanstack/react-router";
import { applySessionCookies, getCalvennSession } from "../../lib/command-center-auth";

const HIGHLEVEL_API = "https://services.leadconnectorhq.com";
const HIGHLEVEL_VERSION = "v3";

type HighLevelResponse = Record<string, unknown>;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "cache-control": "no-store",
      "content-type": "application/json; charset=utf-8",
    },
  });
}

function asArray(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value)
    ? value.filter((item): item is Record<string, unknown> =>
        Boolean(item && typeof item === "object"),
      )
    : [];
}

function text(...values: unknown[]) {
  return (
    values
      .find((value): value is string => typeof value === "string" && value.trim().length > 0)
      ?.trim() ?? ""
  );
}

function number(value: unknown) {
  return typeof value === "number" ? value : Number(value ?? 0) || 0;
}

function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "?"
  );
}

async function highLevelFetch(path: string, token: string, init?: RequestInit) {
  const response = await fetch(`${HIGHLEVEL_API}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      Version: HIGHLEVEL_VERSION,
      ...(init?.headers ?? {}),
    },
  });

  const body = (await response.json().catch(() => ({}))) as HighLevelResponse;
  if (!response.ok) {
    throw new Error(`HighLevel ${response.status}`);
  }
  return body;
}

function normalizeConversations(body: HighLevelResponse) {
  return asArray(body.conversations).map((conversation) => {
    const contact = (conversation.contact ?? {}) as Record<string, unknown>;
    const lastMessage = (conversation.lastMessage ?? {}) as Record<string, unknown>;
    const name = text(
      conversation.contactName,
      contact.name,
      [contact.firstName, contact.lastName].filter(Boolean).join(" "),
      "Unnamed contact",
    );
    const preview = text(
      conversation.lastMessageBody,
      lastMessage.body,
      conversation.snippet,
      "No message preview available",
    );
    const lastMessageDate = text(
      conversation.lastMessageDate,
      lastMessage.dateAdded,
      conversation.dateUpdated,
    );
    const unreadCount = number(conversation.unreadCount ?? conversation.unreadMessages);

    return {
      id: text(conversation.id, conversation.conversationId),
      name,
      channel: text(
        conversation.type,
        conversation.lastMessageType,
        conversation.channel,
        "Conversation",
      ),
      preview,
      lastMessageDate,
      initials: initials(name),
      unread: unreadCount > 0,
      unreadCount,
      contactId: text(conversation.contactId, contact.id),
      email: text(conversation.email, contact.email),
      phone: text(conversation.phone, contact.phone),
    };
  });
}

function normalizeAppointments(body: HighLevelResponse) {
  return asArray(body.events ?? body.appointments).map((event) => {
    const contact = (event.contact ?? {}) as Record<string, unknown>;
    const contactName = text(
      event.contactName,
      contact.name,
      [contact.firstName, contact.lastName].filter(Boolean).join(" "),
      "Contact",
    );
    return {
      id: text(event.id, event.appointmentId),
      title: text(event.title, event.calendarName, event.name, "Appointment"),
      person: contactName,
      startTime: text(event.startTime, event.startDate),
      endTime: text(event.endTime, event.endDate),
      status: text(event.appointmentStatus, event.status, "Scheduled"),
    };
  });
}

async function loadAppointments(
  locationId: string,
  token: string,
  now: number,
  weekFromNow: number,
) {
  const encodedLocationId = encodeURIComponent(locationId);
  const calendarsBody = await highLevelFetch(`/calendars/?locationId=${encodedLocationId}`, token);
  const calendarIds = asArray(calendarsBody.calendars)
    .map((calendar) => text(calendar.id, calendar.calendarId))
    .filter(Boolean);

  if (!calendarIds.length) return [];

  const eventBodies = await Promise.all(
    calendarIds
      .slice(0, 20)
      .map((calendarId) =>
        highLevelFetch(
          `/calendars/events?locationId=${encodedLocationId}&calendarId=${encodeURIComponent(calendarId)}&startTime=${now}&endTime=${weekFromNow}`,
          token,
        ),
      ),
  );

  return eventBodies.flatMap(normalizeAppointments);
}

function normalizeTasks(body: HighLevelResponse) {
  return asArray(body.tasks).map((task) => {
    const contact = (task.contact ?? {}) as Record<string, unknown>;
    return {
      id: text(task.id, task.taskId),
      label: text(task.title, task.name, task.subject, "Untitled task"),
      dueDate: text(task.dueDate, task.dueAt, task.dueDateTime),
      owner: text(task.assignedToName, task.assigneeName, task.assignedTo, "Unassigned"),
      contactName: text(task.contactName, contact.name),
      completed: Boolean(task.completed),
    };
  });
}

export const Route = createFileRoute("/api/dashboard-data")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const auth = await getCalvennSession(request);
        if (!auth.session)
          return applySessionCookies(
            json({ configured: false, error: "authentication_required" }, 401),
            auth.cookies,
          );
        const requestUrl = new URL(request.url);
        const requestedLocationId = requestUrl.searchParams.get("locationId")?.trim();
        if (requestedLocationId && requestedLocationId !== auth.session.locationId)
          return applySessionCookies(
            json({ configured: false, error: "tenant_mismatch" }, 403),
            auth.cookies,
          );
        const locationId = auth.session.locationId;

        const token =
          process.env.HIGHLEVEL_PRIVATE_INTEGRATION_TOKEN ?? process.env.HIGHLEVEL_ACCESS_TOKEN;
        if (!token) {
          return applySessionCookies(
            json(
              {
                configured: false,
                error: "missing_credentials",
                message:
                  "Add a scoped HighLevel Private Integration Token to the server environment.",
              },
              503,
            ),
            auth.cookies,
          );
        }

        const now = Date.now();
        const weekFromNow = now + 7 * 24 * 60 * 60 * 1000;
        const encodedLocationId = encodeURIComponent(locationId);
        const results = await Promise.allSettled([
          highLevelFetch(
            `/conversations/search?locationId=${encodedLocationId}&status=all&sort=desc&sortBy=last_message_date&limit=25`,
            token,
          ),
          loadAppointments(locationId, token, now, weekFromNow),
          highLevelFetch(`/locations/${encodedLocationId}/tasks/search`, token, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ completed: false, limit: 10, skip: 0 }),
          }),
        ]);

        const [conversationResult, appointmentResult, taskResult] = results;
        const data = {
          conversations:
            conversationResult.status === "fulfilled"
              ? normalizeConversations(conversationResult.value)
              : [],
          appointments: appointmentResult.status === "fulfilled" ? appointmentResult.value : [],
          tasks: taskResult.status === "fulfilled" ? normalizeTasks(taskResult.value) : [],
        };

        return applySessionCookies(
          json(
            {
              configured: true,
              generatedAt: new Date().toISOString(),
              readOnly: true,
              tenant: { clientName: auth.session.clientName },
              data,
              sources: {
                conversations: conversationResult.status === "fulfilled" ? "live" : "unavailable",
                appointments: appointmentResult.status === "fulfilled" ? "live" : "unavailable",
                tasks: taskResult.status === "fulfilled" ? "live" : "unavailable",
              },
            },
            200,
          ),
          auth.cookies,
        );
      },
    },
  },
});
