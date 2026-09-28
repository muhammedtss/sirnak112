"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent as RPointerEvent } from "react";

/* ════════════════════════════════════════════════════════════════
   Sürüklenebilir kaliper (pergel).
   Şeridin üzerine SVG olarak yerleşir; koordinatlar şeridin kendi
   birimindedir (üretilmiş şeritte mm, gerçek görselde piksel).
   `mmPerUnit` verilirse aralık saniye ve /dk olarak gösterilir.
   Ortadaki köprü sürüklenince iki bacak birlikte kayar: aynı aralığı
   şeridin başka yerine taşıyıp ritmin düzenliliği kontrol edilir.
   ════════════════════════════════════════════════════════════════ */

interface CaliperProps {
  width: number;
  height: number;
  /** 1 birim kaç mm (üretilmiş şerit: 1). Verilmezse sayı gösterilmez. */
  mmPerUnit?: number;
}

type Drag = { kind: "a" | "b" | "bridge"; startX: number; a0: number; b0: number };

export default function Caliper({ width, height, mmPerUnit }: CaliperProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [a, setA] = useState(width * 0.2);
  const [b, setB] = useState(width * 0.2 + (mmPerUnit ? 20 / mmPerUnit : width * 0.12));
  const drag = useRef<Drag | null>(null);

  const toUnits = useCallback((clientX: number) => {
    const svg = svgRef.current;
    const ctm = svg?.getScreenCTM();
    if (!svg || !ctm) return 0;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = 0;
    return pt.matrixTransform(ctm.inverse()).x;
  }, []);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      const d = drag.current;
      if (!d) return;
      e.preventDefault();
      const dx = toUnits(e.clientX) - d.startX;
      const min = width * 0.01;
      if (d.kind === "a") setA(Math.max(0, Math.min(d.a0 + dx, d.b0 - min)));
      else if (d.kind === "b") setB(Math.min(width, Math.max(d.b0 + dx, d.a0 + min)));
      else {
        const span = d.b0 - d.a0;
        const na = Math.max(0, Math.min(d.a0 + dx, width - span));
        setA(na);
        setB(na + span);
      }
    };
    const up = () => { drag.current = null; };
    window.addEventListener("pointermove", move, { passive: false });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [toUnits, width]);

  const baslat = (kind: Drag["kind"], e: RPointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    drag.current = { kind, startX: toUnits(e.clientX), a0: a, b0: b };
  };

  // Görsel boyutlar şeridin birimine göre ölçeklenir
  const u = width / 600;
  const barY = height * 0.12;
  const sw = 2.2 * u;

  let label: string | null = null;
  if (mmPerUnit) {
    const sn = ((b - a) * mmPerUnit) / 25;
    label = `${sn.toFixed(2).replace(".", ",")} sn · ${Math.round(60 / sn)}/dk · ${((b - a) * mmPerUnit).toFixed(0)} küçük kare`;
  }

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className="absolute inset-0 w-full h-full"
      style={{ touchAction: "none" }}
      aria-label="Kaliper"
    >
      {/* Aralık gölgesi */}
      <rect x={a} y={0} width={b - a} height={height} fill="#0EA5E9" fillOpacity={0.08} pointerEvents="none" />

      {/* Köprü (ikisini birlikte taşı) */}
      <line x1={a} x2={b} y1={barY} y2={barY} stroke="#0284C7" strokeWidth={sw * 1.4} />
      <rect
        x={a}
        y={barY - 14 * u}
        width={b - a}
        height={28 * u}
        fill="transparent"
        style={{ cursor: "grab" }}
        onPointerDown={e => baslat("bridge", e)}
      />
      <circle cx={(a + b) / 2} cy={barY} r={6 * u} fill="#0284C7" pointerEvents="none" />

      {/* Bacaklar */}
      {(["a", "b"] as const).map(k => {
        const x = k === "a" ? a : b;
        return (
          <g key={k} style={{ cursor: "ew-resize" }} onPointerDown={e => baslat(k, e)}>
            <rect x={x - 14 * u} y={0} width={28 * u} height={height} fill="transparent" />
            <line x1={x} x2={x} y1={barY} y2={height} stroke="#0284C7" strokeWidth={sw} strokeDasharray={`${6 * u} ${4 * u}`} />
            <circle cx={x} cy={barY} r={7 * u} fill="#fff" stroke="#0284C7" strokeWidth={sw} />
          </g>
        );
      })}

      {label && (
        <g pointerEvents="none">
          <rect
            x={Math.min(Math.max((a + b) / 2 - 110 * u, 2 * u), width - 222 * u)}
            y={barY + 10 * u}
            width={220 * u}
            height={24 * u}
            rx={6 * u}
            fill="#0C4A6E"
            fillOpacity={0.9}
          />
          <text
            x={Math.min(Math.max((a + b) / 2, 112 * u), width - 112 * u)}
            y={barY + 26.5 * u}
            textAnchor="middle"
            fontSize={12.5 * u}
            fontWeight={700}
            fill="#fff"
          >
            {label}
          </text>
        </g>
      )}
    </svg>
  );
}
