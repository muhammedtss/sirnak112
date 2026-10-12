import egitimData from "@/data/egitim.json";

/* ════════════════════════════════════════════════════════════════
   Eğitim modülü — SB ASHGM "Eğitim" sayfasının (acilafet.saglik.gov.tr)
   kategori düzeniyle aktarılmış kataloğu.
   • Belgeler kopyalanmaz; Bakanlığın dosya sunucusundaki (dosyamerkez)
     özgün dosyalara bağlantı verilir (toplam ~3,9 GB).
   • Videolar YouTube'un gizlilik modunda (youtube-nocookie) yalnızca
     kullanıcı oynat'a dokunduğunda yüklenir.
   Veri: src/data/egitim.json — `npm run egitim:guncelle` ile yeniden üretilir.
   ════════════════════════════════════════════════════════════════ */

export interface EgitimDosya {
  ad: string;
  url: string;
  /** PDF, PPTX, DOCX, XLSX... */
  tur: string;
  bayt: number;
  /** Kaynak sunucuda bulunamadı (404) — bağlantı verilmez */
  erisilemez?: boolean;
}

export interface EgitimVideo {
  /** YouTube video kimliği */
  id: string;
  baslik: string;
  /** YouTube'daki başlık, kaynak sayfadakinden farklıysa */
  altBaslik?: string;
}

export interface EgitimBolum {
  slug: string;
  baslik: string;
  kaynakUrl: string;
  dosyalar: EgitimDosya[];
  videolar: EgitimVideo[];
}

export interface EgitimKitap {
  baslik: string;
  kaynakUrl: string;
  dosyalar: EgitimDosya[];
  erisilemez?: boolean;
}

interface KategoriTemel {
  baslik: string;
  kaynakUrl: string;
}

export type EgitimKategori =
  | (KategoriTemel & { id: "dokumanlar"; bolumler: EgitimBolum[] })
  | (KategoriTemel & { id: "videolar"; videolar: EgitimVideo[] })
  | (KategoriTemel & { id: "kitaplar"; kitaplar: EgitimKitap[] })
  | (KategoriTemel & { id: "afisler"; dosyalar: EgitimDosya[] });

export type KategoriId = EgitimKategori["id"];

export const EGITIM = egitimData as unknown as {
  kaynak: string;
  yayinlayan: string;
  /** Kaynaktan aktarıldığı tarih (YYYY-AA-GG) */
  aktarim: string;
  kategoriler: EgitimKategori[];
};

export function kategori<K extends KategoriId>(id: K): Extract<EgitimKategori, { id: K }> {
  const k = EGITIM.kategoriler.find(c => c.id === id);
  if (!k) throw new Error(`egitim: "${id}" kategorisi yok`);
  return k as Extract<EgitimKategori, { id: K }>;
}

export const BOLUMLER = kategori("dokumanlar").bolumler;

export const bolumBySlug = (slug: string) => BOLUMLER.find(b => b.slug === slug);

/** "Temel Eğitim Modülü (TEM) Eğitim Dökümanları" → "Temel Eğitim Modülü (TEM)" (liste ve başlık çubuğu için). */
export const kisaBaslik = (baslik: string) => baslik.replace(/\s+Eğitim Dökümanları$/, "");

export const kategoriYolu = (id: KategoriId) => `/egitim/${id}`;

/** 40274431 → "40,3 MB"; 11856 → "12 KB" */
export function boyutTr(bayt: number): string {
  if (bayt <= 0) return "";
  if (bayt < 1_000_000) return `${Math.max(1, Math.round(bayt / 1000))} KB`;
  const mb = bayt / 1_000_000;
  return `${mb.toLocaleString("tr-TR", { maximumFractionDigits: mb < 100 ? 1 : 0 })} MB`;
}

/** Kategori kartlarındaki özet sayılar. */
export function ozet() {
  const dok = kategori("dokumanlar");
  return {
    egitim: dok.bolumler.length,
    belge: dok.bolumler.reduce((s, b) => s + b.dosyalar.length, 0),
    // Bazı videolar iki kategoride birden yer alır; tekil sayılır.
    video: new Set([...kategori("videolar").videolar, ...dok.bolumler.flatMap(b => b.videolar)].map(v => v.id)).size,
    kitap: kategori("kitaplar").kitaplar.length,
    afis: kategori("afisler").dosyalar.length,
  };
}
