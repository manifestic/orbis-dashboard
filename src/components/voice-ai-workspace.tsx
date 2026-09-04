import { ArrowUpRight, Check, CircleAlert, Mic2, Play, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";

const VOICES = [
  ["Aoede", "Warm and balanced"],
  ["Kore", "Bright and clear"],
  ["Leda", "Soft and calm"],
  ["Zephyr", "Light and breezy"],
  ["Puck", "Playful and energetic"],
  ["Charon", "Deep and steady"],
  ["Orus", "Confident and firm"],
  ["Fenrir", "Bold and resonant"],
] as const;
const FEELINGS = ["Warm", "Professional", "Clear", "Encouraging", "Empathetic", "Energetic"] as const;

type VoiceAiWorkspaceProps = {
  clientName: string;
  locationId: string;
  agentId?: string;
  demoMode: boolean;
  highLevelVoiceHref?: string;
  tenantFacts?: readonly string[];
};

export function VoiceAiWorkspace({ clientName, locationId, agentId, highLevelVoiceHref, tenantFacts = [] }: VoiceAiWorkspaceProps) {
  const [voice, setVoice] = useState("Aoede");
  const [feelings, setFeelings] = useState<string[]>(["Warm", "Clear", "Encouraging"]);
  const [soul, setSoul] = useState(`A helpful, grounded guide for ${clientName}. Speak plainly, listen first, and make the next step easy without overpromising.`);
  const [activeTab, setActiveTab] = useState<"voice" | "soul" | "connection">("voice");
  const [playing, setPlaying] = useState("");

  const toggleFeeling = (item: string) => setFeelings((current) => current.includes(item) ? current.filter((value) => value !== item) : [...current, item].slice(0, 6));
  const preview = (voiceId: string) => {
    setPlaying(voiceId);
    const audio = new Audio(`https://orb.manifestic.ai/api/voice-sample?voice=${encodeURIComponent(voiceId)}`);
    audio.onended = () => setPlaying("");
    audio.onerror = () => setPlaying("");
    void audio.play().catch(() => setPlaying(""));
  };

  return (
    <section className="overflow-hidden rounded-3xl border border-[#d5e2f0] bg-white shadow-[0_24px_70px_-40px_rgba(0,102,204,0.5)]">
      <header className="border-b border-[#d5e2f0] bg-[radial-gradient(circle_at_85%_0%,rgba(0,102,204,0.12),transparent_40%),linear-gradient(135deg,#ffffff,#f2f8fc)] p-5 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8f1fb] text-[#0066cc]"><Mic2 className="h-6 w-6" /></span>
            <div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#0066cc]">Voice AI · tenant-scoped draft</p><h3 className="mt-1 text-2xl font-semibold text-[#2d3748]">Voice AI</h3><p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#4a5568]">Configure the voice, feeling, and soul of {clientName}’s assistant. These choices are a review draft until the verified HighLevel connection is approved.</p></div>
          </div>
          <span className="rounded-full border border-amber-300/50 bg-[#fff4e6] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.13em] text-[#8a5200]">Production changes locked</span>
        </div>
        <nav aria-label="Voice AI workspace sections" className="mt-6 flex flex-wrap gap-2">
          {[ ["voice", "Voice & Feeling"], ["soul", "Soul & Greeting"], ["connection", "Connection & Safety"] ].map(([id, label]) => <button key={id} type="button" onClick={() => setActiveTab(id as typeof activeTab)} className={`rounded-xl border px-3 py-2 text-xs font-semibold ${activeTab === id ? "border-[#0066cc] bg-[#e8f1fb] text-[#0066cc]" : "border-[#d5e2f0] bg-white text-[#4a5568]"}`}>{label}</button>)}
        </nav>
      </header>
      <div className="p-5 sm:p-7">
        {activeTab === "voice" && <div className="space-y-6">
          <div><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#0066cc]">Voice picker</p><h4 className="mt-1 text-xl font-semibold text-[#2d3748]">Choose and preview a voice</h4></div><span className="text-xs text-[#4a5568]">Local review draft</span></div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{VOICES.map(([id, detail]) => <article key={id} className={`rounded-2xl border p-4 ${voice === id ? "border-[#0066cc] bg-[#e8f1fb]" : "border-[#d5e2f0] bg-[#f7fafc]"}`}><button type="button" className="w-full text-left" onClick={() => setVoice(id)} aria-pressed={voice === id}><span className="flex items-center justify-between gap-2"><strong className="text-[#2d3748]">{id}</strong>{voice === id && <Check className="h-4 w-4 text-[#0066cc]" />}</span><span className="mt-1 block text-xs text-[#4a5568]">{detail}</span></button><button type="button" onClick={() => preview(id)} className="mt-3 inline-flex items-center gap-2 rounded-lg border border-[#d5e2f0] bg-white px-2.5 py-1.5 text-[11px] font-semibold text-[#2d3748]">{playing === id ? "Playing…" : <><Play className="h-3.5 w-3.5" /> Listen</>}</button></article>)}</div>
          </div>
          <div className="rounded-2xl border border-[#d5e2f0] bg-[#f7fafc] p-5"><h4 className="font-semibold text-[#2d3748]">Feeling / delivery</h4><p className="mt-1 text-xs text-[#4a5568]">Pick the qualities the assistant should carry into each conversation.</p><div className="mt-4 flex flex-wrap gap-2">{FEELINGS.map((item) => <button key={item} type="button" aria-pressed={feelings.includes(item)} onClick={() => toggleFeeling(item)} className={`rounded-full border px-3 py-2 text-xs font-semibold ${feelings.includes(item) ? "border-[#0066cc] bg-[#e8f1fb] text-[#0066cc]" : "border-[#d5e2f0] bg-white text-[#4a5568]"}`}>{item}</button>)}</div></div>
        </div>}
        {activeTab === "soul" && <div className="grid gap-5 lg:grid-cols-2"><label className="rounded-2xl border border-[#d5e2f0] bg-[#f7fafc] p-5 text-sm font-semibold text-[#2d3748]">Soul / identity draft<textarea rows={7} value={soul} onChange={(event) => setSoul(event.target.value)} className="mt-3 w-full rounded-xl border border-[#a8c0cc] bg-white px-3 py-3 text-sm font-normal text-[#2d3748] outline-none focus:border-[#0066cc]" /><span className="mt-2 block text-[11px] font-normal text-[#4a5568]">Draft only · not saved to HighLevel or the voice provider.</span></label><div className="rounded-2xl border border-[#d5e2f0] bg-[#f7fafc] p-5"><h4 className="font-semibold text-[#2d3748]">Tenant knowledge boundary</h4><div className="mt-4 space-y-2">{tenantFacts.length ? tenantFacts.map((fact) => <p key={fact} className="rounded-xl border border-[#d5e2f0] bg-white p-3 text-xs leading-relaxed text-[#4a5568]">{fact}</p>) : <p className="text-xs text-[#4a5568]">No verified tenant facts are loaded.</p>}</div><p className="mt-4 text-xs leading-relaxed text-[#4a5568]">Voice memory and production training stay disabled until the tenant authorization and approval checks pass.</p></div></div>}
        {activeTab === "connection" && <div className="space-y-5"><div className="grid gap-3 lg:grid-cols-2"><Status title="Voice picker and browser previews" status="Available" good /><Status title="Tenant mapping" status={agentId ? "Mapped · gated" : "Needs setup"} /><Status title="HighLevel Voice AI" status="Open for configuration" /></div><div className="rounded-2xl border border-amber-300/60 bg-[#fff4e6] p-5"><div className="flex gap-3"><CircleAlert className="h-5 w-5 shrink-0 text-[#8a5200]" /><div><p className="font-semibold text-[#2d3748]">Production activation is still locked</p><p className="mt-1 text-xs leading-relaxed text-[#4a5568]">The picker and soul controls are now visible for review. A server-only tenant bridge, consent, knowledge audit, and controlled no-outbound test are required before activation.</p></div></div><div className="mt-4 flex flex-wrap gap-2">{highLevelVoiceHref && <a href={highLevelVoiceHref} target="_top" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-[#0066cc] px-3 py-2 text-xs font-semibold text-white">Open HighLevel Voice AI <ArrowUpRight className="h-3.5 w-3.5" /></a>}<span className="inline-flex items-center gap-2 rounded-xl border border-[#d5e2f0] bg-white px-3 py-2 text-xs font-semibold text-[#4a5568]"><ShieldCheck className="h-3.5 w-3.5 text-[#0066cc]" /> No outbound activity</span></div></div></div>}
      </div>
      <footer className="flex items-center gap-2 border-t border-[#d5e2f0] bg-[#f7fafc] px-5 py-4 text-[11px] text-[#4a5568]"><Sparkles className="h-4 w-4 text-[#0066cc]" /> Location: {locationId} · review changes here before any production write.</footer>
    </section>
  );
}

function Status({ title, status, good = false }: { title: string; status: string; good?: boolean }) {
  return <article className="rounded-2xl border border-[#d5e2f0] bg-[#f7fafc] p-5"><div className="flex items-start justify-between gap-3"><h5 className="font-semibold text-[#2d3748]">{title}</h5><span className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] ${good ? "bg-[#e9f7f1] text-[#087b68]" : "bg-[#fff4e6] text-[#8a5200]"}`}>{status}</span></div><p className="mt-3 text-xs leading-relaxed text-[#4a5568]">Tenant-scoped and review-only until the required connection checks pass.</p></article>;
}
