"use client";
import { useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { AppHeader } from "@/components/layout/AppHeader";
import { ArrowLeft, Calculator, Info } from "lucide-react";

type AgeUnit = "months" | "years";

export default function BestGuessPage() {
  const [unit, setUnit] = useState<AgeUnit>("months");
  const [age, setAge] = useState<string>("");

  const calculateWeight = () => {
    const ageNum = parseFloat(age);
    if (isNaN(ageNum) || ageNum < 0) return null;

    if (unit === "months") {
      // <12 ay = (Ay+9)/2
      return (ageNum + 9) / 2;
    } else {
      if (ageNum >= 1 && ageNum <= 4) {
        // 1-4 yaş = (Yaş+5)X2
        return (ageNum + 5) * 2;
      } else if (ageNum >= 5 && ageNum <= 14) {
        // 5-14 yaş = YaşX4
        return ageNum * 4;
      } else if (ageNum > 14) {
        // Formül 14 yaşa kadar
        return ageNum * 4; // Or handle differently, but mathematically this extends it. Actually let's just do age * 4 for > 14 too or return null.
      }
    }
    return null;
  };

  const weight = calculateWeight();

  return (
    <PageShell>
      <AppHeader title="Best Guess Formülü" back="/skalalar" icon={<ArrowLeft style={{ width: 16, height: 16 }} />} />

      <main className="flex-1 px-4 py-6 w-full max-w-md mx-auto space-y-6">
        <div className="glass-card rounded-2xl p-5 border border-white/10 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-white/90">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
              <Calculator size={20} />
            </div>
            <div>
              <h2 className="text-sm font-bold">Vücut Ağırlığı Tahmini</h2>
              <p className="text-xs text-slate-400">Çocuklarda ilaç ve sıvı dozajı için</p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Unit Selection */}
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => { setUnit("months"); setAge(""); }}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${unit === "months" ? "bg-orange-500 text-white shadow-md" : "text-slate-400 hover:text-white"}`}
              >
                &lt;12 Ay
              </button>
              <button
                onClick={() => { setUnit("years"); setAge(""); }}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${unit === "years" ? "bg-orange-500 text-white shadow-md" : "text-slate-400 hover:text-white"}`}
              >
                1-14 Yaş
              </button>
            </div>

            {/* Age Input */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                {unit === "months" ? "Bebeğin Ayı (0-12)" : "Çocuğun Yaşı (1-14)"}
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Örn: 6"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all font-medium"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                  {unit === "months" ? "ay" : "yaş"}
                </div>
              </div>
            </div>

            {/* Result */}
            <div className={`mt-6 rounded-xl p-4 border transition-all duration-300 ${weight !== null ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/5 border-white/10'}`}>
              <div className="text-center">
                <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Tahmini Ağırlık</p>
                {weight !== null ? (
                  <div className="flex items-baseline justify-center gap-1.5">
                    <span className="text-4xl font-black text-emerald-400">{weight.toFixed(1)}</span>
                    <span className="text-emerald-500 font-bold">kg</span>
                  </div>
                ) : (
                  <div className="text-2xl font-bold text-slate-500">--</div>
                )}
              </div>
            </div>
            
            {/* Warning Message if out of standard range */}
            {unit === "months" && parseFloat(age) > 12 && (
              <div className="flex items-start gap-2 text-amber-400 bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                <Info size={16} className="shrink-0 mt-0.5" />
                <p className="text-xs font-medium">Bu formül 12 aydan küçük bebekler içindir. 12 aydan büyükler için &quot;Yaş&quot; sekmesini kullanın.</p>
              </div>
            )}
            {unit === "years" && parseFloat(age) > 14 && (
              <div className="flex items-start gap-2 text-amber-400 bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                <Info size={16} className="shrink-0 mt-0.5" />
                <p className="text-xs font-medium">Bu formül 1-14 yaş arası için geçerlidir.</p>
              </div>
            )}
          </div>
        </div>

        {/* Formula Reference */}
        <div className="glass-card rounded-2xl border border-white/10 shadow-sm overflow-hidden">
          <div className="bg-slate-800 text-white text-center text-xs font-extrabold uppercase tracking-widest py-3 px-4 border-b border-white/10">
            Best Guess Formülü
          </div>
          <div className="divide-y divide-white/5">
            <div className="flex items-center justify-between p-3 px-4 hover:bg-white/5 transition-colors">
              <span className="text-sm font-bold text-slate-300">&lt;12 ay</span>
              <span className="text-sm font-mono text-orange-400 bg-orange-500/10 px-2 py-1 rounded-md border border-orange-500/20">= (Ay + 9) / 2</span>
            </div>
            <div className="flex items-center justify-between p-3 px-4 hover:bg-white/5 transition-colors">
              <span className="text-sm font-bold text-slate-300">1-4 yaş</span>
              <span className="text-sm font-mono text-orange-400 bg-orange-500/10 px-2 py-1 rounded-md border border-orange-500/20">= (Yaş + 5) × 2</span>
            </div>
            <div className="flex items-center justify-between p-3 px-4 hover:bg-white/5 transition-colors">
              <span className="text-sm font-bold text-slate-300">5-14 yaş</span>
              <span className="text-sm font-mono text-orange-400 bg-orange-500/10 px-2 py-1 rounded-md border border-orange-500/20">= Yaş × 4</span>
            </div>
          </div>
        </div>
      </main>
    </PageShell>
  );
}
