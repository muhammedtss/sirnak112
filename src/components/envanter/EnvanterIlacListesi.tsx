"use client";

import { useState } from "react";

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
        className={`text-[13px] sm:text-[15px] md:text-base font-bold leading-tight transition-all duration-300 ${
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

  return (
    <div className="flex flex-col items-center gap-3 sm:gap-4 w-full max-w-3xl mx-auto pb-10 px-2 sm:px-0">
      {/* Üst İstatistik Kartı */}
      {total > 0 && (
        <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm p-3 sm:p-4 mb-1 sm:mb-2">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] sm:text-sm font-extrabold text-slate-500 uppercase tracking-widest">
              Kontrol Durumu
            </span>
            <span className="text-[11px] sm:text-sm font-extrabold text-slate-600">
              {checkedCount} / {total}
            </span>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-2 sm:h-2.5 overflow-hidden mb-3 sm:mb-4">
            <div className="h-full rounded-full flex">
              <div
                className="bg-[#00c853] transition-all duration-500"
                style={{ width: `${(yeterliCount / total) * 100}%` }}
              />
              <div
                className="bg-[#ff3d00] transition-all duration-500"
                style={{ width: `${(yetersizCount / total) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-start sm:gap-5">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#00c853]" />
              <span className="text-[10px] sm:text-xs font-bold text-slate-600">
                {yeterliCount} Yeterli
              </span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#ff3d00]" />
              <span className="text-[10px] sm:text-xs font-bold text-slate-600">
                {yetersizCount} Yetersiz
              </span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-slate-300" />
              <span className="text-[10px] sm:text-xs font-bold text-slate-600">
                {bekleyenCount} Bekliyor
              </span>
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
              className={`flex flex-col w-full rounded-xl border transition-all duration-300 overflow-hidden ${
                isYeterli
                  ? "bg-emerald-50/50 border-emerald-300 shadow-sm"
                  : isYetersiz
                    ? "bg-red-50/50 border-red-300 shadow-sm"
                    : "bg-white border-slate-200 shadow-sm"
              }`}
            >
              {/* ANA SATIR: Asla kırılmayacak Flex yapısı */}
              <div className="flex flex-row items-center justify-between gap-2 sm:gap-3 p-2.5 sm:p-4 w-full">
                {/* Sol Grup: İkon ve Metin (Mümkün olduğunca küçülebilir) */}
                <div className="flex flex-row items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  {/* İkon */}
                  <div
                    className={`w-7 h-7 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isYeterli
                        ? "bg-[#00c853]"
                        : isYetersiz
                          ? "bg-[#ff3d00]"
                          : "bg-slate-100"
                    }`}
                  >
                    {isYeterli ? (
                      <svg
                        className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                    ) : isYetersiz ? (
                      <svg
                        className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    ) : (
                      <div className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-slate-400" />
                    )}
                  </div>

                  {/* Metin */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <ExpandableText
                      text={ilac.name}
                      colorClass={
                        isYeterli
                          ? "text-emerald-900"
                          : isYetersiz
                            ? "text-red-900"
                            : "text-[#1e293b]"
                      }
                    />
                    <p
                      className={`text-[11px] sm:text-[13px] font-semibold mt-0.5 ${
                        isYeterli
                          ? "text-emerald-600"
                          : isYetersiz
                            ? "text-red-600"
                            : "text-slate-500"
                      }`}
                    >
                      Gerekli:{" "}
                      <span className="font-bold">{ilac.gerekliMiktar}</span>
                    </p>
                  </div>
                </div>

                {/* Sağ Grup: Butonlar (Asla küçülmeyecek) */}
                <div className="flex flex-row items-center gap-1.5 sm:gap-2 shrink-0">
                  {!isYeterli && !isYetersiz && (
                    <>
                      <button
                        onClick={() => handleYeterli(ilac.id)}
                        className="bg-[#00c853] hover:bg-emerald-500 text-white text-[11px] sm:text-sm font-bold px-2.5 py-1.5 sm:px-4 sm:py-2.5 rounded-lg active:scale-95 transition-all whitespace-nowrap"
                      >
                        Yeterli
                      </button>
                      <button
                        onClick={() => handleYetersiz(ilac.id)}
                        className="bg-[#ff3d00] hover:bg-red-500 text-white text-[11px] sm:text-sm font-bold px-2.5 py-1.5 sm:px-4 sm:py-2.5 rounded-lg active:scale-95 transition-all whitespace-nowrap"
                      >
                        Yetersiz
                      </button>
                    </>
                  )}

                  {/* Geri Al Butonları */}
                  {isYeterli && (
                    <button
                      onClick={() => handleReset(ilac.id)}
                      className="text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-[11px] sm:text-xs font-bold active:scale-95 transition-all whitespace-nowrap"
                    >
                      Geri Al
                    </button>
                  )}
                  {isYetersiz && (
                    <button
                      onClick={() => handleReset(ilac.id)}
                      className="text-red-700 bg-red-100 hover:bg-red-200 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-[11px] sm:text-xs font-bold active:scale-95 transition-all whitespace-nowrap"
                    >
                      Geri Al
                    </button>
                  )}
                </div>
              </div>

              {/* Yetersiz Seçildiğinde Açılan Input Alanı */}
              {isYetersiz && (
                <div className="px-2.5 pb-2.5 sm:px-4 sm:pb-4 pt-0 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3 bg-red-100/50 border border-red-200 rounded-xl p-2 sm:p-3">
                    <label className="text-[11px] sm:text-sm font-bold text-red-800 whitespace-nowrap pl-1">
                      Mevcut Adet:
                    </label>
                    <input
                      type="number"
                      inputMode="numeric"
                      value={state.mevcutMiktar}
                      onChange={(e) =>
                        handleMiktarChange(ilac.id, e.target.value)
                      }
                      placeholder="0"
                      className="w-16 sm:w-24 bg-white border border-red-200 sm:border-2 rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 text-sm sm:text-base font-bold text-red-900 placeholder-red-300 focus:outline-none focus:border-red-400 focus:ring-0 transition-colors text-center sm:text-left"
                    />
                    <span className="text-[11px] sm:text-xs font-semibold text-red-600/80">
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
        <div className="bg-white w-full rounded-xl border border-slate-200 p-6 sm:p-10 text-center shadow-sm">
          <p className="text-slate-400 text-sm sm:text-base font-semibold">
            Bu ambulans tipi için ilaç verisi bulunmuyor.
          </p>
        </div>
      )}
    </div>
  );
}
