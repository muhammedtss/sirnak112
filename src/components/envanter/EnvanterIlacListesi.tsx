"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface EnvanterIlac {
  id: string;
  name: string;
  gerekliMiktar: string | number;
}

type ItemStatus = "unchecked" | "yeterli" | "yetersiz";

interface ItemState {
  status: ItemStatus;
  mevcutMiktar: string;
}

// Mobilde tıklama, masaüstünde hover ile açılan akıllı metin bileşeni
function ExpandableText({
  text,
  colorClass,
}: {
  text: string;
  colorClass: string;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className="cursor-pointer group flex-1 min-w-0"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      onClick={() => setExpanded(!expanded)}
    >
      <p
        className={`text-sm sm:text-[15px] md:text-base font-bold leading-tight ${
          expanded ? "whitespace-normal break-words" : "truncate"
        } ${colorClass}`}
      >
        {text}
      </p>
    </div>
  );
}

export default function EnvanterIlacListesi({
  ilaclar,
}: {
  ilaclar: EnvanterIlac[];
}) {
  const [states, setStates] = useState<Record<string, ItemState>>(() => {
    const init: Record<string, ItemState> = {};
    ilaclar.forEach((ilac) => {
      init[ilac.id] = { status: "unchecked", mevcutMiktar: "" };
    });
    return init;
  });

  const handleYeterli = (id: string) => {
    setStates((prev) => ({
      ...prev,
      [id]: { status: "yeterli", mevcutMiktar: "" },
    }));
  };

  const handleYetersiz = (id: string) => {
    setStates((prev) => ({
      ...prev,
      [id]: { status: "yetersiz", mevcutMiktar: prev[id]?.mevcutMiktar || "" },
    }));
  };

  const handleMiktarChange = (id: string, value: string) => {
    setStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], mevcutMiktar: value },
    }));
  };

  const handleReset = (id: string) => {
    setStates((prev) => ({
      ...prev,
      [id]: { status: "unchecked", mevcutMiktar: "" },
    }));
  };

  const total = ilaclar.length;
  const yeterliCount = Object.values(states).filter(
    (s) => s.status === "yeterli",
  ).length;
  const yetersizCount = Object.values(states).filter(
    (s) => s.status === "yetersiz",
  ).length;
  const checkedCount = yeterliCount + yetersizCount;
  const bekleyenCount = total - checkedCount;

  // Tüm kalemler işaretlenince kısa bir özet bildirimi (toast) göster
  const [toast, setToast] = useState(false);
  const wasComplete = useRef(false);
  const complete = total > 0 && bekleyenCount === 0;
  useEffect(() => {
    if (complete && !wasComplete.current) {
      setToast(true);
      const tm = setTimeout(() => setToast(false), 4000);
      wasComplete.current = true;
      return () => clearTimeout(tm);
    }
    if (!complete) wasComplete.current = false;
  }, [complete]);

  return (
    <div className="flex flex-col items-center gap-3 sm:gap-4 w-full max-w-3xl mx-auto pb-10 px-2 sm:px-0">
      {/* Üst İstatistik Kartı */}
      {total > 0 && (
        <div className="glass-card w-full rounded-2xl p-3 sm:p-4 mb-1 sm:mb-2">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] sm:text-sm font-extrabold text-subtle uppercase tracking-widest">
              Kontrol Durumu
            </span>
            <span className="text-[11px] sm:text-sm font-extrabold text-muted tabular-nums">
              {checkedCount} / {total}
            </span>
          </div>

          <div
            className="w-full rounded-full h-2 sm:h-2.5 overflow-hidden mb-3 sm:mb-4"
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

          <div className="flex items-center justify-between sm:justify-start sm:gap-5 tabular-nums">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold text-muted">{yeterliCount} Yeterli</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500" />
              <span className="text-xs font-bold text-muted">{yetersizCount} Yetersiz</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full" style={{ background: "var(--fg-subtle)" }} />
              <span className="text-xs font-bold text-muted">{bekleyenCount} Bekliyor</span>
            </div>
          </div>
        </div>
      )}

      {/* İlaç Listesi (Tam Responsive Tek Sütun) */}
      <div className="flex flex-col gap-2.5 sm:gap-3 w-full">
        {ilaclar.map((ilac) => {
          const state = states[ilac.id] || {
            status: "unchecked",
            mevcutMiktar: "",
          };
          const isYeterli = state.status === "yeterli";
          const isYetersiz = state.status === "yetersiz";

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
              <div className="flex flex-row items-center justify-between gap-2 sm:gap-3 p-2.5 sm:p-4 w-full">
                <div className="flex flex-row items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  {/* Durum ikonu: işaretlenince tik çizilir (Checkbox check) */}
                  <div
                    aria-hidden="true"
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 transition-colors duration-150 ${
                      isYeterli ? "bg-emerald-500" : isYetersiz ? "bg-red-500" : ""
                    }`}
                    style={!isYeterli && !isYetersiz ? { background: "color-mix(in srgb, var(--fg) 8%, transparent)" } : undefined}
                  >
                    {isYeterli ? (
                      <svg key="ok" className="t-check w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path pathLength={1} strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    ) : isYetersiz ? (
                      <svg key="no" className="t-check w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path pathLength={1} strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    ) : (
                      <div className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full" style={{ background: "var(--fg-subtle)" }} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <ExpandableText
                      text={ilac.name}
                      colorClass={isYeterli ? "text-emerald-300" : isYetersiz ? "text-red-300" : "text-fg"}
                    />
                    <p className={`text-xs sm:text-[13px] font-semibold mt-0.5 ${isYeterli ? "text-emerald-400" : isYetersiz ? "text-red-400" : "text-muted"}`}>
                      Gerekli: <span className="font-bold tabular-nums">{ilac.gerekliMiktar}</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-row items-center gap-1.5 sm:gap-2 shrink-0">
                  {!isYeterli && !isYetersiz && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleYeterli(ilac.id)}
                        aria-label={`${ilac.name}: yeterli`}
                        className="min-h-11 bg-emerald-700 hover:bg-emerald-600 text-white text-xs sm:text-sm font-bold px-3 sm:px-4 rounded-lg active:scale-[0.97] transition whitespace-nowrap"
                      >
                        Yeterli
                      </button>
                      <button
                        type="button"
                        onClick={() => handleYetersiz(ilac.id)}
                        aria-label={`${ilac.name}: yetersiz`}
                        className="min-h-11 bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm font-bold px-3 sm:px-4 rounded-lg active:scale-[0.97] transition whitespace-nowrap"
                      >
                        Yetersiz
                      </button>
                    </>
                  )}

                  {(isYeterli || isYetersiz) && (
                    <button
                      type="button"
                      onClick={() => handleReset(ilac.id)}
                      aria-label={`${ilac.name}: işareti geri al`}
                      className={`min-h-11 px-3 sm:px-4 rounded-lg text-xs font-bold active:scale-[0.97] transition whitespace-nowrap border ${
                        isYeterli
                          ? "text-emerald-300 border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20"
                          : "text-red-300 border-red-500/30 bg-red-500/10 hover:bg-red-500/20"
                      }`}
                    >
                      Geri Al
                    </button>
                  )}
                </div>
              </div>

              {/* Yetersiz seçildiğinde açılan miktar alanı */}
              {isYetersiz && (
                <div className="px-2.5 pb-2.5 sm:px-4 sm:pb-4 pt-0 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3 bg-red-500/10 border border-red-500/25 rounded-xl p-2 sm:p-3">
                    <label htmlFor={`mevcut-${ilac.id}`} className="text-xs sm:text-sm font-bold text-red-300 whitespace-nowrap pl-1">
                      Mevcut Adet:
                    </label>
                    <input
                      id={`mevcut-${ilac.id}`}
                      type="number"
                      inputMode="numeric"
                      value={state.mevcutMiktar}
                      onChange={(e) => handleMiktarChange(ilac.id, e.target.value)}
                      placeholder="0"
                      className="glass-input w-20 sm:w-24 min-h-11 px-2 sm:px-3 text-base font-bold text-center sm:text-left tabular-nums"
                    />
                    <span className="text-xs font-semibold text-red-300 tabular-nums">
                      Eksik:{" "}
                      {Math.max(
                        0,
                        Number(ilac.gerekliMiktar) -
                          Number(state.mevcutMiktar || 0),
                      )}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {ilaclar.length === 0 && (
        <div className="glass-card w-full rounded-xl p-6 sm:p-10 text-center">
          <p className="text-subtle text-sm sm:text-base font-semibold">
            Bu ambulans tipi için ilaç verisi bulunmuyor.
          </p>
        </div>
      )}

      {/* Toast: kontrol tamamlandı (Transitions.dev #22: yükselerek gelir, daha hızlı gider) */}
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
              <span className="text-sm font-bold">
                Kontrol tamamlandı: <span className="tabular-nums">{yeterliCount} yeterli, {yetersizCount} yetersiz</span>
              </span>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
