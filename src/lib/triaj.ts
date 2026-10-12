/* ════════════════════════════════════════════════════════════════
   Kitlesel olay triyajı: START (erişkin) ve Jump START (1–8 yaş).
   KAYNAK: T.C. Sağlık Bakanlığı ASHGM — TİLYAD "Triyaj" eğitim sunumu
   (START TRİYAJ 1–8, JumpSTART TRİYAJ, renk kodu tablosu) ve sunumdaki
   "Start Triyaj" / "Jump Start Triyaj" akış şemaları. Uygulamadaki
   karşılıkları: SB-ASH-Y-41 ve SB-ASH-C-29 (Algoritmayı Gör).
   Eşikler, sıralama ve renk kodları kaynakla birebir aynıdır; klinik
   onay olmadan değiştirilmez (tests/triaj.test.ts).
   ════════════════════════════════════════════════════════════════ */

export type TriajKodu = "kirmizi" | "sari" | "yesil" | "siyah";

export const KODLAR: Record<TriajKodu, { renk: string; kategori: string; aciklama: string }> = {
  kirmizi: {
    renk: "Kırmızı",
    kategori: "Acil (Immediate)",
    aciklama:
      "Müdahale edilmediği takdirde hayati riski olan, acil bakım verildiğinde kurtarılabilecek hastalar. Öncelikli olarak acil tedavisi yapılır ve sevk edilir.",
  },
  sari: {
    renk: "Sarı",
    kategori: "Geciktirilebilir acil (Delayed)",
    aciklama:
      "Tıbbi müdahale gereken, ancak kırmızı kodların bakımı ve sevki sürerken beklemesi hâlinde hayati risk taşımayan yaralılar. Kırmızı kod yoksa ilk bu grubun bakımı ve sevki sağlanır.",
  },
  yesil: {
    renk: "Yeşil",
    kategori: "Acil değil (Minör)",
    aciklama:
      "Kendi başına yürüyebilen, hafif yaralı; tıbbi bakıma ihtiyacı olan ancak acil tıbbi bakıma ihtiyacı olmayan hastalar. En son sırada tedaviye ve gözleme alınır.",
  },
  siyah: {
    renk: "Siyah",
    kategori: "Ölü (Deceased)",
    aciklama:
      "Kesin ölüm bulguları olan veya olayın büyüklüğüne göre müdahaleye rağmen kurtarılamayacak hastalar. Acil bakım verilmez veya tüm hastaların bakımı bittikten sonra müdahale edilir.",
  },
};

/** Sunumdaki sıra: kırmızı, sarı, yeşil, siyah. */
export const KOD_SIRASI: TriajKodu[] = ["kirmizi", "sari", "yesil", "siyah"];

export interface Secenek {
  etiket: string;
  /** Seçeneğin altında küçük açıklama */
  ek?: string;
  /** Sonraki adımın kimliği ya da verilen renk kodu */
  sonuc: { adim: string } | { kod: TriajKodu };
}

export interface Adim {
  id: string;
  /** Kısa adım etiketi (ör. "Solunum") */
  baslik: string;
  /** Sorudan önce yapılacak iş (ör. "Başa pozisyon ver.") */
  eylem?: string;
  soru: string;
  ipucu?: string;
  secenekler: Secenek[];
}

export interface TriajAkisi {
  id: "start" | "jump-start";
  ad: string;
  /** Başlık altı: açılımı ve hedef grup */
  altBaslik: string;
  /** Akıştan önce gösterilen kapsam notu */
  kapsam?: string;
  /** Resmi akış şemasının uygulamadaki kimliği (Algoritmayı Gör) */
  algoritmaId: string;
  baslangic: string;
  adimlar: Record<string, Adim>;
  /** "Dikkat edilecekler" — sunumdan */
  notlar: string[];
}

const adim = (sonraki: string) => ({ adim: sonraki });
const kod = (k: TriajKodu) => ({ kod: k });

const YURUME: Adim = {
  id: "yurume",
  baslik: "Yürüme",
  eylem: "Güvenli alanı belirle, yüksek sesle kendini tanıt ve seslen: “Yürüyebilen herkes güvenli alana gelsin.”",
  soru: "Yaralı çağrıya uyup yürüyebiliyor mu?",
  secenekler: [
    { etiket: "Yürüyor", ek: "Güvenli alana yönlendir", sonuc: kod("yesil") },
    { etiket: "Yürüyemiyor", sonuc: adim("solunum") },
  ],
};

const ORTAK_NOTLAR = [
  "Her yaralının ilk triyajı mümkün olduğunca kısa sürede, ideal olarak 30–60 saniyede tamamlanır.",
  "Solunum veya dolaşım kriterlerinden birinde renk koduna ulaşılırsa sonraki kriter değerlendirilmez; kod verilir ve sonraki yaralıya geçilir.",
  "Yerinde triyajda yalnızca yaşam kurtarıcı basit girişimler yapılır: hava yolunu açma (manuel, OPA/NPA), masif kanama kontrolü ve uygun pozisyon, açık göğüs yarasını kapatma, gerektiğinde tansiyon pnömotoraksta iğne dekompresyonu.",
  "Triyaj dinamiktir: yaralılar belirli aralıklarla yeniden değerlendirilir (re-triyaj). Durumu kötüleşenin kodu daha acil bir kategoriye çevrilir; yeşil kodlular da sonradan yeniden değerlendirilir.",
  "Karar verilemiyorsa hasta yararına daha acil kategori seçilebilir; ancak gereğinden yüksek öncelik sınırlı kaynakların etkin kullanımını azaltır.",
  "Triyaj kartında triyaj sırasında yalnızca renk kodu işaretlenir; diğer bilgiler sonra tedavi ve nakil ekiplerince doldurulur.",
  "Yıldırım çarpmasında ters triyaj uygulanır: solunumu veya dolaşımı duran hastalara öncelik verilir.",
];

export const START: TriajAkisi = {
  id: "start",
  ad: "START",
  altBaslik: "Simple Triage and Rapid Treatment · Erişkin",
  algoritmaId: "SB-ASH-Y-41",
  baslangic: "yurume",
  adimlar: {
    yurume: YURUME,
    solunum: {
      id: "solunum",
      baslik: "Solunum",
      soru: "Kendiliğinden solunum var mı?",
      ipucu: "En fazla 10 saniye içinde solunum varlığı ve sayısı değerlendirilir.",
      secenekler: [
        { etiket: "Solunum var", sonuc: adim("sayi") },
        { etiket: "Solunum yok", sonuc: adim("havayolu") },
      ],
    },
    havayolu: {
      id: "havayolu",
      baslik: "Hava yolu",
      eylem: "Hava yolunu açmak için başa pozisyon ver.",
      soru: "Hava yolu açıldığında solunum var mı?",
      secenekler: [
        { etiket: "Solunum var", sonuc: kod("kirmizi") },
        { etiket: "Solunum yok", sonuc: kod("siyah") },
      ],
    },
    sayi: {
      id: "sayi",
      baslik: "Solunum sayısı",
      soru: "Solunum sayısı kaç?",
      secenekler: [
        { etiket: "10/dk'dan az", sonuc: kod("kirmizi") },
        { etiket: "10–30/dk", sonuc: adim("dolasim") },
        { etiket: "30/dk'dan fazla", sonuc: kod("kirmizi") },
      ],
    },
    dolasim: {
      id: "dolasim",
      baslik: "Dolaşım",
      soru: "KGD 2 sn'den kısa ve distal nabız var mı?",
      ipucu:
        "KGD travması olmayan ekstremitede bakılır. Soğuk hava, karanlık, oje, kan veya çamur KGD'yi etkiliyorsa radial nabız kontrol edilir.",
      secenekler: [
        { etiket: "Evet", ek: "KGD 2 sn'den kısa, distal nabız var", sonuc: adim("bilinc") },
        { etiket: "Hayır", ek: "KGD 2 sn'den uzun veya distal nabız yok", sonuc: kod("kirmizi") },
      ],
    },
    bilinc: {
      id: "bilinc",
      baslik: "Bilinç",
      soru: "Basit komutlara uyuyor mu?",
      ipucu: "Örneğin travması olmayan koldaki eliyle personelin elini sıkması istenir.",
      secenekler: [
        { etiket: "Komutlara uyuyor", sonuc: kod("sari") },
        { etiket: "Komutlara uymuyor", sonuc: kod("kirmizi") },
      ],
    },
  },
  notlar: [
    ...ORTAK_NOTLAR,
    "START, aynı koddaki yaralılar arasında acil bakım önceliği belirtmez; bunun için tıbbi triyaj uygulanır.",
    "Kaynakların yeterli olduğu durumlarda klasik START triyajı yerine standart acil bakım uygulanır ve nakil öncelikleri klinik gereksinime göre belirlenir.",
  ],
};

export const JUMP_START: TriajAkisi = {
  id: "jump-start",
  ad: "Jump START",
  altBaslik: "START'ın çocuklara uyarlanmış hâli · 1–8 yaş",
  kapsam:
    "1–8 yaş arası çocuklarda uygulanır. 1 yaşın altındaki bebeklerde hemen tıbbi triyaja geçilir; renk kodu tıbbi triyajdan sonra verilir.",
  algoritmaId: "SB-ASH-C-29",
  baslangic: "yurume",
  adimlar: {
    yurume: YURUME,
    solunum: {
      id: "solunum",
      baslik: "Solunum",
      soru: "Kendiliğinden solunum var mı?",
      secenekler: [
        { etiket: "Solunum var", sonuc: adim("sayi") },
        { etiket: "Solunum yok", sonuc: adim("havayolu") },
      ],
    },
    havayolu: {
      id: "havayolu",
      baslik: "Hava yolu",
      eylem: "Hava yolunu açmak için başa pozisyon ver.",
      soru: "Pozisyon sonrası solunum var mı?",
      secenekler: [
        { etiket: "Solunum var", sonuc: kod("kirmizi") },
        { etiket: "Solunum yok", sonuc: adim("karotis") },
      ],
    },
    karotis: {
      id: "karotis",
      baslik: "Nabız",
      soru: "Karotis arterden nabız var mı?",
      secenekler: [
        { etiket: "Nabız var", sonuc: adim("soluk") },
        { etiket: "Nabız yok", sonuc: kod("siyah") },
      ],
    },
    soluk: {
      id: "soluk",
      baslik: "Kurtarıcı soluk",
      eylem: "5 kurtarıcı soluk ver.",
      soru: "Kurtarıcı soluk sonrası solunum var mı?",
      secenekler: [
        { etiket: "Solunum var", sonuc: kod("kirmizi") },
        { etiket: "Solunum yok", sonuc: kod("siyah") },
      ],
    },
    sayi: {
      id: "sayi",
      baslik: "Solunum sayısı",
      soru: "Solunum sayısı kaç?",
      secenekler: [
        { etiket: "15/dk'dan az", sonuc: kod("kirmizi") },
        { etiket: "15–45/dk", sonuc: adim("dolasim") },
        { etiket: "45/dk'dan fazla", sonuc: kod("kirmizi") },
      ],
    },
    dolasim: {
      id: "dolasim",
      baslik: "Dolaşım",
      soru: "Distal nabız var mı?",
      ipucu: "Çocukta dolaşım değerlendirmesinde KGD değil, distal nabız kontrol edilir.",
      secenekler: [
        { etiket: "Distal nabız var", sonuc: adim("bilinc") },
        { etiket: "Distal nabız yok", sonuc: kod("kirmizi") },
      ],
    },
    bilinc: {
      id: "bilinc",
      baslik: "Bilinç (AVPU)",
      soru: "Komutlara uyuyor mu?",
      secenekler: [
        { etiket: "Komutlara uyuyor", ek: "A, V veya P'ye uygun yanıt", sonuc: kod("sari") },
        {
          etiket: "Komutlara uymuyor",
          ek: "U ya da ağrılı uyarana uygunsuz yanıt: bağırma, inleme, dekortike veya deserebre postür",
          sonuc: kod("kirmizi"),
        },
      ],
    },
  },
  notlar: [
    "Solunum değerlendirmesinde alt ve üst sınır 15–45/dk'dır.",
    "Spontan solunumu olmayan çocukta hava yolu açıldığında solunum yoksa karotis nabzına bakılır: nabız yoksa siyah kod; nabız varsa 5 kurtarıcı soluk verilir, sonrasında solunum yoksa siyah, varsa kırmızı kod.",
    "Aynı triyaj kategorisindeki hasta/yaralılar arasında çocuklara öncelik verilmesi uygun bir yaklaşımdır.",
    ...ORTAK_NOTLAR,
  ],
};

export const TRIAJ_AKISLARI = [START, JUMP_START];

/**
 * Verilen cevaplarla (her adımda seçilen seçeneğin sırası) akışı yürütür.
 * Dönüş: geçilen adımlar ve — akış bittiyse — verilen renk kodu.
 */
export function yurut(akis: TriajAkisi, cevaplar: number[]): { adimlar: Adim[]; kod: TriajKodu | null } {
  const adimlar: Adim[] = [];
  let id: string | null = akis.baslangic;
  for (let i = 0; id; i++) {
    const a: Adim | undefined = akis.adimlar[id];
    if (!a) throw new Error(`triaj: "${akis.id}" akışında "${id}" adımı yok`);
    adimlar.push(a);
    const c = cevaplar[i];
    if (c === undefined) return { adimlar, kod: null };
    const s: Secenek | undefined = a.secenekler[c];
    if (!s) throw new Error(`triaj: "${a.id}" adımında ${c}. seçenek yok`);
    if ("kod" in s.sonuc) return { adimlar, kod: s.sonuc.kod };
    id = s.sonuc.adim;
  }
  return { adimlar, kod: null };
}
