"use client";

import { useState } from "react";

/**
 * "Developed by" imzasındaki isim, EKG atımı gibi girer: monitör taraması harf harf
 * ilerler, her harf sırası gelince P–QRS–T salınımı yapıp teal parıltıyla yerine oturur.
 * Böylece isim bir an kalp ritmi dalgası şeklini alır, sonra düzleşir.
 * Açılışta bir kez (~2 sn), dokununca tekrar. Site sahibinin isteğiyle hareket azaltma
 * tercihinde de oynar (globals.css'te bilinçli istisna).
 */
export function SignatureEcg({ name }: { name: string }) {
  const [run, setRun] = useState(0);

  return (
    <span key={run} className="sig-ecg" onPointerDown={() => setRun(r => r + 1)} aria-label={name} role="img">
      {[...name].map((ch, i) => (
        <span key={i} aria-hidden="true" className="sig-ecg-ch" style={{ animationDelay: `${400 + i * 70}ms` }}>
          {ch === " " ? " " : ch}
        </span>
      ))}
    </span>
  );
}
