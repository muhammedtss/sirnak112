"use client";

import { useEffect, useState } from "react";

/**
 * Ana kaydırma alanı (#main-scroll-container) aşağı kaydırıldı mı?
 * Histerezis: `enter` pikselinden sonra true, `exit` pikselinin altında false olur.
 * Başlık küçülünce içerik yukarı kaydığı için tek eşik titreşime yol açardı.
 */
export function useScrolled(enter = 24, exit = 4): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const el = document.getElementById("main-scroll-container");
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = el.scrollTop;
      setScrolled(prev => (prev ? y > exit : y > enter));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [enter, exit]);

  return scrolled;
}
