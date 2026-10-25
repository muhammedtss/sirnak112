"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, m } from "framer-motion";
import { CheckCircle2, Download, FileSpreadsheet, RotateCcw, Share2 } from "lucide-react";
import {
  adetTemizle,
  bosDurumlar,
  durumlariSakla,
  eksikMiktar,
  envanterRaporu,
  kayitliDurumlar,
  mevcutKarsiliyor,
  sayimlar,
  type Durumlar,
  type EnvanterIlac,
  type ItemStatus,
} from "@/lib/envanter";
import { XLSX_MIME } from "@/lib/xlsx";

const BOS = { status: "unchecked", mevcutMiktar: "" } as const;

/* Seçili düğmede yazı her iki temada beyaz kalır (açık temadaki .text-white eşlemesi koyulaştırır) */
const BEYAZ = { color: "#fff" };

/** Paylaşım menüsü .xlsx dosyası kabul ediyor mu (iOS evet; Android Chrome'da çoğunlukla hayır) */
let paylasimDestegi: boolean | undefined;
function xlsxPaylasilabilir() {
  if (paylasimDestegi === undefined) {
    try {
      paylasimDestegi = !!navigator.canShare?.({ files: [new File([], "rapor.xlsx", { type: XLSX_MIME })] });
    } catch {
      paylasimDestegi = false;
    }
  }
  return paylasimDestegi;
}
const abonelikYok = () => () => {};

const FILTRELER: { id: ItemStatus; ad: string; nokta: string; aciklama: string }[] = [
  { id: "yeterli", ad: "Yeterli", nokta: "bg-emerald-500", aciklama: "yeterli" },
  { id: "yetersiz", ad: "Yetersiz", nokta: "bg-red-500", aciklama: "yetersiz" },
  { id: "unchecked", ad: "Bekliyor", nokta: "", aciklama: "bekleyen" },
];

export default function EnvanterIlacListesi({
  tip,
  baslik,
  ambulansAdi,
  ilaclar,
}: {
  tip: string;
  /** Kartta görünen kısa ad */
  baslik: string;
  /** Raporda yazan tam ad */
  ambulansAdi: string;
  ilaclar: EnvanterIlac[];
}) {
  // Uygulama içinde başka sayfaya gidip dönünce işaretler korunur (yalnızca bellekte)
  const [states, setStates] = useState<Durumlar>(() => kayitliDurumlar(tip, ilaclar));
  useEffect(() => durumlariSakla(tip, states), [tip, states]);

  /** Basılı düğmeye yeniden dokunmak işareti kaldırır. */
  const sec = (id: string, durum: "yeterli" | "yetersiz") => {
    setStates((prev) => {
      const cur = prev[id] ?? BOS;
      if (cur.status === durum) return { ...prev, [id]: BOS };
      return { ...prev, [id]: { status: durum, mevcutMiktar: durum === "yetersiz" ? cur.mevcutMiktar : "" } };
    });
  };

  const handleMiktarChange = (id: string, value: string) => {
    setStates((prev) => ({
      ...prev,
      [id]: { ...(prev[id] ?? BOS), mevcutMiktar: adetTemizle(value) },
    }));
  };

  const { toplam: total, yeterli: yeterliCount, yetersiz: yetersizCount, bekleyen: bekleyenCount } = sayimlar(ilaclar, states);
  const checkedCount = yeterliCount + yetersizCount;
  const sayi: Record<ItemStatus, number> = { yeterli: yeterliCount, yetersiz: yetersizCount, unchecked: bekleyenCount };

  // Filtre seçildiği andaki kalemler görünür kalır: işaretlenen kalem listeden
  // hemen düşüp parmağın altındaki satırı kaydırmasın diye.
  const [filtre, setFiltre] = useState<ItemStatus | null>(null);
  const [gorunen, setGorunen] = useState<Set<string> | null>(null);
  const filtreSec = (f: ItemStatus | null) => {
    if (f === null || f === filtre) {
      setFiltre(null);
      setGorunen(null);
      return;
    }
    setFiltre(f);
    setGorunen(new Set(ilaclar.filter((i) => (states[i.id] ?? BOS).status === f).map((i) => i.id)));
  };
  const liste = gorunen ? ilaclar.filter((i) => gorunen.has(i.id)) : ilaclar;

  // Kısa bildirim (toast): kontrol tamamlandı, rapor indirildi
  const [toast, setToast] = useState<string | null>(null);
  const toastZaman = useRef<ReturnType<typeof setTimeout>>(undefined);
  const bildir = useCallback((metin: string) => {
    clearTimeout(toastZaman.current);
    setToast(metin);
    toastZaman.current = setTimeout(() => setToast(null), 4000);
  }, []);
  useEffect(() => () => clearTimeout(toastZaman.current), []);

  const wasComplete = useRef(total > 0 && bekleyenCount === 0);
  const complete = total > 0 && bekleyenCount === 0;
  useEffect(() => {
    if (complete && !wasComplete.current) bildir(`Kontrol tamamlandı: ${yeterliCount} yeterli, ${yetersizCount} yetersiz`);
    wasComplete.current = complete;
  }, [complete, yeterliCount, yetersizCount, bildir]);

  /* ── Excel raporu (cihazda üretilir) ── */
  const paylasilabilir = useSyncExternalStore(abonelikYok, xlsxPaylasilabilir, () => false);

  const raporOlustur = () => envanterRaporu({ tip, ambulansAdi, ilaclar, durumlar: states, tarih: new Date() });

  const indir = () => {
    const { dosyaAdi, veri } = raporOlustur();
    const url = URL.createObjectURL(new Blob([veri], { type: XLSX_MIME }));
    const a = document.createElement("a");
    a.href = url;
    a.download = dosyaAdi;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
    bildir("Excel raporu indirildi");
  };

  const paylas = async () => {
    const { dosyaAdi, veri } = raporOlustur();
    try {
      await navigator.share({
        files: [new File([veri], dosyaAdi, { type: XLSX_MIME })],
        title: `${ambulansAdi} — İlaç Kontrol Raporu`,
      });
    } catch (e) {
      // Kullanıcı paylaşımı kapattıysa bir şey yapılmaz; başka hatada dosya indirilir
      if ((e as DOMException)?.name !== "AbortError") indir();
    }
  };

  const [sifirOnay, setSifirOnay] = useState(false);
  const sifirla = () => {
    setStates(bosDurumlar(ilaclar));
    setSifirOnay(false);
    filtreSec(null);
  };

  return (
    <div className="flex flex-col items-center gap-3 sm:gap-4 w-full max-w-3xl mx-auto pb-10">
      {/* Üst İstatistik Kartı */}
      {total > 0 && (
        <div className="glass-card w-full rounded-2xl p-3 sm:p-4 mb-1 sm:mb-2">
          <div className="flex items-center justify-between gap-3 mb-3">
            <span className="text-[11px] sm:text-sm font-extrabold text-subtle uppercase tracking-widest truncate">
              {baslik}
            </span>
            <span className="shrink-0 text-[11px] sm:text-sm font-extrabold text-muted tabular-nums">
              {checkedCount} / {total}
            </span>
          </div>

          <div
            className="w-full rounded-full h-2 sm:h-2.5 overflow-hidden mb-3"
            style={{ background: "color-mix(in srgb, var(--fg) 10%, transparent)" }}
            role="progressbar"
            aria-label="Kontrol edilen kalemler"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={checkedCount}
          >
            <div className="h-full rounded-full flex">
              <div className="bg-emerald-500" style={{ width: `${(yeterliCount / total) * 100}%` }} />
              <div className="bg-red-500" style={{ width: `${(yetersizCount / total) * 100}%` }} />
            </div>
          </div>

          {/* Durum sayıları aynı zamanda filtre: dokununca yalnızca o durumdakiler listelenir */}
          <div className="flex items-center gap-1.5 sm:gap-2" role="group" aria-label="Listeyi duruma göre süz">
            {FILTRELER.map((f) => {
              const secili = filtre === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => filtreSec(f.id)}
                  aria-pressed={secili}
                  className="chip-hit flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-full border transition-colors tabular-nums"
                  style={
                    secili
                      ? { background: "color-mix(in srgb, var(--primary-light) 16%, transparent)", borderColor: "color-mix(in srgb, var(--primary-light) 50%, transparent)", color: "var(--accent-text)" }
                      : { background: "transparent", borderColor: "var(--glass-border)", color: "var(--fg-muted)" }
                  }
                >
                  <span className={`w-2 h-2 rounded-full ${f.nokta}`} style={f.nokta ? undefined : { background: "var(--fg-subtle)" }} />
                  {sayi[f.id]} {f.ad}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {filtre && (
        <div className="w-full flex items-center justify-between gap-3 px-1 -mt-1" aria-live="polite">
          <p className="text-xs font-semibold text-subtle">
            Yalnızca <span className="text-muted">{FILTRELER.find((f) => f.id === filtre)?.aciklama}</span> kalemler <span className="tabular-nums">({liste.length})</span>
          </p>
          <button type="button" onClick={() => filtreSec(null)} className="min-h-9 text-xs font-bold" style={{ color: "var(--accent-text)" }}>
            Tümünü göster
          </button>
        </div>
      )}

      {/* İlaç Listesi (Tam Responsive Tek Sütun) */}
      <div className="flex flex-col gap-2.5 sm:gap-3 w-full">
        {liste.map((ilac) => {
          const state = states[ilac.id] ?? BOS;
          const isYeterli = state.status === "yeterli";
          const isYetersiz = state.status === "yetersiz";
          const karsiliyor = isYetersiz && mevcutKarsiliyor(ilac.gerekliMiktar, state.mevcutMiktar);

          return (
            <div
              key={ilac.id}
              className={`glass-card flex flex-col w-full !rounded-xl overflow-hidden ${
                isYeterli ? "!border-emerald-500/40" : isYetersiz ? "!border-red-500/40" : ""
              }`}
              style={
                isYeterli
                  ? { background: "color-mix(in srgb, #10B981 9%, var(--glass-bg))" }
                  : isYetersiz
                    ? { background: "color-mix(in srgb, #EF4444 9%, var(--glass-bg))" }
                    : undefined
              }
            >
              <div className="flex flex-row items-center justify-between gap-2.5 sm:gap-3 p-3 sm:p-4 w-full">
                {/* Durum ikonu: işaretlenince tik çizilir (Checkbox check); dar ekranda düğmeler durumu zaten gösterir */}
                <div
                  aria-hidden="true"
                  className={`hidden sm:flex w-10 h-10 rounded-full items-center justify-center shrink-0 transition-colors duration-150 ${
                    isYeterli ? "bg-emerald-500" : isYetersiz ? "bg-red-500" : ""
                  }`}
                  style={!isYeterli && !isYetersiz ? { background: "color-mix(in srgb, var(--fg) 8%, transparent)" } : undefined}
                >
                  {isYeterli ? (
                    <svg key="ok" className="t-check w-5 h-5" style={BEYAZ} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path pathLength={1} strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  ) : isYetersiz ? (
                    <svg key="no" className="t-check w-5 h-5" style={BEYAZ} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path pathLength={1} strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full" style={{ background: "var(--fg-subtle)" }} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm sm:text-[15px] md:text-base font-bold leading-snug break-words text-pretty ${
                      isYeterli ? "text-emerald-300" : isYetersiz ? "text-red-300" : "text-fg"
                    }`}
                  >
                    {ilac.name}
                  </p>
                  <p className={`text-xs sm:text-[13px] font-semibold mt-0.5 ${isYeterli ? "text-emerald-400" : isYetersiz ? "text-red-400" : "text-muted"}`}>
                    Gerekli: <span className="font-bold tabular-nums">{ilac.gerekliMiktar}</span>
                  </p>
                </div>

                {/* İki durum düğmesi hep görünür; seçili olan dolu renkte, ona yeniden dokunmak işareti kaldırır */}
                <div className="flex flex-row items-center gap-1.5 sm:gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => sec(ilac.id, "yeterli")}
                    aria-pressed={isYeterli}
                    aria-label={`${ilac.name}: yeterli`}
                    className={`min-h-11 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap border active:scale-[0.96] transition-[background-color,border-color,color,transform] duration-150 ${
                      isYeterli
                        ? "bg-emerald-700 border-emerald-700 hover:bg-emerald-600"
                        : "text-emerald-300 border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20"
                    }`}
                    style={isYeterli ? BEYAZ : undefined}
                  >
                    Yeterli
                  </button>
                  <button
                    type="button"
                    onClick={() => sec(ilac.id, "yetersiz")}
                    aria-pressed={isYetersiz}
                    aria-label={`${ilac.name}: yetersiz`}
                    className={`min-h-11 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap border active:scale-[0.96] transition-[background-color,border-color,color,transform] duration-150 ${
                      isYetersiz
                        ? "bg-red-600 border-red-600 hover:bg-red-500"
                        : "text-red-300 border-red-500/40 bg-red-500/10 hover:bg-red-500/20"
                    }`}
                    style={isYetersiz ? BEYAZ : undefined}
                  >
                    Yetersiz
                  </button>
                </div>
              </div>

              {/* Yetersiz seçildiğinde açılan miktar alanı */}
              {isYetersiz && (
                <div className="px-3 pb-3 sm:px-4 sm:pb-4 pt-0 animate-in">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2 bg-red-500/10 border border-red-500/25 rounded-xl p-2 sm:p-3">
                    <label htmlFor={`mevcut-${ilac.id}`} className="text-xs sm:text-sm font-bold text-red-300 whitespace-nowrap pl-1">
                      Mevcut Adet:
                    </label>
                    <input
                      id={`mevcut-${ilac.id}`}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      autoComplete="off"
                      enterKeyHint="done"
                      value={state.mevcutMiktar}
                      onChange={(e) => handleMiktarChange(ilac.id, e.target.value)}
                      placeholder="0"
                      aria-describedby={`eksik-${ilac.id}`}
                      className="glass-input w-20 sm:w-24 min-h-11 px-2 sm:px-3 text-base font-bold text-center tabular-nums"
                    />
                    <span id={`eksik-${ilac.id}`} className="text-xs font-semibold text-red-300 tabular-nums">
                      Eksik: {eksikMiktar(ilac.gerekliMiktar, state.mevcutMiktar)}
                    </span>
                    {karsiliyor && (
                      <div className="basis-full flex flex-wrap items-center justify-between gap-x-3 gap-y-1 pl-1" role="status">
                        <p className="text-xs font-semibold text-amber-300">Girilen adet gerekli miktarı karşılıyor.</p>
                        <button
                          type="button"
                          onClick={() => sec(ilac.id, "yeterli")}
                          className="min-h-9 text-xs font-bold text-emerald-300 underline underline-offset-2"
                        >
                          Yeterli olarak işaretle
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtre && liste.length === 0 && (
        <div className="glass-card w-full rounded-xl p-6 text-center">
          <p className="text-subtle text-sm font-semibold">Bu durumda kalem yok.</p>
        </div>
      )}

      {ilaclar.length === 0 && (
        <div className="glass-card w-full rounded-xl p-6 sm:p-10 text-center">
          <p className="text-subtle text-sm sm:text-base font-semibold">
            Bu ambulans tipi için ilaç verisi bulunmuyor.
          </p>
        </div>
      )}

      {/* Kontrol raporu: yeterli ve yetersiz ilaçların Excel listesi */}
      {total > 0 && (
        <section aria-labelledby="rapor-baslik" className="glass-card w-full rounded-2xl p-4 mt-2">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-emerald-500/15 text-emerald-300">
              <FileSpreadsheet aria-hidden="true" style={{ width: 20, height: 20 }} />
            </span>
            <div className="min-w-0">
              <h2 id="rapor-baslik" className="text-base font-bold leading-tight">
                Kontrol raporu
              </h2>
              <p className="text-xs text-muted mt-0.5 text-pretty">Yeterli ve yetersiz ilaçların Excel listesi</p>
            </div>
          </div>

          {checkedCount === 0 ? (
            <p className="text-xs font-semibold text-subtle mt-3">Rapor için önce en az bir kalemi işaretleyin.</p>
          ) : (
            bekleyenCount > 0 && (
              <p className="text-xs font-semibold text-amber-300 mt-3 text-pretty">
                <span className="tabular-nums">{bekleyenCount}</span> kalem henüz kontrol edilmedi; raporda “Kontrol edilmedi” olarak yer alır.
              </p>
            )
          )}

          <div className="flex gap-2 mt-3">
            <button
              type="button"
              onClick={indir}
              disabled={checkedCount === 0}
              className="flex-1 min-h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-sm font-bold active:scale-[0.96] transition-[background-color,transform] duration-150 disabled:opacity-40 disabled:pointer-events-none"
              style={BEYAZ}
            >
              <Download aria-hidden="true" style={{ width: 18, height: 18 }} />
              Excel olarak indir
            </button>
            {paylasilabilir && (
              <button
                type="button"
                onClick={paylas}
                disabled={checkedCount === 0}
                className="min-h-11 px-4 inline-flex items-center justify-center gap-2 rounded-xl border text-sm font-bold active:scale-[0.96] transition-[background-color,transform] duration-150 disabled:opacity-40 disabled:pointer-events-none"
                style={{ borderColor: "var(--glass-border)", background: "var(--glass-bg)" }}
              >
                <Share2 aria-hidden="true" style={{ width: 18, height: 18 }} />
                Paylaş
              </button>
            )}
          </div>
          <p className="text-[11px] text-subtle mt-2 text-pretty">Dosya cihazınızda oluşturulur; hiçbir sunucuya gönderilmez.</p>

          {checkedCount > 0 && (
            <div className="mt-3 pt-3 border-t" style={{ borderColor: "var(--glass-border)" }}>
              {sifirOnay ? (
                <div className="flex flex-wrap items-center justify-between gap-2" role="alert">
                  <p className="text-xs font-bold">Tüm işaretler silinsin mi?</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSifirOnay(false)}
                      className="min-h-11 px-4 rounded-lg border text-xs font-bold"
                      style={{ borderColor: "var(--glass-border)" }}
                    >
                      Vazgeç
                    </button>
                    <button type="button" onClick={sifirla} className="min-h-11 px-4 rounded-lg bg-red-600 hover:bg-red-500 text-xs font-bold" style={BEYAZ}>
                      Evet, sil
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setSifirOnay(true)}
                  className="min-h-11 inline-flex items-center gap-2 text-xs font-bold text-muted hover:text-fg"
                >
                  <RotateCcw aria-hidden="true" style={{ width: 15, height: 15 }} />
                  Listeyi sıfırla
                </button>
              )}
            </div>
          )}
        </section>
      )}

      {/* Toast (Transitions.dev #22: yükselerek gelir, daha hızlı gider) */}
      <div className="fixed inset-x-0 bottom-28 z-40 flex justify-center px-4 pointer-events-none" role="status" aria-live="polite">
        <AnimatePresence>
          {toast && (
            <m.div
              key="toast"
              className="glass-card !rounded-2xl px-4 py-3 flex items-center gap-2.5 shadow-2xl pointer-events-auto"
              style={{ background: "var(--bg-surface)" }}
              initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 8, filter: "blur(2px)", transition: { duration: 0.15 } }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="text-sm font-bold tabular-nums">{toast}</span>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
