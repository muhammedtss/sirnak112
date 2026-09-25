"use client";
import { PageShell } from "@/components/layout/PageShell";
import { AppHeader } from "@/components/layout/AppHeader";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

export default function CabukPage() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const steps = [
    {
      id: "cevre",
      title: "Ç - Çevre Güvenliği",
      desc: "Olay yeri güvenli mi? Kendi güvenliğini sağla."
    },
    {
      id: "airway",
      title: "A - Airway (Hava Yolu)",
      desc: "Hava yolu açık mı? Gerekiyorsa havayolu manevraları veya airway uygula."
    },
    {
      id: "breathing",
      title: "B - Breathing (Solunum)",
      desc: "Solunum var mı? Solunum hızı ve derinliğini değerlendir. Gerekirse oksijen."
    },
    {
      id: "circulation",
      title: "U/C - Ulaşım / Circulation",
      desc: "Nabız var mı? Cilt rengi, kapiller dolum, kanama kontrolü."
    },
    {
      id: "k",
      title: "K - Kurtarma / Karar",
      desc: "Hızlı nakil kararı, kırmızı alan triyajı ve ileri yaşam desteği ihtiyacı."
    }
  ];

  return (
    <PageShell>
      <AppHeader title="ÇABUK Değerlendirme" back="/skalalar" icon={<ArrowLeft style={{ width: 16, height: 16 }} />} />

      <main className="flex-1 px-4 py-6 w-full max-w-xl mx-auto space-y-4">
        <div className="bg-rose-500/15 border border-rose-200 rounded-xl p-4 mb-6 text-rose-800">
          <p className="font-bold text-sm mb-1">ÇABUK Hızlı Değerlendirme</p>
          <p className="text-xs">Kritik hastalarda ilk dakikalarda yapılması gereken hızlı primer bakı ve müdahale adımları.</p>
        </div>

        <div className="space-y-3">
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => toggleItem(step.id)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                checkedItems[step.id]
                  ? "bg-emerald-500/10 border-emerald-500/30"
                  : "glass-card hover:bg-white/5"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 shrink-0 w-6 h-6 rounded-md flex items-center justify-center border ${
                  checkedItems[step.id] ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300"
                }`}>
                  {checkedItems[step.id] && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className={`font-bold text-sm ${checkedItems[step.id] ? "text-emerald-700 dark:text-emerald-400" : "text-slate-800 dark:text-slate-200"}`}>
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </main>
    </PageShell>
  );
}
