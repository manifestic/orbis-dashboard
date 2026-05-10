const steps = [
  { n: "01", title: "We set up your account", desc: "Send us your existing tools, contacts, and brand assets. We migrate everything for you." },
  { n: "02", title: "Connect your channels", desc: "Plug in Instagram, WhatsApp, Facebook, email, and your phone number in just a few clicks." },
  { n: "03", title: "Share your booking link", desc: "Your calendar, your CRM, your funnel — all live behind one beautiful link you control." },
  { n: "04", title: "Let the system work", desc: "AI follows up, automations qualify leads, and your pipeline fills while you focus on closing." },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative bg-surface/50 py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-glow">Getting Started</p>
          <h2 className="mt-4 text-4xl font-semibold md:text-5xl">
            Up and running in <span className="text-gradient">under 10 minutes.</span>
          </h2>
          <p className="mt-5 text-ink-muted">No technical setup. No engineering team. Just results.</p>
        </div>

        <div className="relative mt-20 grid gap-10 md:grid-cols-4">
          <div className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent md:block" />
          {steps.map((s) => (
            <div key={s.n} className="relative">
              <div className="relative z-10 mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-gradient text-sm font-bold text-brand-foreground shadow-glow">
                {s.n}
              </div>
              <h3 className="mt-6 text-center text-base font-semibold">{s.title}</h3>
              <p className="mt-2 text-center text-sm leading-relaxed text-ink-muted">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
