import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
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
  Settings2,
  Smartphone,
  Sparkles,
  Target,
  UsersRound,
  X,
  Youtube,
} from "lucide-react";
import { useEffect, useState, type CSSProperties } from "react";

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
    name: "Sofia at Northside Health",
    channel: "SMS",
    preview: "Can we move tomorrow's consultation to 2:30?",
    time: "8m",
    initials: "SN",
    tone: "bg-cyan-300/15 text-cyan-100",
    unread: true,
  },
  {
    name: "Marcus Johnson",
    channel: "Email",
    preview: "Re: website intake form — I added the new service area.",
    time: "32m",
    initials: "MJ",
    tone: "bg-violet-300/15 text-violet-100",
    unread: true,
  },
  {
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
    time: "10:30 AM",
    title: "Benefits consultation",
    person: "Sofia Martinez",
    color: "border-cyan-300/35 bg-cyan-300/[0.07]",
  },
  {
    time: "1:00 PM",
    title: "Partner follow-up",
    person: "Marcus Johnson",
    color: "border-violet-300/35 bg-violet-300/[0.07]",
  },
  {
    time: "Thu · 9:00 AM",
    title: "Website review",
    person: "Manifestic team",
    color: "border-amber-300/35 bg-amber-300/[0.07]",
  },
];

const tasks = [
  {
    label: "Approve the August benefits post",
    due: "Due today",
    owner: "Manifestic",
    urgent: true,
  },
  { label: "Review new landing page leads", due: "3 new", owner: "Calvenn", urgent: false },
  { label: "Send updated service-area copy", due: "Tomorrow", owner: "Calvenn", urgent: false },
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
    href: "https://yourbesthealthquote.vercel.app/",
  },
  {
    label: "Calvenn agency site",
    detail: "Agency and services site",
    href: "https://calvenn-agency.vercel.app/",
  },
  {
    label: "Content Universe",
    detail: "AI content engine overview",
    href: "https://calvenn-content-universe.vercel.app/",
  },
  {
    label: "Private health pillar",
    detail: "Content Universe landing page",
    href: "https://calvenn-content-universe.vercel.app/pillars/private-health.html",
  },
  {
    label: "ACA pillar",
    detail: "Content Universe landing page",
    href: "https://calvenn-content-universe.vercel.app/pillars/aca.html",
  },
  {
    label: "Medicare pillar",
    detail: "Content Universe landing page",
    href: "https://calvenn-content-universe.vercel.app/pillars/medicare.html",
  },
  {
    label: "Agent recruiting",
    detail: "Broker platform page",
    href: "https://ahs-broker-site.vercel.app/ahs-agent-recruiting.html",
  },
  {
    label: "Quote funnel",
    detail: "Fast-path quote request page",
    href: "https://ahs-broker-site.vercel.app/ahs-quote-funnel.html",
  },
  {
    label: "Agent site setup",
    detail: "Broker onboarding page",
    href: "https://ahs-broker-site.vercel.app/ahs-agent-site-setup.html",
  },
  {
    label: "Agent system demo",
    detail: "Broker operating-system demo",
    href: "https://ahs-broker-site.vercel.app/ahs-agent-system-demo.html",
  },
  {
    label: "Compare plans",
    detail: "Consumer comparison page",
    href: "https://ahs-broker-site.vercel.app/ahs-compare-plans.html",
  },
  {
    label: "Agent finder quiz",
    detail: "Local-agent matching page",
    href: "https://ahs-broker-site.vercel.app/ahs-agent-finder-quiz.html",
  },
  {
    label: "Subsidy calculator",
    detail: "ACA savings estimate page",
    href: "https://ahs-broker-site.vercel.app/ahs-subsidy-calculator.html",
  },
  {
    label: "Revenue project brief",
    detail: "Calvenn platform proposal",
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
  | "overview"
  | "inbox"
  | "calendar"
  | "opportunities"
  | "content"
  | "websites"
  | "reports";

const calvennLogoUrl =
  "https://assets.cdn.filesafe.space/QsbCjo5HFBGuRG0AKms0/media/5e87639f-90b5-4c90-94d9-393a5a224611.png";

const stationSurvivalLogoUrl =
  "https://stationsurvivalco.com/cdn/shop/files/REAL_REAL_SVG_SSCO_LOGO_DE000D.png?v=1777737510&width=350";

const emptyLiveData: LiveDashboardData = {
  conversations: [],
  appointments: [],
  tasks: [],
  opportunities: { total: 0, open: 0, won: 0, lost: 0, abandoned: 0, stages: [] },
};

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
  return {
    locationId,
    name,
    logoUrl: isKevin
      ? stationSurvivalLogoUrl
      : params.get("logoUrl")?.trim() || (isCalvenn ? calvennLogoUrl : ""),
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
    primaryColor: params.get("primaryColor")?.trim() || (isKevin ? "#de000d" : "#1377b8"),
    accentColor: params.get("accentColor")?.trim() || (isKevin ? "#108474" : "#0e9a85"),
    inkColor: params.get("inkColor")?.trim() || (isKevin ? "#1a1a1a" : "#102336"),
    mutedColor: params.get("mutedColor")?.trim() || "#466174",
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

function formatDueDate(value?: string) {
  if (!value) return "No due date";
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(date);
}

const HIGHLEVEL_PARENT_ORIGINS = new Set([
  "https://app.gohighlevel.com",
  "https://app.leadconnectorhq.com",
  "https://app.msgsndr.com",
]);

function requestHighLevelSignedContext() {
  if (typeof window === "undefined" || window.parent === window) return Promise.resolve<string | null>(null);
  return new Promise<string | null>((resolve) => {
    let settled = false;
    const finish = (value: string | null) => {
      if (settled) return;
      settled = true;
      window.removeEventListener("message", handleMessage);
      window.clearTimeout(timeout);
      resolve(value);
    };
    const handleMessage = (event: MessageEvent) => {
      if (!HIGHLEVEL_PARENT_ORIGINS.has(event.origin)) return;
      const data = event.data as { message?: unknown; payload?: unknown };
      if (data?.message !== "REQUEST_USER_DATA_RESPONSE") return;
      finish(typeof data.payload === "string" ? data.payload : null);
    };
    const timeout = window.setTimeout(() => finish(null), 1500);
    window.addEventListener("message", handleMessage);
    window.parent.postMessage({ message: "REQUEST_USER_DATA" }, "*");
  });
}

function ClientCommandCenter() {
  const [hydrated, setHydrated] = useState(false);
  const [authState, setAuthState] = useState<AuthState>({ status: "loading" });
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<DashboardSection>("overview");
  const [selectedConversation, setSelectedConversation] = useState(conversations[0].name);
  const [selectedConversationId, setSelectedConversationId] = useState<string | undefined>();
  const [showAllMessages, setShowAllMessages] = useState(false);
  const [liveState, setLiveState] = useState<LiveState>({ status: "idle", data: emptyLiveData });
  const [client, setClient] = useState<ClientConfig>({
    locationId: "",
    name: "Client",
    logoUrl: "",
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
  const mobileAppHref = "https://www.gohighlevel.com/post/free-mobile-app";
  const goToSection = (section: DashboardSection) => {
    setActiveSection(section);
    const params = new URLSearchParams(window.location.search);
    if (section === "overview") params.delete("section");
    else params.set("section", section);
    window.history.pushState(
      {},
      "",
      `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`,
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const refreshLiveData = async () => {
    if (!client.locationId || authState.status !== "authenticated") return;
    setLiveState((current) => ({ ...current, status: "loading", message: undefined }));
    try {
      const response = await fetch(
        `/api/dashboard-data?locationId=${encodeURIComponent(client.locationId)}`,
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
        setAuthState({ status: "authenticated", user: authPayload.user });
        const hydratedParams = new URLSearchParams(window.location.search);
        hydratedParams.set("locationId", authPayload.user.locationId || requestedLocationId);
        hydratedParams.set("clientName", authPayload.user.clientName || "Client");
        setClient(clientConfigFromQuery(hydratedParams));
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
      ["overview", "inbox", "calendar", "opportunities", "content", "websites", "reports"].includes(
        requestedSection,
      )
    )
      setActiveSection(requestedSection);
    const onPopState = () =>
      setActiveSection(
        (new URLSearchParams(window.location.search).get("section") as DashboardSection | null) ||
          "overview",
      );
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (!client.locationId) return;
    void refreshLiveData();
    const interval = window.setInterval(() => void refreshLiveData(), 60_000);
    return () => window.clearInterval(interval);
  }, [client.locationId, authState.status]);

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
  const isLive = Boolean(
    client.locationId && liveState.status === "ready" && liveSourceStatus === "live",
  );
  const isPartial = Boolean(
    client.locationId && liveState.status === "ready" && liveSourceStatus === "partial",
  );
  const visibleConversations = clientDataRequested ? liveState.data.conversations : conversations;
  const visibleAppointments = clientDataRequested ? liveState.data.appointments : appointments;
  const visibleTasks = clientDataRequested ? liveState.data.tasks : tasks;
  const visibleOpportunities = clientDataRequested
    ? liveState.data.opportunities
    : emptyLiveData.opportunities;
  const unreadCount = clientDataRequested
    ? visibleConversations.reduce(
        (total, item) =>
          total + Math.max(0, Number((item as LiveConversation).unreadCount ?? 0) || 0),
        0,
      )
    : 2;
  const firstAppointment = visibleAppointments[0];
  const sectionLabels: Record<DashboardSection, string> = {
    overview: "Dashboard",
    inbox: "Inbox & SMS",
    calendar: "Calendar",
    opportunities: "Opportunities",
    content: "Content review",
    websites: "Websites",
    reports: "Reports",
  };
  const activeLabel = sectionLabels[activeSection];

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
        <aside className="hidden w-[238px] shrink-0 border-r border-white/[0.07] bg-[#0b0f1a]/90 px-4 py-5 lg:flex lg:flex-col">
          <div className="flex items-center px-3 pb-8">
            {client.logoUrl ? (
              <img
                src={client.logoUrl}
                alt={`${client.name} logo`}
                className="h-12 w-48 rounded-xl object-contain object-left"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300 via-blue-500 to-violet-500 text-sm font-black text-slate-950 shadow-[0_0_28px_rgba(59,130,246,0.35)]">
                M
              </div>
            )}
          </div>
          <nav className="space-y-1 text-sm">
            <SideNavItem
              icon={LayoutDashboard}
              label="Dashboard"
              active={activeSection === "overview"}
              onClick={() => goToSection("overview")}
            />
            <SideNavItem
              icon={Inbox}
              label="Inbox & SMS"
              badge={`${unreadCount}`}
              active={activeSection === "inbox"}
              onClick={() => goToSection("inbox")}
            />
            <SideNavItem
              icon={CalendarDays}
              label="Calendar"
              active={activeSection === "calendar"}
              onClick={() => goToSection("calendar")}
            />
            <SideNavItem
              icon={UsersRound}
              label="Opportunities"
              active={activeSection === "opportunities"}
              onClick={() => goToSection("opportunities")}
            />
            <SideNavItem
              icon={MessageCircle}
              label="Content review"
              active={activeSection === "content"}
              onClick={() => goToSection("content")}
            />
            <SideNavItem
              icon={Globe2}
              label="Websites"
              active={activeSection === "websites"}
              onClick={() => goToSection("websites")}
            />
            <SideNavItem
              icon={BarChart3}
              label="Reports"
              active={activeSection === "reports"}
              onClick={() => goToSection("reports")}
            />
          </nav>
          <div className="mt-auto rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4">
            <div className="flex items-center gap-2 text-xs font-medium text-cyan-200">
              <Sparkles className="h-3.5 w-3.5" />
              {client.footerLabel}
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">{client.footerText}</p>
          </div>
        </aside>

        <section className="min-w-0 flex-1 px-4 py-5 sm:px-7 lg:px-10 lg:py-8">
          <header className="mx-auto max-w-[1380px]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3 lg:hidden">
                {client.logoUrl ? (
                  <img
                    src={client.logoUrl}
                    alt={`${client.name} logo`}
                    className="h-12 w-48 rounded-xl object-contain object-left"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300 via-blue-500 to-violet-500 text-sm font-black text-slate-950">
                    M
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span
                  className={`h-2 w-2 rounded-full ${isLive ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" : isPartial ? "bg-amber-300" : "bg-red-400"}`}
                />
                {isLive
                  ? "Live HighLevel data"
                  : isPartial
                    ? "Partial HighLevel data"
                    : client.locationId
                      ? "HighLevel connection unavailable"
                      : "Demo workspace · Sample data"}
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="inline-flex items-center gap-2 rounded-lg border border-white/[0.09] bg-white/[0.035] px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/[0.08]"
                  onClick={() => setCustomizeOpen((value) => !value)}
                >
                  <Settings2 className="h-3.5 w-3.5" />
                  Customize{" "}
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition ${customizeOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {client.locationId && (
                  <button
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
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-violet-300/30 bg-violet-400/15 text-xs font-semibold text-violet-100">
                  CS
                </div>
              </div>
            </div>

            <div className="mt-9 flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                  Client Command Center
                </p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                  {activeSection === "overview" ? `Good morning, ${client.name}.` : activeLabel}
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
                  {activeSection === "overview"
                    ? "Here is the high-level view of what needs attention, what is coming up, and how the digital presence is performing."
                    : `A focused ${activeLabel.toLowerCase()} workspace inside the Command Center.`}
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <RefreshCw className="h-4 w-4 text-slate-400" />
                {liveState.generatedAt
                  ? `Updated ${formatRelativeTime(liveState.generatedAt)} ago`
                  : "Updated just now"}
              </div>
            </div>
            {customizeOpen && <CustomizePanel onClose={() => setCustomizeOpen(false)} />}

            {liveState.status === "error" && (
              <div className="mt-6 rounded-xl border border-amber-300/20 bg-amber-300/[0.05] px-4 py-3 text-xs text-amber-100">
                Live data is not available yet: {liveState.message}
              </div>
            )}
            {liveState.status === "loading" && (
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
            {activeSection === "overview" ? (
              <PortalOverview
                client={client}
                isLive={isLive || isPartial}
                unreadCount={unreadCount}
                firstAppointment={firstAppointment}
                openTasks={visibleTasks.length}
                onGoToSection={goToSection}
                inboxHref={ghl("/conversations/conversations/?category=team-inbox&tab=unread")}
                calendarHref={ghl("/calendars/view")}
                calendarSettingsHref={ghl("/settings/calendars")}
                opportunitiesHref={ghl("/opportunities/list")}
                emailHref={ghl("/marketing/emails/statistics")}
                plannerHref={ghl("/marketing/social-planner")}
                contentReviewHref={contentReviewHref}
                mobileAppHref={mobileAppHref}
                socialMessagingHref={ghl("/settings/lc-integrations")}
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
                inboxHref={ghl("/conversations/conversations/?category=team-inbox&tab=unread")}
                calendarHref={ghl("/calendars/view")}
                calendarSettingsHref={ghl("/settings/calendars")}
                opportunitiesHref={ghl("/opportunities/list")}
                plannerHref={ghl("/marketing/social-planner")}
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
}: {
  icon: IconType;
  label: string;
  active?: boolean;
  badge?: string;
  href?: string;
  newTab?: boolean;
  onClick?: () => void;
}) {
  const className = `flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left ${active ? "bg-cyan-300/10 text-cyan-100" : "text-slate-500 hover:bg-white/[0.04] hover:text-slate-200"}`;
  const content = (
    <>
      <Icon className="h-4 w-4" />
      <span className="flex-1">{label}</span>
      {badge && (
        <span className="rounded-full bg-violet-400/15 px-1.5 py-0.5 text-[10px] text-violet-200">
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
            <h1 className="mt-1 text-xl font-semibold">Your Best Health Quote</h1>
          </div>
        </div>
        <p className="mt-7 text-sm leading-relaxed text-[#466174]">
          Sign in to view Calvenn’s live read-only workspace. Conversations are scoped to this
          client account, and sending remains disabled here.
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

function PortalOverview({
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
  mobileAppHref,
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
  mobileAppHref?: string;
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
              Getting started
            </p>
            <CheckCircle2 className="h-5 w-5 text-[#1377b8]" />
          </div>
          <p className="mt-5 text-sm font-semibold text-[#102336]">
            Connect the essentials that make the workspace work.
          </p>
          <div className="mt-4 space-y-3 text-xs text-[#466174]">
            <div className="flex items-start gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white font-bold text-[#1377b8]">1</span>
              <span><strong className="text-[#102336]">Calendar</strong> — connect Google or Outlook for booking links and scheduling.</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white font-bold text-[#1377b8]">2</span>
              <span><strong className="text-[#102336]">Socials</strong> — connect the channels that should receive approved content. Post comments are handled in Social Planner; DMs need the messaging integration.</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white font-bold text-[#1377b8]">3</span>
              <span><strong className="text-[#102336]">Mobile app</strong> — keep conversations, calendars, and follow-up available from your phone.</span>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <QuickLink href={calendarSettingsHref} label="Connect calendar" icon={CalendarDays} />
            <QuickLink href={plannerHref} label="Connect socials" icon={Instagram} />
            <QuickLink href={socialMessagingHref} label="Connect social messages" icon={MessageCircle} />
            <QuickLink href={mobileAppHref} label="Get mobile app" icon={Smartphone} target="_blank" />
          </div>
          <p className="mt-4 text-[11px] text-[#466174]">Use the same HighLevel credentials in the LeadConnector mobile app.</p>
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
            title="Inbox & SMS"
            detail={`${unreadCount} unread · two-way follow-up`}
            tone="blue"
            onClick={() => onGoToSection("inbox")}
          />
          <PortalActionCard
            icon={MessageCircle}
            title="Content review"
            detail="Posts + images waiting for approval"
            tone="teal"
            href={contentReviewHref}
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
  inboxHref,
  calendarHref,
  calendarSettingsHref,
  opportunitiesHref,
  plannerHref,
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
  inboxHref?: string;
  calendarHref?: string;
  calendarSettingsHref?: string;
  opportunitiesHref?: string;
  plannerHref?: string;
}) {
  const labels: Record<DashboardSection, string> = {
    overview: "Dashboard",
    inbox: "Inbox & SMS",
    calendar: "Calendar",
    opportunities: "Opportunities",
    content: "Content review",
    websites: "Websites",
    reports: "Reports",
  };
  const detail: Record<DashboardSection, string> = {
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
            plannerHref={plannerHref}
            socialHref={plannerHref}
            calendarSettingsHref={calendarSettingsHref}
          />
        )}
        {section === "websites" && (
          <WebsitesCard client={client} sitesHref={client.websiteUrl || undefined} />
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

function TasksCard({ tasks: visibleTasks, live }: { tasks: LiveTask[]; live: boolean }) {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5 sm:p-6">
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

type ContentReviewTab = "social" | "blogs" | "ideas" | "library";

function ContentReviewCard({
  clientName,
  reviewUrl,
  plannerHref,
  socialHref,
  calendarSettingsHref,
}: {
  clientName: string;
  reviewUrl?: string;
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
      plannerHref={plannerHref}
      socialHref={socialHref}
      calendarSettingsHref={calendarSettingsHref}
    />
  );
}

function ContentReviewPrototype({
  clientName,
  plannerHref,
  socialHref,
  calendarSettingsHref,
}: {
  clientName: string;
  plannerHref?: string;
  socialHref?: string;
  calendarSettingsHref?: string;
}) {
  const [tab, setTab] = useState<ContentReviewTab>("social");
  const tabs: Array<{ id: ContentReviewTab; label: string; count: string }> = [
    { id: "social", label: "Social", count: "0" },
    { id: "blogs", label: "Blogs", count: "0" },
    { id: "ideas", label: "Video ideas", count: "0" },
    { id: "library", label: "Library", count: "0" },
  ];
  const socialItems = [
    {
      type: "Still post",
      title: "Client social post",
      status: "Awaiting batch",
      version: "Copy · Media pending",
      tone: "border-amber-300/30 bg-amber-300/[0.06]",
    },
    {
      type: "Video post",
      title: "Client video draft",
      status: "Awaiting batch",
      version: "Storyboard · Media pending",
      tone: "border-emerald-300/25 bg-emerald-300/[0.05]",
    },
    {
      type: "Still post",
      title: "Client library item",
      status: "Awaiting batch",
      version: "Archived content pending",
      tone: "border-cyan-300/25 bg-cyan-300/[0.05]",
    },
  ];
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
      {tab === "social" && (
        <div className="mt-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white">Client content batch</p>
              <p className="mt-1 text-xs text-slate-500">
                Still posts and finished videos stay together for one approval pass.
              </p>
            </div>
            <span className="rounded-full bg-amber-300/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-200">
              Not provisioned
            </span>
          </div>
          <div className="mt-4 grid gap-3 lg:grid-cols-3">
            {socialItems.map((item) => (
              <article key={item.title} className={`rounded-xl border p-4 ${item.tone}`}>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                    {item.type}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">{item.status}</span>
                </div>
                <h4 className="mt-3 text-sm font-semibold text-white">{item.title}</h4>
                <p className="mt-2 text-xs text-slate-500">Current batch · {item.version}</p>
                <div className="mt-4 flex gap-2">
                  <span className="rounded-lg border border-white/[0.08] px-2 py-1 text-[10px] text-slate-500">
                    Approve
                  </span>
                  <span className="rounded-lg border border-white/[0.08] px-2 py-1 text-[10px] text-slate-500">
                    Request changes
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
      {tab === "blogs" && (
        <div className="mt-5 rounded-xl border border-white/[0.07] bg-white/[0.025] p-5">
          <p className="text-sm font-semibold text-white">Content architecture review</p>
          <p className="mt-2 text-xs leading-relaxed text-slate-400">
            Core answer pages, supporting questions, and the social layer are reviewed as one
            cluster after the client-specific review link is provisioned.
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {["Core answer pages", "Supporting questions", "Social layer"].map((label) => (
              <div
                key={label}
                className="rounded-xl border border-white/[0.07] p-3 text-xs font-semibold text-slate-300"
              >
                {label}
                <span className="mt-2 block text-[10px] font-normal text-slate-600">
                  Ready for review
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      {tab === "ideas" && (
        <div className="mt-5 rounded-xl border border-violet-300/15 bg-violet-300/[0.05] p-5">
          <p className="text-sm font-semibold text-white">
            Concept slate → storyboard → production
          </p>
          <p className="mt-2 text-xs leading-relaxed text-slate-400">
            Typed or voice-led directions stay separate from final social approvals. The written
            brief remains the source of truth before production.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {["Client concepts", "Selected direction", "Storyboard pending"].map((label) => (
              <span
                key={label}
                className="rounded-full border border-violet-300/20 px-3 py-1.5 text-[10px] font-semibold text-violet-200"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      )}
      {tab === "library" && (
        <div className="mt-5 rounded-xl border border-white/[0.07] bg-white/[0.025] p-5">
          <p className="text-sm font-semibold text-white">Archived batches</p>
          <p className="mt-2 text-xs leading-relaxed text-slate-400">
            Resolved prior batches move here while unresolved change requests remain visible until
            they are resolved or archived.
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {["Prior batch", "Earlier batch", "Archived content"].map((label) => (
              <div
                key={label}
                className="rounded-xl border border-white/[0.07] p-3 text-xs font-semibold text-slate-300"
              >
                {label}
                <span className="mt-2 block text-[10px] font-normal text-slate-600">
                  Archived batch
                </span>
              </div>
            ))}
          </div>
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

function WebsitesCard({ client, sitesHref }: { client: ClientConfig; sitesHref?: string }) {
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
  return <LegacyWebsitesCard sitesHref={sitesHref} />;
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

function CustomizePanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="mt-7 rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.045] p-5 shadow-2xl shadow-cyan-950/20">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-white">Configure this client view</p>
          <p className="mt-1 text-xs text-slate-400">
            The production version can turn modules on or off after the client discovery call.
          </p>
        </div>
        <button
          aria-label="Close customization"
          className="text-slate-500 hover:text-white"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {[
          "Inbox preview",
          "Calendar",
          "Tasks",
          "Content & social",
          "Websites",
          "Reports",
          "Brand guide",
        ].map((label, index) => (
          <span
            key={label}
            className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs ${index === 6 ? "border-white/[0.08] bg-white/[0.025] text-slate-500" : "border-cyan-300/25 bg-cyan-300/10 text-cyan-100"}`}
          >
            <span
              className={`flex h-4 w-4 items-center justify-center rounded border ${index === 6 ? "border-white/20" : "border-cyan-300 bg-cyan-300 text-slate-950"}`}
            >
              {index !== 6 && <Check className="h-3 w-3" />}
            </span>
            {label}
          </span>
        ))}
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
