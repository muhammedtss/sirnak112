"use client";
import { useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { AppHeader } from "@/components/layout/AppHeader";
import { ArrowLeft } from "lucide-react";

const grades = [
  { score: 0, label: "Kas kasılması yok", desc: "Hiç hareket gözlemlenmez." },
  { score: 1, label: "Titreme / fasikülasyon", desc: "Kas kasılması hissedilir ancak hareket oluşmaz." },
  { score: 2, label: "Yerçekimi elimine edilince hareket", desc: "Yerçekimi ortadan kaldırıldığında tam hareket açıklığı." },
  { score: 3, label: "Yerçekimine karşı hareket", desc: "Yerçekimine karşı tam hareket açıklığı, dirence karşı değil." },
  { score: 4, label: "Dirence karşı hareket", desc: "Bir miktar dirence karşı hareket edebilir ancak yenilebilir." },
  { score: 5, label: "Normal kas gücü", desc: "Tam kas gücü, dirence karşı tam hareket." },
];

export default function KasGucuPage() {
  const [selected, setSelected] = useState<number | null>(null);
  const grade = grades.find((g) => g.score === selected);

  const getColor = (score: number) => {
    if (score <= 1) return "bg-red-500";
    if (score <= 2) return "bg-orange-500";
    if (score <= 3) return "bg-amber-500";
    if (score <= 4) return "bg-emerald-400";
    return "bg-emerald-600";
  };

  return (
    <PageShell>
      <AppHeader title="Kas Gücü Skalası (MRC)" back="/skalalar" icon={<ArrowLeft style={{ width: 16, height: 16 }} />} />

      <main className="flex-1 px-3 sm:px-6 py-4 sm:py-6 w-full max-w-xl mx-auto space-y-3">
        {grades.map((g) => (
          <button
            key={g.score}
            onClick={() => setSelected(g.score)}
            className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
              selected === g.score ? "border-slate-800 shadow-lg scale-[1.02]" : "border-white/10 glass-card shadow-sm"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`${getColor(g.score)} text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-black shrink-0`}>
                {g.score}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white/90">{g.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{g.desc}</p>
              </div>
            </div>
          </button>
        ))}

        {grade && (
          <div className={`${getColor(grade.score)} rounded-xl p-4 text-center text-white`}>
            <p className="text-xs font-bold uppercase tracking-wider mb-1">Kas Gücü Derecesi</p>
            <p className="text-4xl font-black">{grade.score}/5</p>
            <p className="text-sm font-bold mt-1">{grade.label}</p>
          </div>
        )}
      </main>
    </PageShell>
  );
}
