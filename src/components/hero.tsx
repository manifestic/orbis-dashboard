import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section id="top" className="bg-hero noise relative overflow-hidden pt-40 pb-24">
      <div className="grid-pattern absolute inset-0 opacity-60" />
      <div className="absolute left-1/2 top-20 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-brand/20 blur-[120px]" />

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-xs font-medium text-brand-glow">
          <Sparkles className="h-3.5 w-3.5" />
          Now with AI assistant + 9 channels
        </div>

        <h1 className="animate-fade-up mt-6 text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl" style={{ animationDelay: "0.05s" }}>
          Stop paying for{" "}
          <span className="text-gradient">10 tools</span>
          <br />
          that do what one should.
        </h1>

        <p className="animate-fade-up mx-auto mt-7 max-w-2xl text-lg text-ink-muted md:text-xl" style={{ animationDelay: "0.1s" }}>
          Orbis combines your CRM, inbox, calendar, social media, funnels, and AI assistant into one cloud platform — built for network marketers, agencies, and growing teams.
        </p>

        <div className="animate-fade-up mt-10 flex flex-wrap items-center justify-center gap-4" style={{ animationDelay: "0.15s" }}>
          <a
            href="#pricing"
            className="group inline-flex items-center gap-2 rounded-full bg-brand-gradient px-6 py-3.5 text-sm font-semibold text-brand-foreground shadow-glow transition-transform hover:scale-[1.03]"
          >
            Start Now — No Credit Card
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="#features"
            className="inline-flex items-center gap-2 rounded-full glass px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-white/10"
          >
            See All Features
          </a>
        </div>

        <div className="animate-fade-up mt-20 grid grid-cols-2 gap-8 md:grid-cols-4" style={{ animationDelay: "0.2s" }}>
          {[
            { v: "9+", l: "Tools replaced" },
            { v: "$300+", l: "Saved monthly" },
            { v: "10min", l: "Onboarding" },
            { v: "1", l: "Platform to rule them all" },
          ].map((s) => (
            <div key={s.l}>
              <div className="text-3xl font-semibold text-gradient md:text-4xl">{s.v}</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-ink-muted">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
