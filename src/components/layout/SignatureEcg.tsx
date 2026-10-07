"use client";

import { useState } from "react";

/**
 * "Developed by" imzasındaki isim, EKG atımı gibi girer: monitör taraması harf harf
 * ilerler, her harf sırası gelince P–QRS–T salınımı yapıp teal parıltıyla yerine oturur.
 * Böylece isim bir an kalp ritmi dalgası şeklini alır, sonra düzleşir.
 * Açılışta bir kez (~1 sn), dokununca tekrar; hareket azaltmada statik (globals.css).
 */
export function SignatureEcg({ name }: { name: string }) {
  const [run, setRun] = useState(0);

  return (
    <span key={run} className="sig-ecg" onPointerDown={() => setRun(r => r + 1)} aria-label={name} role="img">
      {[...name].map((ch, i) => (
        <span key={i} aria-hidden="true" className="sig-ecg-ch" style={{ animationDelay: `${120 + i * 55}ms` }}>
          {ch === " " ? " " : ch}
        </span>
      ))}
    </span>
  );
}
