"use client";

import { useSyncExternalStore } from "react";
import type { RitimId } from "./rhythms";

/* ════════════════════════════════════════════════════════════════
   EKG eğitim ilerlemesi — yalnızca bu cihazda (localStorage).
   Depolama erişilemezse (gizli sekme vb.) uygulama çalışmaya devam
   eder; yalnızca ilerleme kaydedilmez.
   ════════════════════════════════════════════════════════════════ */

const KEY = "ekg-ilerleme-v1";

export interface SinavKaydi {
  tarih: string;
  kapsam: string;
  soruSayisi: number;
  adimDogru: number;
  adimToplam: number;
  taniDogru: number;
  ritimler: Partial<Record<RitimId, { dogru: number; toplam: number }>>;
}

export interface Ilerleme {
  tamamlananDersler: string[];
  sinavlar: SinavKaydi[];
}

const BOS: Ilerleme = { tamamlananDersler: [], sinavlar: [] };

let cache: Ilerleme | null = null;
const listeners = new Set<() => void>();

function oku(): Ilerleme {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as Partial<Ilerleme>) : {};
    cache = {
      tamamlananDersler: Array.isArray(parsed.tamamlananDersler) ? parsed.tamamlananDersler : [],
      sinavlar: Array.isArray(parsed.sinavlar) ? parsed.sinavlar : [],
    };
  } catch {
    cache = { ...BOS };
  }
  return cache;
}

function yaz(next: Ilerleme) {
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* depolama yok — bellekte devam */
  }
  listeners.forEach(l => l());
}

export function useIlerleme(): Ilerleme {
  return useSyncExternalStore(
    l => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    oku,
    () => BOS
  );
}

export function dersiTamamla(slug: string) {
  const cur = oku();
  if (cur.tamamlananDersler.includes(slug)) return;
  yaz({ ...cur, tamamlananDersler: [...cur.tamamlananDersler, slug] });
}

export function sinaviKaydet(kayit: SinavKaydi) {
  const cur = oku();
  yaz({ ...cur, sinavlar: [kayit, ...cur.sinavlar].slice(0, 50) });
}

export function ilerlemeyiSifirla() {
  yaz({ ...BOS });
}
