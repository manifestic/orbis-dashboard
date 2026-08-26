import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  Clock3,
  Instagram,
  MessageCircle,
  RefreshCw,
  Sparkles,
  Smartphone,
  ClipboardCheck,
  Mail,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { MOBILE_APP_LINKS } from "../lib/mobile-app-links";

export const Route = createFileRoute("/setup-tile")({
  head: () => ({
    meta: [
      { title: "Setup Center — Your Best Health Quote" },
      {
        name: "description",
        content: "Focused HighLevel setup actions and live next moves.",
      },
    ],
  }),
  component: SetupTile,
});

type Conversation = {
  id: string;
  name: string;
  channel: string;
  preview: string;
  lastMessageDate?: string;
  unread?: boolean;
  unreadCount?: number;
};

type Task = {
  id: string;
  label: string;
  dueDate?: string;
  owner?: string;
  contactName?: string;
  completed?: boolean;
};

type Appointment = {
  id: string;
  title: string;
  person: string;
  startTime?: string;
  status?: string;
};

type LiveData = {
  conversations: Conversation[];
  tasks: Task[];
  appointments: Appointment[];
};

type LiveResponse = {
  data?: LiveData;
  generatedAt?: string;
  sources?: { status?: "live" | "partial" | "unavailable" };
};

type TenantProfile = {
  locationId: string;
  clientName: string;
  websiteUrl?: string;
  logoUrl?: string;
  primaryColor?: string;
  accentColor?: string;
  inkColor?: string;
  mutedColor?: string;
  onboardingStatus?: "pending" | "brand_review" | "ready";
};

const HIGHLEVEL_PARENT_ORIGINS = new Set([
  "https://app.gohighlevel.com",
  "https://app.leadconnectorhq.com",
  "https://app.msgsndr.com",
  "https://app.manifestic.ai",
]);

function ghlUrl(locationId: string, path: string) {
  return `https://app.gohighlevel.com/v2/location/${encodeURIComponent(locationId)}${path}`;
}

function requestHighLevelSignedContext(timeoutMs = 2500) {
  if (typeof window === "undefined" || window.parent === window)
    return Promise.resolve<string | null>(null);
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
      if (data?.message === "REQUEST_USER_DATA_RESPONSE")
        finish(typeof data.payload === "string" ? data.payload : null);
    };
    const sendRequest = () => window.parent.postMessage({ message: "REQUEST_USER_DATA" }, "*");
    window.addEventListener("message", handleMessage);
    // HighLevel may still be restoring the dashboard after a browser restart.
    // Retry briefly while it initializes, but never hold the tile behind a
    // long authentication timeout.
    sendRequest();
    retry = window.setInterval(sendRequest, 500);
    timeout = window.setTimeout(() => finish(null), timeoutMs);
  });
}

function formatTime(value?: string) {
  if (!value) return "Time to confirm";
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, { weekday: "short", hour: "numeric", minute: "2-digit" }).format(date);
}

function formatUpdated(value?: string) {
  if (!value) return "Waiting for live data";
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "Updated just now";
  return `Updated ${new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(date)}`;
}

function SetupTile() {
  const [locationId, setLocationId] = useState("");
  const [embedToken, setEmbedToken] = useState("");
  const [mode, setMode] = useState<"combined" | "setup" | "actions">("combined");
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [live, setLive] = useState<LiveResponse>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState<TenantProfile | null>(null);
  const [brandUrl, setBrandUrl] = useState("");
  const [discovery, setDiscovery] = useState<{ logoUrl?: string; primaryColor?: string; title?: string } | null>(null);
  const [brandMessage, setBrandMessage] = useState("");
  const [brandSaving, setBrandSaving] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const previousHtmlBackground = html.style.backgroundColor;
    const previousBodyBackground = body.style.backgroundColor;
    html.style.backgroundColor = "#edf5f7";
    body.style.backgroundColor = "#edf5f7";
    return () => {
      html.style.backgroundColor = previousHtmlBackground;
      body.style.backgroundColor = previousBodyBackground;
    };
  }, []);

  const loadLiveData = async (requestedLocationId: string, tokenOverride = embedToken) => {
    if (!requestedLocationId) return;
    try {
      const response = await fetch(
        `/api/dashboard-data?locationId=${encodeURIComponent(requestedLocationId)}${tokenOverride ? `&embedToken=${encodeURIComponent(tokenOverride)}` : ""}`,
        { cache: "no-store" },
      );
      const payload = (await response.json()) as LiveResponse & { message?: string };
      if (!response.ok || !payload.data) throw new Error(payload.message ?? "Live data is unavailable.");
      setLive(payload);
      setError("");
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Live data is unavailable.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedLocationId = params.get("locationId")?.trim() ?? "";
    const requestedEmbedToken = params.get("embedToken")?.trim() ?? "";
    const requestedMode = params.get("mode");
    if (requestedMode === "setup" || requestedMode === "actions") setMode(requestedMode);
    setLocationId(requestedLocationId);
    setEmbedToken(requestedEmbedToken);
    void (async () => {
      try {
        const encryptedContext = await requestHighLevelSignedContext();
        let response: Response;
        if (encryptedContext) {
          response = await fetch("/api/auth", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ action: "highlevel_context", encryptedData: encryptedContext }),
            cache: "no-store",
          });
        } else {
          response = await fetch(requestedEmbedToken ? `/api/auth?embedToken=${encodeURIComponent(requestedEmbedToken)}` : "/api/auth", { cache: "no-store" });
        }
        const payload = (await response.json()) as { authenticated?: boolean; user?: { locationId?: string } };
        if (requestedLocationId && payload.user?.locationId && payload.user.locationId !== requestedLocationId) {
          setAuthenticated(false);
          setLoading(false);
          return;
        }
        const resolvedLocationId = requestedLocationId || payload.user?.locationId || "";
        setLocationId(resolvedLocationId);
        setAuthenticated(Boolean(response.ok && payload.authenticated));
        if (response.ok && payload.authenticated && resolvedLocationId) {
          const profileResponse = await fetch("/api/tenant", { cache: "no-store" });
          if (profileResponse.ok) {
            const profilePayload = (await profileResponse.json()) as { profile?: TenantProfile };
            if (profilePayload.profile) {
              setProfile(profilePayload.profile);
              setBrandUrl(profilePayload.profile.websiteUrl ?? "");
            }
          }
          await loadLiveData(resolvedLocationId, requestedEmbedToken);
        }
        else setLoading(false);
      } catch {
        setAuthenticated(false);
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!locationId || !authenticated) return;
    const interval = window.setInterval(() => void loadLiveData(locationId), 60_000);
    return () => window.clearInterval(interval);
  }, [locationId, authenticated, embedToken]);

  const moves = useMemo(() => {
    const data = live.data;
    if (!data) return [];
    const next = [] as Array<{ icon: typeof Mail; label: string; detail: string; href: string; target: string; tone: string }>;
    const unread = data.conversations.filter((item) => item.unread || (item.unreadCount ?? 0) > 0);
    unread.slice(0, 2).forEach((conversation) => {
      next.push({
        icon: MessageCircle,
        label: `Reply to ${conversation.name}`,
        detail: `${conversation.channel} · ${conversation.preview.slice(0, 78)}`,
        href: ghlUrl(locationId, "/conversations"),
        target: "_top",
        tone: "bg-[#e9f7f4] text-[#087b68]",
      });
    });
    data.tasks.filter((task) => !task.completed).slice(0, 2).forEach((task) => {
      next.push({
        icon: ClipboardCheck,
        label: task.label,
        detail: task.contactName ? `${task.contactName} · ${task.owner || "Unassigned"}` : task.owner || "Open task",
        href: ghlUrl(locationId, "/tasks"),
        target: "_top",
        tone: "bg-[#eef3ff] text-[#3568c8]",
      });
    });
    if (next.length < 3 && data.appointments[0]) {
      const appointment = data.appointments[0];
      next.push({
        icon: CalendarDays,
        label: `Prepare for ${appointment.person}`,
        detail: `${appointment.title} · ${formatTime(appointment.startTime)}`,
        href: ghlUrl(locationId, "/calendars/view"),
        target: "_top",
        tone: "bg-[#fff4e5] text-[#a45b00]",
      });
    }
    return next.slice(0, 3);
  }, [live.data, locationId]);

  const connectionButtons = [
    { label: "Connect calendar", detail: "Google or Outlook", icon: CalendarDays, href: ghlUrl(locationId, "/settings/calendars/connections-new"), target: "_top" },
    { label: "Connect socials", detail: "Publishing channels", icon: Instagram, href: ghlUrl(locationId, "/marketing/social-planner"), target: "_top" },
    { label: "Connect social messages", detail: "DM integrations", icon: MessageCircle, href: ghlUrl(locationId, "/settings/lc-integrations"), target: "_top" },
  ];

  const mobileButtons = MOBILE_APP_LINKS.map((link) => ({ ...link, icon: Smartphone, target: "_blank" as const }));

  const discoverBrand = async () => {
    setBrandMessage("");
    setDiscovery(null);
    try {
      const response = await fetch("/api/tenant", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "discover_brand", websiteUrl: brandUrl }),
      });
      const payload = (await response.json()) as { discovery?: typeof discovery; message?: string };
      if (!response.ok || !payload.discovery) throw new Error(payload.message ?? "Brand discovery failed.");
      setDiscovery(payload.discovery);
      setBrandMessage("Review the suggested logo and color before saving.");
    } catch (brandError) {
      setBrandMessage(brandError instanceof Error ? brandError.message : "Brand discovery failed.");
    }
  };

  const saveBrand = async (ready = false) => {
    if (!profile) return;
    setBrandSaving(true);
    setBrandMessage("");
    try {
      const response = await fetch("/api/tenant", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...profile,
          websiteUrl: brandUrl || profile.websiteUrl,
          logoUrl: discovery?.logoUrl || profile.logoUrl,
          primaryColor: discovery?.primaryColor || profile.primaryColor,
          onboardingStatus: ready ? "ready" : "brand_review",
        }),
      });
      const payload = (await response.json()) as { profile?: TenantProfile; message?: string };
      if (!response.ok || !payload.profile) throw new Error(payload.message ?? "Brand profile could not be saved.");
      setProfile(payload.profile);
      setBrandMessage(ready ? "Brand approved and saved." : "Brand draft saved for review.");
    } catch (saveError) {
      setBrandMessage(saveError instanceof Error ? saveError.message : "Brand profile could not be saved.");
    } finally {
      setBrandSaving(false);
    }
  };

  return (
    <main className="min-h-[260px] bg-[radial-gradient(circle_at_top_right,_#e7f7fb,_transparent_52%),linear-gradient(135deg,#f5fbfd,#edf5f7)] p-4 font-sans text-[#102336] sm:p-5">
      {(mode === "combined" || mode === "setup") && profile && <section className="mb-4 rounded-[24px] border border-[#afd7e3] bg-white/90 p-5 shadow-[0_22px_55px_-34px_rgba(16,35,54,0.55)]">
        <div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1377b8]">Brand setup</p><h1 className="mt-2 text-xl font-semibold tracking-tight">Make this workspace theirs.</h1><p className="mt-1 text-xs leading-relaxed text-[#466174]">Start with the client’s website, review the suggested logo and color, then approve the profile.</p></div><span className="rounded-full bg-[#eaf7f3] px-3 py-1 text-[10px] font-semibold text-[#087b68]">{profile.onboardingStatus ?? "pending"}</span></div>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row"><input aria-label="Client website" value={brandUrl} onChange={(event) => setBrandUrl(event.target.value)} placeholder="https://clientwebsite.com" className="min-w-0 flex-1 rounded-xl border border-[#b9d7e2] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#1377b8]" /><button type="button" onClick={() => void discoverBrand()} className="rounded-xl bg-[#1377b8] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#0f659c]">Scan website</button></div>
        {discovery && <div className="mt-3 flex flex-wrap items-center gap-3 rounded-2xl border border-[#c8e1e8] bg-[#f7fcfe] p-3"><div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-white text-lg font-black text-[#1377b8]">{discovery.logoUrl ? <img src={discovery.logoUrl} alt="Suggested logo" className="h-full w-full object-contain" /> : "M"}</div><div className="min-w-0 flex-1"><p className="text-xs font-semibold">{discovery.title || "Brand suggestion found"}</p><p className="mt-0.5 text-[10px] text-[#466174]">{discovery.logoUrl ? "Logo found from the site." : "No logo image was found; upload fallback is still needed."}{discovery.primaryColor ? ` Suggested color: ${discovery.primaryColor}` : ""}</p></div><button type="button" disabled={brandSaving} onClick={() => void saveBrand(false)} className="rounded-xl border border-[#1377b8] px-3 py-2 text-[10px] font-semibold text-[#1377b8]">Save draft</button><button type="button" disabled={brandSaving} onClick={() => void saveBrand(true)} className="rounded-xl bg-[#0e9a85] px-3 py-2 text-[10px] font-semibold text-white">Approve brand</button></div>}
        {brandMessage && <p className="mt-3 text-xs text-[#466174]">{brandMessage}</p>}
      </section>}
      <div className={mode === "combined" ? "grid gap-4 lg:grid-cols-[0.92fr_1.08fr]" : ""}>
        {(mode === "combined" || mode === "setup") && <section className="rounded-[24px] border border-[#afd7e3] bg-gradient-to-br from-[#ffffff] via-[#f7fcfe] to-[#e5f5f2] p-5 shadow-[0_22px_55px_-34px_rgba(16,35,54,0.55)]">
          <div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1377b8]">Setup center</p><h1 className="mt-2 text-xl font-semibold tracking-tight">Connect the essentials.</h1></div><CheckCircle2 className="h-5 w-5 text-[#0e9a85]" /></div>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {connectionButtons.map(({ label, detail, icon: Icon, href, target }) => <a key={label} href={href} target={target} rel={target === "_blank" ? "noreferrer" : undefined} className="group rounded-2xl border border-[#b9d7e2] bg-white/80 p-3 transition hover:-translate-y-0.5 hover:border-[#1377b8] hover:bg-white"><span className="flex items-center gap-2"><span className="rounded-xl bg-[#e8f4fb] p-2 text-[#1377b8]"><Icon className="h-4 w-4" /></span><span className="min-w-0"><span className="block text-xs font-semibold">{label}</span><span className="mt-0.5 block truncate text-[10px] text-[#466174]">{detail}</span></span><ArrowUpRight className="ml-auto h-3.5 w-3.5 shrink-0 text-[#8aa7b5] transition group-hover:text-[#1377b8]" /></span></a>)}
          </div>
          <div className="mt-5 border-t border-[#c8e1e8] pt-4">
            <p className="text-sm font-semibold tracking-tight">Download the mobile app to run your business on the go.</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {mobileButtons.map(({ label, detail, icon: Icon, href, target }) => <a key={label} href={href} target={target} rel={target === "_blank" ? "noreferrer" : undefined} className="group rounded-2xl border border-[#b9d7e2] bg-white/80 p-3 transition hover:-translate-y-0.5 hover:border-[#1377b8] hover:bg-white"><span className="flex items-center gap-2"><span className="rounded-xl bg-[#e8f4fb] p-2 text-[#1377b8]"><Icon className="h-4 w-4" /></span><span className="min-w-0"><span className="block text-xs font-semibold">{label}</span><span className="mt-0.5 block truncate text-[10px] text-[#466174]">{detail}</span></span><ArrowUpRight className="ml-auto h-3.5 w-3.5 shrink-0 text-[#8aa7b5] transition group-hover:text-[#1377b8]" /></span></a>)}
            </div>
          </div>
        </section>}

        {(mode === "combined" || mode === "actions") && <section className="rounded-[24px] border border-[#b9dce9] bg-gradient-to-br from-[#f9fdff] via-[#eef8fb] to-[#eaf7f3] p-5 shadow-[0_22px_55px_-34px_rgba(14,122,150,0.45)]">
          <div className="flex items-start justify-between gap-3"><div><p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#087b68]"><Sparkles className="h-3.5 w-3.5" /> AI next moves</p><h2 className="mt-2 text-xl font-semibold tracking-tight">What needs attention next?</h2></div><button type="button" onClick={() => locationId && void loadLiveData(locationId)} className="rounded-xl border border-[#b9dce9] bg-white/70 p-2 text-[#1377b8] hover:bg-white" aria-label="Refresh live next moves"><RefreshCw className="h-4 w-4" /></button></div>
          <p className="mt-2 text-xs leading-relaxed text-[#466174]">Live review suggestions from unread conversations, open tasks, and upcoming appointments. Nothing is sent automatically.</p>
          <div className="mt-4 space-y-2">
            {loading ? <div className="rounded-2xl border border-[#c8e1e8] bg-white/70 p-4 text-xs text-[#466174]">Reading the current workspace…</div> : error ? <div className="flex gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900"><CircleAlert className="h-4 w-4 shrink-0" />{error}</div> : authenticated === false ? <div className="rounded-2xl border border-dashed border-[#afd7e3] bg-white/55 p-4"><p className="text-xs font-semibold">Live next moves are waiting for the workspace connection.</p><p className="mt-1 text-[11px] text-[#466174]">The setup buttons are ready. Current conversations, tasks, and appointments will appear here once the signed HighLevel session is available.</p></div> : moves.length ? moves.map(({ icon: Icon, label, detail, href, target, tone }) => <a key={`${label}-${detail}`} href={href} target={target} className="group flex items-center gap-3 rounded-2xl border border-[#c8e1e8] bg-white/75 p-3 transition hover:-translate-y-0.5 hover:bg-white"><span className={`rounded-xl p-2 ${tone}`}><Icon className="h-4 w-4" /></span><span className="min-w-0 flex-1"><span className="block truncate text-xs font-semibold">{label}</span><span className="mt-0.5 block truncate text-[10px] text-[#466174]">{detail}</span></span><ArrowUpRight className="h-3.5 w-3.5 text-[#8aa7b5] group-hover:text-[#1377b8]" /></a>) : <div className="rounded-2xl border border-dashed border-[#afd7e3] bg-white/55 p-4"><p className="text-xs font-semibold">No immediate move is waiting.</p><p className="mt-1 text-[11px] text-[#466174]">This list will change as new conversations, tasks, and appointments enter HighLevel.</p></div>}
          </div>
          <div className="mt-4 flex items-center justify-between gap-3 text-[10px] text-[#466174]"><span className="flex items-center gap-1.5"><span className={`h-2 w-2 rounded-full ${live.sources?.status === "live" ? "bg-[#0e9a85]" : "bg-[#d18b2d]"}`} />{live.sources?.status === "partial" ? "Live data partially connected" : live.sources?.status === "live" ? "Live HighLevel data" : "Waiting for live data"}</span><span>{formatUpdated(live.generatedAt)}</span></div>
        </section>}
      </div>
    </main>
  );
}
