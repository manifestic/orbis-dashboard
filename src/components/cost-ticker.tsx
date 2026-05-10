const tools = [
  { name: "Calendly", price: "$20/mo" },
  { name: "ActiveCampaign", price: "$65/mo" },
  { name: "ClickFunnels", price: "$127/mo" },
  { name: "Salesforce", price: "$75/mo" },
  { name: "Manychat", price: "$65/mo" },
  { name: "SMS Platform", price: "$40/mo" },
  { name: "Zapier", price: "$49/mo" },
  { name: "Hootsuite", price: "$99/mo" },
  { name: "Notion AI", price: "$20/mo" },
];

export function CostTicker() {
  const items = [...tools, ...tools];
  return (
    <section className="border-y border-white/5 bg-surface/60 py-6 backdrop-blur">
      <p className="mb-4 text-center text-xs uppercase tracking-[0.2em] text-ink-muted">
        Stop bleeding cash · Orbis replaces all of these
      </p>
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-background to-transparent" />
        <div className="flex w-max animate-ticker gap-3">
          {items.map((t, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-full glass px-5 py-2.5 text-sm whitespace-nowrap"
            >
              <span className="text-ink-muted line-through">{t.name}</span>
              <span className="font-semibold text-destructive">{t.price}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
