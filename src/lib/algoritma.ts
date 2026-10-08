export type AlgoritmaKategorisi = "eriskin" | "cocuk" | "yenidogan";

/**
 * Akış şemalarındaki "İLGİLİ ALGORİTMAYA GİT" gibi genel yönlendirmeler: belirli bir algoritmayı değil,
 * hastanın durumuna uygun olanı seçmeyi ister. Bunlar bağlantı yerine kategori listesini açar.
 */
export const GENEL_YONLENDIRMELER = new Set(["ILGILI_ALGORITMA", "TESPIT_EDILEN_RITIM", "RITIM_ANALIZI"]);

/** Algoritma kimliği ön eki → kategori (SB akış şemaları numaralandırması; tests/veri.test.ts doğrular). */
const ONEKLER: [string, AlgoritmaKategorisi][] = [
  ["SB-ASH-DY-", "yenidogan"],
  ["SB-ASH-Y-", "eriskin"],
  ["SB-ASH-C-", "cocuk"],
];

/**
 * Yönlendirme hedefinin kategorisi. Yenidoğan akışları erişkin/çocuk algoritmalarına da yönlendirebilir
 * (ör. eklampside Diyabetik Aciller), bu yüzden kategori hedefin kendi kimliğinden çıkarılır.
 * Genel yönlendirme veya tanınmayan kimlikte null.
 */
export function hedefKategorisi(hedefId: string): AlgoritmaKategorisi | null {
  if (GENEL_YONLENDIRMELER.has(hedefId)) return null;
  return ONEKLER.find(([onek]) => hedefId.startsWith(onek))?.[1] ?? null;
}
