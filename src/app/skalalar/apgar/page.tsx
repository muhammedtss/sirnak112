"use client";
import { useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { AppHeader } from "@/components/layout/AppHeader";
import { ArrowLeft } from "lucide-react";

const criteria = [
  {
    title: "Kalp Hızı",
    options: [
      { score: 0, label: "Yok" },
      { score: 1, label: "<100/dk" },
      { score: 2, label: "≥100/dk" },
    ],
  },
  {
    title: "Solunum Çabası",
    options: [
      { score: 0, label: "Yok" },
      { score: 1, label: "Yavaş, düzensiz" },
      { score: 2, label: "İyi, ağlıyor" },
    ],
  },
  {
    title: "Kas Tonusu",
    options: [
      { score: 0, label: "Flask (gevşek)" },
      { score: 1, label: "Bir miktar fleksiyon" },
      { score: 2, label: "Aktif hareket" },
    ],
  },
  {
    title: "Refleks İrritabilite",
    options: [
      { score: 0, label: "Yanıt yok" },
      { score: 1, label: "Yüz buruşturma" },
      { score: 2, label: "Öksürük, hapşırık, ağlama" },
    ],
  },
  {
    title: "Renk",
    options: [
      { score: 0, label: "Siyanoze veya soluk" },
      { score: 1, label: "Gövde pembe, ekstremite siyanoze" },
      { score: 2, label: "Tamamen pembe" },
    ],
  },
];

function getInterpretation(score: number) {
  if (score >= 7) return { text: "Normal — müdahale gerekmez", color: "text-emerald-400", bg: "bg-emerald-500/15 border-emerald-500/30" };
  if (score >= 4) return { text: "Orta depresyon — uyarılma ve destek gerekli", color: "text-amber-400", bg: "bg-amber-500/15 border-amber-500/30" };
  return { text: "Ciddi depresyon — resüsitasyon gerekli", color: "text-red-400", bg: "bg-red-500/15 border-red-500/30" };
}

export default function ApgarPage() {
  const [minute, setMinute] = useState<"1" | "5">("1");
  const [selections, setSelections] = useState<Record<string, Record<number, number>>>({ "1": {}, "5": {} });

  const currentSel = selections[minute];
  const total = Object.values(currentSel).reduce((a, b) => a + b, 0);
  const allSelected = Object.keys(currentSel).length === criteria.length;
  const interp = getInterpretation(total);

  const handleSelect = (ci: number, score: number) => {
    setSelections((p) => ({
      ...p,
      [minute]: { ...p[minute], [ci]: score },
    }));
  };

  return (
    <PageShell>
      <AppHeader title="APGAR Skorlaması" back="/skalalar" icon={<ArrowLeft style={{ width: 16, height: 16 }} />} />

      <main className="flex-1 px-3 sm:px-6 py-4 sm:py-6 w-full max-w-xl mx-auto space-y-4">
        {/* Dakika Seçimi */}
        <div className="flex glass-card rounded-xl border border-white/10  overflow-hidden">
          {(["1", "5"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMinute(m)}
              className={`flex-1 py-3 text-sm font-bold transition-colors ${
                minute === m ? "bg-pink-500/15 text-pink-400 border-b border-white/10" : "text-white/90 glass-hover hover:bg-white/5"
              }`}
            >
              {m}. Dakika
            </button>
          ))}
        </div>

        {criteria.map((c, ci) => (
          <div key={ci} className="glass-card rounded-xl border border-white/10  overflow-hidden">
            <div className="bg-pink-500/15 text-pink-400 border-b border-white/10 px-4 py-2.5 text-sm font-bold">{c.title}</div>
            <div className="divide-y divide-white/10">
              {c.options.map((opt) => (
                <button
                  key={opt.score}
                  onClick={() => handleSelect(ci, opt.score)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                    currentSel[ci] === opt.score ? "bg-pink-500/15" : "glass-hover hover:bg-white/5"
                  }`}
                >
                  <span className={`text-sm font-semibold ${currentSel[ci] === opt.score ? "text-pink-400" : "text-white/90"}`}>
                    {opt.label}
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    currentSel[ci] === opt.score ? "bg-pink-500/15 text-pink-400 border border-pink-500/30" : "bg-white/5 text-white/50 border border-white/10"
                  }`}>
                    {opt.score}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}

        {allSelected && (
          <div className={`${interp.bg} rounded-xl border-2 border-current p-4 text-center ${interp.color}`}>
            <p className="text-xs font-bold uppercase tracking-wider mb-1">{minute}. Dakika APGAR Skoru</p>
            <p className="text-4xl font-black">{total}/10</p>
            <p className="text-sm font-bold mt-1">{interp.text}</p>
          </div>
        )}
      </main>
    </PageShell>
  );
}
