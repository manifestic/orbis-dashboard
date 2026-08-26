import { hashReplyBody } from "./reply-ledger";
import type { AiSuggestionContract } from "./ai-suggestion";

const REVIEW_TABLE = "command_center_ai_reviews";
const EVENT_TABLE = "command_center_ai_review_events";

export type AiReviewStatus = "proposed" | "approved" | "rejected" | "dismissed" | "expired";
export type AiReviewAction = Exclude<AiReviewStatus, "proposed">;

export type AiReviewActor = {
  userId: string;
  email: string;
};

export type AiReviewRecord = {
  id: string;
  idempotencyKey: string;
  locationId: string;
  conversationId: string;
  contactId: string;
  contractVersion: string;
  suggestionVersion: string;
  provider: string | null;
  mode: string | null;
  status: AiReviewStatus;
  summary: string;
  nextAction: string;
  draft: string;
  editedDraft: string | null;
  riskFlags: string[];
  evidence: AiSuggestionContract["evidence"];
  contextCompleteness: "complete" | "bounded" | "failed";
  contextMessageCount: number;
  contextLimit: number | null;
  createdByUserId: string;
  createdByEmail: string;
  decisionByUserId: string | null;
  decisionByEmail: string | null;
  decisionAt: string | null;
  draftVersion: number;
  createdAt: string;
  updatedAt: string;
};

type LedgerErrorCode = "unconfigured" | "not_found" | "conflict" | "invalid";

export class AiReviewLedgerError extends Error {
  constructor(
    public readonly code: LedgerErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "AiReviewLedgerError";
  }
}

type HighLevelReviewRow = Record<string, unknown>;

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
  if (!current) throw new AiReviewLedgerError("unconfigured", "ai_review_storage_unconfigured");
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
  return (await response.json().catch(() => ({}))) as HighLevelReviewRow | HighLevelReviewRow[];
}

function records(value: HighLevelReviewRow | HighLevelReviewRow[]) {
  if (Array.isArray(value)) return value.filter((row) => Object.keys(row).length > 0);
  return Object.keys(value).length > 0 ? [value] : [];
}

function stringValue(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function nullableString(value: unknown) {
  return typeof value === "string" && value ? value : null;
}

function numberValue(value: unknown, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function jsonArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function reviewFromRow(row: HighLevelReviewRow): AiReviewRecord {
  return {
    id: stringValue(row.id),
    idempotencyKey: stringValue(row.idempotency_key),
    locationId: stringValue(row.location_id),
    conversationId: stringValue(row.conversation_id),
    contactId: stringValue(row.contact_id),
    contractVersion: stringValue(row.contract_version),
    suggestionVersion: stringValue(row.suggestion_version),
    provider: nullableString(row.provider),
    mode: nullableString(row.mode),
    status: stringValue(row.status, "proposed") as AiReviewStatus,
    summary: stringValue(row.summary),
    nextAction: stringValue(row.next_action),
    draft: stringValue(row.draft),
    editedDraft: nullableString(row.edited_draft),
    riskFlags: jsonArray<string>(row.risk_flags),
    evidence: jsonArray<NonNullable<AiSuggestionContract["evidence"]>[number]>(row.evidence),
    contextCompleteness: stringValue(
      row.context_completeness,
      "failed",
    ) as AiReviewRecord["contextCompleteness"],
    contextMessageCount: numberValue(row.context_message_count),
    contextLimit: row.context_limit == null ? null : numberValue(row.context_limit),
    createdByUserId: stringValue(row.created_by_user_id),
    createdByEmail: stringValue(row.created_by_email),
    decisionByUserId: nullableString(row.decision_by_user_id),
    decisionByEmail: nullableString(row.decision_by_email),
    decisionAt: nullableString(row.decision_at),
    draftVersion: numberValue(row.draft_version, 1),
    createdAt: stringValue(row.created_at),
    updatedAt: stringValue(row.updated_at),
  };
}

async function findReviewById(locationId: string, reviewId: string) {
  const response = await supabaseRequest(
    `${REVIEW_TABLE}?id=eq.${encodeURIComponent(reviewId)}&location_id=eq.${encodeURIComponent(locationId)}&select=*`,
  );
  if (!response.ok)
    throw new AiReviewLedgerError("unconfigured", `ai_review_lookup_${response.status}`);
  const body = await responseJson(response);
  const row = records(body)[0];
  return row ? reviewFromRow(row) : null;
}

async function findReviewByIdempotencyKey(idempotencyKey: string) {
  const response = await supabaseRequest(
    `${REVIEW_TABLE}?idempotency_key=eq.${encodeURIComponent(idempotencyKey)}&select=*`,
  );
  if (!response.ok)
    throw new AiReviewLedgerError(
      "unconfigured",
      `ai_review_idempotency_lookup_${response.status}`,
    );
  const body = await responseJson(response);
  const row = records(body)[0];
  return row ? reviewFromRow(row) : null;
}

async function hasEvent(idempotencyKey: string) {
  const response = await supabaseRequest(
    `${EVENT_TABLE}?idempotency_key=eq.${encodeURIComponent(idempotencyKey)}&select=id,review_id`,
  );
  if (!response.ok)
    throw new AiReviewLedgerError("unconfigured", `ai_review_event_lookup_${response.status}`);
  const body = await responseJson(response);
  const row = records(body)[0];
  return row ? { reviewId: stringValue(row.review_id) } : null;
}

async function appendEvent(input: {
  review: AiReviewRecord;
  idempotencyKey: string;
  eventType: string;
  actor: AiReviewActor;
  metadata?: Record<string, unknown>;
}) {
  const response = await supabaseRequest(EVENT_TABLE, {
    method: "POST",
    headers: { Prefer: "resolution=ignore-duplicates,return=representation" },
    body: JSON.stringify({
      review_id: input.review.id,
      idempotency_key: input.idempotencyKey,
      location_id: input.review.locationId,
      conversation_id: input.review.conversationId,
      contact_id: input.review.contactId,
      event_type: input.eventType,
      status: input.review.status,
      actor_user_id: input.actor.userId,
      actor_email: input.actor.email,
      draft_version: input.review.draftVersion,
      metadata: input.metadata ?? {},
    }),
  });
  if (!response.ok)
    throw new AiReviewLedgerError("unconfigured", `ai_review_event_append_${response.status}`);
}

function required(value: string | undefined, name: string) {
  const normalized = value?.trim() ?? "";
  if (!normalized) throw new AiReviewLedgerError("invalid", `${name}_required`);
  return normalized;
}

export async function createAiReview(input: {
  locationId: string;
  conversationId: string;
  actor: AiReviewActor;
  idempotencyKey: string;
  contract: AiSuggestionContract;
}) {
  const contract = input.contract;
  if (contract.status !== "ready")
    throw new AiReviewLedgerError("invalid", "ready_suggestion_required");
  const summary = required(contract.summary, "summary");
  const nextAction = required(contract.nextAction, "next_action");
  const draft = required(contract.draft, "draft");
  const locationId = required(input.locationId, "location_id");
  const conversationId = required(input.conversationId, "conversation_id");
  const idempotencyKey = required(input.idempotencyKey, "idempotency_key");
  const suggestionHash = await hashReplyBody(
    JSON.stringify({
      contractVersion: contract.contractVersion,
      suggestionVersion: contract.contractVersion,
      summary,
      nextAction,
      draft,
      evidence: contract.evidence ?? [],
    }),
  );

  const row = {
    idempotency_key: idempotencyKey,
    location_id: locationId,
    conversation_id: conversationId,
    contact_id: contract.source?.contactId ?? "",
    contract_version: contract.contractVersion,
    suggestion_version: contract.contractVersion,
    suggestion_hash: suggestionHash,
    provider: contract.provider,
    mode: contract.mode ?? null,
    status: "proposed" as const,
    summary,
    next_action: nextAction,
    draft,
    risk_flags: contract.riskFlags ?? [],
    evidence: contract.evidence ?? [],
    context_completeness: contract.contextCompleteness ?? "failed",
    context_message_count: contract.source?.messageCount ?? 0,
    context_limit: contract.source?.contextLimit ?? null,
    created_by_user_id: required(input.actor.userId, "actor_user_id"),
    created_by_email: required(input.actor.email, "actor_email"),
    draft_version: 1,
  };
  const response = await supabaseRequest(REVIEW_TABLE, {
    method: "POST",
    headers: { Prefer: "resolution=ignore-duplicates,return=representation" },
    body: JSON.stringify(row),
  });
  if (!response.ok)
    throw new AiReviewLedgerError("unconfigured", `ai_review_create_${response.status}`);
  const inserted = records(await responseJson(response))[0];
  if (!inserted) {
    const existing = await findReviewByIdempotencyKey(idempotencyKey);
    if (!existing) throw new AiReviewLedgerError("unconfigured", "ai_review_duplicate_missing");
    return { created: false as const, review: existing };
  }

  const review = reviewFromRow(inserted);
  await appendEvent({
    review,
    idempotencyKey: `${idempotencyKey}:created`,
    eventType: "suggestion_created",
    actor: input.actor,
    metadata: { suggestionHash },
  });
  return { created: true as const, review };
}

export async function updateAiReview(input: {
  locationId: string;
  reviewId: string;
  action: AiReviewAction;
  actor: AiReviewActor;
  idempotencyKey: string;
  editedDraft?: string;
}) {
  const locationId = required(input.locationId, "location_id");
  const reviewId = required(input.reviewId, "review_id");
  const idempotencyKey = required(input.idempotencyKey, "idempotency_key");
  const actorUserId = required(input.actor.userId, "actor_user_id");
  const actorEmail = required(input.actor.email, "actor_email");
  if (input.editedDraft !== undefined && input.editedDraft.length > 2_000)
    throw new AiReviewLedgerError("invalid", "edited_draft_too_long");

  const existingEvent = await hasEvent(idempotencyKey);
  if (existingEvent) {
    const existingReview = await findReviewById(locationId, existingEvent.reviewId || reviewId);
    if (!existingReview) throw new AiReviewLedgerError("not_found", "ai_review_not_found");
    return { created: false as const, review: existingReview };
  }

  const review = await findReviewById(locationId, reviewId);
  if (!review) throw new AiReviewLedgerError("not_found", "ai_review_not_found");
  if (review.status !== "proposed") {
    if (review.status !== input.action)
      throw new AiReviewLedgerError("conflict", "ai_review_already_decided");
    await appendEvent({
      review,
      idempotencyKey,
      eventType: input.action,
      actor: { userId: actorUserId, email: actorEmail },
      metadata: { idempotent: true },
    });
    return { created: false as const, review };
  }

  const editedDraft = input.editedDraft === undefined ? review.editedDraft : input.editedDraft;
  const draftVersion =
    input.editedDraft !== undefined && input.editedDraft !== review.editedDraft
      ? review.draftVersion + 1
      : review.draftVersion;
  const response = await supabaseRequest(
    `${REVIEW_TABLE}?id=eq.${encodeURIComponent(reviewId)}&location_id=eq.${encodeURIComponent(locationId)}&status=eq.proposed`,
    {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        status: input.action,
        edited_draft: editedDraft,
        decision_by_user_id: actorUserId,
        decision_by_email: actorEmail,
        decision_at: new Date().toISOString(),
        draft_version: draftVersion,
        updated_at: new Date().toISOString(),
      }),
    },
  );
  if (!response.ok)
    throw new AiReviewLedgerError("unconfigured", `ai_review_update_${response.status}`);
  const updatedRow = records(await responseJson(response))[0];
  const updated = updatedRow
    ? reviewFromRow(updatedRow)
    : await findReviewById(locationId, reviewId);
  if (!updated) throw new AiReviewLedgerError("not_found", "ai_review_not_found");

  await appendEvent({
    review: updated,
    idempotencyKey,
    eventType: input.action,
    actor: { userId: actorUserId, email: actorEmail },
    metadata: {
      editedDraft: input.editedDraft !== undefined,
      previousStatus: review.status,
    },
  });
  return { created: true as const, review: updated };
}
