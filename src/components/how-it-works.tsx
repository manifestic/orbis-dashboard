const steps = [
  { n: "01", title: "Sign up in 60 seconds", desc: "Create your account, import your existing contacts, and pick your pipeline stages. No setup call, no waiting." },
  { n: "02", title: "Share your capture link", desc: "Your personal lead page goes live instantly at yourname.orbis.app. Share it anywhere — social, DMs, bio." },
  { n: "03", title: "Let AI work the leads", desc: "Every new lead gets an automatic follow-up sequence. The AI chatbot qualifies them and books calls while you sleep." },
  { n: "04", title: "Close and grow your team", desc: "Your pipeline fills itself. You show up to conversations that are already warm — and keep the ones that matter." },
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
