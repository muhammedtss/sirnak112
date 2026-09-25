"use client";
import { useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { AppHeader } from "@/components/layout/AppHeader";
import { ArrowLeft } from "lucide-react";

export default function VentilatorPage() {
  const [kilo, setKilo] = useState("");
  const [fio2, setFio2] = useState("40");
  const [peep, setPeep] = useState("5");
  const [freq, setFreq] = useState("14");
  const [ieE, setIeE] = useState("2");

  const k = parseFloat(kilo);
  const f = parseFloat(freq);
  const ie = parseFloat(ieE);

  const valid = k > 0 && k <= 300;

  // Ideal vücut ağırlığına göre hesaplama (erkek/kadın ortalaması)
  const tidalMin = valid ? (k * 6).toFixed(0) : null;
  const tidalMax = valid ? (k * 8).toFixed(0) : null;
  const dkVolMin = valid && f ? ((k * 6 * f) / 1000).toFixed(1) : null;
  const dkVolMax = valid && f ? ((k * 8 * f) / 1000).toFixed(1) : null;

  // I:E zamanları
  const totalCycle = f > 0 ? 60 / f : null;
  const tI = totalCycle ? (totalCycle / (1 + ie)).toFixed(2) : null;
  const tE = totalCycle && tI ? (totalCycle - parseFloat(tI)).toFixed(2) : null;

  return (
    <PageShell>
      <AppHeader title="Ventilatör Hesaplama" back="/skalalar" icon={<ArrowLeft style={{ width: 16, height: 16 }} />} />

      <main className="flex-1 px-3 sm:px-6 py-4 sm:py-6 w-full max-w-xl mx-auto space-y-4">
        {/* Girişler */}
        <div className="glass-card rounded-xl border border-white/10  overflow-hidden divide-y divide-white/10">
          {/* Kilo */}
          <div className="px-4 py-3 flex items-center gap-3">
            <label className="text-sm font-bold text-white/90 w-40 shrink-0">Vücut Ağırlığı</label>
            <div className="flex items-center gap-2 flex-1">
              <input
                type="number"
                min="1"
                max="300"
                value={kilo}
                onChange={(e) => setKilo(e.target.value)}
                placeholder="0"
                className="w-full text-right text-lg font-black text-white/90 bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <span className="text-sm font-bold text-slate-500 shrink-0">kg</span>
            </div>
          </div>

          {/* FiO2 */}
          <div className="px-4 py-3">
            <div className="flex items-center gap-3 mb-2">
              <label className="text-sm font-bold text-white/90 w-40 shrink-0">FiO₂</label>
              <span className="ml-auto text-sm font-black text-purple-400">%{fio2}</span>
            </div>
            <input
              type="range"
              min="21"
              max="100"
              step="1"
              value={fio2}
              onChange={(e) => setFio2(e.target.value)}
              className="w-full accent-purple-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-0.5">
              <span>%21</span><span>%100</span>
            </div>
          </div>

          {/* PEEP */}
          <div className="px-4 py-3">
            <div className="flex items-center gap-3 mb-2">
              <label className="text-sm font-bold text-white/90 w-40 shrink-0">PEEP</label>
              <span className="ml-auto text-sm font-black text-purple-400">{peep} cmH₂O</span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              step="1"
              value={peep}
              onChange={(e) => setPeep(e.target.value)}
              className="w-full accent-purple-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-0.5">
              <span>0</span><span>20</span>
            </div>
          </div>

          {/* Frekans */}
          <div className="px-4 py-3">
            <div className="flex items-center gap-3 mb-2">
              <label className="text-sm font-bold text-white/90 w-40 shrink-0">Solunum Frekansı</label>
              <span className="ml-auto text-sm font-black text-purple-400">{freq} /dk</span>
            </div>
            <input
              type="range"
              min="8"
              max="30"
              step="1"
              value={freq}
              onChange={(e) => setFreq(e.target.value)}
              className="w-full accent-purple-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-0.5">
              <span>8</span><span>30</span>
            </div>
          </div>

          {/* I:E */}
          <div className="px-4 py-3">
            <div className="flex items-center gap-3 mb-2">
              <label className="text-sm font-bold text-white/90 w-40 shrink-0">I:E Oranı</label>
              <span className="ml-auto text-sm font-black text-purple-400">1:{ieE}</span>
            </div>
            <input
              type="range"
              min="1"
              max="4"
              step="0.5"
              value={ieE}
              onChange={(e) => setIeE(e.target.value)}
              className="w-full accent-purple-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-0.5">
              <span>1:1</span><span>1:4</span>
            </div>
          </div>
        </div>

        {/* Sonuçlar */}
        {valid && (
          <div className="space-y-3">
            {/* Tidal Volüm */}
            <div className="bg-purple-600 rounded-xl p-4 text-white">
              <p className="text-xs font-bold uppercase tracking-wider mb-2 opacity-80">Tidal Volüm (6–8 mL/kg)</p>
              <div className="flex items-center justify-center gap-3">
                <div className="text-center">
                  <p className="text-3xl font-black">{tidalMin}</p>
                  <p className="text-[11px] opacity-70 font-bold">6 mL/kg</p>
                </div>
                <span className="text-lg font-black opacity-50">–</span>
                <div className="text-center">
                  <p className="text-3xl font-black">{tidalMax}</p>
                  <p className="text-[11px] opacity-70 font-bold">8 mL/kg</p>
                </div>
                <span className="text-sm font-bold opacity-70 ml-1">mL</span>
              </div>
            </div>

            {/* Grid sonuçlar */}
            <div className="grid grid-cols-2 gap-3">
              <div className="glass-card rounded-xl border border-white/10 p-3 text-center ">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Dakika Volümü</p>
                <p className="text-base font-black text-white/90 mt-1">{dkVolMin}–{dkVolMax}</p>
                <p className="text-[10px] text-slate-500 font-bold">L/dk</p>
              </div>
              <div className="glass-card rounded-xl border border-white/10 p-3 text-center ">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">PEEP</p>
                <p className="text-base font-black text-white/90 mt-1">{peep}</p>
                <p className="text-[10px] text-slate-500 font-bold">cmH₂O</p>
              </div>
              <div className="glass-card rounded-xl border border-white/10 p-3 text-center ">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">İnspirasyon (Ti)</p>
                <p className="text-base font-black text-white/90 mt-1">{tI}</p>
                <p className="text-[10px] text-slate-500 font-bold">sn</p>
              </div>
              <div className="glass-card rounded-xl border border-white/10 p-3 text-center ">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Ekspirasyon (Te)</p>
                <p className="text-base font-black text-white/90 mt-1">{tE}</p>
                <p className="text-[10px] text-slate-500 font-bold">sn</p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
              <span className="font-bold">⚠️ Not:</span> Bu değerler başlangıç ayarları içindir. Plato basıncı ≤30 cmH₂O ve hastayla uyum sürekli izlenmeli; klinisyen değerlendirmesi esastır.
            </div>
          </div>
        )}
      </main>
    </PageShell>
  );
}
