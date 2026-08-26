import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Clock3,
  FileText,
  Globe2,
  Inbox,
  Instagram,
  LayoutDashboard,
  Linkedin,
  Mail,
  MessageCircle,
  MoreHorizontal,
  PanelTop,
  RefreshCw,
  Search,
  Smartphone,
  Sparkles,
  Target,
  UsersRound,
  X,
  Youtube,
} from "lucide-react";
import { useEffect, useState, type CSSProperties } from "react";
import { brandingForLocation } from "../lib/client-branding";
import { MOBILE_APP_LINKS } from "../lib/mobile-app-links";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Client Command Center — Manifestic" },
      {
        name: "description",
        content:
          "A focused client dashboard prototype for conversations, appointments, tasks, content, websites, and reports.",
      },
    ],
  }),
  component: ClientCommandCenter,
});

type IconType = typeof Inbox;

const conversations = [
  {
    id: "demo-conversation-001",
    name: "Sofia at Northside Health",
    channel: "SMS",
    preview: "Can we move tomorrow's consultation to 2:30?",
    time: "8m",
    initials: "SN",
    tone: "bg-cyan-300/15 text-cyan-100",
    unread: true,
  },
  {
    id: "demo-conversation-002",
    name: "Marcus Johnson",
    channel: "Email",
    preview: "Re: website intake form — I added the new service area.",
    time: "32m",
    initials: "MJ",
    tone: "bg-violet-300/15 text-violet-100",
    unread: true,
  },
  {
    id: "demo-conversation-003",
    name: "Renee Carter",
    channel: "Web chat",
    preview: "New lead from the benefits discovery landing page.",
    time: "1h",
    initials: "RC",
    tone: "bg-amber-300/15 text-amber-100",
    unread: false,
  },
];

const appointments = [
  {
    id: "demo-appointment-001",
    demoTimeLabel: "Today · 10:30 AM",
    title: "Medicare consultation",
    person: "Sofia Martinez",
    color: "border-cyan-300/35 bg-cyan-300/[0.07]",
  },
  {
    id: "demo-appointment-002",
    demoTimeLabel: "Tomorrow · 1:00 PM",
    title: "Health insurance consultation",
    person: "Marcus Johnson",
    color: "border-violet-300/35 bg-violet-300/[0.07]",
  },
  {
    id: "demo-appointment-003",
    demoTimeLabel: "Thu · 9:00 AM",
    title: "General benefits review",
    person: "Manifestic team",
    color: "border-amber-300/35 bg-amber-300/[0.07]",
  },
];

const tasks = [
  {
    id: "demo-task-001",
    label: "Approve the August benefits post",
    due: "Due today",
    owner: "Manifestic",
    urgent: true,
  },
  { id: "demo-task-002", label: "Review new landing page leads", due: "Demo due", owner: "Calvenn", urgent: false },
  { id: "demo-task-003", label: "Send updated service-area copy", due: "Demo due", owner: "Calvenn", urgent: false },
];

const websites = [
  {
    name: "Calvenn Healthcare",
    detail: "Primary website",
    status: "Live",
    metric: "Healthy",
    accent: "from-cyan-300 to-blue-500",
    href: "https://yourbesthealthquote.vercel.app/",
  },
  {
    name: "Benefits Discovery",
    detail: "Quote form landing page",
    status: "Live",
    metric: "Ready to review",
    accent: "from-violet-300 to-fuchsia-500",
    href: "https://yourbesthealthquote.vercel.app/#quote",
  },
  {
    name: "Content Universe",
    detail: "AI content engine + pillar pages",
    status: "Live",
    metric: "15 AEO posts",
    accent: "from-amber-300 to-orange-500",
    href: "https://calvenn-content-universe.vercel.app/",
  },
];

const workspaceLinks = [
  {
    label: "Your Best Health Quote",
    detail: "Primary production demo",
    kind: "page",
    href: "https://yourbesthealthquote.vercel.app/",
  },
  {
    label: "Calvenn agency site",
    detail: "Agency and services site",
    kind: "page",
    href: "https://calvenn-agency.vercel.app/",
  },
  {
    label: "Content Universe",
    detail: "AI content engine overview",
    kind: "page",
    href: "https://calvenn-content-universe.vercel.app/",
  },
  {
    label: "Private health pillar",
    detail: "Content Universe landing page",
    kind: "page",
    href: "https://calvenn-content-universe.vercel.app/pillars/private-health.html",
  },
  {
    label: "ACA pillar",
    detail: "Content Universe landing page",
    kind: "page",
    href: "https://calvenn-content-universe.vercel.app/pillars/aca.html",
  },
  {
    label: "Medicare pillar",
    detail: "Content Universe landing page",
    kind: "page",
    href: "https://calvenn-content-universe.vercel.app/pillars/medicare.html",
  },
  {
    label: "Agent recruiting",
    detail: "Broker platform page",
    kind: "funnel",
    href: "https://ahs-broker-site.vercel.app/ahs-agent-recruiting.html",
  },
  {
    label: "Quote funnel",
    detail: "Fast-path quote request page",
    kind: "funnel",
    href: "https://ahs-broker-site.vercel.app/ahs-quote-funnel.html",
  },
  {
    label: "Agent site setup",
    detail: "Broker onboarding page",
    kind: "funnel",
    href: "https://ahs-broker-site.vercel.app/ahs-agent-site-setup.html",
  },
  {
    label: "Agent system demo",
    detail: "Broker operating-system demo",
    kind: "funnel",
    href: "https://ahs-broker-site.vercel.app/ahs-agent-system-demo.html",
  },
  {
    label: "Compare plans",
    detail: "Consumer comparison page",
    kind: "funnel",
    href: "https://ahs-broker-site.vercel.app/ahs-compare-plans.html",
  },
  {
    label: "Agent finder quiz",
    detail: "Local-agent matching page",
    kind: "funnel",
    href: "https://ahs-broker-site.vercel.app/ahs-agent-finder-quiz.html",
  },
  {
    label: "Subsidy calculator",
    detail: "ACA savings estimate page",
    kind: "funnel",
    href: "https://ahs-broker-site.vercel.app/ahs-subsidy-calculator.html",
  },
  {
    label: "Revenue project brief",
    detail: "Calvenn platform proposal",
    kind: "page",
    href: "https://docs.google.com/document/d/1ph20QZBsuq5V1gUL4KfN9jmw8jE2yQnft0Ptu0FiosU/edit",
  },
];

const reports = [
  {
    name: "AI visibility report",
    detail: "How Calvenn appears in answer engines",
    updated: "Agent OS · Aug 10",
    icon: Sparkles,
    href: "https://drive.google.com/file/d/17e-TpeI9V-PYqvtQdnoI5TvHkbkcKBLM/view",
  },
  {
    name: "Community report",
    detail: "Communities, conversations, and audience signals",
    updated: "Agent OS · Aug 10",
    icon: UsersRound,
    href: "https://drive.google.com/file/d/1TY_c7iNHN_y_ESpGlvFzzjdOLBk6zIOW/view",
  },
  {
    name: "Competitors report",
    detail: "Competitive positioning and whitespace",
    updated: "Agent OS · Aug 10",
    icon: Target,
    href: "https://drive.google.com/file/d/1qtDq1SgzIctXbv2EQb2xjXaYWLLTWUt3/view",
  },
  {
    name: "Keyword report",
    detail: "Search opportunities for the insurance content engine",
    updated: "Agent OS · Aug 10",
    icon: Search,
    href: "https://drive.google.com/file/d/1wQ3suVeeboTDUxDHqv8sXiIdmKOXFeBx/view",
  },
  {
    name: "YouTube report",
    detail: "Video hooks and creator opportunities",
    updated: "Agent OS · Aug 10",
    icon: Youtube,
    href: "https://drive.google.com/file/d/11XV34tobWRwanXIApnggl61Kl6fOuQna/view",
  },
];

type LiveConversation = {
  id?: string;
  name: string;
  channel: string;
  preview: string;
  lastMessageDate?: string;
  initials: string;
  unread?: boolean;
  unreadCount?: number;
  contactId?: string;
  email?: string;
  phone?: string;
};
type LiveAppointment = {
  id?: string;
  title: string;
  person: string;
  startTime?: string;
  endTime?: string;
  status?: string;
};
type LiveTask = {
  id?: string;
  label: string;
  dueDate?: string;
  owner?: string;
  contactName?: string;
  completed?: boolean;
};
type LiveOpportunitySummary = {
  total: number;
  open: number;
  won: number;
  lost: number;
  abandoned: number;
  stages: { label: string; value: number }[];
};
type LiveDashboardData = {
  conversations: LiveConversation[];
  appointments: LiveAppointment[];
  tasks: LiveTask[];
  opportunities: LiveOpportunitySummary;
};
type LiveState = {
  status: "idle" | "loading" | "ready" | "error";
  data: LiveDashboardData;
  generatedAt?: string;
  message?: string;
  sources?: Record<string, string>;
};
type SetupStatusGridProps = {
  calendarReadAvailable: boolean;
  calendarSettingsHref?: string;
  plannerHref?: string;
  socialMessagingHref?: string;
};
type CalendarRequestFormState = {
  calendarType: string;
  serviceName: string;
  durationMinutes: string;
  availability: string;
  bufferRules: string;
  assignedUser: string;
  bookingPageDestination: string;
};
const PROPOSED_CALENDAR_TYPES = [
  "Medicare Consultation",
  "Health Insurance Consultation",
  "General Benefits Review",
] as const;
type AuthState = {
  status: "loading" | "authenticated" | "unauthenticated" | "error";
  user?: {
    id: string;
    email: string;
    displayName: string;
    clientName: string;
    locationId: string;
    role?: "viewer" | "operator";
    capabilities?: string[];
  };
  message?: string;
};
type ClientConfig = {
  locationId: string;
  name: string;
  logoUrl: string;
  greetingName?: string;
  reviewUrl: string;
  websiteUrl: string;
  websiteName: string;
  footerLabel: string;
  footerText: string;
  primaryColor: string;
  accentColor: string;
  inkColor: string;
  mutedColor: string;
};
type DashboardSection =
  | "getting-started"
  | "overview"
  | "inbox"
  | "calendar"
  | "opportunities"
  | "content"
  | "websites"
  | "reports";
type WebsiteTab = "pages" | "funnels" | "reports" | "intelligence" | "partnership";

const calvennIntelligence = {
  scope: "Calvenn Starre · Your Best Health Quote",
  source: "Client-provided Intelligence snapshot + Calvenn Agent OS context",
  confidence: "Medium confidence · review before using for recommendations",
  identity: [
    { label: "Category", value: "Finance & Insurance", status: "mapped", source: "Client-provided" },
    { label: "Contact", value: "Calvenn Starre", status: "mapped", source: "Client-provided" },
    { label: "Role", value: "Broker / Agent · health & life insurance agent", status: "mapped", source: "Client-provided" },
    { label: "Business stage", value: "Established", status: "review", source: "Client-provided · medium confidence" },
    { label: "Model", value: "Captive Insurance Model", status: "mapped", source: "Client-provided" },
    { label: "Website", value: "yourbesthealthquote.com", status: "mapped", source: "Existing Calvenn profile" },
  ],
  context: [
    { label: "Description", value: "Experienced health/life insurance agent in captive insurance providing comprehensive coverage to individuals and small businesses.", status: "review", source: "Client-provided · medium confidence" },
    { label: "What they sell", value: "Health and life insurance solutions, risk assessment, and insurance expertise", status: "mapped", source: "Client-provided" },
    { label: "Audience", value: "B2C · Consumers · SMB / Local business", status: "mapped", source: "Client-provided" },
    { label: "Product lines", value: "Private health · Short-term · ACA · Medicare · Life", status: "mapped", source: "Existing Calvenn profile" },
    { label: "Licensed footprint", value: "Licensed in 30 states", status: "mapped", source: "Existing Calvenn profile" },
  ],
  relationship: [
    { label: "Gives", value: "Health and life insurance solutions · risk assessment · insurance expertise", status: "mapped", source: "Client-provided" },
    { label: "Wants", value: "Qualified leads and referral partnerships", status: "mapped", source: "Client-provided" },
    { label: "Opportunities / partners", value: "Referral partnerships are a stated goal; specific partners are not approved or mapped", status: "needs-setup", source: "Client-provided goal" },
    { label: "Network notes", value: "Agent OS research exists in the Reports tab; no summary is promoted here yet", status: "review", source: "Calvenn Agent OS" },
    { label: "Missing fields", value: "LinkedIn · email · phone · location · company entity · licenses / certifications · service specializations · geographic service area", status: "needs-setup", source: "Client-provided snapshot" },
  ],
  buildout: [
    { label: "Command Center", status: "Live preview", detail: "Branded dashboard shell and tenant-scoped navigation" },
    { label: "Content Review", status: "Live route", detail: "Review workspace remains approval-gated" },
    { label: "Web & Insights", status: "This module", detail: "Pages, funnels, reports, and context in one place" },
    { label: "Live outbound inbox", status: "Setup gated", detail: "Read-only conversation view; sending safeguards remain incomplete" },
  ],
} as const;

const calvennPartnership = {
  status: "Preview · needs setup",
  lastAnalyzed: "Calvenn-specific Partnership screenshot · analysis date not mapped",
  source: "User-provided Calvenn Partnership screenshot",
  weBringThem: [
    "No confirmed 'we bring them' partnership discussion is mapped into the canonical context store yet.",
  ],
  theyBringUs: [
    "No confirmed 'they bring us' partnership discussion is mapped into the canonical context store yet.",
  ],
  coopIdeas: [
    "No co-op idea is promoted here until an owner confirms it as a proposal.",
  ],
  terms: [
    "Commission percentages, referral terms, exclusivity, attribution, and payment timing are not discussed or established here.",
  ],
} as const;

const emptyLiveData: LiveDashboardData = {
  conversations: [],
  appointments: [],
  tasks: [],
  opportunities: { total: 0, open: 0, won: 0, lost: 0, abandoned: 0, stages: [] },
};

const demoData: LiveDashboardData = {
  conversations,
  appointments,
  tasks,
  opportunities: {
    total: 18,
    open: 9,
    won: 5,
    lost: 2,
    abandoned: 2,
    stages: [
      { label: "New lead", value: 4 },
      { label: "Needs follow-up", value: 3 },
      { label: "Consultation booked", value: 2 },
    ],
  },
};

const SYNTHETIC_DEMO_REVIEWS = [
  {
    id: "demo-review-001",
    title: "New lead replied",
    trigger: "A fictional lead replied to the benefits inquiry flow.",
    evidence: "Synthetic SMS reply: ‘I’m ready to compare options.’",
    suggestedAction: "Review the reply and prepare a discovery-call response.",
    rationale: "A timely human reply is the clearest next step in this demo queue.",
    humanAction: "A person decides whether the response is appropriate.",
    approvalBoundary: "No message is sent without human approval in native HighLevel.",
    draft: "Thanks for reaching out. I can help compare the options—what coverage date should we plan around?",
  },
  {
    id: "demo-review-002",
    title: "Missed call follow-up",
    trigger: "A fictional prospect missed a scheduled call.",
    evidence: "Synthetic call outcome: missed; no CRM record is changed.",
    suggestedAction: "Preview a short callback invitation for human review.",
    rationale: "A concise follow-up preserves momentum without assuming availability.",
    humanAction: "A person confirms the channel, wording, and timing.",
    approvalBoundary: "This demo cannot call, text, email, or create a task.",
    draft: "We missed you today. Would you like to choose another time for a quick benefits conversation?",
  },
  {
    id: "demo-review-003",
    title: "Appointment reminder",
    trigger: "A fictional consultation is approaching in the demo calendar.",
    evidence: "Synthetic appointment context only; no real booking or timestamp is used.",
    suggestedAction: "Preview a reminder that a person can approve later.",
    rationale: "A reminder can reduce no-shows, but the client must approve the exact message and timing.",
    humanAction: "A person verifies the appointment details before any reminder is considered.",
    approvalBoundary: "No booking, reminder, calendar change, or notification is created here.",
    draft: "Just checking in before your upcoming consultation. Reply here if you need anything before we meet.",
  },
  {
    id: "demo-review-004",
    title: "Medicare content approval",
    trigger: "A fictional Medicare content item is ready for review.",
    evidence: "Synthetic draft title: ‘A plain-language Medicare coverage checklist.’",
    suggestedAction: "Preview the draft and decide whether it needs edits.",
    rationale: "Content approval stays separate from publishing so the owner controls what goes live.",
    humanAction: "A person approves, requests changes, or leaves the draft in review.",
    approvalBoundary: "Nothing is approved, published, or scheduled from this demo card.",
    draft: "Draft preview only: a plain-language checklist to help readers prepare Medicare questions.",
  },
] as const;

function clientConfigFromQuery(params: URLSearchParams): ClientConfig {
  const locationId = params.get("locationId")?.trim() ?? "";
  const requestedName = params.get("clientName")?.trim() ?? "";
  const isKevin =
    locationId === "B2WqoVF535ixA9CbywEh" || /station survival|kevin/i.test(requestedName);
  const isAdaptive = locationId === "mR9xcnpfPlueBXs9yIk9" || /adaptive crm/i.test(requestedName);
  const isCalvenn = locationId === "QsbCjo5HFBGuRG0AKms0";
  const name =
    requestedName ||
    (isKevin
      ? "Station Survival Co."
      : isAdaptive
        ? "Adaptive CRM Core — Master"
        : isCalvenn
          ? "Your Best Health Quote"
          : "Client");
  const branding = brandingForLocation(locationId);
  return {
    locationId,
    name,
    logoUrl: params.get("logoUrl")?.trim() || branding.logoUrl,
    greetingName: branding.greetingName,
    reviewUrl: params.get("reviewUrl")?.trim() || "",
    websiteUrl:
      params.get("websiteUrl")?.trim() ||
      (isKevin
        ? "https://stationsurvivalco.com"
        : isCalvenn
          ? "https://yourbesthealthquote.vercel.app/"
          : ""),
    websiteName:
      params.get("websiteName")?.trim() ||
      (isKevin
        ? "Station Survival Co. website"
        : isCalvenn
          ? "Your Best Health Quote"
          : "Client website"),
    footerLabel:
      params.get("footerLabel")?.trim() ||
      (isKevin
        ? "Firefighter gear view"
        : isCalvenn
          ? "Healthcare sales view"
          : "Client command center"),
    footerText:
      params.get("footerText")?.trim() ||
      (isKevin
        ? "A focused workspace configured around Station Survival Co.'s gear, content, and customer conversations."
        : isCalvenn
          ? "A focused workspace configured around the work Calvenn actually needs to do."
          : `A focused workspace configured around the work ${name} actually needs to do.`),
    primaryColor: params.get("primaryColor")?.trim() || branding.primaryColor,
    accentColor: params.get("accentColor")?.trim() || branding.accentColor,
    inkColor: params.get("inkColor")?.trim() || branding.inkColor,
    mutedColor: params.get("mutedColor")?.trim() || branding.mutedColor,
  };
}

function formatRelativeTime(value?: string) {
  if (!value) return "recently";
  const timestamp = new Date(value).getTime();
  if (!Number.isFinite(timestamp)) return "recently";
  const minutes = Math.max(1, Math.round((Date.now() - timestamp) / 60000));
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.round(hours / 24)}d`;
}

function formatAppointmentTime(value?: string) {
  if (!value) return "Time to confirm";
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatAppointmentSummary(appointment: LiveAppointment, demoMode: boolean) {
  const demoTimeLabel = (appointment as LiveAppointment & { demoTimeLabel?: string }).demoTimeLabel;
  const timeLabel = demoMode && demoTimeLabel ? demoTimeLabel : formatAppointmentTime(appointment.startTime);
  return `${appointment.title} · ${timeLabel}`;
}

function formatDueDate(value?: string) {
  if (!value) return "No due date";
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(date);
}

function personalGreetingName(displayName: string | undefined, workspaceName: string) {
  const value = displayName?.trim() ?? "";
  if (!value || value.includes("@") || value.toLowerCase() === workspaceName.trim().toLowerCase()) {
    return "";
  }
  const firstName = value.split(/\s+/)[0]?.replace(/[^\p{L}'’-]/gu, "") ?? "";
  return firstName.length >= 2 ? firstName : "";
}

const HIGHLEVEL_PARENT_ORIGINS = new Set([
  "https://app.gohighlevel.com",
  "https://app.leadconnectorhq.com",
  "https://app.msgsndr.com",
  "https://app.manifestic.ai",
]);

function requestHighLevelSignedContext(timeoutMs = 2500) {
  if (typeof window === "undefined" || window.parent === window) return Promise.resolve<string | null>(null);
  return new Promise<string | null>((resolve) => {
    let settled = false;
    let timeout: number;
    let retry: number;
    const finish = (value: string | null) => {
      if (settled) return;
      settled = true;
      window.removeEventListener("message", handleMessage);
      window.clearTimeout(timeout);
      window.clearInterval(retry);
      resolve(value);
    };
    const handleMessage = (event: MessageEvent) => {
      if (!HIGHLEVEL_PARENT_ORIGINS.has(event.origin)) return;
      const data = event.data as { message?: unknown; payload?: unknown };
      if (data?.message !== "REQUEST_USER_DATA_RESPONSE") return;
      finish(typeof data.payload === "string" ? data.payload : null);
    };
    // A custom HighLevel menu item can add one more iframe around the
    // Command Center. Ask both the immediate wrapper and the top-level shell;
    // this keeps stable launcher links working without putting a bearer token
    // in the saved URL.
    const targets = [window.parent, window.top].filter(
      (target, index, values): target is Window => Boolean(target) && values.indexOf(target) === index,
    );
    const sendRequest = () => {
      for (const target of targets) target.postMessage({ message: "REQUEST_USER_DATA" }, "*");
    };
    window.addEventListener("message", handleMessage);
    // HighLevel may still be restoring the dashboard after a browser restart.
    // Retry briefly while it initializes, but never hold the shell behind a
    // long authentication timeout.
    sendRequest();
    retry = window.setInterval(sendRequest, 500);
    timeout = window.setTimeout(() => finish(null), timeoutMs);
  });
}

function ClientCommandCenter() {
  const [hydrated, setHydrated] = useState(false);
  const [authState, setAuthState] = useState<AuthState>({ status: "loading" });
  const [demoMode, setDemoMode] = useState(false);
  const [activeSection, setActiveSection] = useState<DashboardSection>("overview");
  const [websiteTab, setWebsiteTab] = useState<WebsiteTab>("pages");
  const [selectedConversation, setSelectedConversation] = useState(conversations[0].name);
  const [selectedConversationId, setSelectedConversationId] = useState<string | undefined>();
  const [showAllMessages, setShowAllMessages] = useState(false);
  const [liveState, setLiveState] = useState<LiveState>({ status: "idle", data: emptyLiveData });
  const [client, setClient] = useState<ClientConfig>({
    locationId: "",
    name: "Client",
    logoUrl: "",
    greetingName: undefined,
    reviewUrl: "",
    websiteUrl: "",
    websiteName: "Client website",
    footerLabel: "Client command center",
    footerText: "A focused workspace for the work this client actually needs to do.",
    primaryColor: "#1377b8",
    accentColor: "#0e9a85",
    inkColor: "#102336",
    mutedColor: "#466174",
  });
  const ghl = (path: string) =>
    client.locationId
      ? `https://app.gohighlevel.com/v2/location/${encodeURIComponent(client.locationId)}${path}`
      : undefined;
  const contentReviewHref =
    client.locationId === "QsbCjo5HFBGuRG0AKms0"
      ? ghl("/custom-menu-link/473f9ef0-f446-4725-8f22-4e0e60af04f3")
      : client.reviewUrl || undefined;
  const goToSection = (section: DashboardSection) => {
    setActiveSection(section);
    const params = new URLSearchParams(window.location.search);
    if (section === "overview") params.delete("section");
    else params.set("section", section);
    if (section === "websites") params.set("websiteTab", websiteTab);
    else params.delete("websiteTab");
    window.history.pushState(
      {},
      "",
      `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`,
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const goToWebsiteTab = (tab: WebsiteTab) => {
    setActiveSection("websites");
    setWebsiteTab(tab);
    const params = new URLSearchParams(window.location.search);
    params.set("section", "websites");
    params.set("websiteTab", tab);
    window.history.pushState(
      {},
      "",
      `${window.location.pathname}?${params.toString()}`,
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const setDemoModeFromUser = (next: boolean) => {
    const params = new URLSearchParams(window.location.search);
    if (next) params.set("demo", "1");
    else params.delete("demo");
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`,
    );
    setDemoMode(next);
  };
  const refreshLiveData = async () => {
    if (!client.locationId || authState.status !== "authenticated") return;
    setLiveState((current) => ({ ...current, status: "loading", message: undefined }));
    try {
      // HighLevel embeds are third-party iframes. Some browsers delay or block
      // the SameSite=None session cookie, even after /api/auth succeeds. Reuse
      // the already-signed, tenant-scoped embed token for this read-only request
      // so the live dashboard does not silently fall back to preview mode.
      const dataParams = new URLSearchParams({ locationId: client.locationId });
      const embedToken = new URLSearchParams(window.location.search).get("embedToken")?.trim();
      if (embedToken) dataParams.set("embedToken", embedToken);
      const response = await fetch(
        `/api/dashboard-data?${dataParams.toString()}`,
        { cache: "no-store" },
      );
      const payload = (await response.json()) as {
        configured?: boolean;
        data?: LiveDashboardData;
        generatedAt?: string;
        message?: string;
        sources?: Record<string, string>;
      };
      if (!response.ok || !payload.data) {
        throw new Error(payload.message ?? "HighLevel data is not connected yet.");
      }
      setLiveState({
        status: "ready",
        data: payload.data,
        generatedAt: payload.generatedAt,
        sources: payload.sources,
      });
    } catch (error) {
      setLiveState({
        status: "error",
        data: emptyLiveData,
        message: error instanceof Error ? error.message : "Unable to load live HighLevel data.",
      });
    }
  };

  useEffect(() => {
    setHydrated(true);
    const params = new URLSearchParams(window.location.search);
    setDemoMode(["1", "true", "yes"].includes((params.get("demo") ?? "").toLowerCase()));
    const requestedLocationId = params.get("locationId")?.trim() ?? "";
    void (async () => {
      if (requestedLocationId) {
        const requestedClient = clientConfigFromQuery(params);
        setClient(requestedClient);
      }
      try {
        const embedToken = params.get("embedToken")?.trim() ?? "";
        let response: Response | null = null;
        type AuthPayload = {
          authenticated?: boolean;
          user?: AuthState["user"];
          message?: string;
        };
        let payload: AuthPayload | undefined;
        const encryptedContext = await requestHighLevelSignedContext();
        if (encryptedContext) {
          const handoffResponse = await fetch("/api/auth", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ action: "highlevel_context", encryptedData: encryptedContext }),
            cache: "no-store",
          });
          const handoffPayload = (await handoffResponse.json()) as AuthPayload;
          if (handoffResponse.ok && handoffPayload.authenticated && handoffPayload.user) {
            response = handoffResponse;
            payload = handoffPayload;
          }
        }
        if (!payload) {
          const authUrl = embedToken
            ? `/api/auth?embedToken=${encodeURIComponent(embedToken)}`
            : "/api/auth";
          response = await fetch(authUrl, { cache: "no-store" });
          payload = (await response.json()) as AuthPayload;
        }
        const authPayload = payload;
        if (!response || !authPayload) throw new Error("Authentication is unavailable.");
        if (!response.ok || !authPayload.authenticated || !authPayload.user) {
          setAuthState({
            status: response.status === 503 ? "error" : "unauthenticated",
            message: authPayload.message,
          });
          return;
        }
        if (
          embedToken &&
          requestedLocationId &&
          authPayload.user.locationId &&
          authPayload.user.locationId !== requestedLocationId
        ) {
          setAuthState({
            status: "error",
            message: "The workspace connection belongs to a different HighLevel location.",
          });
          return;
        }
        setAuthState({ status: "authenticated", user: authPayload.user });
        const hydratedParams = new URLSearchParams(window.location.search);
        hydratedParams.set("locationId", authPayload.user.locationId || requestedLocationId);
        hydratedParams.set(
          "clientName",
          embedToken
            ? params.get("clientName")?.trim() || authPayload.user.clientName || "Client"
            : authPayload.user.clientName || "Client",
        );
        const tenantResponse = await fetch("/api/tenant", { cache: "no-store" }).catch(() => null);
        if (tenantResponse?.ok) {
          const tenantPayload = (await tenantResponse.json().catch(() => ({}))) as {
            profile?: Record<string, unknown>;
          };
          const profile = tenantPayload.profile ?? {};
          for (const [key, value] of [
            ["websiteUrl", profile.websiteUrl],
            ["logoUrl", profile.logoUrl],
            ["primaryColor", profile.primaryColor],
            ["accentColor", profile.accentColor],
            ["inkColor", profile.inkColor],
            ["mutedColor", profile.mutedColor],
          ] as const) {
            if (typeof value === "string" && value.trim()) hydratedParams.set(key, value.trim());
          }
        }
        const hydratedClient = clientConfigFromQuery(hydratedParams);
        setClient(hydratedClient);
        if (!hydratedClient.reviewUrl && hydratedClient.locationId) {
          void fetch(
            `/api/review-url?locationId=${encodeURIComponent(hydratedClient.locationId)}`,
            { cache: "no-store" },
          )
            .then(async (reviewResponse) => {
              if (!reviewResponse.ok) return;
              const reviewPayload = (await reviewResponse.json()) as { reviewUrl?: unknown };
              const reviewUrl =
                typeof reviewPayload.reviewUrl === "string" ? reviewPayload.reviewUrl.trim() : "";
              if (reviewUrl) setClient((current) => ({ ...current, reviewUrl }));
            })
            .catch(() => undefined);
        }
      } catch (error) {
        setAuthState({
          status: "error",
          message: error instanceof Error ? error.message : "Authentication is unavailable.",
        });
      }
    })();
    const requestedSection = params.get("section") as DashboardSection | null;
    if (
      requestedSection &&
        ["getting-started", "overview", "inbox", "calendar", "opportunities", "content", "websites", "reports"].includes(
        requestedSection,
      )
    )
      setActiveSection(requestedSection);
    const requestedWebsiteTab = params.get("websiteTab") as WebsiteTab | null;
    if (requestedWebsiteTab && ["pages", "funnels", "reports", "intelligence", "partnership"].includes(requestedWebsiteTab))
      setWebsiteTab(requestedWebsiteTab);
    const onPopState = () =>
      (() => {
        const nextParams = new URLSearchParams(window.location.search);
        setActiveSection(
          (nextParams.get("section") as DashboardSection | null) || "overview",
        );
        const nextWebsiteTab = nextParams.get("websiteTab") as WebsiteTab | null;
        if (nextWebsiteTab && ["pages", "funnels", "reports", "intelligence", "partnership"].includes(nextWebsiteTab))
          setWebsiteTab(nextWebsiteTab);
        else setWebsiteTab("pages");
      })();
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (!client.locationId || demoMode) return;
    void refreshLiveData();
    const interval = window.setInterval(() => void refreshLiveData(), 60_000);
    return () => window.clearInterval(interval);
  }, [client.locationId, authState.status, demoMode]);

  if (!hydrated) {
    return <DashboardBootScreen />;
  }

  if (authState.status === "loading") return <DashboardBootScreen />;
  if (authState.status !== "authenticated")
    return (
      <CommandCenterLogin error={authState.message} unavailable={authState.status === "error"} />
    );

  const clientDataRequested = Boolean(client.locationId);
  const liveSourceStatus = liveState.sources?.status;
  const demoDataActive = demoMode || !clientDataRequested;
  const isLive = Boolean(
    !demoMode &&
    client.locationId && liveState.status === "ready" && liveSourceStatus === "live",
  );
  const isPartial = Boolean(
    !demoMode &&
    client.locationId && liveState.status === "ready" && liveSourceStatus === "partial",
  );
  const calendarReadAvailable = liveState.sources?.appointments === "live";
  const visibleConversations = demoDataActive ? demoData.conversations : liveState.data.conversations;
  const visibleAppointments = demoDataActive ? demoData.appointments : liveState.data.appointments;
  const visibleTasks = demoDataActive ? demoData.tasks : liveState.data.tasks;
  const visibleOpportunities = demoDataActive
    ? demoData.opportunities
    : liveState.data.opportunities;
  const unreadCount = demoDataActive
    ? demoData.conversations.reduce(
        (total, item) => total + (item.unread ? 1 : 0),
        0,
      )
    : visibleConversations.reduce(
        (total, item) =>
          total + Math.max(0, Number((item as LiveConversation).unreadCount ?? 0) || 0),
        0,
      );
  const firstAppointment = visibleAppointments[0];
  const sectionLabels: Record<DashboardSection, string> = {
    "getting-started": "Getting Started",
    overview: "Dashboard",
    inbox: "Inbox",
    calendar: "Calendar",
    opportunities: "Opportunities",
    content: "Content Review",
    websites: "Web & Insights",
    reports: "Reports",
  };
  const activeLabel = sectionLabels[activeSection];
  const greetingName =
    client.greetingName || personalGreetingName(authState.user?.displayName, client.name);

  return (
    <main
      className="ybq-dashboard min-h-screen overflow-x-hidden bg-[#f5f8fb] text-[#102336]"
      style={
        {
          "--ybq-blue": client.primaryColor,
          "--ybq-teal": client.accentColor,
          "--ybq-ink": client.inkColor,
          "--ybq-muted": client.mutedColor,
        } as CSSProperties
      }
    >
      <style>{`
        .ybq-dashboard { --ybq-blue:#1377b8; --ybq-teal:#0e9a85; --ybq-ink:#102336; --ybq-muted:#466174; --ybq-line:#dbe5ed; --ybq-amber:#8a5200; --ybq-green:#087b68; }
        .ybq-dashboard aside { background:#fff!important; border-color:var(--ybq-line)!important; }
        .ybq-dashboard [class*="bg-[#0b0f1a]"], .ybq-dashboard [class*="bg-white/[0.025]"], .ybq-dashboard [class*="bg-white/[0.035]"], .ybq-dashboard [class*="bg-white/[0.04]"], .ybq-dashboard [class*="bg-white/[0.045]"] { background:#fff!important; }
        .ybq-dashboard [class*="border-white/"] { border-color:var(--ybq-line)!important; }
        .ybq-dashboard [class*="text-white"], .ybq-dashboard [class*="text-slate-100"], .ybq-dashboard [class*="text-slate-200"], .ybq-dashboard [class*="text-slate-300"] { color:var(--ybq-ink)!important; }
        .ybq-dashboard [class*="text-slate-400"], .ybq-dashboard [class*="text-slate-500"], .ybq-dashboard [class*="text-slate-600"] { color:var(--ybq-muted)!important; }
        .ybq-dashboard [class*="text-cyan-"] { color:var(--ybq-blue)!important; }
        .ybq-dashboard [class*="text-violet-"] { color:var(--ybq-teal)!important; }
        .ybq-dashboard [class*="text-amber-"] { color:var(--ybq-amber)!important; }
        .ybq-dashboard [class*="text-emerald-"] { color:var(--ybq-green)!important; }
        .ybq-dashboard [class*="bg-cyan-"] { background-color:#e8f4fa!important; }
        .ybq-dashboard [class*="bg-violet-"] { background-color:#e8f5f4!important; }
        .ybq-dashboard [class*="bg-amber-"] { background-color:#fff4e6!important; }
        .ybq-dashboard [class*="bg-emerald-"] { background-color:#e9f7f1!important; }
        .ybq-dashboard [class*="text-slate-950"] { color:#fff!important; }
        .ybq-dashboard a[class*="bg-cyan-"], .ybq-dashboard button[class*="bg-cyan-"] { background:var(--ybq-blue)!important; color:#fff!important; }
        .ybq-dashboard .ybq-latest-message { background:#167db8!important; border-color:#3aa9d6!important; color:#fff!important; }
        .ybq-dashboard .ybq-latest-message .ybq-latest-message-label,
        .ybq-dashboard .ybq-latest-message .ybq-latest-message-time,
        .ybq-dashboard .ybq-latest-message .ybq-latest-message-name,
        .ybq-dashboard .ybq-latest-message .ybq-latest-message-preview,
        .ybq-dashboard .ybq-latest-message .ybq-latest-message-meta { color:#fff!important; }
      `}</style>
      <div className="pointer-events-none fixed inset-0 -z-0 bg-[radial-gradient(circle_at_78%_0%,rgba(19,119,184,0.09),transparent_30%),radial-gradient(circle_at_12%_28%,rgba(14,154,133,0.07),transparent_28%)]" />
      <div className="relative z-10 flex min-h-screen">
        <section className="min-w-0 flex-1 px-4 py-5 sm:px-7 lg:px-10 lg:py-8">
          <header className="mx-auto max-w-[1380px]">
            <nav aria-label="Command Center sections" className="overflow-x-auto rounded-2xl border border-[#dbe5ed] bg-white/80 p-2 shadow-[0_14px_35px_-28px_rgba(16,35,54,0.6)]">
              <div className="flex min-w-max items-center gap-1">
                <SideNavItem top icon={CheckCircle2} label="Getting Started" active={activeSection === "getting-started"} onClick={() => goToSection("getting-started")} />
                <SideNavItem top icon={LayoutDashboard} label="Dashboard" active={activeSection === "overview"} onClick={() => goToSection("overview")} />
                <SideNavItem top icon={Inbox} label="Inbox" badge={`${unreadCount}`} active={activeSection === "inbox"} onClick={() => goToSection("inbox")} />
                <SideNavItem top icon={CalendarDays} label="Calendar" active={activeSection === "calendar"} onClick={() => goToSection("calendar")} />
                <SideNavItem top icon={UsersRound} label="Opportunities" active={activeSection === "opportunities"} onClick={() => goToSection("opportunities")} />
                <SideNavItem top icon={MessageCircle} label="Content Review" active={activeSection === "content"} onClick={() => goToSection("content")} />
                <SideNavItem top icon={Globe2} label="Web & Insights" active={activeSection === "websites"} onClick={() => goToSection("websites")} />
              </div>
            </nav>

            <div className="mt-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                  Client Command Center
                </p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                  {activeSection === "overview"
                    ? greetingName
                      ? `Welcome, ${greetingName}.`
                      : "Welcome."
                    : activeLabel}
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
                  {activeSection === "overview"
                    ? "Today’s docket, next moves, conversations, and follow-up in one focused view."
                    : `A focused ${activeLabel.toLowerCase()} workspace inside the Command Center.`}
                </p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#dbe5ed] bg-white/75 px-3 py-2.5 shadow-[0_12px_30px_-26px_rgba(16,35,54,0.7)]">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                <span className="inline-flex items-center gap-2 font-medium">
                  <span
                    className={`h-2 w-2 rounded-full ${demoDataActive ? "bg-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.7)]" : isLive ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" : isPartial ? "bg-amber-300" : "bg-red-400"}`}
                  />
                  {demoDataActive
                    ? "Demo data · synthetic values"
                    : isLive
                      ? "Live HighLevel data"
                      : isPartial
                        ? "Partial HighLevel data"
                        : client.locationId
                          ? "HighLevel connection unavailable"
                          : "Demo workspace · Sample data"}
                </span>
                <span className="inline-flex items-center gap-2">
                  <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
                  {demoMode
                    ? "Synthetic demo state"
                    : liveState.generatedAt
                      ? `Updated ${formatRelativeTime(liveState.generatedAt)} ago`
                      : "Updated just now"}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {client.locationId && (
                  <button
                    type="button"
                    aria-pressed={demoMode}
                    className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition ${demoMode ? "border-amber-300/50 bg-amber-100 text-amber-900 hover:bg-amber-200" : "border-white/[0.09] bg-white/[0.035] text-slate-300 hover:bg-white/[0.08]"}`}
                    onClick={() => setDemoModeFromUser(!demoMode)}
                  >
                    {demoMode ? "Hide demo data" : "Show demo data"}
                  </button>
                )}
                {client.locationId && (
                  <button
                    type="button"
                    aria-label="Refresh live data"
                    className="inline-flex items-center gap-2 rounded-lg border border-white/[0.09] bg-white/[0.035] px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/[0.08] disabled:opacity-50"
                    onClick={() => void refreshLiveData()}
                    disabled={liveState.status === "loading"}
                  >
                    <RefreshCw
                      className={`h-3.5 w-3.5 ${liveState.status === "loading" ? "animate-spin" : ""}`}
                    />
                    Refresh
                  </button>
                )}
              </div>
            </div>
            {demoDataActive && (
              <div className="mt-6 rounded-xl border border-amber-300/60 bg-amber-50 px-4 py-3 text-sm text-amber-950 shadow-[0_12px_28px_-22px_rgba(146,64,14,0.8)]">
                <p className="font-bold uppercase tracking-[0.12em]">Demo data · synthetic review-only</p>
                <p className="mt-1 text-xs leading-relaxed">This demonstration uses fictional records and demo-only IDs. Nothing here reads from, writes to, sends, publishes, books, or activates automation in HighLevel.</p>
              </div>
            )}
            {!demoMode && liveState.status === "error" && (
              <div className="mt-6 rounded-xl border border-amber-300/20 bg-amber-300/[0.05] px-4 py-3 text-xs text-amber-100">
                Live data is not available yet: {liveState.message}
              </div>
            )}
            {!demoMode && liveState.status === "loading" && (
              <div className="mt-6 rounded-xl border border-cyan-300/20 bg-cyan-300/[0.05] px-4 py-3 text-xs text-cyan-800">
                Loading live HighLevel data…
              </div>
            )}
            {isPartial && (
              <div className="mt-6 rounded-xl border border-amber-300/25 bg-amber-300/[0.08] px-4 py-3 text-xs text-amber-800">
                Some HighLevel sources are temporarily unavailable. Conversation data is labeled
                separately from calendar and task data.
              </div>
            )}
            {activeSection === "getting-started" ? (
              <GettingStartedView
                client={client}
                isLive={isLive || isPartial}
                calendarReadAvailable={calendarReadAvailable}
                calendarSettingsHref={ghl("/settings/calendars")}
                plannerHref={ghl("/marketing/social-planner")}
                socialMessagingHref={ghl("/settings/lc-integrations")}
              />
            ) : activeSection === "overview" ? (
              <PortalOverview
                client={client}
                isLive={isLive || isPartial}
                conversations={visibleConversations}
                appointments={visibleAppointments}
                tasks={visibleTasks}
                opportunities={visibleOpportunities}
                unreadCount={unreadCount}
                onGoToSection={goToSection}
                demoMode={demoMode}
                inboxHref={ghl("/conversations/conversations/?category=team-inbox&tab=unread")}
                calendarHref={ghl("/calendars/view")}
                opportunitiesHref={ghl("/opportunities/list")}
                emailHref={ghl("/marketing/emails/statistics")}
                plannerHref={ghl("/marketing/social-planner")}
              />
            ) : (
              <DashboardSectionView
                client={client}
                section={activeSection}
                conversations={visibleConversations}
                appointments={visibleAppointments}
                tasks={visibleTasks}
                opportunities={visibleOpportunities}
                live={isLive || isPartial}
                unreadCount={unreadCount}
                onSelectConversation={(name) => {
                  setSelectedConversation(name);
                  setSelectedConversationId(
                    (visibleConversations as LiveConversation[]).find(
                      (conversation) => conversation.name === name,
                    )?.id,
                  );
                }}
                onOpenInbox={() => setShowAllMessages(true)}
                websiteTab={websiteTab}
                onWebsiteTabChange={goToWebsiteTab}
                inboxHref={ghl("/conversations/conversations/?category=team-inbox&tab=unread")}
                calendarHref={ghl("/calendars/view")}
                calendarSettingsHref={ghl("/settings/calendars")}
                opportunitiesHref={ghl("/opportunities/list")}
                plannerHref={ghl("/marketing/social-planner")}
                contentReviewHref={contentReviewHref}
              />
            )}
            <div className="border-t border-white/[0.07] py-6 text-xs leading-relaxed text-slate-600">
              {isLive || isPartial
                ? "Live read-only HighLevel data · Actions that send or change records open in native HighLevel."
                : "Demo preview · Add the scoped HighLevel server credential to replace sample records with live data."}
            </div>
          </header>
        </section>
      </div>
      {showAllMessages && (
        <LiveInboxModal
          conversations={visibleConversations}
          live={isLive || isPartial}
          selectedConversationId={selectedConversationId}
          onClose={() => setShowAllMessages(false)}
          inboxHref={ghl("/conversations/conversations/?category=team-inbox&tab=unread")}
        />
      )}
    </main>
  );
}

function DashboardBootScreen() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f8fb] px-6 text-[#102336]">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 via-blue-500 to-violet-500 text-lg font-black text-slate-950 shadow-[0_0_28px_rgba(59,130,246,0.35)]">
          M
        </div>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
          Client Command Center
        </p>
        <p className="mt-2 text-sm text-slate-500">Loading your workspace…</p>
      </div>
    </main>
  );
}

function SideNavItem({
  icon: Icon,
  label,
  active,
  badge,
  href,
  newTab,
  onClick,
  top,
}: {
  icon: IconType;
  label: string;
  active?: boolean;
  badge?: string;
  href?: string;
  newTab?: boolean;
  onClick?: () => void;
  top?: boolean;
}) {
  const className = top
    ? `inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium whitespace-nowrap transition ${active ? "bg-[#e8f4fa] text-[#1377b8]" : "text-[#466174] hover:bg-[#f1f7fa] hover:text-[#102336]"}`
    : `flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left ${active ? "bg-cyan-300/10 text-cyan-100" : "text-slate-500 hover:bg-white/[0.04] hover:text-slate-200"}`;
  const content = (
    <>
      <Icon className="h-4 w-4" />
      <span className="flex-1">{label}</span>
      {badge && (
        <span className={top ? "rounded-full bg-[#dff3ef] px-1.5 py-0.5 text-[10px] text-[#087b68]" : "rounded-full bg-violet-400/15 px-1.5 py-0.5 text-[10px] text-violet-200"}>
          {badge}
        </span>
      )}
    </>
  );
  return href ? (
    <a
      className={className}
      href={href}
      target={newTab ? "_blank" : "_top"}
      rel={newTab ? "noopener noreferrer" : "noreferrer"}
    >
      {content}
    </a>
  ) : (
    <button type="button" className={className} onClick={onClick}>
      {content}
    </button>
  );
}

function SummaryStat({
  icon: Icon,
  label,
  value,
  detail,
  tone,
}: {
  icon: IconType;
  label: string;
  value: string;
  detail: string;
  tone: "amber" | "cyan" | "violet";
}) {
  const toneClass = {
    amber: "border-amber-300/20 bg-amber-300/[0.05] text-amber-200",
    cyan: "border-cyan-300/20 bg-cyan-300/[0.05] text-cyan-200",
    violet: "border-violet-300/20 bg-violet-300/[0.05] text-violet-200",
  }[tone];
  return (
    <div className={`rounded-2xl border p-4 ${toneClass}`}>
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em]">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="text-xl font-semibold text-white">{value}</p>
        <p className="text-right text-[11px] text-slate-500">{detail}</p>
      </div>
    </div>
  );
}

function CardHeading({
  icon: Icon,
  eyebrow,
  title,
  action,
  actionHref,
}: {
  icon: IconType;
  eyebrow: string;
  title: string;
  action?: string;
  actionHref?: string;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-cyan-200">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            {eyebrow}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-white">{title}</h3>
        </div>
      </div>
      {action &&
        (actionHref ? (
          <a
            href={actionHref}
            target="_top"
            rel="noreferrer"
            className="inline-flex items-center gap-1 self-end text-xs font-medium text-cyan-300 transition hover:text-cyan-100 sm:self-auto"
          >
            {action}
            <ChevronRight className="h-3.5 w-3.5" />
          </a>
        ) : (
          <span className="inline-flex items-center gap-1 self-end text-xs font-medium text-slate-500 sm:self-auto">
            {action}
          </span>
        ))}
    </div>
  );
}

function QuickLink({
  href,
  label,
  icon: Icon,
  target = "_top",
}: {
  href?: string;
  label: string;
  icon: IconType;
  target?: "_top" | "_blank";
}) {
  const className =
    "inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-300/[0.07] px-3 py-2.5 text-[11px] font-semibold text-cyan-300 transition hover:bg-cyan-300/[0.14]";
  return href ? (
    <a href={href} target={target} rel="noreferrer" className={className}>
      <Icon className="h-3.5 w-3.5" />
      {label}
    </a>
  ) : (
    <span className={`${className} cursor-not-allowed text-slate-500`}>
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}

function CommandCenterLogin({ error, unavailable }: { error?: string; unavailable?: boolean }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(error ?? "");
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const payload = (await response.json()) as { authenticated?: boolean; message?: string };
      if (!response.ok || !payload.authenticated)
        throw new Error(payload.message ?? "That login was not authorized for this workspace.");
      window.location.reload();
    } catch (loginError) {
      setMessage(loginError instanceof Error ? loginError.message : "Unable to sign in.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f8fb] px-6 text-[#102336]">
      <div className="w-full max-w-md rounded-3xl border border-[#dbe5ed] bg-white p-8 shadow-[0_24px_80px_-40px_rgba(16,35,54,0.38)]">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8f4fa] text-xl font-black text-[#1377b8]">
            M
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1377b8]">
              Client Command Center
            </p>
            <h1 className="mt-1 text-xl font-semibold">Your workspace</h1>
          </div>
        </div>
        <p className="mt-7 text-sm leading-relaxed text-[#466174]">
          Sign in to view this workspace. Conversations are scoped to the active client account,
          and sending remains disabled here.
        </p>
        {unavailable ? (
          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Authentication is not configured on this deployment yet.
          </div>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={submit}>
            <label className="block text-sm font-medium">
              Email
              <input
                required
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-xl border border-[#dbe5ed] px-3 py-3 outline-none focus:border-[#1377b8]"
              />
            </label>
            <label className="block text-sm font-medium">
              Password
              <input
                required
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-xl border border-[#dbe5ed] px-3 py-3 outline-none focus:border-[#1377b8]"
              />
            </label>
            {message && (
              <p
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
              >
                {message}
              </p>
            )}
            <button
              disabled={busy}
              className="w-full rounded-xl bg-[#1377b8] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

function MobileAppLinks({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "flex flex-wrap gap-2" : "grid gap-2 sm:grid-cols-2"}>
      {MOBILE_APP_LINKS.map(({ label, detail, href }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer"
          className="group flex items-center gap-3 rounded-2xl border border-[#b9d7e2] bg-white/80 p-3 transition hover:-translate-y-0.5 hover:border-[#1377b8] hover:bg-white"
        >
          <span className="rounded-xl bg-[#e8f4fb] p-2 text-[#1377b8]">
            <Smartphone className="h-4 w-4" />
          </span>
          <span className="min-w-0">
            <span className="block text-xs font-semibold text-[#102336]">{label}</span>
            {!compact && <span className="mt-0.5 block truncate text-[10px] text-[#466174]">{detail}</span>}
          </span>
          <ArrowUpRight className="ml-auto h-3.5 w-3.5 shrink-0 text-[#8aa7b5] transition group-hover:text-[#1377b8]" />
        </a>
      ))}
    </div>
  );
}

function SetupStatusGrid({
  calendarReadAvailable,
  calendarSettingsHref,
  plannerHref,
  socialMessagingHref,
}: SetupStatusGridProps) {
  const items = [
    {
      label: "Social channels",
      status: "Needs verification",
      detail:
        "Connect Facebook, Instagram, and other publishing channels in Social Planner before scheduling approved content.",
      icon: Instagram,
      href: plannerHref,
      action: "Connect social channels",
    },
    {
      label: "Social messages",
      status: "Needs verification",
      detail:
        "Connect DM and messaging integrations in HighLevel so social conversations can be routed for review.",
      icon: MessageCircle,
      href: socialMessagingHref,
      action: "Open messaging integrations",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <CalendarSetupCard
        calendarReadAvailable={calendarReadAvailable}
        calendarSettingsHref={calendarSettingsHref}
      />
      {items.map(({ label, status, detail, icon: Icon, href, action }) => (
        <article key={label} className="rounded-2xl border border-[#dbe5ed] bg-white/85 p-5 shadow-[0_14px_30px_-26px_rgba(16,35,54,0.55)]">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <span className="rounded-xl bg-[#e8f4fb] p-2.5 text-[#1377b8]"><Icon className="h-5 w-5" /></span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#102336]">{label}</p>
                <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.08em] ${status === "Live read" ? "bg-[#e7f6f1] text-[#087b68]" : "bg-[#fff4e6] text-[#8a5200]"}`}>{status}</span>
              </div>
            </div>
            <CheckCircle2 className={`h-4 w-4 shrink-0 ${status === "Live read" ? "text-[#087b68]" : "text-[#8aa7b5]"}`} />
          </div>
          <p className="mt-4 text-xs leading-relaxed text-[#466174]">{detail}</p>
          {href && (
            <a href={href} target="_top" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[#b9d7e2] bg-white px-3 py-2.5 text-[11px] font-semibold text-[#1377b8] transition hover:border-[#1377b8] hover:bg-[#eef8fb]">
              {action} <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          )}
        </article>
      ))}
      <article className="rounded-2xl border border-[#dbe5ed] bg-white/85 p-5 shadow-[0_14px_30px_-26px_rgba(16,35,54,0.55)]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <span className="rounded-xl bg-[#e8f4fb] p-2.5 text-[#1377b8]"><Smartphone className="h-5 w-5" /></span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#102336]">Mobile access</p>
              <span className="mt-2 inline-flex rounded-full bg-[#e7f6f1] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.08em] text-[#087b68]">Install available</span>
            </div>
          </div>
          <CheckCircle2 className="h-4 w-4 shrink-0 text-[#087b68]" />
        </div>
        <p className="mt-4 text-xs leading-relaxed text-[#466174]">Use the LeadConnector app with the same HighLevel credentials. Install it on iPhone or Android.</p>
        <div className="mt-4"><MobileAppLinks /></div>
      </article>
    </div>
  );
}

function CalendarSetupCard({
  calendarReadAvailable,
  calendarSettingsHref,
}: {
  calendarReadAvailable: boolean;
  calendarSettingsHref?: string;
}) {
  const [request, setRequest] = useState<CalendarRequestFormState>({
    calendarType: PROPOSED_CALENDAR_TYPES[0],
    serviceName: PROPOSED_CALENDAR_TYPES[0],
    durationMinutes: "30",
    availability: "",
    bufferRules: "",
    assignedUser: "",
    bookingPageDestination: "",
  });
  const [requestStatus, setRequestStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [requestMessage, setRequestMessage] = useState("");

  const chooseCalendarType = (calendarType: string) => {
    setRequest((current) => ({
      ...current,
      calendarType,
      serviceName: PROPOSED_CALENDAR_TYPES.includes(calendarType as (typeof PROPOSED_CALENDAR_TYPES)[number])
        ? calendarType
        : current.serviceName,
    }));
    setRequestStatus("idle");
    setRequestMessage("");
  };

  const submitRequest = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setRequestStatus("saving");
    setRequestMessage("");
    try {
      const csrfResponse = await fetch("/api/calendar-request", { cache: "no-store" });
      const csrfPayload = (await csrfResponse.json()) as { csrfToken?: string };
      if (!csrfResponse.ok || !csrfPayload.csrfToken) throw new Error("Request security is unavailable.");
      const response = await fetch("/api/calendar-request", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-command-center-csrf": csrfPayload.csrfToken,
        },
        body: JSON.stringify({
          action: "create",
          idempotencyKey: `calendar-${crypto.randomUUID()}`,
          ...request,
          durationMinutes: Number(request.durationMinutes),
        }),
        cache: "no-store",
      });
      const payload = (await response.json()) as { message?: string; error?: string };
      if (!response.ok) throw new Error(payload.error || "The draft request could not be saved.");
      setRequestStatus("saved");
      setRequestMessage(payload.message || "Draft request saved for Manifestic Ops review. Nothing was created or sent.");
    } catch (error) {
      setRequestStatus("error");
      setRequestMessage(error instanceof Error ? error.message : "The draft request could not be saved.");
    }
  };

  const fieldClass = "mt-1 w-full rounded-xl border border-[#cddfe8] bg-white px-3 py-2.5 text-xs text-[#102336] outline-none transition placeholder:text-[#8aa7b5] focus:border-[#1377b8] focus:ring-2 focus:ring-[#1377b8]/15";

  return (
    <article className="rounded-2xl border border-[#b9dce9] bg-gradient-to-br from-white via-[#f8fcfe] to-[#eef8f5] p-5 shadow-[0_14px_30px_-26px_rgba(16,35,54,0.55)] md:col-span-2">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span className="rounded-xl bg-[#e8f4fb] p-2.5 text-[#1377b8]"><CalendarDays className="h-5 w-5" /></span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#102336]">Calendar setup</p>
            <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.08em] ${calendarReadAvailable ? "bg-[#e7f6f1] text-[#087b68]" : "bg-[#fff4e6] text-[#8a5200]"}`}>
              {calendarReadAvailable ? "Live read" : "Needs setup"}
            </span>
          </div>
        </div>
        <CheckCircle2 className={`h-4 w-4 shrink-0 ${calendarReadAvailable ? "text-[#087b68]" : "text-[#8aa7b5]"}`} />
      </div>
      <p className="mt-4 text-xs leading-relaxed text-[#466174]">
        There are two separate paths: connect a personal calendar for availability, or request a booking calendar that Manifestic creates in native HighLevel after owner approval.
      </p>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#cddfe8] bg-white/85 p-4">
          <p className="text-xs font-semibold text-[#102336]">1. Connect your personal calendar</p>
          <p className="mt-2 text-[11px] leading-relaxed text-[#466174]">
            Google or Outlook availability helps prevent double-booking. This is the only calendar connection the client needs to make.
          </p>
          {calendarSettingsHref && (
            <a href={calendarSettingsHref} target="_top" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 rounded-xl border border-[#b9d7e2] bg-white px-3 py-2.5 text-[11px] font-semibold text-[#1377b8] transition hover:border-[#1377b8] hover:bg-[#eef8fb]">
              Connect Calendar <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
        <div className="rounded-2xl border border-[#ead8bb] bg-[#fffaf3] p-4">
          <p className="text-xs font-semibold text-[#102336]">2. Request a booking calendar</p>
          <p className="mt-2 text-[11px] leading-relaxed text-[#466174]">
            Manifestic Ops reviews the requirements, gets owner approval, and then creates the native booking calendar. This request does not create or notify anyone automatically.
          </p>
        </div>
      </div>
      <div className="mt-5 rounded-2xl border border-[#dbe5ed] bg-white/75 p-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8a5200]">Proposed setup targets · examples only</p>
        <p className="mt-2 text-[11px] leading-relaxed text-[#466174]">These are ideas, not created or verified calendars.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {[...PROPOSED_CALENDAR_TYPES, "Custom calendar"].map((target) => (
            <button key={target} type="button" onClick={() => chooseCalendarType(target === "Custom calendar" ? "Custom" : target)} className={`rounded-xl border px-3 py-2 text-[11px] font-semibold transition ${request.calendarType === (target === "Custom calendar" ? "Custom" : target) ? "border-[#1377b8] bg-[#e8f4fb] text-[#1377b8]" : "border-[#cddfe8] bg-white text-[#466174] hover:border-[#8bc9dc]"}`}>
              {target}
            </button>
          ))}
        </div>
      </div>
      <form className="mt-5 rounded-2xl border border-[#cddfe8] bg-white/85 p-4" onSubmit={submitRequest}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-[#102336]">Draft a request for Manifestic Ops</p>
            <p className="mt-1 text-[11px] text-[#466174]">All fields are collected for review. Nothing is created or sent from this form.</p>
          </div>
          <span className="rounded-full bg-[#fff4e6] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.08em] text-[#8a5200]">Draft · review only</span>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="text-[11px] font-semibold text-[#466174]">Calendar type
            <select className={fieldClass} value={request.calendarType} onChange={(event) => chooseCalendarType(event.target.value)}>
              {[...PROPOSED_CALENDAR_TYPES, "Custom"].map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
          <label className="text-[11px] font-semibold text-[#466174]">Service name
            <input className={fieldClass} value={request.serviceName} onChange={(event) => setRequest((current) => ({ ...current, serviceName: event.target.value }))} placeholder="e.g. Medicare Consultation" required />
          </label>
          <label className="text-[11px] font-semibold text-[#466174]">Duration in minutes
            <input className={fieldClass} type="number" min="15" max="240" step="15" value={request.durationMinutes} onChange={(event) => setRequest((current) => ({ ...current, durationMinutes: event.target.value }))} required />
          </label>
          <label className="text-[11px] font-semibold text-[#466174]">Assigned user
            <input className={fieldClass} value={request.assignedUser} onChange={(event) => setRequest((current) => ({ ...current, assignedUser: event.target.value }))} placeholder="Who owns this calendar?" required />
          </label>
          <label className="text-[11px] font-semibold text-[#466174] sm:col-span-2">Availability
            <textarea className={fieldClass} rows={2} value={request.availability} onChange={(event) => setRequest((current) => ({ ...current, availability: event.target.value }))} placeholder="Days, hours, timezone, and any blackout times" required />
          </label>
          <label className="text-[11px] font-semibold text-[#466174]">Buffer rules
            <input className={fieldClass} value={request.bufferRules} onChange={(event) => setRequest((current) => ({ ...current, bufferRules: event.target.value }))} placeholder="e.g. 15 minutes before and after" required />
          </label>
          <label className="text-[11px] font-semibold text-[#466174]">Booking-page destination
            <input className={fieldClass} value={request.bookingPageDestination} onChange={(event) => setRequest((current) => ({ ...current, bookingPageDestination: event.target.value }))} placeholder="Which page or funnel should host it?" required />
          </label>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button type="submit" disabled={requestStatus === "saving"} className="inline-flex items-center gap-2 rounded-xl bg-[#1377b8] px-4 py-2.5 text-[11px] font-semibold text-white transition hover:bg-[#0f649b] disabled:cursor-wait disabled:opacity-60">
            {requestStatus === "saving" ? "Saving draft…" : "Request this calendar"} <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
          {requestMessage && <p role="status" className={`text-[11px] ${requestStatus === "saved" ? "text-[#087b68]" : requestStatus === "error" ? "text-[#a33b2b]" : "text-[#466174]"}`}>{requestMessage}</p>}
        </div>
      </form>
    </article>
  );
}

function GettingStartedView({
  client,
  isLive,
  calendarReadAvailable,
  calendarSettingsHref,
  plannerHref,
  socialMessagingHref,
}: {
  client: ClientConfig;
  isLive: boolean;
  calendarReadAvailable: boolean;
  calendarSettingsHref?: string;
  plannerHref?: string;
  socialMessagingHref?: string;
}) {
  return (
    <div className="mt-8 space-y-5 pb-10">
      <section className="rounded-[26px] border border-[#b9dce9] bg-gradient-to-br from-white via-[#f7fcfe] to-[#e4f5f0] p-6 shadow-[0_24px_65px_-36px_rgba(14,122,150,0.34)] sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#1377b8]">
              Setup Center · Essentials
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#102336] sm:text-3xl">
              Connect the workspace once.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#466174]">
              {client.name} can connect the core channels here, then return to Dashboard for the
              daily docket. {isLive ? "Live workspace data is connected." : "Live status is waiting for the workspace connection."}
            </p>
          </div>
          <span className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] ${isLive ? "bg-[#e7f6f1] text-[#087b68]" : "bg-[#fff4e6] text-[#8a5200]"}`}>
            {isLive ? "Connected" : "Status unavailable"}
          </span>
        </div>
        <div className="mt-7">
          <SetupStatusGrid
            calendarReadAvailable={calendarReadAvailable}
            calendarSettingsHref={calendarSettingsHref}
            plannerHref={plannerHref}
            socialMessagingHref={socialMessagingHref}
          />
        </div>
      </section>
    </div>
  );
}

function PortalOverview({
  client,
  isLive,
  conversations,
  appointments,
  tasks,
  opportunities,
  unreadCount,
  onGoToSection,
  demoMode,
  inboxHref,
  calendarHref,
  opportunitiesHref,
  emailHref,
  plannerHref,
}: {
  client: ClientConfig;
  isLive: boolean;
  conversations: LiveConversation[];
  appointments: LiveAppointment[];
  tasks: LiveTask[];
  opportunities: LiveOpportunitySummary;
  unreadCount: number;
  onGoToSection: (section: DashboardSection) => void;
  demoMode: boolean;
  inboxHref?: string;
  calendarHref?: string;
  opportunitiesHref?: string;
  emailHref?: string;
  plannerHref?: string;
}) {
  const openTasks = tasks.filter((task) => !task.completed);
  const reviewConversations = conversations.filter(
    (conversation) => conversation.unread || (conversation.unreadCount ?? 0) > 0,
  );
  const nextMoves = [
    ...reviewConversations.slice(0, 2).map((conversation) => ({
      icon: Inbox,
      label: `Review ${conversation.name}`,
      detail: `${conversation.channel} · ${conversation.preview}`,
      section: "inbox" as const,
      tone: "bg-[#e8f4fa] text-[#1377b8]",
    })),
    ...openTasks.slice(0, 2).map((task) => ({
      icon: CheckCircle2,
      label: task.label,
      detail: task.contactName ? `${task.contactName} · ${task.owner || "Unassigned"}` : "Open task",
      section: "opportunities" as const,
      tone: "bg-[#eaf7f3] text-[#087b68]",
    })),
    ...(appointments[0]
      ? [{
          icon: CalendarDays,
          label: `Prepare for ${appointments[0].person}`,
          detail: formatAppointmentSummary(appointments[0], demoMode),
          section: "calendar" as const,
          tone: "bg-[#fff4e6] text-[#8a5200]",
        }]
      : []),
  ].slice(0, 3);
  return (
    <div className="mt-8 space-y-5 pb-10">
      <section className="rounded-[26px] border border-[#cddfe8] bg-gradient-to-br from-white via-[#fbfdff] to-[#eef8fb] p-6 shadow-[0_24px_65px_-36px_rgba(16,35,54,0.42)] sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#1377b8]">Today’s Docket</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#102336] sm:text-3xl">What needs attention today?</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#466174]">A live operating view for {client.name}: conversations, appointments, follow-up, and pipeline movement.</p>
          </div>
          <span className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] ${demoMode ? "bg-[#fff4e6] text-[#8a5200]" : isLive ? "bg-[#e7f6f1] text-[#087b68]" : "bg-[#fff4e6] text-[#8a5200]"}`}>{demoMode ? "Demo data · synthetic" : isLive ? "Live HighLevel data" : "Preview mode"}</span>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <DocketMetric label="Unread messages" value={String(unreadCount)} detail={demoMode ? "Synthetic review queue" : "Needs review"} tone="blue" href={demoMode ? undefined : inboxHref} onClick={() => demoMode ? undefined : onGoToSection("inbox")} />
          <DocketMetric label="Upcoming" value={appointments.length ? String(appointments.length) : "0"} detail={demoMode ? "Synthetic appointments" : "Next 7 days"} tone="teal" href={demoMode ? undefined : calendarHref} onClick={() => demoMode ? undefined : onGoToSection("calendar")} />
          <DocketMetric label="Open follow-up" value={String(openTasks.length)} detail={demoMode ? "Synthetic tasks" : "Tasks to work"} tone="amber" href={demoMode ? undefined : opportunitiesHref} onClick={() => demoMode ? undefined : onGoToSection("opportunities")} />
          <DocketMetric label="Pipeline" value={String(opportunities.open)} detail={demoMode ? "Synthetic opportunities" : "Open opportunities"} tone="violet" href={demoMode ? undefined : opportunitiesHref} onClick={() => demoMode ? undefined : onGoToSection("opportunities")} />
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-2">
        <section className="rounded-[26px] border border-[#cddfe8] bg-white p-6 shadow-[0_24px_65px_-36px_rgba(16,35,54,0.3)] sm:p-7">
          <div className="flex items-start justify-between gap-3"><div><div className="flex flex-wrap items-center gap-2"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#466174]">Conversations to Review</p>{demoMode && <span className="rounded-full bg-[#fff0d5] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.08em] text-[#8a5200]">Synthetic demo · review only</span>}</div><h2 className="mt-2 text-xl font-semibold text-[#102336]">Latest human attention queue</h2></div><Inbox className="h-5 w-5 text-[#1377b8]" /></div>
          <div className="mt-5 space-y-2">
            {reviewConversations.slice(0, 3).map((conversation) => <button key={conversation.id} type="button" onClick={() => onGoToSection("inbox")} className="flex w-full items-start gap-3 rounded-2xl border border-[#dbe5ed] bg-[#f8fbfd] p-3 text-left transition hover:border-[#8bc9dc] hover:bg-[#eef8fb]"><span className="rounded-xl bg-[#e8f4fa] px-2.5 py-2 text-[10px] font-bold text-[#1377b8]">{conversation.initials}</span><span className="min-w-0 flex-1"><span className="block truncate text-xs font-semibold text-[#102336]">{conversation.name}</span><span className="mt-1 block truncate text-[11px] text-[#466174]">{conversation.preview}</span></span><ArrowUpRight className="h-3.5 w-3.5 text-[#8aa7b5]" /></button>)}
            {!reviewConversations.length && <p className="rounded-2xl border border-dashed border-[#dbe5ed] p-4 text-sm text-[#466174]">No unread conversations need review.</p>}
          </div>
          <button type="button" onClick={() => onGoToSection("inbox")} className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#1377b8]">Open Inbox <ArrowUpRight className="h-3.5 w-3.5" /></button>
        </section>
        <section className="rounded-[26px] border border-[#cddfe8] bg-white p-6 shadow-[0_24px_65px_-36px_rgba(16,35,54,0.3)] sm:p-7">
          <div className="flex items-start justify-between gap-3"><div><div className="flex flex-wrap items-center gap-2"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#466174]">Upcoming Appointments</p>{demoMode && <span className="rounded-full bg-[#fff0d5] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.08em] text-[#8a5200]">Synthetic demo · review only</span>}</div><h2 className="mt-2 text-xl font-semibold text-[#102336]">Next appointments</h2></div><CalendarDays className="h-5 w-5 text-[#1377b8]" /></div>
          <div className="mt-5 space-y-2">{appointments.slice(0, 3).map((appointment) => <button key={appointment.id} type="button" onClick={() => demoMode ? undefined : onGoToSection("calendar")} className="flex w-full items-center gap-3 rounded-2xl border border-[#dbe5ed] bg-[#f8fbfd] p-3 text-left transition hover:border-[#8bc9dc] hover:bg-[#eef8fb]"><span className="rounded-xl bg-[#eaf7f3] p-2 text-[#087b68]"><CalendarDays className="h-4 w-4" /></span><span className="min-w-0 flex-1"><span className="block truncate text-xs font-semibold text-[#102336]">{appointment.person}{demoMode ? " · Demo contact" : ""}</span><span className="mt-1 block truncate text-[11px] text-[#466174]">{formatAppointmentSummary(appointment, demoMode)}</span></span><ArrowUpRight className="h-3.5 w-3.5 text-[#8aa7b5]" /></button>)}{!appointments.length && <p className="rounded-2xl border border-dashed border-[#dbe5ed] p-4 text-sm text-[#466174]">No upcoming appointments in the next 7 days.</p>}</div>
          {calendarHref ? <a href={calendarHref} target="_top" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#1377b8]">Open Calendar <ArrowUpRight className="h-3.5 w-3.5" /></a> : <button type="button" onClick={() => onGoToSection("calendar")} className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#1377b8]">Open Calendar <ArrowUpRight className="h-3.5 w-3.5" /></button>}
        </section>
      </div>

      <section className="rounded-[26px] border border-[#b9dce9] bg-gradient-to-br from-[#f9fdff] via-[#eef8fb] to-[#eaf7f3] p-6 shadow-[0_24px_65px_-36px_rgba(14,122,150,0.34)] sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#087b68]"><Sparkles className="h-3.5 w-3.5" /> AI Next Moves</p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-[#102336]">Review-first actions from live records.</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {demoMode && <span className="rounded-full border border-[#e9c98f] bg-[#fff8eb] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#8a5200]">Demo data · review only</span>}
            <span className="rounded-full border border-[#b9dce9] bg-white/70 px-3 py-1.5 text-[10px] font-semibold text-[#466174]">Nothing sends automatically</span>
          </div>
        </div>
        {demoMode ? <SyntheticDemoReviewQueue /> : <div className="mt-5 grid gap-3 lg:grid-cols-3">
          {nextMoves.length ? nextMoves.map(({ icon: Icon, label, detail, section, tone }) => (
            <button key={`${label}-${detail}`} type="button" onClick={() => onGoToSection(section)} className="group flex items-start gap-3 rounded-2xl border border-[#c8e1e8] bg-white/80 p-4 text-left transition hover:-translate-y-0.5 hover:bg-white">
              <span className={`rounded-xl p-2 ${tone}`}><Icon className="h-4 w-4" /></span>
              <span className="min-w-0"><span className="block truncate text-xs font-semibold text-[#102336]">{label}</span><span className="mt-1 block line-clamp-2 text-[11px] leading-relaxed text-[#466174]">{detail}</span></span>
              <ArrowUpRight className="ml-auto h-3.5 w-3.5 shrink-0 text-[#8aa7b5] group-hover:text-[#1377b8]" />
            </button>
          )) : <p className="rounded-2xl border border-dashed border-[#afd7e3] bg-white/60 p-4 text-sm text-[#466174]">No immediate next move is waiting. The queue will update as live conversations, tasks, and appointments change.</p>}
        </div>}
      </section>

      <section className="rounded-[26px] border border-[#cddfe8] bg-gradient-to-br from-white via-[#fbfdff] to-[#eef8fb] p-6 shadow-[0_24px_65px_-36px_rgba(16,35,54,0.3)] sm:p-7">
        <div className="flex flex-wrap items-end justify-between gap-3"><div><div className="flex flex-wrap items-center gap-2"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#466174]">Pipeline at a Glance</p>{demoMode && <span className="rounded-full bg-[#fff0d5] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.08em] text-[#8a5200]">Synthetic demo · review only</span>}</div><h2 className="mt-2 text-xl font-semibold text-[#102336]">Opportunities and follow-up</h2></div><button type="button" onClick={() => demoMode ? undefined : onGoToSection("opportunities")} className="inline-flex items-center gap-2 text-xs font-semibold text-[#1377b8]">Open Opportunities <ArrowUpRight className="h-3.5 w-3.5" /></button></div>
        <div className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]"><OpportunitiesCard opportunities={opportunities} opportunitiesHref={opportunitiesHref} live={isLive} /><TasksCard tasks={tasks} live={isLive} demoMode={demoMode} /></div>
      </section>

      <section className="rounded-[26px] border border-[#cddfe8] bg-gradient-to-br from-white via-[#fbfdff] to-[#eaf7f3] p-6 shadow-[0_24px_65px_-36px_rgba(16,35,54,0.3)] sm:p-7">
        <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#466174]">Content + Campaigns</p><h2 className="mt-2 text-xl font-semibold text-[#102336]">Keep publishing work grouped.</h2></div><MessageCircle className="h-5 w-5 text-[#0e9a85]" /></div>
        <div className="mt-5 grid gap-3 md:grid-cols-3"><PortalActionCard icon={MessageCircle} title="Content Review" detail="Posts, blogs, and video ideas" tone="teal" onClick={() => onGoToSection("content")} /><PortalActionCard icon={Instagram} title="Social Planner" detail="Connect and schedule channels" tone="blue" href={plannerHref} onClick={() => onGoToSection("content")} /><PortalActionCard icon={Mail} title="Email campaigns" detail="Campaigns and delivery" tone="amber" href={emailHref} onClick={() => onGoToSection("content")} /></div>
      </section>

    </div>
  );
}

function SyntheticDemoReviewQueue() {
  return (
    <div className="mt-5 grid gap-3 lg:grid-cols-2">
      {SYNTHETIC_DEMO_REVIEWS.map((review) => (
        <SyntheticDemoReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
}

function SyntheticDemoReviewCard({
  review,
}: {
  review: (typeof SYNTHETIC_DEMO_REVIEWS)[number];
}) {
  const [showRationale, setShowRationale] = useState(false);
  const [showDraft, setShowDraft] = useState(false);
  const [showContext, setShowContext] = useState(false);
  const [approved, setApproved] = useState(false);
  const [demoSendResult, setDemoSendResult] = useState(false);
  return (
    <article className="rounded-2xl border border-[#e9c98f] bg-[#fffdf8] p-4 shadow-[0_14px_34px_-28px_rgba(146,64,14,0.8)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.13em] text-[#9a5b00]">Synthetic demo · review only</p>
          <h3 className="mt-2 text-sm font-semibold text-[#102336]">{review.title}</h3>
        </div>
        <span className={`rounded-full px-2 py-1 text-[9px] font-bold uppercase tracking-[0.08em] ${approved ? "bg-[#e7f6f1] text-[#087b68]" : "bg-[#fff0d5] text-[#8a5200]"}`}>
          {approved ? "Approved · demo" : "Needs review"}
        </span>
      </div>
      <dl className="mt-3 space-y-2 text-[11px] leading-relaxed text-[#466174]">
        <div><dt className="font-bold text-[#102336]">Trigger</dt><dd>{review.trigger}</dd></div>
        <div><dt className="font-bold text-[#102336]">Evidence</dt><dd>{review.evidence}</dd></div>
        <div><dt className="font-bold text-[#102336]">Suggested action</dt><dd>{review.suggestedAction}</dd></div>
      </dl>
      {(showRationale || showDraft || showContext) && (
        <div className="mt-3 rounded-xl border border-[#ead8bb] bg-white/80 p-3 text-[11px] leading-relaxed text-[#466174]">
          {showRationale && <p><strong className="text-[#102336]">Rationale:</strong> {review.rationale}</p>}
          {showDraft && <p className={showRationale ? "mt-2" : ""}><strong className="text-[#102336]">Draft preview:</strong> {review.draft}</p>}
          {showContext && <p className={(showRationale || showDraft) ? "mt-2" : ""}><strong className="text-[#102336]">Synthetic context:</strong> demo-only ID <code className="rounded bg-[#fff0d5] px-1 text-[#8a5200]">{review.id}</code>. No live route, timestamp, or tenant record is attached.</p>}
        </div>
      )}
      <p className="mt-3 text-[10px] leading-relaxed text-[#8a5200]"><strong>Human action:</strong> {review.humanAction} <strong>Boundary:</strong> {review.approvalBoundary}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={() => setShowRationale((value) => !value)} className="rounded-lg border border-[#e9c98f] bg-white px-2.5 py-2 text-[10px] font-semibold text-[#8a5200] transition hover:bg-[#fff0d5]">{showRationale ? "Hide rationale" : "Show rationale"}</button>
        <button type="button" onClick={() => setShowDraft((value) => !value)} className="rounded-lg border border-[#e9c98f] bg-white px-2.5 py-2 text-[10px] font-semibold text-[#8a5200] transition hover:bg-[#fff0d5]">{showDraft ? "Hide draft" : "Preview draft"}</button>
        <button type="button" onClick={() => setShowContext((value) => !value)} className="rounded-lg border border-[#e9c98f] bg-white px-2.5 py-2 text-[10px] font-semibold text-[#8a5200] transition hover:bg-[#fff0d5]">{showContext ? "Hide context" : "Show synthetic context"}</button>
        <button type="button" onClick={() => setApproved(true)} className="rounded-lg bg-[#8a5200] px-2.5 py-2 text-[10px] font-semibold text-white transition hover:bg-[#6d4000]">Mark approved (demo)</button>
      </div>
      <div className="mt-3 rounded-xl border border-dashed border-[#c8b9a0] bg-[#f6f1e8] p-3">
        <button type="button" onClick={() => setDemoSendResult(true)} className="w-full rounded-lg bg-[#8a5200] px-2.5 py-2 text-[10px] font-bold text-white transition hover:bg-[#6d4000]">Approve &amp; Send (demo)</button>
        {demoSendResult && <p className="mt-2 rounded-lg border border-[#e9c98f] bg-[#fff8eb] px-2.5 py-2 text-[10px] font-bold leading-relaxed text-[#8a5200]">Demo only — no message sent. No recipient, network call, or CRM mutation was used.</p>}
        <button type="button" disabled aria-disabled="true" title="Unavailable until live safeguards are configured" className="mt-2 w-full cursor-not-allowed rounded-lg border border-[#b8aa95] bg-[#e7e0d5] px-2.5 py-2 text-[10px] font-bold text-[#756a5c] opacity-80">Approve &amp; Send · unavailable</button>
        <p className="mt-2 text-[10px] leading-relaxed text-[#756a5c]">The real Approve &amp; Send action is reserved for a future Manifestic live test. It stays disabled until durable storage, an approved AI provider, verified contact identity, an outbound channel, CSRF/auth checks, and explicit human confirmation are all verified.</p>
      </div>
    </article>
  );
}

function DocketMetric({
  label,
  value,
  detail,
  tone,
  href,
  onClick,
}: {
  label: string;
  value: string;
  detail: string;
  tone: "blue" | "teal" | "amber" | "violet";
  href?: string;
  onClick?: () => void;
}) {
  const styles = { blue: "bg-[#eef6fa] text-[#1377b8]", teal: "bg-[#eaf7f3] text-[#087b68]", amber: "bg-[#fff4e6] text-[#8a5200]", violet: "bg-[#f5f0ff] text-[#7356b8]" }[tone];
  const className = "group rounded-2xl border border-[#dbe5ed] bg-white/80 p-4 text-left shadow-[0_10px_25px_-22px_rgba(19,119,184,0.7)] transition hover:-translate-y-0.5 hover:border-[#8bc9dc] hover:bg-white hover:shadow-[0_16px_32px_-22px_rgba(19,119,184,0.7)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1377b8] focus-visible:ring-offset-2";
  const content = <><span className={`inline-flex rounded-xl px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${styles}`}>{label}</span><span className="mt-3 block text-2xl font-semibold text-[#102336]">{value}</span><span className="mt-1 block text-[11px] text-[#466174]">{detail}</span></>;
  return href ? <a href={href} target="_top" rel="noreferrer" className={className}>{content}</a> : <button type="button" onClick={onClick} className={className}>{content}</button>;
}

function LegacyPortalOverview({
  client,
  isLive,
  unreadCount,
  firstAppointment,
  openTasks,
  onGoToSection,
  inboxHref,
  calendarHref,
  calendarSettingsHref,
  opportunitiesHref,
  emailHref,
  plannerHref,
  contentReviewHref,
  socialMessagingHref,
}: {
  client: ClientConfig;
  isLive: boolean;
  unreadCount: number;
  firstAppointment?: LiveAppointment;
  openTasks: number;
  onGoToSection: (section: DashboardSection) => void;
  inboxHref?: string;
  calendarHref?: string;
  calendarSettingsHref?: string;
  opportunitiesHref?: string;
  emailHref?: string;
  plannerHref?: string;
  contentReviewHref?: string;
  socialMessagingHref?: string;
}) {
  const statusLabel = isLive ? "Connected" : "Preview mode";
  const statusDetail = isLive
    ? "Live HighLevel data is flowing into this workspace."
    : "Connect the client location to show live HighLevel data.";
  const linkClass =
    "group flex items-center gap-3 rounded-2xl border border-[#dbe5ed] bg-[#f8fbfd] px-4 py-3 text-left transition hover:border-[#8bc9dc] hover:bg-[#eef8fb]";
  const clientLinks =
    client.locationId === "QsbCjo5HFBGuRG0AKms0"
      ? workspaceLinks
      : client.websiteUrl
        ? [
            {
              label: client.websiteName,
              detail: "Primary production site",
              href: client.websiteUrl,
            },
          ]
        : [];
  const clientReports = client.locationId === "QsbCjo5HFBGuRG0AKms0" ? reports : [];
  return (
    <div className="mt-8 space-y-5 pb-10">
      <div className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <section className="rounded-[26px] border border-[#cddfe8] bg-gradient-to-br from-white via-[#fbfdff] to-[#eef8fb] p-6 shadow-[0_24px_65px_-36px_rgba(16,35,54,0.42)] sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#466174]">
              <span
                className={`h-2.5 w-2.5 rounded-full ${isLive ? "bg-[#0e9a85]" : "bg-[#d18b2d]"}`}
              />
              Current status
            </div>
            <span
              className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] ${isLive ? "bg-[#e7f6f1] text-[#087b68]" : "bg-[#fff4e6] text-[#8a5200]"}`}
            >
              {statusLabel}
            </span>
          </div>
          <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_0.72fr] lg:items-end">
            <div>
              <p className="text-2xl font-semibold tracking-tight text-[#102336] sm:text-3xl">
                Your communication engine, at a glance.
              </p>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#466174]">
                One focused home base for email campaigns, content approvals, and SMS/CRM follow-up
                with {client.name}.
              </p>
              <p className="mt-5 text-xs font-medium text-[#466174]">{statusDetail}</p>
            </div>
            <div className="rounded-2xl bg-[#eef8f5] p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#087b68]">
                  Messages & approvals
                </p>
                <Inbox className="h-4 w-4 text-[#0e9a85]" />
              </div>
              <p className="mt-3 text-3xl font-semibold text-[#102336]">{unreadCount}</p>
              <p className="mt-1 text-xs text-[#466174]">messages and follow-up ready for attention</p>
              <button
                type="button"
                onClick={() => onGoToSection("inbox")}
                className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#1377b8]"
              >
                Open module <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </section>
        <section className="rounded-[26px] border border-[#b9dce9] bg-gradient-to-br from-[#f5fcff] via-[#eef8fb] to-[#e4f5f0] p-6 shadow-[0_24px_65px_-36px_rgba(14,122,150,0.34)] sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#1377b8]">
              Setup re-entry
            </p>
            <CheckCircle2 className="h-5 w-5 text-[#1377b8]" />
          </div>
          <p className="mt-5 text-sm font-semibold text-[#102336]">
            Connections are ready when you need them.
          </p>
          <button
            type="button"
            onClick={() => onGoToSection("getting-started")}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#1377b8] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#0e659e]"
          >
            Open Getting Started <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </section>
      </div>

      <section className="rounded-[26px] border border-[#cddfe8] bg-gradient-to-br from-white via-[#fbfdff] to-[#f2f8fb] p-6 shadow-[0_24px_65px_-36px_rgba(16,35,54,0.34)] sm:p-7">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#466174]">
              Core communication loop
            </p>
            <h2 className="mt-2 text-xl font-semibold text-[#102336]">Email → content → SMS/CRM.</h2>
          </div>
          <p className="text-xs text-[#466174]">The dashboard stays the home base; these are the three daily lanes.</p>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <PortalActionCard
            icon={Inbox}
            title="Inbox"
            detail={`${unreadCount} unread · two-way follow-up`}
            tone="blue"
            onClick={() => onGoToSection("inbox")}
          />
          <PortalActionCard
            icon={MessageCircle}
            title="Content review"
            detail="Posts + images waiting for approval"
            tone="teal"
            onClick={() => onGoToSection("content")}
          />
          <PortalActionCard
            icon={Mail}
            title="Email campaigns"
            detail="Campaigns + review notifications"
            tone="amber"
            href={emailHref}
            onClick={() => onGoToSection("inbox")}
          />
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[26px] border border-[#cddfe8] bg-gradient-to-br from-white via-[#fbfdff] to-[#eaf7f3] p-6 shadow-[0_24px_65px_-36px_rgba(16,35,54,0.32)] sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#466174]">
                Content approval
              </p>
              <h2 className="mt-2 text-xl font-semibold text-[#102336]">
                Make every post ready to approve.
              </h2>
            </div>
            <MessageCircle className="h-5 w-5 text-[#0e9a85]" />
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {["Social posts", "Blogs", "Video ideas", "Library"].map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => onGoToSection("content")}
                className="rounded-xl border border-[#dbe5ed] bg-[#f8fbfd] px-3 py-3 text-left text-xs font-semibold text-[#466174] transition hover:border-[#8bc9dc] hover:bg-[#eef8fb]"
              >
                {label}
                <ArrowUpRight className="mt-2 h-3.5 w-3.5 text-[#1377b8]" />
              </button>
            ))}
          </div>
          <p className="mt-5 text-sm leading-relaxed text-[#466174]">
            Email the review link, approve the copy and canonical image, then schedule to connected
            social channels. Keep publishing approval-gated.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <QuickLink href={plannerHref} label="Open Social Planner" icon={Instagram} />
            <button
              type="button"
              onClick={() => onGoToSection("content")}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#dbe5ed] bg-white px-3 py-2.5 text-[11px] font-semibold text-[#466174] transition hover:border-[#8bc9dc] hover:bg-[#eef8fb]"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Open content module
            </button>
            <QuickLink href={emailHref} label="Open email campaigns" icon={Mail} />
          </div>
        </section>
        <section className="rounded-[26px] border border-[#cddfe8] bg-gradient-to-br from-white via-[#fbfdff] to-[#f5f0ff] p-6 shadow-[0_24px_65px_-36px_rgba(16,35,54,0.32)] sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#466174]">
                Links
              </p>
              <h2 className="mt-2 text-xl font-semibold text-[#102336]">
                Your client workspace links.
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#466174]">
                Live pages, demos, and the intelligence prepared for {client.name}.
              </p>
            </div>
            <Globe2 className="h-5 w-5 text-[#1377b8]" />
          </div>
          <div className="mt-5 grid gap-2 md:grid-cols-2">
            {clientLinks.map((link) => (
              <PortalLinkRow
                key={link.href}
                href={link.href}
                label={link.label}
                detail={link.detail}
                className={linkClass}
                external
              />
            ))}
          </div>
          {clientReports.length > 0 && (
            <div className="mt-6 border-t border-[#dbe5ed] pt-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#466174]">
                    Agent OS intelligence
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#102336]">
                    Five current reports are ready to open.
                  </p>
                </div>
                <FileText className="h-5 w-5 text-[#0e9a85]" />
              </div>
              <div className="mt-3 grid gap-2 md:grid-cols-2">
                {clientReports.map((report) => (
                  <PortalLinkRow
                    key={report.href}
                    href={report.href}
                    label={report.name}
                    detail={report.updated}
                    className={linkClass}
                    external
                  />
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function PortalActionCard({
  icon: Icon,
  title,
  detail,
  tone,
  href,
  onClick,
}: {
  icon: IconType;
  title: string;
  detail: string;
  tone: "blue" | "teal" | "amber";
  href?: string;
  onClick: () => void;
}) {
  const styles = {
    blue: "bg-[#eef6fa] text-[#1377b8]",
    teal: "bg-[#eaf7f3] text-[#087b68]",
    amber: "bg-[#fff4e6] text-[#8a5200]",
  }[tone];
  const className =
    "group flex items-center gap-4 rounded-2xl border border-[#cddfe8] bg-gradient-to-br from-[#f8fbfd] to-[#edf7fb] p-4 text-left shadow-[0_12px_30px_-22px_rgba(16,35,54,0.65)] transition hover:-translate-y-0.5 hover:border-[#79bfd3] hover:from-white hover:to-[#eef8fb]";
  const content = (
    <>
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${styles}`}>
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-[#102336]">{title}</span>
        <span className="mt-1 block truncate text-xs text-[#466174]">{detail}</span>
      </span>
      <ChevronRight className="h-4 w-4 text-[#9bb0bd] transition group-hover:translate-x-0.5 group-hover:text-[#1377b8]" />
    </>
  );
  return href ? (
    <a href={href} target="_top" rel="noreferrer" className={className}>
      {content}
    </a>
  ) : (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  );
}

function PortalLinkRow({
  href,
  label,
  detail,
  className,
  external,
}: {
  href: string;
  label: string;
  detail: string;
  className: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : "_top"}
      rel="noopener noreferrer"
      className={className}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#1377b8] shadow-sm">
        <ArrowUpRight className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-[#102336]">{label}</span>
        <span className="mt-1 block truncate text-xs text-[#466174]">{detail}</span>
      </span>
      <ChevronRight className="h-4 w-4 text-[#9bb0bd]" />
    </a>
  );
}

function DashboardSectionView({
  client,
  section,
  conversations: visibleConversations,
  appointments: visibleAppointments,
  tasks: visibleTasks,
  opportunities: visibleOpportunities,
  live,
  unreadCount,
  onSelectConversation,
  onOpenInbox,
  websiteTab,
  onWebsiteTabChange,
  inboxHref,
  calendarHref,
  calendarSettingsHref,
  opportunitiesHref,
  plannerHref,
  contentReviewHref,
}: {
  client: ClientConfig;
  section: DashboardSection;
  conversations: LiveConversation[];
  appointments: LiveAppointment[];
  tasks: LiveTask[];
  opportunities: LiveOpportunitySummary;
  live: boolean;
  unreadCount: number;
  onSelectConversation: (name: string) => void;
  onOpenInbox: () => void;
  websiteTab: WebsiteTab;
  onWebsiteTabChange: (tab: WebsiteTab) => void;
  inboxHref?: string;
  calendarHref?: string;
  calendarSettingsHref?: string;
  opportunitiesHref?: string;
  plannerHref?: string;
  contentReviewHref?: string;
}) {
  const labels: Record<DashboardSection, string> = {
    "getting-started": "Getting Started",
    overview: "Dashboard",
    inbox: "Inbox",
    calendar: "Calendar",
    opportunities: "Opportunities",
    content: "Content Review",
    websites: "Web & Insights",
    reports: "Reports",
  };
  const detail: Record<DashboardSection, string> = {
    "getting-started": "Connect the essentials and install the mobile app.",
    overview: "Your high-level business view.",
    inbox: "See the latest live messages here, then open the native inbox when you need to reply.",
    calendar:
      "Review upcoming appointments here, then use native HighLevel for scheduling changes.",
    opportunities: "Move prospects through the pipeline without mixing them into the overview.",
    content: "Keep approvals, Social Planner, and connection actions together.",
    websites: "Open the client’s public sites and landing pages.",
    reports: "Open intelligence and reporting in one place.",
  };
  return (
    <section className="mt-8 pb-10 rounded-2xl border border-white/[0.09] bg-white/[0.035] p-5 shadow-[0_18px_60px_-30px_rgba(14,165,233,0.25)] sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
            Command Center module
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">{labels[section]}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">{detail[section]}</p>
        </div>
        <div className="rounded-full border border-emerald-300/20 bg-emerald-300/[0.07] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-300">
          {live ? "Live data" : "Preview data"}
        </div>
      </div>
      <div className="mt-7">
        {section === "inbox" && (
          <InboxPreview
            conversations={visibleConversations}
            live={live}
            unreadCount={unreadCount}
            selectedConversation={visibleConversations[0]?.name ?? ""}
            onSelect={onSelectConversation}
            onOpenFull={onOpenInbox}
            inboxHref={inboxHref}
          />
        )}
        {section === "calendar" && (
          <CalendarPreview
            appointments={visibleAppointments}
            live={live}
            calendarHref={calendarHref}
          />
        )}
        {section === "opportunities" && (
          <div className="grid gap-5 xl:grid-cols-2">
            <TasksCard tasks={visibleTasks} live={live} />
            <OpportunitiesCard
              opportunities={visibleOpportunities}
              opportunitiesHref={opportunitiesHref}
              live={live}
            />
          </div>
        )}
        {section === "content" && (
          <ContentReviewCard
            clientName={client.name}
            reviewUrl={client.reviewUrl}
            nativeReviewHref={contentReviewHref}
            plannerHref={plannerHref}
            socialHref={plannerHref}
            calendarSettingsHref={calendarSettingsHref}
          />
        )}
        {section === "websites" && (
          <WebsitesCard
            client={client}
            sitesHref={client.websiteUrl || undefined}
            websiteTab={websiteTab}
            onWebsiteTabChange={onWebsiteTabChange}
          />
        )}
        {section === "reports" && <ReportsCard client={client} />}
      </div>
    </section>
  );
}

function InboxPreview({
  conversations,
  live,
  unreadCount,
  selectedConversation,
  onSelect,
  onOpenFull,
  inboxHref,
}: {
  conversations: LiveConversation[];
  live: boolean;
  unreadCount: number;
  selectedConversation: string;
  onSelect: (name: string) => void;
  onOpenFull: () => void;
  inboxHref?: string;
}) {
  const latest = conversations[0];
  return (
    <section className="rounded-2xl border border-white/[0.09] bg-white/[0.04] p-5 shadow-[0_18px_60px_-30px_rgba(14,165,233,0.35)] sm:p-6">
      <CardHeading
        icon={Inbox}
        eyebrow="Unified inbox"
        title="Recent conversations"
        action="Open inbox"
        actionHref={inboxHref}
      />
      {latest && (
        <button
          onClick={() => onSelect(latest.name)}
          className="ybq-latest-message mt-5 w-full rounded-xl border p-4 text-left transition hover:brightness-105"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="ybq-latest-message-label text-[10px] font-semibold uppercase tracking-[0.16em]">
              Latest message
            </p>
            <span className="ybq-latest-message-time text-[11px] font-medium">
              {live
                ? formatRelativeTime(latest.lastMessageDate)
                : ((latest as LiveConversation & { time?: string }).time ?? "recently")}
            </span>
          </div>
          <p className="ybq-latest-message-name mt-2 text-sm font-semibold">{latest.name}</p>
          <p className="ybq-latest-message-preview mt-1 text-sm leading-relaxed">
            {latest.preview}
          </p>
          <p className="ybq-latest-message-meta mt-3 text-[10px] font-semibold uppercase tracking-[0.12em]">
            {latest.channel} · {live ? "live message" : "message preview"}
          </p>
        </button>
      )}
      <div className="mt-4 flex flex-col items-start gap-3 rounded-xl border border-cyan-300/15 bg-cyan-300/[0.045] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-300/15 text-cyan-100">
            <Mail className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">{unreadCount} unread messages</p>
            <p className="mt-0.5 text-xs text-slate-500">
              {live
                ? "Live across connected HighLevel channels"
                : "Across SMS, email, and web chat"}
            </p>
          </div>
        </div>
        {inboxHref ? (
          <a
            href={inboxHref}
            target="_top"
            rel="noreferrer"
            className="w-full rounded-lg bg-cyan-300 px-3 py-2 text-center text-xs font-semibold text-slate-950 transition hover:bg-cyan-200 sm:w-auto"
          >
            View inbox
          </a>
        ) : (
          <button
            onClick={onOpenFull}
            className="w-full rounded-lg bg-cyan-300 px-3 py-2 text-xs font-semibold text-slate-950 transition hover:bg-cyan-200 sm:w-auto"
          >
            View inbox
          </button>
        )}
      </div>
      <div className="mt-4 divide-y divide-white/[0.06]">
        {conversations.length ? (
          conversations.map((conversation, index) => {
            const sample = conversation as LiveConversation &
              Partial<(typeof conversations)[number]>;
            const tone = [
              "bg-cyan-300/15 text-cyan-100",
              "bg-violet-300/15 text-violet-100",
              "bg-amber-300/15 text-amber-100",
            ][index % 3];
            const time = live
              ? formatRelativeTime(conversation.lastMessageDate)
              : ((sample as { time?: string }).time ?? "recently");
            return (
              <button
                key={conversation.id ?? conversation.name}
                onClick={() => onSelect(conversation.name)}
                className={`flex w-full items-start gap-3 py-4 text-left transition ${selectedConversation === conversation.name ? "rounded-xl bg-white/[0.045] px-3" : "hover:bg-white/[0.025]"}`}
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${tone}`}
                >
                  {conversation.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-slate-200">
                      {conversation.name}
                    </p>
                    {conversation.unread && (
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
                    )}
                  </div>
                  <p className="mt-1 truncate text-xs text-slate-500">{conversation.preview}</p>
                  <div className="mt-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.12em] text-slate-600">
                    <span>{conversation.channel}</span>
                    <span>·</span>
                    <span>{time}</span>
                  </div>
                </div>
                <MoreHorizontal className="mt-1 h-4 w-4 shrink-0 text-slate-600" />
              </button>
            );
          })
        ) : (
          <p className="py-8 text-center text-sm text-slate-500">
            {live ? "No unread conversations" : "No conversations yet"}
          </p>
        )}
      </div>
      <div className="mt-3 flex flex-col gap-2 border-t border-white/[0.06] pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-600">
          {live ? "Read-only live preview" : "Message preview prototype"}
        </p>
        {inboxHref ? (
          <a
            href={inboxHref}
            target="_top"
            rel="noreferrer"
            className="self-start text-xs font-medium text-slate-400 hover:text-white sm:self-auto"
          >
            See all messages <ArrowUpRight className="ml-1 inline h-3 w-3" />
          </a>
        ) : (
          <button
            onClick={onOpenFull}
            className="self-start text-xs font-medium text-slate-400 hover:text-white sm:self-auto"
          >
            See all messages <ArrowUpRight className="ml-1 inline h-3 w-3" />
          </button>
        )}
      </div>
    </section>
  );
}

function CalendarPreview({
  appointments,
  live,
  calendarHref,
}: {
  appointments: LiveAppointment[];
  live: boolean;
  calendarHref?: string;
}) {
  return (
    <section className="rounded-2xl border border-white/[0.09] bg-white/[0.035] p-5 sm:p-6">
      <CardHeading
        icon={CalendarDays}
        eyebrow="Calendar"
        title="Coming up"
        action="View calendar"
        actionHref={calendarHref}
      />
      <div className="mt-5 space-y-3">
        {appointments.length ? (
          appointments.map((appointment, index) => {
            const sample = appointment as LiveAppointment & Partial<(typeof appointments)[number]>;
            const time = live
              ? formatAppointmentTime(appointment.startTime)
              : ((sample as { time?: string }).time ?? "Time to confirm");
            return (
              <div
                key={appointment.id ?? `${appointment.title}-${index}`}
                className={`rounded-xl border p-4 ${["border-cyan-300/35 bg-cyan-300/[0.07]", "border-violet-300/35 bg-violet-300/[0.07]", "border-amber-300/35 bg-amber-300/[0.07]"][index % 3]}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold text-slate-300">{time}</p>
                  <Clock3 className="h-3.5 w-3.5 text-slate-500" />
                </div>
                <p className="mt-2 text-sm font-medium text-white">{appointment.title}</p>
                <p className="mt-1 text-xs text-slate-500">{appointment.person}</p>
              </div>
            );
          })
        ) : (
          <p className="py-8 text-center text-sm text-slate-500">
            {live ? "No upcoming appointments" : "No appointments yet"}
          </p>
        )}
      </div>
      {calendarHref ? (
        <a
          href={calendarHref}
          target="_top"
          rel="noreferrer"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] py-3 text-xs font-medium text-slate-300 transition hover:bg-white/[0.07]"
        >
          Open calendar <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      ) : (
        <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] py-3 text-xs font-medium text-slate-300 transition hover:bg-white/[0.07]">
          Open calendar <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      )}
    </section>
  );
}

function TasksCard({ tasks: visibleTasks, live, demoMode = false }: { tasks: LiveTask[]; live: boolean; demoMode?: boolean }) {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5 sm:p-6">
      {demoMode && <p className="mb-3 text-[9px] font-black uppercase tracking-[0.13em] text-[#9a5b00]">Synthetic demo · review only</p>}
      <CardHeading
        icon={CheckCircle2}
        eyebrow="Tasks & approvals"
        title="Three things to move forward"
        action="View tasks"
      />
      <div className="mt-5 space-y-2">
        {visibleTasks.length ? (
          visibleTasks.slice(0, 3).map((task, index) => {
            const sample = task as LiveTask & Partial<(typeof tasks)[number]>;
            const due = live
              ? formatDueDate(task.dueDate)
              : ((sample as { due?: string }).due ?? "No due date");
            const owner = live
              ? (task.owner ?? "Unassigned")
              : ((sample as { owner?: string }).owner ?? "Unassigned");
            const urgent = live
              ? !task.completed
              : Boolean((sample as { urgent?: boolean }).urgent);
            return (
              <div
                key={task.id ?? `${task.label}-${index}`}
                className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-[#0b0f1a] px-4 py-3"
              >
                <div
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${urgent ? "border-amber-300/50 text-amber-200" : "border-white/20 text-slate-600"}`}
                >
                  <Check className="h-3 w-3" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-slate-300">{task.label}</p>
                  <p className="mt-1 text-[11px] text-slate-600">
                    {owner} · {due}
                  </p>
                </div>
                {urgent && (
                  <span className="rounded-full bg-amber-300/10 px-2 py-1 text-[10px] font-semibold text-amber-200">
                    {live ? "Open" : "Now"}
                  </span>
                )}
              </div>
            );
          })
        ) : (
          <p className="py-8 text-center text-sm text-slate-500">
            {live ? "No open tasks" : "No tasks yet"}
          </p>
        )}
      </div>
    </section>
  );
}

function OpportunitiesCard({
  opportunities,
  opportunitiesHref,
  live,
}: {
  opportunities: LiveOpportunitySummary;
  opportunitiesHref?: string;
  live: boolean;
}) {
  const statusRows = [
    { label: "Open", value: opportunities.open, color: "bg-cyan-300" },
    { label: "Won", value: opportunities.won, color: "bg-emerald-400" },
    { label: "Lost", value: opportunities.lost, color: "bg-violet-400" },
    { label: "Abandoned", value: opportunities.abandoned, color: "bg-amber-300" },
  ];
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5 sm:p-6">
      <CardHeading
        icon={UsersRound}
        eyebrow="Opportunities"
        title="Where conversations are moving"
        action="Open CRM"
        actionHref={opportunitiesHref}
      />
      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        {statusRows.map((stage) => (
          <div
            key={stage.label}
            className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-[#0b0f1a] px-4 py-3"
          >
            <span className={`h-2.5 w-2.5 rounded-full ${stage.color}`} />
            <span className="flex-1 text-sm text-slate-300">{stage.label}</span>
            <span className="text-sm font-semibold text-white">{stage.value}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-xl border border-violet-300/15 bg-violet-300/[0.05] px-4 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-violet-200">
          {live ? "Live pipeline" : "Pipeline connection"}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-slate-400">
          {live
            ? `${opportunities.total} opportunities returned from HighLevel.${opportunities.stages.length ? ` ${opportunities.stages.length} active stages detected.` : ""}`
            : "Connect the live HighLevel source to show pipeline activity here."}
        </p>
      </div>
    </section>
  );
}

function ContentCard({
  plannerHref,
  socialHref,
  calendarSettingsHref,
}: {
  plannerHref?: string;
  socialHref?: string;
  calendarSettingsHref?: string;
}) {
  return (
    <section className="mt-5 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5 sm:p-6">
      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-white">This week’s content</p>
              <p className="mt-1 text-xs text-slate-500">Next 7 days · Social Planner</p>
            </div>
            {plannerHref ? (
              <a
                href={plannerHref}
                target="_top"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-cyan-300"
              >
                Open planner <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
                Open planner <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            )}
          </div>
          <div className="mt-5 grid gap-2 sm:grid-cols-3">
            {[
              {
                day: "Mon 18",
                title: "Benefits myth vs. fact",
                status: "Published",
                tone: "text-emerald-300",
              },
              {
                day: "Wed 20",
                title: "Meet Calvenn’s team",
                status: "Awaiting approval",
                tone: "text-amber-200",
              },
              {
                day: "Fri 22",
                title: "Open enrollment checklist",
                status: "Scheduled",
                tone: "text-cyan-200",
              },
            ].map((post) => (
              <div
                key={post.day}
                className="rounded-xl border border-white/[0.06] bg-[#0b0f1a] p-4"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                  {post.day}
                </p>
                <p className="mt-3 text-sm font-medium leading-snug text-slate-300">{post.title}</p>
                <p
                  className={`mt-4 text-[10px] font-semibold uppercase tracking-[0.12em] ${post.tone}`}
                >
                  {post.status}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-white/[0.07] pt-5 xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Social pulse</p>
              <p className="mt-1 text-xs text-slate-500">Last 30 days · connected channels</p>
            </div>
            <BarChart3 className="h-5 w-5 text-violet-300" />
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-pink-400/10 px-2.5 py-1 text-[10px] font-medium text-pink-200">
              <Instagram className="h-3 w-3" />
              Instagram
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-400/10 px-2.5 py-1 text-[10px] font-medium text-blue-200">
              <Linkedin className="h-3 w-3" />
              LinkedIn
            </span>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3">
            {[
              { label: "Posts", value: "12" },
              { label: "Reach", value: "8.4k" },
              { label: "Engage", value: "6.8%" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-xl font-semibold text-white">{stat.value}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-slate-600">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-2 sm:grid-cols-3">
            <QuickLink href={socialHref} label="Connect socials" icon={Instagram} />
            <QuickLink href={calendarSettingsHref} label="Connect calendar" icon={CalendarDays} />
            <QuickLink href={plannerHref} label="Review content" icon={MessageCircle} />
          </div>
        </div>
      </div>
    </section>
  );
}

type ContentReviewTab = "dashboard" | "social" | "blogs" | "ideas" | "library";

function ContentReviewCard({
  clientName,
  reviewUrl,
  nativeReviewHref,
  plannerHref,
  socialHref,
  calendarSettingsHref,
}: {
  clientName: string;
  reviewUrl?: string;
  nativeReviewHref?: string;
  plannerHref?: string;
  socialHref?: string;
  calendarSettingsHref?: string;
}) {
  if (reviewUrl) {
    return (
      <section className="mt-5 overflow-hidden rounded-2xl border border-white/[0.08] bg-white p-2 shadow-[0_18px_60px_-30px_rgba(14,165,233,0.25)]">
        <div className="flex justify-end px-3 pb-2 pt-1">
          <a
            href={reviewUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-slate-200 px-3 py-2 text-[11px] font-semibold text-slate-600 hover:bg-slate-50"
          >
            Open Full Review
          </a>
        </div>
        <iframe
          title="Client content review"
          src={reviewUrl}
          className="h-[980px] w-full rounded-xl border border-slate-200 bg-white"
        />
      </section>
    );
  }
  return (
    <ContentReviewPrototype
      clientName={clientName}
      nativeReviewHref={nativeReviewHref}
      plannerHref={plannerHref}
      socialHref={socialHref}
      calendarSettingsHref={calendarSettingsHref}
    />
  );
}

function ContentReviewPrototype({
  clientName,
  nativeReviewHref,
  plannerHref,
  socialHref,
  calendarSettingsHref,
}: {
  clientName: string;
  nativeReviewHref?: string;
  plannerHref?: string;
  socialHref?: string;
  calendarSettingsHref?: string;
}) {
  const [tab, setTab] = useState<ContentReviewTab>("dashboard");
  const tabs: Array<{ id: ContentReviewTab; label: string; count: string }> = [
    { id: "dashboard", label: "Content dashboard", count: "—" },
    { id: "social", label: "Social posts", count: "—" },
    { id: "blogs", label: "Blogs", count: "—" },
    { id: "ideas", label: "Video ideas", count: "—" },
    { id: "library", label: "Library", count: "—" },
  ];
  const activeTab = tabs.find((item) => item.id === tab);
  return (
    <section className="mt-5 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-300">
            Client approval flow
          </p>
          <h3 className="mt-1 text-lg font-semibold text-white">
            {clientName} content review workspace
          </h3>
          <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-400">
            One active batch, visible status, and separate wording/media versions. This reusable
            template is waiting for {clientName}'s client-specific review link.
          </p>
        </div>
        <span className="rounded-full border border-amber-300/20 bg-amber-300/[0.06] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-200">
          Review-only preview
        </span>
      </div>
      <div className="mt-5 flex flex-wrap gap-2 border-b border-white/[0.07] pb-3">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${tab === item.id ? "bg-cyan-300/15 text-cyan-200" : "text-slate-500 hover:bg-white/[0.04] hover:text-slate-200"}`}
          >
            {item.label}
            <span className="ml-1.5 text-[10px] opacity-70">{item.count}</span>
          </button>
        ))}
      </div>
      {tab === "dashboard" && (
        <div className="mt-5 rounded-xl border border-cyan-300/15 bg-cyan-300/[0.05] p-5">
          <p className="text-sm font-semibold text-white">Live content review workspace</p>
          <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-400">
            The tenant-specific review link is not configured in this embedded Command Center
            surface yet. Use the verified HighLevel Content Review workspace to see the live batch
            and its Social posts, Blogs, Video ideas, and Library destinations.
          </p>
          {nativeReviewHref ? (
            <a
              href={nativeReviewHref}
              target="_top"
              rel="noreferrer"
              className="mt-4 inline-flex rounded-lg bg-cyan-300 px-3 py-2 text-[11px] font-semibold text-slate-950 transition hover:bg-cyan-200"
            >
              Open live Content Review
            </a>
          ) : (
            <span className="mt-4 inline-flex rounded-lg border border-white/[0.08] px-3 py-2 text-[11px] font-semibold text-slate-500">
              Review workspace not provisioned
            </span>
          )}
        </div>
      )}
      {tab !== "dashboard" && (
        <div className="mt-5 rounded-xl border border-white/[0.07] bg-white/[0.025] p-5">
          <p className="text-sm font-semibold text-white">
            {activeTab?.label ?? "Content destination"}
          </p>
          <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-400">
            This destination is available in the verified tenant-specific Content Review
            workspace. No placeholder records are shown here until the review link is provisioned
            for this embedded surface.
          </p>
          {nativeReviewHref ? (
            <a
              href={nativeReviewHref}
              target="_top"
              rel="noreferrer"
              className="mt-4 inline-flex rounded-lg border border-cyan-300/30 px-3 py-2 text-[11px] font-semibold text-cyan-200 transition hover:bg-cyan-300/10"
            >
              Open {activeTab?.label ?? "Content Review"}
            </a>
          ) : (
            <span className="mt-4 inline-flex rounded-lg border border-white/[0.08] px-3 py-2 text-[11px] font-semibold text-slate-500">
              Review workspace not provisioned
            </span>
          )}
        </div>
      )}
      <div className="mt-5 flex flex-wrap gap-2">
        <QuickLink href={plannerHref} label="Open Social Planner" icon={Instagram} />
        <QuickLink href={socialHref} label="Connect socials" icon={MessageCircle} />
        <QuickLink href={calendarSettingsHref} label="Connect calendar" icon={CalendarDays} />
      </div>
    </section>
  );
}

function WebsitesCard({
  client,
  sitesHref,
  websiteTab,
  onWebsiteTabChange,
}: {
  client: ClientConfig;
  sitesHref?: string;
  websiteTab: WebsiteTab;
  onWebsiteTabChange: (tab: WebsiteTab) => void;
}) {
  if (client.locationId !== "QsbCjo5HFBGuRG0AKms0") {
    const href = sitesHref || client.websiteUrl;
    return (
      <section className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Websites & landing pages
            </p>
            <h3 className="mt-1 text-lg font-semibold text-white">
              {client.name}'s digital front door
            </h3>
          </div>
          <PanelTop className="h-5 w-5 text-indigo-300" />
        </div>
        <div className="mt-5">
          <a
            href={href || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex w-full items-center gap-3 rounded-xl border border-white/[0.06] bg-[#0b0f1a] p-4 text-left transition hover:border-indigo-300/30 hover:bg-white/[0.05]"
          >
            <div className="h-10 w-1 rounded-full bg-gradient-to-b from-red-500 to-amber-400" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-200">{client.websiteName}</p>
              <p className="mt-1 text-xs text-slate-600">Primary production site</p>
            </div>
            <ArrowUpRight className="h-3.5 w-3.5 text-slate-600 transition group-hover:text-indigo-300" />
          </a>
        </div>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-indigo-300"
          >
            Open primary site <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        ) : (
          <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-slate-500">
            Primary site not configured <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        )}
      </section>
    );
  }
  return (
    <ClientWebsitesCard
      sitesHref={sitesHref}
      websiteTab={websiteTab}
      onWebsiteTabChange={onWebsiteTabChange}
    />
  );
}

function ClientWebsitesCard({
  sitesHref,
  websiteTab,
  onWebsiteTabChange,
}: {
  sitesHref?: string;
  websiteTab: WebsiteTab;
  onWebsiteTabChange: (tab: WebsiteTab) => void;
}) {
  const tabs: Array<{ id: WebsiteTab; label: string; description: string }> = [
    { id: "pages", label: "Pages", description: "Public sites, pillar pages, and briefs" },
    { id: "funnels", label: "Funnels", description: "Quote, matching, and conversion flows" },
    { id: "reports", label: "Reports", description: "Agent OS intelligence and research" },
    { id: "intelligence", label: "Intelligence", description: "Editable business context · setup gated" },
    { id: "partnership", label: "Partnership", description: "Co-op context · terms review" },
  ];
  const visibleLinks = workspaceLinks.filter((link) => link.kind === websiteTab.slice(0, -1));
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Web & Insights
          </p>
          <h3 className="mt-1 text-lg font-semibold text-white">Client destinations in one place</h3>
          <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-500">
            Pages, funnels, and Agent OS intelligence stay together here so the Dashboard can stay
            focused on today’s work.
          </p>
        </div>
        <Globe2 className="h-5 w-5 text-cyan-300" />
      </div>
      <div className="mt-5 border-b border-[#dbe5ed]" role="tablist" aria-label="Web and insights destinations">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={websiteTab === tab.id}
              onClick={() => onWebsiteTabChange(tab.id)}
              className={`shrink-0 rounded-t-xl px-4 py-3 text-left transition ${websiteTab === tab.id ? "border-b-2 border-[#1377b8] bg-[#e8f4fa] text-[#1377b8]" : "text-[#466174] hover:bg-[#f3f8fb]"}`}
            >
              <span className="block text-xs font-bold">{tab.label}</span>
              <span className="mt-1 block text-[10px] opacity-75">{tab.description}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
          {tabs.find((tab) => tab.id === websiteTab)?.description}
        </p>
        {websiteTab === "intelligence" ? (
          <IntelligencePreview />
        ) : websiteTab === "partnership" ? (
          <PartnershipPreview />
        ) : websiteTab === "reports" ? (
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {reports.map((report) => {
              const Icon = report.icon;
              return (
                <a
                  key={report.href}
                  href={report.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-xl border border-white/[0.06] bg-[#0b0f1a] p-3 text-left transition hover:border-emerald-300/25 hover:bg-white/[0.05]"
                >
                  <Icon className="h-4 w-4 shrink-0 text-emerald-300" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-medium text-slate-200">{report.name}</span>
                    <span className="mt-1 block truncate text-[10px] text-slate-600">{report.detail} · {report.updated}</span>
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-slate-600 transition group-hover:text-emerald-300" />
                </a>
              );
            })}
          </div>
        ) : (
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {visibleLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-xl border border-white/[0.06] bg-[#0b0f1a] p-3 text-left transition hover:border-cyan-300/25 hover:bg-white/[0.05]"
              >
                <PanelTop className="h-4 w-4 shrink-0 text-cyan-300" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-medium text-slate-200">{link.label}</span>
                  <span className="mt-1 block truncate text-[10px] text-slate-600">{link.detail}</span>
                </span>
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-slate-600 transition group-hover:text-cyan-300" />
              </a>
            ))}
          </div>
        )}
      </div>
      {websiteTab === "pages" && sitesHref && (
        <a
          href={sitesHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-1 text-xs font-medium text-cyan-300"
        >
          Open primary site <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      )}
    </section>
  );
}

function IntelligencePreview() {
  const fieldGroups = [
    { title: "Business identity", items: calvennIntelligence.identity },
    { title: "Description, niche, and audience", items: calvennIntelligence.context },
    { title: "Gives, wants, and network", items: calvennIntelligence.relationship },
  ];
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 rounded-2xl border border-amber-300/45 bg-amber-50 p-4 text-amber-950 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[10px] font-black uppercase tracking-[0.14em]">Preview · needs setup</p>
            <span className="rounded-full bg-amber-200 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.1em]">
              {calvennIntelligence.confidence}
            </span>
          </div>
          <p className="mt-2 max-w-3xl text-xs leading-relaxed">
            {calvennIntelligence.source}. Values are tenant-scoped to {calvennIntelligence.scope}.
            Editing is unavailable until the canonical context store, audit path, and owner approval
            flow are connected. Nothing here writes to HighLevel, Agent OS, or a client record.
          </p>
        </div>
        <button
          type="button"
          disabled
          title="Canonical context persistence is not connected"
          className="inline-flex shrink-0 items-center justify-center rounded-xl border border-amber-300/70 bg-white/60 px-3 py-2 text-xs font-semibold text-amber-900 opacity-75"
        >
          Edit context · setup required
        </button>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {fieldGroups.map((group) => (
          <IntelligenceFieldGroup key={group.title} title={group.title} items={group.items} />
        ))}
      </div>

      <section className="rounded-2xl border border-[#dbe5ed] bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#466174]">
              Contact & profile completeness
            </p>
            <h4 className="mt-1 text-base font-semibold text-[#102336]">What still needs an owner decision</h4>
          </div>
          <span className="rounded-full bg-[#fff0d5] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#8a5200]">
            Needs setup
          </span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-[#466174]">
          The client-provided snapshot intentionally leaves these fields open. Do not treat them as
          facts until Calvenn or an authorized owner confirms them.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            "LinkedIn",
            "Email",
            "Phone",
            "Location",
            "Company entity",
            "Licenses / certifications",
            "Service specializations",
            "Geographic service area",
          ].map((item) => (
            <span key={item} className="rounded-full border border-[#f0c67c] bg-[#fffaf0] px-2.5 py-1 text-[10px] font-semibold text-[#8a5200]">
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[#dbe5ed] bg-white p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#466174]">Client-facing build-out</p>
            <h4 className="mt-1 text-base font-semibold text-[#102336]">Delivery context</h4>
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#466174]">No writes</span>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {calvennIntelligence.buildout.map((item) => (
            <div key={item.label} className="rounded-xl border border-[#dbe5ed] bg-[#f8fbfd] p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-[#102336]">{item.label}</p>
                <span className="rounded-full bg-[#e8f4fa] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.08em] text-[#1377b8]">
                  {item.status}
                </span>
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-[#466174]">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function IntelligenceFieldGroup({
  title,
  items,
}: {
  title: string;
  items: ReadonlyArray<{
    label: string;
    value: string;
    status: string;
    source: string;
  }>;
}) {
  return (
    <section className="rounded-2xl border border-[#dbe5ed] bg-white p-5">
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#466174]">{title}</p>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item.label} className="border-b border-[#edf2f5] pb-3 last:border-0 last:pb-0">
            <div className="flex items-start justify-between gap-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#466174]">{item.label}</p>
              <span className={`shrink-0 rounded-full px-2 py-1 text-[9px] font-bold uppercase tracking-[0.08em] ${item.status === "needs-setup" ? "bg-[#fff0d5] text-[#8a5200]" : item.status === "review" ? "bg-[#e8f5f4] text-[#087b68]" : "bg-[#e8f4fa] text-[#1377b8]"}`}>
                {item.status === "needs-setup" ? "Needs setup" : item.status === "review" ? "Review" : "Mapped"}
              </span>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-[#102336]">{item.value}</p>
            <p className="mt-1 text-[10px] text-[#466174]">Source: {item.source}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function PartnershipPreview() {
  const groups = [
    { title: "We bring them", tone: "blue", items: calvennPartnership.weBringThem, badge: "Confirmed discussion" },
    { title: "They bring us", tone: "blue", items: calvennPartnership.theyBringUs, badge: "Confirmed discussion" },
    { title: "Co-op ideas", tone: "teal", items: calvennPartnership.coopIdeas, badge: "Proposed" },
    { title: "Commission / terms", tone: "amber", items: calvennPartnership.terms, badge: "Not discussed" },
  ] as const;
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 rounded-2xl border border-amber-300/45 bg-amber-50 p-4 text-amber-950 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[10px] font-black uppercase tracking-[0.14em]">{calvennPartnership.status}</p>
            <span className="rounded-full bg-amber-200 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.1em]">Tenant scoped</span>
          </div>
          <p className="mt-2 max-w-3xl text-xs leading-relaxed">
            Source: {calvennPartnership.source}. {calvennPartnership.lastAnalyzed}. This view keeps
            confirmed discussion, proposed ideas, and terms that have not been discussed separate.
            It does not create agreements or trigger outreach.
          </p>
        </div>
        <button
          type="button"
          disabled
          title="Canonical partnership persistence and audit are not connected"
          className="inline-flex shrink-0 items-center justify-center rounded-xl border border-amber-300/70 bg-white/60 px-3 py-2 text-xs font-semibold text-amber-900 opacity-75"
        >
          Edit partnership · setup required
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {groups.map((group) => (
          <section key={group.title} className={`rounded-2xl border p-5 ${group.tone === "amber" ? "border-amber-200 bg-amber-50/60" : group.tone === "teal" ? "border-teal-200 bg-teal-50/50" : "border-[#dbe5ed] bg-white"}`}>
            <div className="flex items-start justify-between gap-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#466174]">{group.title}</p>
              <span className={`rounded-full px-2 py-1 text-[9px] font-bold uppercase tracking-[0.08em] ${group.tone === "amber" ? "bg-amber-200 text-amber-900" : group.tone === "teal" ? "bg-teal-100 text-teal-800" : "bg-[#e8f4fa] text-[#1377b8]"}`}>
                {group.badge}
              </span>
            </div>
            <div className="mt-4 space-y-3">
              {group.items.map((item) => (
                <p key={item} className="rounded-xl border border-black/[0.06] bg-white/70 p-3 text-sm leading-relaxed text-[#102336]">
                  {item}
                </p>
              ))}
            </div>
            <p className="mt-3 text-[10px] text-[#466174]">Source confidence: requires owner review before use.</p>
          </section>
        ))}
      </div>

      <section className="rounded-2xl border border-[#dbe5ed] bg-white p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#466174]">Partnership record boundary</p>
            <h4 className="mt-1 text-base font-semibold text-[#102336]">Review before any external action</h4>
          </div>
          <span className="rounded-full bg-[#fff0d5] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#8a5200]">No writes</span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-[#466174]">
          Nothing in this view changes contacts, sends outreach, publishes an offer, records a
          commission, or changes partner terms. A future edit path requires tenant-scoped
          persistence, an audit trail, and explicit owner approval.
        </p>
      </section>
    </div>
  );
}

function LegacyWebsitesCard({ sitesHref }: { sitesHref?: string }) {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Websites & landing pages
          </p>
          <h3 className="mt-1 text-lg font-semibold text-white">Your digital front doors</h3>
        </div>
        <PanelTop className="h-5 w-5 text-indigo-300" />
      </div>
      <div className="mt-5 space-y-2">
        {websites.map((site) => (
          <a
            key={site.name}
            href={site.href ?? sitesHref}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex w-full items-center gap-3 rounded-xl border border-white/[0.06] bg-[#0b0f1a] p-3 text-left transition hover:border-indigo-300/30 hover:bg-white/[0.05]"
          >
            <div className={`h-10 w-1 rounded-full bg-gradient-to-b ${site.accent}`} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-medium text-slate-200">{site.name}</p>
                <span
                  className={`rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${site.status === "Live" ? "bg-emerald-400/10 text-emerald-300" : "bg-amber-400/10 text-amber-200"}`}
                >
                  {site.status}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-600">{site.detail}</p>
            </div>
            <span className="text-right text-[11px] text-slate-500">{site.metric}</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-slate-600 transition group-hover:text-indigo-300" />
          </a>
        ))}
      </div>
      {sitesHref ? (
        <a
          href={sitesHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-indigo-300"
        >
          Open primary site <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      ) : (
        <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-slate-500">
          Open primary site <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      )}
    </section>
  );
}

function ReportsCard({ client }: { client: ClientConfig }) {
  const clientReports = client.locationId === "QsbCjo5HFBGuRG0AKms0" ? reports : [];
  if (!clientReports.length) {
    return (
      <section className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5 sm:p-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
          Intelligence reports
        </p>
        <h3 className="mt-1 text-lg font-semibold text-white">
          {client.name} reports are not configured yet
        </h3>
        <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-500">
          Client-specific audience, competitive, search, and content reports will appear here when
          they are added to this sub-account workspace.
        </p>
      </section>
    );
  }
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Intelligence reports
          </p>
          <h3 className="mt-1 text-lg font-semibold text-white">Know what is changing</h3>
          <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-500">
            These are the client-context reports that ground the posting machine: audience signals,
            competitive whitespace, search opportunities, AI visibility, and video hooks.
          </p>
        </div>
        <FileText className="h-5 w-5 text-emerald-300" />
      </div>
      <div className="mt-5 space-y-3">
        {clientReports.map((report) => {
          const Icon = report.icon;
          return (
            <a
              key={report.name}
              href={report.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex w-full items-start gap-3 rounded-xl border border-white/[0.06] bg-[#0b0f1a] p-4 text-left transition hover:border-emerald-300/25 hover:bg-white/[0.05]"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-300/15 bg-emerald-300/[0.07] text-emerald-200">
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-200">{report.name}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">{report.detail}</p>
                <p className="mt-3 text-[10px] uppercase tracking-[0.12em] text-slate-600">
                  {report.updated}
                </p>
              </div>
              <ArrowUpRight className="mt-1 h-3.5 w-3.5 shrink-0 text-slate-600 transition group-hover:text-emerald-300" />
            </a>
          );
        })}
      </div>
      <p className="mt-4 text-xs text-slate-600">
        Open a report above to view the full intelligence file.
      </p>
    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  detail,
}: {
  eyebrow: string;
  title: string;
  detail: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{eyebrow}</p>
      <div className="mt-2 flex flex-col justify-between gap-2 md:flex-row md:items-end">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <p className="max-w-xl text-xs leading-relaxed text-slate-600 md:text-right">{detail}</p>
      </div>
    </div>
  );
}

function MessagePreviewModal({
  conversations: visibleConversations,
  live,
  onClose,
  inboxHref,
}: {
  conversations: LiveConversation[];
  live: boolean;
  onClose: () => void;
  inboxHref?: string;
}) {
  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0b0f1a] p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
              {live ? "Live inbox preview" : "Embedded inbox test"}
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Actual message preview</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              {live
                ? "Read-only messages from the connected HighLevel inbox."
                : "This is the visual behavior we would aim for: a client sees the latest messages here, then can open the full HighLevel conversation thread."}
            </p>
          </div>
          <button
            aria-label="Close message preview"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-white/[0.06] hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-6 space-y-3">
          {visibleConversations.map((conversation, index) => (
            <div
              key={conversation.id ?? conversation.name}
              className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${["bg-cyan-300/15 text-cyan-100", "bg-violet-300/15 text-violet-100", "bg-amber-300/15 text-amber-100"][index % 3]}`}
                >
                  {conversation.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-white">{conversation.name}</p>
                    <span className="text-[11px] text-slate-600">
                      {live
                        ? formatRelativeTime(conversation.lastMessageDate)
                        : ((conversation as { time?: string }).time ?? "recently")}{" "}
                      ago
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">
                    {conversation.preview}
                  </p>
                  <p className="mt-3 text-[10px] uppercase tracking-[0.12em] text-slate-600">
                    {conversation.channel} · {live ? "live message" : "sample message"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            onClick={onClose}
            className="rounded-xl border border-white/[0.1] px-4 py-3 text-sm font-medium text-slate-300 hover:bg-white/[0.06]"
          >
            Close preview
          </button>
          {inboxHref ? (
            <a
              href={inboxHref}
              target="_top"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-200"
            >
              Open full inbox in HighLevel <ArrowUpRight className="h-4 w-4" />
            </a>
          ) : (
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-200"
            >
              Open full inbox in HighLevel <ArrowUpRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

type LiveThreadMessage = {
  id?: string;
  body: string;
  direction: string;
  type: string;
  dateAdded?: string;
  status?: string;
};

type ReplyCapability = {
  replyable: boolean;
  channel?: string;
  contactPhone?: string;
  reason?: string | null;
  mode?: "live" | "synthetic_sink" | "disabled";
  csrfToken?: string;
};

type AiSuggestionResponse = {
  status: "ready" | "unavailable";
  mode?: "provider" | "development_test";
  provider?: string | null;
  csrfToken?: string;
  reviewId?: string;
  reviewStatus?: "proposed" | "approved" | "rejected" | "dismissed" | "expired";
  reviewCreated?: boolean;
  editedDraft?: string | null;
  draftVersion?: number;
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
    contactName?: string;
    channel?: string;
    messageCount: number;
    contextLimit?: number;
    latestMessageAt?: string;
    latestMessagePreview?: string;
  };
  review?: {
    requiresHumanApproval: true;
    sendsMessages: false;
    changesHighLevel: false;
  };
  unavailable?: { code?: string; message?: string };
};

function AiSuggestionReview({ live, conversationId }: { live: boolean; conversationId?: string }) {
  const [requestState, setRequestState] = useState<
    "idle" | "loading" | "ready" | "unavailable" | "error"
  >("idle");
  const [result, setResult] = useState<AiSuggestionResponse | null>(null);
  const [draft, setDraft] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const [reviewId, setReviewId] = useState("");
  const [reviewState, setReviewState] = useState<
    "unreviewed" | "approved" | "rejected" | "dismissed" | "expired"
  >("unreviewed");
  const [reviewActionState, setReviewActionState] = useState<"idle" | "saving" | "error">("idle");
  const [reviewError, setReviewError] = useState("");

  useEffect(() => {
    setRequestState("idle");
    setResult(null);
    setDraft("");
    setCsrfToken("");
    setReviewId("");
    setReviewState("unreviewed");
    setReviewActionState("idle");
    setReviewError("");
  }, [conversationId, live]);

  const generateSuggestion = async () => {
    if (!live || !conversationId || requestState === "loading") return;
    setRequestState("loading");
    setResult(null);
    setDraft("");
    setReviewState("unreviewed");
    try {
      const response = await fetch(
        `/api/ai-suggestion?conversationId=${encodeURIComponent(conversationId)}`,
        { cache: "no-store" },
      );
      const payload = (await response.json()) as AiSuggestionResponse & { error?: string };
      if (!response.ok)
        throw new Error(payload.unavailable?.message ?? payload.error ?? "Suggestion unavailable.");
      setCsrfToken(payload.csrfToken ?? "");
      if (payload.status === "ready") {
        if (!payload.csrfToken) throw new Error("Review protection token unavailable.");
        const createResponse = await fetch("/api/ai-suggestion", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-command-center-csrf": payload.csrfToken,
          },
          body: JSON.stringify({
            action: "create",
            conversationId,
            idempotencyKey: crypto.randomUUID(),
          }),
          cache: "no-store",
        });
        const stored = (await createResponse.json()) as AiSuggestionResponse & { error?: string };
        if (!createResponse.ok)
          throw new Error(stored.error ?? "Durable review state is unavailable.");
        setResult({ ...payload, ...stored });
        setReviewId(stored.reviewId ?? "");
        setDraft(stored.draft ?? stored.suggestion ?? "");
        setReviewState(stored.reviewStatus === "approved" ? "approved" : "unreviewed");
        setRequestState("ready");
      } else {
        setResult(payload);
        setRequestState("unavailable");
      }
    } catch (error) {
      setRequestState("error");
      setResult({
        status: "unavailable",
        unavailable: {
          message: error instanceof Error ? error.message : "Suggestion service unavailable.",
        },
      });
    }
  };

  const performReviewAction = async (action: "approved" | "rejected" | "dismissed") => {
    if (!reviewId || !csrfToken || reviewActionState === "saving") return;
    setReviewActionState("saving");
    setReviewError("");
    const originalDraft = result?.draft ?? result?.suggestion ?? "";
    try {
      const response = await fetch("/api/ai-suggestion", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-command-center-csrf": csrfToken,
        },
        body: JSON.stringify({
          action,
          reviewId,
          editedDraft: draft !== originalDraft ? draft : undefined,
          idempotencyKey: crypto.randomUUID(),
        }),
        cache: "no-store",
      });
      const payload = (await response.json()) as AiSuggestionResponse & { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Review decision could not be saved.");
      setResult((current) => ({ ...current, ...payload }));
      setReviewState(action);
      setReviewActionState("idle");
    } catch (error) {
      setReviewActionState("error");
      setReviewError(
        error instanceof Error ? error.message : "Review decision could not be saved.",
      );
    }
  };

  return (
    <section className="mt-4 rounded-xl border border-violet-300/20 bg-violet-300/[0.05] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-600" />
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-violet-700">
              AI suggestion · human review
            </p>
          </div>
          <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-500">
            Draft assistance only. Nothing here sends a message or changes HighLevel.
          </p>
        </div>
        <span className="rounded-full border border-violet-300/30 bg-violet-300/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-violet-700">
          Review only
        </span>
      </div>

      {!live && (
        <p className="mt-4 rounded-lg border border-white/[0.08] bg-white/[0.035] px-3 py-3 text-xs text-slate-500">
          Suggestions are available only for an authenticated live tenant conversation.
        </p>
      )}

      {live && requestState === "idle" && (
        <button
          type="button"
          onClick={() => void generateSuggestion()}
          disabled={!conversationId}
          className="mt-4 inline-flex items-center gap-2 rounded-xl border border-violet-300/30 bg-violet-300/10 px-3 py-2 text-xs font-semibold text-violet-700 hover:bg-violet-300/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Generate review suggestion
        </button>
      )}

      {requestState === "loading" && (
        <p className="mt-4 text-xs text-slate-500" aria-live="polite">
          Checking the approved suggestion provider…
        </p>
      )}

      {(requestState === "unavailable" || requestState === "error") && result?.unavailable && (
        <div
          className="mt-4 rounded-lg border border-amber-300/25 bg-amber-300/[0.08] px-3 py-3 text-xs text-amber-800"
          role="status"
        >
          <p className="font-semibold">AI suggestion unavailable</p>
          <p className="mt-1 leading-relaxed">
            {result.unavailable.message ?? "No suggestion was generated."}
          </p>
        </div>
      )}

      {requestState === "ready" && result?.status === "ready" && (
        <div className="mt-4 rounded-lg border border-violet-300/20 bg-white/[0.045] p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-violet-700">
              {result.mode === "development_test"
                ? "Development/test suggestion"
                : "Provider suggestion"}
            </p>
            <span className="text-[10px] text-slate-500">
              {result.source?.messageCount ?? 0} source messages · bounded context · durable review
            </span>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-white/[0.08] bg-white/[0.035] p-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-500">
                Summary
              </p>
              <p className="mt-1 text-sm leading-relaxed text-slate-700">
                {result.summary ?? "No summary returned."}
              </p>
            </div>
            <div className="rounded-lg border border-white/[0.08] bg-white/[0.035] p-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-500">
                Next action
              </p>
              <p className="mt-1 text-sm leading-relaxed text-slate-700">
                {result.nextAction ?? "No next action returned."}
              </p>
            </div>
          </div>
          {result.evidence?.length ? (
            <div className="mt-3 rounded-lg border border-cyan-300/15 bg-cyan-300/[0.04] p-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-cyan-700">
                Evidence from thread
              </p>
              <div className="mt-2 space-y-2">
                {result.evidence.map((item) => (
                  <div
                    key={item.messageId}
                    className="rounded-md border border-white/[0.08] bg-white/[0.035] p-2"
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                      {item.direction}
                      {item.dateAdded ? ` · ${formatRelativeTime(item.dateAdded)}` : ""}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-700">{item.excerpt}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          <textarea
            value={draft || result.draft || ""}
            onChange={(event) => {
              setDraft(event.target.value);
              setReviewState("unreviewed");
            }}
            rows={4}
            aria-label="AI suggestion draft for human review"
            className="mt-3 w-full resize-y rounded-lg border border-white/[0.1] bg-white/[0.04] px-3 py-3 text-sm leading-relaxed text-slate-700 outline-none ring-violet-300/30 placeholder:text-slate-400 focus:ring-2"
          />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-slate-500" aria-live="polite">
              {reviewState === "approved"
                ? "Approved for human follow-through only; no external action was taken."
                : reviewState === "rejected"
                  ? "Rejected for human follow-through; no external action was taken."
                  : reviewState === "dismissed"
                    ? "Dismissed; no external action was taken."
                    : reviewState === "expired"
                      ? "Expired; generate a new review before follow-through."
                      : reviewActionState === "error"
                        ? reviewError
                        : "Edit and review this draft before deciding what to do in the native inbox."}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => void performReviewAction("dismissed")}
                disabled={reviewActionState === "saving"}
                className="rounded-lg border border-white/[0.1] px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-white/[0.06]"
              >
                Dismiss
              </button>
              <button
                type="button"
                onClick={() => void performReviewAction("rejected")}
                disabled={reviewActionState === "saving"}
                className="rounded-lg border border-rose-300/30 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-300/10 disabled:opacity-50"
              >
                Reject
              </button>
              <button
                type="button"
                onClick={() => void performReviewAction("approved")}
                disabled={reviewActionState === "saving"}
                className="rounded-lg bg-violet-600 px-3 py-2 text-xs font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
              >
                {reviewActionState === "saving" ? "Saving…" : "Approve for human follow-through"}
              </button>
            </div>
          </div>
          {result.riskFlags?.length ? (
            <div className="mt-3 rounded-lg border border-amber-300/20 bg-amber-300/[0.07] p-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-amber-800">
                Risks and guardrails
              </p>
              <ul className="mt-2 space-y-1 text-xs leading-relaxed text-amber-900">
                {result.riskFlags.map((risk) => (
                  <li key={risk}>• {risk}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}

function LiveInboxModal({
  conversations,
  live,
  selectedConversationId,
  onClose,
  inboxHref,
}: {
  conversations: LiveConversation[];
  live: boolean;
  selectedConversationId?: string;
  onClose: () => void;
  inboxHref?: string;
}) {
  const [selectedId, setSelectedId] = useState(selectedConversationId || conversations[0]?.id);
  const [messages, setMessages] = useState<LiveThreadMessage[]>([]);
  const [nextPage, setNextPage] = useState(false);
  const [lastMessageId, setLastMessageId] = useState<string | undefined>();
  const [olderLoading, setOlderLoading] = useState(false);
  const [threadState, setThreadState] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [threadError, setThreadError] = useState("");
  const [replyCapability, setReplyCapability] = useState<ReplyCapability | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyState, setReplyState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [replyError, setReplyError] = useState("");
  const selected =
    conversations.find((conversation) => conversation.id === selectedId) ?? conversations[0];
  useEffect(() => {
    if (!live || !selected?.id) return;
    let cancelled = false;
    setThreadState("loading");
    setThreadError("");
    setMessages([]);
    setNextPage(false);
    setLastMessageId(undefined);
    setReplyCapability(null);
    setReplyText("");
    setReplyState("idle");
    setReplyError("");
    void fetch(`/api/conversation?conversationId=${encodeURIComponent(selected.id)}`, {
      cache: "no-store",
    })
      .then(async (response) => {
        const payload = (await response.json()) as {
          messages?: LiveThreadMessage[];
          error?: string;
          nextPage?: boolean;
          lastMessageId?: string;
        };
        if (!response.ok) throw new Error(payload.error ?? "Unable to load this conversation.");
        return payload;
      })
      .then((payload) => {
        if (!cancelled) {
          setMessages(payload.messages ?? []);
          setNextPage(Boolean(payload.nextPage));
          setLastMessageId(payload.lastMessageId || undefined);
          setThreadState("ready");
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setThreadState("error");
          setThreadError(
            error instanceof Error ? error.message : "Unable to load this conversation.",
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, [live, selected?.id]);
  useEffect(() => {
    if (!live || !selected?.id) return;
    let cancelled = false;
    void fetch(`/api/reply-capability?conversationId=${encodeURIComponent(selected.id)}`, {
      cache: "no-store",
    })
      .then(async (response) => {
        const payload = (await response.json()) as ReplyCapability;
        if (!response.ok) throw new Error(payload.reason ?? "Reply capability unavailable.");
        return payload;
      })
      .then((payload) => {
        if (!cancelled) setReplyCapability(payload);
      })
      .catch(() => {
        if (!cancelled) setReplyCapability({ replyable: false, reason: "capability_unavailable" });
      });
    return () => {
      cancelled = true;
    };
  }, [live, selected?.id]);
  const sendReply = async () => {
    if (
      !selected?.id ||
      !replyCapability?.replyable ||
      !replyCapability.csrfToken ||
      !replyText.trim()
    )
      return;
    setReplyState("sending");
    setReplyError("");
    try {
      const response = await fetch("/api/reply", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-command-center-csrf": replyCapability.csrfToken,
        },
        body: JSON.stringify({
          conversationId: selected.id,
          message: replyText.trim(),
          idempotencyKey: crypto.randomUUID(),
        }),
      });
      const payload = (await response.json()) as {
        error?: string;
        reason?: string;
        status?: string;
      };
      if (!response.ok) throw new Error(payload.reason ?? payload.error ?? "Reply was blocked.");
      setReplyState("sent");
      setReplyText("");
    } catch (error) {
      setReplyState("error");
      setReplyError(error instanceof Error ? error.message : "Reply was blocked.");
    }
  };
  const loadOlderMessages = async () => {
    if (!selected?.id || !lastMessageId || olderLoading) return;
    setOlderLoading(true);
    try {
      const response = await fetch(
        `/api/conversation?conversationId=${encodeURIComponent(selected.id)}&lastMessageId=${encodeURIComponent(lastMessageId)}`,
        { cache: "no-store" },
      );
      const payload = (await response.json()) as {
        messages?: LiveThreadMessage[];
        nextPage?: boolean;
        lastMessageId?: string;
        error?: string;
      };
      if (!response.ok) throw new Error(payload.error ?? "Unable to load older messages.");
      setMessages((current) => [...(payload.messages ?? []), ...current]);
      setNextPage(Boolean(payload.nextPage));
      setLastMessageId(payload.lastMessageId || undefined);
    } catch (error) {
      setThreadError(error instanceof Error ? error.message : "Unable to load older messages.");
    } finally {
      setOlderLoading(false);
    }
  };
  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b0f1a] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
              {live ? "Authenticated live inbox" : "Embedded inbox test"}
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Read conversations in the Command Center
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              Messages are fetched server-side from Calvenn’s HighLevel location. This pass is
              read-only; reply actions remain intentionally disabled.
            </p>
          </div>
          <button
            aria-label="Close inbox"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-white/[0.06] hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="grid min-h-0 flex-1 gap-5 overflow-auto p-6 lg:grid-cols-[minmax(220px,0.8fr)_minmax(0,1.4fr)]">
          <div className="space-y-2">
            {conversations.length ? (
              conversations.map((conversation) => (
                <button
                  type="button"
                  key={conversation.id ?? conversation.name}
                  onClick={() => setSelectedId(conversation.id)}
                  className={`w-full rounded-xl border p-3 text-left ${selected?.id === conversation.id ? "border-cyan-300/50 bg-cyan-300/10" : "border-white/[0.07] bg-white/[0.025] hover:bg-white/[0.05]"}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-300/15 text-[10px] font-semibold text-cyan-100">
                      {conversation.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">{conversation.name}</p>
                      <p className="mt-1 truncate text-xs text-slate-500">{conversation.preview}</p>
                      <p className="mt-2 text-[10px] uppercase tracking-[0.12em] text-slate-600">
                        {conversation.channel} · {formatRelativeTime(conversation.lastMessageDate)}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <p className="py-8 text-center text-sm text-slate-500">No conversations returned.</p>
            )}
          </div>
          <div className="min-h-[320px] rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
            {selected ? (
              <>
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/[0.07] pb-4">
                  <div>
                    <p className="text-lg font-semibold text-white">{selected.name}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {selected.email || selected.phone || "Contact details unavailable"}
                    </p>
                  </div>
                  <span className="rounded-full border border-emerald-300/20 bg-emerald-300/[0.07] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-300">
                    {replyCapability?.replyable && replyCapability.mode === "live"
                      ? "Live inbox"
                      : "Read only"}
                  </span>
                </div>
                <div className="mt-4 rounded-xl border border-amber-300/15 bg-amber-300/[0.06] px-4 py-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-amber-200">
                      Reply path
                    </p>
                    <span className="text-xs font-medium text-amber-100">
                      {replyCapability?.replyable
                        ? replyCapability.mode === "live"
                          ? "Live SMS ready"
                          : replyCapability.mode === "synthetic_sink"
                            ? "Synthetic sink ready"
                            : "Supervised reply ready"
                        : "Read-only"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">
                    {replyCapability?.replyable
                      ? replyCapability.mode === "live"
                        ? `SMS reply target verified${replyCapability.contactPhone ? ` · ${replyCapability.contactPhone}` : ""}. Sending here creates a real HighLevel message.`
                        : replyCapability.mode === "synthetic_sink"
                          ? "This approved Phase 3A path records the reply attempt and audit events without sending an external message."
                          : `SMS reply target verified${replyCapability.contactPhone ? ` · ${replyCapability.contactPhone}` : ""}. A second confirmation will be required before any send.`
                      : "The server is checking the SMS path, but outbound writes remain disabled until the sender policy, audit trail, and duplicate-send protection are verified."}
                  </p>
                </div>
                {replyCapability?.replyable && (
                  <div className="mt-4 rounded-xl border border-cyan-300/15 bg-cyan-300/[0.04] p-4">
                    <label
                      className="text-xs font-semibold uppercase tracking-[0.12em] text-cyan-200"
                      htmlFor="command-center-reply"
                    >
                      Protected reply composer
                    </label>
                    <textarea
                      id="command-center-reply"
                      value={replyText}
                      onChange={(event) => {
                        setReplyText(event.target.value);
                        if (replyState !== "idle") setReplyState("idle");
                      }}
                      maxLength={2000}
                      rows={4}
                      placeholder={
                        replyCapability.mode === "live"
                          ? "Write a reply to send through HighLevel…"
                          : "Write a synthetic test reply…"
                      }
                      className="mt-3 w-full resize-y rounded-xl border border-white/[0.1] bg-slate-950/60 px-3 py-3 text-sm text-slate-100 outline-none ring-cyan-300/30 placeholder:text-slate-600 focus:ring-2"
                    />
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <p className="text-xs text-slate-500">
                        {replyState === "sent"
                          ? replyCapability.mode === "live"
                            ? "Queued through HighLevel."
                            : "Recorded in the synthetic sink; no external message was sent."
                          : replyState === "error"
                            ? replyError
                            : `${replyText.length}/2000 characters`}
                      </p>
                      <button
                        type="button"
                        onClick={() => void sendReply()}
                        disabled={replyState === "sending" || !replyText.trim()}
                        className="rounded-xl bg-cyan-300 px-4 py-2.5 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {replyState === "sending"
                          ? replyCapability.mode === "live"
                            ? "Sending…"
                            : "Recording…"
                          : replyCapability.mode === "live"
                            ? "Send SMS"
                            : "Record synthetic reply"}
                      </button>
                    </div>
                  </div>
                )}
                <AiSuggestionReview live={live} conversationId={selected.id} />
                {threadState === "loading" && (
                  <p className="py-12 text-center text-sm text-slate-500">
                    Loading message history…
                  </p>
                )}
                {threadState === "error" && (
                  <p className="py-12 text-center text-sm text-amber-200">{threadError}</p>
                )}
                {threadState === "ready" && (
                  <div className="mt-5 space-y-3">
                    {nextPage && (
                      <button
                        type="button"
                        onClick={() => void loadOlderMessages()}
                        disabled={olderLoading}
                        className="w-full rounded-xl border border-cyan-300/20 bg-cyan-300/[0.06] px-3 py-2 text-xs font-semibold text-cyan-700 disabled:opacity-60"
                      >
                        {olderLoading ? "Loading older messages…" : "Load older messages"}
                      </button>
                    )}
                    {messages.length ? (
                      messages.map((message) => (
                        <article
                          key={message.id ?? `${message.dateAdded}-${message.body}`}
                          className={`max-w-[88%] rounded-2xl border p-4 ${message.direction === "outbound" ? "ml-auto border-cyan-300/20 bg-cyan-300/10" : "border-white/[0.08] bg-white/[0.04]"}`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                              {message.direction} · {message.type}
                            </span>
                            <span className="text-[10px] text-slate-600">
                              {formatRelativeTime(message.dateAdded)} ago
                            </span>
                          </div>
                          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-200">
                            {message.body}
                          </p>
                        </article>
                      ))
                    ) : (
                      <p className="py-12 text-center text-sm text-slate-500">
                        No message history returned.
                      </p>
                    )}
                  </div>
                )}
              </>
            ) : (
              <p className="py-12 text-center text-sm text-slate-500">
                Select a conversation to view its history.
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 p-6">
          <p className="text-xs text-slate-500">
            To reply or change a record, open the native HighLevel inbox.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={onClose}
              className="rounded-xl border border-white/[0.1] px-4 py-3 text-sm font-medium text-slate-300 hover:bg-white/[0.06]"
            >
              Close
            </button>
            {inboxHref && (
              <a
                href={inboxHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-200"
              >
                Open native inbox <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
