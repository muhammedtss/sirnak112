"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Ambulance, Navigation, Plane, ChevronRight, Package } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { AppHeader } from "@/components/layout/AppHeader";

const ambulanslar = [
  {
    id: "acil_yardim",
    icon: Ambulance,
    label: "Acil Yardım ve Yoğun Bakım Ambulansı",
    sub: "Tam donanımlı acil müdahale",
    accent: "#EF4444",
    glow: "rgba(239,68,68,0.2)",
    border: "rgba(239,68,68,0.25)",
  },
  {
    id: "hasta_nakil",
    icon: Navigation,
    label: "Hasta Nakil Ambulansı",
    sub: "Nakil ve temel müdahale",
    accent: "#F59E0B",
    glow: "rgba(245,158,11,0.2)",
    border: "rgba(245,158,11,0.25)",
  },
  {
    id: "hava_deniz",
    icon: Plane,
    label: "Hava ve Deniz Ambulansı",
    sub: "Helikopter ve deniz araçları",
    accent: "#38BDF8",
    glow: "rgba(56,189,248,0.2)",
    border: "rgba(56,189,248,0.25)",
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

export default function EnvanterPage() {
  return (
    <PageShell>
      <AppHeader
        title="Ambulans Envanteri"
        icon={<Package style={{ width: 16, height: 16 }} />}
        back="/"
      />

      <div className="px-4 pt-6 pb-4 max-w-xl mx-auto w-full">
        <p className="text-muted text-sm mb-6">Ambulans tipini seçerek envanter listesine ulaşın.</p>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-3"
        >
          {ambulanslar.map((a) => {
            const Icon = a.icon;
            return (
              <motion.div key={a.id} variants={card}>
                <Link
                  href={`/envanter/${a.id}`}
                  className="glass-card glass-hover flex items-center gap-4 p-5"
                  style={{ borderColor: a.border }}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ background: a.glow, border: `1px solid ${a.border}` }}
                  >
                    <Icon style={{ width: 26, height: 26, color: a.accent }} strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-bold leading-tight">{a.label}</p>
                    <p className="text-muted text-sm mt-0.5">{a.sub}</p>
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
