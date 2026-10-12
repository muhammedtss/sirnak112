"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Hand, ImageIcon, RotateCcw, Undo2 } from "lucide-react";
import { SchemaLightbox } from "@/components/algorithm/AlgorithmViewer";
import { getAlgorithmImages } from "@/data/algorithmImages";
import { hedefKategorisi } from "@/lib/algoritma";
import { JUMP_START, KOD_SIRASI, KODLAR, START, yurut, type TriajAkisi, type TriajKodu } from "@/lib/triaj";

const AKISLAR: Record<TriajAkisi["id"], TriajAkisi> = { start: START, "jump-start": JUMP_START };

/** Triyaj kartı renkleri (klinik durum rengi; beyaz metinle ≥4,5:1, sarıda koyu metin). */
const KOD_STIL: Record<TriajKodu, { bg: string; fg: string; kenar?: string }> = {
  kirmizi: { bg: "#DC2626", fg: "#FFFFFF" },
  sari: { bg: "#FACC15", fg: "#1C1917" },
  yesil: { bg: "#15803D", fg: "#FFFFFF" },
  siyah: { bg: "#0B0B0F", fg: "#FFFFFF", kenar: "rgba(255,255,255,0.28)" },
};

const buyuk = (s: string) => s.toLocaleUpperCase("tr-TR");

/**
 * START / Jump START: vaka protokolü gibi adım adım ilerleyen, her adımda tek dokunuşla
 * cevaplanan triyaj akışı. Sonuç renk koduyla gösterilir; "Algoritmayı Gör" resmi akış
 * şemasını (Anahtar Noktalar + Akış Şeması) yakınlaştırılabilir görüntüleyicide açar.
 */
export function TriajEkrani({ akisId }: { akisId: TriajAkisi["id"] }) {
  const akis = AKISLAR[akisId];
  const [cevaplar, setCevaplar] = useState<number[]>([]);
  const [semaAcik, setSemaAcik] = useState(false);
  const sonRef = useRef<HTMLDivElement>(null);
  const ilkCizim = useRef(true);

  const { adimlar, kod } = yurut(akis, cevaplar);
  const semalar = getAlgorithmImages(akis.algoritmaId);
  const kategori = hedefKategorisi(akis.algoritmaId) ?? "eriskin";
  const semaKapat = useCallback(() => setSemaAcik(false), []);

  // Yeni adım ya da sonuç görünür alana gelsin (ilk açılışta kaydırma yok)
  useEffect(() => {
    if (ilkCizim.current) {
      ilkCizim.current = false;
      return;
    }
    const azHareket = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    sonRef.current?.scrollIntoView({ behavior: azHareket ? "auto" : "smooth", block: "end" });
  }, [cevaplar]);

  /** i. adımda j. seçenek: sonraki cevaplar silinir, akış oradan devam eder. */
  const sec = (i: number, j: number) => setCevaplar(onceki => [...onceki.slice(0, i), j]);

  return (
    <>
      {semaAcik && semalar.length > 0 && <SchemaLightbox images={semalar} title={`${akis.ad} Triyaj`} onClose={semaKapat} />}

      <div className="w-full max-w-2xl mx-auto px-4 pt-4 pb-24 flex flex-col gap-6">
        {/* ── Başlık ── */}
        <section className="glass-card p-4 flex flex-col gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-subtle">Kitlesel olay · Yerinde triyaj</p>
            <h2 className="text-xl font-extrabold leading-tight mt-0.5">{akis.ad} Triyaj</h2>
            <p className="text-xs text-muted mt-1">{akis.altBaslik}</p>
          </div>
          {akis.kapsam && (
            <p className="text-xs font-semibold leading-relaxed text-pretty rounded-xl px-3 py-2.5" style={{ background: "color-mix(in srgb, var(--warning) 12%, transparent)", border: "1px solid color-mix(in srgb, var(--warning) 35%, transparent)" }}>
              {akis.kapsam}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            {semalar.length > 0 && (
              <button
                type="button"
                onClick={() => setSemaAcik(true)}
                className="inline-flex items-center gap-1.5 min-h-11 text-sm font-bold px-4 rounded-full active:scale-[0.97] transition"
                style={{ background: "rgba(59,130,246,0.15)", color: "var(--info-text)", border: "1px solid rgba(59,130,246,0.3)" }}
              >
                <ImageIcon aria-hidden="true" style={{ width: 16, height: 16 }} strokeWidth={2.4} />
                Algoritmayı Gör
                {semalar.length > 1 && (
                  <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full leading-none tabular-nums" style={{ background: "rgba(59,130,246,0.3)" }}>
                    {semalar.length}
                  </span>
                )}
              </button>
            )}
            {cevaplar.length > 0 && (
              <button
                type="button"
                onClick={() => setCevaplar([])}
                className="inline-flex items-center gap-1.5 min-h-11 text-sm font-bold px-4 rounded-full active:scale-[0.97] transition"
                style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}
              >
                <RotateCcw aria-hidden="true" style={{ width: 15, height: 15 }} strokeWidth={2.4} />
                Yeni yaralı
              </button>
            )}
          </div>
        </section>

        {/* ── Akış ── */}
        <ol className="flex flex-col" aria-label={`${akis.ad} triyaj adımları`}>
          {adimlar.map((a, i) => {
            const secili = cevaplar[i];
            const aktif = secili === undefined;
            const ucSecenek = a.secenekler.length === 3;
            return (
              <li key={`${a.id}-${i}`} className={`flex flex-col items-center ${i > 0 ? "animate-in slide-in-from-bottom-2" : ""}`}>
                {i > 0 && <span aria-hidden="true" className="w-0.5 h-5" style={{ background: "var(--glass-border)" }} />}
                <section
                  aria-current={aktif ? "step" : undefined}
                  className="w-full glass-card p-4"
                  style={aktif ? { borderColor: "color-mix(in srgb, var(--fg) 24%, transparent)" } : undefined}
                >
                  <p className="text-[11px] font-bold uppercase tracking-widest text-subtle tabular-nums">
                    {i + 1} · {a.baslik}
                  </p>
                  {a.eylem && (
                    <p className="mt-2 flex items-start gap-2 text-sm font-semibold leading-snug text-pretty rounded-xl px-3 py-2.5" style={{ background: "color-mix(in srgb, var(--fg) 5%, transparent)" }}>
                      <Hand aria-hidden="true" className="shrink-0 mt-px text-muted" style={{ width: 16, height: 16 }} />
                      {a.eylem}
                    </p>
                  )}
                  <h3 className={`mt-2.5 font-bold leading-snug text-balance ${aktif ? "text-lg" : "text-base text-muted"}`}>{a.soru}</h3>
                  {a.ipucu && aktif && <p className="text-xs text-muted leading-relaxed mt-1 text-pretty">{a.ipucu}</p>}

                  <div className={`mt-3 grid gap-2 grid-cols-1 ${ucSecenek ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
                    {a.secenekler.map((s, j) => {
                      const sonucKod = "kod" in s.sonuc ? s.sonuc.kod : null;
                      return (
                        <button
                          key={s.etiket}
                          type="button"
                          onClick={() => sec(i, j)}
                          aria-pressed={secili === j}
                          data-secili={secili === j}
                          data-soluk={!aktif && secili !== j}
                          className="triaj-secenek"
                        >
                          <span className="flex-1 min-w-0">
                            <span className="block text-base font-bold leading-tight">{s.etiket}</span>
                            {s.ek && <span className="block text-xs text-muted leading-snug mt-1 text-pretty">{s.ek}</span>}
                          </span>
                          {sonucKod && <KodNoktasi kod={sonucKod} />}
                        </button>
                      );
                    })}
                  </div>
                </section>
              </li>
            );
          })}

          {kod && (
            <li className="flex flex-col items-center">
              <span aria-hidden="true" className="w-0.5 h-5" style={{ background: "var(--glass-border)" }} />
              <SonucKarti kod={kod} />
            </li>
          )}
        </ol>

        {cevaplar.length > 0 && (
          <div className="flex gap-3 -mt-2">
            <button type="button" onClick={() => setCevaplar(c => c.slice(0, -1))} className="flex-1 glass-card glass-hover min-h-12 rounded-xl font-bold text-sm inline-flex items-center justify-center gap-1.5 active:scale-[0.97] transition">
              <Undo2 aria-hidden="true" style={{ width: 16, height: 16 }} /> Önceki adım
            </button>
            <button
              type="button"
              onClick={() => setCevaplar([])}
              className="flex-1 min-h-12 rounded-xl font-bold text-sm inline-flex items-center justify-center gap-1.5 active:scale-[0.97] transition"
              style={kod ? { background: "var(--primary)", color: "#fff" } : { background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}
            >
              <RotateCcw aria-hidden="true" style={{ width: 15, height: 15 }} /> Yeni yaralı
            </button>
          </div>
        )}
        <div ref={sonRef} aria-hidden="true" className="scroll-mb-28" />

        {/* ── Renk kodları ── */}
        <section aria-labelledby="renk-kodlari" className="space-y-2">
          <h2 id="renk-kodlari" className="text-[11px] font-bold uppercase tracking-widest text-subtle px-1">
            Renk kodları
          </h2>
          <ul className="glass-card overflow-hidden divide-y divide-(--glass-border)">
            {KOD_SIRASI.map(k => (
              <li key={k} className="flex gap-3 px-4 py-3">
                <span aria-hidden="true" className="shrink-0 w-1.5 rounded-full self-stretch" style={{ background: KOD_STIL[k].bg, boxShadow: KOD_STIL[k].kenar ? `0 0 0 1px ${KOD_STIL[k].kenar}` : undefined }} />
                <span className="min-w-0">
                  <span className="block text-sm font-bold">
                    {KODLAR[k].renk} <span className="font-semibold text-muted">· {KODLAR[k].kategori}</span>
                  </span>
                  <span className="block text-xs text-muted leading-relaxed mt-0.5 text-pretty">{KODLAR[k].aciklama}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Dikkat edilecekler ── */}
        <section aria-labelledby="dikkat" className="space-y-2">
          <h2 id="dikkat" className="text-[11px] font-bold uppercase tracking-widest text-subtle px-1">
            Dikkat edilecekler
          </h2>
          <ul className="glass-card p-4 space-y-2.5">
            {akis.notlar.map(n => (
              <li key={n} className="flex gap-2.5 text-sm leading-relaxed text-muted text-pretty">
                <span aria-hidden="true" className="mt-2 w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                <span>{n}</span>
              </li>
            ))}
          </ul>
        </section>

        <p className="text-[11px] text-subtle leading-relaxed px-1 text-pretty">
          Kaynak: T.C. Sağlık Bakanlığı ASHGM, TİLYAD “Triyaj” eğitim sunumu ve {akis.ad} Triyaj akış şeması.{" "}
          <Link href="/egitim/dokumanlar/tilyad" className="underline underline-offset-2 hover:text-fg">
            Eğitim sunumu
          </Link>
          {" · "}
          <Link href={`/vaka-protokolleri/${kategori}/${akis.algoritmaId}`} className="underline underline-offset-2 hover:text-fg">
            Vaka protokolü
          </Link>
        </p>
      </div>
    </>
  );
}

function KodNoktasi({ kod }: { kod: TriajKodu }) {
  const s = KOD_STIL[kod];
  return (
    <span className="shrink-0 inline-flex items-center gap-1.5 text-[11px] font-bold text-muted">
      <span aria-hidden="true" className="w-2.5 h-2.5 rounded-full" style={{ background: s.bg, boxShadow: s.kenar ? `0 0 0 1px ${s.kenar}` : undefined }} />
      {KODLAR[kod].renk}
    </span>
  );
}

function SonucKarti({ kod }: { kod: TriajKodu }) {
  const s = KOD_STIL[kod];
  const k = KODLAR[kod];
  return (
    <div
      role="status"
      className="w-full rounded-[1.25rem] p-5 animate-in zoom-in-95"
      style={{ background: s.bg, color: s.fg, border: s.kenar ? `1px solid ${s.kenar}` : undefined, boxShadow: `0 14px 36px -14px ${s.bg}` }}
    >
      <p className="text-[11px] font-bold uppercase tracking-widest opacity-85">Triyaj sonucu</p>
      <p className="text-3xl font-black leading-none mt-1.5">{buyuk(k.renk)} KOD</p>
      <p className="text-sm font-bold mt-1.5">{k.kategori}</p>
      <p className="text-xs leading-relaxed mt-2 opacity-90 text-pretty">{k.aciklama}</p>
    </div>
  );
}
