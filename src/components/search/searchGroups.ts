/* Arama grupları ve renkleri — veri içermez; arama düğmesi/penceresi bunu ilk yüklemede
   kullanır, büyük arama dizini (searchIndex.ts) ise yalnızca arama açılınca yüklenir. */

export type SearchGroup = "Algoritma" | "Vaka" | "İlaç" | "Skala" | "ICD-10" | "EKG" | "Envanter" | "Evrak";

export const SEARCH_GROUPS: SearchGroup[] = ["Algoritma", "Vaka", "İlaç", "Skala", "ICD-10", "EKG", "Envanter", "Evrak"];

/** Ana sayfadaki modül renkleriyle aynı (DESIGN.md). */
export const GROUP_ACCENT: Record<SearchGroup, string> = {
  Algoritma: "#F97316",
  Vaka: "#8B5CF6",
  İlaç: "#F59E0B",
  Skala: "#34D399",
  "ICD-10": "#06B6D4",
  EKG: "#10B981",
  Envanter: "#EF4444",
  Evrak: "#EC4899",
};
