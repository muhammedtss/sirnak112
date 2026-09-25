"use client";
import { useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { AppHeader } from "@/components/layout/AppHeader";
import { ArrowLeft } from "lucide-react";

const sections = [
  {
    title: "Göz Açma (E)",
    options: [
      { score: 4, label: "Spontan" },
      { score: 3, label: "Sesli uyarıya" },
      { score: 2, label: "Ağrılı uyarıya" },
      { score: 1, label: "Yok" },
    ],
  },
  {
    title: "Sözel Yanıt (V) — Bebek (<2 yaş)",
    options: [
      { score: 5, label: "Agular, babıldanır (yaşına uygun)" },
      { score: 4, label: "Ağlıyor ama teselli edilebilir" },
      { score: 3, label: "Ağrıya uygunsuz ağlama" },
      { score: 2, label: "İnleme" },
      { score: 1, label: "Yok" },
    ],
  },
  {
    title: "Motor Yanıt (M) — Bebek",
    options: [
      { score: 6, label: "Spontan hareketler" },
      { score: 5, label: "Dokunmaya çekme" },
      { score: 4, label: "Ağrıya çekme" },
      { score: 3, label: "Anormal fleksiyon (dekortike)" },
      { score: 2, label: "Ekstensiyon (deserebere)" },
      { score: 1, label: "Yok" },
    ],
  },
];

function getSeverity(score: number) {
  if (score >= 13) return { text: "Hafif", color: "text-emerald-400", bg: "bg-emerald-500/15 border-emerald-500/30" };
  if (score >= 9) return { text: "Orta", color: "text-amber-400", bg: "bg-amber-500/15 border-amber-500/30" };
  return { text: "Ağır", color: "text-red-400", bg: "bg-red-500/15 border-red-500/30" };
}

export default function GlasgowBebekPage() {
  const [selections, setSelections] = useState<Record<number, number>>({});
  const total = Object.values(selections).reduce((a, b) => a + b, 0);
  const allSelected = Object.keys(selections).length === sections.length;
  const severity = getSeverity(total);

  return (
    <PageShell>
      <AppHeader title="Bebek Glasgow Koma Skalası" back="/skalalar" icon={<ArrowLeft style={{ width: 16, height: 16 }} />} />

      <main className="flex-1 px-3 sm:px-6 py-4 sm:py-6 w-full max-w-xl mx-auto space-y-4">
        {sections.map((section, si) => (
          <div key={si} className="glass-card rounded-xl border border-white/10  overflow-hidden">
            <div className="bg-purple-500/15 text-purple-400 border-b border-white/10 px-4 py-2.5 text-sm font-bold">{section.title}</div>
            <div className="divide-y divide-white/10">
              {section.options.map((opt) => (
                <button
                  key={opt.score}
                  onClick={() => setSelections((p) => ({ ...p, [si]: opt.score }))}
                  className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                    selections[si] === opt.score ? "bg-purple-500/15" : "glass-hover hover:bg-white/5"
                  }`}
                >
                  <span className={`text-sm font-semibold ${selections[si] === opt.score ? "text-purple-400" : "text-white/90"}`}>
                    {opt.label}
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    selections[si] === opt.score ? "bg-purple-500/15 text-purple-400 border border-purple-500/30" : "bg-white/5 text-white/50 border border-white/10"
                  }`}>
                    {opt.score}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}

        {allSelected && (
          <div className={`${severity.bg} rounded-xl border-2 border-current p-4 text-center ${severity.color}`}>
            <p className="text-xs font-bold uppercase tracking-wider mb-1">Toplam Bebek GKS Skoru</p>
            <p className="text-4xl font-black">{total}</p>
            <p className="text-sm font-bold mt-1">{severity.text}</p>
          </div>
        )}
      </main>
    </PageShell>
  );
}
