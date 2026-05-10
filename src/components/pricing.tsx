import { Check, Sparkles, Zap, Crown, Users, Megaphone, Target, MessageSquare, Layers } from "lucide-react";

const base = {
  name: "Base Plan",
  price: 30,
  trial: "14-day free trial · Cancel anytime",
  features: [
    "Full CRM (leads, pipeline, contacts)",
    "AI assistant — ask anything, anytime",
    "1,000 emails + 250 SMS / month",
    "Two-level affiliate earnings",
    "Cancel anytime",
  ],
};

const addons = [
  { icon: Layers, price: 39, name: "Landing Page + AI Chatbot + Booking Calendar", desc: "Branded page, 24/7 lead capture, auto-books calls." },
  { icon: Megaphone, price: 25, name: "Content Starter", desc: "4 AI-generated posts per month." },
  { icon: Megaphone, price: 45, name: "Content Growth", desc: "8 posts per month, fully scheduled." },
  { icon: Megaphone, price: 79, name: "Content Daily", desc: "30 posts per month, fully scheduled." },
  { icon: Target, price: 49, name: "Lead Prospecting", desc: "Monthly filtered lead list delivered to your CRM." },
  { icon: MessageSquare, price: 29, name: "Outreach Sequences", desc: "Pre-written message flows that convert." },
  { icon: Crown, price: 199, name: "Full Concierge", desc: "We manage everything for you — done-for-you growth." },
];

const combos = [
  { tag: "Just getting started", name: "Solo", total: 30, parts: ["$30"], features: ["Base plan only"], icon: Zap, popular: false },
  { tag: "Most popular", name: "Launch", total: 69, parts: ["$30", "$39"], features: ["Base plan", "Landing page + chatbot + calendar"], icon: Sparkles, popular: true },
  { tag: "Growth mode", name: "Growth", total: 94, parts: ["$30", "$39", "$25"], features: ["Base plan", "Landing page + chatbot", "Content Starter (4 posts/mo)"], icon: Target, popular: false },
  { tag: "Full stack", name: "Scale", total: 197, parts: ["$30", "$39", "$79", "$49"], features: ["Base plan", "Landing page + chatbot", "Content Daily (30 posts/mo)", "Lead Prospecting"], icon: Layers, popular: false },
  { tag: "Done-for-you", name: "Concierge", total: 229, parts: ["$30", "$199"], features: ["Base plan", "Full Concierge — we run it for you"], icon: Crown, popular: false },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative overflow-hidden bg-surface/50 py-32">
      <div className="absolute left-1/2 top-0 h-72 w-[700px] -translate-x-1/2 animate-aurora rounded-full bg-brand/15 blur-[140px]" />
      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-glow">Simple, modular pricing</p>
          <h2 className="mt-4 text-4xl font-semibold md:text-5xl">
            Start at <span className="text-shimmer">$30</span>. Add what you need.
          </h2>
          <p className="mt-5 text-ink-muted">
            One base plan. À la carte add-ons. Stack only what your business actually uses — no bloated tiers, no forced bundles.
          </p>
        </div>

        {/* Base plan hero card */}
        <div className="relative mx-auto mt-16 max-w-3xl">
          <div className="absolute -inset-2 animate-aurora rounded-3xl bg-brand/25 opacity-40 blur-2xl" />
          <div className="relative overflow-hidden rounded-3xl bg-brand-gradient bg-pan p-8 text-brand-foreground shadow-glow md:p-10">
            <div className="grid-pattern absolute inset-0 opacity-20" />
            <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-background/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur">
                  <Sparkles className="h-3.5 w-3.5" />
                  {base.name}
                </div>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-3xl font-medium">$</span>
                  <span className="text-7xl font-semibold tracking-tight tabular-nums">{base.price}</span>
                  <span className="ml-2 text-base opacity-80">/month</span>
                </div>
                <p className="mt-2 text-sm opacity-80">{base.trial}</p>
                <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                  {base.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button className="rounded-full bg-background px-7 py-4 text-sm font-semibold text-foreground shadow-card-elevated transition-transform hover:scale-[1.03]">
                Start 14-day trial
              </button>
            </div>
          </div>
        </div>

        {/* Add-ons */}
        <div className="mt-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-glow">Add-ons</p>
              <h3 className="mt-2 text-2xl font-semibold md:text-3xl">Build your stack <span className="text-gradient">à la carte</span></h3>
            </div>
            <p className="max-w-sm text-sm text-ink-muted">Mix and match. Add or remove anytime — billing adjusts on the spot.</p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {addons.map((a) => (
              <div
                key={a.name}
                className="group relative overflow-hidden rounded-2xl glass p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.07]"
              >
                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-brand/10 blur-3xl opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative flex items-start gap-4">
                  <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-brand-foreground shadow-glow transition-transform group-hover:scale-110 group-hover:rotate-6">
                    <a.icon className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <h4 className="text-sm font-semibold leading-snug">{a.name}</h4>
                      <span className="shrink-0 text-sm font-semibold text-brand-glow tabular-nums">${a.price}<span className="text-xs text-ink-muted">/mo</span></span>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">{a.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular combos */}
        <div className="mt-24">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-glow">Popular combos</p>
            <h3 className="mt-2 text-2xl font-semibold md:text-3xl">Pre-built stacks that <span className="text-gradient">just work</span></h3>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {combos.map((c) => (
              <div
                key={c.name}
                className={`relative flex flex-col rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 ${
                  c.popular
                    ? "bg-brand-gradient bg-pan text-brand-foreground shadow-glow lg:scale-[1.04]"
                    : "glass hover:bg-white/[0.07]"
                }`}
              >
                {c.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-background px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-glow border border-brand/30">
                    Most popular
                  </div>
                )}
                <div className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${c.popular ? "bg-background/20" : "bg-brand-gradient text-brand-foreground shadow-glow"}`}>
                  <c.icon className="h-4 w-4" />
                </div>
                <p className={`mt-4 text-[10px] font-semibold uppercase tracking-wider ${c.popular ? "opacity-80" : "text-ink-muted"}`}>{c.tag}</p>
                <h4 className="mt-1 text-lg font-semibold">{c.name}</h4>

                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-xl font-medium">$</span>
                  <span className="text-4xl font-semibold tracking-tight tabular-nums">{c.total}</span>
                  <span className={`ml-1 text-xs ${c.popular ? "opacity-80" : "text-ink-muted"}`}>/mo</span>
                </div>
                <p className={`mt-1 text-xs tabular-nums ${c.popular ? "opacity-70" : "text-ink-muted"}`}>{c.parts.join(" + ")}</p>

                <ul className="mt-5 flex-1 space-y-2">
                  {c.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs">
                      <Check className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${c.popular ? "" : "text-brand-glow"}`} />
                      <span className={c.popular ? "" : "text-foreground/90"}>{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`mt-6 w-full rounded-full py-2.5 text-xs font-semibold transition-all ${
                    c.popular
                      ? "bg-background text-foreground hover:bg-background/90"
                      : "bg-brand-gradient text-brand-foreground shadow-glow hover:scale-[1.02]"
                  }`}
                >
                  Choose {c.name}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Affiliate structure */}
        <div className="relative mt-24 overflow-hidden rounded-3xl glass-strong p-8 md:p-12">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand/15 blur-[100px]" />
          <div className="relative grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-semibold text-brand-glow">
                <Users className="h-3.5 w-3.5" />
                Two-level affiliate program
              </div>
              <h3 className="mt-4 text-2xl font-semibold md:text-4xl">
                Turn Orbis into <span className="text-gradient">passive income.</span>
              </h3>
              <p className="mt-4 max-w-md text-ink-muted">
                Every active member of your network earns. Refer once, get paid every month they stay subscribed — plus a slice of everyone they refer.
              </p>
            </div>
            <div className="grid gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Level 1 · Direct referrals</span>
                  <span className="rounded-full bg-brand/15 px-2.5 py-0.5 text-[10px] font-bold text-brand-glow">L1</span>
                </div>
                <div className="mt-2 text-2xl font-semibold tabular-nums">$5<span className="text-sm font-normal text-ink-muted">/month per person</span></div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Level 2 · Their referrals</span>
                  <span className="rounded-full bg-brand/15 px-2.5 py-0.5 text-[10px] font-bold text-brand-glow">L2</span>
                </div>
                <div className="mt-2 text-2xl font-semibold tabular-nums">$3<span className="text-sm font-normal text-ink-muted">/month per person</span></div>
              </div>
              <div className="rounded-2xl bg-brand-gradient bg-pan p-5 text-brand-foreground shadow-glow">
                <div className="text-xs font-semibold uppercase tracking-wider opacity-80">Example · Team of 100</div>
                <div className="mt-2 text-2xl font-semibold tabular-nums">$320–$500+<span className="text-sm font-normal opacity-80">/mo passive</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
