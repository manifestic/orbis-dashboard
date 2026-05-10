import {
  Calendar, Inbox, Bot, Share2, Filter, Users2,
  Mail, Search, BarChart3,
} from "lucide-react";
import { TiltCard } from "./motion-primitives";
import { useInView } from "@/hooks/use-in-view";

const features = [
  { icon: Users2, title: "CRM & Pipeline", desc: "Visual pipelines built for network marketers — New Lead, Contacted, Presented, Enrolled. Full contact history, notes, and tags.", replaces: "Spreadsheets + sticky notes" },
  { icon: Bot, title: "AI Assistant — Built In", desc: "Ask it anything: 'Who haven't I followed up with in 5 days?' It answers, drafts messages, and takes action.", replaces: "GPT Plus · $20/mo" },
  { icon: Mail, title: "Drip Sequences", desc: "Automated follow-up that runs while you're offline. New lead added? A sequence starts immediately.", replaces: "ActiveCampaign + Twilio" },
  { icon: Filter, title: "Landing Page & Lead Capture", desc: "Your personal capture page live at yourname.orbis.app the moment you sign up. Upgrade for custom domain and branding.", replaces: "Linktree + opt-in forms" },
  { icon: Calendar, title: "Booking Calendar", desc: "Prospects book themselves directly into your calendar. Automated reminders cut no-shows in half.", replaces: "Calendly · $16/mo" },
  { icon: Inbox, title: "Unified Inbox", desc: "SMS, email, and DMs all in one thread. Stop toggling between apps to find a conversation.", replaces: "Front · multiple apps" },
  { icon: Share2, title: "Social Media Planner", desc: "Schedule posts across your channels weeks ahead. AI writes the content, you approve before anything goes live.", replaces: "Hootsuite · $99/mo" },
  { icon: Search, title: "Facebook Group Intelligence", desc: "Surface buying signals and identify warm leads from any FB group you're in.", replaces: "Group Leads · GroupTrack", comingSoon: true },
  { icon: BarChart3, title: "Analytics & Reporting", desc: "Pipeline velocity, follow-up rates, and team performance — all in one dashboard you can actually read.", replaces: "Nothing — most NM people fly blind" },
];

export function Features() {
  return (
    <section id="features" className="relative bg-background py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-glow">
            Every Tool, Unified
          </p>
          <h2 className="mt-4 text-4xl font-semibold md:text-5xl">
            One login. <span className="text-gradient">Every tool you need.</span>
          </h2>
          <p className="mt-5 text-ink-muted">
            Every feature is connected to every other feature. Your calendar talks to your CRM. Your funnel captures leads in your inbox. Your AI keeps it all moving — only.
          </p>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <FeatureCard key={f.title} f={f} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

type Feature = (typeof features)[number];

function FeatureCard({ f, i }: { f: Feature; i: number }) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={`reveal ${inView ? "in" : ""}`} style={{ transitionDelay: `${(i % 3) * 80}ms` }}>
      <TiltCard className="group relative overflow-hidden rounded-2xl glass p-6 hover:bg-white/[0.07]">
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: "radial-gradient(400px circle at var(--mx,50%) var(--my,50%), oklch(0.74 0.16 175 / 0.18), transparent 40%)" }}
        />
        <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-brand/10 blur-3xl" />
        <div className="relative">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient text-brand-foreground shadow-glow transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
            <f.icon className="h-5 w-5" />
          </div>
          <div className="mt-5 flex items-center gap-2">
            <h3 className="text-lg font-semibold">{f.title}</h3>
            {f.comingSoon && (
              <span className="rounded-full border border-white/20 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-ink-muted">
                Soon
              </span>
            )}
          </div>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">{f.desc}</p>
          <div className="mt-4 inline-flex rounded-full border border-brand/20 bg-brand/5 px-3 py-1 text-xs text-brand-glow">
            Replaces {f.replaces}
          </div>
        </div>
      </TiltCard>
    </div>
  );
}
