import { Check, Plus, Users } from "lucide-react";

type Tier = {
  name: string;
  price: number;
  tagline: string;
  includes: string[];
  addons?: string[];
  cta: string;
  ctaSub: string;
  popular?: boolean;
};

const tiers: Tier[] = [
  {
    name: "Starter",
    price: 30,
    tagline: "Your CRM, follow-up sequences, and a lead capture page — everything to stop losing contacts.",
    includes: [
      "Full CRM — pipeline, notes, tags",
      "AI assistant — ask it anything",
      "Drip sequences — automated follow-up",
      "Basic capture page (yourname.orbis.app)",
      "1,000 emails + 250 SMS/month",
      "Affiliate earnings on every referral",
    ],
    addons: ["AI chatbot on your page", "Custom domain + branding", "Content creation"],
    cta: "Start free — 14 days",
    ctaSub: "No credit card required",
  },
  {
    name: "Connected",
    price: 69,
    tagline: "Add an AI chatbot that qualifies your leads 24/7 and books calls while you sleep.",
    includes: [
      "Everything in Starter",
      "AI chatbot on your landing page",
      "Custom branded domain",
      "Booking calendar — prospects self-schedule",
      "Auto-enroll new leads into sequences",
      "Chatbot-to-CRM pipeline sync",
    ],
    addons: ["Content creation"],
    cta: "Start free — 14 days",
    ctaSub: "$30 base + $39 chatbot & funnel",
    popular: true,
  },
  {
    name: "Growth",
    price: 94,
    tagline: "Stay visible on social all month long without spending hours creating content.",
    includes: [
      "Everything in Connected",
      "4 AI-written posts/month",
      "Branded to your niche & audience",
      "Scheduled directly into social planner",
      "You approve before anything posts",
    ],
    addons: ["Lead prospecting"],
    cta: "Start free — 14 days",
    ctaSub: "$69 + $25 social content",
  },
  {
    name: "Full System",
    price: 197,
    tagline: "Leads come in, content goes out, and your pipeline runs itself. You just close.",
    includes: [
      "Everything in Growth",
      "30 posts/month (fully scheduled)",
      "Monthly targeted lead list",
      "Outreach sequences pre-loaded",
      "Team activity visibility",
      "Priority support",
    ],
    cta: "Start free — 14 days",
    ctaSub: "$69 + $79 content + $49 leads",
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative overflow-hidden bg-surface/50 py-32">
      <div className="absolute left-1/2 top-0 h-72 w-[700px] -translate-x-1/2 animate-aurora rounded-full bg-brand/15 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-glow">Pricing</p>
          <h2 className="mt-4 text-4xl font-semibold md:text-5xl">
            Simple pricing. <span className="text-shimmer">No surprises.</span>
          </h2>
          <p className="mt-5 text-ink-muted">
            Start free for 14 days. No credit card required until you're ready.
          </p>
        </div>

        {/* Tiers */}
        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`relative flex flex-col rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 ${
                t.popular
                  ? "border border-brand/40 bg-brand/[0.08] shadow-glow lg:scale-[1.03]"
                  : "glass hover:bg-white/[0.07]"
              }`}
            >
              {t.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-gradient bg-pan px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-foreground shadow-glow">
                  Most popular
                </div>
              )}

              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-glow">{t.name}</div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-2xl font-medium">$</span>
                <span className="text-5xl font-semibold tracking-tight tabular-nums">{t.price}</span>
              </div>
              <div className="text-sm text-ink-muted">/month</div>

              <p className="mt-5 text-sm leading-relaxed text-foreground/85">{t.tagline}</p>

              <div className="my-6 h-px bg-white/10" />

              <ul className="space-y-3">
                {t.includes.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-glow" />
                    <span className="text-foreground/90">{f}</span>
                  </li>
                ))}
                {t.addons?.map((a) => (
                  <li key={a} className="flex items-start gap-2.5 text-sm text-ink-muted">
                    <Plus className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-8">
                <button
                  className={`w-full rounded-full py-3 text-sm font-semibold transition-all ${
                    t.popular
                      ? "bg-brand-gradient bg-pan text-brand-foreground shadow-glow hover:scale-[1.02]"
                      : "bg-white/[0.06] text-foreground hover:bg-white/[0.12]"
                  }`}
                >
                  {t.cta}
                </button>
                <p className="mt-2.5 text-center text-xs text-ink-muted">{t.ctaSub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Concierge banner */}
        <div className="mt-8 rounded-2xl glass-strong px-6 py-5 text-center text-sm text-foreground/85 md:text-base">
          Need someone to run everything for you? Ask about{" "}
          <span className="font-semibold text-foreground">Full Concierge at $229/month</span>{" "}
          <span className="text-ink-muted">— we manage your CRM, content, and leads so you just show up to calls.</span>
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
