"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Algorithm } from "@/types";
import { getAlgorithmImages, AlgorithmImage } from "@/data/algorithmImages";

interface Props {
  algorithm: Algorithm;
  category: "eriskin" | "cocuk" | "yenidogan";
}

// ─── Lightbox Bileşeni ───────────────────────────────────────────────────────
interface SchemaLightboxProps {
  images: AlgorithmImage[];
  title: string;
  onClose: () => void;
}

function SchemaLightbox({ images, title, onClose }: SchemaLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imgError, setImgError] = useState(false);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const current = images[currentIndex];
  const hasMultiple = images.length > 1;

  useEffect(() => {
    setImgError(false);
    setZoomLevel(1);
  }, [currentIndex]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setCurrentIndex((i) => Math.max(0, i - 1));
      if (e.key === "ArrowRight") setCurrentIndex((i) => Math.min(images.length - 1, i + 1));
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose, images.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    
    if (zoomLevel > 1) {
      setTouchStart(null);
      return;
    }

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const dx = touchStart.x - touchEndX;
    const dy = touchStart.y - touchEndY;
    
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0 && currentIndex < images.length - 1) {
        setCurrentIndex((prev) => prev + 1); // Swiped left -> next
      } else if (dx < 0 && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1); // Swiped right -> previous
      }
    }
    setTouchStart(null);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-black/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex-none flex items-center justify-between px-4 py-3 bg-black/40 border-b border-white/10">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-white/60 text-xs font-semibold uppercase tracking-wider shrink-0">
            {current?.label ?? "Şema"}
          </span>
          <span className="text-white/30 text-xs">·</span>
          <span className="text-white text-sm font-bold truncate">{title}</span>
          {hasMultiple && (
            <span className="shrink-0 ml-1 text-white text-xs font-bold bg-black/60 px-2 py-0.5 rounded-full shadow-md border border-white/10">
              {currentIndex + 1} / {images.length}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="shrink-0 ml-3 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 active:scale-90 transition-all text-white"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {hasMultiple && !imgError && (
        <div className="flex-none flex items-center justify-between gap-3 px-4 py-3 bg-black/60 border-b border-white/10">
          <button
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
            className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 active:scale-90 transition-all text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <div className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-2 px-1">
            {images.map((img, i) => (
              <button
                key={img.src}
                onClick={() => setCurrentIndex(i)}
                className={`shrink-0 transition-all rounded-full px-4 py-1.5 text-xs font-bold ${
                  i === currentIndex
                    ? "bg-white text-black"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {i + 1}. Sayfa
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentIndex((i) => Math.min(images.length - 1, i + 1))}
            disabled={currentIndex === images.length - 1}
            className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 active:scale-90 transition-all text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      )}

      <div
        className={`flex-1 overflow-auto flex items-start p-4 transition-transform ${zoomLevel === 1 ? 'justify-center' : 'justify-start'}`}
        style={{ touchAction: zoomLevel === 1 ? "pan-y pinch-zoom" : "auto" }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {imgError || !current ? (
          <div className="m-auto flex flex-col items-center gap-4 bg-white/10 border border-white/20 rounded-2xl p-8 max-w-sm text-center">
            <span className="text-5xl">🖼️</span>
            <p className="text-white font-bold text-lg">Şema Görseli Bulunamadı</p>
            <p className="text-white/60 text-sm leading-relaxed">
              <code className="text-white/80 bg-white/10 px-2 py-0.5 rounded text-xs">{current?.src}</code>
            </p>
            <button
              onClick={onClose}
              className="mt-2 bg-white/20 hover:bg-white/30 text-white font-bold px-6 py-2.5 rounded-xl active:scale-95 transition-all"
            >
              Kapat
            </button>
          </div>
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            key={current.src}
            src={current.src}
            alt={`${title} - ${current.label}`}
            className="rounded-xl shadow-2xl transition-all duration-200 origin-top-left shrink-0"
            style={{ width: zoomLevel === 1 ? '100%' : `${zoomLevel * 100}%`, minWidth: 280, maxWidth: 'none' }}
            onError={() => setImgError(true)}
            draggable={false}
          />
        )}
      </div>

      {/* Zoom Controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-50 shadow-2xl rounded-full bg-slate-900/90 backdrop-blur-md px-4 py-2 border border-white/20">
        <button 
          onClick={(e) => { e.stopPropagation(); setZoomLevel(z => Math.max(z - 0.5, 1)); }} 
          disabled={zoomLevel <= 1}
          className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white font-black text-2xl flex items-center justify-center active:scale-95 transition-all disabled:opacity-30"
        >
          -
        </button>
        <div className="flex items-center justify-center w-16 text-white font-bold text-base bg-black/40 rounded-full py-1">
          {Math.round(zoomLevel * 100)}%
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); setZoomLevel(z => Math.min(z + 0.5, 4)); }} 
          disabled={zoomLevel >= 4}
          className="w-12 h-12 rounded-full bg-white text-black hover:bg-slate-200 font-black text-2xl flex items-center justify-center active:scale-95 transition-all disabled:opacity-30 shadow-lg"
        >
          +
        </button>
      </div>


    </div>
  );
}

// ─── Ana AlgorithmViewer Bileşeni ─────────────────────────────────────────────
export default function AlgorithmViewer({ algorithm, category }: Props) {
  const [history, setHistory] = useState<string[]>([algorithm.startNodeId]);
  const [viewMode, setViewMode] = useState<"step" | "full">("step");
  const [showLightbox, setShowLightbox] = useState(false);

  const schemaImages = getAlgorithmImages(algorithm.id);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHistory([algorithm.startNodeId]);
    setViewMode("step");
    setShowLightbox(false);
  }, [algorithm.id, algorithm.startNodeId]);

  useEffect(() => {
    if (viewMode === "step") {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [history, viewMode]);

  const handleReset = () => setHistory([algorithm.startNodeId]);
  const advance = (nextId: string) => setHistory((prev) => [...prev, nextId]);
  const goBack = () => {
    if (history.length > 1) {
      setHistory((prev) => prev.slice(0, -1));
    }
  };

  const handleCloseLightbox = useCallback(() => setShowLightbox(false), []);

  useEffect(() => {
    if (viewMode !== "step") return;
    const lastId = history[history.length - 1];
    const lastNode = algorithm.nodes[lastId];
    if (lastNode && lastNode.type === "action" && lastNode.nextId) {
      const timer = setTimeout(() => {
        setHistory((prev) => [...prev, lastNode.nextId!]);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [history, viewMode, algorithm.nodes]);

  if (!algorithm.nodes[algorithm.startNodeId] && viewMode === "step") {
    return (
      <div className="p-6 text-center glass-card border-amber-500/30 bg-amber-500/10 rounded-xl m-4">
        <p className="text-amber-500 font-semibold text-lg">
          Bu algoritmanın veri girişi (JSON) henüz tamamlanmamış.
        </p>
      </div>
    );
  }

  return (
    <>
      {showLightbox && schemaImages.length > 0 && (
        <SchemaLightbox
          images={schemaImages}
          title={algorithm.title}
          onClose={handleCloseLightbox}
        />
      )}

      <div className="w-full max-w-2xl mx-auto p-4 flex flex-col gap-6 animate-in fade-in duration-300">
        <div className="sticky top-4 z-10 p-4 rounded-2xl glass-card shadow-lg flex flex-col gap-3">
          <h2 className="text-xl font-bold leading-tight">{algorithm.title}</h2>
          
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setViewMode(viewMode === "step" ? "full" : "step")}
              className="shrink-0 text-sm font-bold px-4 py-2 rounded-full active:scale-95 transition-all shadow-sm"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)", color: "var(--fg)" }}
            >
              {viewMode === "step" ? "Tüm Akışı Gör" : "Adım Adım Gör"}
            </button>

            {schemaImages.length > 0 && (
              <button
                onClick={() => setShowLightbox(true)}
                className="shrink-0 flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-full active:scale-95 transition-all shadow-sm whitespace-nowrap"
                style={{ background: "rgba(59,130,246,0.15)", color: "#60A5FA", border: "1px solid rgba(59,130,246,0.3)" }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                Şemayı Gör
                {schemaImages.length > 1 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none" style={{ background: "rgba(59,130,246,0.3)" }}>
                    {schemaImages.length}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {viewMode === "step" && (
          <div className="flex flex-col items-center pb-10">
            {history.map((nodeId, index) => {
              const node = algorithm.nodes[nodeId];
              if (!node) return null;

              const isLast = index === history.length - 1;
              let selectedAnswer: string | null = null;
              if (!isLast && node.type === "decision") {
                const nextNodeIdInHistory = history[index + 1];
                if (nextNodeIdInHistory === node.yesId) selectedAnswer = "Evet";
                if (nextNodeIdInHistory === node.noId) selectedAnswer = "Hayır";
              }

              return (
                <div key={`${nodeId}-${index}`} className="w-full flex flex-col items-center">
                  {index > 0 && (
                    <div className="w-0.5 h-6" style={{ background: "var(--glass-border)" }} />
                  )}

                  <div
                    className={`w-full rounded-xl transition-all duration-300 relative overflow-hidden ${
                      node.isCritical ? "" : "glass-card"
                    }`}
                    style={
                      node.isCritical
                        ? { background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", boxShadow: "0 0 15px rgba(239,68,68,0.1)" }
                        : { borderColor: isLast ? "rgba(255,255,255,0.3)" : "var(--glass-border)" }
                    }
                  >
                    {node.isCritical && (
                      <div className="absolute top-0 left-0 bg-red-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-br-lg uppercase tracking-wider">
                        KKM
                      </div>
                    )}
                    <div className={`p-5 ${node.isCritical ? "pt-7" : ""}`}>
                      <p
                        className={`font-medium leading-relaxed ${
                          isLast ? "text-lg text-white" : "text-base text-subtle"
                        } ${node.isCritical ? "text-red-100" : ""}`}
                      >
                        {node.content}
                      </p>
                    </div>
                  </div>

                  {node.type === "decision" && (
                    <>
                      <div className="relative w-full h-8">
                        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-0.5 h-3" style={{ background: "var(--glass-border)" }} />
                        <div className="absolute top-3 left-[25%] right-[25%] h-0.5" style={{ background: "var(--glass-border)" }} />
                        <div className="absolute left-[25%] top-3 w-0.5 h-5" style={{ background: "var(--glass-border)" }} />
                        <div className="absolute right-[25%] top-3 w-0.5 h-5" style={{ background: "var(--glass-border)" }} />
                      </div>

                      {isLast ? (
                        <div className="flex gap-4 w-full">
                          <button
                            onClick={() => node.yesId && advance(node.yesId)}
                            disabled={!node.yesId}
                            className="flex-1 glass-card hover:bg-emerald-500/10 hover:border-emerald-500/50 hover:text-emerald-400 disabled:opacity-50 py-3 rounded-xl font-bold text-lg active:scale-95 transition-all"
                            style={{ borderColor: "rgba(16,185,129,0.3)", color: "#34D399" }}
                          >
                            Evet
                          </button>
                          <button
                            onClick={() => node.noId && advance(node.noId)}
                            disabled={!node.noId}
                            className="flex-1 glass-card hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-400 disabled:opacity-50 py-3 rounded-xl font-bold text-lg active:scale-95 transition-all"
                            style={{ borderColor: "rgba(239,68,68,0.3)", color: "#F87171" }}
                          >
                            Hayır
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-4 w-full">
                          <div
                            className="flex-1 py-3 rounded-xl font-bold text-lg text-center"
                            style={
                              selectedAnswer === "Evet"
                                ? { background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", color: "#34D399" }
                                : { background: "rgba(255,255,255,0.02)", border: "1px solid var(--glass-border)", color: "var(--fg-muted)" }
                            }
                          >
                            Evet
                          </div>
                          <div
                            className="flex-1 py-3 rounded-xl font-bold text-lg text-center"
                            style={
                              selectedAnswer === "Hayır"
                                ? { background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#F87171" }
                                : { background: "rgba(255,255,255,0.02)", border: "1px solid var(--glass-border)", color: "var(--fg-muted)" }
                            }
                          >
                            Hayır
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {isLast && node.type === "action" && node.nextId && (
                    <>
                      <div className="w-0.5 h-4" style={{ background: "var(--glass-border)" }} />
                      <div className="flex gap-3 w-full">
                        {history.length > 1 && (
                          <button
                            onClick={goBack}
                            className="flex-1 glass-card glass-hover py-3 rounded-xl font-bold text-base active:scale-95 transition-all"
                          >
                            ← Önceki
                          </button>
                        )}
                        <button
                          onClick={() => node.nextId && advance(node.nextId)}
                          className="flex-1 py-3 rounded-xl font-bold text-base active:scale-95 transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                          style={{ background: "rgba(59,130,246,0.2)", border: "1px solid rgba(59,130,246,0.5)", color: "#60A5FA" }}
                        >
                          Sonraki Adım →
                        </button>
                      </div>
                    </>
                  )}

                  {isLast &&
                    (node.type === "redirect" ||
                      (!node.nextId && node.type === "action")) && (
                      <>
                        <div className="w-0.5 h-4" style={{ background: "var(--glass-border)" }} />
                        <div className="flex flex-col gap-3 w-full">
                          {node.type === "redirect" && node.targetAlgorithmId ? (
                            <Link
                              href={`/algoritmalar/${category}/${node.targetAlgorithmId}`}
                              className="w-full text-center py-4 rounded-xl font-bold text-lg active:scale-95 transition-all block shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                              style={{ background: "rgba(59,130,246,0.2)", border: "1px solid rgba(59,130,246,0.5)", color: "#60A5FA" }}
                            >
                              {node.content || "İlgili Protocole Git"} 🚀
                            </Link>
                          ) : (
                            <div className="p-4 glass-card rounded-xl text-center font-bold" style={{ borderColor: "rgba(16,185,129,0.3)", color: "#34D399", background: "rgba(16,185,129,0.1)" }}>
                              ✅ Akış Tamamlandı
                            </div>
                          )}
                          <div className="flex gap-3">
                            {history.length > 1 && (
                              <button
                                onClick={goBack}
                                className="flex-1 glass-card glass-hover py-3 rounded-xl font-bold text-base active:scale-95 transition-all"
                              >
                                ← Önceki
                              </button>
                            )}
                            <button
                              onClick={handleReset}
                              className="flex-1 glass-card glass-hover py-3 rounded-xl font-bold text-base active:scale-95 transition-all"
                            >
                              Başa Sar
                            </button>
                          </div>
                        </div>
                      </>
                    )}

                  {isLast && node.type === "decision" && history.length > 1 && (
                    <>
                      <div className="w-0.5 h-4 bg-transparent" />
                      <button
                        onClick={goBack}
                        className="w-full glass-card glass-hover py-3 rounded-xl font-bold text-base active:scale-95 transition-all mt-2"
                      >
                        ← Önceki Adım
                      </button>
                    </>
                  )}
                </div>
              );
            })}
            <div ref={bottomRef} className="h-32" /> {/* Increased padding for BottomNav */}
          </div>
        )}

        {viewMode === "full" && (
          <div className="flex flex-col items-center gap-0">
            {Object.values(algorithm.nodes).length > 0 ? (
              Object.values(algorithm.nodes).map((node, idx) => (
                <div key={node.id} className="w-full flex flex-col items-center">
                  {idx > 0 && <div className="w-0.5 h-6" style={{ background: "var(--glass-border)" }} />}
                  <div
                    className={`w-full rounded-xl relative overflow-hidden ${
                      node.isCritical ? "" : "glass-card"
                    }`}
                    style={
                      node.isCritical
                        ? { background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }
                        : {}
                    }
                  >
                    {node.isCritical && (
                      <div className="absolute top-0 left-0 bg-red-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-br-lg uppercase tracking-wider">
                        KKM
                      </div>
                    )}
                    <div className={`p-4 ${node.isCritical ? "pt-6" : ""}`}>
                      <p className={`font-medium ${node.isCritical ? "text-red-100" : "text-white"}`}>{node.content}</p>
                      {node.type === "decision" && (
                        <div className="mt-3 text-sm flex flex-col gap-1.5">
                          <span
                            className="px-2 py-1 rounded inline-block border"
                            style={{ background: "rgba(16,185,129,0.1)", borderColor: "rgba(16,185,129,0.2)", color: "#34D399" }}
                          >
                            <strong>Evet:</strong>{" "}
                            {algorithm.nodes[node.yesId!]?.content || "Eksik Veri"}
                          </span>
                          <span
                            className="px-2 py-1 rounded inline-block border mt-1"
                            style={{ background: "rgba(239,68,68,0.1)", borderColor: "rgba(239,68,68,0.2)", color: "#F87171" }}
                          >
                            <strong>Hayır:</strong>{" "}
                            {algorithm.nodes[node.noId!]?.content || "Eksik Veri"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-subtle py-8 font-medium">
                Veri bulunamadı.
              </div>
            )}
            <div className="h-24" /> {/* Padding for BottomNav in full mode */}
          </div>
        )}
      </div>
    </>
  );
}
