export type BusinessBrandInterviewInput = {
  businessName: string;
  businessDescription: string;
  audience: string;
  offers: string;
  differentiators: string;
  tone: string;
  goals: string;
  receptionistRole: string;
  aiContext: string;
};

export type BusinessBrandInterviewDraft = {
  contractVersion: "1";
  source: "client-business-brand-interview";
  status: "draft" | "approved";
  tenant: {
    locationId: string;
    clientName: string;
  };
  fields: BusinessBrandInterviewInput;
  mapping: {
    intelligence: "session_preview_only" | "canonical_context_pending";
    highLevelBrandVoice: "not_requested";
    highLevelBrandBoard: "not_requested";
  };
  review: {
    requiresOwnerApproval: true;
    approvedInSession: boolean;
  };
  safety: {
    writesHighLevel: false;
    sendsMessages: false;
    activatesAutomation: false;
  };
};

export const EMPTY_BUSINESS_BRAND_INTERVIEW: BusinessBrandInterviewInput = {
  businessName: "",
  businessDescription: "",
  audience: "",
  offers: "",
  differentiators: "",
  tone: "",
  goals: "",
  receptionistRole: "",
  aiContext: "",
};

export function generateBusinessBrandInterviewDraft(
  fields: BusinessBrandInterviewInput,
  tenant: { locationId: string; clientName: string },
): BusinessBrandInterviewDraft {
  const normalizedFields = Object.fromEntries(
    Object.entries(fields).map(([key, value]) => [key, value.trim()]),
  ) as BusinessBrandInterviewInput;

  return {
    contractVersion: "1",
    source: "client-business-brand-interview",
    status: "draft",
    tenant,
    fields: normalizedFields,
    mapping: {
      intelligence: "session_preview_only",
      highLevelBrandVoice: "not_requested",
      highLevelBrandBoard: "not_requested",
    },
    review: {
      requiresOwnerApproval: true,
      approvedInSession: false,
    },
    safety: {
      writesHighLevel: false,
      sendsMessages: false,
      activatesAutomation: false,
    },
  };
}

export function approveBusinessBrandInterviewDraft(
  draft: BusinessBrandInterviewDraft,
): BusinessBrandInterviewDraft {
  return {
    ...draft,
    status: "approved",
    mapping: {
      ...draft.mapping,
      intelligence: "session_preview_only",
    },
    review: {
      ...draft.review,
      approvedInSession: true,
    },
  };
}
