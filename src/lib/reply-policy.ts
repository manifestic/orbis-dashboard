export const REPLY_CHANNELS = ["sms"] as const;

export type ReplyChannel = (typeof REPLY_CHANNELS)[number];

export function normalizeReplyChannel(...values: unknown[]): string {
  const value = values.find(
    (candidate): candidate is string =>
      typeof candidate === "string" && candidate.trim().length > 0,
  );
  return (value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");
}

export function maskPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length < 4) return "phone on file";
  return `••• ••• ${digits.slice(-4)}`;
}

export function replyPolicy() {
  const senders = new Set(
    (process.env.CALVENN_INBOX_SENDERS ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
  const syntheticContactIds = new Set(
    (process.env.CALVENN_INBOX_SYNTHETIC_CONTACT_IDS ?? "")
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean),
  );
  return {
    writesEnabled: process.env.CALVENN_INBOX_WRITES_ENABLED === "true",
    liveSendEnabled: process.env.CALVENN_INBOX_LIVE_SEND_ENABLED === "true",
    syntheticOnly: process.env.CALVENN_INBOX_SYNTHETIC_ONLY === "true",
    sinkMode: process.env.CALVENN_INBOX_SINK_MODE === "true",
    senderEmailsConfigured: senders.size > 0,
    senderEmails: senders,
    syntheticContactIds,
  };
}

export function replyBlockedReason({
  channel,
  phone,
  writesEnabled,
  liveSendEnabled,
  senderAllowed,
  contactId,
  syntheticOnly,
  sinkMode,
  syntheticContactIds,
}: {
  channel: string;
  phone: string;
  writesEnabled: boolean;
  liveSendEnabled: boolean;
  senderAllowed: boolean;
  contactId: string;
  syntheticOnly: boolean;
  sinkMode: boolean;
  syntheticContactIds: Set<string>;
}) {
  if (!writesEnabled) return "writes_disabled" as const;
  if (!senderAllowed) return "sender_not_authorized" as const;
  if (liveSendEnabled) {
    if (channel !== "typephone" && channel !== "sms") return "channel_not_enabled" as const;
    if (!phone) return "contact_phone_missing" as const;
    return null;
  }
  if (!syntheticOnly) return "synthetic_only_guard_required" as const;
  if (!syntheticContactIds.has(contactId)) return "synthetic_contact_required" as const;
  if (!sinkMode) return "sink_mode_required" as const;
  if (channel !== "typephone" && channel !== "sms") return "channel_not_enabled" as const;
  if (!phone && !sinkMode) return "contact_phone_missing" as const;
  return null;
}
