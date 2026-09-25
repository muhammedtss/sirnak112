"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Activity,
  BookOpen,
  Pill,
  Package,
  FileText,
  FileSearch,
  Cpu,
  ChevronRight,
  Zap,
} from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 18, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 340, damping: 28 },
  },
};

const quickLinks = [
  { href: "/algoritmalar",         icon: Cpu,        label: "Algoritmalar",       accent: "#6366F1" },
  { href: "/vaka-protokolleri",    icon: BookOpen,   label: "Protokoller",        accent: "#8B5CF6" },
  { href: "/skalalar",             icon: Activity,   label: "Skalalar",           accent: "#34D399" },
  { href: "/ilac-doz",             icon: Pill,       label: "İlaç Dozu",          accent: "#F59E0B" },
  { href: "/envanter",             icon: Package,    label: "Envanter",           accent: "#EF4444" },
  { href: "/icd10",                icon: FileSearch, label: "ICD-10",             accent: "#06B6D4" },
  { href: "/evraklar",             icon: FileText,   label: "Evraklar",           accent: "#EC4899" },
  { href: "/algoritmalar-gorsel",  icon: Zap,        label: "Görsel Algoritmalar",accent: "#F97316" },
];

export default function HomePage() {
  return (
    <PageShell>
      {/* ── Ambient header (no back btn) ── */}
      <header className="sticky top-0 z-20 px-5 pt-5 pb-4 flex items-center justify-between"
        style={{ background: "linear-gradient(to bottom, var(--bg) 60%, transparent)" }}
      >
        <div>
        <p className="text-[11px] font-semibold tracking-widest uppercase text-muted mb-0.5">
          Şırnak 112 Acil Sağlık
        </p>
        <h1 className="text-2xl font-extrabold leading-tight tracking-tight">
          Acil Protokol{" "}
          <span className="text-glow" style={{ color: "var(--primary-light)" }}>
            Sistemi
          </span>
        </h1>
        </div>
        <ThemeToggle />
      </header>

      {/* ── Hero banner ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mx-4 mt-2 mb-5 p-5 glass-card overflow-hidden relative"
        style={{ borderColor: "rgba(99,102,241,0.25)" }}
      >
        {/* Glow orb inside card */}
        <div
          className="absolute -top-6 -right-6 w-36 h-36 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)",
            filter: "blur(20px)",
          }}
        />
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold mb-3 border"
          style={{ background: "rgba(239,68,68,0.15)", color: "#FCA5A5", borderColor: "rgba(239,68,68,0.25)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
          Canlı — Güncel Protokoller
        </span>
        <p className="text-base font-bold leading-snug max-w-[72%] relative z-10">
          Kritik vakalarda hızlı, doğru karar için tasarlanmış acil başvuru sistemi.
        </p>
        <Link
          href="/algoritmalar"
          className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold relative z-10"
          style={{ color: "var(--primary-light)" }}
        >
          Algoritmalar <ChevronRight style={{ width: 16, height: 16 }} />
        </Link>
      </motion.div>

      {/* ── Bento Grid ── */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="px-4 grid grid-cols-2 gap-3"
      >
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <motion.div key={link.href} variants={item}>
              <Link
                href={link.href}
                className="glass-card glass-hover flex flex-col p-4 gap-3 group"
              >
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center"
                  style={{
                    background: `${link.accent}22`,
                    border: `1px solid ${link.accent}33`,
                  }}
                >
                  <Icon
                    style={{ width: 20, height: 20, color: link.accent }}
                    strokeWidth={2}
                  />
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-sm font-semibold leading-tight pr-2">{link.label}</span>
                  <ChevronRight
                    className="shrink-0 opacity-30 group-hover:opacity-70 transition-opacity"
                    style={{ width: 14, height: 14 }}
                  />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </PageShell>
  );
}
