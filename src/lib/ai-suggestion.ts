const HIGHLEVEL_API = "https://services.leadconnectorhq.com";
const HIGHLEVEL_VERSION = "v3";

export type AiSuggestionMessage = {
  id: string;
  body: string;
  direction: string;
  type: string;
  dateAdded?: string;
};

export type AiSuggestionContract = {
  contractVersion: "1";
  status: "ready" | "unavailable";
  mode?: "provider" | "development_test";
  provider: string | null;
  summary?: string;
  nextAction?: string;
  draft?: string;
  riskFlags?: string[];
  evidence?: Array<{
    messageId: string;
    direction: string;
    dateAdded?: string;
    excerpt: string;
  }>;
  suggestion?: string;
  source?: {
    conversationId: string;
    contactId?: string;
    contactName?: string;
    channel?: string;
    messageCount: number;
    contextLimit?: number;
    latestMessageAt?: string;
    latestMessagePreview?: string;
  };
  contextCompleteness?: "complete" | "bounded" | "failed";
  review: {
    requiresHumanApproval: true;
    sendsMessages: false;
    changesHighLevel: false;
  };
  unavailable?: {
    code: "provider_unavailable" | "missing_credentials" | "conversation_unavailable";
    message: string;
  };
};

type ConversationContext = {
  conversationId: string;
  contactId: string;
  contactName: string;
  channel: string;
  messages: AiSuggestionMessage[];
};

type HighLevelRecord = Record<string, unknown>;

class AiSuggestionError extends Error {
  constructor(
    public readonly code: "missing_credentials" | "conversation_unavailable",
    message: string,
  ) {
    super(message);
    this.name = "AiSuggestionError";
  }
}

function text(...values: unknown[]) {
  return (
    values
      .find((value): value is string => typeof value === "string" && value.trim().length > 0)
      ?.trim() ?? ""
  );
}

function asArray(value: unknown): HighLevelRecord[] {
  return Array.isArray(value)
    ? value.filter((item): item is HighLevelRecord => Boolean(item && typeof item === "object"))
    : [];
}

function jsonRecord(value: unknown): HighLevelRecord {
  return value && typeof value === "object" ? (value as HighLevelRecord) : {};
}

function configuredProvider() {
  return (process.env.CALVENN_AI_SUGGESTION_PROVIDER ?? "").trim().toLowerCase() || null;
}

function developmentFallbackEnabled() {
  return process.env.CALVENN_AI_SUGGESTION_DEV_FALLBACK === "true";
}

function reviewContract(
  values: Omit<AiSuggestionContract, "contractVersion" | "review">,
): AiSuggestionContract {
  return {
    contractVersion: "1",
    ...values,
    review: {
      requiresHumanApproval: true,
      sendsMessages: false,
      changesHighLevel: false,
    },
  };
}

function unavailable(
  code: NonNullable<AiSuggestionContract["unavailable"]>["code"],
  message: string,
  provider: string | null = configuredProvider(),
): AiSuggestionContract {
  return reviewContract({
    status: "unavailable",
    provider,
    unavailable: { code, message },
  });
}

async function highLevelJson(path: string, token: string) {
  const response = await fetch(`${HIGHLEVEL_API}${path}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      Version: HIGHLEVEL_VERSION,
    },
  });
  const body = jsonRecord(await response.json().catch(() => ({})));
  if (!response.ok)
    throw new AiSuggestionError("conversation_unavailable", "HighLevel data is unavailable.");
  return body;
}

async function loadConversationContext(
  locationId: string,
  token: string,
  conversationId: string,
): Promise<ConversationContext> {
  if (!token)
    throw new AiSuggestionError(
      "missing_credentials",
      "The scoped HighLevel credential is unavailable.",
    );

  const encodedLocationId = encodeURIComponent(locationId);
  const ownershipBody = await highLevelJson(
    `/conversations/search?locationId=${encodedLocationId}&id=${encodeURIComponent(conversationId)}&status=all&limit=1`,
    token,
  );
  const ownedConversation = asArray(ownershipBody.conversations).find(
    (conversation) => text(conversation.id, conversation.conversationId) === conversationId,
  );
  if (!ownedConversation) {
    throw new AiSuggestionError(
      "conversation_unavailable",
      "This conversation is not available for the authenticated tenant.",
    );
  }

  const contact = jsonRecord(ownedConversation.contact);
  const contactName = text(
    ownedConversation.fullName,
    ownedConversation.contactName,
    contact.name,
    [contact.firstName, contact.lastName].filter(Boolean).join(" "),
    "Contact",
  );
  const channel = text(
    ownedConversation.lastMessageType,
    ownedConversation.channel,
    ownedConversation.type,
    "Conversation",
  );
  const messagesBody = await highLevelJson(
    `/conversations/${encodeURIComponent(conversationId)}/messages?limit=50`,
    token,
  );
  const envelope = jsonRecord(messagesBody.messages ?? messagesBody);
  const messages = asArray(envelope.messages ?? messagesBody.messages).map((message, index) => ({
    id: text(message.id, message.messageId, `${conversationId}-${index}`),
    body: text(message.body, message.text, "No message body"),
    direction: text(message.direction, message.messageDirection, "unknown"),
    type: text(message.messageType, message.type, "message"),
    dateAdded: text(message.dateAdded, message.createdAt) || undefined,
  }));

  const contactId = text(ownedConversation.contactId, contact.id);
  return { conversationId, contactId, contactName, channel, messages };
}

function developmentSuggestion(context: ConversationContext): AiSuggestionContract {
  const latest = context.messages.at(-1);
  const latestBody = latest?.body ?? "";
  const normalized = latestBody.toLowerCase();
  const nextStep = /appointment|calendar|schedule|tomorrow|time|move|reschedule/.test(normalized)
    ? "confirm the requested timing and offer the next available Medicare consultation slot"
    : "answer the specific question from verified context and offer one clear next step";
  const summary = latestBody
    ? `${context.contactName} has a recent ${context.channel} message that needs human review.`
    : `${context.contactName} has conversation history but no readable latest message body.`;
  const nextAction = latestBody
    ? `Review the latest message, then ${nextStep}.`
    : `Review the conversation and ask ${context.contactName} what Medicare question or next step they need help with.`;
  const draft = latestBody
    ? `Hi ${context.contactName}, thanks for reaching out. I’m reviewing your question and will help with the next step. Before I make any recommendation, can you confirm what you’d like help with?`
    : `Hi ${context.contactName}, I’m reviewing your conversation. What Medicare question or next step can I help with?`;
  const riskFlags = [
    "Human approval required before any reply.",
    "Do not promise coverage, eligibility, pricing, or savings.",
    "Development/test suggestion only; no provider-backed action was taken.",
  ];
  const evidence = context.messages.slice(-5).map((message) => ({
    messageId: message.id,
    direction: message.direction,
    dateAdded: message.dateAdded,
    excerpt: message.body.slice(0, 220),
  }));

  return reviewContract({
    status: "ready",
    mode: "development_test",
    provider: "deterministic-local-fallback",
    contextCompleteness: "bounded",
    summary,
    nextAction,
    draft,
    riskFlags,
    evidence,
    suggestion: `Development/test suggestion only: ${nextAction}`,
    source: {
      conversationId: context.conversationId,
      contactId: context.contactId,
      contactName: context.contactName,
      channel: context.channel,
      messageCount: context.messages.length,
      contextLimit: 50,
      latestMessageAt: latest?.dateAdded,
      latestMessagePreview: latestBody.slice(0, 220),
    },
  });
}

export async function createAiSuggestion({
  locationId,
  token,
  conversationId,
}: {
  locationId: string;
  token?: string;
  conversationId: string;
}): Promise<AiSuggestionContract> {
  const provider = configuredProvider();
  if (provider) {
    return unavailable(
      "provider_unavailable",
      "An AI provider name is configured, but no approved provider adapter is installed for this service.",
      provider,
    );
  }

  if (!developmentFallbackEnabled()) {
    return unavailable(
      "provider_unavailable",
      "No approved AI model/provider is configured. No suggestion was generated.",
      null,
    );
  }

  if (!token)
    return unavailable(
      "missing_credentials",
      "The scoped HighLevel credential is unavailable.",
      null,
    );

  try {
    const context = await loadConversationContext(locationId, token, conversationId);
    return developmentSuggestion(context);
  } catch (error) {
    if (error instanceof AiSuggestionError) return unavailable(error.code, error.message, null);
    return unavailable(
      "conversation_unavailable",
      "Conversation context could not be loaded for review.",
      null,
    );
  }
}
