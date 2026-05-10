import { Check, Sparkles, Users } from "lucide-react";

const base = {
  tag: "Starter — everything you need to run your business",
  price: 30,
  features: [
    "Full CRM — leads, pipeline, contacts",
    "AI assistant — ask it anything, anytime",
    "1,000 emails + 250 SMS per month included",
    "Two-level affiliate earnings ($5 + $3/month per referral)",
    "14-day free trial, cancel anytime",
  ],
};

const addons = [
  {
    name: "Landing page + AI chatbot + calendar",
    price: 39,
    desc: "Your branded page, AI that qualifies leads 24/7, and a booking calendar — prospects book calls while you sleep.",
    featured: true,
  },
  { name: "Content Starter", price: 25, desc: "4 AI-written social posts/month, branded to your MLM and audience." },
  { name: "Content Growth", price: 45, desc: "8 posts/month — 2 per week, variety of formats, scheduled for you." },
  { name: "Content Daily", price: 79, desc: "30 posts/month — fully scheduled in your social planner." },
  { name: "Lead Prospecting", price: 49, desc: "Monthly filtered lead list delivered straight to your CRM." },
  { name: "Outreach Sequences", price: 29, desc: "Pre-written message sequences loaded into your CRM workflows." },
  { name: "Full Concierge — done for you", price: 199, desc: "We manage everything: content creation, lead prospecting, CRM management, and funnel — you just show up to calls.", wide: true },
];

function Price({ value, className = "" }: { value: number; className?: string }) {
  return (
    <div className={`flex items-baseline gap-1.5 ${className}`}>
      <span className="text-4xl font-semibold tracking-tight tabular-nums md:text-5xl">${value}</span>
      <span className="text-sm text-ink-muted">/month</span>
    </div>
  );
}

export function Pricing() {
  return (
    <section id="pricing" className="relative overflow-hidden bg-surface/50 py-32">
      <div className="absolute left-1/2 top-0 h-72 w-[700px] -translate-x-1/2 animate-aurora rounded-full bg-brand/15 blur-[140px]" />

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-glow">Simple, modular pricing</p>
          <h2 className="mt-4 text-4xl font-semibold md:text-5xl">
            One base. <span className="text-shimmer">Add what you need.</span>
          </h2>
          <p className="mt-5 text-ink-muted">
            Start at $30. Stack only the add-ons your business actually uses — no bloated tiers, no forced bundles.
          </p>
        </div>

        {/* BASE PLAN */}
        <div className="mt-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">Base plan</p>
          <div className="relative mt-3 overflow-hidden rounded-2xl glass-strong p-7 md:p-9">
            <div className="absolute -right-24 -top-24 h-72 w-72 animate-aurora rounded-full bg-brand/20 blur-[120px]" />
            <div className="relative">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-glow">
                <Sparkles className="h-3.5 w-3.5" />
                {base.tag}
              </div>
              <Price value={base.price} className="mt-4" />
              <div className="my-6 h-px bg-white/10" />
              <ul className="grid gap-3 md:grid-cols-2">
                {base.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-glow" />
                    <span className="text-foreground/90">{f}</span>
                  </li>
                ))}
              </ul>
              <button className="mt-8 rounded-full bg-brand-gradient bg-pan px-6 py-3 text-sm font-semibold text-brand-foreground shadow-glow transition-transform hover:scale-[1.03]">
                Start 14-day free trial
              </button>
            </div>
          </div>
        </div>

        {/* ADD-ONS */}
        <div className="mt-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">
            Add-ons — add what you need, when you need it
          </p>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            {addons.map((a) => {
              const featured = a.featured;
              return (
                <div
                  key={a.name}
                  className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 ${
                    a.wide ? "md:col-span-2" : ""
                  } ${
                    featured
                      ? "border border-brand/40 bg-brand/10 shadow-glow"
                      : "glass hover:bg-white/[0.07]"
                  }`}
                >
                  {featured && (
                    <div className="absolute right-4 top-4 rounded-full bg-brand-gradient px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-foreground shadow-glow">
                      Most popular
                    </div>
                  )}
                  <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-brand/10 blur-3xl opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="relative">
                    <h4 className={`text-base font-semibold ${featured ? "text-brand-glow" : ""}`}>{a.name}</h4>
                    <Price value={a.price} className="mt-2" />
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted">{a.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AFFILIATE */}
        <div className="relative mt-14 overflow-hidden rounded-2xl glass-strong p-7 md:p-10">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand/15 blur-[100px]" />
          <div className="relative grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-semibold text-brand-glow">
                <Users className="h-3.5 w-3.5" />
                Two-level affiliate program
              </div>
              <h3 className="mt-4 text-2xl font-semibold md:text-3xl">
                Turn Orbis into <span className="text-gradient">passive income.</span>
              </h3>
              <p className="mt-3 max-w-md text-sm text-ink-muted">
                Earn every month a referral stays subscribed — plus a slice of everyone they refer. Built right into the base plan.
              </p>
            </div>
            <div className="grid gap-3">
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">Level 1 · Direct</div>
                  <div className="mt-0.5 text-lg font-semibold tabular-nums">$5<span className="text-xs font-normal text-ink-muted"> /mo per person</span></div>
                </div>
                <span className="rounded-full bg-brand/15 px-2.5 py-0.5 text-[10px] font-bold text-brand-glow">L1</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">Level 2 · Their referrals</div>
                  <div className="mt-0.5 text-lg font-semibold tabular-nums">$3<span className="text-xs font-normal text-ink-muted"> /mo per person</span></div>
                </div>
                <span className="rounded-full bg-brand/15 px-2.5 py-0.5 text-[10px] font-bold text-brand-glow">L2</span>
              </div>
              <div className="rounded-xl bg-brand-gradient bg-pan px-5 py-4 text-brand-foreground shadow-glow">
                <div className="text-[11px] font-semibold uppercase tracking-wider opacity-80">Example · Team of 100</div>
                <div className="mt-0.5 text-lg font-semibold tabular-nums">$320–$500+<span className="text-xs font-normal opacity-80"> /mo passive</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
