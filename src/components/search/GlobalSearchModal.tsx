"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X, CornerDownLeft } from "lucide-react";
import { GROUP_ACCENT, SEARCH_GROUPS, searchItems, type SearchGroup } from "./searchIndex";

const OPEN_EVENT = "acil:open-search";

/** Sayfadaki herhangi bir yerden hızlı aramayı açar (ör. ana sayfa hero butonu). */
export function openGlobalSearch() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

const ORNEKLER = ["Arrest", "Astım", "Şok", "Adrenalin", "Glasgow", "I21"];

export default function GlobalSearchModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [group, setGroup] = useState<SearchGroup | "Hepsi">("Hepsi");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listId = useId();

  useEffect(() => setMounted(true), []); // eslint-disable-line react-hooks/set-state-in-effect -- portal hedefi yalnızca istemcide var

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => {
    setIsOpen(false);
    setSearchTerm("");
    setGroup("Hepsi");
    setActive(0);
    triggerRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    window.addEventListener(OPEN_EVENT, open);
    return () => window.removeEventListener(OPEN_EVENT, open);
  }, [open]);

  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => inputRef.current?.focus(), 30);
    return () => clearTimeout(t);
  }, [isOpen]);

  const { items, total } = useMemo(() => searchItems(searchTerm, group), [searchTerm, group]);

  const go = useCallback(
    (url: string) => {
      close();
      router.push(url);
    },
    [close, router],
  );

  // Seçili sonucu görünür tut
  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowDown" && items.length) {
      e.preventDefault();
      setActive(i => (i + 1) % items.length);
    } else if (e.key === "ArrowUp" && items.length) {
      e.preventDefault();
      setActive(i => (i - 1 + items.length) % items.length);
    } else if (e.key === "Enter" && items[active]) {
      e.preventDefault();
      go(items[active].url);
    }
  };

  const hasQuery = searchTerm.trim().length > 0;

  const modal = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="search"
          className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[max(1rem,env(safe-area-inset-top))] sm:pt-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
          onKeyDown={onKeyDown}
        >
          <div className="search-backdrop absolute inset-0" onClick={close} aria-hidden="true" />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Hızlı arama"
            className="search-panel relative w-full max-w-xl flex flex-col max-h-[min(85dvh,640px)] overflow-hidden"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Arama satırı */}
            <div className="flex items-center gap-2 pl-4 pr-1.5 py-1.5 border-b" style={{ borderColor: "var(--glass-border)" }}>
              <Search className="w-5 h-5 shrink-0" style={{ color: "var(--accent-text)" }} strokeWidth={2.25} />
              <input
                ref={inputRef}
                type="search"
                enterKeyHint="go"
                autoComplete="off"
                spellCheck={false}
                role="combobox"
                aria-expanded={items.length > 0}
                aria-controls={listId}
                aria-activedescendant={items[active] ? `${listId}-${active}` : undefined}
                value={searchTerm}
                onChange={e => {
                  setSearchTerm(e.target.value);
                  setActive(0);
                }}
                placeholder="Algoritma, ilaç, skala, tanı kodu…"
                className="search-input flex-1 min-w-0 bg-transparent text-base py-2.5 focus:outline-none"
              />
              {hasQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    inputRef.current?.focus();
                  }}
                  className="header-icon-btn"
                  aria-label="Aramayı temizle"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button type="button" onClick={close} className="header-icon-btn" aria-label="Aramayı kapat">
                <kbd className="hidden sm:inline text-[11px] font-bold px-1.5 py-0.5 rounded-md border" style={{ borderColor: "var(--glass-border-h)" }}>
                  Esc
                </kbd>
                <X className="w-5 h-5 sm:hidden" />
              </button>
            </div>

            {/* Modül filtreleri */}
            <div className="flex items-center gap-1.5 px-3 py-2 overflow-x-auto no-scrollbar border-b" style={{ borderColor: "var(--glass-border)" }}>
              {(["Hepsi", ...SEARCH_GROUPS] as const).map(g => {
                const on = group === g;
                const accent = g === "Hepsi" ? "var(--primary-light)" : GROUP_ACCENT[g];
                return (
                  <button
                    key={g}
                    type="button"
                    aria-pressed={on}
                    onClick={() => {
                      setGroup(g);
                      setActive(0);
                      inputRef.current?.focus();
                    }}
                    className="search-chip shrink-0"
                    style={on ? { color: "var(--fg)", borderColor: `color-mix(in srgb, ${accent} 55%, transparent)`, background: `color-mix(in srgb, ${accent} 16%, transparent)` } : undefined}
                  >
                    {g}
                  </button>
                );
              })}
            </div>

            {/* Sonuçlar */}
            <div ref={listRef} id={listId} role="listbox" aria-label="Arama sonuçları" className="flex-1 overflow-y-auto overscroll-contain p-2">
              {!hasQuery ? (
                <div className="px-3 py-8 text-center">
                  <p className="text-sm font-semibold">Tüm modüllerde ara</p>
                  <p className="text-xs text-muted mt-1">Algoritma, vaka protokolü, ilaç, skala, ICD-10, EKG, envanter ve evrak</p>
                  <div className="flex flex-wrap justify-center gap-1.5 mt-4">
                    {ORNEKLER.map(o => (
                      <button
                        key={o}
                        type="button"
                        onClick={() => {
                          setSearchTerm(o);
                          inputRef.current?.focus();
                        }}
                        className="search-chip"
                      >
                        {o}
                      </button>
                    ))}
                  </div>
                </div>
              ) : items.length === 0 ? (
                <div className="px-3 py-10 text-center">
                  <p className="text-sm font-bold">Sonuç bulunamadı</p>
                  <p className="text-xs text-muted mt-1">
                    “{searchTerm.trim()}” için {group === "Hepsi" ? "hiçbir modülde" : `${group} içinde`} eşleşme yok.
                  </p>
                  {group !== "Hepsi" && (
                    <button type="button" onClick={() => setGroup("Hepsi")} className="search-chip mt-3">
                      Tüm modüllerde ara
                    </button>
                  )}
                </div>
              ) : (
                items.map((item, i) => {
                  const accent = GROUP_ACCENT[item.group];
                  const sel = i === active;
                  return (
                    <button
                      key={item.id}
                      id={`${listId}-${i}`}
                      data-idx={i}
                      type="button"
                      role="option"
                      aria-selected={sel}
                      onMouseMove={() => sel || setActive(i)}
                      onClick={() => go(item.url)}
                      className="search-result w-full text-left flex items-center gap-3 px-3 py-2.5"
                      data-active={sel}
                    >
                      <span className="w-1 self-stretch rounded-full shrink-0" style={{ background: accent }} aria-hidden="true" />
                      <span className="flex-1 min-w-0">
                        <span className="block text-sm font-semibold leading-snug">{item.title}</span>
                        {(item.description || item.tag) && (
                          <span className="block text-xs text-muted mt-0.5 truncate">
                            {item.tag && <span className="font-semibold tabular-nums">{item.tag}</span>}
                            {item.tag && item.description && " · "}
                            {item.description}
                          </span>
                        )}
                      </span>
                      <span className="text-[11px] font-bold shrink-0" style={{ color: accent }}>
                        {item.group}
                      </span>
                      <CornerDownLeft className={`w-3.5 h-3.5 shrink-0 text-subtle hidden sm:block ${sel ? "opacity-100" : "opacity-0"}`} aria-hidden="true" />
                    </button>
                  );
                })
              )}
            </div>

            {hasQuery && (
              <div className="px-4 py-2 text-xs text-subtle border-t flex justify-between tabular-nums" style={{ borderColor: "var(--glass-border)" }}>
                <span role="status">
                  {total} sonuç{total > items.length ? ` · ilk ${items.length} gösteriliyor` : ""}
                </span>
                <span className="hidden sm:inline">↑↓ seç · Enter aç</span>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={open}
        className="header-icon-btn"
        title="Hızlı arama"
        aria-label="Hızlı arama"
        aria-haspopup="dialog"
      >
        <Search className="w-[22px] h-[22px]" strokeWidth={2.2} />
      </button>
      {mounted && createPortal(modal, document.body)}
    </>
  );
}
