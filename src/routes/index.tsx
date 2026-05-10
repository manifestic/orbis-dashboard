import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { ScrollProgress } from "@/components/scroll-progress";
import { Hero } from "@/components/hero";
import { CostTicker } from "@/components/cost-ticker";
import { Features } from "@/components/features";
import { HowItWorks } from "@/components/how-it-works";
import { LiveActivity } from "@/components/live-activity";
import { NetworkSection } from "@/components/network-section";
import { Pricing } from "@/components/pricing";
import { CtaFooter } from "@/components/cta-footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Orbis — One platform. Every tool. Built for network marketers." },
      { name: "description", content: "Orbis combines CRM, inbox, calendar, funnels, social, and AI into one platform — built for network marketers, agencies, and growing teams." },
      { property: "og:title", content: "Orbis — Replace 10 tools with one." },
      { property: "og:description", content: "CRM, inbox, calendar, funnels, social, and AI — unified. Built for network marketers." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <ScrollProgress />
      <SiteNav />
      <Hero />
      <CostTicker />
      <Features />
      <HowItWorks />
      <LiveActivity />
      <NetworkSection />
      <Pricing />
      <CtaFooter />
    </main>
  );
}
