"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { algorithmImages, AlgorithmImage } from "@/data/algorithmImages";
import { PageShell } from "@/components/layout/PageShell";
import { AppHeader } from "@/components/layout/AppHeader";
import { ArrowLeft, Search, ChevronDown, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORY_DIR: Record<string, string> = {
  yetiskin: "/Yetiskin_Algoritmalari/",
  cocuk: "/Cocuk_Algoritmalari/",
  yenidogan: "/Dogum_Yenidogan_Algoritmalari/",
};

const CATEGORY_LABEL: Record<string, string> = {
  yetiskin: "Erişkin",
  cocuk: "Çocuk",
  yenidogan: "Doğum / Yenidoğan",
};

interface AlgoGroup {
  id: string;
  title: string;
  images: AlgorithmImage[];
}

function getImagesForCategory(kategori: string): AlgoGroup[] {
  const dir = CATEGORY_DIR[kategori];
  if (!dir) return [];
  const results: AlgoGroup[] = [];
  Object.entries(algorithmImages).forEach(([id, images]) => {
    const matched = images.filter((img) => img.src.startsWith(dir));
    if (matched.length > 0) {
      // Clean title from the main flow chart (usually the last one without "Anahtar")
      const mainImg = matched.find((m) => !m.label.includes("Anahtar")) || matched[0];
      const title = mainImg.src
        .split("/")
        .pop()!
        .replace(/^\d+_/, "")
        .replace(/_/g, " ")
        .replace(/\.png$/i, "");
      
      results.push({ id, title, images: matched });
    }
  });
  results.sort((a, b) => a.title.localeCompare(b.title, "tr"));
  return results;
}

// Lightbox for full screen zooming of a specific image group
function Lightbox({
  group,
  startIndex,
  onClose,
}: {
  group: AlgoGroup;
  startIndex: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(startIndex);
  const [imgErr, setImgErr] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => { setImgErr(false); setZoomLevel(1); }, [idx]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setIdx((i) => Math.max(0, i - 1));
      if (e.key === "ArrowRight") setIdx((i) => Math.min(group.images.length - 1, i + 1));
    };
    window.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [onClose, group.images.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    if (zoomLevel > 1) { setTouchStart(null); return; }
    const dx = touchStart.x - e.changedTouches[0].clientX;
    const dy = touchStart.y - e.changedTouches[0].clientY;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0 && idx < group.images.length - 1) setIdx((p) => p + 1);
      else if (dx < 0 && idx > 0) setIdx((p) => p - 1);
    }
    setTouchStart(null);
  };

  const current = group.images[idx];

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black/90 backdrop-blur-md" role="dialog" aria-modal="true">
      <div className="flex-none flex items-center justify-between px-4 py-3 bg-black/50 border-b border-white/10">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-white/60 text-xs font-semibold uppercase tracking-wider shrink-0">
            {current.label}
          </span>
          <span className="text-white/30 text-xs">·</span>
          <span className="text-white text-sm font-bold truncate">{group.title}</span>
          {group.images.length > 1 && (
            <span className="shrink-0 ml-1 text-white text-xs font-bold bg-black/60 px-2 py-0.5 rounded-full shadow-md border border-white/10">
              {idx + 1} / {group.images.length}
            </span>
          )}
        </div>
        <button onClick={onClose} className="shrink-0 ml-3 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 active:scale-90 transition-all text-white">
          <X style={{ width: 20, height: 20 }} />
        </button>
      </div>

      <div
        className={`flex-1 overflow-auto flex items-start p-4 transition-transform ${zoomLevel === 1 ? 'justify-center' : 'justify-start'}`}
        style={{ touchAction: zoomLevel === 1 ? "pan-y pinch-zoom" : "auto" }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {imgErr ? (
          <div className="m-auto text-white/60 text-center p-8">
            <span className="text-5xl block mb-4">🖼️</span>
            <p className="font-semibold">Görsel yüklenemedi</p>
          </div>
        ) : (
          <img
            key={current.src}
            src={current.src}
            alt={`${group.title} - ${current.label}`}
            className="rounded-xl shadow-2xl transition-all duration-200 origin-top-left shrink-0"
            style={{ width: zoomLevel === 1 ? '100%' : `${zoomLevel * 100}%`, minWidth: 280, maxWidth: 'none' }}
            onError={() => setImgErr(true)}
            draggable={false}
          />
        )}
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-50 shadow-2xl rounded-full bg-slate-900/90 backdrop-blur-md px-4 py-2 border border-white/20">
        <button onClick={(e) => { e.stopPropagation(); setZoomLevel(z => Math.max(z - 0.5, 1)); }} disabled={zoomLevel <= 1} className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white font-black text-2xl flex items-center justify-center active:scale-95 transition-all disabled:opacity-30">-</button>
        <div className="flex items-center justify-center w-16 text-white font-bold text-base bg-black/40 rounded-full py-1">{Math.round(zoomLevel * 100)}%</div>
        <button onClick={(e) => { e.stopPropagation(); setZoomLevel(z => Math.min(z + 0.5, 4)); }} disabled={zoomLevel >= 4} className="w-12 h-12 rounded-full bg-white text-black hover:bg-slate-200 font-black text-2xl flex items-center justify-center active:scale-95 transition-all disabled:opacity-30 shadow-lg">+</button>
      </div>

      {group.images.length > 1 && (
        <div className="flex-none flex items-center justify-center gap-4 py-3 bg-black/50 border-t border-white/10 relative z-40">
          <button onClick={() => setIdx((i) => Math.max(0, i - 1))} disabled={idx === 0} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 active:scale-90 transition-all text-white"><ArrowLeft style={{ width: 20, height: 20 }} /></button>
          <button onClick={() => setIdx((i) => Math.min(group.images.length - 1, i + 1))} disabled={idx === group.images.length - 1} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 active:scale-90 transition-all text-white"><ArrowLeft className="rotate-180" style={{ width: 20, height: 20 }} /></button>
        </div>
      )}
    </div>
  );
}

export default function AlgoritmalarGorselKategoriPage() {
  const params = useParams();
  const kategori = (params?.kategori as string) ?? "";
  const [searchTerm, setSearchTerm] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<{ group: AlgoGroup; idx: number } | null>(null);

  const allGroups = getImagesForCategory(kategori);
  const filtered = allGroups.filter((group) =>
    group.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const label = CATEGORY_LABEL[kategori] ?? "Algoritmalar";

  return (
    <PageShell>
      {lightbox && (
        <Lightbox group={lightbox.group} startIndex={lightbox.idx} onClose={() => setLightbox(null)} />
      )}

      <AppHeader
        title={`${label} Görsel Algoritmaları`}
        back="/algoritmalar-gorsel"
        icon={<ArrowLeft style={{ width: 16, height: 16 }} />}
      />

      <div className="sticky top-[57px] z-10 px-4 py-3 glass border-b" style={{ borderColor: "var(--glass-border)" }}>
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-subtle" style={{ width: 15, height: 15 }} />
          <input
            type="text"
            className="glass-input w-full pl-10 pr-4 py-2.5 text-sm"
            placeholder="Algoritma ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <main className="flex-1 px-4 py-4 w-full max-w-md mx-auto">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted text-sm font-medium">
            {allGroups.length === 0 ? "Bu kategoride görsel bulunamadı." : "Sonuç bulunamadı."}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((group) => {
              const isOpen = openId === group.id;
              return (
                <div key={group.id} className="glass-card overflow-hidden" style={{ borderColor: isOpen ? "rgba(59,130,246,0.3)" : "var(--glass-border)" }}>
                  <button
                    onClick={() => setOpenId(isOpen ? null : group.id)}
                    className="w-full flex items-center justify-between px-4 py-3.5 group text-left"
                    style={{ background: isOpen ? "rgba(59,130,246,0.05)" : "transparent" }}
                  >
                    <span className="text-sm font-semibold leading-tight pr-4">{group.title}</span>
                    <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown className="shrink-0 text-subtle" style={{ width: 16, height: 16 }} />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 pt-1 grid grid-cols-2 gap-3 border-t" style={{ borderColor: "var(--glass-border)" }}>
                          {group.images.map((img, i) => (
                            <button
                              key={img.src}
                              onClick={() => setLightbox({ group, idx: i })}
                              className="relative group/img rounded-xl overflow-hidden shadow-sm active:scale-95 transition-all text-left"
                            >
                              <div className="absolute top-0 left-0 right-0 z-10 text-[10px] font-bold text-center py-0.5 tracking-wider uppercase text-white shadow-md"
                                   style={{ background: img.label.includes("Anahtar") ? "rgba(245,158,11,0.9)" : "rgba(59,130,246,0.9)" }}
                              >
                                {img.label}
                              </div>
                              <img
                                src={img.src}
                                alt={img.label}
                                className="w-full aspect-[3/4] object-cover object-top border border-white/10 rounded-xl"
                                loading="lazy"
                              />
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </PageShell>
  );
}
