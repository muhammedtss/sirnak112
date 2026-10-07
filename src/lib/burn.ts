import burnZonesData from "@/data/burn-zones.json";

/* ───────────── Yanık haritası bölgeleri (burn-zones.json) ─────────────
   burn-zones.json ve public/burn-map.svg aynı 33 bölgeyi (16 ön, 17 arka)
   aynı id'lerle tanımlar. Yüzdeler erişkin Lund-Browder değerleridir
   (tek yüz; toplam %100). */

export type BurnView = "anterior" | "posterior";

export interface BurnZone {
  id: string;
  view: BurnView;
  region: string;
  side: "R" | "L" | null;
  name_tr: string;
  name_en: string;
  percent: number;
}

export const BURN_ZONES: BurnZone[] = burnZonesData as BurnZone[];

export const BURN_ZONE_BY_ID: Record<string, BurnZone> = Object.fromEntries(
  BURN_ZONES.map(z => [z.id, z])
);

/* ───────────── Yaş grubu (Lund-Browder) ───────────── */

export type AgeGroup = "0" | "1" | "5" | "10" | "15" | "Erişkin";
export const AGE_OPTIONS: AgeGroup[] = ["0", "1", "5", "10", "15", "Erişkin"];

/* Lund-Browder tablosu — tek yüz (ön VEYA arka) değerleri:
   A = başın ½'si, B = bir uyluğun ½'si, C = bir alt bacağın ½'si.
   Erişkin değerleri burn-zones.json'dadır (A 3½, B 4¾, C 3½).
   Her yaş grubunda 33 bölgenin toplamı %100'dür. */
const LUND_BROWDER: Record<"head" | "thigh" | "leg", Record<Exclude<AgeGroup, "Erişkin">, number>> = {
  head:  { "0": 9.5,  "1": 8.5,  "5": 6.5,  "10": 5.5,  "15": 4.5 },
  thigh: { "0": 2.75, "1": 3.25, "5": 4,    "10": 4.25, "15": 4.5 },
  leg:   { "0": 2.5,  "1": 2.5,  "5": 2.75, "10": 3,    "15": 3.25 },
};

/** Bir bölgenin seçili yaş grubuna göre vücut yüzey alanı yüzdesi. */
export function zonePercent(zone: BurnZone, age: AgeGroup): number {
  if (age !== "Erişkin" && (zone.region === "head" || zone.region === "thigh" || zone.region === "leg")) {
    return LUND_BROWDER[zone.region][age];
  }
  return zone.percent;
}

/** Seçili bölgelerin toplam yanık yüzdesi (TBSA), 0.01 hassasiyetle. */
export function totalBurnPercent(ids: Iterable<string>, age: AgeGroup): number {
  let total = 0;
  for (const id of ids) {
    const zone = BURN_ZONE_BY_ID[id];
    if (zone) total += zonePercent(zone, age);
  }
  return Math.round(total * 100) / 100;
}

/** Türkçe yüzde gösterimi: 3.5 → "3,5", 2.75 → "2,75", 13 → "13". */
export function formatPercent(value: number): string {
  return (Math.round(value * 100) / 100).toString().replace(".", ",");
}

/* ───────────── Parkland Formülü (Sağlık Bakanlığı Hastane Öncesi Akış Şemaları, s. 48 ve 133) ─────────────
   Saatlik BAŞLANGIÇ sıvı resüsitasyonu, Ringer Laktat:
     13 yaş üstü çocuk ve erişkin : (2 × yanık VYA % × kg) / 16
     13 yaştan küçük              : (3 × yanık VYA % × kg) / 16
     Elektrik çarpması (herkes)   : (4 × yanık VYA % × kg) / 16
   1. derece yanıklar VYA hesabına dahil edilmez. İdrar çıkışına göre saatlik
   miktar %10–30 artırılır/azaltılır.
   Hastane öncesi sıvı eşiği: ≥ 30 kg ise %15 ve üzeri, < 30 kg ise %10 ve üzeri yanık. */

export type ParklandGroup = "buyuk" | "kucuk" | "elektrik";

export const PARKLAND_KATSAYI: Record<ParklandGroup, number> = { buyuk: 2, kucuk: 3, elektrik: 4 };

export const PARKLAND_ETIKET: Record<ParklandGroup, string> = {
  buyuk: "13 yaş üstü / erişkin",
  kucuk: "13 yaş altı",
  elektrik: "Elektrik çarpması",
};

/** Lund-Browder yaş grubundan varsayılan formül grubu (10 yaş grubu 10–14 yaşı kapsar → 13 altı varsayılır). */
export function defaultParklandGroup(age: AgeGroup): Exclude<ParklandGroup, "elektrik"> {
  return age === "15" || age === "Erişkin" ? "buyuk" : "kucuk";
}

/** Saatlik başlangıç Ringer Laktat hızı (mL/saat). */
export function parklandSaatlikHiz(group: ParklandGroup, kg: number, tbsa: number): number {
  return (PARKLAND_KATSAYI[group] * tbsa * kg) / 16;
}

/** PDF'teki hastane öncesi sıvı tedavisi eşiği karşılanıyor mu? */
export function parklandEsikKarsilandi(kg: number, tbsa: number): boolean {
  return kg >= 30 ? tbsa >= 15 : tbsa >= 10;
}
