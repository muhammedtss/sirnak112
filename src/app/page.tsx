"use client";

import Link from "next/link";
import {
  Activity,
  BookOpen,
  Pill,
  Package,
  FileText,
  FileSearch,
  ChevronRight,
  Search,
  Zap,
  HeartPulse,
} from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import GlobalSearchModal, { openGlobalSearch } from "@/components/search/GlobalSearchModal";
import { OfflineButton } from "@/components/pwa/OfflineButton";
import { useScrolled } from "@/components/layout/useScrolled";

const quickLinks = [
  { href: "/algoritmalar-gorsel",  icon: Zap,        label: "Algoritmalar",      desc: "Akış şemaları", accent: "#F97316" },
  { href: "/vaka-protokolleri",    icon: BookOpen,   label: "Vaka Protokolleri", desc: "Adım adım rehber", accent: "#8B5CF6" },
  { href: "/skalalar",             icon: Activity,   label: "Skalalar",          desc: "Hesaplayıcılar", accent: "#34D399" },
  { href: "/ilac-doz",             icon: Pill,       label: "İlaç Dozu",         desc: "İnfüzyon hesabı", accent: "#F59E0B" },
  { href: "/envanter",             icon: Package,    label: "Envanter",          desc: "Malzeme kontrolü", accent: "#EF4444" },
  { href: "/evraklar",             icon: FileText,   label: "Evraklar",          desc: "Form ve tutanaklar", accent: "#EC4899" },
  { href: "/icd10",                icon: FileSearch, label: "ICD-10",            desc: "Tanı kodları", accent: "#06B6D4" },
  { href: "/ekg-egitim",           icon: HeartPulse, label: "EKG Eğitimi",       desc: "Eğitim, atlas ve vaka sınavı", accent: "#10B981" },
];

export default function HomePage() {
  const scrolled = useScrolled();

  return (
    <PageShell>
      {/* ── Ambient header (no back btn) ── */}
      <header
        data-scrolled={scrolled}
        className={`app-header page-gutter sticky top-0 z-20 flex items-center justify-between gap-3 ${scrolled ? "py-2.5" : "pt-5 pb-4"}`}
      >
        <div className="min-w-0">
          {!scrolled && (
            <p className="text-[11px] font-semibold tracking-widest uppercase text-muted mb-0.5">
              Şırnak 112 Acil Sağlık
            </p>
          )}
          <h1 className={`font-extrabold leading-tight tracking-tight truncate ${scrolled ? "text-lg" : "text-2xl"}`}>
            Acil Protokol{" "}
            <span className="text-glow" style={{ color: "var(--accent-text)" }}>
              Sistemi
            </span>
          </h1>
          {!scrolled && (
            <p className="text-[11px] font-medium text-subtle mt-0.5">Developed by Kadir Taş</p>
          )}
        </div>
        <div className="flex items-center gap-0.5 shrink-0">
          <GlobalSearchModal />
          <OfflineButton />
          <ThemeToggle />
        </div>
      </header>

      {/* ── Hero banner ── */}
      <section className="hero-card mx-4 sm:mx-auto sm:w-[calc(100%-2rem)] max-w-5xl mt-2 mb-5 p-5 glass-card overflow-hidden relative" aria-label="Hızlı erişim">
        {/* Teal ışıma */}
        <div
          aria-hidden="true"
          className="absolute -top-8 -right-8 w-40 h-40 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, color-mix(in srgb, var(--primary-light) 26%, transparent) 0%, transparent 70%)",
            filter: "blur(20px)",
          }}
        />
        <span className="live-badge inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold mb-3 relative">
          <span className="relative flex w-1.5 h-1.5" aria-hidden="true">
            <span className="absolute inset-0 rounded-full bg-teal-400 opacity-60 animate-ping" />
            <span className="relative w-1.5 h-1.5 rounded-full bg-teal-400" />
          </span>
          Canlı — Güncel Protokoller
        </span>
        <p className="text-base font-bold leading-snug max-w-[34ch] relative">
          Kritik vakalarda hızlı, doğru karar için tasarlanmış acil başvuru sistemi.
        </p>
        <button
          type="button"
          onClick={openGlobalSearch}
          className="hero-cta inline-flex items-center gap-2 mt-4 text-sm font-semibold relative"
        >
          <Search style={{ width: 16, height: 16 }} strokeWidth={2.4} />
          Protokol, ilaç veya skala ara
          <ChevronRight style={{ width: 16, height: 16 }} className="-mr-1 opacity-70" />
        </button>
      </section>

      {/* ── Modül ızgarası: mobilde 2, geniş ekranda 4 sütun; 8 modül = yetim kart yok ── */}
      <nav aria-label="Modüller" className="px-4 pb-6 w-full max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="module-card glass-card flex flex-col p-4 gap-3 group relative overflow-hidden"
              style={{ "--accent": link.accent } as React.CSSProperties}
            >
              {/* Filigran ikon */}
              <Icon
                aria-hidden="true"
                className="module-watermark absolute -right-3 -bottom-3 pointer-events-none"
                style={{ width: 76, height: 76, color: link.accent }}
                strokeWidth={1.5}
              />

              <div className="flex items-center justify-between relative">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: `${link.accent}22`,
                    border: `1px solid ${link.accent}33`,
                  }}
                >
                  <Icon style={{ width: 20, height: 20, color: link.accent }} strokeWidth={2} />
                </div>
                <ChevronRight aria-hidden="true" className="module-chevron shrink-0" style={{ width: 16, height: 16 }} />
              </div>
              <div className="flex flex-col relative mt-1">
                <span className="text-sm font-semibold leading-tight">{link.label}</span>
                <span className="text-xs text-muted font-medium mt-1">{link.desc}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </PageShell>
  );
}
