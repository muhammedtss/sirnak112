"use client";

import { useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

type Theme = "dark" | "light";

/* Tema, <html data-theme> üzerinde yaşar (layout'taki satır içi betik ilk boyamadan önce ayarlar). */
function subscribe(onChange: () => void) {
  const mo = new MutationObserver(onChange);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}
const getTheme = (): Theme => (document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark");
const getServerTheme = (): Theme | null => null;

export function ThemeToggle() {
  const theme = useSyncExternalStore<Theme | null>(subscribe, getTheme, getServerTheme);

  if (!theme) return <div className="w-11 h-11 shrink-0" />; // yerleşim kaymasını önle

  const next: Theme = theme === "dark" ? "light" : "dark";
  const label = theme === "dark" ? "Açık temaya geç" : "Koyu temaya geç";

  const toggleTheme = () => {
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };

  return (
    <button type="button" onClick={toggleTheme} className="header-icon-btn" aria-label={label} title={label}>
      <span className="relative w-5 h-5" aria-hidden="true">
        <AnimatePresence initial={false}>
          <motion.span
            key={theme}
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
            transition={{ type: "spring", duration: 0.3, bounce: 0 }}
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </motion.span>
        </AnimatePresence>
      </span>
    </button>
  );
}
