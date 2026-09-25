"use client";
import { useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { AppHeader } from "@/components/layout/AppHeader";
import { ArrowLeft } from "lucide-react";

export default function ETTPage() {
  const [yas, setYas] = useState("");
  const [kilo, setKilo] = useState("");

  const y = parseFloat(yas);
  const k = parseFloat(kilo);

  const validYas = y >= 1 && y <= 18;
  const validKilo = k > 0 && k <= 100;

  // ETT Ä°Ã§ Ã‡ap (mm)
  // < 1 yaÅŸ: 3.5 mm (termde yenidoÄŸan)
  // â‰¥ 1 yaÅŸ: (yaÅŸ/4) + 4 kafsız; (yaÅŸ/4) + 3.5 kaflı
  const ettkafsız = validYas ? ((y / 4) + 4).toFixed(1) : null;
  const ettkaflı = validYas ? ((y / 4) + 3.5).toFixed(1) : null;

  // Derinlik (cm - aÄŸÄ±zdan)
  // â‰¥ 2 yaÅŸ: (yaÅŸ/2) + 12
  const derinlik = validYas && y >= 2 ? ((y / 2) + 12).toFixed(1) : null;
  const derinlikKilo = validKilo ? (k / 10 + 12).toFixed(1) : null;

  // Laringoskop blade
  const blade = () => {
    if (!validYas) return null;
    if (y < 1) return "Miller 0â€“1 (dÃ¼z)";
    if (y < 3) return "Miller 1 (dÃ¼z)";
    if (y < 8) return "Miller 2 / Macintosh 2 (kavisli)";
    return "Macintosh 2â€“3 (kavisli)";
  };

  // Suction kateter
  const suction = ettkafsız ? (parseFloat(ettkafsız) * 2).toFixed(0) : null;

  return (
    <PageShell>
      <AppHeader title="ETT â€” Endotrakeal EntÃ¼basyon" back="/skalalar" icon={<ArrowLeft style={{ width: 16, height: 16 }} />} />

      <main className="flex-1 px-3 sm:px-6 py-4 sm:py-6 w-full max-w-xl mx-auto space-y-4">
        {/* Bilgi kutusu */}
        <div className="bg-blue-500/15 border border-blue-200 rounded-xl p-3.5">
          <p className="text-xs font-bold text-blue-800 uppercase tracking-wide mb-1">Hesaplama FormÃ¼lleri</p>
          <p className="text-[11px] text-blue-400 leading-relaxed">
            <span className="font-black">kafsız ETT:</span> (YaÅŸ/4) + 4 mm<br />
            <span className="font-black">kaflı ETT:</span> (YaÅŸ/4) + 3.5 mm<br />
            <span className="font-black">Derinlik (aÄŸÄ±z):</span> (YaÅŸ/2) + 12 cm (â‰¥2 yaÅŸ)
          </p>
        </div>

        {/* GiriÅŸler */}
        <div className="glass-card rounded-xl border border-white/10  overflow-hidden divide-y divide-white/10">
          <div className="px-4 py-3 flex items-center gap-3">
            <label className="text-sm font-bold text-white/90 w-36 shrink-0">YaÅŸ</label>
            <div className="flex items-center gap-2 flex-1">
              <input
                type="number"
                min="1"
                max="18"
                value={yas}
                onChange={(e) => setYas(e.target.value)}
                placeholder="0"
                className="w-full text-right text-lg font-black text-white/90 bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <span className="text-sm font-bold text-slate-500 shrink-0">yaÅŸ</span>
            </div>
          </div>
          <div className="px-4 py-3 flex items-center gap-3">
            <label className="text-sm font-bold text-white/90 w-36 shrink-0">AÄŸÄ±rlÄ±k</label>
            <div className="flex items-center gap-2 flex-1">
              <input
                type="number"
                min="1"
                max="100"
                value={kilo}
                onChange={(e) => setKilo(e.target.value)}
                placeholder="0"
                className="w-full text-right text-lg font-black text-white/90 bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <span className="text-sm font-bold text-slate-500 shrink-0">kg</span>
            </div>
          </div>
        </div>

        {/* SonuÃ§lar */}
        {validYas && (
          <div className="space-y-3">
            {/* ETT boyutlarÄ± */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-600 rounded-xl p-3.5 text-center text-white">
                <p className="text-[10px] font-bold uppercase tracking-wide opacity-80">kafsız ETT</p>
                <p className="text-3xl font-black mt-1">{ettkafsız}</p>
                <p className="text-xs font-bold opacity-70">mm Ä°Ã§ Ã‡ap</p>
              </div>
              <div className="bg-indigo-600 rounded-xl p-3.5 text-center text-white">
                <p className="text-[10px] font-bold uppercase tracking-wide opacity-80">kaflı ETT</p>
                <p className="text-3xl font-black mt-1">{ettkaflı}</p>
                <p className="text-xs font-bold opacity-70">mm Ä°Ã§ Ã‡ap</p>
              </div>
            </div>

            {/* Derinlik & diÄŸerleri */}
            <div className="glass-card rounded-xl border border-white/10  overflow-hidden divide-y divide-white/10">
              {derinlik && (
                <div className="px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-white/90">Derinlik (aÄŸÄ±zdan)</p>
                    <p className="text-[11px] text-slate-500">YaÅŸ formÃ¼lÃ¼yle â€” {y >= 2 ? "(YaÅŸ/2) + 12" : "klinik deÄŸerlendirme"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-white/90">{derinlik}</p>
                    <p className="text-xs text-slate-500 font-bold">cm</p>
                  </div>
                </div>
              )}
              {validKilo && derinlikKilo && (
                <div className="px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-white/90">Derinlik (kiloya gÃ¶re)</p>
                    <p className="text-[11px] text-slate-500">(Kg/10) + 12 â€” alternatif</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-white/90">{derinlikKilo}</p>
                    <p className="text-xs text-slate-500 font-bold">cm</p>
                  </div>
                </div>
              )}
              <div className="px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-white/90">Laringoskop Blade</p>
                  <p className="text-[11px] text-slate-500">Ã–nerilen tip ve numara</p>
                </div>
                <p className="text-xs font-black text-white/90 text-right max-w-[48%]">{blade()}</p>
              </div>
              {suction && (
                <div className="px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-white/90">Suction Kateter</p>
                    <p className="text-[11px] text-slate-500">ETT iÃ§ Ã§ap Ã— 2</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-white/90">Fr {suction}</p>
                  </div>
                </div>
              )}
            </div>

            {/* UyarÄ± */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
              <span className="font-bold">âš ï¸</span> TÃ¼p boyutunu doÄŸrulamak iÃ§in bir sonraki ve bir Ã¶nceki yarÄ±m numara hazÄ±r bulundur. TÃ¼p yerleÅŸimini klinik (gÃ¶ÄŸÃ¼s hareketi, kapnografi, SpOâ‚‚) ile doÄŸrula.
            </div>
          </div>
        )}
      </main>
    </PageShell>
  );
}