"use client";

import { useMemo, useState, type ReactNode } from "react";
import { CheckCircle2, Eye, RotateCcw, XCircle } from "lucide-react";
import EkgStrip from "../EkgStrip";
import { RITIMLER, DEGERLENDIRME_ADIMLARI, type RitimId } from "@/lib/ekg/rhythms";
import { gercekVakaByRitim } from "@/lib/ekg/cases";

/* ───────────── Yapı taşları ───────────── */

export function Bolum({ baslik, altBaslik, children, slayt }: { baslik: string; altBaslik?: string; children: ReactNode; slayt?: string }) {
  return (
    <section className="glass-card p-4 sm:p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-extrabold leading-snug">{baslik}</h2>
          {altBaslik && <p className="text-xs text-muted mt-0.5">{altBaslik}</p>}
        </div>
        {slayt && <span className="shrink-0 text-[11px] font-bold text-subtle">Slayt {slayt}</span>}
      </div>
      {children}
    </section>
  );
}

export function Maddeler({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map(m => (
        <li key={m} className="text-sm leading-relaxed flex gap-2.5">
          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
          <span>{m}</span>
        </li>
      ))}
    </ul>
  );
}

export function Figur({
  src,
  alt,
  genislik,
  yukseklik,
  aciklama,
  maxH,
}: {
  src: string;
  alt: string;
  genislik: number;
  yukseklik: number;
  aciklama?: string;
  maxH?: number;
}) {
  return (
    <figure className="space-y-1.5">
      <div className="rounded-xl overflow-hidden bg-white border border-white/10 flex justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          width={genislik}
          height={yukseklik}
          loading="lazy"
          className="block w-full h-auto object-contain"
          style={maxH ? { maxHeight: maxH, width: "auto", maxWidth: "100%" } : undefined}
        />
      </div>
      {aciklama && <figcaption className="text-[11px] text-subtle leading-relaxed">{aciklama}</figcaption>}
    </figure>
  );
}

export function Bilgi({ children, renk = "sky" }: { children: ReactNode; renk?: "sky" | "amber" | "red" | "emerald" }) {
  const c = {
    sky: "text-sky-200/90 bg-sky-500/10 border-sky-500/25",
    amber: "text-amber-200/90 bg-amber-500/10 border-amber-500/25",
    red: "text-red-200/90 bg-red-500/10 border-red-500/25",
    emerald: "text-emerald-200/90 bg-emerald-500/10 border-emerald-500/25",
  }[renk];
  return <div className={`rounded-xl border px-3.5 py-2.5 text-xs leading-relaxed ${c}`}>{children}</div>;
}

/* ───────────── Kaynaktaki bir vakayı adım adım inceleme ───────────── */

export function VakaInceleme({ ritimId }: { ritimId: RitimId }) {
  const vaka = gercekVakaByRitim(ritimId);
  const r = RITIMLER[ritimId];
  const [acik, setAcik] = useState(0); // açılan adım sayısı

  if (!vaka) return null;
  const degerler = [
    vaka.kaynakTablo.ritim,
    `${vaka.kaynakTablo.hiz} (${vaka.hizHesabi} ≈ ${vaka.hiz}/dk)`,
    vaka.kaynakTablo.pDalgasi,
    vaka.kaynakTablo.pQrs,
    vaka.kaynakTablo.qrs,
  ];
  const tamam = acik > DEGERLENDIRME_ADIMLARI.length;

  return (
    <div className="space-y-3">
      <EkgStrip
        kaynak={{
          tur: "gercek",
          gorsel: vaka.gorsel,
          genislik: vaka.genislik,
          yukseklik: vaka.yukseklik,
          onikiDerivasyon: vaka.onikiDerivasyon,
          ipucu: vaka.ipucuCizgileri,
          alt: `Slayt ${vaka.kaynakSlayt} EKG şeridi`,
        }}
        etiket={`Kaynak vaka · Slayt ${vaka.kaynakSlayt}`}
      />

      <ol className="space-y-1.5">
        {DEGERLENDIRME_ADIMLARI.map((a, i) => {
          const gorunur = i < acik;
          return (
            <li key={a.key} className="rounded-xl border border-white/10 bg-black/[0.03] dark:bg-black/20 px-3 py-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold">
                  {i + 1}. {a.baslik}
                </span>
                {!gorunur && i === acik && (
                  <span className="text-[11px] text-subtle">Önce kendiniz değerlendirin</span>
                )}
              </div>
              {gorunur ? (
                <p className="text-xs font-semibold text-emerald-300 mt-1 animate-in fade-in">{degerler[i]}</p>
              ) : (
                i === acik && <p className="text-[11px] text-muted mt-0.5">{a.ipucu}</p>
              )}
            </li>
          );
        })}
      </ol>

      {tamam ? (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-3 animate-in fade-in">
          <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-400">Tanı</p>
          <p className="text-sm font-black mt-0.5">{vaka.kaynakTablo.tani}</p>
          <button type="button" onClick={() => setAcik(0)} className="mt-2 flex items-center gap-1 text-[11px] font-bold text-muted">
            <RotateCcw className="w-3 h-3" /> Baştan incele
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAcik(a => a + 1)}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 active:scale-[0.98] transition-transform"
        >
          <Eye className="w-3.5 h-3.5" />
          {acik < DEGERLENDIRME_ADIMLARI.length ? `${acik + 1}. adımı göster: ${DEGERLENDIRME_ADIMLARI[acik].baslik}` : "Tanıyı göster"}
        </button>
      )}

      {tamam && (
        <ul className="space-y-1">
          {r.aciklama.map(a => (
            <li key={a} className="text-xs text-muted leading-relaxed flex gap-2">
              <span className="text-emerald-400 shrink-0">•</span>
              {a}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ───────────── Özet eşleştirme oyunu (slayt 30 / 36) ───────────── */

export function Eslestirme({ ciftler, baslik }: { ciftler: { sol: string; sag: string }[]; baslik: string }) {
  const [tur, setTur] = useState(0);
  // Deterministik karıştırma (hydration uyumlu): hiçbir öğe karşısında kalmaz, her turda farklı
  const sagSira = useMemo(() => {
    const n = ciftler.length;
    const k = (tur % Math.max(1, n - 1)) + 1;
    return ciftler.map((_, i) => (i + k) % n).reverse();
  }, [ciftler, tur]);
  const [secSol, setSecSol] = useState<number | null>(null);
  const [eslesen, setEslesen] = useState<Set<number>>(new Set());
  const [hata, setHata] = useState<number | null>(null);

  const sagTikla = (i: number) => {
    if (secSol === null || eslesen.has(i)) return;
    if (i === secSol) {
      setEslesen(s => new Set(s).add(i));
      setSecSol(null);
      setHata(null);
    } else {
      setHata(i);
      setTimeout(() => setHata(null), 600);
    }
  };

  const bitti = eslesen.size === ciftler.length;

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted">{baslik} — önce soldan bir bulgu, sonra sağdan karşılığını seçin.</p>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
          {ciftler.map((c, i) => (
            <button
              key={c.sol}
              type="button"
              disabled={eslesen.has(i)}
              onClick={() => setSecSol(i)}
              className={`w-full text-left px-3 py-2.5 rounded-xl border text-xs font-semibold transition ${
                eslesen.has(i)
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                  : secSol === i
                    ? "border-amber-500/60 bg-amber-500/15 text-amber-300"
                    : "border-white/10 bg-black/[0.03] dark:bg-black/20 hover:bg-white/5"
              }`}
            >
              {c.sol}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          {sagSira.map(i => (
            <button
              key={ciftler[i].sag}
              type="button"
              disabled={eslesen.has(i)}
              onClick={() => sagTikla(i)}
              className={`w-full text-left px-3 py-2.5 rounded-xl border text-xs font-semibold transition ${
                eslesen.has(i)
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                  : hata === i
                    ? "border-red-500/60 bg-red-500/15 text-red-300 t-shake"
                    : "border-white/10 bg-black/[0.03] dark:bg-black/20 hover:bg-white/5"
              }`}
            >
              {ciftler[i].sag}
            </button>
          ))}
        </div>
      </div>
      {bitti && (
        <div className="flex items-center justify-between gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 animate-in fade-in">
          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
            <CheckCircle2 className="w-4 h-4 t-icon-in" /> Tümü doğru eşleşti
          </span>
          <button
            type="button"
            onClick={() => { setEslesen(new Set()); setTur(t => t + 1); }}
            className="text-[11px] font-bold text-muted flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" /> Tekrar
          </button>
        </div>
      )}
    </div>
  );
}

/* ───────────── Tek soruluk hızlı kontrol ───────────── */

export function HizliSoru({ soru, secenekler, dogru, aciklama }: { soru: string; secenekler: string[]; dogru: string; aciklama: string }) {
  const [secim, setSecim] = useState<string | null>(null);
  return (
    <div className="rounded-xl border border-white/10 bg-black/[0.03] dark:bg-black/20 p-3 space-y-2">
      <p className="text-sm font-bold">{soru}</p>
      <div className="flex flex-wrap gap-2">
        {secenekler.map(s => {
          const kilit = secim !== null;
          const cls =
            kilit && s === dogru
              ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-300"
              : kilit && s === secim
                ? "border-red-500/50 bg-red-500/15 text-red-300 t-shake"
                : "border-white/10 hover:bg-white/5";
          return (
            <button key={s} type="button" disabled={kilit} onClick={() => setSecim(s)} className={`min-h-11 px-3 py-2 rounded-lg border text-xs font-bold transition-colors ${cls}`}>
              {s}
            </button>
          );
        })}
      </div>
      {secim !== null && (
        <p role="status" className={`flex items-start gap-1.5 text-xs animate-in fade-in ${secim === dogru ? "text-emerald-300" : "text-red-300"}`}>
          {secim === dogru ? <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0 t-icon-in" /> : <XCircle className="w-3.5 h-3.5 mt-0.5 shrink-0 t-icon-in" />}
          <span>
            {secim === dogru ? "Doğru. " : `Yanlış — doğru cevap: ${dogru}. `}
            {aciklama}
          </span>
        </p>
      )}
    </div>
  );
}
