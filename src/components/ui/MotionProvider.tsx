"use client";

import { LazyMotion, MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/* Animasyon motoru ilk yüklemeden çıkarıldı: bileşenler hafif `m` öğelerini kullanır,
   özellikler (domAnimation) ayrı bir parça olarak sonradan gelir. `strict`: yanlışlıkla
   tam `motion` bileşeni kullanılırsa geliştirmede hata verir. */
const loadFeatures = () => import("./motion-features").then(r => r.default);

/** framer-motion animasyonları işletim sistemindeki "hareketi azalt" ayarına uyar. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
