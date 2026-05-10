import { Calendar, Inbox, Bot, Share2, Filter, Users2, Mail, BarChart3 } from "lucide-react";

const ring1 = [
  { Icon: Calendar, label: "Calendar" },
  { Icon: Inbox, label: "Inbox" },
  { Icon: Bot, label: "AI" },
  { Icon: Share2, label: "Social" },
];
const ring2 = [
  { Icon: Filter, label: "Funnels" },
  { Icon: Users2, label: "CRM" },
  { Icon: Mail, label: "Email/SMS" },
  { Icon: BarChart3, label: "Analytics" },
];

function OrbitNode({ Icon, angle, radius, delay }: { Icon: typeof Calendar; angle: number; radius: number; delay: number }) {
  const x = Math.cos((angle * Math.PI) / 180) * radius;
  const y = Math.sin((angle * Math.PI) / 180) * radius;
  return (
    <div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`, animationDelay: `${delay}s` }}
    >
      <div className="animate-float-slow flex h-12 w-12 items-center justify-center rounded-2xl glass-strong shadow-glow">
        <Icon className="h-5 w-5 text-brand-glow" />
      </div>
    </div>
  );
}

export function OrbitalVisual() {
  return (
    <div className="relative mx-auto mt-16 hidden h-[420px] w-[420px] md:block">
      {/* Aurora glow */}
      <div className="absolute inset-0 animate-aurora rounded-full bg-brand/25 blur-[100px]" />
      {/* Rings */}
      <div className="absolute inset-8 rounded-full border border-white/10" />
      <div className="absolute inset-20 rounded-full border border-white/10" />
      <div className="absolute inset-32 rounded-full border border-brand/30" />

      {/* Orbiting groups */}
      <div className="absolute inset-0 animate-orbit-slow">
        {ring1.map((n, i) => (
          <OrbitNode key={n.label} Icon={n.Icon} angle={i * 90} radius={180} delay={i * 0.3} />
        ))}
      </div>
      <div className="absolute inset-0 animate-orbit-reverse">
        {ring2.map((n, i) => (
          <OrbitNode key={n.label} Icon={n.Icon} angle={i * 90 + 45} radius={120} delay={i * 0.4} />
        ))}
      </div>

      {/* Center core */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-brand-gradient shadow-glow">
          <div className="absolute inset-0 animate-ping-slow rounded-full bg-brand/40" />
          <div className="relative z-10 text-lg font-bold tracking-tight text-brand-foreground">ORBIS</div>
        </div>
      </div>
    </div>
  );
}
