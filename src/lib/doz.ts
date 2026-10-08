/* İlaç doz hesabı — İlaç Doz Hesaplayıcı (DrugDoseCalculator) ve testler bunu kullanır.
   Mantık bileşenden birebir taşındı; değişiklikler tests/doz.test.ts ile korunur. */

export interface DoseInfo {
  isAvailable: boolean;
  isWeightBased: boolean;
  dosePerKg: number | null;
  unit: string | null;
  fixedDose: string | null;
  maxDose: string | null;
  route: string | null;
  notes: string | null;
}

/** Kiloya ek olarak cc/saat ayar değeri gösterilen ilaç (kilo zorunlu). */
export const DOPAMIN_ID = "dopamin";

/** Boş değilse ve sayı değilse, 0 veya altıysa, 300 kg üstüyse geçersiz. */
export function kiloGecersiz(weight: string): boolean {
  const w = parseFloat(weight);
  return weight !== "" && (Number.isNaN(w) || w <= 0 || w > 300);
}

/** 150 kg üstü (geçerli) kilo: kullanıcıdan kontrol istenir. */
export function kiloYuksek(weight: string): boolean {
  return !kiloGecersiz(weight) && parseFloat(weight) > 150;
}

/** Bu ilaç/vaka için kilo girilmesi gerekiyor mu? */
export function kiloGerekli(info: DoseInfo | null, drugId: string): boolean {
  return Boolean(info?.isWeightBased) || drugId === DOPAMIN_ID;
}

/**
 * Gösterilecek doz metni; hesaplanamıyorsa null.
 * Kiloya dayalı dozlar kg × doz/kg ile hesaplanır: tam sayıysa olduğu gibi, değilse 2 ondalıkla.
 */
export function dozHesapla(info: DoseInfo | null, drugId: string, weight: string): string | null {
  if (!info || !info.isAvailable) return null;
  if (kiloGerekli(info, drugId)) {
    const w = parseFloat(weight);
    if (!weight || kiloGecersiz(weight) || w > 300) return null;
    if (info.isWeightBased && info.dosePerKg) {
      const raw = w * info.dosePerKg;
      return raw % 1 === 0 ? raw.toString() : raw.toFixed(2);
    }
    return info.fixedDose;
  }
  return info.fixedDose;
}

/** Dopamin infüzyon pompası ayar değeri (cc/saat) = kg × 1,5. */
export function dopaminCcSaat(kg: number): string {
  return (kg * 1.5).toFixed(1);
}
