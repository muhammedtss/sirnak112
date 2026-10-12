"use client";

import { WifiOff } from "lucide-react";
import { useOfflineState } from "@/lib/pwa/sw-client";

/** Çevrimdışıyken: liste sayfası açılır ama belge ve videolar internet ister. */
export function CevrimdisiNot() {
  const { online } = useOfflineState();
  if (online) return null;
  return (
    <p role="status" className="glass-card flex items-start gap-2.5 px-4 py-3 text-xs font-semibold leading-snug text-muted">
      <WifiOff aria-hidden="true" className="shrink-0 mt-px" style={{ width: 15, height: 15 }} />
      Çevrimdışısınız. Liste görüntülenebilir; belgeleri açmak ve videoları izlemek için internet bağlantısı gerekir.
    </p>
  );
}
