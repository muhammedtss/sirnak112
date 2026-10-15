import sozlukData from "@/data/sozluk.json";
import { normalizeTr } from "@/lib/text";

/* ════════════════════════════════════════════════════════════════
   Tıbbi sözlük — veri: src/data/sozluk.json (npm run sozluk:derle ile
   src/data/sozluk/*.txt kaynaklarından üretilir, elle düzenlenmez).
   Tanımlar betimleyicidir; doz ve tedavi talimatı içermez, ilgili
   algoritma ve modüllere bağlanır. Uluslararası karşılıklar NLM MeSH.
   ════════════════════════════════════════════════════════════════ */

export interface SozlukBaglanti {
  ad: string;
  yol: string;
}

export interface SozlukTerimi {
  id: string;
  terim: string;
  /** Eş anlamlılar; kısaltmalarda açılım(lar) */
  es?: string[];
  en?: string;
  kat: string;
  tanim?: string;
  /** Kısaltmanın bağlandığı terimin kimliği (tanım oradan gösterilir) */
  bak?: string;
  ilgili?: SozlukBaglanti[];
  mesh?: { id: string; ad: string };
}

export interface SozlukKategorisi {
  id: string;
  ad: string;
  sayi: number;
}

export const SOZLUK = sozlukData as {
  surum: string;
  meshSurum: string;
  kategoriler: SozlukKategorisi[];
  terimler: SozlukTerimi[];
};

const ID_INDEKSI = new Map(SOZLUK.terimler.map(t => [t.id, t]));
export const terimById = (id: string) => ID_INDEKSI.get(id);

export const KISALTMA = "kisaltma";

/** Tanımı: terimin kendisi ya da bağlandığı terimin tanımı. */
export function tanimi(t: SozlukTerimi): { tanim: string; kaynak?: SozlukTerimi } {
  if (t.tanim) return { tanim: t.tanim };
  const hedef = t.bak ? terimById(t.bak) : undefined;
  return { tanim: hedef?.tanim ?? "", kaynak: hedef };
}

/** Türkçe alfabe sırasıyla baş harf (rakamla başlayanlar "#"). */
export function basHarf(terim: string): string {
  const h = terim.trim().charAt(0).toLocaleUpperCase("tr-TR");
  return /\p{L}/u.test(h) ? h : "#";
}

/** Sözlükte bulunan harfler, Türkçe alfabe sırasıyla. */
export const HARFLER = [...new Set(SOZLUK.terimler.map(t => basHarf(t.terim)))].sort((a, b) =>
  a === "#" ? -1 : b === "#" ? 1 : a.localeCompare(b, "tr"),
);

type Dizin = { t: SozlukTerimi; ad: string; esler: string[]; en: string; govde: string };
let dizin: Dizin[] | null = null;
function dizinAl(): Dizin[] {
  return (dizin ??= SOZLUK.terimler.map(t => ({
    t,
    ad: normalizeTr(t.terim),
    esler: (t.es ?? []).map(normalizeTr),
    en: normalizeTr(t.en ?? ""),
    govde: normalizeTr([t.terim, ...(t.es ?? []), t.en, tanimi(t).tanim].filter(Boolean).join(" ")),
  })));
}

/**
 * Arama: tüm kelimeler terim, eş anlamlı, İngilizce karşılık veya tanımda geçmeli.
 * Sıralama: terimin kendisi > eş anlamlı/açılım > İngilizce > tanım.
 */
export function sozlukAra(sorgu: string, kategori?: string): SozlukTerimi[] {
  const q = normalizeTr(sorgu);
  const havuz = dizinAl().filter(d => !kategori || d.t.kat === kategori);
  if (!q) return havuz.map(d => d.t);
  const kelimeler = q.split(" ");
  const sonuc: { t: SozlukTerimi; puan: number }[] = [];
  for (const d of havuz) {
    if (!kelimeler.every(k => d.govde.includes(k))) continue;
    let puan = 0;
    if (d.ad === q) puan += 120;
    else if (d.ad.startsWith(q)) puan += 70;
    else if (d.ad.includes(q)) puan += 45;
    if (d.esler.some(e => e === q)) puan += 90;
    else if (d.esler.some(e => e.startsWith(q))) puan += 50;
    else if (d.esler.some(e => e.includes(q))) puan += 30;
    if (d.en.includes(q)) puan += 20;
    sonuc.push({ t: d.t, puan });
  }
  return sonuc.sort((a, b) => b.puan - a.puan || a.t.terim.localeCompare(b.t.terim, "tr")).map(s => s.t);
}
