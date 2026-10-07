"use client";

import { useEffect, useLayoutEffect, useRef, type Dispatch, type RefObject, type SetStateAction } from "react";

export const ZOOM_MIN = 1;
export const ZOOM_MAX = 4;

const clamp = (z: number) => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z));

/**
 * Kaydırılabilir bir kapsayıcıdaki görsel için parmakla yakınlaştırma.
 * Görselin genişliği `zoom × %100` olarak çizilir (+/− düğmeleriyle aynı model);
 * bu hook iki parmak hareketini ve çift dokunuşu o `zoom` değerine çevirir ve
 * parmakların ortasındaki noktayı yerinde tutacak şekilde kaydırmayı ayarlar.
 *
 * Kapsayıcıda `touch-action: pan-x pan-y` olmalı: tarayıcının kendi sayfa
 * yakınlaştırması devre dışı kalır, tek parmakla kaydırma çalışmaya devam eder.
 */
export function usePinchZoom(
  containerRef: RefObject<HTMLElement | null>,
  zoom: number,
  setZoom: Dispatch<SetStateAction<number>>,
) {
  const zoomRef = useRef(zoom);
  useLayoutEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);
  /** Bir sonraki çizimden sonra ekran noktası (mx,my) altında kalması gereken içerik noktası (zoom=1 ölçeğinde). */
  const anchor = useRef<{ mx: number; my: number; fx: number; fy: number } | null>(null);
  /** Kaydırma (swipe) mantığının iki parmak hareketini sayfa geçişi sanmaması için. */
  const gestureRef = useRef(false);

  useLayoutEffect(() => {
    const el = containerRef.current;
    const a = anchor.current;
    if (!el || !a) return;
    el.scrollLeft = a.fx * zoom - a.mx;
    el.scrollTop = a.fy * zoom - a.my;
    anchor.current = null;
  }, [zoom, containerRef]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let start: { dist: number; zoom: number } | null = null;
    let lastTap = 0;

    const point = (t: Touch) => {
      const r = el.getBoundingClientRect();
      return { x: t.clientX - r.left, y: t.clientY - r.top };
    };

    const setAnchored = (next: number, mx: number, my: number) => {
      const z0 = zoomRef.current;
      anchor.current = { mx, my, fx: (el.scrollLeft + mx) / z0, fy: (el.scrollTop + my) / z0 };
      setZoom(clamp(next));
    };

    const onStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const [a, b] = [point(e.touches[0]), point(e.touches[1])];
        start = { dist: Math.hypot(a.x - b.x, a.y - b.y), zoom: zoomRef.current };
        gestureRef.current = true;
        e.preventDefault();
      } else if (e.touches.length === 1) {
        // Çift dokunuş: 1× ↔ 2×
        const now = Date.now();
        if (now - lastTap < 300) {
          const p = point(e.touches[0]);
          setAnchored(zoomRef.current > 1 ? 1 : 2, p.x, p.y);
          gestureRef.current = true;
          e.preventDefault();
          lastTap = 0;
        } else {
          lastTap = now;
        }
      }
    };

    const onMove = (e: TouchEvent) => {
      if (!start || e.touches.length !== 2) return;
      e.preventDefault();
      const [a, b] = [point(e.touches[0]), point(e.touches[1])];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const next = clamp((start.zoom * dist) / start.dist);
      if (Math.abs(next - zoomRef.current) > 0.01) setAnchored(next, (a.x + b.x) / 2, (a.y + b.y) / 2);
    };

    const onEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) start = null;
      if (e.touches.length === 0) {
        // Swipe mantığı touchend'i aynı olayda okur; bayrağı bir sonraki karede temizle
        requestAnimationFrame(() => (gestureRef.current = false));
      }
    };

    el.addEventListener("touchstart", onStart, { passive: false });
    el.addEventListener("touchmove", onMove, { passive: false });
    el.addEventListener("touchend", onEnd);
    el.addEventListener("touchcancel", onEnd);
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);
      el.removeEventListener("touchcancel", onEnd);
    };
  }, [containerRef, setZoom]);

  return { gestureRef };
}
