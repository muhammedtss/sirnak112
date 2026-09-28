"use client";

import { memo, useEffect, useMemo, useState, type KeyboardEvent } from "react";
import {
  BURN_ZONE_BY_ID,
  formatPercent,
  zonePercent,
  type AgeGroup,
  type BurnView,
} from "@/lib/burn";

/* ════════════════════════════════════════════════════════════════
   public/burn-map.svg → React
   SVG bir kez indirilir, DOMParser ile katmanlarına ayrılır ve React
   ile yeniden çizilir. Böylece seçim/hover durumu tamamen React'te
   tutulur, çizim (artwork) tema rengini alır.
     #burn-hit    : tıklama alanları (vücudun tamamını kaplar)
     #burn-zones  : görünür sektörler (seçilince boyanır)
     #artwork     : çizim, pointer-events kapalı
     #burn-labels : % etiketleri (yaş grubuna göre yeniden yazılır)
   ════════════════════════════════════════════════════════════════ */

const SVG_URL = "/burn-map.svg";

interface ZoneShape { id: string; view: BurnView; d: string }
interface LabelPos  { id: string; x: number; y: number; size: number }
type Box = [x: number, y: number, w: number, h: number];

interface ParsedBurnMap {
  viewBox: Box;
  viewBoxes: Record<BurnView, Box>;
  hit: ZoneShape[];
  zones: ZoneShape[];
  artworkTransform: string;
  artwork: string[];
  labels: LabelPos[];
}

function parseBurnMap(text: string): ParsedBurnMap {
  const doc = new DOMParser().parseFromString(text, "image/svg+xml");
  const svg = doc.querySelector("svg");
  if (!svg || doc.querySelector("parsererror")) throw new Error("burn-map.svg okunamadı");

  const vb = (svg.getAttribute("viewBox") ?? "").trim().split(/[\s,]+/).map(Number) as Box;
  if (vb.length !== 4 || vb.some(n => !Number.isFinite(n))) throw new Error("Geçersiz viewBox");

  const shapes = (selector: string): ZoneShape[] =>
    Array.from(doc.querySelectorAll(selector)).flatMap(el => {
      const id = el.getAttribute("data-zone") ?? "";
      const d = el.getAttribute("d") ?? "";
      const zone = BURN_ZONE_BY_ID[id];
      if (!zone || !d) {
        console.warn(`burn-map.svg: tanımsız bölge "${id}" atlandı`);
        return [];
      }
      return [{ id, view: zone.view, d }];
    });

  const hit = shapes("#burn-hit path[data-zone]");
  const zones = shapes("#burn-zones path[data-zone]");

  // Ön / arka görünümler için sınır kutuları (hit yolları mutlak M/L koordinatlıdır)
  const PAD = 180;
  const viewBoxes = {} as Record<BurnView, Box>;
  (["anterior", "posterior"] as const).forEach(view => {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    hit.filter(s => s.view === view).forEach(s => {
      const nums = s.d.match(/-?\d*\.?\d+/g)?.map(Number) ?? [];
      for (let i = 0; i + 1 < nums.length; i += 2) {
        x0 = Math.min(x0, nums[i]);     x1 = Math.max(x1, nums[i]);
        y0 = Math.min(y0, nums[i + 1]); y1 = Math.max(y1, nums[i + 1]);
      }
    });
    viewBoxes[view] = Number.isFinite(x0)
      ? [x0 - PAD, y0 - PAD, x1 - x0 + PAD * 2, y1 - y0 + PAD * 2]
      : vb;
  });

  const artworkGroup = doc.querySelector("#artwork");
  const artwork = Array.from(artworkGroup?.querySelectorAll("path") ?? [])
    .map(p => p.getAttribute("d") ?? "")
    .filter(Boolean);

  const labels = Array.from(doc.querySelectorAll("#burn-labels text[data-zone]")).map(t => ({
    id: t.getAttribute("data-zone") ?? "",
    x: Number(t.getAttribute("x")),
    y: Number(t.getAttribute("y")),
    size: Number(t.getAttribute("font-size")) || 270,
  })).filter(l => BURN_ZONE_BY_ID[l.id]);

  return {
    viewBox: vb,
    viewBoxes,
    hit,
    zones,
    artworkTransform: artworkGroup?.getAttribute("transform") ?? "",
    artwork,
    labels,
  };
}

/* Modül düzeyinde önbellek: sayfalar arası geçişte SVG tekrar indirilmez. */
let mapPromise: Promise<ParsedBurnMap> | null = null;
function loadBurnMap(): Promise<ParsedBurnMap> {
  if (!mapPromise) {
    mapPromise = fetch(SVG_URL)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
      })
      .then(parseBurnMap)
      .catch(err => {
        mapPromise = null; // bir sonraki denemede tekrar indir
        throw err;
      });
  }
  return mapPromise;
}

/* Çizim katmanı statik ve büyük (126 yol) — seçim değişince yeniden çizilmez. */
const Artwork = memo(function Artwork({ transform, paths }: { transform: string; paths: string[] }) {
  return (
    <g className="burn-map-artwork" transform={transform} pointerEvents="none" aria-hidden="true">
      {paths.map((d, i) => <path key={i} d={d} />)}
    </g>
  );
});

export type BurnMapView = "both" | BurnView;

interface BurnMapProps {
  selected: ReadonlySet<string>;
  onToggle: (id: string) => void;
  ageGroup: AgeGroup;
  view?: BurnMapView;
}

export default function BurnMap({ selected, onToggle, ageGroup, view = "both" }: BurnMapProps) {
  const [map, setMap] = useState<ParsedBurnMap | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    loadBurnMap()
      .then(m => { if (alive) { setMap(m); setError(false); } })
      .catch(err => { console.error(err); if (alive) setError(true); });
    return () => { alive = false; };
  }, [attempt]);

  const viewBox = useMemo(() => {
    if (!map) return "";
    return (view === "both" ? map.viewBox : map.viewBoxes[view]).join(" ");
  }, [map, view]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12 text-center text-sm text-muted">
        <p>Vücut haritası yüklenemedi. İnternet bağlantınızı kontrol edin veya yüzdeyi manuel girin.</p>
        <button
          type="button"
          onClick={() => { setError(false); setAttempt(a => a + 1); }}
          className="px-4 py-2 rounded-lg text-xs font-bold bg-orange-500/15 text-orange-400 border border-orange-500/30"
        >
          Tekrar dene
        </button>
      </div>
    );
  }

  if (!map) {
    return (
      <div className="w-full flex items-center justify-center text-muted text-sm animate-pulse" style={{ aspectRatio: "16438 / 15725" }}>
        Harita yükleniyor…
      </div>
    );
  }

  const visible = (v: BurnView) => view === "both" || view === v;

  const onKey = (e: KeyboardEvent<SVGPathElement>, id: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggle(id);
    }
  };

  return (
    <svg
      viewBox={viewBox}
      className="burn-map block w-full h-auto mx-auto select-none"
      style={{ maxHeight: view === "both" ? undefined : "72vh" }}
      role="group"
      aria-label="İnteraktif yanık haritası — bölgeye dokunarak seçin"
    >
      {/* Görünür sektörler (seçim/hover boyaması) */}
      <g pointerEvents="none">
        {map.zones.filter(z => visible(z.view)).map(z => (
          <path
            key={z.id}
            d={z.d}
            className="burn-map-zone"
            data-state={selected.has(z.id) ? "selected" : hovered === z.id ? "hover" : undefined}
          />
        ))}
      </g>

      <Artwork transform={map.artworkTransform} paths={map.artwork} />

      {/* Yüzde etiketleri — yaş grubuna göre güncellenir */}
      <g className="burn-map-labels" pointerEvents="none" aria-hidden="true">
        {map.labels.filter(l => visible(BURN_ZONE_BY_ID[l.id].view)).map(l => (
          <text
            key={l.id}
            x={l.x}
            y={l.y}
            fontSize={l.size}
            textAnchor="middle"
            data-selected={selected.has(l.id) || undefined}
          >
            %{formatPercent(zonePercent(BURN_ZONE_BY_ID[l.id], ageGroup))}
          </text>
        ))}
      </g>

      {/* Tıklama alanları en üstte: tüm vücudu boşluksuz kaplar */}
      <g>
        {map.hit.filter(h => visible(h.view)).map(h => {
          const zone = BURN_ZONE_BY_ID[h.id];
          const isSelected = selected.has(h.id);
          return (
            <path
              key={h.id}
              d={h.d}
              className="burn-map-hit"
              role="checkbox"
              tabIndex={0}
              aria-checked={isSelected}
              aria-label={`${zone.name_tr}, yüzde ${formatPercent(zonePercent(zone, ageGroup))}`}
              onClick={() => onToggle(h.id)}
              onKeyDown={e => onKey(e, h.id)}
              onPointerEnter={e => { if (e.pointerType === "mouse") setHovered(h.id); }}
              onPointerLeave={() => setHovered(cur => (cur === h.id ? null : cur))}
            >
              <title>{`${zone.name_tr} · %${formatPercent(zonePercent(zone, ageGroup))}`}</title>
            </path>
          );
        })}
      </g>
    </svg>
  );
}
