import { useState, useEffect } from "react";

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#features", label: "Features" },
    { href: "#how", label: "How It Works" },
    { href: "#network", label: "For Networks" },
    { href: "#pricing", label: "Pricing" },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div className="mx-auto max-w-6xl px-4">
        <div
          className={`flex items-center justify-between rounded-full px-5 py-2.5 transition-all ${
            scrolled ? "glass-strong shadow-card-elevated" : ""
          }`}
        >
          <a href="#top" className="flex items-center gap-2">
            <div className="relative h-7 w-7">
              <div className="absolute inset-0 rounded-full bg-brand-gradient" />
              <div className="absolute inset-1 rounded-full bg-background" />
              <div className="absolute inset-2 rounded-full bg-brand-gradient" />
            </div>
            <span className="text-base font-semibold tracking-tight">ORBIS</span>
          </a>
          <nav className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-ink-muted transition-colors hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <a
            href="#pricing"
            className="rounded-full bg-brand-gradient px-4 py-2 text-sm font-medium text-brand-foreground shadow-glow transition-transform hover:scale-[1.03]"
          >
            Get started
          </a>
        </div>
      </div>
    </header>
  );
}
