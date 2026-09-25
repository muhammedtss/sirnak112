import { PageShell } from "@/components/layout/PageShell";
import { AppHeader } from "@/components/layout/AppHeader";
import { ArrowLeft } from "lucide-react";

const ilaclar = [
  {
    grup: "Analjezi & Sedasyon",
    renk: "border-violet-300 bg-violet-500/15",
    baslikRenk: "bg-violet-600",
    ilaclar: [
      { ad: "Morfin", doz: "0.1 mg/kg İV yavaş", not: "Hipansiyon riski; titrasyon ile ver" },
      { ad: "Fentanil", doz: "1–2 mcg/kg İV (saha)", not: "Hızlı etki; göğüs rijiditesi dikkat" },
      { ad: "Ketamin", doz: "1–2 mg/kg İV / 4–6 mg/kg İM", not: "Analjezi+sedasyon; bronkospazmda tercih" },
      { ad: "Midazolam", doz: "0.05–0.1 mg/kg İV", not: "Solunum depresyonu; nalokson hazır ol" },
    ],
  },
  {
    grup: "Hava Yolu",
    renk: "border-blue-300 bg-blue-500/15",
    baslikRenk: "bg-blue-600",
    ilaclar: [
      { ad: "Suksinilkolin", doz: "1.5 mg/kg İV (RSI)", not: "Kontraend: hiperkaleми, miyopati, yanık" },
      { ad: "Roküronyum", doz: "1.2 mg/kg İV (RSI)", not: "Sugammadeks ile geri alınabilir" },
      { ad: "Atropin (RSI pedi)", doz: "0.01–0.02 mg/kg İV", not: "< 1 yaş veya bradikardi önlemi" },
    ],
  },
  {
    grup: "Kardiyovasküler",
    renk: "border-red-300 bg-red-500/15",
    baslikRenk: "bg-red-600",
    ilaclar: [
      { ad: "Adrenalin (Arrest)", doz: "1 mg İV/İO her 3–5 dk", not: "VF/VT + asistol/NEA" },
      { ad: "Amiodaron", doz: "300 mg İV bolüs (VF/VT)", not: "Sonra 150 mg; kardiyotonik dikkat" },
      { ad: "Adenozin", doz: "6 mg İV hızlı → 12 mg", not: "SVT; hızlı flush ile ver" },
      { ad: "Noradrenalin", doz: "0.01–3 mcg/kg/dk inf.", not: "Septik şok; santral yol tercih" },
    ],
  },
  {
    grup: "Nöroloji & Konvülsiyon",
    renk: "border-amber-300 bg-amber-500/15",
    baslikRenk: "bg-amber-600",
    ilaclar: [
      { ad: "Diazepam", doz: "0.1–0.3 mg/kg İV / 0.5 mg/kg rektal", not: "Status epileptikus 1. basamak" },
      { ad: "Midazolam", doz: "0.1 mg/kg İV / İM / İN", not: "Damar yolu yoksa nazal uygula" },
      { ad: "Levetirasetam", doz: "20–60 mg/kg İV (maks 4500 mg)", not: "2. basamak; sodyum valproat alternatif" },
    ],
  },
  {
    grup: "Antidotlar",
    renk: "border-teal-300 bg-teal-500/15",
    baslikRenk: "bg-teal-600",
    ilaclar: [
      { ad: "Nalokson", doz: "0.4–2 mg İV/İM/İN", not: "Opioid overdoz; tekrarlayan dozlar gerekebilir" },
      { ad: "Flumazenil", doz: "0.2 mg İV, tekrar 0.1 mg (maks 1 mg)", not: "BZD reversal; nöbet eşiği yükseltebilir" },
      { ad: "Atropin (organofosfat)", doz: "2–4 mg İV her 5–10 dk", not: "Sekreasyonlar kuruyunca dur" },
      { ad: "Glukoz %10", doz: "2 mL/kg İV", not: "Hipoglisemi; şuur kapalıysa önce ver" },
    ],
  },
];

export default function OnaysizIlaclarPage() {
  return (
    <PageShell>
      <AppHeader title="Onaysız Kullanılabilecek İlaçlar" back="/skalalar" icon={<ArrowLeft style={{ width: 16, height: 16 }} />} />

      <main className="flex-1 px-3 sm:px-6 py-4 sm:py-6 w-full max-w-xl mx-auto space-y-5">
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-800">
          <span className="font-black">⚠️ UYARI:</span> Bu liste acil yaşam-kurtarıcı durumlarda hasta onayı alınamadığı hallerde uygulanabilecek ilaçların hatırlatıcı rehberidir. Klinik değerlendirme esastır. Dozlar ideal ya da gerçek vücut ağırlığına göre ayarlanmalıdır.
        </div>

        {ilaclar.map((grup, gi) => (
          <div key={gi} className={`rounded-xl border-2 overflow-hidden ${grup.renk}`}>
            <div className={`${grup.baslikRenk} text-white px-4 py-2.5 text-sm font-black`}>
              {grup.grup}
            </div>
            <div className="divide-y divide-white/50">
              {grup.ilaclar.map((ilac, ii) => (
                <div key={ii} className="px-4 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-black text-white/90">{ilac.ad}</p>
                    <p className="text-xs font-bold text-white/90 text-right shrink-0 max-w-[55%]">{ilac.doz}</p>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{ilac.not}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>
    </PageShell>
  );
}
