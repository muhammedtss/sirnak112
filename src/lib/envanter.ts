/* ════════════════════════════════════════════════════════════════
   Ambulans envanteri: işaretleme durumu ve Excel kontrol raporu.
   İşaretlemeler yalnızca sayfa açıkken bellekte tutulur (Gizlilik
   sayfasındaki taahhüt): uygulama içinde sayfa değiştirince korunur,
   sayfa yenilenince veya kapatılınca silinir. Rapor cihazda üretilir.
   ════════════════════════════════════════════════════════════════ */

import { STIL, xlsxOlustur, type Hucre, type HucreDegeri } from "./xlsx";

export interface EnvanterIlac {
  id: string;
  name: string;
  gerekliMiktar: string | number;
}

export type ItemStatus = "unchecked" | "yeterli" | "yetersiz";

export interface ItemState {
  status: ItemStatus;
  mevcutMiktar: string;
}

export type Durumlar = Record<string, ItemState>;

const BOS: ItemState = { status: "unchecked", mevcutMiktar: "" };

/* ── Bellek (sayfa açık kaldıkça) ── */

const bellek = new Map<string, Durumlar>();

export function bosDurumlar(ilaclar: EnvanterIlac[]): Durumlar {
  return Object.fromEntries(ilaclar.map(i => [i.id, BOS]));
}

/** Ambulans tipinin son işaretlemeleri; listede olmayan kalemler boş başlar. */
export function kayitliDurumlar(tip: string, ilaclar: EnvanterIlac[]): Durumlar {
  const kayit = bellek.get(tip);
  return Object.fromEntries(ilaclar.map(i => [i.id, kayit?.[i.id] ?? BOS]));
}

export function durumlariSakla(tip: string, durumlar: Durumlar) {
  bellek.set(tip, durumlar);
}

/* ── Miktarlar ── */

/** Kullanıcının yazdığı mevcut adet: yalnızca rakam, en çok 4 hane. */
export function adetTemizle(girdi: string): string {
  return girdi.replace(/\D/g, "").replace(/^0+(?=\d)/, "").slice(0, 4);
}

/** Yetersiz kalemde eksik adet; mevcut girilmediyse 0 kabul edilir. */
export function eksikMiktar(gerekli: string | number, mevcut: string): number {
  return Math.max(0, Number(gerekli) - (Number(mevcut) || 0));
}

/** "Yetersiz" işaretli kalemde girilen adet gerekli miktarı karşılıyor mu? */
export function mevcutKarsiliyor(gerekli: string | number, mevcut: string): boolean {
  return mevcut !== "" && Number(mevcut) >= Number(gerekli);
}

export function sayimlar(ilaclar: EnvanterIlac[], durumlar: Durumlar) {
  let yeterli = 0;
  let yetersiz = 0;
  for (const i of ilaclar) {
    const s = durumlar[i.id]?.status;
    if (s === "yeterli") yeterli++;
    else if (s === "yetersiz") yetersiz++;
  }
  return { toplam: ilaclar.length, yeterli, yetersiz, bekleyen: ilaclar.length - yeterli - yetersiz };
}

/* ── Rapor ── */

export interface RaporSatiri {
  no: number;
  ad: string;
  gerekli: number;
  /** Yalnızca yetersiz kalemde (girilmediyse 0) */
  mevcut: number | null;
  /** Yeterli kalemde 0; kontrol edilmeyende boş */
  eksik: number | null;
  durum: ItemStatus;
}

export const DURUM_ADI: Record<ItemStatus, string> = {
  yetersiz: "Yetersiz",
  yeterli: "Yeterli",
  unchecked: "Kontrol edilmedi",
};

const SIRA: Record<ItemStatus, number> = { yetersiz: 0, yeterli: 1, unchecked: 2 };

/** Önce yetersizler, sonra yeterliler, en sonda kontrol edilmeyenler; grup içinde liste sırası. */
export function raporSatirlari(ilaclar: EnvanterIlac[], durumlar: Durumlar): RaporSatiri[] {
  return ilaclar
    .map((i, n): RaporSatiri => {
      const { status, mevcutMiktar } = durumlar[i.id] ?? BOS;
      const gerekli = Number(i.gerekliMiktar);
      return {
        no: n + 1,
        ad: i.name,
        gerekli,
        mevcut: status === "yetersiz" ? Number(mevcutMiktar) || 0 : null,
        eksik: status === "yetersiz" ? eksikMiktar(gerekli, mevcutMiktar) : status === "yeterli" ? 0 : null,
        durum: status,
      };
    })
    .sort((a, b) => SIRA[a.durum] - SIRA[b.durum] || a.no - b.no);
}

const iki = (n: number) => String(n).padStart(2, "0");

/** 25.10.2026 14:32 (cihazın yerel saati) */
export function tarihSaat(t: Date): string {
  return `${iki(t.getDate())}.${iki(t.getMonth() + 1)}.${t.getFullYear()} ${iki(t.getHours())}:${iki(t.getMinutes())}`;
}

export function raporDosyaAdi(tip: string, t: Date): string {
  const tarih = `${t.getFullYear()}-${iki(t.getMonth() + 1)}-${iki(t.getDate())}-${iki(t.getHours())}${iki(t.getMinutes())}`;
  return `ilac-kontrol-${tip.replace(/[^a-z0-9]+/gi, "-")}-${tarih}.xlsx`;
}

const SATIR_STILI: Record<ItemStatus, { metin: number; sayi: number; durum: number }> = {
  yetersiz: { metin: STIL.yetersizMetin, sayi: STIL.yetersizSayi, durum: STIL.yetersizDurum },
  yeterli: { metin: STIL.yeterliMetin, sayi: STIL.yeterliSayi, durum: STIL.yeterliDurum },
  unchecked: { metin: STIL.bekleyenMetin, sayi: STIL.bekleyenSayi, durum: STIL.bekleyenDurum },
};

export interface RaporGirdisi {
  tip: string;
  ambulansAdi: string;
  ilaclar: EnvanterIlac[];
  durumlar: Durumlar;
  tarih: Date;
}

/** Kontrol raporunu .xlsx olarak üretir: başlık bilgileri, özet ve durum sütunlu ilaç tablosu. */
export function envanterRaporu({ tip, ambulansAdi, ilaclar, durumlar, tarih }: RaporGirdisi): { dosyaAdi: string; veri: Uint8Array<ArrayBuffer> } {
  const say = sayimlar(ilaclar, durumlar);
  const e = (v: HucreDegeri): Hucre => ({ v, s: STIL.etiket });
  const satirlar: (Hucre | HucreDegeri)[][] = [
    [{ v: "Ambulans İlaç Kontrol Raporu", s: STIL.baslik }],
    [],
    [e("Ambulans tipi"), ambulansAdi],
    [e("Kontrol tarihi"), tarihSaat(tarih)],
    [e("Araç plakası"), null],
    [e("Kontrol eden"), null],
    [],
    [e("Toplam kalem"), { v: say.toplam, s: STIL.ozetSayi }],
    [e("Yeterli"), { v: say.yeterli, s: STIL.ozetSayi }],
    [e("Yetersiz"), { v: say.yetersiz, s: STIL.ozetSayi }],
    [e("Kontrol edilmedi"), { v: say.bekleyen, s: STIL.ozetSayi }],
    [],
  ];
  const tabloBasi = satirlar.length + 1;
  satirlar.push(["No", "İlaç / Malzeme", "Gerekli", "Mevcut", "Eksik", "Durum"].map(v => ({ v, s: STIL.tabloBaslik })));
  for (const r of raporSatirlari(ilaclar, durumlar)) {
    const st = SATIR_STILI[r.durum];
    satirlar.push([
      { v: r.no, s: st.sayi },
      { v: r.ad, s: st.metin },
      { v: r.gerekli, s: st.sayi },
      { v: r.mevcut, s: st.sayi },
      { v: r.eksik, s: st.sayi },
      { v: DURUM_ADI[r.durum], s: st.durum },
    ]);
  }
  const tabloSonu = satirlar.length;
  satirlar.push([]);
  satirlar.push([
    {
      v: "Bu rapor Acil Protokol uygulamasında, cihazınızda oluşturulmuştur; işaretlemeler hiçbir sunucuya gönderilmez. Yetersiz işaretlenen kalemde mevcut adet girilmediyse 0 kabul edilir.",
      s: STIL.not,
    },
  ]);
  const notSatiri = satirlar.length;

  const veri = xlsxOlustur(
    [
      {
        ad: "Kontrol Raporu",
        satirlar,
        sutunlar: [17, 46, 12, 12, 12, 18],
        birlesik: ["A1:F1", "B3:F3", "B4:F4", "B5:F5", "B6:F6", `A${notSatiri}:F${notSatiri}`],
        filtre: `A${tabloBasi}:F${tabloSonu}`,
        yukseklik: { 1: 24, [tabloBasi]: 20, [notSatiri]: 30 },
      },
    ],
    { baslik: `${ambulansAdi} — İlaç Kontrol Raporu`, tarih },
  );
  return { dosyaAdi: raporDosyaAdi(tip, tarih), veri };
}
