"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Ruler, Activity, XCircle, MousePointer2 } from "lucide-react";

interface Props {
  onClose?: () => void;
}

export default function DigitalCaliper({ onClose }: Props) {
  const [mode, setMode] = useState<"regular" | "irregular">("regular");
  const [pixelsPerSquare, setPixelsPerSquare] = useState(30); // Default calibration
  
  // Regular Mode State
  const [leftLeg, setLeftLeg] = useState(50);
  const [rightLeg, setRightLeg] = useState(200);
  const [dragging, setDragging] = useState<"left" | "right" | "window" | null>(null);

  // Irregular Mode State
  const [windowStart, setWindowStart] = useState(50);
  const [markers, setMarkers] = useState<number[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);

  const windowWidth = 15 * pixelsPerSquare; // 15 large squares

  // Mouse Move Handler
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));

      if (mode === "regular") {
        if (dragging === "left") {
          setLeftLeg(Math.min(x, rightLeg - 10));
        } else if (dragging === "right") {
          setRightLeg(Math.max(x, leftLeg + 10));
        }
      } else {
        if (dragging === "window") {
          // keep window entirely inside container if possible, but allow dragging
          const maxStart = rect.width - windowWidth;
          setWindowStart(Math.max(0, Math.min(x, maxStart > 0 ? maxStart : rect.width)));
        }
      }
    };

    const handleMouseUp = () => setDragging(null);

    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, leftLeg, rightLeg, mode, windowWidth]);

  // Touch Move Handler
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (!dragging || !containerRef.current) return;
      e.preventDefault(); // prevent scrolling
      const rect = containerRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));

      if (mode === "regular") {
        if (dragging === "left") setLeftLeg(Math.min(x, rightLeg - 10));
        else if (dragging === "right") setRightLeg(Math.max(x, leftLeg + 10));
      } else {
        if (dragging === "window") {
          const maxStart = rect.width - windowWidth;
          setWindowStart(Math.max(0, Math.min(x, maxStart > 0 ? maxStart : rect.width)));
        }
      }
    };

    const handleTouchEnd = () => setDragging(null);

    if (dragging) {
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("touchend", handleTouchEnd);
    }
    return () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [dragging, leftLeg, rightLeg, mode, windowWidth]);

  const addMarker = (e: React.MouseEvent) => {
    if (mode !== "irregular") return;
    if (dragging) return; // don't add marker if we were dragging
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setMarkers([...markers, x]);
  };

  const removeMarker = (e: React.MouseEvent, idx: number) => {
    e.stopPropagation();
    setMarkers(markers.filter((_, i) => i !== idx));
  };

  const squares = mode === "regular" ? (rightLeg - leftLeg) / pixelsPerSquare : 15;
  const bpm = mode === "regular" ? Math.round(300 / squares) : markers.length * 20;

  return (
    <div className="absolute inset-0 z-50 pointer-events-none flex flex-col">
      {/* HUD Panel */}
      <div className="pointer-events-auto bg-slate-900/95 backdrop-blur-md border border-slate-700 p-3 m-2 rounded-xl shadow-2xl flex flex-col gap-3 self-start max-w-sm">
        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2 text-emerald-500 font-bold">
            <Ruler size={18} />
            <span className="text-sm">Dijital Pergel</span>
          </div>
          {onClose && (
            <button onClick={onClose} className="text-slate-400 hover:text-red-400">
              <XCircle size={18} />
            </button>
          )}
        </div>

        {/* Mode Selector */}
        <div className="flex bg-slate-950 p-1 rounded-lg">
          <button 
            onClick={() => { setMode("regular"); setMarkers([]); }}
            className={`flex-1 text-xs py-1.5 font-bold rounded-md transition-all ${mode === "regular" ? "bg-emerald-500 text-slate-950" : "text-slate-400 hover:text-slate-200"}`}
          >
            Düzenli (300/Kare)
          </button>
          <button 
            onClick={() => setMode("irregular")}
            className={`flex-1 text-xs py-1.5 font-bold rounded-md transition-all ${mode === "irregular" ? "bg-blue-500 text-slate-950" : "text-slate-400 hover:text-slate-200"}`}
          >
            Düzensiz (3 Saniye)
          </button>
        </div>

        {/* Results */}
        <div className="flex items-center justify-between bg-slate-950 p-3 rounded-lg border border-slate-800">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Tahmini Kalp Hızı</span>
            <span className="text-2xl font-black text-white">{isFinite(bpm) && bpm > 0 ? bpm : 0} <span className="text-xs text-slate-400 font-normal">/ dk</span></span>
          </div>
          <div className="text-right flex flex-col items-end">
            {mode === "regular" ? (
              <>
                <span className="text-[10px] text-slate-500 font-bold uppercase">Mesafe</span>
                <span className="text-sm text-emerald-400 font-bold">{squares.toFixed(1)} Kare</span>
              </>
            ) : (
              <>
                <span className="text-[10px] text-slate-500 font-bold uppercase">R Dalgası</span>
                <span className="text-sm text-blue-400 font-bold">{markers.length} Adet</span>
              </>
            )}
          </div>
        </div>

        {/* Calibration Slider */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-[10px] text-slate-500 font-bold">
            <span>Izgara Kalibrasyonu</span>
            <span>{pixelsPerSquare}px = 1 Kare</span>
          </div>
          <input 
            type="range" 
            min="10" 
            max="60" 
            value={pixelsPerSquare} 
            onChange={(e) => setPixelsPerSquare(Number(e.target.value))}
            className="w-full accent-emerald-500"
          />
        </div>
      </div>

      {/* Caliper Overlay Area */}
      <div 
        ref={containerRef}
        className="flex-1 relative pointer-events-auto overflow-hidden group cursor-crosshair"
        onMouseDown={mode === "irregular" ? addMarker : undefined}
      >
        <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors pointer-events-none" />

        {mode === "regular" ? (
          <>
            {/* Left Leg */}
            <div 
              className="absolute top-0 bottom-0 w-4 -ml-2 cursor-col-resize flex justify-center hover:bg-emerald-500/20 active:bg-emerald-500/30 transition-colors"
              style={{ left: leftLeg }}
              onMouseDown={(e) => { e.stopPropagation(); setDragging("left"); }}
              onTouchStart={(e) => { e.stopPropagation(); setDragging("left"); }}
            >
              <div className="w-0.5 h-full bg-emerald-500 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-8 bg-emerald-500 rounded-sm" />
              </div>
            </div>

            {/* Right Leg */}
            <div 
              className="absolute top-0 bottom-0 w-4 -ml-2 cursor-col-resize flex justify-center hover:bg-emerald-500/20 active:bg-emerald-500/30 transition-colors"
              style={{ left: rightLeg }}
              onMouseDown={(e) => { e.stopPropagation(); setDragging("right"); }}
              onTouchStart={(e) => { e.stopPropagation(); setDragging("right"); }}
            >
              <div className="w-0.5 h-full bg-emerald-500 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-8 bg-emerald-500 rounded-sm" />
              </div>
            </div>

            {/* Connecting Line */}
            <div 
              className="absolute top-1/2 h-0.5 bg-emerald-500/50 pointer-events-none"
              style={{ left: leftLeg, width: rightLeg - leftLeg }}
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-emerald-400 text-xs font-bold px-2 py-0.5 rounded border border-emerald-500/50">
                {squares.toFixed(1)} K
              </div>
            </div>
          </>
        ) : (
          /* Irregular Mode Window */
          <div 
            className="absolute top-0 bottom-0 border-l-2 border-r-2 border-blue-500 bg-blue-500/10 cursor-move group/window"
            style={{ left: windowStart, width: windowWidth }}
            onMouseDown={(e) => { e.stopPropagation(); setDragging("window"); }}
            onTouchStart={(e) => { e.stopPropagation(); setDragging("window"); }}
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow pointer-events-none">
              3 Saniye (15 Kare) Cetveli
            </div>
            
            {/* Informational overlay text */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/window:opacity-100 transition-opacity pointer-events-none">
              <span className="bg-slate-900/80 text-blue-300 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <MousePointer2 size={12}/> R dalgalarına tıkla
              </span>
            </div>

            {/* Markers */}
            {markers.map((m, i) => (
              <div 
                key={i}
                className="absolute top-0 bottom-0 w-0.5 bg-red-500 group/marker cursor-pointer"
                style={{ left: m }}
                onClick={(e) => removeMarker(e, i)}
              >
                <div className="absolute top-10 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-500 text-white flex items-center justify-center text-[10px] font-bold rounded-full scale-0 group-hover/marker:scale-100 transition-transform shadow-lg">
                  <XCircle size={12}/>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
