import type { RitimId } from "./rhythms";

/* ════════════════════════════════════════════════════════════════
   Kaynak sunumdaki gerçek EKG vakaları.
   Görseller sunumdan cevap tablosu OLMADAN çıkarılmıştır
   (public/ekg/ritim-*.webp). `kaynakTablo` slayttaki tablonun birebir
   metnidir; geri bildirimde "kaynaktaki değerlendirme" olarak gösterilir.
   ════════════════════════════════════════════════════════════════ */

export interface StripOverlay {
  /** Görsel genişliğine oranla (0–1) yatay çizgi — ör. Wenckebach'ta PR aralıkları */
  x0: number;
  x1: number;
  y: number;
}

export interface GercekVaka {
  id: string;
  ritim: RitimId;
  gorsel: string;
  genislik: number;
  yukseklik: number;
  /** 12 derivasyonlu kayıt mı (daha yüksek gösterilir) */
  onikiDerivasyon?: boolean;
  /** Hız hesabı (kaynaktaki yöntemle) ve yaklaşık değer */
  hizHesabi: string;
  hiz: number;
  /** Ritim düzeni kaynak tablodan farklı yorumlanmışsa (ör. 2:1 blok) açıklama */
  kaynakTablo: {
    ritim: string;
    hiz: string;
    pDalgasi: string;
    pQrs: string;
    qrs: string;
    tani: string;
  };
  ipucuCizgileri?: StripOverlay[];
  kaynakSlayt: number;
}

export const GERCEK_VAKALAR: GercekVaka[] = [
  {
    id: "g-sinus-tasikardisi",
    ritim: "sinus-tasikardisi",
    gorsel: "/ekg/ritim-sinus-tasikardisi.webp",
    genislik: 2000,
    yukseklik: 234,
    hizHesabi: "300 / 2 büyük kare",
    hiz: 150,
    kaynakTablo: {
      ritim: "DÜZENLİ",
      hiz: "300/2: TAŞİKARDİ",
      pDalgasi: "VAR",
      pQrs: "Her “p” yi QRS izliyor",
      qrs: "NORMAL (DAR)",
      tani: "SİNÜS TAŞİKARDİSİ",
    },
    kaynakSlayt: 17,
  },
  {
    id: "g-svt",
    ritim: "svt",
    gorsel: "/ekg/ritim-svt.webp",
    genislik: 2000,
    yukseklik: 191,
    hizHesabi: "15 büyük karede 12 R × 20",
    hiz: 240,
    kaynakTablo: {
      ritim: "DÜZENLİ",
      hiz: "12x20: TAŞİKARDİ",
      pDalgasi: "YOK",
      pQrs: "DEĞERLENDİRİLEMEZ",
      qrs: "NORMAL (DAR) QRS",
      tani: "DAR QRS'Lİ DÜZENLİ TAŞİKARDİ (SVT)",
    },
    kaynakSlayt: 18,
  },
  {
    id: "g-atriyal-flatter",
    ritim: "atriyal-flatter",
    gorsel: "/ekg/ritim-atriyal-flatter.webp",
    genislik: 2000,
    yukseklik: 259,
    hizHesabi: "300 / 4 büyük kare",
    hiz: 75,
    kaynakTablo: {
      ritim: "DÜZENLİ",
      hiz: "300/4: NORMAL",
      pDalgasi: "YOK / FLATTER dalgaları var (testere dişi görünümü)",
      pQrs: "Değerlendirilemiyor (4/1 geçişli flatter-QRS ilişkisi)",
      qrs: "NORMAL (DAR)",
      tani: "ATRİYAL FLATTER",
    },
    kaynakSlayt: 22,
  },
  {
    id: "g-atriyal-fibrilasyon",
    ritim: "atriyal-fibrilasyon",
    gorsel: "/ekg/ritim-atriyal-fibrilasyon.webp",
    genislik: 2000,
    yukseklik: 273,
    hizHesabi: "15 büyük karede 10 R × 20",
    hiz: 200,
    kaynakTablo: {
      ritim: "DÜZENSİZ",
      hiz: "10x20: TAŞİKARDİ",
      pDalgasi: "YOK",
      pQrs: "DEĞERLENDİRİLEMEZ",
      qrs: "NORMAL (DAR)",
      tani: "DAR QRS'Lİ DÜZENSİZ TAŞİKARDİ (ATRİYAL FİBRİLASYON)",
    },
    kaynakSlayt: 23,
  },
  {
    id: "g-ventrikuler-tasikardi",
    ritim: "ventrikuler-tasikardi",
    gorsel: "/ekg/ritim-ventrikuler-tasikardi.webp",
    genislik: 2000,
    yukseklik: 929,
    onikiDerivasyon: true,
    hizHesabi: "15 büyük karede 9 R × 20",
    hiz: 180,
    kaynakTablo: {
      ritim: "DÜZENLİ",
      hiz: "9x20: TAŞİKARDİ",
      pDalgasi: "YOK",
      pQrs: "DEĞERLENDİRİLEMEZ",
      qrs: "GENİŞ QRS",
      tani: "GENİŞ QRS'Lİ DÜZENLİ TAŞİKARDİ (VENTRİKÜLER TAŞİKARDİ)",
    },
    kaynakSlayt: 25,
  },
  {
    id: "g-dal-blogu-af",
    ritim: "dal-blogu-af",
    gorsel: "/ekg/ritim-dal-blogu-af.webp",
    genislik: 2000,
    yukseklik: 665,
    onikiDerivasyon: true,
    hizHesabi: "15 büyük karede 7 R × 20",
    hiz: 140,
    kaynakTablo: {
      ritim: "DÜZENSİZ",
      hiz: "7x20: TAŞİKARDİ",
      pDalgasi: "YOK",
      pQrs: "DEĞERLENDİRİLEMEZ",
      qrs: "GENİŞ QRS (MONOMORFİK?)",
      tani: "GENİŞ QRS'Lİ DÜZENSİZ TAŞİKARDİ (Dal bloğu ve AF)",
    },
    kaynakSlayt: 26,
  },
  {
    id: "g-torsades",
    ritim: "torsades",
    gorsel: "/ekg/ritim-torsades.webp",
    genislik: 2000,
    yukseklik: 266,
    hizHesabi: "15 büyük karede 9 R × 20 (hızı değerlendirmek zor)",
    hiz: 180,
    kaynakTablo: {
      ritim: "DÜZENSİZ",
      hiz: "9x20: TAŞİKARDİ (Hızı değerlendirmek zor)",
      pDalgasi: "YOK",
      pQrs: "DEĞERLENDİRİLEMEZ",
      qrs: "GENİŞ QRS (POLİMORFİK)",
      tani: "GENİŞ QRS'Lİ DÜZENSİZ TAŞİKARDİ (Torsades de Pointes)",
    },
    kaynakSlayt: 29,
  },
  {
    id: "g-sinus-bradikardisi",
    ritim: "sinus-bradikardisi",
    gorsel: "/ekg/ritim-sinus-bradikardisi.webp",
    genislik: 2000,
    yukseklik: 173,
    hizHesabi: "300 / 8 büyük kare",
    hiz: 37,
    kaynakTablo: {
      ritim: "DÜZENLİ",
      hiz: "300/8: BRADİKARDİ",
      pDalgasi: "VAR",
      pQrs: "Her “p” yi QRS izliyor",
      qrs: "NORMAL (DAR)",
      tani: "SİNÜS BRADİKARDİSİ",
    },
    kaynakSlayt: 31,
  },
  {
    id: "g-av-blok-1",
    ritim: "av-blok-1",
    gorsel: "/ekg/ritim-av-blok-1.webp",
    genislik: 2000,
    yukseklik: 272,
    hizHesabi: "300 / 4 büyük kare",
    hiz: 75,
    kaynakTablo: {
      ritim: "DÜZENLİ",
      hiz: "300/4: NORMAL",
      pDalgasi: "VAR",
      pQrs: "Her “p” yi QRS izliyor / P-R mesafesi uzun",
      qrs: "NORMAL (DAR)",
      tani: "BİRİNCİ DERECE A-V BLOK",
    },
    kaynakSlayt: 32,
  },
  {
    id: "g-av-blok-2-tip1",
    ritim: "av-blok-2-tip1",
    gorsel: "/ekg/ritim-av-blok-2-tip1.webp",
    genislik: 2000,
    yukseklik: 260,
    hizHesabi: "15 büyük karede 3 R × 20",
    hiz: 60,
    kaynakTablo: {
      ritim: "DÜZENSİZ",
      hiz: "3x20",
      pDalgasi: "VAR",
      pQrs: "Her “p” yi QRS izlemiyor (A-V BLOK — her QRS'in p'si var)",
      qrs: "NORMAL (DAR)",
      tani: "İKİNCİ DERECE A-V BLOK TİP 1",
    },
    // Slayt 33'teki PR aralığı işaretleri (görsele oranla)
    ipucuCizgileri: [
      { x0: 3 / 720, x1: 20 / 720, y: 0.593 },
      { x0: 110 / 720, x1: 138 / 720, y: 0.593 },
      { x0: 218 / 720, x1: 252 / 720, y: 0.593 },
      { x0: 422 / 720, x1: 439 / 720, y: 0.593 },
      { x0: 530 / 720, x1: 558 / 720, y: 0.593 },
      { x0: 638 / 720, x1: 672 / 720, y: 0.593 },
    ],
    kaynakSlayt: 33,
  },
  {
    id: "g-av-blok-2-tip2",
    ritim: "av-blok-2-tip2",
    gorsel: "/ekg/ritim-av-blok-2-tip2.webp",
    genislik: 2000,
    yukseklik: 212,
    hizHesabi: "300 / 8 büyük kare",
    hiz: 37,
    kaynakTablo: {
      ritim: "DÜZENLİ",
      hiz: "300/8: BRADİKARDİ",
      pDalgasi: "VAR",
      pQrs: "Birçok “p” yi QRS izlemiyor (A-V BLOK — her QRS'in p'si var)",
      qrs: "NORMAL (DAR)",
      tani: "İKİNCİ DERECE A-V BLOK TİP 2",
    },
    kaynakSlayt: 34,
  },
  {
    id: "g-av-blok-3",
    ritim: "av-blok-3",
    gorsel: "/ekg/ritim-av-blok-3.webp",
    genislik: 2000,
    yukseklik: 235,
    hizHesabi: "300 / 8 büyük kare",
    hiz: 37,
    kaynakTablo: {
      ritim: "DÜZENLİ",
      hiz: "300/8: BRADİKARDİ",
      pDalgasi: "VAR",
      pQrs: "İLİŞKİ YOK (birçok p'yi QRS izlemiyor, her QRS'in p'si yok)",
      qrs: "GENİŞ QRS",
      tani: "ÜÇÜNCÜ DERECE A-V TAM BLOK",
    },
    kaynakSlayt: 35,
  },
];

export const NORMAL_SINUS_GORSEL = { gorsel: "/ekg/ritim-normal-sinus.webp", genislik: 2000, yukseklik: 124 };

export function gercekVakaByRitim(ritim: RitimId): GercekVaka | undefined {
  return GERCEK_VAKALAR.find(v => v.ritim === ritim);
}
