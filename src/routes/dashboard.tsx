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
  FileBarChart,
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
  Settings2,
  Sparkles,
  UsersRound,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Client Command Center — Manifestic" },
      {
        name: "description",
        content: "A focused client dashboard prototype for conversations, appointments, tasks, content, websites, and reports.",
      },
    ],
  }),
  component: ClientCommandCenter,
});

type IconType = typeof Inbox;

const conversations = [
  { name: "Sofia at Northside Health", channel: "SMS", preview: "Can we move tomorrow's consultation to 2:30?", time: "8m", initials: "SN", tone: "bg-cyan-300/15 text-cyan-100", unread: true },
  { name: "Marcus Johnson", channel: "Email", preview: "Re: website intake form — I added the new service area.", time: "32m", initials: "MJ", tone: "bg-violet-300/15 text-violet-100", unread: true },
  { name: "Renee Carter", channel: "Web chat", preview: "New lead from the benefits discovery landing page.", time: "1h", initials: "RC", tone: "bg-amber-300/15 text-amber-100", unread: false },
];

const appointments = [
  { time: "10:30 AM", title: "Benefits consultation", person: "Sofia Martinez", color: "border-cyan-300/35 bg-cyan-300/[0.07]" },
  { time: "1:00 PM", title: "Partner follow-up", person: "Marcus Johnson", color: "border-violet-300/35 bg-violet-300/[0.07]" },
  { time: "Thu · 9:00 AM", title: "Website review", person: "Manifestic team", color: "border-amber-300/35 bg-amber-300/[0.07]" },
];

const tasks = [
  { label: "Approve the August benefits post", due: "Due today", owner: "Manifestic", urgent: true },
  { label: "Review new landing page leads", due: "3 new", owner: "Calvenn", urgent: false },
  { label: "Send updated service-area copy", due: "Tomorrow", owner: "Calvenn", urgent: false },
];

const websites = [
  { name: "Calvenn Healthcare", detail: "Primary website", status: "Live", metric: "Healthy", accent: "from-cyan-300 to-blue-500" },
  { name: "Benefits Discovery", detail: "Lead capture page", status: "Live", metric: "12 leads", accent: "from-violet-300 to-fuchsia-500" },
  { name: "Partner Referral Hub", detail: "Campaign landing page", status: "Draft", metric: "Needs review", accent: "from-amber-300 to-orange-500" },
];

const reports = [
  { name: "Website intelligence snapshot", detail: "Traffic, conversion, and lead quality", updated: "Updated Aug 14", icon: Globe2 },
  { name: "Benefits campaign readout", detail: "Content and social performance", updated: "Updated Aug 12", icon: FileBarChart },
];

type LiveConversation = { id?: string; name: string; channel: string; preview: string; lastMessageDate?: string; initials: string; unread?: boolean; unreadCount?: number };
type LiveAppointment = { id?: string; title: string; person: string; startTime?: string; endTime?: string; status?: string };
type LiveTask = { id?: string; label: string; dueDate?: string; owner?: string; contactName?: string; completed?: boolean };
type LiveDashboardData = { conversations: LiveConversation[]; appointments: LiveAppointment[]; tasks: LiveTask[] };
type LiveState = { status: "idle" | "loading" | "ready" | "error"; data: LiveDashboardData; generatedAt?: string; message?: string; sources?: Record<string, string> };
type ClientConfig = { locationId: string; name: string; logoUrl: string };

const emptyLiveData: LiveDashboardData = { conversations: [], appointments: [], tasks: [] };

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
  return new Intl.DateTimeFormat(undefined, { weekday: "short", hour: "numeric", minute: "2-digit" }).format(date);
}

function formatDueDate(value?: string) {
  if (!value) return "No due date";
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(date);
}

function ClientCommandCenter() {
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(conversations[0].name);
  const [showAllMessages, setShowAllMessages] = useState(false);
  const [liveState, setLiveState] = useState<LiveState>({ status: "idle", data: emptyLiveData });
  const [client, setClient] = useState<ClientConfig>({ locationId: "", name: "Calvenn", logoUrl: "" });
  const ghl = (path: string) => client.locationId ? `https://app.manifestic.ai/v2/location/${encodeURIComponent(client.locationId)}${path}` : undefined;
  const refreshLiveData = async () => {
    if (!client.locationId) return;
    setLiveState((current) => ({ ...current, status: "loading", message: undefined }));
    try {
      const response = await fetch(`/api/dashboard-data?locationId=${encodeURIComponent(client.locationId)}`, { cache: "no-store" });
      const payload = await response.json() as { configured?: boolean; data?: LiveDashboardData; generatedAt?: string; message?: string; sources?: Record<string, string> };
      if (!response.ok || !payload.data) {
        throw new Error(payload.message ?? "HighLevel data is not connected yet.");
      }
      setLiveState({ status: "ready", data: payload.data, generatedAt: payload.generatedAt, sources: payload.sources });
    } catch (error) {
      setLiveState({ status: "error", data: emptyLiveData, message: error instanceof Error ? error.message : "Unable to load live HighLevel data." });
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setClient({
      locationId: params.get("locationId") || "",
      name: params.get("clientName") || "Calvenn",
      logoUrl: params.get("logoUrl") || "",
    });
  }, []);

  useEffect(() => {
    if (!client.locationId) return;
    void refreshLiveData();
    const interval = window.setInterval(() => void refreshLiveData(), 60_000);
    return () => window.clearInterval(interval);
  }, [client.locationId]);

  const clientDataRequested = Boolean(client.locationId);
  const isLive = Boolean(client.locationId && liveState.status === "ready");
  const visibleConversations = clientDataRequested ? liveState.data.conversations : conversations;
  const visibleAppointments = clientDataRequested ? liveState.data.appointments : appointments;
  const visibleTasks = clientDataRequested ? liveState.data.tasks : tasks;
  const unreadCount = clientDataRequested ? visibleConversations.reduce((total, item) => total + Math.max(1, item.unreadCount ?? 1), 0) : 2;
  const firstAppointment = visibleAppointments[0];

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#080b13] text-slate-100">
      <div className="pointer-events-none fixed inset-0 -z-0 bg-[radial-gradient(circle_at_78%_0%,rgba(99,102,241,0.18),transparent_30%),radial-gradient(circle_at_12%_28%,rgba(14,165,233,0.08),transparent_28%)]" />
      <div className="relative z-10 flex min-h-screen">
        <aside className="hidden w-[238px] shrink-0 border-r border-white/[0.07] bg-[#0b0f1a]/90 px-4 py-5 lg:flex lg:flex-col">
          <div className="flex items-center gap-3 px-3 pb-8">
            {client.logoUrl ? <img src={client.logoUrl} alt={`${client.name} logo`} className="h-9 w-9 rounded-xl object-contain" /> : <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300 via-blue-500 to-violet-500 text-sm font-black text-slate-950 shadow-[0_0_28px_rgba(59,130,246,0.35)]">M</div>}
            <div><p className="text-sm font-semibold tracking-wide text-white">{client.name}</p><p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Manifestic workspace</p></div>
          </div>
          <nav className="space-y-1 text-sm">
            <SideNavItem icon={LayoutDashboard} label="Dashboard" active />
            <SideNavItem icon={Inbox} label="Inbox" badge="2" href={ghl("/conversations/conversations")} />
            <SideNavItem icon={CalendarDays} label="Calendar" href={ghl("/calendars/view")} />
            <SideNavItem icon={UsersRound} label="Lead Serum" href={ghl("/opportunities/list")} />
            <SideNavItem icon={MessageCircle} label="Content" href={ghl("/marketing/social-planner")} />
            <SideNavItem icon={Globe2} label="Websites" href={ghl("/funnels-websites/funnels")} />
            <SideNavItem icon={BarChart3} label="Reports" href={ghl("/reporting/reports")} />
          </nav>
          <div className="mt-auto rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4"><div className="flex items-center gap-2 text-xs font-medium text-cyan-200"><Sparkles className="h-3.5 w-3.5" />Healthcare sales view</div><p className="mt-2 text-xs leading-relaxed text-slate-500">A focused workspace configured around the work Calvenn actually needs to do.</p></div>
        </aside>

        <section className="min-w-0 flex-1 px-4 py-5 sm:px-7 lg:px-10 lg:py-8">
          <header className="mx-auto max-w-[1380px]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3 lg:hidden">{client.logoUrl ? <img src={client.logoUrl} alt={`${client.name} logo`} className="h-9 w-9 rounded-xl object-contain" /> : <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300 via-blue-500 to-violet-500 text-sm font-black text-slate-950">M</div>}<span className="font-semibold">{client.name}</span></div>
              <div className="flex items-center gap-2 text-xs text-slate-500"><span className={`h-2 w-2 rounded-full ${isLive ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" : "bg-amber-300"}`} />{isLive ? "Live HighLevel data" : client.locationId ? "HighLevel connection needed" : "Demo workspace · Sample data"}</div>
              <div className="flex items-center gap-2"><button className="inline-flex items-center gap-2 rounded-lg border border-white/[0.09] bg-white/[0.035] px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/[0.08]" onClick={() => setCustomizeOpen((value) => !value)}><Settings2 className="h-3.5 w-3.5" />Customize <ChevronDown className={`h-3.5 w-3.5 transition ${customizeOpen ? "rotate-180" : ""}`} /></button>{client.locationId && <button aria-label="Refresh live data" className="inline-flex items-center gap-2 rounded-lg border border-white/[0.09] bg-white/[0.035] px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/[0.08] disabled:opacity-50" onClick={() => void refreshLiveData()} disabled={liveState.status === "loading"}><RefreshCw className={`h-3.5 w-3.5 ${liveState.status === "loading" ? "animate-spin" : ""}`} />Refresh</button>}<div className="flex h-9 w-9 items-center justify-center rounded-full border border-violet-300/30 bg-violet-400/15 text-xs font-semibold text-violet-100">CS</div></div>
            </div>

            <div className="mt-9 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Client Command Center</p><h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-5xl">Good morning, Calvenn.</h1><p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">Here is what needs your attention, what is coming up, and how your digital presence is performing.</p></div><div className="flex items-center gap-3 text-xs text-slate-500"><RefreshCw className="h-4 w-4 text-slate-400" />{liveState.generatedAt ? `Updated ${formatRelativeTime(liveState.generatedAt)} ago` : "Updated just now"}</div></div>
            {customizeOpen && <CustomizePanel onClose={() => setCustomizeOpen(false)} />}

            {liveState.status === "error" && <div className="mt-6 rounded-xl border border-amber-300/20 bg-amber-300/[0.05] px-4 py-3 text-xs text-amber-100">Live data is not available yet: {liveState.message}</div>}
            <section className="mt-8 grid gap-3 sm:grid-cols-3"><SummaryStat icon={CircleAlert} label="Unread messages" value={`${unreadCount}`} detail={isLive ? "Live from Unified Inbox" : "Sample preview"} tone="amber" /><SummaryStat icon={CalendarDays} label="Next appointment" value={firstAppointment ? formatAppointmentTime(firstAppointment.startTime) : "None scheduled"} detail={firstAppointment?.title ?? (isLive ? "Next 7 days" : "Sample preview")} tone="cyan" /><SummaryStat icon={MessageCircle} label="Open tasks" value={`${visibleTasks.length}`} detail={isLive ? "Pending in HighLevel" : "Sample preview"} tone="violet" /></section>

            <section className="mt-8 grid items-start gap-5 xl:grid-cols-[1.45fr_0.8fr]"><InboxPreview conversations={visibleConversations} live={isLive} unreadCount={unreadCount} selectedConversation={selectedConversation} onSelect={setSelectedConversation} onOpenFull={() => setShowAllMessages(true)} inboxHref={ghl("/conversations/conversations")} /><CalendarPreview appointments={visibleAppointments} live={isLive} calendarHref={ghl("/calendars/view")} /></section>

            <section className="mt-10"><SectionHeading eyebrow="Work queue" title="The next useful actions" detail="A short list beats a dense report when someone is trying to run the business." /><div className="mt-5 grid gap-5 xl:grid-cols-2"><TasksCard tasks={visibleTasks} live={isLive} /><OpportunitiesCard opportunitiesHref={ghl("/opportunities/list")} /></div></section>
            <section className="mt-10"><SectionHeading eyebrow="Content & social" title="Keep the marketing engine moving" detail="The live version can pull from Social Planner after each channel is connected." /><ContentCard plannerHref={ghl("/marketing/social-planner")} /></section>
            <section className="mt-10 pb-10"><SectionHeading eyebrow="Websites & intelligence" title="The assets Manifestic is building with you" detail="A single place to open your sites, review performance, and find the latest intelligence." /><div className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]"><WebsitesCard sitesHref={ghl("/funnels-websites/funnels")} /><ReportsCard reportsHref={ghl("/reporting/reports")} /></div></section>
            <div className="border-t border-white/[0.07] py-6 text-xs leading-relaxed text-slate-600">{isLive ? "Live read-only HighLevel data · This dashboard does not send messages or modify CRM records." : "Demo preview · Add the scoped HighLevel server credential to replace sample records with live data."}</div>
          </header>
        </section>
      </div>
      {showAllMessages && <MessagePreviewModal conversations={visibleConversations} live={isLive} onClose={() => setShowAllMessages(false)} inboxHref={ghl("/conversations/conversations")} />}
    </main>
  );
}

function SideNavItem({ icon: Icon, label, active, badge, href }: { icon: IconType; label: string; active?: boolean; badge?: string; href?: string }) { const className = `flex items-center gap-3 rounded-xl px-3 py-2.5 ${active ? "bg-cyan-300/10 text-cyan-100" : "text-slate-500 hover:bg-white/[0.04] hover:text-slate-200"}`; return href ? <a className={className} href={href} target="_top" rel="noreferrer"><Icon className="h-4 w-4" /><span className="flex-1">{label}</span>{badge && <span className="rounded-full bg-violet-400/15 px-1.5 py-0.5 text-[10px] text-violet-200">{badge}</span>}</a> : <div className={className}><Icon className="h-4 w-4" /><span className="flex-1">{label}</span>{badge && <span className="rounded-full bg-violet-400/15 px-1.5 py-0.5 text-[10px] text-violet-200">{badge}</span>}</div>; }

function SummaryStat({ icon: Icon, label, value, detail, tone }: { icon: IconType; label: string; value: string; detail: string; tone: "amber" | "cyan" | "violet" }) { const toneClass = { amber: "border-amber-300/20 bg-amber-300/[0.05] text-amber-200", cyan: "border-cyan-300/20 bg-cyan-300/[0.05] text-cyan-200", violet: "border-violet-300/20 bg-violet-300/[0.05] text-violet-200" }[tone]; return <div className={`rounded-2xl border p-4 ${toneClass}`}><div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em]"><Icon className="h-4 w-4" />{label}</div><div className="mt-3 flex items-end justify-between gap-3"><p className="text-xl font-semibold text-white">{value}</p><p className="text-right text-[11px] text-slate-500">{detail}</p></div></div>; }

function CardHeading({ icon: Icon, eyebrow, title, action, actionHref }: { icon: IconType; eyebrow: string; title: string; action?: string; actionHref?: string }) { return <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div className="flex gap-3"><div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-cyan-200"><Icon className="h-4 w-4" /></div><div><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">{eyebrow}</p><h3 className="mt-1 text-lg font-semibold text-white">{title}</h3></div></div>{action && (actionHref ? <a href={actionHref} target="_top" rel="noreferrer" className="inline-flex items-center gap-1 self-end text-xs font-medium text-cyan-300 transition hover:text-cyan-100 sm:self-auto">{action}<ChevronRight className="h-3.5 w-3.5" /></a> : <span className="inline-flex items-center gap-1 self-end text-xs font-medium text-slate-500 sm:self-auto">{action}</span>)}</div>; }

function InboxPreview({ conversations, live, unreadCount, selectedConversation, onSelect, onOpenFull, inboxHref }: { conversations: LiveConversation[]; live: boolean; unreadCount: number; selectedConversation: string; onSelect: (name: string) => void; onOpenFull: () => void; inboxHref?: string }) { return <section className="rounded-2xl border border-white/[0.09] bg-white/[0.04] p-5 shadow-[0_18px_60px_-30px_rgba(14,165,233,0.35)] sm:p-6"><CardHeading icon={Inbox} eyebrow="Unified inbox" title="Recent conversations" action="Open inbox" actionHref={inboxHref} /><div className="mt-5 flex flex-col items-start gap-3 rounded-xl border border-cyan-300/15 bg-cyan-300/[0.045] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-300/15 text-cyan-100"><Mail className="h-4 w-4" /></div><div><p className="text-sm font-medium text-white">{unreadCount} unread messages</p><p className="mt-0.5 text-xs text-slate-500">{live ? "Live across connected HighLevel channels" : "Across SMS, email, and web chat"}</p></div></div>{inboxHref ? <a href={inboxHref} target="_top" rel="noreferrer" className="w-full rounded-lg bg-cyan-300 px-3 py-2 text-center text-xs font-semibold text-slate-950 transition hover:bg-cyan-200 sm:w-auto">View inbox</a> : <button onClick={onOpenFull} className="w-full rounded-lg bg-cyan-300 px-3 py-2 text-xs font-semibold text-slate-950 transition hover:bg-cyan-200 sm:w-auto">View inbox</button>}</div><div className="mt-4 divide-y divide-white/[0.06]">{conversations.length ? conversations.map((conversation, index) => { const sample = conversation as LiveConversation & Partial<(typeof conversations)[number]>; const tone = ["bg-cyan-300/15 text-cyan-100", "bg-violet-300/15 text-violet-100", "bg-amber-300/15 text-amber-100"][index % 3]; const time = live ? formatRelativeTime(conversation.lastMessageDate) : ((sample as { time?: string }).time ?? "recently"); return <button key={conversation.id ?? conversation.name} onClick={() => onSelect(conversation.name)} className={`flex w-full items-start gap-3 py-4 text-left transition ${selectedConversation === conversation.name ? "rounded-xl bg-white/[0.045] px-3" : "hover:bg-white/[0.025]"}`}><div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${tone}`}>{conversation.initials}</div><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><p className="truncate text-sm font-medium text-slate-200">{conversation.name}</p>{conversation.unread && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />}</div><p className="mt-1 truncate text-xs text-slate-500">{conversation.preview}</p><div className="mt-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.12em] text-slate-600"><span>{conversation.channel}</span><span>·</span><span>{time}</span></div></div><MoreHorizontal className="mt-1 h-4 w-4 shrink-0 text-slate-600" /></button>; }) : <p className="py-8 text-center text-sm text-slate-500">{live ? "No unread conversations" : "No conversations yet"}</p>}</div><div className="mt-3 flex flex-col gap-2 border-t border-white/[0.06] pt-4 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs text-slate-600">{live ? "Read-only live preview" : "Message preview prototype"}</p>{inboxHref ? <a href={inboxHref} target="_top" rel="noreferrer" className="self-start text-xs font-medium text-slate-400 hover:text-white sm:self-auto">See all messages <ArrowUpRight className="ml-1 inline h-3 w-3" /></a> : <button onClick={onOpenFull} className="self-start text-xs font-medium text-slate-400 hover:text-white sm:self-auto">See all messages <ArrowUpRight className="ml-1 inline h-3 w-3" /></button>}</div></section>; }

function CalendarPreview({ appointments, live, calendarHref }: { appointments: LiveAppointment[]; live: boolean; calendarHref?: string }) { return <section className="rounded-2xl border border-white/[0.09] bg-white/[0.035] p-5 sm:p-6"><CardHeading icon={CalendarDays} eyebrow="Calendar" title="Coming up" action="View calendar" actionHref={calendarHref} /><div className="mt-5 space-y-3">{appointments.length ? appointments.map((appointment, index) => { const sample = appointment as LiveAppointment & Partial<(typeof appointments)[number]>; const time = live ? formatAppointmentTime(appointment.startTime) : ((sample as { time?: string }).time ?? "Time to confirm"); return <div key={appointment.id ?? `${appointment.title}-${index}`} className={`rounded-xl border p-4 ${["border-cyan-300/35 bg-cyan-300/[0.07]", "border-violet-300/35 bg-violet-300/[0.07]", "border-amber-300/35 bg-amber-300/[0.07]"][index % 3]}`}><div className="flex items-center justify-between gap-3"><p className="text-xs font-semibold text-slate-300">{time}</p><Clock3 className="h-3.5 w-3.5 text-slate-500" /></div><p className="mt-2 text-sm font-medium text-white">{appointment.title}</p><p className="mt-1 text-xs text-slate-500">{appointment.person}</p></div>; }) : <p className="py-8 text-center text-sm text-slate-500">{live ? "No upcoming appointments" : "No appointments yet"}</p>}</div>{calendarHref ? <a href={calendarHref} target="_top" rel="noreferrer" className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] py-3 text-xs font-medium text-slate-300 transition hover:bg-white/[0.07]">Open calendar <ArrowUpRight className="h-3.5 w-3.5" /></a> : <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] py-3 text-xs font-medium text-slate-300 transition hover:bg-white/[0.07]">Open calendar <ArrowUpRight className="h-3.5 w-3.5" /></button>}</section>; }

function TasksCard({ tasks: visibleTasks, live }: { tasks: LiveTask[]; live: boolean }) { return <section className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5 sm:p-6"><CardHeading icon={CheckCircle2} eyebrow="Tasks & approvals" title="Three things to move forward" action="View tasks" /><div className="mt-5 space-y-2">{visibleTasks.length ? visibleTasks.slice(0, 3).map((task, index) => { const sample = task as LiveTask & Partial<(typeof tasks)[number]>; const due = live ? formatDueDate(task.dueDate) : ((sample as { due?: string }).due ?? "No due date"); const owner = live ? (task.owner ?? "Unassigned") : ((sample as { owner?: string }).owner ?? "Unassigned"); const urgent = live ? !task.completed : Boolean((sample as { urgent?: boolean }).urgent); return <div key={task.id ?? `${task.label}-${index}`} className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-[#0b0f1a] px-4 py-3"><div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${urgent ? "border-amber-300/50 text-amber-200" : "border-white/20 text-slate-600"}`}><Check className="h-3 w-3" /></div><div className="min-w-0 flex-1"><p className="truncate text-sm text-slate-300">{task.label}</p><p className="mt-1 text-[11px] text-slate-600">{owner} · {due}</p></div>{urgent && <span className="rounded-full bg-amber-300/10 px-2 py-1 text-[10px] font-semibold text-amber-200">{live ? "Open" : "Now"}</span>}</div>; }) : <p className="py-8 text-center text-sm text-slate-500">{live ? "No open tasks" : "No tasks yet"}</p>}</div></section>; }

function OpportunitiesCard({ opportunitiesHref }: { opportunitiesHref?: string }) { const stages = [{ label: "New leads", value: "6", color: "bg-cyan-300" }, { label: "Contacted", value: "4", color: "bg-blue-400" }, { label: "Consultation booked", value: "3", color: "bg-violet-400" }, { label: "Follow-up needed", value: "2", color: "bg-amber-300" }]; return <section className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5 sm:p-6"><CardHeading icon={UsersRound} eyebrow="Lead Serum" title="Where conversations are moving" action="Open CRM" actionHref={opportunitiesHref} /><div className="mt-5 grid gap-2 sm:grid-cols-2">{stages.map((stage) => <div key={stage.label} className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-[#0b0f1a] px-4 py-3"><span className={`h-2.5 w-2.5 rounded-full ${stage.color}`} /><span className="flex-1 text-sm text-slate-300">{stage.label}</span><span className="text-sm font-semibold text-white">{stage.value}</span></div>)}</div><div className="mt-4 rounded-xl border border-violet-300/15 bg-violet-300/[0.05] px-4 py-3"><p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-violet-200">Suggested next move</p><p className="mt-1 text-xs leading-relaxed text-slate-400">Reply to the 2 follow-ups before adding more leads to the queue.</p></div></section>; }

function ContentCard({ plannerHref }: { plannerHref?: string }) { return <section className="mt-5 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5 sm:p-6"><div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]"><div><div className="flex items-center justify-between gap-4"><div><p className="text-sm font-semibold text-white">This week’s content</p><p className="mt-1 text-xs text-slate-500">Next 7 days · Social Planner</p></div>{plannerHref ? <a href={plannerHref} target="_top" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-medium text-cyan-300">Open planner <ArrowUpRight className="h-3.5 w-3.5" /></a> : <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">Open planner <ArrowUpRight className="h-3.5 w-3.5" /></span>}</div><div className="mt-5 grid gap-2 sm:grid-cols-3">{[{ day: "Mon 18", title: "Benefits myth vs. fact", status: "Published", tone: "text-emerald-300" }, { day: "Wed 20", title: "Meet Calvenn’s team", status: "Awaiting approval", tone: "text-amber-200" }, { day: "Fri 22", title: "Open enrollment checklist", status: "Scheduled", tone: "text-cyan-200" }].map((post) => <div key={post.day} className="rounded-xl border border-white/[0.06] bg-[#0b0f1a] p-4"><p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600">{post.day}</p><p className="mt-3 text-sm font-medium leading-snug text-slate-300">{post.title}</p><p className={`mt-4 text-[10px] font-semibold uppercase tracking-[0.12em] ${post.tone}`}>{post.status}</p></div>)}</div></div><div className="border-t border-white/[0.07] pt-5 xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0"><div className="flex items-center justify-between"><div><p className="text-sm font-semibold text-white">Social pulse</p><p className="mt-1 text-xs text-slate-500">Last 30 days · connected channels</p></div><BarChart3 className="h-5 w-5 text-violet-300" /></div><div className="mt-4 flex items-center gap-2"><span className="inline-flex items-center gap-1.5 rounded-full bg-pink-400/10 px-2.5 py-1 text-[10px] font-medium text-pink-200"><Instagram className="h-3 w-3" />Instagram</span><span className="inline-flex items-center gap-1.5 rounded-full bg-blue-400/10 px-2.5 py-1 text-[10px] font-medium text-blue-200"><Linkedin className="h-3 w-3" />LinkedIn</span></div><div className="mt-5 grid grid-cols-3 gap-3">{[{ label: "Posts", value: "12" }, { label: "Reach", value: "8.4k" }, { label: "Engage", value: "6.8%" }].map((stat) => <div key={stat.label}><p className="text-xl font-semibold text-white">{stat.value}</p><p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-slate-600">{stat.label}</p></div>)}</div></div></div></section>; }

function WebsitesCard({ sitesHref }: { sitesHref?: string }) { return <section className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5 sm:p-6"><div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Websites & landing pages</p><h3 className="mt-1 text-lg font-semibold text-white">Your digital front doors</h3></div><PanelTop className="h-5 w-5 text-indigo-300" /></div><div className="mt-5 space-y-2">{websites.map((site) => <a key={site.name} href={sitesHref} target="_top" rel="noreferrer" className="group flex w-full items-center gap-3 rounded-xl border border-white/[0.06] bg-[#0b0f1a] p-3 text-left transition hover:border-indigo-300/30 hover:bg-white/[0.05]"><div className={`h-10 w-1 rounded-full bg-gradient-to-b ${site.accent}`} /><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><p className="truncate text-sm font-medium text-slate-200">{site.name}</p><span className={`rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${site.status === "Live" ? "bg-emerald-400/10 text-emerald-300" : "bg-amber-400/10 text-amber-200"}`}>{site.status}</span></div><p className="mt-1 text-xs text-slate-600">{site.detail}</p></div><span className="text-right text-[11px] text-slate-500">{site.metric}</span><ArrowUpRight className="h-3.5 w-3.5 text-slate-600 transition group-hover:text-indigo-300" /></a>)}</div>{sitesHref ? <a href={sitesHref} target="_top" rel="noreferrer" className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-indigo-300">Open all sites <ArrowUpRight className="h-3.5 w-3.5" /></a> : <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-slate-500">Open all sites <ArrowUpRight className="h-3.5 w-3.5" /></span>}</section>; }

function ReportsCard({ reportsHref }: { reportsHref?: string }) { return <section className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5 sm:p-6"><div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Intelligence reports</p><h3 className="mt-1 text-lg font-semibold text-white">Know what is changing</h3></div><FileText className="h-5 w-5 text-emerald-300" /></div><div className="mt-5 space-y-3">{reports.map((report) => { const Icon = report.icon; return <a key={report.name} href={reportsHref} target="_top" rel="noreferrer" className="group flex w-full items-start gap-3 rounded-xl border border-white/[0.06] bg-[#0b0f1a] p-4 text-left transition hover:border-emerald-300/25 hover:bg-white/[0.05]"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-300/15 bg-emerald-300/[0.07] text-emerald-200"><Icon className="h-4 w-4" /></div><div className="min-w-0 flex-1"><p className="text-sm font-medium text-slate-200">{report.name}</p><p className="mt-1 text-xs leading-relaxed text-slate-500">{report.detail}</p><p className="mt-3 text-[10px] uppercase tracking-[0.12em] text-slate-600">{report.updated}</p></div><ArrowUpRight className="mt-1 h-3.5 w-3.5 shrink-0 text-slate-600 transition group-hover:text-emerald-300" /></a>; })}</div>{reportsHref ? <a href={reportsHref} target="_top" rel="noreferrer" className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-emerald-300">Browse reports <ArrowUpRight className="h-3.5 w-3.5" /></a> : <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-slate-500">Browse reports <ArrowUpRight className="h-3.5 w-3.5" /></span>}</section>; }

function SectionHeading({ eyebrow, title, detail }: { eyebrow: string; title: string; detail: string }) { return <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{eyebrow}</p><div className="mt-2 flex flex-col justify-between gap-2 md:flex-row md:items-end"><h2 className="text-xl font-semibold text-white">{title}</h2><p className="max-w-xl text-xs leading-relaxed text-slate-600 md:text-right">{detail}</p></div></div>; }

function CustomizePanel({ onClose }: { onClose: () => void }) { return <div className="mt-7 rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.045] p-5 shadow-2xl shadow-cyan-950/20"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold text-white">Configure this client view</p><p className="mt-1 text-xs text-slate-400">The production version can turn modules on or off after the client discovery call.</p></div><button aria-label="Close customization" className="text-slate-500 hover:text-white" onClick={onClose}><X className="h-4 w-4" /></button></div><div className="mt-4 flex flex-wrap gap-2">{["Inbox preview", "Calendar", "Tasks", "Content & social", "Websites", "Reports", "Brand guide"].map((label, index) => <span key={label} className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs ${index === 6 ? "border-white/[0.08] bg-white/[0.025] text-slate-500" : "border-cyan-300/25 bg-cyan-300/10 text-cyan-100"}`}><span className={`flex h-4 w-4 items-center justify-center rounded border ${index === 6 ? "border-white/20" : "border-cyan-300 bg-cyan-300 text-slate-950"}`}>{index !== 6 && <Check className="h-3 w-3" />}</span>{label}</span>)}</div></div>; }

function MessagePreviewModal({ conversations: visibleConversations, live, onClose, inboxHref }: { conversations: LiveConversation[]; live: boolean; onClose: () => void; inboxHref?: string }) { return <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm" onClick={onClose}><div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0b0f1a] p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">{live ? "Live inbox preview" : "Embedded inbox test"}</p><h2 className="mt-2 text-2xl font-semibold text-white">Actual message preview</h2><p className="mt-2 text-sm leading-relaxed text-slate-400">{live ? "Read-only messages from the connected HighLevel inbox." : "This is the visual behavior we would aim for: a client sees the latest messages here, then can open the full HighLevel conversation thread."}</p></div><button aria-label="Close message preview" onClick={onClose} className="rounded-lg p-2 text-slate-500 hover:bg-white/[0.06] hover:text-white"><X className="h-5 w-5" /></button></div><div className="mt-6 space-y-3">{visibleConversations.map((conversation, index) => <div key={conversation.id ?? conversation.name} className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4"><div className="flex items-start gap-3"><div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${["bg-cyan-300/15 text-cyan-100", "bg-violet-300/15 text-violet-100", "bg-amber-300/15 text-amber-100"][index % 3]}`}>{conversation.initials}</div><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-3"><p className="text-sm font-medium text-white">{conversation.name}</p><span className="text-[11px] text-slate-600">{live ? formatRelativeTime(conversation.lastMessageDate) : ((conversation as { time?: string }).time ?? "recently")} ago</span></div><p className="mt-2 text-sm leading-relaxed text-slate-300">{conversation.preview}</p><p className="mt-3 text-[10px] uppercase tracking-[0.12em] text-slate-600">{conversation.channel} · {live ? "live message" : "sample message"}</p></div></div></div>)}</div><div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button onClick={onClose} className="rounded-xl border border-white/[0.1] px-4 py-3 text-sm font-medium text-slate-300 hover:bg-white/[0.06]">Close preview</button>{inboxHref ? <a href={inboxHref} target="_top" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-200">Open full inbox in HighLevel <ArrowUpRight className="h-4 w-4" /></a> : <button onClick={onClose} className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-200">Open full inbox in HighLevel <ArrowUpRight className="h-4 w-4" /></button>}</div></div></div>; }
