import eriskinData from "@/data/eriskin.json";
import cocukData from "@/data/cocuk.json";
import yenidoganData from "@/data/yenidogan.json";
import ilaclarData from "@/data/ilaclar.json";
import icd10Data from "@/data/icd10.json";
import envanterData from "@/data/ambulans-envanter.json";
import { DERSLER } from "@/lib/ekg/lessons";
import { normalizeTr } from "@/lib/text";

export { normalizeTr };

import { type SearchGroup } from "./searchGroups";

export { GROUP_ACCENT, SEARCH_GROUPS, type SearchGroup } from "./searchGroups";

export interface SearchItem {
  id: string;
  title: string;
  group: SearchGroup;
  url: string;
  /** Erişkin / Çocuk / Yenidoğan gibi kısa etiket */
  tag?: string;
  description?: string;
  /** Aramada eşleşen ama gösterilmeyen ek terimler */
  keywords?: string;
  /** Normalize edilmiş arama metni (önceden hesaplanır) */
  haystack: string;
}

type Raw = Omit<SearchItem, "haystack">;

const SKALALAR: [string, string, string][] = [
  ["glasgow-yetiskin", "Glasgow Koma Skalası", "GKS bilinç erişkin"],
  ["avpu", "AVPU Skalası", "bilinç triaj"],
  ["kas-gucu", "Kas Gücü Skalası", "MRC motor"],
  ["dispne", "Dispne Skalası", "mMRC nefes darlığı"],
  ["parkland", "Parkland Formülü", "yanık sıvı ringer"],
  ["ventilator", "Ventilatör Hesaplama", "ARDS tidal volüm PEEP"],
  ["geri-dondurulebilir", "Arrest — 5H-5T", "geri döndürülebilir nedenler KPR"],
  ["yanik", "İnteraktif Yanık Hesaplama", "TBSA Lund-Browder dokuzlar kuralı"],
  ["glasgow-pediatri", "Pediatri Glasgow", "çocuk GKS"],
  ["glasgow-bebek", "Bebek Glasgow", "infant GKS"],
  ["apgar", "APGAR Skorlaması", "yenidoğan doğum"],
  ["pat", "Çocuk Değerlendirme Üçgeni (PAT)", "pediatri triaj"],
  ["best-guess", "Best Guess Formülü", "çocuk kilo tahmini"],
  ["ett", "ETT — Endotrakeal Entübasyon", "tüp boyutu hava yolu"],
  ["lma", "LMA — Laringeal Maske", "hava yolu"],
];

const YAS: [Record<string, { id: string; title: string }>, string, string][] = [
  [eriskinData as Record<string, { id: string; title: string }>, "eriskin", "Erişkin"],
  [cocukData as Record<string, { id: string; title: string }>, "cocuk", "Çocuk"],
  [yenidoganData as Record<string, { id: string; title: string }>, "yenidogan", "Yenidoğan"],
];

function build(): SearchItem[] {
  const raw: Raw[] = [];

  for (const [data, slug, tag] of YAS) {
    raw.push({ id: `alg-${slug}`, title: `${tag} Algoritmaları`, group: "Algoritma", url: `/algoritmalar/${slug}`, tag });
    for (const a of Object.values(data)) {
      raw.push({ id: `alg-${slug}-${a.id}`, title: a.title, group: "Algoritma", url: `/algoritmalar/${slug}/${a.id}`, tag });
    }
  }
  raw.push({ id: "alg-gorsel", title: "Görsel Akış Şemaları", group: "Algoritma", url: "/algoritmalar-gorsel", description: "Algoritmaların şema görselleri" });

  for (const [data, slug, tag] of YAS) {
    raw.push({ id: `vaka-${slug}`, title: `${tag} Vaka Protokolleri`, group: "Vaka", url: `/vaka-protokolleri/${slug}`, tag });
    for (const a of Object.values(data)) {
      raw.push({ id: `vaka-${slug}-${a.id}`, title: a.title, group: "Vaka", url: `/vaka-protokolleri/${slug}/${a.id}`, tag, description: "Adım adım vaka protokolü" });
    }
  }

  raw.push({ id: "ilac", title: "İlaç Doz Hesaplayıcı", group: "İlaç", url: "/ilac-doz", description: "Kiloya göre doz ve infüzyon hesabı" });
  for (const d of Object.values(ilaclarData as Record<string, { id: string; name: string; cases?: Record<string, { caseName: string }> }>)) {
    const vakalar = Object.values(d.cases ?? {}).map(c => c.caseName);
    raw.push({ id: `ilac-${d.id}`, title: d.name, group: "İlaç", url: "/ilac-doz", description: vakalar.slice(0, 3).join(" · ") || undefined, keywords: vakalar.join(" ") });
  }

  raw.push({ id: "skala", title: "Tüm Skalalar ve Hesaplayıcılar", group: "Skala", url: "/skalalar" });
  for (const [slug, title, kw] of SKALALAR) {
    raw.push({ id: `skala-${slug}`, title, group: "Skala", url: `/skalalar/${slug}`, keywords: kw });
  }

  raw.push({ id: "icd", title: "ICD-10 Tanı Kodları", group: "ICD-10", url: "/icd10" });
  for (const [i, e] of (icd10Data as { kod: string; ad: string; tr: string; kategori: string; anahtar: string }[]).entries()) {
    raw.push({ id: `icd-${e.kod}-${i}`, title: e.tr, group: "ICD-10", url: "/icd10", tag: e.kod, description: e.kategori, keywords: `${e.kod} ${e.ad} ${e.anahtar}` });
  }

  raw.push({ id: "ekg", title: "EKG Eğitimi", group: "EKG", url: "/ekg-egitim", description: "Dersler, ritim atlası ve vaka sınavı" });
  raw.push({ id: "ekg-atlas", title: "Ritim Atlası", group: "EKG", url: "/ekg-egitim/atlas", keywords: "aritmi ritim kartları" });
  raw.push({ id: "ekg-sinav", title: "EKG Vaka Sınavı", group: "EKG", url: "/ekg-egitim/sinav", keywords: "test quiz" });
  for (const d of DERSLER) {
    raw.push({ id: `ekg-ders-${d.slug}`, title: `${d.no}. ${d.baslik}`, group: "EKG", url: `/ekg-egitim/ders/${d.slug}`, description: d.ozet });
  }

  raw.push({ id: "envanter", title: "Ambulans Envanteri", group: "Envanter", url: "/envanter", description: "Malzeme ve ilaç kontrol listeleri" });
  for (const a of Object.values(envanterData as Record<string, { id: string; name: string }>)) {
    raw.push({ id: `env-${a.id}`, title: a.name, group: "Envanter", url: `/envanter/${a.id}` });
  }

  raw.push({ id: "evrak", title: "Ambulans Evrakları", group: "Evrak", url: "/evraklar", description: "Form ve tutanaklar", keywords: "vaka kayıt formu tedavi red tutanak kaza adli" });

  return raw.map(r => ({ ...r, haystack: normalizeTr([r.title, r.tag, r.description, r.keywords].filter(Boolean).join(" ")) }));
}

let cache: SearchItem[] | null = null;
export function getSearchIndex(): SearchItem[] {
  return (cache ??= build());
}

/** Tüm kelimeler eşleşmeli; başlık başında eşleşen ve sayfa düzeyindeki sonuçlar öne çıkar. */
export function searchItems(query: string, group: SearchGroup | "Hepsi", limit = 60): { items: SearchItem[]; total: number } {
  const q = normalizeTr(query);
  if (!q) return { items: [], total: 0 };
  const tokens = q.split(" ");
  const scored: { item: SearchItem; score: number }[] = [];
  for (const item of getSearchIndex()) {
    if (group !== "Hepsi" && item.group !== group) continue;
    if (!tokens.every(t => item.haystack.includes(t))) continue;
    const title = normalizeTr(item.title);
    let score = 0;
    if (title === q) score += 100;
    if (title.startsWith(q)) score += 50;
    else if (title.includes(q)) score += 25;
    if (item.tag && normalizeTr(item.tag).startsWith(q)) score += 40;
    if (item.group !== "ICD-10") score += 5;
    scored.push({ item, score });
  }
  scored.sort((a, b) => b.score - a.score);
  return { items: scored.slice(0, limit).map(s => s.item), total: scored.length };
}
