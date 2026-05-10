import { ArrowRight, Sparkles } from "lucide-react";
import { useInView, useCountUp } from "@/hooks/use-in-view";
import { OrbitalVisual } from "./orbital-visual";
import { MagneticButton } from "./motion-primitives";

function Stat({ value, suffix = "", prefix = "", label, decimals = 0 }: { value: number; suffix?: string; prefix?: string; label: string; decimals?: number }) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const v = useCountUp(value, inView);
  return (
    <div ref={ref}>
      <div className="text-3xl font-semibold text-gradient md:text-4xl tabular-nums">
        {prefix}{v.toFixed(decimals)}{suffix}
      </div>
      <div className="mt-1 text-xs uppercase tracking-wider text-ink-muted">{label}</div>
    </div>
  );
}

export function Hero() {
  return (
    <section id="top" className="bg-hero noise relative overflow-hidden pt-40 pb-24">
      <div className="grid-pattern absolute inset-0 opacity-60" />
      <div className="absolute left-1/2 top-20 h-[480px] w-[480px] -translate-x-1/2 animate-aurora rounded-full bg-brand/25 blur-[120px]" />
      <div className="absolute right-10 top-40 h-72 w-72 animate-aurora rounded-full bg-cyan-500/10 blur-[100px]" style={{ animationDelay: "3s" }} />

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-xs font-medium text-brand-glow">
          <Sparkles className="h-3.5 w-3.5 animate-pulse" />
          Now with AI assistant + 9 channels
        </div>

        <h1 className="animate-fade-up mt-6 text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl" style={{ animationDelay: "0.05s" }}>
          Stop paying for{" "}
          <span className="text-shimmer">10 tools</span>
          <br />
          that do what one should.
        </h1>

        <p className="animate-fade-up mx-auto mt-7 max-w-2xl text-lg text-ink-muted md:text-xl" style={{ animationDelay: "0.1s" }}>
          Orbis combines your CRM, inbox, calendar, social media, funnels, and AI assistant into one cloud platform — built for network marketers, agencies, and growing teams.
        </p>

        <div className="animate-fade-up mt-10 flex flex-wrap items-center justify-center gap-4" style={{ animationDelay: "0.15s" }}>
          <MagneticButton href="#pricing">
            <span className="group inline-flex items-center gap-2 rounded-full bg-brand-gradient bg-pan px-6 py-3.5 text-sm font-semibold text-brand-foreground shadow-glow">
              Start Now — No Credit Card
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </MagneticButton>
          <a
            href="#features"
            className="inline-flex items-center gap-2 rounded-full glass px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-white/10"
          >
            See All Features
          </a>
        </div>

        <OrbitalVisual />

        <div className="animate-fade-up mt-16 grid grid-cols-2 gap-8 md:grid-cols-4" style={{ animationDelay: "0.2s" }}>
          <Stat value={9} suffix="+" label="Tools replaced" />
          <Stat value={312} prefix="$" suffix="+" label="Saved monthly" />
          <Stat value={10} suffix="min" label="Onboarding" />
          <Stat value={1} label="Platform to rule them all" />
        </div>
      </div>
    </section>
  );
}
