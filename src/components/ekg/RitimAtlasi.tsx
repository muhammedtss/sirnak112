"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import RitimKarti from "./RitimKarti";
import { RITIM_LISTESI, type RitimKategori, type RitimId } from "@/lib/ekg/rhythms";

const GRUPLAR: { kategori: RitimKategori; baslik: string; renk: string }[] = [
  { kategori: "normal", baslik: "Normal", renk: "#34D399" },
  { kategori: "hizli", baslik: "Hızlı ritimler (taşikardiler)", renk: "#F97316" },
  { kategori: "yavas", baslik: "Yavaş ritimler (bradikardiler)", renk: "#38BDF8" },
  { kategori: "arrest", baslik: "Arrest ritimleri", renk: "#F87171" },
];

/** Tüm ritimlerin hızlı başvuru listesi (açılır kartlar). */
export default function RitimAtlasi() {
  const [acik, setAcik] = useState<RitimId | null>(null);

  return (
    <div className="space-y-7">
      <p className="text-xs text-muted leading-relaxed">
        Her ritmin değerlendirme kriterleri, kaynak eğitim sunumundaki gerçek EKG&apos;si ve istediğiniz kadar yenileyebileceğiniz
        örnek şeritler. Şeritler standart kağıt ölçeğindedir (25 mm/sn · 10 mm/mV); kaliper ile ölçüm yapabilirsiniz.
      </p>
      {GRUPLAR.map(g => (
        <section key={g.kategori} className="space-y-2">
          <h2 className="text-[11px] font-bold uppercase tracking-widest" style={{ color: g.renk }}>{g.baslik}</h2>
          <div className="space-y-2">
            {RITIM_LISTESI.filter(r => r.kategori === g.kategori).map(r => {
              const open = acik === r.id;
              return (
                <div key={r.id} id={r.id} className="glass-card overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setAcik(open ? null : r.id)}
                    aria-expanded={open}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left"
                  >
                    <span className="text-sm font-bold">{r.kisaAd}</span>
                    <ChevronDown className={`w-4 h-4 shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`} />
                  </button>
                  {open && (
                    <div className="px-4 pb-4 animate-in fade-in">
                      <RitimKarti ritimId={r.id} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
