import { PageShell } from "@/components/layout/PageShell";
import { AppHeader } from "@/components/layout/AppHeader";
import { ArrowLeft } from "lucide-react";

const lmaSizes = [
  {
    numara: "1",
    kilo: "< 5 kg",
    kiloPrecise: "≤ 4 kg",
    maxKaf: "4 mL",
    etTube: "3.5 mm",
    note: "Yenidoğan / Prematür",
    color: "border-pink-300 bg-pink-500/15",
    badge: "bg-pink-500",
    textColor: "text-pink-800",
  },
  {
    numara: "1.5",
    kilo: "5–10 kg",
    kiloPrecise: "5–10 kg",
    maxKaf: "7 mL",
    etTube: "4.0 mm",
    note: "İnfant",
    color: "border-purple-300 bg-purple-500/15",
    badge: "bg-purple-500",
    textColor: "text-purple-800",
  },
  {
    numara: "2",
    kilo: "10–20 kg",
    kiloPrecise: "10–20 kg",
    maxKaf: "10 mL",
    etTube: "4.5 mm",
    note: "Küçük çocuk",
    color: "border-blue-300 bg-blue-500/15",
    badge: "bg-blue-500/150",
    textColor: "text-blue-800",
  },
  {
    numara: "2.5",
    kilo: "20–30 kg",
    kiloPrecise: "20–30 kg",
    maxKaf: "14 mL",
    etTube: "5.0 mm",
    note: "Büyük çocuk",
    color: "border-teal-300 bg-teal-500/15",
    badge: "bg-teal-500/150",
    textColor: "text-teal-800",
  },
  {
    numara: "3",
    kilo: "30–50 kg",
    kiloPrecise: "30–50 kg",
    maxKaf: "20 mL",
    etTube: "6.0 mm",
    note: "Küçük yetişkin",
    color: "border-green-300 bg-green-50",
    badge: "bg-green-600",
    textColor: "text-green-800",
  },
  {
    numara: "4",
    kilo: "50–70 kg",
    kiloPrecise: "50–70 kg",
    maxKaf: "30 mL",
    etTube: "6.0 mm",
    note: "Orta yetişkin",
    color: "border-amber-300 bg-amber-500/15",
    badge: "bg-amber-500",
    textColor: "text-amber-800",
  },
  {
    numara: "5",
    kilo: "70–100 kg",
    kiloPrecise: "70–100 kg",
    maxKaf: "40 mL",
    etTube: "7.0 mm",
    note: "Büyük yetişkin",
    color: "border-orange-300 bg-orange-500/15",
    badge: "bg-orange-500",
    textColor: "text-orange-800",
  },
];

export default function LMAPage() {
  return (
    <PageShell>
      <AppHeader title="LMA — Laringeal Maske" back="/skalalar" icon={<ArrowLeft style={{ width: 16, height: 16 }} />} />

      <main className="flex-1 px-3 sm:px-6 py-4 sm:py-6 w-full max-w-xl mx-auto space-y-4">
        {/* Bilgi */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-3.5">
          <p className="text-xs font-bold text-green-800 uppercase tracking-wide mb-1">LMA Numara Seçimi</p>
          <p className="text-[11px] text-green-700 leading-relaxed">
            Hastanın kilogram cinsinden vücut ağırlığına göre uygun numarayı seç. Kaf basıncını 60 cmH₂O'yu geçmeyecek şekilde şişir.
          </p>
        </div>

        {/* LMA Boyutları */}
        <div className="space-y-2.5">
          {lmaSizes.map((size) => (
            <div
              key={size.numara}
              className={`rounded-xl border-2 p-3.5 ${size.color}`}
            >
              <div className="flex items-center gap-3">
                {/* Numara badge */}
                <div className={`${size.badge} text-white w-11 h-11 rounded-xl flex items-center justify-center font-black text-base shrink-0`}>
                  {size.numara}
                </div>

                {/* Bilgiler */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className={`text-sm font-black ${size.textColor}`}>{size.kilo}</p>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${size.badge} text-white opacity-80`}>{size.note}</span>
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold">Maks Kaf</p>
                      <p className={`text-xs font-black ${size.textColor}`}>{size.maxKaf}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold">ETT Geçiş</p>
                      <p className={`text-xs font-black ${size.textColor}`}>{size.etTube}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Notlar */}
        <div className="bg-slate-800 rounded-xl p-4 text-white">
          <p className="text-xs font-black uppercase tracking-wide mb-3 opacity-70">Uygulama İpuçları</p>
          <div className="space-y-2">
            {[
              "Kafi tamamen söndür, cihazı ağız tabanı boyunca kaydır",
              "Kaf şişirildiğinde cihaz hafifçe dışarı çıkıyorsa yeniden pozisyonla",
              "Gastrik tüp geçişine izin veren i-gel/Proseal modeli tercih et",
              "Kaf basıncını manometre ile ≤60 cmH₂O kontrol et",
              "RSI'da roküronyum kullanıldıysa sugammadeks hazır bulundur",
            ].map((tip, i) => (
              <div key={i} className="flex gap-2 items-start">
                <span className="text-teal-400 font-black text-xs shrink-0 mt-0.5">{i + 1}.</span>
                <p className="text-xs text-slate-300 leading-snug">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
          <span className="font-bold">⚠️</span> LMA kesin hava yolu güvencesi sağlamaz. Yüksek aspirasyon riski veya pulmoner kompliyans düşüklüğünde ETT tercih edilmeli.
        </div>
      </main>
    </PageShell>
  );
}
