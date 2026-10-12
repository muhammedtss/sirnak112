"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Play, WifiOff, X } from "lucide-react";
import { useOfflineState } from "@/lib/pwa/sw-client";
import type { EgitimVideo } from "@/lib/egitim";
import { EGITIM_RENK } from "./renk";

/**
 * Video listesi: başlığa dokunulunca o video satırın altında oynatılır (aynı anda tek video).
 * YouTube oynatıcısı gizlilik modundadır (youtube-nocookie) ve yalnızca dokunulunca yüklenir;
 * sayfa açılışında YouTube'a hiçbir istek gitmez (küçük resim dahil).
 */
export function VideoListesi({ videolar }: { videolar: EgitimVideo[] }) {
  const [aktif, setAktif] = useState<string | null>(null);
  const [isaretli, setIsaretli] = useState<string | null>(null);
  const { online } = useOfflineState();

  // Aramadan gelinen video (#video-…) işaretlenir. Next istemci gezintisi :target'ı güncellemediği için
  // hash elle okunur; video yine yalnızca kullanıcı dokununca yüklenir.
  useEffect(() => {
    const oku = () => setIsaretli(location.hash.match(/^#video-([\w-]{11})$/)?.[1] ?? null);
    const zaman = setTimeout(oku); // rAF arka plandaki sekmede çalışmaz
    window.addEventListener("hashchange", oku);
    return () => {
      clearTimeout(zaman);
      window.removeEventListener("hashchange", oku);
    };
  }, []);

  return (
    <ol className="glass-card overflow-hidden divide-y divide-(--glass-border)">
      {videolar.map(v => {
        const acik = aktif === v.id;
        return (
          <li key={v.id} id={`video-${v.id}`} data-isaretli={isaretli === v.id} className="video-satir scroll-mt-20">
            <button
              type="button"
              onClick={() => setAktif(acik ? null : v.id)}
              aria-expanded={acik}
              aria-controls={`oynatici-${v.id}`}
              className="liste-satir w-full flex items-center gap-3 px-4 py-3 min-h-14 text-left"
            >
              <span
                aria-hidden="true"
                data-acik={acik}
                className="video-dugme relative shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: `${EGITIM_RENK}22`, border: `1px solid ${EGITIM_RENK}33`, color: EGITIM_RENK }}
              >
                <Play className="video-ikon-oynat absolute" style={{ width: 16, height: 16, marginLeft: 2 }} fill="currentColor" strokeWidth={0} />
                <X className="video-ikon-kapat absolute" style={{ width: 16, height: 16 }} strokeWidth={2.5} />
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-semibold leading-snug text-pretty">{v.baslik}</span>
                {v.altBaslik && <span className="block text-[11px] text-muted mt-0.5">{v.altBaslik}</span>}
              </span>
              <span className="sr-only">{acik ? "Videoyu kapat" : "Videoyu oynat"}</span>
            </button>

            {acik && (
              <div id={`oynatici-${v.id}`} className="animate-in slide-in-from-top-2 px-4 pb-4 space-y-2">
                {online ? (
                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-black img-outline">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0&playsinline=1`}
                      title={v.baslik}
                      className="w-full h-full"
                      allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                      referrerPolicy="strict-origin-when-cross-origin"
                    />
                  </div>
                ) : (
                  <p className="flex items-center gap-2 rounded-xl px-3 py-3 text-xs font-semibold text-muted" style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>
                    <WifiOff aria-hidden="true" className="shrink-0" style={{ width: 15, height: 15 }} />
                    Video için internet bağlantısı gerekir.
                  </p>
                )}
                <a
                  href={`https://www.youtube.com/watch?v=${v.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link inline-flex items-center gap-1 min-h-11 text-xs font-semibold text-muted"
                >
                  YouTube&apos;da aç
                  <ArrowUpRight aria-hidden="true" style={{ width: 14, height: 14 }} />
                  <span className="sr-only">(yeni sekmede açılır)</span>
                </a>
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
