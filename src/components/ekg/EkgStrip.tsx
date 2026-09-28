"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Maximize2, Ruler, Lightbulb, X, RotateCw, ZoomIn, ZoomOut } from "lucide-react";
import Caliper from "./Caliper";
import type { UretilmisSerit } from "@/lib/ekg/generator";
import type { StripOverlay } from "@/lib/ekg/cases";

/* ════════════════════════════════════════════════════════════════
   EKG şerit görüntüleyici — gerçek görsel veya üretilmiş SVG.
   • Sabit yükseklikte, yatay kaydırılabilir (mobilde ayrıntı kaybolmaz)
   • Kaliper: üretilmiş şeritte sn ve /dk ölçer, gerçekte pergel
   • Tam ekran görünüm (telefon yatay çevrilince en rahat)
   ════════════════════════════════════════════════════════════════ */

export type StripKaynak =
  | { tur: "gercek"; gorsel: string; genislik: number; yukseklik: number; onikiDerivasyon?: boolean; ipucu?: StripOverlay[]; alt: string }
  | { tur: "uretilmis"; serit: UretilmisSerit; alt: string };

/** Standart EKG kağıdı üzerinde üretilmiş şerit (mm koordinatlı SVG). */
export function EkgKagidi({ serit }: { serit: UretilmisSerit }) {
  const id = useId().replace(/:/g, "");
  const { genislikMm: w, yukseklikMm: h } = serit;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="block w-full h-full" aria-hidden="true">
      <defs>
        <pattern id={`k${id}`} width={1} height={1} patternUnits="userSpaceOnUse">
          <path d="M1 0H0V1" fill="none" stroke="#F4C3CC" strokeWidth={0.06} />
        </pattern>
        <pattern id={`b${id}`} width={5} height={5} patternUnits="userSpaceOnUse">
          <rect width={5} height={5} fill={`url(#k${id})`} />
          <path d="M5 0H0V5" fill="none" stroke="#E07C92" strokeWidth={0.16} />
        </pattern>
      </defs>
      <rect width={w} height={h} fill="#FFF7F8" />
      <rect width={w} height={h} fill={`url(#b${id})`} />
      <path d={serit.path} fill="none" stroke="#1F2937" strokeWidth={0.32} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function StripIcerik({
  kaynak,
  yukseklikPx,
  kaliper,
  ipucu,
}: {
  kaynak: StripKaynak;
  yukseklikPx: number;
  kaliper: boolean;
  ipucu: boolean;
}) {
  if (kaynak.tur === "uretilmis") {
    const { serit } = kaynak;
    const genislikPx = (yukseklikPx * serit.genislikMm) / serit.yukseklikMm;
    return (
      <div className="relative shrink-0" style={{ width: genislikPx, height: yukseklikPx }} role="img" aria-label={kaynak.alt}>
        <EkgKagidi serit={serit} />
        {kaliper && <Caliper width={serit.genislikMm} height={serit.yukseklikMm} mmPerUnit={1} />}
      </div>
    );
  }
  const genislikPx = (yukseklikPx * kaynak.genislik) / kaynak.yukseklik;
  return (
    <div className="relative shrink-0 bg-white" style={{ width: genislikPx, height: yukseklikPx }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={kaynak.gorsel} alt={kaynak.alt} draggable={false} className="block w-full h-full select-none" />
      {ipucu && kaynak.ipucu && (
        <svg viewBox="0 0 1 1" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none">
          {kaynak.ipucu.map((l, i) => (
            <line key={i} x1={l.x0} x2={l.x1} y1={l.y} y2={l.y} stroke="#111827" strokeWidth={4} vectorEffect="non-scaling-stroke" />
          ))}
        </svg>
      )}
      {kaliper && <Caliper width={kaynak.genislik} height={kaynak.yukseklik} />}
    </div>
  );
}

/** Uzun şeridi, basılı ritim şeritleri gibi alt alta satırlara bölerek tamamını gösterir. */
function SatirliSerit({ kaynak, genislikPx, satir, ipucu }: { kaynak: StripKaynak; genislikPx: number; satir: number; ipucu: boolean }) {
  const oran = kaynak.tur === "gercek" ? kaynak.genislik / kaynak.yukseklik : kaynak.serit.genislikMm / kaynak.serit.yukseklikMm;
  const tamGenislik = genislikPx * satir;
  const yukseklik = tamGenislik / oran;
  return (
    <div className="divide-y-2 divide-rose-200">
      {Array.from({ length: satir }, (_, k) => (
        <div key={k} className="relative overflow-hidden" style={{ width: genislikPx, height: yukseklik }} aria-hidden={k > 0}>
          <div className="absolute top-0" style={{ left: -k * genislikPx }}>
            <StripIcerik kaynak={kaynak} yukseklikPx={yukseklik} kaliper={false} ipucu={ipucu} />
          </div>
        </div>
      ))}
    </div>
  );
}

interface EkgStripProps {
  kaynak: StripKaynak;
  /** Şerit üstünde gösterilecek küçük etiket (ör. "Gerçek vaka · Slayt 17") */
  etiket?: ReactNode;
  className?: string;
}

export default function EkgStrip({ kaynak, etiket, className = "" }: EkgStripProps) {
  const [kaliper, setKaliper] = useState(false);
  const [ipucu, setIpucu] = useState(false);
  const [tamEkran, setTamEkran] = useState(false);

  const [yakin, setYakin] = useState(false);
  const kutuRef = useRef<HTMLDivElement>(null);
  const [kutuGenislik, setKutuGenislik] = useState(0);

  const oniki = kaynak.tur === "gercek" && kaynak.onikiDerivasyon;
  const oran =
    kaynak.tur === "gercek" ? kaynak.genislik / kaynak.yukseklik : kaynak.serit.genislikMm / kaynak.serit.yukseklikMm;
  // Varsayılan görünüm: şeridin tamamı kutuya sığar; satır yüksekliği okunamayacak kadar
  // düşerse şerit 2–3 satıra bölünür. Kaliper açıkken ya da yakınlaştırınca tek satır,
  // yatay kaydırmalı ve büyük gösterilir.
  const MIN_SATIR = 80;
  const satir = kutuGenislik ? Math.min(3, Math.max(1, Math.ceil((MIN_SATIR * oran) / kutuGenislik))) : 1;
  const kaydirmali = yakin || kaliper || !kutuGenislik;
  const yukseklik = yakin ? (oniki ? 520 : 240) : oniki ? 340 : 170;
  const ipucuVar = kaynak.tur === "gercek" && !!kaynak.ipucu?.length;

  useEffect(() => {
    const el = kutuRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setKutuGenislik(Math.floor(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!tamEkran) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setTamEkran(false); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [tamEkran]);

  const araclar = (
    <div className="flex items-center gap-1.5">
      {ipucuVar && (
        <button
          type="button"
          onClick={() => setIpucu(v => !v)}
          aria-pressed={ipucu}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition-all ${
            ipucu ? "bg-amber-500/20 text-amber-400 border-amber-500/40" : "text-muted border-white/10 hover:bg-white/5"
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5" /> PR işaretleri
        </button>
      )}
      <button
        type="button"
        onClick={() => setYakin(v => !v)}
        aria-pressed={yakin}
        aria-label={yakin ? "Uzaklaştır" : "Yakınlaştır"}
        title={yakin ? "Uzaklaştır" : "Yakınlaştır"}
        className={`flex items-center px-2 py-1.5 rounded-lg border transition-all ${
          yakin ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40" : "text-muted border-white/10 hover:bg-white/5"
        }`}
      >
        {yakin ? <ZoomOut className="w-3.5 h-3.5" /> : <ZoomIn className="w-3.5 h-3.5" />}
      </button>
      <button
        type="button"
        onClick={() => setKaliper(v => !v)}
        aria-pressed={kaliper}
        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition-all ${
          kaliper ? "bg-sky-500/20 text-sky-400 border-sky-500/40" : "text-muted border-white/10 hover:bg-white/5"
        }`}
      >
        <Ruler className="w-3.5 h-3.5" /> Kaliper
      </button>
      <button
        type="button"
        onClick={() => setTamEkran(true)}
        aria-label="Tam ekran"
        className="flex items-center px-2 py-1.5 rounded-lg text-muted border border-white/10 hover:bg-white/5"
      >
        <Maximize2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 text-[10px] font-bold uppercase tracking-widest text-subtle truncate">{etiket}</div>
        {araclar}
      </div>

      <div
        ref={kutuRef}
        className="rounded-xl overflow-x-auto overflow-y-hidden border border-white/10 bg-white overscroll-x-contain"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {kaydirmali ? (
          <StripIcerik kaynak={kaynak} yukseklikPx={yukseklik} kaliper={kaliper} ipucu={ipucu} />
        ) : (
          <SatirliSerit kaynak={kaynak} genislikPx={kutuGenislik} satir={satir} ipucu={ipucu} />
        )}
      </div>

      {kaliper && (
        <p className="text-[10px] text-subtle leading-relaxed">
          {kaynak.tur === "uretilmis"
            ? "Bacakları iki R dalgasının tepesine getirin: süre ve hız otomatik hesaplanır. Ortadaki noktadan sürükleyerek aralığı şerit boyunca kaydırıp düzenliliği kontrol edin."
            : "Pergel modu: bacakları bir R-R aralığına ayarlayın, ortadaki noktadan sürükleyerek aynı aralığı diğer atımlarla karşılaştırın."}
        </p>
      )}

      {tamEkran && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="EKG şeridi tam ekran"
          className="fixed inset-0 z-[120] flex flex-col"
          style={{ background: "var(--bg)" }}
        >
          <div className="flex items-center justify-between gap-2 px-4 py-3 border-b" style={{ borderColor: "var(--glass-border)" }}>
            <p className="text-xs font-bold text-muted truncate">{etiket}</p>
            <div className="flex items-center gap-2">
              {araclar}
              <button
                type="button"
                onClick={() => setTamEkran(false)}
                aria-label="Kapat"
                className="p-2 rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex-1 flex items-center overflow-auto p-3">
            <div className="rounded-xl overflow-x-auto overflow-y-hidden bg-white mx-auto max-w-full">
              <StripIcerik
                kaynak={kaynak}
                yukseklikPx={oniki ? 560 : 300}
                kaliper={kaliper}
                ipucu={ipucu}
              />
            </div>
          </div>
          <p className="sm:hidden flex items-center justify-center gap-1.5 pb-4 text-[11px] text-subtle">
            <RotateCw className="w-3.5 h-3.5" /> Daha geniş görünüm için telefonu yatay çevirin
          </p>
        </div>
      )}
    </div>
  );
}
