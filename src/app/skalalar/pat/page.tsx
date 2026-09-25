"use client";
import { useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { AppHeader } from "@/components/layout/AppHeader";
import { ArrowLeft } from "lucide-react";

type Status = "normal" | "abnormal" | null;

interface TriangleSide {
  key: string;
  title: string;
  subtitle: string;
  icon: string;
  normalLabel: string;
  abnormalLabel: string;
  normalDesc: string;
  abnormalDesc: string;
}

const sides: TriangleSide[] = [
  {
    key: "gorunum",
    title: "Görünüm (A)",
    subtitle: "Appearance",
    icon: "👁️",
    normalLabel: "Normal",
    abnormalLabel: "Anormal",
    normalDesc: "Dikkatini çekiyor, göz teması kuruyor, hareketleri yaşına uygun",
    abnormalDesc: "Donuk bakış, cevapsız, aşırı irritabilite veya senkop",
  },
  {
    key: "solunum",
    title: "Solunum Eforu (B)",
    subtitle: "Work of Breathing",
    icon: "🫁",
    normalLabel: "Normal",
    abnormalLabel: "Artmış / Azalmış",
    normalDesc: "Sessiz solunum, normal hız ve derinlik, yardımcı kas yok",
    abnormalDesc: "İnterkostat çekilme, burun kanadı, trakea çekimi, sesli solunum, apne",
  },
  {
    key: "dolasim",
    title: "Dolaşım (C)",
    subtitle: "Circulation",
    icon: "🩸",
    normalLabel: "Normal",
    abnormalLabel: "Bozuk",
    normalDesc: "Pembe/normal cilt rengi, kapiller dolum ≤2 sn",
    abnormalDesc: "Soluk, siyanotik, benekli cilt; kapiller dolum >2 sn; mottling",
  },
];

type Interpretation = {
  title: string;
  desc: string;
  bg: string;
  text: string;
  urgency: string;
};

function getInterpretation(statuses: Record<string, Status>): Interpretation | null {
  const vals = sides.map((s) => statuses[s.key]);
  if (vals.some((v) => v === null)) return null;

  const a = statuses["gorunum"];
  const b = statuses["solunum"];
  const c = statuses["dolasim"];

  if (a === "normal" && b === "normal" && c === "normal") {
    return {
      title: "Stabil",
      desc: "Tüm parametreler normal. Vital bulguları izle, gerekirse daha detaylı değerlendir.",
      bg: "bg-emerald-500/15 border-emerald-500/30",
      text: "text-emerald-800",
      urgency: "🟢",
    };
  }
  if (a === "abnormal" && b === "normal" && c === "normal") {
    return {
      title: "Primer CNS / Metabolik Sorun",
      desc: "Solunum ve dolaşım düzeltilmiş, ancak görünüm bozuk. Nörolojik veya metabolik etiyoloji araştır.",
      bg: "bg-amber-500/15 border-amber-500/30",
      text: "text-amber-800",
      urgency: "🟡",
    };
  }
  if (a === "normal" && b === "abnormal" && c === "normal") {
    return {
      title: "Kompanse Solunum Sıkıntısı",
      desc: "Solunum eforu artmış fakat dolaşım yeterli. Oksijen, monitörizasyon ve yakın takip.",
      bg: "bg-orange-500/20",
      text: "text-orange-800",
      urgency: "🟠",
    };
  }
  if (a === "normal" && b === "normal" && c === "abnormal") {
    return {
      title: "Şok (Kompanse)",
      desc: "Dolaşım bozuk fakat solunum eforu normal. Sıvı, vazoaktif ajan, akut şok yönetimi.",
      bg: "bg-orange-500/20",
      text: "text-orange-800",
      urgency: "🟠",
    };
  }
  if (a === "abnormal" && b === "abnormal" && c === "normal") {
    return {
      title: "Solunum Yetmezliği",
      desc: "Görünüm ve solunum bozuk. Kompansasyon yetersiz hale geliyor. Acil hava yolu değerlendirmesi.",
      bg: "bg-red-500/15 border-red-500/30",
      text: "text-red-800",
      urgency: "🔴",
    };
  }
  if (a === "abnormal" && b === "normal" && c === "abnormal") {
    return {
      title: "Dekompanse Şok",
      desc: "Görünüm ve dolaşım bozuk. İleri şok. Hızlı resüsitasyon, İV/İO yol, acil müdahale.",
      bg: "bg-red-500/15 border-red-500/30",
      text: "text-red-800",
      urgency: "🔴",
    };
  }
  if (a === "normal" && b === "abnormal" && c === "abnormal") {
    return {
      title: "Kardiyopulmoner Yetmezlik (Erken)",
      desc: "Solunum ve dolaşım bozuk. Görünüm henüz normal ancak arrest riski yüksek.",
      bg: "bg-red-200",
      text: "text-red-900",
      urgency: "🔴",
    };
  }
  // a=abnormal, b=abnormal, c=abnormal
  return {
    title: "KARDİYOPULMONER ARREST RİSKİ",
    desc: "Tüm parametreler bozuk! Acil resüsitasyon — havayolu, solunum, dolaşım yönetimi başlat.",
    bg: "bg-red-700",
    text: "text-white",
    urgency: "🚨",
  };
}

// ─── Tablo verisi ─────────────────────────────────────────────────────────────
const gorunumMaddeler = [
  { harf: "Ç", aciklama: "Çevre ile iletişim" },
  { harf: "A", aciklama: "Avutulabilirlik" },
  { harf: "B", aciklama: "Bakış / Göz teması" },
  { harf: "U", aciklama: "Uygun konuşma ve ağlama" },
  { harf: "K", aciklama: "Kas tonusu" },
];

const solunumMaddeler = [
  "Anormal solunum sesleri",
  "Anormal pozisyon",
  "Çekilmeler",
  "Burun kanadı solunumu",
  "Solunumla kafanın sallanması",
];

const ciltMaddeler = [
  "Solukluk",
  "Aşırı terli cilt",
  "Benekli ve alacalı görünüm",
  "Siyanoz",
];

export default function PATPage() {
  const [statuses, setStatuses] = useState<Record<string, Status>>({
    gorunum: null,
    solunum: null,
    dolasim: null,
  });

  const interpretation = getInterpretation(statuses);

  const setStatus = (key: string, val: Status) => {
    setStatuses((prev) => ({ ...prev, [key]: prev[key] === val ? null : val }));
  };

  return (
    <PageShell>
      <AppHeader title="Çocuk Değerlendirme Üçgeni (PAT)" back="/skalalar" icon={<ArrowLeft style={{ width: 16, height: 16 }} />} />

      <main className="flex-1 px-3 sm:px-6 py-4 sm:py-6 w-full max-w-xl mx-auto space-y-4">
        {/* ── Referans Tablo ── */}
        <div className="glass-card rounded-2xl border border-white/10 shadow-sm overflow-hidden">
          <div className="bg-slate-700 text-white text-center text-xs font-extrabold uppercase tracking-widest py-2.5 px-4">
            Çocuk Değerlendirme Üçgeni
          </div>
          {/* Sütun Başlıkları */}
          <div className="grid grid-cols-3 divide-x divide-white/10 bg-white/5 border-b border-white/10">
            <div className="px-3 py-2 text-[11px] font-extrabold text-white/90 uppercase tracking-wide text-center">Görünüm</div>
            <div className="px-3 py-2 text-[11px] font-extrabold text-white/90 uppercase tracking-wide text-center">Solunum Çabası</div>
            <div className="px-3 py-2 text-[11px] font-extrabold text-white/90 uppercase tracking-wide text-center">Cilt Dolaşım</div>
          </div>
          {/* 5 satır */}
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`grid grid-cols-3 divide-x divide-white/10 border-b border-white/10 ${i % 2 === 1 ? "bg-white/5" : "glass-card"}`}
            >
              {/* Görünüm */}
              <div className="px-3 py-2.5 flex items-start gap-1.5">
                <span className="shrink-0 w-5 h-5 rounded-full bg-indigo-100 text-indigo-400 text-[11px] font-black flex items-center justify-center leading-none">
                  {gorunumMaddeler[i].harf}
                </span>
                <span className="text-[12px] text-white/90 leading-snug font-medium">
                  {gorunumMaddeler[i].aciklama}
                </span>
              </div>
              {/* Solunum Çabası */}
              <div className="px-3 py-2.5">
                <span className="text-[12px] text-white/90 leading-snug font-medium">
                  {solunumMaddeler[i]}
                </span>
              </div>
              {/* Cilt Dolaşım */}
              <div className="px-3 py-2.5">
                {ciltMaddeler[i] ? (
                  <span className="text-[12px] text-white/90 leading-snug font-medium">
                    {ciltMaddeler[i]}
                  </span>
                ) : (
                  <span className="text-[12px] text-slate-300">—</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Üçgen görsel */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-4 text-white text-center">
          <p className="text-xs font-bold uppercase tracking-wider opacity-80 mb-1">Pediatric Assessment Triangle</p>
          <div className="flex justify-center gap-4 mt-2">
            {["Görünüm (A)", "Solunum (B)", "Dolaşım (C)"].map((l) => (
              <div key={l} className="text-center">
                <div className="text-[10px] font-bold opacity-70">{l}</div>
              </div>
            ))}
          </div>
          <p className="text-[11px] opacity-70 mt-2">Her kenarı değerlendirerek hasta durumunu belirle</p>
        </div>

        {/* Üçgen kenarları */}
        {sides.map((side) => {
          const current = statuses[side.key];
          return (
            <div key={side.key} className="glass-card rounded-xl border border-white/10  overflow-hidden">
              <div className="bg-indigo-500/150/15 text-indigo-400 border-b border-white/10 px-4 py-2.5 flex items-center gap-2">
                <span className="text-base">{side.icon}</span>
                <div>
                  <p className="text-sm font-black leading-tight">{side.title}</p>
                  <p className="text-[10px] opacity-70">{side.subtitle}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 divide-x divide-white/10">
                <button
                  onClick={() => setStatus(side.key, "normal")}
                  className={`p-3 text-left transition-colors ${current === "normal" ? "bg-emerald-500/15" : "glass-hover hover:bg-white/5"}`}
                >
                  <div className={`flex items-center gap-1.5 mb-1`}>
                    <div className={`w-3 h-3 rounded-full border-2 flex items-center justify-center ${current === "normal" ? "bg-emerald-500 border-emerald-500" : "border-white/10"}`}>
                      {current === "normal" && <div className="w-1.5 h-1.5 rounded-full glass-card" />}
                    </div>
                    <p className={`text-xs font-black ${current === "normal" ? "text-emerald-400" : "text-white/90"}`}>{side.normalLabel}</p>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-snug">{side.normalDesc}</p>
                </button>
                <button
                  onClick={() => setStatus(side.key, "abnormal")}
                  className={`p-3 text-left transition-colors ${current === "abnormal" ? "bg-red-500/15" : "glass-hover hover:bg-white/5"}`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className={`w-3 h-3 rounded-full border-2 flex items-center justify-center ${current === "abnormal" ? "bg-red-500 border-red-500" : "border-white/10"}`}>
                      {current === "abnormal" && <div className="w-1.5 h-1.5 rounded-full glass-card" />}
                    </div>
                    <p className={`text-xs font-black ${current === "abnormal" ? "text-red-400" : "text-white/90"}`}>{side.abnormalLabel}</p>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-snug">{side.abnormalDesc}</p>
                </button>
              </div>
            </div>
          );
        })}

        {/* Sonuç */}
        {interpretation && (
          <div className={`${interpretation.bg} rounded-xl p-4`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{interpretation.urgency}</span>
              <p className={`text-sm font-black ${interpretation.text}`}>{interpretation.title}</p>
            </div>
            <p className={`text-xs leading-relaxed ${interpretation.text} opacity-90`}>{interpretation.desc}</p>
          </div>
        )}
      </main>
    </PageShell>
  );
}
