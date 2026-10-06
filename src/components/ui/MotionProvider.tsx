"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/** framer-motion animasyonları işletim sistemindeki "hareketi azalt" ayarına uyar. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
