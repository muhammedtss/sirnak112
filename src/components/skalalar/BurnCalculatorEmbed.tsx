"use client";

import { useState, useMemo } from "react";
import { Droplet } from "lucide-react";

type AgeGroup = "0" | "1" | "5" | "10" | "15" | "Erişkin";
const AGE_OPTIONS: AgeGroup[] = ["0", "1", "5", "10", "15", "Erişkin"];

const SECTIONS = [
  {
    title: "Baş, Boyun ve Gövde",
    parts: [
      { id: "bas", label: "Baş", hasFront: true, hasBack: true, getPercent: (a: AgeGroup) => ({ "0": 9.5, "1": 8.5, "5": 6.5, "10": 5.5, "15": 4.5, "Erişkin": 3.5 })[a] },
      { id: "boyun", label: "Boyun", hasFront: true, hasBack: true, getPercent: () => 1 },
      { id: "govde", label: "Gövde / Sırt", hasFront: true, hasBack: true, getPercent: () => 13 },
      { id: "genital", label: "Genital", hasFront: true, hasBack: false, getPercent: () => 1 },
      { id: "sag_kalca", label: "Sağ Kalça", hasFront: false, hasBack: true, getPercent: () => 2.5 },
      { id: "sol_kalca", label: "Sol Kalça", hasFront: false, hasBack: true, getPercent: () => 2.5 },
    ]
  },
  {
    title: "Kollar",
    parts: [
      { id: "sag_ust_kol", label: "Sağ Üst Kol", hasFront: true, hasBack: true, getPercent: () => 2 },
      { id: "sag_alt_kol", label: "Sağ Alt Kol", hasFront: true, hasBack: true, getPercent: () => 1.5 },
      { id: "sag_el", label: "Sağ El", hasFront: true, hasBack: true, getPercent: () => 1.25 },
      { id: "sol_ust_kol", label: "Sol Üst Kol", hasFront: true, hasBack: true, getPercent: () => 2 },
      { id: "sol_alt_kol", label: "Sol Alt Kol", hasFront: true, hasBack: true, getPercent: () => 1.5 },
      { id: "sol_el", label: "Sol El", hasFront: true, hasBack: true, getPercent: () => 1.25 },
    ]
  },
  {
    title: "Bacaklar",
    parts: [
      { id: "sag_uyluk", label: "Sağ Uyluk", hasFront: true, hasBack: true, getPercent: (a: AgeGroup) => ({ "0": 2.75, "1": 3.25, "5": 4.0, "10": 4.25, "15": 4.5, "Erişkin": 4.75 })[a] },
      { id: "sag_bacak", label: "Sağ Bacak (Alt)", hasFront: true, hasBack: true, getPercent: (a: AgeGroup) => ({ "0": 2.5, "1": 2.5, "5": 2.75, "10": 3.0, "15": 3.25, "Erişkin": 3.5 })[a] },
      { id: "sag_ayak", label: "Sağ Ayak", hasFront: true, hasBack: true, getPercent: () => 1.75 },
      { id: "sol_uyluk", label: "Sol Uyluk", hasFront: true, hasBack: true, getPercent: (a: AgeGroup) => ({ "0": 2.75, "1": 3.25, "5": 4.0, "10": 4.25, "15": 4.5, "Erişkin": 4.75 })[a] },
      { id: "sol_bacak", label: "Sol Bacak (Alt)", hasFront: true, hasBack: true, getPercent: (a: AgeGroup) => ({ "0": 2.5, "1": 2.5, "5": 2.75, "10": 3.0, "15": 3.25, "Erişkin": 3.5 })[a] },
      { id: "sol_ayak", label: "Sol Ayak", hasFront: true, hasBack: true, getPercent: () => 1.75 },
    ]
  }
];

export default function BurnCalculatorEmbed() {
  const [kilo, setKilo] = useState("");
  const [ageGroup, setAgeGroup] = useState<AgeGroup>("Erişkin");
  const [selectedParts, setSelectedParts] = useState<Set<string>>(new Set());
  const [isZoomed, setIsZoomed] = useState(false);

  const togglePart = (id: string, side: "on" | "arka") => {
    const key = `${id}_${side}`;
    setSelectedParts(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const tbsa = useMemo(() => {
    let total = 0;
    for (const section of SECTIONS) {
      for (const part of section.parts) {
        if (selectedParts.has(`${part.id}_on`)) total += part.getPercent(ageGroup);
        if (selectedParts.has(`${part.id}_arka`)) total += part.getPercent(ageGroup);
      }
    }
    return total;
  }, [selectedParts, ageGroup]);

  const k = parseFloat(kilo);
  const valid = k > 0 && k <= 300 && tbsa > 0;

  const toplam = valid ? 4 * k * tbsa : null;
  const ilk8 = toplam ? toplam / 2 : null;
  const kalan16 = toplam ? toplam / 2 : null;
  const saatlik8 = ilk8 ? ilk8 / 8 : null;
  const saatlik16 = kalan16 ? kalan16 / 16 : null;

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-300">
      {/* Referans Görseli */}
      <div className="glass-card rounded-2xl overflow-hidden border border-white/10 p-2 flex flex-col items-center justify-center">
        <p className="text-xs font-bold text-subtle uppercase tracking-widest mb-2 mt-2">Referans Yanık Şeması</p>
        <div 
          className="w-full bg-black/20 rounded-xl flex items-center justify-center relative overflow-hidden cursor-zoom-in group" 
          style={{ minHeight: '300px' }}
          onClick={() => setIsZoomed(true)}
        >
          <img src="/burn-reference.svg" alt="Lund Browder Referans" className="absolute inset-0 w-full h-full object-contain p-2 svg-invert-in-dark transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 bg-black/60 text-white text-xs font-bold px-4 py-2 rounded-full backdrop-blur-md transition-opacity">
              Büyütmek için tıkla
            </span>
          </div>
        </div>
      </div>

      {/* Lightbox (Tam Ekran) */}
      {isZoomed && (
        <div 
          className="fixed inset-0 z-[100] backdrop-blur-md flex items-center justify-center p-2 sm:p-6 cursor-zoom-out animate-in fade-in zoom-in-95 duration-200"
          style={{ backgroundColor: 'var(--bg)' }}
          onClick={() => setIsZoomed(false)}
        >
          <div className="relative w-full h-full max-w-5xl flex items-center justify-center">
            <img src="/burn-reference.svg" alt="Lund Browder Referans" className="w-full h-full object-contain svg-invert-in-dark" />
          </div>
          <div 
            className="absolute top-6 right-6 px-4 py-2 rounded-full text-sm font-bold border transition-all shadow-lg"
            style={{ backgroundColor: 'var(--glass-bg-hover)', borderColor: 'var(--glass-border)', color: 'var(--fg)' }}
          >
            Kapat
          </div>
        </div>
      )}

      {/* 1. Adım: Yaş ve Kilo */}
      <div className="glass-card rounded-2xl shadow-sm">
        <div className="px-4 py-3 border-b border-white/10 bg-teal-500/5">
          <p className="text-xs font-bold text-teal-400 uppercase tracking-widest">1. Adım · Yaş & Kilo</p>
        </div>
        <div className="p-4 flex flex-col gap-5">
          {/* Yaş Seçimi */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted uppercase tracking-wide">Yaş Grubu (Lund-Browder için)</label>
            <div className="flex flex-wrap gap-2">
              {AGE_OPTIONS.map((age) => (
                <button
                  key={age}
                  onClick={() => setAgeGroup(age)}
                  className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-bold transition-all active:scale-95 ${
                    ageGroup === age
                      ? "bg-teal-500/20 text-teal-300 border border-teal-500/50 shadow-[0_0_15px_rgba(20,184,166,0.3)] ring-2 ring-teal-500/20"
                      : "bg-black/20 text-muted border border-white/5 hover:bg-white/5"
                  }`}
                >
                  {age} {age !== "Erişkin" && "Yaş"}
                </button>
              ))}
            </div>
          </div>

          {/* Kilo Girişi */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted uppercase tracking-wide">Hasta Kilosu (kg)</label>
            <input
              type="number"
              min="1"
              max="300"
              value={kilo}
              onChange={(e) => setKilo(e.target.value)}
              placeholder="Örn: 70"
              className="w-full text-xl font-black text-white bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all placeholder-white/20"
            />
          </div>
        </div>
      </div>

      {/* 2. Adım: Yanık Bölgeleri */}
      <div className="glass-card rounded-2xl shadow-sm">
        <div className="px-4 py-3 border-b border-white/10 bg-orange-500/5 flex justify-between items-center">
          <p className="text-xs font-bold text-orange-400 uppercase tracking-widest">2. Adım · Yanık Bölgeleri</p>
          <span className="text-orange-300 font-bold bg-orange-500/20 px-2 py-0.5 rounded text-sm">
            Toplam: %{tbsa.toFixed(1)}
          </span>
        </div>
        <div className="p-4 flex flex-col gap-6">
          <p className="text-xs text-subtle leading-relaxed">
            İlgili vücut bölgesindeki <strong className="text-orange-300">Ön (Ö)</strong> veya <strong className="text-orange-300">Arka (A)</strong> yüzey düğmelerine tıklayarak yanık alanlarını seçin. Yüzdeler yaşa göre otomatik hesaplanır.
          </p>

          {SECTIONS.map((section, idx) => (
            <div key={idx} className="space-y-3">
              <h3 className="text-sm font-bold text-white/80 border-b border-white/10 pb-1">{section.title}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {section.parts.map(part => {
                  const percent = part.getPercent(ageGroup);
                  const isFrontSelected = selectedParts.has(`${part.id}_on`);
                  const isBackSelected = selectedParts.has(`${part.id}_arka`);
                  
                  return (
                    <div key={part.id} className="flex flex-col items-center justify-between bg-black/5 dark:bg-black/20 border border-black/5 dark:border-white/5 rounded-xl p-2 gap-2">
                      <div className="flex flex-col items-center min-w-0 text-center">
                        <span className="text-xs font-bold text-slate-800 dark:text-white leading-tight">{part.label}</span>
                        <span className="text-[10px] text-teal-600 dark:text-teal-400/80 font-mono font-bold mt-0.5">(% {percent})</span>
                      </div>
                      <div className="flex gap-1.5 w-full">
                        {part.hasFront && (
                          <button
                            onClick={() => togglePart(part.id, "on")}
                            className={`flex-1 h-8 rounded-md font-bold text-xs transition-all flex items-center justify-center ${
                              isFrontSelected
                                ? "bg-orange-500/20 dark:bg-orange-500/30 text-orange-600 dark:text-orange-200 border border-orange-500/40 shadow-sm"
                                : "bg-white/60 dark:bg-white/5 text-slate-500 dark:text-white/50 border border-transparent"
                            }`}
                          >
                            Ön
                          </button>
                        )}
                        {part.hasBack && (
                          <button
                            onClick={() => togglePart(part.id, "arka")}
                            className={`flex-1 h-8 rounded-md font-bold text-xs transition-all flex items-center justify-center ${
                              isBackSelected
                                ? "bg-orange-500/20 dark:bg-orange-500/30 text-orange-600 dark:text-orange-200 border border-orange-500/40 shadow-sm"
                                : "bg-white/60 dark:bg-white/5 text-slate-500 dark:text-white/50 border border-transparent"
                            }`}
                          >
                            Arka
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          
          {tbsa > 0 && (
            <button onClick={() => setSelectedParts(new Set())} className="w-full py-2 bg-red-500/10 text-red-400 rounded-lg text-sm font-bold border border-red-500/20 active:scale-95 transition-all mt-2">
              Seçimleri Temizle
            </button>
          )}
        </div>
      </div>

      {/* 3. Adım: Parkland Sonucu */}
      {valid && toplam !== null && (
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-teal-600 rounded-2xl p-5 text-center text-white shadow-[0_0_30px_rgba(13,148,136,0.3)] border border-teal-400">
            <div className="flex items-center justify-center gap-2 mb-2 opacity-90">
              <Droplet className="w-4 h-4" />
              <p className="text-xs font-bold uppercase tracking-wider">24 Saatlik Toplam Sıvı (Ringer Laktat)</p>
            </div>
            <p className="text-5xl font-black tracking-tight">{toplam.toFixed(0)} <span className="text-xl opacity-80">mL</span></p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="glass-card rounded-2xl border-2 border-orange-400/50 p-4 text-center bg-orange-500/10">
              <p className="text-[11px] font-bold text-orange-300 uppercase tracking-wide mb-1">İlk 8 Saat</p>
              <p className="text-3xl font-black text-orange-400">{ilk8!.toFixed(0)}</p>
              <p className="text-xs text-orange-300/80 font-bold mb-3">mL</p>
              <div className="pt-3 border-t border-orange-500/20">
                <p className="text-[10px] text-orange-300/60 uppercase">Saatlik Hız</p>
                <p className="text-lg font-black text-white">{saatlik8!.toFixed(0)} <span className="text-xs font-normal">mL/s</span></p>
              </div>
            </div>
            <div className="glass-card rounded-2xl border-2 border-teal-400/50 p-4 text-center bg-teal-500/10">
              <p className="text-[11px] font-bold text-teal-300 uppercase tracking-wide mb-1">Kalan 16 Saat</p>
              <p className="text-3xl font-black text-teal-400">{kalan16!.toFixed(0)}</p>
              <p className="text-xs text-teal-300/80 font-bold mb-3">mL</p>
              <div className="pt-3 border-t border-teal-500/20">
                <p className="text-[10px] text-teal-300/60 uppercase">Saatlik Hız</p>
                <p className="text-lg font-black text-white">{saatlik16!.toFixed(0)} <span className="text-xs font-normal">mL/s</span></p>
              </div>
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-xs text-amber-200/90 leading-relaxed shadow-inner">
            <span className="font-bold text-amber-400 block mb-1">⚠️ Klinik Not:</span> 
            Sıvı resüsitasyonu yanığın başladığı saatten itibaren hesaplanır. Formül bir rehberdir, hastanın idrar çıkışı (0.5–1 mL/kg/saat) ve klinik yanıtına göre titre edilmelidir.
          </div>
        </div>
      )}

    </div>
  );
}
