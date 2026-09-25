"use client";

import { motion } from "framer-motion";
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

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const card = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 320, damping: 28 } },
};

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

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-3"
        >
          {groups.map((g) => {
            const Icon = g.icon;
            return (
              <motion.div key={g.href} variants={card}>
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
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </PageShell>
  );
}
