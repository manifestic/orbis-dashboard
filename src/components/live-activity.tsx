import { useEffect, useState } from "react";
import { useInView } from "@/hooks/use-in-view";

const events = [
  { who: "Sarah K.", what: "booked a discovery call via Orbis link", color: "bg-emerald-400" },
  { who: "Marcus T.", what: "AI assistant qualified 12 leads overnight", color: "bg-cyan-400" },
  { who: "Team Apex", what: "onboarded 47 reps in one afternoon", color: "bg-violet-400" },
  { who: "Lina R.", what: "replied to IG, WhatsApp & SMS in one inbox", color: "bg-amber-400" },
  { who: "Network Pro", what: "saved $412 by canceling 6 tools", color: "bg-rose-400" },
  { who: "Devon M.", what: "launched a funnel in under 8 minutes", color: "bg-emerald-400" },
];

export function LiveActivity() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => setI((x) => (x + 1) % events.length), 2400);
    return () => clearInterval(id);
  }, [inView]);

  const visible = [events[i], events[(i + 1) % events.length], events[(i + 2) % events.length]];

  return (
    <section ref={ref} className="relative overflow-hidden bg-background py-24">
      <div className="absolute left-1/2 top-1/2 h-72 w-[700px] -translate-x-1/2 -translate-y-1/2 animate-aurora rounded-full bg-brand/15 blur-[140px]" />
      <div className="mx-auto max-w-4xl px-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-glow">Live on Orbis right now</p>
        <h2 className="mt-4 text-3xl font-semibold md:text-4xl">
          Real teams. <span className="text-gradient">Real momentum.</span>
        </h2>

        <div className="mt-10 space-y-3">
          {visible.map((e, idx) => (
            <div
              key={`${i}-${idx}`}
              className="animate-slide-in-up flex items-center gap-4 rounded-2xl glass px-5 py-4 text-left"
              style={{ animationDelay: `${idx * 0.08}s`, opacity: 1 - idx * 0.25 }}
            >
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${e.color} opacity-60`} />
                <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${e.color}`} />
              </span>
              <p className="text-sm">
                <span className="font-semibold">{e.who}</span>{" "}
                <span className="text-ink-muted">{e.what}</span>
              </p>
              <span className="ml-auto text-xs text-ink-muted">just now</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
