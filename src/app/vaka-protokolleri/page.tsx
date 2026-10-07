"use client";

import Link from "next/link";
import { User, Baby, Heart, ChevronRight, BookOpen } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { AppHeader } from "@/components/layout/AppHeader";

const groups = [
  {
    href: "/vaka-protokolleri/eriskin",
    icon: User,
    label: "Erişkin",
    sub: "18 yaş ve üzeri protokoller",
    accent: "#34D399",
    glow: "rgba(52,211,153,0.2)",
    border: "rgba(52,211,153,0.25)",
  },
  {
    href: "/vaka-protokolleri/cocuk",
    icon: Baby,
    label: "Çocuk",
    sub: "1–18 yaş arası protokoller",
    accent: "#38BDF8",
    glow: "rgba(56,189,248,0.2)",
    border: "rgba(56,189,248,0.25)",
  },
  {
    href: "/vaka-protokolleri/yenidogan",
    icon: Heart,
    label: "Yenidoğan",
    sub: "0–1 aylık protokoller",
    accent: "#F472B6",
    glow: "rgba(244,114,182,0.2)",
    border: "rgba(244,114,182,0.25)",
  },
];


export default function VakaProtokolleriPage() {
  return (
    <PageShell>
      <AppHeader
        title="Vaka Protokolleri"
        icon={<BookOpen style={{ width: 16, height: 16 }} />}
        back="/"
      />

      <div className="px-4 pt-6 pb-4 max-w-xl mx-auto w-full">
        <p className="text-muted text-sm mb-6">
          Yaş grubuna göre vaka bazlı müdahale protokollerine ulaşın.
        </p>

        <div
          className="flex flex-col gap-3"
        >
          {groups.map((g) => {
            const Icon = g.icon;
            return (
              <div key={g.href}>
                <Link
                  href={g.href}
                  className="glass-card glass-hover flex items-center gap-4 p-5"
                  style={{ borderColor: g.border }}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ background: g.glow, border: `1px solid ${g.border}` }}
                  >
                    <Icon style={{ width: 26, height: 26, color: g.accent }} strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-bold">{g.label}</p>
                    <p className="text-muted text-sm">{g.sub}</p>
                  </div>
                  <ChevronRight className="shrink-0 text-subtle" style={{ width: 18, height: 18 }} />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}
