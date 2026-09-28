import { RITIMLER, type RitimAnalizi, type RitimId } from "./rhythms";

/* ════════════════════════════════════════════════════════════════
   EKG ritim üreteci — standart kağıt: 25 mm/sn, 10 mm/mV.
   Dalga bileşenleri (P, Q, R, S, T) Gauss eğrileriyle modellenir;
   zamanlamalar (PR, QRS süresi, iletim oranı) ritme göre üretilir.
   Aynı (ritim, seed) her zaman aynı şeridi üretir.
   Çıktı milimetre cinsindendir → kaliper ölçümü birebir doğrudur.
   ════════════════════════════════════════════════════════════════ */

export const MM_PER_SEC = 25;
export const MM_PER_MV = 10;
export const SERIT_YUKSEKLIK_MM = 40;
const BASELINE_MM = 23;
const SAMPLE_HZ = 250;

export interface UretilmisSerit {
  ritim: RitimId;
  seed: number;
  sure: number; // saniye
  genislikMm: number;
  yukseklikMm: number;
  /** SVG path (mm koordinatları) */
  path: string;
  /** Ventrikül hızı (/dk); arrest ritimlerinde (VF, asistoli) null */
  hiz: number | null;
  /** Atriyal hız (AV bloklarda P hızı) */
  atriyalHiz?: number;
  qrsZamanlari: number[];
  pZamanlari: number[];
  analiz?: RitimAnalizi;
  /** İletim açıklaması, ör. "2:1 iletim", "4:1 geçişli flatter" */
  not?: string;
}

/* ───────────── Yardımcılar ───────────── */

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Rng = () => number;
const between = (rng: Rng, lo: number, hi: number) => lo + (hi - lo) * rng();
const gauss = (t: number, c: number, w: number, a: number) => {
  const d = (t - c) / w;
  return d > 6 || d < -6 ? 0 : a * Math.exp(-0.5 * d * d);
};

type Wave = (t: number) => number;

interface Beat {
  /** R tepe zamanı (sn) */
  r: number;
  genis?: boolean;
  /** Dal bloğu morfolojisi (rsR') */
  dalBlogu?: boolean;
  /** Bir sonraki atıma kadar süre (T dalgası konumu için) */
  rr: number;
  tYok?: boolean;
}

function qrsDalga(b: Beat): Wave {
  if (b.dalBlogu) {
    // Dal bloğu: geniş (≈0,16 sn), çentikli QRS (rsR') + ters T
    return t =>
      gauss(t, b.r - 0.055, 0.013, 0.3) +
      gauss(t, b.r - 0.022, 0.014, -0.28) +
      gauss(t, b.r + 0.03, 0.028, 1.0) +
      gauss(t, b.r + 0.085, 0.018, -0.12) +
      (b.tYok ? 0 : gauss(t, b.r + 0.24 + 0.08 * Math.sqrt(b.rr), 0.06, -0.3));
  }
  if (b.genis) {
    // Ventriküler kaynaklı geniş QRS (≈0,16 sn) + ters yönde T
    return t =>
      gauss(t, b.r, 0.032, 1.0) +
      gauss(t, b.r + 0.075, 0.03, -0.45) +
      (b.tYok ? 0 : gauss(t, b.r + 0.22 + 0.12 * Math.sqrt(b.rr), 0.065, -0.35));
  }
  const tMerkez = b.r + 0.12 + 0.18 * Math.sqrt(Math.min(b.rr, 1.6));
  return t =>
    gauss(t, b.r - 0.022, 0.008, -0.12) +
    gauss(t, b.r, 0.011, 1.1) +
    gauss(t, b.r + 0.024, 0.01, -0.3) +
    (b.tYok ? 0 : gauss(t, tMerkez, 0.05, 0.28));
}

const pDalga = (c: number, a = 0.15): Wave => t => gauss(t, c, 0.022, a);

/** P merkezi → QRS'in R tepesi: PR (P başlangıcı → QRS başlangıcı) ile hesaplanır. */
const rFromP = (pMerkez: number, pr: number) => pMerkez - 0.05 + pr + 0.04;

function periyodik(start: number, end: number, period: number, rng: Rng, jitter = 0.015): number[] {
  const out: number[] = [];
  for (let t = start; t < end; ) {
    out.push(t);
    t += period * (1 + (rng() * 2 - 1) * jitter);
  }
  return out;
}

function hizHesapla(qrs: number[], sure: number): number | null {
  const iceride = qrs.filter(r => r >= 0 && r <= sure);
  if (iceride.length < 2) return null;
  const rr = (iceride[iceride.length - 1] - iceride[0]) / (iceride.length - 1);
  return Math.round(60 / rr);
}

/* ───────────── Ritim modelleri ───────────── */

interface Model {
  dalgalar: Wave[];
  qrs: number[];
  p: number[];
  analiz?: Partial<RitimAnalizi>;
  atriyalHiz?: number;
  not?: string;
  hizSabit?: number | null;
}

function sinusModeli(rng: Rng, hiz: number, pr: number, sure: number): Model {
  const rr = 60 / hiz;
  const qrs = periyodik(between(rng, -0.6, 0) + 0.3, sure + 1, rr, rng);
  const beats: Beat[] = qrs.map(r => ({ r, rr }));
  const p = qrs.map(r => r - pr - 0.04 + 0.05);
  return {
    dalgalar: [...beats.map(qrsDalga), ...p.map(c => pDalga(c))],
    qrs,
    p,
  };
}

/** Fibrilasyon dalgaları: küçük genlikli, düzensiz (P dalgasıyla karıştırılmamalı). */
function afTaban(rng: Rng): Wave {
  const f = Array.from({ length: 6 }, () => between(rng, 4.5, 9.5));
  const ph = f.map(() => rng() * Math.PI * 2);
  const a = f.map(() => between(rng, 0.008, 0.018));
  const mod = f.map(() => between(rng, 0.3, 1.1));
  return t =>
    f.reduce((s, fi, i) => s + a[i] * (0.6 + 0.4 * Math.sin(2 * Math.PI * mod[i] * t + ph[i])) * Math.sin(2 * Math.PI * fi * t + ph[i] * 1.7), 0);
}

function duzensizQrs(rng: Rng, sure: number, rrMin: number, rrMax: number): number[] {
  const out: number[] = [];
  for (let t = between(rng, 0.1, 0.4); t < sure + 1; t += between(rng, rrMin, rrMax)) out.push(t);
  return out;
}

function model(ritim: RitimId, rng: Rng, sure: number, hiz?: number): Model {
  // Belirli bir hız istenirse (ör. hız hesaplama alıştırması) sinüs ritimlerinde kullanılır
  const h = (lo: number, hi: number) => hiz ?? between(rng, lo, hi);
  switch (ritim) {
    case "normal-sinus":
      return sinusModeli(rng, h(65, 95), between(rng, 0.14, 0.18), sure);
    case "sinus-tasikardisi":
      return sinusModeli(rng, h(110, 150), between(rng, 0.12, 0.16), sure);
    case "sinus-bradikardisi":
      return sinusModeli(rng, h(38, 55), between(rng, 0.14, 0.19), sure);
    case "nea":
      return { ...sinusModeli(rng, between(rng, 45, 75), between(rng, 0.14, 0.18), sure), not: "Monitörde organize ritim; nabız alınamıyor" };

    case "av-blok-1": {
      const pr = between(rng, 0.28, 0.36);
      return { ...sinusModeli(rng, between(rng, 60, 85), pr, sure), not: `P-R ≈ ${pr.toFixed(2).replace(".", ",")} sn` };
    }

    case "av-blok-2-tip1": {
      // Wenckebach: PR giderek uzar, bir P iletilmez (4:3 veya 3:2)
      const atriyal = between(rng, 75, 95);
      const pp = 60 / atriyal;
      const n = rng() < 0.6 ? 4 : 3;
      const prSerisi = n === 4 ? [0.18, 0.28, 0.34] : [0.18, 0.3];
      const pZ = periyodik(between(rng, -0.4, 0.2), sure + 1, pp, rng, 0.005);
      const qrs: number[] = [];
      pZ.forEach((pc, i) => {
        const k = i % n;
        if (k < n - 1) qrs.push(rFromP(pc, prSerisi[k]));
      });
      const beats = qrs.map((r, i) => ({ r, rr: (qrs[i + 1] ?? r + 1) - r }));
      return {
        dalgalar: [...beats.map(qrsDalga), ...pZ.map(c => pDalga(c))],
        qrs,
        p: pZ,
        atriyalHiz: Math.round(atriyal),
        not: `${n}:${n - 1} iletim, P-R ilerleyici uzuyor`,
      };
    }

    case "av-blok-2-tip2": {
      // Mobitz II: P-R sabit, bazı P'ler iletilmez (2:1 → düzenli, 3:2 → düzensiz)
      const atriyal = between(rng, 72, 90);
      const pp = 60 / atriyal;
      const ikiyeBir = rng() < 0.6;
      const pr = between(rng, 0.16, 0.2);
      const pZ = periyodik(between(rng, -0.4, 0.2), sure + 1, pp, rng, 0.005);
      const qrs = pZ.filter((_, i) => (ikiyeBir ? i % 2 === 0 : i % 3 !== 2)).map(pc => rFromP(pc, pr));
      const beats = qrs.map((r, i) => ({ r, rr: (qrs[i + 1] ?? r + 1.5) - r }));
      return {
        dalgalar: [...beats.map(qrsDalga), ...pZ.map(c => pDalga(c))],
        qrs,
        p: pZ,
        atriyalHiz: Math.round(atriyal),
        analiz: { ritim: ikiyeBir ? "duzenli" : "duzensiz" },
        not: ikiyeBir ? "2:1 iletim, P-R sabit" : "3:2 iletim, P-R sabit",
      };
    }

    case "av-blok-3": {
      // Tam blok: P'ler ve (geniş) kaçış ritmi birbirinden bağımsız
      const atriyal = between(rng, 70, 90);
      const ventrikul = between(rng, 30, 42);
      const pZ = periyodik(between(rng, -0.5, 0.3), sure + 1, 60 / atriyal, rng, 0.005);
      const qrs = periyodik(between(rng, 0.2, 1.2), sure + 1, 60 / ventrikul, rng, 0.005);
      const beats = qrs.map(r => ({ r, rr: 60 / ventrikul, genis: true }));
      return {
        dalgalar: [...beats.map(qrsDalga), ...pZ.map(c => pDalga(c))],
        qrs,
        p: pZ,
        atriyalHiz: Math.round(atriyal),
        not: "P'ler ve QRS'ler birbirinden bağımsız",
      };
    }

    case "svt": {
      const hiz = between(rng, 170, 230);
      const rr = 60 / hiz;
      const qrs = periyodik(between(rng, 0, rr), sure + 1, rr, rng, 0.004);
      return { dalgalar: qrs.map(r => qrsDalga({ r, rr })), qrs, p: [] };
    }

    case "atriyal-flatter": {
      const fHiz = between(rng, 280, 320);
      const fp = 60 / fHiz;
      const oran = rng() < 0.65 ? 4 : 2;
      const baslangic = between(rng, -0.3, 0);
      const flatter: Wave = t => {
        const faz = (((t - baslangic) / fp) % 1 + 1) % 1;
        // Testere dişi: yavaş iniş, hızlı çıkış
        return faz < 0.78 ? 0.12 - 0.3 * (faz / 0.78) : -0.18 + 0.3 * ((faz - 0.78) / 0.22);
      };
      const qrs: number[] = [];
      for (let k = 0, t = baslangic; t < sure + 1; k++, t = baslangic + k * fp) {
        if (k % oran === 0) qrs.push(t + 0.26);
      }
      const beats = qrs.map(r => ({ r, rr: fp * oran, tYok: true }));
      return {
        dalgalar: [flatter, ...beats.map(qrsDalga)],
        qrs,
        p: [],
        atriyalHiz: Math.round(fHiz),
        not: `${oran}/1 geçişli flatter`,
      };
    }

    case "atriyal-fibrilasyon": {
      const qrs = duzensizQrs(rng, sure, 0.3, 0.72);
      const beats = qrs.map((r, i) => ({ r, rr: (qrs[i + 1] ?? r + 0.5) - r }));
      return { dalgalar: [afTaban(rng), ...beats.map(qrsDalga)], qrs, p: [] };
    }

    case "dal-blogu-af": {
      const qrs = duzensizQrs(rng, sure, 0.34, 0.72);
      const beats = qrs.map((r, i) => ({ r, rr: (qrs[i + 1] ?? r + 0.5) - r, dalBlogu: true }));
      return { dalgalar: [afTaban(rng), ...beats.map(qrsDalga)], qrs, p: [] };
    }

    case "ventrikuler-tasikardi":
    case "nabizsiz-vt": {
      const hiz = between(rng, 150, 200);
      const rr = 60 / hiz;
      const qrs = periyodik(between(rng, 0, rr), sure + 1, rr, rng, 0.006);
      const dalgalar: Wave[] = qrs.map(r => t =>
        gauss(t, r, 0.045, 1.05) + gauss(t, r + 0.1, 0.045, -0.55) + gauss(t, r + 0.2, 0.05, -0.2)
      );
      return {
        dalgalar,
        qrs,
        p: [],
        not: ritim === "nabizsiz-vt" ? "VT görünümü; nabız alınamıyor" : undefined,
      };
    }

    case "torsades": {
      const f = between(rng, 3.3, 4.2); // ≈200–250/dk
      const igne = between(rng, 1.7, 2.3); // genliğin artıp azaldığı "iğ" periyodu
      const ph = rng() * Math.PI * 2;
      const dalga: Wave = t => {
        const zarf = 0.1 + 1.05 * Math.pow(Math.abs(Math.cos((Math.PI * t) / igne + ph)), 1.4);
        const yon = Math.cos((Math.PI * t) / igne + ph) >= 0 ? 1 : -1;
        const x = 2 * Math.PI * f * t;
        return yon * zarf * (0.85 * Math.sin(x) + 0.2 * Math.sin(2 * x + 0.6));
      };
      const qrs: number[] = [];
      for (let t = 0; t < sure + 1; t += 1 / f) qrs.push(t);
      return { dalgalar: [dalga], qrs, p: [], hizSabit: Math.round(f * 60) };
    }

    case "vf": {
      const kaba = rng() < 0.6;
      const fs = [between(rng, 4, 5), between(rng, 5.2, 6.4), between(rng, 6.6, 8), between(rng, 2.6, 3.4)];
      const ph = fs.map(() => rng() * Math.PI * 2);
      const zarfF = between(rng, 0.25, 0.5);
      const g = kaba ? 0.55 : 0.22;
      const dalga: Wave = t =>
        g *
        (0.7 + 0.3 * Math.sin(2 * Math.PI * zarfF * t)) *
        (Math.sin(2 * Math.PI * fs[0] * t + ph[0]) +
          0.7 * Math.sin(2 * Math.PI * fs[1] * t + ph[1]) +
          0.45 * Math.sin(2 * Math.PI * fs[2] * t + ph[2]) +
          0.35 * Math.sin(2 * Math.PI * fs[3] * t + ph[3]));
      return { dalgalar: [dalga], qrs: [], p: [], hizSabit: null, not: kaba ? "Kaba VF" : "İnce VF" };
    }

    case "asistoli":
      return { dalgalar: [], qrs: [], p: [], hizSabit: null };
  }
}

/* ───────────── Üretim ───────────── */

export function uret(ritim: RitimId, seed: number, sure = 6, opsiyon?: { hiz?: number }): UretilmisSerit {
  const rng = mulberry32(seed * 2654435761 + ritim.length * 97);
  const m = model(ritim, rng, sure, opsiyon?.hiz);

  // Taban çizgisi dalgalanması ve düşük genlikli gürültü
  const wanderF = between(rng, 0.15, 0.3);
  const wanderPh = rng() * Math.PI * 2;
  const wanderA = ritim === "asistoli" ? 0.035 : 0.02;
  const gurultu = ritim === "asistoli" ? 0.006 : 0.008;

  const n = Math.round(sure * SAMPLE_HZ);
  const parts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / SAMPLE_HZ;
    let v = wanderA * Math.sin(2 * Math.PI * wanderF * t + wanderPh) + (rng() - 0.5) * 2 * gurultu;
    for (const w of m.dalgalar) v += w(t);
    const x = t * MM_PER_SEC;
    const y = Math.min(SERIT_YUKSEKLIK_MM - 0.4, Math.max(0.4, BASELINE_MM - v * MM_PER_MV));
    parts.push(`${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`);
  }

  const temel = RITIMLER[ritim].analiz;
  return {
    ritim,
    seed,
    sure,
    genislikMm: sure * MM_PER_SEC,
    yukseklikMm: SERIT_YUKSEKLIK_MM,
    path: parts.join(""),
    hiz: m.hizSabit !== undefined ? m.hizSabit : hizHesapla(m.qrs, sure),
    atriyalHiz: m.atriyalHiz,
    qrsZamanlari: m.qrs.filter(r => r >= 0 && r <= sure),
    pZamanlari: m.p.filter(p => p >= 0 && p <= sure),
    analiz: temel ? { ...temel, ...m.analiz } : undefined,
    not: m.not,
  };
}

export function rastgeleSeed(): number {
  return Math.floor(Math.random() * 1_000_000_000);
}
