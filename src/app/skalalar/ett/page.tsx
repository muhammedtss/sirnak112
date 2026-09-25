"use client";
import { useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { AppHeader } from "@/components/layout/AppHeader";
import { ArrowLeft } from "lucide-react";

export default function ETTPage() {
  const [yas, setYas] = useState("");
  const [kilo, setKilo] = useState("");

  const y = parseFloat(yas.replace(",", "."));
  const k = parseFloat(kilo.replace(",", "."));

  const validYas = !isNaN(y) && y >= 0 && y <= 18;
  const validKilo = !isNaN(k) && k > 0 && k <= 100;

  // ETT İç Çap (mm)
  // (yaş/4) + 4 kafsız; (yaş/4) + 3.5 kaflı
  const ettkafsız = validYas ? ((y / 4) + 4).toFixed(1) : null;
  const ettkaflı = validYas ? ((y / 4) + 3.5).toFixed(1) : null;

  // Derinlik (cm - ağızdan)
  // (yaş/2) + 12
  const derinlik = validYas ? ((y / 2) + 12).toFixed(1) : null;
  const derinlikKilo = validKilo ? (k / 10 + 12).toFixed(1) : null;

  // Laringoskop blade
  const blade = () => {
    if (!validYas) return null;
    if (y < 1) return "Miller 0–1 (düz)";
    if (y < 3) return "Miller 1 (düz)";
    if (y < 8) return "Miller 2 / Macintosh 2 (kavisli)";
    return "Macintosh 2–3 (kavisli)";
  };

  // Suction kateter
  const suction = ettkafsız ? (parseFloat(ettkafsız) * 2).toFixed(0) : null;

  return (
    <PageShell>
      <AppHeader title="ETT — Endotrakeal Entübasyon" back="/skalalar" icon={<ArrowLeft style={{ width: 16, height: 16 }} />} />

      <main className="flex-1 px-3 sm:px-6 py-4 sm:py-6 w-full max-w-xl mx-auto space-y-4">
        {/* Bilgi kutusu */}
        <div className="bg-blue-500/15 border border-blue-200 rounded-xl p-3.5">
          <p className="text-xs font-bold text-blue-800 uppercase tracking-wide mb-1">Hesaplama Formülleri</p>
          <p className="text-[11px] text-blue-400 leading-relaxed">
            <span className="font-black">Kafsız ETT:</span> (Yaş/4) + 4 mm<br />
            <span className="font-black">Kaflı ETT:</span> (Yaş/4) + 3.5 mm<br />
            <span className="font-black">Derinlik (ağız):</span> (Yaş/2) + 12 cm
          </p>
        </div>

        {/* Girişler */}
        <div className="glass-card rounded-xl border border-white/10  overflow-hidden divide-y divide-white/10">
          <div className="px-4 py-3 flex items-center gap-3">
            <label className="text-sm font-bold text-white/90 w-36 shrink-0">Yaş</label>
            <div className="flex items-center gap-2 flex-1">
              <input
                type="text"
                inputMode="decimal"
                value={yas}
                onChange={(e) => setYas(e.target.value)}
                placeholder="0"
                className="w-full text-right text-lg font-black text-white/90 bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <span className="text-sm font-bold text-slate-500 shrink-0">yaş</span>
            </div>
          </div>
          <div className="px-4 py-3 flex items-center gap-3">
            <label className="text-sm font-bold text-white/90 w-36 shrink-0">Ağırlık</label>
            <div className="flex items-center gap-2 flex-1">
              <input
                type="text"
                inputMode="decimal"
                value={kilo}
                onChange={(e) => setKilo(e.target.value)}
                placeholder="0"
                className="w-full text-right text-lg font-black text-white/90 bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <span className="text-sm font-bold text-slate-500 shrink-0">kg</span>
            </div>
          </div>
        </div>

        {/* Sonuçlar */}
        {(validYas || validKilo) && (
          <div className="space-y-3">
            {/* ETT boyutları */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-600 rounded-xl p-3.5 text-center text-white">
                <p className="text-[10px] font-bold uppercase tracking-wide opacity-80">Kafsız ETT</p>
                <p className="text-3xl font-black mt-1">{ettkafsız || "-"}</p>
                <p className="text-xs font-bold opacity-70">mm İç Çap</p>
              </div>
              <div className="bg-indigo-600 rounded-xl p-3.5 text-center text-white">
                <p className="text-[10px] font-bold uppercase tracking-wide opacity-80">Kaflı ETT</p>
                <p className="text-3xl font-black mt-1">{ettkaflı || "-"}</p>
                <p className="text-xs font-bold opacity-70">mm İç Çap</p>
              </div>
            </div>

            {/* Derinlik & diğerleri */}
            <div className="glass-card rounded-xl border border-white/10  overflow-hidden divide-y divide-white/10">
              <div className="px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-white/90">Derinlik (ağızdan)</p>
                  <p className="text-[11px] text-slate-500">Yaş formülüyle — (Yaş/2) + 12</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-white/90">{derinlik || "-"}</p>
                  {derinlik && derinlik !== "Klinik" && <p className="text-xs text-slate-500 font-bold">cm</p>}
                </div>
              </div>
              <div className="px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-white/90">Derinlik (kiloya göre)</p>
                  <p className="text-[11px] text-slate-500">(Kg/10) + 12 — alternatif</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-white/90">{derinlikKilo || "-"}</p>
                  {derinlikKilo && <p className="text-xs text-slate-500 font-bold">cm</p>}
                </div>
              </div>
              <div className="px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-white/90">Laringoskop Blade</p>
                  <p className="text-[11px] text-slate-500">Önerilen tip ve numara</p>
                </div>
                <p className="text-xs font-black text-white/90 text-right max-w-[48%]">{blade() || "-"}</p>
              </div>
              <div className="px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-white/90">Suction Kateter</p>
                  <p className="text-[11px] text-slate-500">ETT iç çap × 2</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-white/90">{suction ? `Fr ${suction}` : "-"}</p>
                </div>
              </div>
            </div>

            {/* Uyarı */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
              <span className="font-bold">⚠️</span> Tüp boyutunu doğrulamak için bir sonraki ve bir önceki yarım numara hazır bulundur. Tüp yerleşimini klinik (göğüs hareketi, kapnografi, SpO₂) ile doğrula.
            </div>
          </div>
        )}
      </main>
    </PageShell>
  );
}