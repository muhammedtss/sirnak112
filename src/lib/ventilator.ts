/* Ventilatör başlangıç ayarı — koruyucu akciğer ventilasyonu.
   Tidal volüm 6–8 mL/kg (2026-10-12, yeni yönetmelik; önceki 6–10 mL/kg). Değişiklik tests/ventilator.test.ts ile korunur. */

export const TIDAL_ML_KG = { min: 6, max: 8 } as const;

/** Tidal volüm aralığı (mL), tam sayıya yuvarlanmış. */
export function tidalVolum(kg: number): { min: string; max: string } {
  return { min: (kg * TIDAL_ML_KG.min).toFixed(0), max: (kg * TIDAL_ML_KG.max).toFixed(0) };
}

/** Dakika volümü aralığı (L/dk) = tidal volüm × solunum sayısı, 1 ondalık. */
export function dakikaVolumu(kg: number, frekans: number): { min: string; max: string } {
  return {
    min: ((kg * TIDAL_ML_KG.min * frekans) / 1000).toFixed(1),
    max: ((kg * TIDAL_ML_KG.max * frekans) / 1000).toFixed(1),
  };
}
