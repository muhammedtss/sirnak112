"use client";
import { useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { AppHeader } from "@/components/layout/AppHeader";
import { ArrowLeft } from "lucide-react";

const levels = [
  { id: "A", label: "Alert (Uyanık)", desc: "Hasta tamamen uyanık, gözler açık, çevreye tepkili.", color: "bg-emerald-500", severity: "Normal" },
  { id: "V", label: "Voice (Sesli Uyarı)", desc: "Hasta sesli uyarıya yanıt veriyor, sözel komutlara tepkili.", color: "bg-amber-500", severity: "Hafif bilinç bozukluğu" },
  { id: "P", label: "Pain (Ağrılı Uyarı)", desc: "Hasta yalnızca ağrılı uyaranlara yanıt veriyor.", color: "bg-orange-500", severity: "Orta bilinç bozukluğu" },
  { id: "U", label: "Unresponsive (Yanıtsız)", desc: "Hiçbir uyarana yanıt yok. Tam bilinç kaybı.", color: "bg-red-600", severity: "Ağır bilinç bozukluğu" },
];

export default function AvpuPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const level = levels.find((l) => l.id === selected);

  return (
    <PageShell>
      <AppHeader title="AVPU Skalası" back="/skalalar" icon={<ArrowLeft style={{ width: 16, height: 16 }} />} />

      <main className="flex-1 px-3 sm:px-6 py-4 sm:py-6 w-full max-w-xl mx-auto space-y-3">
        {levels.map((l) => (
          <button
            key={l.id}
            onClick={() => setSelected(l.id)}
            className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
              selected === l.id ? "border-slate-800 shadow-lg scale-[1.02]" : "border-white/10 glass-card shadow-sm"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`${l.color} text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-black shrink-0`}>
                {l.id}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white/90">{l.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{l.desc}</p>
              </div>
            </div>
          </button>
        ))}

        {level && (
          <div className={`${level.color} rounded-xl p-4 text-center text-white`}>
            <p className="text-xs font-bold uppercase tracking-wider mb-1">Bilinç Düzeyi</p>
            <p className="text-3xl font-black">{level.id}</p>
            <p className="text-sm font-bold mt-1">{level.severity}</p>
          </div>
        )}
      </main>
    </PageShell>
  );
}
