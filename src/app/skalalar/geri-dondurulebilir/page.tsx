import { PageShell } from "@/components/layout/PageShell";
import { AppHeader } from "@/components/layout/AppHeader";
import { ArrowLeft } from "lucide-react";

const causes5H = [
  {
    letter: "H",
    title: "Hipoksi",
    detail: "Hava yolunu aç, yüksek akımlı O₂ ver, entübe et",
    color: "border-red-200 dark:border-red-500/30 bg-red-500/10 dark:bg-red-500/15",
    textColor: "text-red-700 dark:text-red-500",
    badgeColor: "bg-red-500 dark:bg-red-600",
    icon: "🫁",
  },
  {
    letter: "H",
    title: "Hipovolemi",
    detail: "İV/İO yol — sıvı bolusu, kanamayı kontrol et",
    color: "border-orange-200 dark:border-orange-500/30 bg-orange-500/10 dark:bg-orange-500/15",
    textColor: "text-orange-700 dark:text-orange-500",
    badgeColor: "bg-orange-500 dark:bg-orange-600",
    icon: "💧",
  },
  {
    letter: "H",
    title: "Hipo/Hiper termi",
    detail: "Rektal ısı, aktif ısıtma — ≥30°C altında VF tedaviye yanıtsız",
    color: "border-blue-200 dark:border-blue-500/30 bg-blue-500/10 dark:bg-blue-500/15",
    textColor: "text-blue-700 dark:text-blue-500",
    badgeColor: "bg-blue-500 dark:bg-blue-600",
    icon: "🌡️",
  },
  {
    letter: "H",
    title: "Hipo/Hiper kalemi",
    detail: "İyon bozuklukları: K⁺, Ca²⁺, Na⁺",
    color: "border-emerald-200 dark:border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-500/15",
    textColor: "text-emerald-700 dark:text-emerald-500",
    badgeColor: "bg-emerald-500 dark:bg-emerald-600",
    icon: "⚗️",
  },
  {
    letter: "H",
    title: "Hidrojen iyonu Asidoz",
    detail: "Metabolik veya solunumsal asidoz — AGK/kan gazı",
    color: "border-pink-200 dark:border-pink-500/30 bg-pink-500/10 dark:bg-pink-500/15",
    textColor: "text-pink-700 dark:text-pink-500",
    badgeColor: "bg-pink-500 dark:bg-pink-600",
    icon: "🧪",
  },
];

const causes5T = [
  {
    letter: "T",
    title: "Tansiyon Pnömotoraks",
    detail: "2. İKA orta klaviküler hatta iğne dekompresyonu",
    color: "border-violet-200 dark:border-violet-500/30 bg-violet-500/10 dark:bg-violet-500/15",
    textColor: "text-violet-700 dark:text-violet-500",
    badgeColor: "bg-violet-500 dark:bg-violet-600",
    icon: "💨",
  },
  {
    letter: "T",
    title: "Tamponat Kardiyak",
    detail: "Perikardiyosentez — USG ile subksifoid pencere",
    color: "border-fuchsia-200 dark:border-fuchsia-500/30 bg-fuchsia-500/10 dark:bg-fuchsia-500/15",
    textColor: "text-fuchsia-700 dark:text-fuchsia-500",
    badgeColor: "bg-fuchsia-500 dark:bg-fuchsia-600",
    icon: "🫀",
  },
  {
    letter: "T",
    title: "Tromboz Pulmoner",
    detail: "PE → tromboliz",
    color: "border-rose-200 dark:border-rose-500/30 bg-rose-500/10 dark:bg-rose-500/15",
    textColor: "text-rose-700 dark:text-rose-500",
    badgeColor: "bg-rose-500 dark:bg-rose-600",
    icon: "🫁",
  },
  {
    letter: "T",
    title: "Tromboz Kardiyak",
    detail: "STEMI → primer PCI veya tromboliz",
    color: "border-rose-200 dark:border-rose-500/30 bg-rose-500/10 dark:bg-rose-500/15",
    textColor: "text-rose-700 dark:text-rose-500",
    badgeColor: "bg-rose-500 dark:bg-rose-600",
    icon: "🩸",
  },
  {
    letter: "T",
    title: "Toksinler",
    detail: "Antidot: Nalokson, flumazenil, atropin, Na bikarbonat vs.",
    color: "border-teal-200 dark:border-teal-500/30 bg-teal-500/10 dark:bg-teal-500/15",
    textColor: "text-teal-700 dark:text-teal-500",
    badgeColor: "bg-teal-500 dark:bg-teal-600",
    icon: "💊",
  },
];

export default function GeriDondurulebilirPage() {
  return (
    <PageShell>
      <AppHeader title="Geri Döndürülebilir Nedenler" back="/skalalar" icon={<ArrowLeft style={{ width: 16, height: 16 }} />} />

      <main className="flex-1 px-3 sm:px-6 py-4 sm:py-6 w-full max-w-xl mx-auto space-y-4">
        {/* Üst bilgi */}
        <div className="bg-red-500/10 dark:bg-red-500/15 text-red-700 dark:text-red-400 border-b border-black/5 dark:border-white/10 rounded-xl p-3.5">
          <p className="text-xs font-bold uppercase tracking-wider opacity-80 mb-0.5">Kardiyak Arrest</p>
          <p className="text-sm font-black">KPR sırasında 5H-5T</p>
          <p className="text-[11px] opacity-75 mt-1 text-slate-700 dark:text-white/90">Her arrest vakasında bu nedenleri sistematik olarak ara ve tedavi et</p>
        </div>

        {/* 5H */}
        <div>
          <div className="flex items-center gap-2 mb-2 px-1">
            <span className="w-7 h-7 rounded-full bg-red-500/10 dark:bg-red-500/15 text-red-700 dark:text-red-400 border-b border-black/5 dark:border-white/10 flex items-center justify-center text-xs font-black">5H</span>
            <h2 className="text-sm font-extrabold text-slate-800 dark:text-white/90">H ile Başlayanlar</h2>
          </div>
          <div className="space-y-2">
            {causes5H.map((item, i) => (
              <div key={i} className={`rounded-xl border-2 p-3.5 flex gap-3 items-start ${item.color}`}>
                <span className="text-xl shrink-0 mt-0.5">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-[10px] font-black text-white px-1.5 py-0.5 rounded ${item.badgeColor}`}>{item.letter}</span>
                    <p className={`text-sm font-bold ${item.textColor}`}>{item.title}</p>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-white/90 leading-relaxed">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5T */}
        <div>
          <div className="flex items-center gap-2 mb-2 px-1">
            <span className="w-7 h-7 rounded-full bg-violet-500/10 dark:bg-violet-500/15 text-violet-700 dark:text-violet-400 border-b border-black/5 dark:border-white/10 flex items-center justify-center text-xs font-black">5T</span>
            <h2 className="text-sm font-extrabold text-slate-800 dark:text-white/90">T ile Başlayanlar</h2>
          </div>
          <div className="space-y-2">
            {causes5T.map((item, i) => (
              <div key={i} className={`rounded-xl border-2 p-3.5 flex gap-3 items-start ${item.color}`}>
                <span className="text-xl shrink-0 mt-0.5">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-[10px] font-black text-white px-1.5 py-0.5 rounded ${item.badgeColor}`}>{item.letter}</span>
                    <p className={`text-sm font-bold ${item.textColor}`}>{item.title}</p>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-white/90 leading-relaxed">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-200/50 dark:bg-slate-800 rounded-xl p-3 text-[11px] text-slate-600 dark:text-white/90 text-center font-semibold border border-slate-200 dark:border-transparent">
          KPR'yi kesme — bu nedenler tedavi edilebilir ✓
        </div>
      </main>
    </PageShell>
  );
}
