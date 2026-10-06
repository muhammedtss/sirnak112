"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Number pop-in (Transitions.dev #02): değer her değiştiğinde haneler bulanık bir
 * kayışla yeniden girer. Son iki karakter hafif gecikmeli. Hareket azaltma
 * tercihinde CSS animasyonu kapatır.
 */
export function NumberPop({ value, className = "" }: { value: string | number; className?: string }) {
  const chars = String(value).split("");
  return (
    <span key={String(value)} className={`t-digit-group ${className}`} aria-label={String(value)}>
      {chars.map((ch, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="t-digit"
          data-stagger={i === chars.length - 1 && chars.length > 1 ? "2" : i === chars.length - 2 ? "1" : undefined}
        >
          {ch}
        </span>
      ))}
    </span>
  );
}

const reduceMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Error state shake (Transitions.dev #12): `active` false→true olduğunda öğeyi
 * yatay sarsar. Renk/mesaj gibi statik ipuçları çağıran tarafta kalır.
 */
export function useShake<T extends HTMLElement>(active: boolean): RefObject<T | null> {
  const ref = useRef<T>(null);
  const prev = useRef(active);
  useEffect(() => {
    if (active && !prev.current && ref.current && !reduceMotion()) {
      ref.current.animate(
        [
          { transform: "translateX(0)" },
          { transform: "translateX(-6px)" },
          { transform: "translateX(6px)" },
          { transform: "translateX(-4px)" },
          { transform: "translateX(2px)" },
          { transform: "translateX(0)" },
        ],
        { duration: 300, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
      );
    }
    prev.current = active;
  }, [active]);
  return ref;
}
