import { Check, ChevronRight, Building2, Users, BarChart, Layers } from "lucide-react";

const points = [
  { icon: Building2, title: "Your Brand. Their Tools.", desc: "Every member gets full access to Orbis under your agency's brand and domain." },
  { icon: Layers, title: "Unlimited Booking Links for Every Rep", desc: "Each rep gets their own calendar, AI assistant, and inbox — connected to your master account." },
  { icon: Users, title: "Onboard 100 Reps in a Day", desc: "Bulk invites, role permissions, and one-click templates get your whole network live by tomorrow." },
  { icon: BarChart, title: "See Your Whole Network's Performance", desc: "Real-time dashboards on every rep, every campaign, every dollar — in one rolled-up view." },
];

export function NetworkSection() {
  return (
    <section id="network" className="relative overflow-hidden bg-background py-32">
      <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-brand/10 blur-[140px]" />
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-glow">Built for Networks</p>
            <h2 className="mt-4 text-4xl font-semibold leading-[1.1] md:text-5xl">
              Scale your entire <span className="text-gradient">network from one place.</span>
            </h2>
            <p className="mt-5 max-w-lg text-ink-muted">
              Orbis is designed for network marketing leaders. Bring your whole team onto one platform — each rep gets their own booking link, inbox, and pipeline, all under your control.
            </p>

            <ul className="mt-10 space-y-5">
              {points.map((p) => (
                <li key={p.title} className="flex gap-4">
                  <div className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand/15 text-brand-glow">
                    <p.icon className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{p.title}</h4>
                    <p className="mt-1 text-sm text-ink-muted">{p.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Mock dashboard */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-brand/20 opacity-30 blur-2xl" />
            <div className="relative rounded-2xl glass-strong p-6 shadow-card-deep">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-glow">How it's structured</p>
              <div className="mt-5 space-y-3">
                <NodeRow title="Orbis / Your Agency" sub="Master admin · billing · rolled-up reporting" badge="ROOT" highlight />
                <div className="ml-6 space-y-2">
                  <NodeRow title="Johnny's Network" sub="Top-level leader · 1,240 reps" badge="LEADER" />
                  <NodeRow title="Sarah's Team" sub="Sub-leader · 84 reps · $42k MRR" badge="TEAM" />
                </div>
                <p className="pt-2 text-xs uppercase tracking-wider text-ink-muted">Per-rep access levels</p>
                <NodeRow title="Rep: Login" sub="Inbox · Calendar · Funnels" badge="REP" mini />
                <NodeRow title="Power User" sub="Own AI assistant · Custom templates" badge="PRO" mini />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function NodeRow({
  title, sub, badge, highlight, mini,
}: { title: string; sub: string; badge: string; highlight?: boolean; mini?: boolean }) {
  return (
    <div
      className={`flex items-center justify-between rounded-xl border px-4 ${mini ? "py-2.5" : "py-3.5"} ${
        highlight
          ? "border-brand/40 bg-brand/10"
          : "border-white/8 bg-white/[0.03]"
      }`}
    >
      <div>
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-ink-muted">{sub}</div>
      </div>
      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wider ${
        highlight ? "bg-brand text-brand-foreground" : "bg-white/10 text-ink-muted"
      }`}>
        {badge}
      </span>
    </div>
  );
}

export { Check, ChevronRight };
