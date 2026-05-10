import { Check } from "lucide-react";

const tiers = [
  {
    name: "Starter", price: "97", desc: "per month, billed monthly",
    features: [
      "1 user with full feature access",
      "Unlimited contacts in CRM",
      "5,000 emails / 1,000 SMS",
      "1 funnel + landing page",
      "AI assistant (basic)",
      "5 social channels",
      "Email-only support",
    ],
    cta: "Get Started", featured: false,
  },
  {
    name: "Pro", price: "197", desc: "per month, billed annually",
    features: [
      "5 users with full features",
      "All channels & inboxes",
      "Unlimited funnels & pages",
      "Full automations + sequences",
      "Advanced AI assistant",
      "Group intelligence + scoring",
      "Priority support",
    ],
    cta: "Get Started", featured: true,
  },
  {
    name: "Agency / Network", price: "297", desc: "per month + sub-account access",
    features: [
      "Unlimited users",
      "Per-rep sub-accounts",
      "Your branded portal",
      "White-label landing domain",
      "API + webhooks access",
      "Bulk onboarding tools",
      "Dedicated success manager",
    ],
    cta: "Get Started", featured: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative bg-surface/50 py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-glow">Simple Pricing</p>
          <h2 className="mt-4 text-4xl font-semibold md:text-5xl">
            Start simple. <span className="text-gradient">Scale as you grow.</span>
          </h2>
          <p className="mt-5 text-ink-muted">
            Every plan includes the calendar, inbox, unified CRM, and AI assistant. No hidden fees.
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`relative rounded-2xl p-8 transition-all ${
                t.featured
                  ? "bg-brand-gradient text-brand-foreground shadow-glow scale-[1.02]"
                  : "glass hover:bg-white/[0.07]"
              }`}
            >
              {t.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-background px-4 py-1 text-xs font-semibold text-brand-glow border border-brand/30">
                  MOST POPULAR
                </div>
              )}
              <div className={`text-xs uppercase tracking-[0.2em] ${t.featured ? "opacity-80" : "text-ink-muted"}`}>
                {t.name}
              </div>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-2xl font-medium">$</span>
                <span className="text-6xl font-semibold tracking-tight">{t.price}</span>
              </div>
              <p className={`mt-2 text-sm ${t.featured ? "opacity-80" : "text-ink-muted"}`}>{t.desc}</p>

              <ul className="mt-8 space-y-3">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <Check className={`mt-0.5 h-4 w-4 shrink-0 ${t.featured ? "" : "text-brand-glow"}`} />
                    <span className={t.featured ? "" : "text-foreground/90"}>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`mt-10 w-full rounded-full py-3.5 text-sm font-semibold transition-all ${
                  t.featured
                    ? "bg-background text-foreground hover:bg-background/90"
                    : "bg-brand-gradient text-brand-foreground shadow-glow hover:scale-[1.02]"
                }`}
              >
                {t.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
