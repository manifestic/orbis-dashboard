import { ArrowRight } from "lucide-react";

export function CtaFooter() {
  return (
    <>
      <section className="relative overflow-hidden bg-hero noise py-32">
        <div className="grid-pattern absolute inset-0 opacity-50" />
        <div className="absolute left-1/2 top-1/2 h-96 w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/20 blur-[140px]" />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-glow">Ready to Switch?</p>
          <h2 className="mt-4 text-4xl font-semibold leading-[1.1] md:text-6xl">
            Replace your tool stack.
            <br />
            <span className="text-gradient">Keep your results.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-ink-muted">
            Get your calendar link, unified inbox, funnels, CRM, and AI on one platform — for less than a single tool you're paying for now.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#pricing"
              className="group inline-flex items-center gap-2 rounded-full bg-brand-gradient px-6 py-3.5 text-sm font-semibold text-brand-foreground shadow-glow transition-transform hover:scale-[1.03]"
            >
              Get Started Today
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a href="#features" className="inline-flex items-center gap-2 rounded-full glass px-6 py-3.5 text-sm font-semibold hover:bg-white/10">
              See All Features
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 bg-background py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 text-center">
          <div className="flex items-center gap-2">
            <div className="relative h-6 w-6">
              <div className="absolute inset-0 rounded-full bg-brand-gradient" />
              <div className="absolute inset-1 rounded-full bg-background" />
              <div className="absolute inset-2 rounded-full bg-brand-gradient" />
            </div>
            <span className="text-sm font-semibold tracking-tight">ORBIS</span>
          </div>
          <p className="text-xs text-ink-muted">© 2026 Orbis. All rights reserved.</p>
          <p className="text-xs text-ink-muted">Built by Network Marketers, for Network Marketers.</p>
        </div>
      </footer>
    </>
  );
}
