"use client";

import { useState } from "react";

/**
 * "Developed by" imzasındaki isim: monitör taraması gibi soldan sağa çizilen bir EKG
 * atımı (P–QRS–T), iz bitince isim bulanıklıktan netleşerek belirir.
 * Sayfa açılışında bir kez oynar (~1 sn, hiçbir öğeyi engellemez); dokununca tekrar oynar.
 * Hareket azaltma tercihinde iz ve isim doğrudan statik görünür (globals.css).
 */
export function SignatureEcg({ name }: { name: string }) {
  const [run, setRun] = useState(0);

  return (
    <span
      key={run}
      className="sig-ecg inline-flex items-center gap-1 align-middle"
      onPointerDown={() => setRun(r => r + 1)}
      aria-label={name}
      role="img"
    >
      <svg width="46" height="14" viewBox="0 0 46 14" fill="none" aria-hidden="true" className="sig-ecg-trace shrink-0">
        <path
          pathLength={1}
          d="M0 8 H8 Q10.5 5 13 8 H17 L19 10 L22 1 L25.5 13.5 L27.5 8 H31 Q34.5 3.5 38 8 H46"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="sig-ecg-name" aria-hidden="true">
        {name}
      </span>
    </span>
  );
}
