const LEDGER_TABLE = "command_center_reply_ledger";
const AUDIT_TABLE = "command_center_reply_audit_events";

type LedgerInput = {
  idempotencyKey: string;
  locationId: string;
  conversationId: string;
  contactId: string;
  actorUserId: string;
  actorEmail: string;
  channel: string;
  bodyHash: string;
  bodyLength: number;
};

type LedgerRecord = LedgerInput & {
  id: string;
  status: string;
};

function config() {
  const url = (process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(
    /\/$/,
    "",
  );
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  return url && key ? { url, key } : null;
}

async function supabaseRequest(path: string, init: RequestInit = {}) {
  const current = config();
  if (!current) throw new Error("reply_ledger_unconfigured");
  return fetch(`${current.url}/rest/v1/${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      apikey: current.key,
      Authorization: `Bearer ${current.key}`,
      "content-type": "application/json",
      ...(init.headers ?? {}),
    },
  });
}

async function responseJson(response: Response) {
  return (await response.json().catch(() => ({}))) as
    | Record<string, unknown>
    | Record<string, unknown>[];
}

export async function hashReplyBody(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function reserveReply(input: LedgerInput) {
  const response = await supabaseRequest(LEDGER_TABLE, {
    method: "POST",
    headers: { Prefer: "resolution=ignore-duplicates,return=representation" },
    body: JSON.stringify({
      idempotency_key: input.idempotencyKey,
      location_id: input.locationId,
      conversation_id: input.conversationId,
      contact_id: input.contactId,
      actor_user_id: input.actorUserId,
      actor_email: input.actorEmail,
      channel: input.channel,
      body_hash: input.bodyHash,
      body_length: input.bodyLength,
      status: "reserved",
    }),
  });
  if (!response.ok) throw new Error(`reply_ledger_reserve_${response.status}`);
  const inserted = await responseJson(response);
  if (Array.isArray(inserted) && inserted[0])
    return { created: true as const, record: inserted[0] as unknown as LedgerRecord };

  const duplicateResponse = await supabaseRequest(
    `${LEDGER_TABLE}?idempotency_key=eq.${encodeURIComponent(input.idempotencyKey)}&select=id,status,conversation_id,contact_id`,
  );
  if (!duplicateResponse.ok) throw new Error(`reply_ledger_lookup_${duplicateResponse.status}`);
  const duplicates = await responseJson(duplicateResponse);
  const record = Array.isArray(duplicates) ? duplicates[0] : undefined;
  if (!record) throw new Error("reply_ledger_duplicate_missing");
  return { created: false as const, record: record as unknown as LedgerRecord };
}

export async function updateReplyStatus(
  idempotencyKey: string,
  status: "sent" | "simulated" | "failed",
  providerMessageId?: string,
) {
  const response = await supabaseRequest(
    `${LEDGER_TABLE}?idempotency_key=eq.${encodeURIComponent(idempotencyKey)}`,
    {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        status,
        provider_message_id: providerMessageId ?? null,
        updated_at: new Date().toISOString(),
      }),
    },
  );
  if (!response.ok) throw new Error(`reply_ledger_update_${response.status}`);
}

export async function appendReplyAudit(input: {
  ledgerId?: string;
  idempotencyKey: string;
  eventType: string;
  locationId: string;
  conversationId: string;
  contactId: string;
  actorUserId: string;
  actorEmail: string;
  metadata?: Record<string, unknown>;
}) {
  const response = await supabaseRequest(AUDIT_TABLE, {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      ledger_id: input.ledgerId ?? null,
      idempotency_key: input.idempotencyKey,
      event_type: input.eventType,
      location_id: input.locationId,
      conversation_id: input.conversationId,
      contact_id: input.contactId,
      actor_user_id: input.actorUserId,
      actor_email: input.actorEmail,
      metadata: input.metadata ?? {},
    }),
  });
  if (!response.ok) throw new Error(`reply_audit_append_${response.status}`);
}
