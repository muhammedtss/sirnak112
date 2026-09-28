"use client";

import { useEffect } from "react";
import { WifiOff } from "lucide-react";
import { startServiceWorker, useOfflineState } from "@/lib/pwa/sw-client";

/** Kök layout'ta bir kez: service worker'ı başlatır, çevrimdışıyken bant gösterir. */
export function OfflineManager() {
  const { online, complete, mode } = useOfflineState();

  useEffect(() => {
    startServiceWorker();
  }, []);

  if (online) return null;

  return (
    <div
      role="status"
      className="fixed top-2 left-1/2 -translate-x-1/2 z-[90] flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-bold shadow-lg border backdrop-blur-md pointer-events-none"
      style={{ background: "rgba(251,191,36,0.16)", borderColor: "rgba(251,191,36,0.4)", color: "#FBBF24" }}
    >
      <WifiOff style={{ width: 13, height: 13 }} />
      {mode === "active" && complete ? "Çevrimdışı — kayıtlı içerik kullanılıyor" : "Çevrimdışı mod"}
    </div>
  );
}
