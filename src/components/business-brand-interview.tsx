import { ArrowRight, CheckCircle2, FileText, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import {
  approveBusinessBrandInterviewDraft,
  EMPTY_BUSINESS_BRAND_INTERVIEW,
  generateBusinessBrandInterviewDraft,
  type BusinessBrandInterviewDraft,
  type BusinessBrandInterviewInput,
} from "../lib/business-brand-interview";

type BusinessBrandInterviewProps = {
  clientName: string;
  locationId: string;
  startingPoint?: Partial<BusinessBrandInterviewInput>;
  approvedDraft?: BusinessBrandInterviewDraft;
  onApproved: (draft: BusinessBrandInterviewDraft) => void;
  onOpenIntelligence: () => void;
};

const QUESTIONS: Array<{
  key: keyof BusinessBrandInterviewInput;
  label: string;
  hint: string;
  placeholder: string;
}> = [
  {
    key: "businessName",
    label: "Business name",
    hint: "The name clients should see and hear.",
    placeholder: "Example: Your Best Health Quote",
  },
  {
    key: "businessDescription",
    label: "What does the business do?",
    hint: "A plain-language description, not a slogan.",
    placeholder: "We help…",
  },
  {
    key: "audience",
    label: "Who do you serve?",
    hint: "Include audience, geography, stage of life, or business type.",
    placeholder: "We serve…",
  },
  {
    key: "offers",
    label: "What do you offer?",
    hint: "List the services, products, or consultations that matter most.",
    placeholder: "Our core offers are…",
  },
  {
    key: "differentiators",
    label: "Why choose you?",
    hint: "Proof, experience, process, access, or point of view.",
    placeholder: "Clients choose us because…",
  },
  {
    key: "tone",
    label: "How should the brand sound?",
    hint: "Words to use, words to avoid, and the feeling to create.",
    placeholder: "Clear, practical, reassuring…",
  },
  {
    key: "goals",
    label: "What should improve next?",
    hint: "Near-term business, marketing, or client-experience goals.",
    placeholder: "Over the next 90 days…",
  },
  {
    key: "receptionistRole",
    label: "What should an AI receptionist help with?",
    hint: "Describe safe first-line help; do not include passwords or private data.",
    placeholder: "Answer common questions, route…",
  },
  {
    key: "aiContext",
    label: "What else should AI know?",
    hint: "Hours, qualification rules, escalation preferences, or important context.",
    placeholder: "Important context and handoff rules…",
  },
];

function initialFields(startingPoint?: Partial<BusinessBrandInterviewInput>) {
  return { ...EMPTY_BUSINESS_BRAND_INTERVIEW, ...startingPoint };
}

function missingFields(fields: BusinessBrandInterviewInput) {
  return QUESTIONS.filter(({ key }) => !fields[key].trim()).map(({ label }) => label);
}

export function BusinessBrandInterview({
  clientName,
  locationId,
  startingPoint,
  approvedDraft,
  onApproved,
  onOpenIntelligence,
}: BusinessBrandInterviewProps) {
  const [fields, setFields] = useState<BusinessBrandInterviewInput>(() =>
    initialFields(startingPoint),
  );
  const [draft, setDraft] = useState<BusinessBrandInterviewDraft | undefined>(approvedDraft);
  const [step, setStep] = useState<"interview" | "review" | "approved">(
    approvedDraft ? "approved" : "interview",
  );
  const [started, setStarted] = useState(Boolean(approvedDraft));

  const generateDraft = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDraft(
      generateBusinessBrandInterviewDraft(fields, { clientName, locationId }),
    );
    setStep("review");
  };

  const updateDraftField = (key: keyof BusinessBrandInterviewInput, value: string) => {
    setDraft((current) =>
      current
        ? {
            ...current,
            status: "draft",
            review: { ...current.review, approvedInSession: false },
            fields: { ...current.fields, [key]: value },
          }
        : current,
    );
  };

  const approveDraft = () => {
    if (!draft) return;
    const approved = approveBusinessBrandInterviewDraft(draft);
    setDraft(approved);
    setStep("approved");
    onApproved(approved);
  };

  return (
    <section className="mt-5 rounded-2xl border border-[#b9dce9] bg-white/90 p-5 shadow-[0_18px_45px_-32px_rgba(16,35,54,0.55)] sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <span className="rounded-xl bg-[#e8f4fb] p-2.5 text-[#1377b8]"><Sparkles className="h-5 w-5" /></span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#1377b8]">Business &amp; Brand Interview</p>
            <h3 className="mt-1 text-xl font-semibold text-[#102336]">Chat with your AI guide.</h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#466174]">
              Start a guided conversation, review the structured draft, and approve what should inform {clientName}&apos;s Intelligence view.
            </p>
          </div>
        </div>
        <span className="rounded-full bg-[#fff4e6] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#8a5200]">
          Review required
        </span>
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-3">
        {[
          ["1", "Interview", "Business and brand context"],
          ["2", "Review draft", "Correct before mapping"],
          ["3", "Approve", "Session-only Intelligence preview"],
        ].map(([number, label, detail], index) => (
          <div key={label} className={`rounded-xl border p-3 ${step === (["interview", "review", "approved"] as const)[index] ? "border-[#1377b8] bg-[#eef8fb]" : "border-[#dbe5ed] bg-[#f8fbfd]"}`}>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#1377b8]">{number} · {label}</p>
            <p className="mt-1 text-[11px] text-[#466174]">{detail}</p>
          </div>
        ))}
      </div>

      {step === "interview" && !started && (
        <div className="mt-5 rounded-2xl border border-[#b9dce9] bg-gradient-to-br from-[#f4fbfe] via-white to-[#eefaf7] p-5 shadow-[0_16px_35px_-28px_rgba(19,119,184,0.7)] sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex max-w-2xl items-start gap-3">
              <span className="rounded-xl bg-[#dff3ef] p-2.5 text-[#087b68]"><MessageCircle className="h-5 w-5" /></span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#087b68]">Controlled Gemini experience · preview entry</p>
                <h4 className="mt-1 text-lg font-semibold text-[#102336]">Start AI Interview</h4>
                <p className="mt-2 text-sm leading-relaxed text-[#466174]">
                  Your AI guide will walk through business identity, audience, offers, differentiators, tone, goals, and safe receptionist context one step at a time.
                </p>
              </div>
            </div>
            <span className="rounded-full border border-[#f0c67c] bg-[#fffaf0] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#8a5200]">Review-only</span>
          </div>
          <div className="mt-4 rounded-xl border border-[#dbe5ed] bg-white/80 px-4 py-3 text-xs leading-relaxed text-[#466174]">
            The live Gemini chat route is not connected in this client surface yet. This entry opens the controlled guided interview below; it creates a session-only draft and does not expose HighLevel AI Studio, activate an agent, or write external settings.
          </div>
          <button
            type="button"
            onClick={() => setStarted(true)}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#1377b8] px-4 py-2.5 text-[11px] font-semibold text-white transition hover:bg-[#0f649b]"
          >
            Start AI Interview <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {step === "interview" && started && (
        <form className="mt-5" onSubmit={generateDraft}>
          <div className="rounded-xl border border-[#f0c67c] bg-[#fffaf0] px-4 py-3 text-xs leading-relaxed text-[#6f4b12]">
            Existing tenant context may be prefilled as a starting point. Review every answer. Do not enter passwords, API keys, or private customer information.
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {QUESTIONS.map(({ key, label, hint, placeholder }) => (
              <label key={key} className="text-[11px] font-semibold text-[#466174]">
                <span className="text-[#102336]">{label}</span>
                <span className="mt-1 block font-normal leading-relaxed text-[#6b8190]">{hint}</span>
                <textarea
                  rows={key === "businessName" ? 1 : 3}
                  value={fields[key]}
                  onChange={(event) => setFields((current) => ({ ...current, [key]: event.target.value }))}
                  placeholder={placeholder}
                  className="mt-2 w-full rounded-xl border border-[#dbe5ed] bg-white px-3 py-2.5 text-sm font-normal text-[#102336] outline-none transition placeholder:text-[#9bb0bc] focus:border-[#1377b8]"
                />
              </label>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => setStarted(false)} className="rounded-xl border border-[#b9d7e2] bg-white px-4 py-2.5 text-[11px] font-semibold text-[#1377b8] transition hover:bg-[#eef8fb]">
              Back to AI guide
            </button>
            <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-[#1377b8] px-4 py-2.5 text-[11px] font-semibold text-white transition hover:bg-[#0f649b]">
              Generate review draft <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <span className="text-[11px] text-[#466174]">Nothing is sent or written by this step.</span>
          </div>
        </form>
      )}

      {step === "review" && draft && (
        <div className="mt-5">
          <div className="rounded-xl border border-[#b9dce9] bg-[#f5fcff] px-4 py-3 text-xs leading-relaxed text-[#466174]">
            <strong className="text-[#102336]">Review before approval.</strong> This is a structured draft for tenant <span className="font-semibold text-[#102336]">{draft.tenant.locationId}</span>. Correct any field below; approval only makes the reviewed draft visible in this open Intelligence view.
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {QUESTIONS.map(({ key, label, hint }) => (
              <label key={key} className="text-[11px] font-semibold text-[#466174]">
                <span className="text-[#102336]">{label}</span>
                <span className="mt-1 block font-normal leading-relaxed text-[#6b8190]">{hint}</span>
                <textarea
                  rows={key === "businessName" ? 1 : 3}
                  value={draft.fields[key]}
                  onChange={(event) => updateDraftField(key, event.target.value)}
                  className="mt-2 w-full rounded-xl border border-[#dbe5ed] bg-white px-3 py-2.5 text-sm font-normal text-[#102336] outline-none transition focus:border-[#1377b8]"
                />
              </label>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => setStep("interview")} className="rounded-xl border border-[#b9d7e2] bg-white px-4 py-2.5 text-[11px] font-semibold text-[#1377b8] transition hover:bg-[#eef8fb]">
              Back to interview
            </button>
            <button type="button" onClick={approveDraft} className="inline-flex items-center gap-2 rounded-xl bg-[#0e9a85] px-4 py-2.5 text-[11px] font-semibold text-white transition hover:bg-[#087b68]">
              Approve for Intelligence preview <CheckCircle2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {step === "approved" && draft && (
        <div className="mt-5 space-y-4">
          <div className="rounded-xl border border-[#9dd9c6] bg-[#eefaf5] px-4 py-3 text-sm text-[#145b4e]">
            <div className="flex items-center gap-2 font-semibold"><CheckCircle2 className="h-4 w-4" /> Approved for this Intelligence preview.</div>
            <p className="mt-1 text-xs leading-relaxed">The reviewed draft is still session-only. It has not changed HighLevel, Brand Voice, Brand Board, Agent OS, contacts, or automations.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-[#dbe5ed] bg-[#f8fbfd] p-4">
              <div className="flex items-center gap-2 text-[#1377b8]"><FileText className="h-4 w-4" /><p className="text-xs font-semibold text-[#102336]">Structured context</p></div>
              <p className="mt-2 text-[11px] leading-relaxed text-[#466174]">Business, audience, offers, differentiators, tone, goals, and AI/receptionist context are mapped to the reviewed draft contract.</p>
            </div>
            <div className="rounded-xl border border-[#dbe5ed] bg-[#f8fbfd] p-4">
              <div className="flex items-center gap-2 text-[#0e9a85]"><ShieldCheck className="h-4 w-4" /><p className="text-xs font-semibold text-[#102336]">External settings</p></div>
              <p className="mt-2 text-[11px] leading-relaxed text-[#466174]">Brand Voice and Brand Board mapping remain optional and unconfigured until persistence, audit, and explicit owner approval exist.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => setStep("review")} className="rounded-xl border border-[#b9d7e2] bg-white px-4 py-2.5 text-[11px] font-semibold text-[#1377b8] transition hover:bg-[#eef8fb]">Review or correct</button>
            <button type="button" onClick={onOpenIntelligence} className="inline-flex items-center gap-2 rounded-xl bg-[#1377b8] px-4 py-2.5 text-[11px] font-semibold text-white transition hover:bg-[#0f649b]">Open Intelligence preview <ArrowRight className="h-3.5 w-3.5" /></button>
          </div>
        </div>
      )}

      <p className="mt-5 border-t border-[#edf2f5] pt-4 text-[10px] leading-relaxed text-[#6b8190]">
        Client-facing setup intentionally contains no snippets, countdown timers, or trigger links. Interview contract: v1 · source: client interview · no external writes.
        {step === "interview" && missingFields(fields).length > 0 ? ` ${missingFields(fields).length} fields can still be completed before generating the draft.` : ""}
      </p>
    </section>
  );
}
