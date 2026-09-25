"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { algorithmImages, AlgorithmImage } from "@/data/algorithmImages";
import { PageShell } from "@/components/layout/PageShell";
import { AppHeader } from "@/components/layout/AppHeader";
import { ArrowLeft, Search, X } from "lucide-react";

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

function getImagesForCategory(kategori: string) {
  const dir = CATEGORY_DIR[kategori];
  if (!dir) return [];
  const results: { title: string; image: AlgorithmImage }[] = [];
  Object.entries(algorithmImages).forEach(([id, images]) => {
    images.forEach((img) => {
      if (img.src.startsWith(dir)) {
        results.push({ title: id, image: img });
      }
    });
  });
  results.sort((a, b) => a.image.src.localeCompare(b.image.src));
  return results;
}

function fileNameToTitle(src: string): string {
  const fileName = src.split("/").pop() ?? src;
  return fileName
    .replace(/^\d+_/, "")
    .replace(/_/g, " ")
    .replace(/\.png$/i, "");
}

function Lightbox({
  images,
  startIndex,
  onClose,
}: {
  images: { title: string; image: AlgorithmImage }[];
  startIndex: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(startIndex);
  const [imgErr, setImgErr] = useState(false);

  useEffect(() => { setImgErr(false); }, [idx]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setIdx((i) => Math.max(0, i - 1));
      if (e.key === "ArrowRight") setIdx((i) => Math.min(images.length - 1, i + 1));
    };
    window.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [onClose, images.length]);

  const current = images[idx];

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-black/90 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex-none flex items-center justify-between px-4 py-3 bg-black/50 border-b border-white/10">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-white/60 text-xs font-semibold uppercase tracking-wider shrink-0">
            {current.image.label}
          </span>
          <span className="text-white/30 text-xs">·</span>
          <span className="text-white text-sm font-bold truncate">
            {fileNameToTitle(current.image.src)}
          </span>
          <span className="shrink-0 ml-1 text-white/50 text-xs">
            ({idx + 1}/{images.length})
          </span>
        </div>
        <button
          onClick={onClose}
          className="shrink-0 ml-3 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 active:scale-90 transition-all text-white"
        >
          <X style={{ width: 20, height: 20 }} />
        </button>
      </div>
      <div
        className="flex-1 overflow-auto flex items-start justify-center p-4"
        style={{ touchAction: "pinch-zoom" }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        {imgErr ? (
          <div className="m-auto text-white/60 text-center p-8">
            <span className="text-5xl block mb-4">🖼️</span>
            <p className="font-semibold">Görsel yüklenemedi</p>
          </div>
        ) : (
          <img
            key={current.image.src}
            src={current.image.src}
            alt={fileNameToTitle(current.image.src)}
            className="max-w-none rounded-2xl shadow-2xl"
            style={{ minWidth: 280, maxWidth: "100%" }}
            onError={() => setImgErr(true)}
            draggable={false}
          />
        )}
      </div>
      <div className="flex-none flex items-center justify-center gap-4 py-3 bg-black/50 border-t border-white/10">
        <button
          onClick={() => setIdx((i) => Math.max(0, i - 1))}
          disabled={idx === 0}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 active:scale-90 transition-all text-white"
        >
          <ArrowLeft style={{ width: 20, height: 20 }} />
        </button>
        <span className="text-white/60 text-sm font-medium min-w-[60px] text-center">
          {idx + 1} / {images.length}
        </span>
        <button
          onClick={() => setIdx((i) => Math.min(images.length - 1, i + 1))}
          disabled={idx === images.length - 1}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 active:scale-90 transition-all text-white"
        >
          <ArrowLeft className="rotate-180" style={{ width: 20, height: 20 }} />
        </button>
      </div>
    </div>
  );
}

export default function AlgoritmalarGorselKategoriPage() {
  const params = useParams();
  const kategori = (params?.kategori as string) ?? "";
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const allImages = getImagesForCategory(kategori);
  const filtered = allImages.filter((item) =>
    fileNameToTitle(item.image.src).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const label = CATEGORY_LABEL[kategori] ?? "Algoritmalar";
  const handleClose = useCallback(() => setLightboxIdx(null), []);

  return (
    <PageShell>
      {lightboxIdx !== null && (
        <Lightbox images={filtered} startIndex={lightboxIdx} onClose={handleClose} />
      )}

      <AppHeader
        title={`${label} Algoritmaları`}
        back="/algoritmalar-gorsel"
        icon={<ArrowLeft style={{ width: 16, height: 16 }} />}
      />

      <div className="sticky top-[57px] z-10 px-4 py-3 glass border-b" style={{ borderColor: "var(--glass-border)" }}>
        <div className="relative max-w-2xl mx-auto">
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

      <main className="flex-1 px-4 py-4 max-w-2xl mx-auto w-full">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted text-sm font-medium">
            {allImages.length === 0 ? "Bu kategoride görsel bulunamadı." : "Sonuç bulunamadı."}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {filtered.map((item, i) => (
              <button
                key={item.image.src}
                onClick={() => setLightboxIdx(i)}
                className="relative group glass-card overflow-hidden hover:shadow-lg active:scale-[0.97] transition-all text-left"
                aria-label={fileNameToTitle(item.image.src)}
              >
                {item.image.label.includes("Anahtar") ? (
                  <div className="absolute top-0 left-0 right-0 z-10 bg-amber-500/90 text-white text-[10px] font-bold text-center py-0.5 tracking-wider uppercase">
                    Anahtar Noktalar
                  </div>
                ) : (
                  <div className="absolute top-0 left-0 right-0 z-10 bg-primary/90 text-white text-[10px] font-bold text-center py-0.5 tracking-wider uppercase">
                    Akış Şeması
                  </div>
                )}
                <img
                  src={item.image.src}
                  alt={fileNameToTitle(item.image.src)}
                  className="w-full aspect-[3/4] object-cover object-top"
                  loading="lazy"
                />
                <div className="p-2 border-t" style={{ borderColor: "var(--glass-border)" }}>
                  <p className="text-xs font-semibold leading-tight line-clamp-2">
                    {fileNameToTitle(item.image.src)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </PageShell>
  );
}
