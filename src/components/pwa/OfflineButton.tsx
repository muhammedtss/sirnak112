"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  CloudCheck,
  CloudDownload,
  CloudOff,
  Loader2,
  RefreshCw,
  Trash2,
  WifiOff,
} from "lucide-react";
import {
  downloadPack,
  removePack,
  useOfflineState,
  type OfflineState,
  type PackStatus,
  type SyncProgress,
} from "@/lib/pwa/sw-client";

const formatMB = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1).replace(".", ",")} MB`;

function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
      <div className="h-full w-full rounded-full origin-left transition-transform duration-200 ease-out" style={{ transform: `scaleX(${Math.min(1, Math.max(0, value))})`, background: color }} />
    </div>
  );
}

interface PackRowProps {
  name: string;
  pack: PackStatus;
  online: boolean;
  busy: boolean;
  progress: SyncProgress | null;
}

function PackRow({ name, pack, online, busy, progress }: PackRowProps) {
  const done = pack.cached >= pack.files;
  const downloading = busy && pack.enabled && !done;
  const live = downloading && progress?.phase === "assets" && progress.total > 0 ? progress : null;
  const ratio = live ? live.done / live.total : pack.files ? pack.cached / pack.files : 0;

  return (
    <div className="rounded-xl bg-black/[0.03] dark:bg-black/20 border border-white/10 p-3 space-y-2">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-bold truncate">{pack.label}</p>
          <p className="text-[11px] text-muted">
            {pack.files} dosya · {formatMB(pack.bytes)}
            {pack.cached > 0 && !done && ` · ${pack.cached} kayıtlı`}
          </p>
        </div>
        {done ? (
          <button
            type="button"
            onClick={() => removePack(name)}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10 transition group"
            aria-label={`${pack.label} paketini cihazdan kaldır`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 group-hover:hidden" />
            <Trash2 className="w-3.5 h-3.5 hidden group-hover:block" />
            <span className="group-hover:hidden">İndirildi</span>
            <span className="hidden group-hover:inline">Kaldır</span>
          </button>
        ) : downloading ? (
          <span className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-sky-400 tabular-nums">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            {live ? `${live.done}/${live.total}` : "Sırada"}
          </span>
        ) : (
          <button
            type="button"
            disabled={!online}
            onClick={() => downloadPack(name)}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-sky-400 border border-sky-500/30 bg-sky-500/10 disabled:opacity-40 active:scale-[0.97] transition"
          >
            <CloudDownload className="w-3.5 h-3.5" /> {pack.enabled || pack.cached > 0 ? "Devam et" : "İndir"}
          </button>
        )}
      </div>
      {(downloading || (pack.cached > 0 && !done)) && (
        <ProgressBar value={ratio} color="#38BDF8" />
      )}
    </div>
  );
}

/** Çevrimdışı durum paneli (başlıktaki butondan açılır). */
function OfflinePanel({ s }: { s: OfflineState }) {
  let icon = <Loader2 className="w-4 h-4 animate-spin text-sky-400" />;
  let title = "Çevrimdışı kullanım hazırlanıyor";
  let detail: string | null = null;

  if (s.mode === "unsupported") {
    icon = <WifiOff className="w-4 h-4 text-muted" />;
    title = "Tarayıcınız çevrimdışı kullanımı desteklemiyor";
  } else if (s.mode === "disabled") {
    icon = <WifiOff className="w-4 h-4 text-muted" />;
    title = "Çevrimdışı mod geliştirme sunucusunda kapalı";
    detail = "Yalnızca yayındaki (production) sürümde etkinleşir.";
  } else if (s.syncing && s.progress?.phase === "pages") {
    detail = `Sayfalar kaydediliyor… ${s.progress.done}/${s.progress.total}`;
  } else if (s.complete) {
    icon = <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
    title = "İnternetsiz kullanıma hazır";
    detail = `${s.pagesTotal} sayfa, tüm hesaplayıcılar ve protokoller cihazda kayıtlı.`;
  } else if (!s.online) {
    icon = <WifiOff className="w-4 h-4 text-amber-400" />;
    title = "Kısmen hazır";
    detail = `${s.pagesCached}/${s.pagesTotal || "?"} sayfa kayıtlı — bağlantı gelince tamamlanacak.`;
  } else if (s.syncing) {
    detail = "Dosyalar kaydediliyor…";
  }

  const pageProgress =
    s.syncing && s.progress?.phase === "pages" && s.progress.total ? s.progress.done / s.progress.total : null;

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">{icon}</div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold leading-snug">{title}</p>
          {detail && <p className="text-[11px] text-muted mt-0.5 leading-relaxed">{detail}</p>}
        </div>
      </div>

      {pageProgress !== null && <ProgressBar value={pageProgress} color="#34D399" />}

      {s.mode === "active" &&
        Object.entries(s.packs).map(([name, pack]) => (
          <PackRow key={name} name={name} pack={pack} online={s.online} busy={s.syncing} progress={s.progress} />
        ))}

      {s.mode === "active" && (
        <p className="text-[11px] text-subtle leading-relaxed">
          iPhone&apos;da kalıcı çevrimdışı kullanım için Safari&apos;de Paylaş → Ana Ekrana Ekle ile yükleyin.
        </p>
      )}
    </div>
  );
}

function buttonAppearance(s: OfflineState): { icon: React.ReactNode; label: string } {
  const cls = "w-[19px] h-[19px]";
  if (s.mode === "unsupported" || s.mode === "disabled")
    return { icon: <CloudOff className={`${cls} text-muted`} />, label: "Çevrimdışı kullanım kapalı" };
  if (s.syncing)
    return { icon: <RefreshCw className={`${cls} text-sky-400 animate-spin`} />, label: "Çevrimdışı içerik kaydediliyor" };
  if (!s.online) return { icon: <CloudOff className={`${cls} text-amber-400`} />, label: "Çevrimdışısınız" };
  if (s.complete) return { icon: <CloudCheck className={`${cls} text-emerald-400`} />, label: "Çevrimdışı kullanıma hazır" };
  return { icon: <CloudDownload className={`${cls} text-amber-400`} />, label: "Çevrimdışı içerik eksik" };
}

/** Başlık çubuğundaki küçük çevrimdışı durum butonu + açılır panel. */
export function OfflineButton() {
  const s = useOfflineState();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (s.mode === "pending") return <div className="w-11 h-11 shrink-0" />; // yerleşim kaymasını önle

  const { icon, label } = buttonAppearance(s);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-label={label}
        title={label}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="header-icon-btn"
      >
        {/* Durum değişince ikon çapraz geçişle değişir (ör. senkron bitti → bulut onayı) */}
        <span className="relative w-[19px] h-[19px]" aria-hidden="true">
          <AnimatePresence initial={false}>
            <motion.span
              key={label}
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
              transition={{ type: "spring", duration: 0.3, bounce: 0 }}
            >
              {icon}
            </motion.span>
          </AnimatePresence>
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Çevrimdışı kullanım"
            className="absolute right-0 top-full mt-2 z-50 w-[min(20rem,calc(100vw-2rem))] glass-card p-4 shadow-2xl origin-top-right"
            style={{ background: "var(--bg-surface)" }}
            initial={{ opacity: 0, scale: 0.96, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -2 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[11px] font-bold uppercase tracking-widest text-subtle mb-3">Çevrimdışı Kullanım</p>
            <OfflinePanel s={s} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
