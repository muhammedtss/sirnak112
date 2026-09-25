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
  HeartPulse,
} from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import GlobalSearchModal from "@/components/search/GlobalSearchModal";

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
    transition: { type: "spring" as const, stiffness: 340, damping: 28 },
  },
};

const quickLinks = [
  { href: "/algoritmalar-gorsel",  icon: Zap,        label: "Algoritmalar",      desc: "Akış şemaları", accent: "#F97316" },
  { href: "/vaka-protokolleri",    icon: BookOpen,   label: "Vaka Protokolleri", desc: "Adım adım rehber", accent: "#8B5CF6" },
  { href: "/skalalar",             icon: Activity,   label: "Skalalar",          desc: "Hesaplayıcılar", accent: "#34D399" },
  { href: "/ilac-doz",             icon: Pill,       label: "İlaç Dozu",         desc: "İnfüzyon hesabı", accent: "#F59E0B" },
  { href: "/envanter",             icon: Package,    label: "Envanter",          desc: "Malzeme kontrolü", accent: "#EF4444" },
  { href: "/evraklar",             icon: FileText,   label: "Evraklar",          desc: "Form ve tutanaklar", accent: "#EC4899" },
  { href: "/icd10",                icon: FileSearch, label: "ICD-10",            desc: "Tanı kodları", accent: "#06B6D4" },
  { href: "/ekg-egitim",           icon: HeartPulse, label: "EKG Eğitimi",       desc: "İnteraktif modüller", accent: "#10B981" },
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
        <p className="text-[11px] font-medium text-subtle mt-0.5 opacity-80">Developed by Kadir Taş</p>
        </div>
        <div className="flex items-center gap-2">
          <GlobalSearchModal />
          <ThemeToggle />
        </div>
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
          href="/algoritmalar-gorsel"
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
          const isFullRow = link.href === "/icd10" || link.href === "/ekg-egitim";
          return (
            <motion.div key={link.href} variants={item} className={isFullRow ? "col-span-2 flex justify-center" : "w-full"}>
              <Link
                href={link.href}
                className={`glass-card glass-hover flex flex-col p-4 gap-3 group relative overflow-hidden ${isFullRow ? "w-[65%]" : "w-full"}`}
              >
                {/* Background Watermark Icon */}
                <Icon
                  className="absolute -right-4 -bottom-4 opacity-10 transform -rotate-12 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 pointer-events-none"
                  style={{ width: 80, height: 80, color: link.accent }}
                  strokeWidth={1.5}
                />

                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center relative z-10"
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
                <div className="flex items-end justify-between relative z-10 mt-1">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold leading-tight">{link.label}</span>
                    <span className="text-[10px] text-muted font-medium mt-1">{link.desc}</span>
                  </div>
                  <ChevronRight
                    className="shrink-0 opacity-30 group-hover:opacity-70 transition-opacity mb-1"
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
