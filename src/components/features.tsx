import {
  Calendar, Inbox, Bot, Share2, Filter, Users2,
  Mail, Search, BarChart3,
} from "lucide-react";

const features = [
  { icon: Calendar, title: "Calendar & Booking Link", desc: "Personal booking pages, team round-robin, and automated reminders. Replaces Calendly.", replaces: "Calendly · 25min" },
  { icon: Inbox, title: "Unified Inbox", desc: "Instagram, WhatsApp, SMS, email, and Messenger all in one thread. Reply once, anywhere.", replaces: "Front · 5 channels" },
  { icon: Bot, title: "AI Assistant — Built In", desc: "Drafts replies, qualifies leads, summarizes calls, and writes follow-ups while you sleep.", replaces: "GPT Plus · OpenAI" },
  { icon: Share2, title: "Social Media — 9 Channels", desc: "Schedule, publish, and track across IG, FB, TikTok, LinkedIn, X, YouTube, Pinterest + more.", replaces: "Hootsuite · 9 platforms" },
  { icon: Filter, title: "Funnels & Landing Pages", desc: "Drag-and-drop pages, opt-ins, order forms, and upsells with A/B testing baked in.", replaces: "ClickFunnels · 1,000s of templates" },
  { icon: Users2, title: "CRM & Pipeline", desc: "Visual pipelines, lead scoring, and full contact history — automatically synced from every channel.", replaces: "Salesforce · 100k contacts" },
  { icon: Mail, title: "Email & SMS Campaigns", desc: "Broadcast, drip, and trigger-based sequences with deliverability you can actually trust.", replaces: "ActiveCampaign + Twilio" },
  { icon: Search, title: "Facebook Group Intelligence", desc: "Identify hot leads, track member activity, and surface buying signals from any FB group.", replaces: "Group Leads · GroupTrack" },
  { icon: BarChart3, title: "Analytics & Reporting", desc: "Revenue, pipeline velocity, ad ROAS, and team performance — one dashboard, real-time.", replaces: "Looker · GA4" },
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
            <div
              key={f.title}
              className="group relative overflow-hidden rounded-2xl glass p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.07]"
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-brand/10 blur-3xl transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient text-brand-foreground shadow-glow">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{f.desc}</p>
                <div className="mt-4 inline-flex rounded-full border border-brand/20 bg-brand/5 px-3 py-1 text-xs text-brand-glow">
                  Replaces {f.replaces}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
