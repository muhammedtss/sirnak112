"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronDown, Activity } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { AppHeader } from "@/components/layout/AppHeader";
import BurnCalculatorEmbed from "@/components/skalalar/BurnCalculatorEmbed";

interface Skala {
  id: string;
  name: string;
  icon: string;
  accent: string;
  glow: string;
  border: string;
  description: string;
  tags: string[];
  href: string;
}

const yetiskinSkalalar: Skala[] = [

  {
    id: "glasgow-yetiskin", name: "Glasgow Koma Skalası", icon: "🧠",
    accent: "#818CF8", glow: "rgba(129,140,248,0.15)", border: "rgba(129,140,248,0.25)",
    description: "Bilinç düzeyini göz açma (E), sözel yanıt (V) ve motor yanıt (M) skorlarıyla değerlendiren standart nörolojik skala.",
    tags: ["Nöroloji", "Bilinç", "3–15 puan"],
    href: "/skalalar/glasgow-yetiskin",
  },
  {
    id: "avpu", name: "AVPU Skalası", icon: "📊",
    accent: "#FBBF24", glow: "rgba(251,191,36,0.15)", border: "rgba(251,191,36,0.25)",
    description: "Saha triajı için 4 basamaklı hızlı bilinç değerlendirmesi: Alert, Voice, Pain, Unresponsive.",
    tags: ["Triaj", "Bilinç", "Hızlı"],
    href: "/skalalar/avpu",
  },
  {
    id: "kas-gucu", name: "Kas Gücü Skalası", icon: "💪",
    accent: "#F87171", glow: "rgba(248,113,113,0.15)", border: "rgba(248,113,113,0.25)",
    description: "MRC kas gücü skalası ile iskelet kası gücünü 0–5 arası puanlar.",
    tags: ["Nöroloji", "Motor", "0–5 puan"],
    href: "/skalalar/kas-gucu",
  },
  {
    id: "dispne", name: "Dispne Skalası", icon: "🫁",
    accent: "#34D399", glow: "rgba(52,211,153,0.15)", border: "rgba(52,211,153,0.25)",
    description: "mMRC skalası ile günlük aktivitelerdeki nefes darlığı şiddetini değerlendirir.",
    tags: ["Pulmoner", "Nefes", "0–4 puan"],
    href: "/skalalar/dispne",
  },
  {
    id: "parkland", name: "Parkland Formülü", icon: "💧",
    accent: "#38BDF8", glow: "rgba(56,189,248,0.15)", border: "rgba(56,189,248,0.25)",
    description: "Yanık resüsitasyonunda ilk 24 saatte verilecek sıvı: 4 mL × kg × TBSA%.",
    tags: ["Yanık", "Sıvı", "Ringer"],
    href: "/skalalar/parkland",
  },
  {
    id: "ventilator", name: "Ventilatör Hesaplama", icon: "🌬️",
    accent: "#C084FC", glow: "rgba(192,132,252,0.15)", border: "rgba(192,132,252,0.25)",
    description: "Koruyucu akciğer ventilasyonu için TV, PEEP, FiO₂, I:E oranı ve frekans hesaplar.",
    tags: ["Ventilasyon", "ARDS", "Başlangıç"],
    href: "/skalalar/ventilator",
  },
  {
    id: "geri-dondurulebilir", name: "Arrest — 5H-5T", icon: "🔄",
    accent: "#FB923C", glow: "rgba(251,146,60,0.15)", border: "rgba(251,146,60,0.25)",
    description: "KPR sırasında aranması gereken geri döndürülebilir nedenler (5H-5T): Hipoksi, Hipovolemi, Hipo/Hiper termi, Hipo/Hiper kalemi, Hidrojen iyonu Asidoz, Tansiyon pnömotoraks, Tamponad Kardiyak, Tromboz Pulmoner, Tromboz Kardiyak, Toksinler.",
    tags: ["KPR", "5H5T", "Arrest"],
    href: "/skalalar/geri-dondurulebilir",
  },
  {
    id: "yanik", name: "İnteraktif Yanık Hesaplama", icon: "🔥",
    accent: "#F97316", glow: "rgba(249,115,22,0.15)", border: "rgba(249,115,22,0.25)",
    description: "3D görsel üzerinden yanık yüzdesi hesaplama ve sıvı replasmanı.",
    tags: ["Yanık", "Sıvı", "TBSA"],
    href: "/skalalar/yanik",
  },
];

const cocukSkalalar: Skala[] = [
  {
    id: "glasgow-pediatri", name: "Pediatri Glasgow", icon: "😊",
    accent: "#34D399", glow: "rgba(52,211,153,0.15)", border: "rgba(52,211,153,0.25)",
    description: "2 yaş üstü çocuklar için uyarlanmış Glasgow Koma Skalası.",
    tags: ["Pediatri", "Bilinç", "2–15 Yaş"],
    href: "/skalalar/glasgow-pediatri",
  },
  {
    id: "glasgow-bebek", name: "Bebek Glasgow", icon: "👶",
    accent: "#C084FC", glow: "rgba(192,132,252,0.15)", border: "rgba(192,132,252,0.25)",
    description: "2 yaş altı bebekler için GKS — motor ve sözel yanıtlar infant normlarına göre.",
    tags: ["İnfant", "0–2 Yaş", "GKS"],
    href: "/skalalar/glasgow-bebek",
  },
  {
    id: "apgar", name: "APGAR Skorlaması", icon: "💗",
    accent: "#F472B6", glow: "rgba(244,114,182,0.15)", border: "rgba(244,114,182,0.25)",
    description: "Yenidoğanın 1. ve 5. dakika genel durumu: Görünüm, Nabız, Grimase, Aktivite, Solunum.",
    tags: ["Yenidoğan", "Doğum", "0–10"],
    href: "/skalalar/apgar",
  },
  {
    id: "pat", name: "Çocuk Değerlendirme Üçgeni (PAT)", icon: "🔺",
    accent: "#818CF8", glow: "rgba(129,140,248,0.15)", border: "rgba(129,140,248,0.25)",
    description: "Görünüm (A), Solunum Eforu (B) ve Dolaşım (C) üçgeniyle aciliyet belirler.",
    tags: ["Pediatri", "Triaj", "PAT"],
    href: "/skalalar/pat",
  },
  {
    id: "best-guess", name: "Best Guess Formülü", icon: "⚖️",
    accent: "#F59E0B", glow: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.25)",
    description: "Çocuklarda vücut ağırlığı tahmini (Best Guess). <12 ay, 1-4 yaş ve 5-14 yaş için.",
    tags: ["Pediatri", "Kilo", "Best Guess"],
    href: "/skalalar/best-guess",
  },

  {
    id: "ett", name: "ETT — Endotrakeal Entübasyon", icon: "🫀",
    accent: "#38BDF8", glow: "rgba(56,189,248,0.15)", border: "rgba(56,189,248,0.25)",
    description: "Yaş ve kiloya göre pediatrik ETT boyutu, derinlik, blade no ve suction hesaplama.",
    tags: ["Hava Yolu", "Entübasyon", "Pediatri"],
    href: "/skalalar/ett",
  },
  {
    id: "lma", name: "LMA — Laringeal Maske", icon: "😮",
    accent: "#34D399", glow: "rgba(52,211,153,0.15)", border: "rgba(52,211,153,0.25)",
    description: "Kiloya göre LMA numara seçimi (No 1–5), kaf hacmi ve uyumlu ETT boyutu.",
    tags: ["Hava Yolu", "LMA", "Tüm Yaşlar"],
    href: "/skalalar/lma",
  },
];

function GlassAccordionItem({ skala, isOpen, onToggle }: {
  skala: Skala; isOpen: boolean; onToggle: () => void;
}) {
  return (
    <div
      className="glass-card overflow-hidden"
      style={{ borderColor: isOpen ? skala.border : "var(--glass-border)" }}
    >
      <button
        id={`skala-${skala.id}`}
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
      >
        <span
          className="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl text-lg"
          style={{ background: skala.glow, border: `1px solid ${skala.border}` }}
        >
          {skala.icon}
        </span>
        <span className="flex-1 text-sm font-semibold leading-tight">{skala.name}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="shrink-0 text-subtle" style={{ width: 16, height: 16 }} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-2 border-t" style={{ borderColor: "var(--glass-border)" }}>
              <p className="text-sm leading-relaxed text-muted mb-3">{skala.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {skala.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border"
                    style={{ background: skala.glow, color: skala.accent, borderColor: skala.border }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Link
                href={skala.href}
                id={`skala-link-${skala.id}`}
                className="inline-flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl border transition-all active:scale-95"
                style={{
                  background: skala.glow,
                  color: skala.accent,
                  borderColor: skala.border,
                }}
              >
                Hesaplamayı Aç
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SkalaSection({ title, icon, skalalar, openId, onToggle }: {
  title: string; icon: string; skalalar: Skala[];
  openId: string | null; onToggle: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 px-1 mb-1">
        <span className="text-xl">{icon}</span>
        <h2 className="text-base font-bold">{title}</h2>
        <span
          className="ml-auto text-[11px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: "var(--glass-bg)", color: "var(--fg-muted)", border: "1px solid var(--glass-border)" }}
        >
          {skalalar.length}
        </span>
      </div>
      {skalalar.map((s) => (
        <GlassAccordionItem
          key={s.id}
          skala={s}
          isOpen={openId === s.id}
          onToggle={() => onToggle(s.id)}
        />
      ))}
    </div>
  );
}

export default function SkalalarPage() {
  const [openYetiskin, setOpenYetiskin] = useState<string | null>(null);
  const [openCocuk, setOpenCocuk] = useState<string | null>(null);

  return (
    <PageShell>
      <AppHeader
        title="Skalalar"
        icon={<Activity style={{ width: 16, height: 16 }} />}
        back="/"
      />

      <div className="px-4 pt-5 pb-4 max-w-3xl mx-auto w-full">
        {/* Banner */}
        <div
          className="glass-card p-4 mb-6 relative overflow-hidden"
          style={{ borderColor: "rgba(99,102,241,0.25)" }}
        >
          <div
            className="absolute -right-4 -top-4 w-24 h-24 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)", filter: "blur(16px)" }}
          />
          <p className="text-sm font-bold relative z-10">Tıbbi Skalalar &amp; Hesaplayıcılar</p>
          <p className="text-subtle text-xs mt-1 relative z-10">
            Skala kartına dokun, aç ve hesaplama ekranına geç.
          </p>
        </div>

        {/* 2-col grid always */}
        <div className="grid grid-cols-2 gap-3 sm:gap-6">
          <SkalaSection
            title="Yetişkin Skalaları"
            icon="👤"
            skalalar={yetiskinSkalalar}
            openId={openYetiskin}
            onToggle={(id) => setOpenYetiskin((p) => (p === id ? null : id))}
          />
          <SkalaSection
            title="Çocuk Skalaları"
            icon="🧒"
            skalalar={cocukSkalalar}
            openId={openCocuk}
            onToggle={(id) => setOpenCocuk((p) => (p === id ? null : id))}
          />

        </div>
      </div>
    </PageShell>
  );
}
