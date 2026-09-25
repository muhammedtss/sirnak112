"use client";

import React, { useState, useRef, useEffect } from "react";
import { Ruler, XCircle, MousePointer2, RotateCcw } from "lucide-react";

interface Props {
  onClose?: () => void;
}

export default function DigitalCaliper({ onClose }: Props) {
  const [mode, setMode] = useState<"regular" | "irregular">("regular");
  const [pixelsPerSquare, setPixelsPerSquare] = useState(28);

  // Yüzde (%) tabanlı pozisyonlar veya piksel sınırları
  const [leftLeg, setLeftLeg] = useState(120);
  const [rightLeg, setRightLeg] = useState(260);
  const [dragging, setDragging] = useState<"left" | "right" | "window" | null>(
    null,
  );

  const [windowStart, setWindowStart] = useState(60);
  const [markers, setMarkers] = useState<number[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const windowWidth = 15 * pixelsPerSquare;

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!dragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));

      if (mode === "regular") {
        if (dragging === "left") {
          setLeftLeg(Math.min(x, rightLeg - 15));
        } else if (dragging === "right") {
          setRightLeg(Math.max(x, leftLeg + 15));
        }
      } else if (dragging === "window") {
        const maxStart = Math.max(0, rect.width - windowWidth);
        setWindowStart(Math.max(0, Math.min(x - windowWidth / 2, maxStart)));
      }
    };

    const handlePointerUp = () => setDragging(null);

    if (dragging) {
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
    }
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [dragging, leftLeg, rightLeg, mode, windowWidth]);

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (mode !== "irregular" || dragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    // Sadece 15 karelik pencere içindeyse işaret koy
    if (x >= windowStart && x <= windowStart + windowWidth) {
      setMarkers((prev) => [...prev, x]);
    }
  };

  const removeMarker = (e: React.MouseEvent, idx: number) => {
    e.stopPropagation();
    setMarkers((prev) => prev.filter((_, i) => i !== idx));
  };

  const squares =
    mode === "regular"
      ? Math.max(0.5, (rightLeg - leftLeg) / pixelsPerSquare)
      : 15;
  const bpm =
    mode === "regular" ? Math.round(300 / squares) : markers.length * 20;

  return (
    <div className="w-full flex flex-col">
      {/* Üst Kompakt Araç Çubuğu - EKG'nin üstünü kapatmaz! */}
      <div className="bg-slate-900 border-b border-slate-700 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 z-20">
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => {
                setMode("regular");
                setMarkers([]);
              }}
              className={`text-xs px-3 py-1 font-bold rounded-md transition-all ${
                mode === "regular"
                  ? "bg-emerald-500 text-slate-950"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Düzenli (300 / Kare)
            </button>
            <button
              onClick={() => setMode("irregular")}
              className={`text-xs px-3 py-1 font-bold rounded-md transition-all ${
                mode === "irregular"
                  ? "bg-blue-500 text-slate-950"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Düzensiz (15 Kare x 20)
            </button>
          </div>

          {mode === "irregular" && markers.length > 0 && (
            <button
              onClick={() => setMarkers([])}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 px-2 py-1 bg-slate-800 rounded-md"
              title="İşaretleri Sıfırla"
            >
              <RotateCcw size={12} /> Sıfırla
            </button>
          )}
        </div>

        {/* Canlı Hesaplama Gösterimi */}
        <div className="flex items-center gap-4 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          {mode === "regular" ? (
            <div className="text-xs text-slate-300">
              Mesafe:{" "}
              <span className="text-emerald-400 font-bold">
                {squares.toFixed(1)} Büyük Kare
              </span>
              <span className="mx-2 text-slate-600">|</span>
              300 / {squares.toFixed(1)} ={" "}
              <span className="text-white font-black text-sm">{bpm} /dk</span>
            </div>
          ) : (
            <div className="text-xs text-slate-300">
              İşaretlenen R:{" "}
              <span className="text-blue-400 font-bold">
                {markers.length} Adet
              </span>
              <span className="mx-2 text-slate-600">|</span>
              {markers.length} x 20 ={" "}
              <span className="text-white font-black text-sm">{bpm} /dk</span>
            </div>
          )}
        </div>

        {/* Kalibrasyon ve Kapatma */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span className="hidden sm:inline">Kare Genişliği:</span>
            <input
              type="range"
              min="14"
              max="55"
              value={pixelsPerSquare}
              onChange={(e) => setPixelsPerSquare(Number(e.target.value))}
              className="w-20 accent-emerald-500 cursor-pointer"
            />
            <span className="text-emerald-400 font-mono font-bold w-9">
              {pixelsPerSquare}px
            </span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-red-400 p-1"
            >
              <XCircle size={18} />
            </button>
          )}
        </div>
      </div>

      {/* EKG Üzerine Binen Tam Boy Pergel Katmanı */}
      <div
        ref={containerRef}
        onClick={handleTrackClick}
        className="relative w-full h-[260px] sm:h-[300px] select-none overflow-hidden"
      >
        {mode === "regular" ? (
          <>
            {/* İki Bacak Arası Dolgu ve Kırmızı Büyük Kare Kılavuzları (Slayt 10) */}
            <div
              className="absolute top-0 bottom-0 bg-emerald-500/15 border-y border-emerald-500/40 pointer-events-none flex items-center justify-center"
              style={{
                left: leftLeg,
                width: Math.max(0, rightLeg - leftLeg),
                backgroundImage: `repeating-linear-gradient(to right, rgba(239,68,68,0.35) 0px, rgba(239,68,68,0.35) 1px, transparent 1px, transparent ${pixelsPerSquare}px)`,
              }}
            >
              <div className="bg-slate-950/90 text-emerald-400 text-xs font-black px-2.5 py-1 rounded-md border border-emerald-500 shadow-lg whitespace-nowrap">
                {squares.toFixed(1)} Kare ({bpm} /dk)
              </div>
            </div>

            {/* Sol Pergel Bacağı */}
            <div
              onPointerDown={(e) => {
                e.stopPropagation();
                setDragging("left");
              }}
              style={{ left: leftLeg }}
              className="absolute top-0 bottom-0 w-7 -ml-3.5 cursor-ew-resize touch-none flex flex-col items-center justify-center group z-20"
            >
              <div className="w-0.5 h-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
              <div className="absolute top-1/2 -translate-y-1/2 w-5 h-10 bg-emerald-500 text-slate-950 rounded-md font-black text-[10px] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                R1
              </div>
            </div>

            {/* Sağ Pergel Bacağı */}
            <div
              onPointerDown={(e) => {
                e.stopPropagation();
                setDragging("right");
              }}
              style={{ left: rightLeg }}
              className="absolute top-0 bottom-0 w-7 -ml-3.5 cursor-ew-resize touch-none flex flex-col items-center justify-center group z-20"
            >
              <div className="w-0.5 h-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
              <div className="absolute top-1/2 -translate-y-1/2 w-5 h-10 bg-emerald-500 text-slate-950 rounded-md font-black text-[10px] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                R2
              </div>
            </div>
          </>
        ) : (
          /* Düzensiz Mod: 15 Büyük Kare (3 Saniye) Penceresi (Slayt 11) */
          <>
            <div
              style={{ left: windowStart, width: windowWidth }}
              className="absolute top-0 bottom-0 border-x-2 border-blue-500 bg-blue-500/15 cursor-crosshair z-10"
            >
              {/* Pencere Sürükleme Başlığı */}
              <div
                onPointerDown={(e) => {
                  e.stopPropagation();
                  setDragging("window");
                }}
                className="bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold px-3 py-1 cursor-grab active:cursor-grabbing touch-none flex items-center justify-between shadow-md"
              >
                <span>↔ 15 Büyük Kare (3 Sn) Cetvelini Sürükle</span>
                <span className="flex items-center gap-1 text-blue-100">
                  <MousePointer2 size={12} /> İçindeki R'lara Tıkla
                </span>
              </div>
            </div>

            {/* İşaretlenen R Dalgaları */}
            {markers.map((m, i) => (
              <div
                key={i}
                style={{ left: m }}
                onClick={(e) => removeMarker(e, i)}
                className="absolute top-0 bottom-0 w-4 -ml-2 cursor-pointer z-20 flex flex-col items-center group"
              >
                <div className="w-0.5 h-full bg-red-500" />
                <div className="mt-8 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center shadow-md group-hover:scale-125 transition-transform">
                  {i + 1}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
