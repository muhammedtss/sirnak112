/* ════════════════════════════════════════════════════════════════
   EKG ritim kayıt defteri.
   Kaynak: "3-Temel EKG ve Ritim Bozuklukları" (ASH Genel Müdürlüğü,
   Eğitim ve Projeler Daire Başkanlığı). Slayt numaraları `kaynak`
   alanında tutulur; metinler sunumdan ve konuşmacı notlarından alınmıştır.
   ════════════════════════════════════════════════════════════════ */

export type RitimDuzeni = "duzenli" | "duzensiz";
export type PDalgasi = "var" | "yok" | "flatter";
export type PQrsIliskisi =
  | "her-p-qrs"
  | "pr-uzun"
  | "pr-ilerleyici"
  | "pr-sabit-blok"
  | "iliski-yok"
  | "degerlendirilemez";
export type QrsGenisligi = "dar" | "genis" | "genis-polimorfik";

export type RitimKategori = "normal" | "hizli" | "yavas" | "arrest";

export type RitimId =
  | "normal-sinus"
  | "sinus-tasikardisi"
  | "svt"
  | "atriyal-flatter"
  | "atriyal-fibrilasyon"
  | "ventrikuler-tasikardi"
  | "dal-blogu-af"
  | "torsades"
  | "sinus-bradikardisi"
  | "av-blok-1"
  | "av-blok-2-tip1"
  | "av-blok-2-tip2"
  | "av-blok-3"
  | "vf"
  | "nabizsiz-vt"
  | "asistoli"
  | "nea";

/** 5 adımlı ritim değerlendirmesinin cevapları (slayt 8). */
export interface RitimAnalizi {
  ritim: RitimDuzeni;
  pDalgasi: PDalgasi;
  pQrs: PQrsIliskisi;
  qrs: QrsGenisligi;
}

export interface Ritim {
  id: RitimId;
  /** Tanı adı (kaynaktaki yazımıyla) */
  ad: string;
  /** Kısa ad (etiket, seçenek) */
  kisaAd: string;
  kategori: RitimKategori;
  /** Hızlı ritimler için taşikardi sınıfı (slayt 14–16, 30) */
  sinif?: "dar-duzenli" | "dar-duzensiz" | "genis-duzenli" | "genis-duzensiz-monomorfik" | "genis-duzensiz-polimorfik";
  /** Arrest ritimleri: şoklanabilir mi (slayt 14) */
  soklanir?: boolean;
  /** Analiz cevapları (arrest ritimlerinde yok) */
  analiz?: RitimAnalizi;
  /** Özet satırı (slayt 30 / 36) */
  ozet: string;
  /** Açıklamalar — kaynaktaki metinler ve konuşmacı notları */
  aciklama: string[];
  kaynak?: number[];
}

export const RITIMLER: Record<RitimId, Ritim> = {
  "normal-sinus": {
    id: "normal-sinus",
    ad: "NORMAL SİNÜS RİTMİ",
    kisaAd: "Normal sinüs ritmi",
    kategori: "normal",
    analiz: { ritim: "duzenli", pDalgasi: "var", pQrs: "her-p-qrs", qrs: "dar" },
    ozet: "Düzenli, 60–100/dk, her P'yi QRS izliyor, dar QRS",
    aciklama: [
      "Ritim düzenli olmalı.",
      "Kalp hızı 60–100/dakika olmalı.",
      "P dalgası bulunmalı.",
      "Her P dalgasını QRS izlemeli (her atriyal aktiviteyi ventriküler aktivite izlemeli).",
      "P-R aralığı 0,12–0,20 saniye olmalı.",
      "QRS genişliği maksimum 0,10–0,12 saniye olmalı.",
      "ST segmenti izoelektrik hatta olmalı.",
    ],
    kaynak: [12],
  },
  "sinus-tasikardisi": {
    id: "sinus-tasikardisi",
    ad: "SİNÜS TAŞİKARDİSİ",
    kisaAd: "Sinüs taşikardisi",
    kategori: "hizli",
    sinif: "dar-duzenli",
    analiz: { ritim: "duzenli", pDalgasi: "var", pQrs: "her-p-qrs", qrs: "dar" },
    ozet: "Normal sinüs ritmi, hız >100/dk",
    aciklama: [
      "Kalp ileti sistemiyle ilgili bir patoloji yoktur. Bu nedenle ritme yönelik değil nedene yönelik müdahale yapılır.",
    ],
    kaynak: [17],
  },
  svt: {
    id: "svt",
    ad: "DAR QRS'Lİ DÜZENLİ TAŞİKARDİ (SVT)",
    kisaAd: "SVT (PSVT)",
    kategori: "hizli",
    sinif: "dar-duzenli",
    analiz: { ritim: "duzenli", pDalgasi: "yok", pQrs: "degerlendirilemez", qrs: "dar" },
    ozet: "Dar QRS düzenli → PSVT",
    aciklama: [
      "Sık rastlanan dar kompleks taşikardilerden biridir.",
      "PSVT, AV nodda ve AV nod ile aksesuar yol arasında oluşan reentry mekanizması ile meydana gelir.",
      "En sık AV nodal reentran taşikardi (%50–60) ve AV reentran taşikardi (%30–40) görülür.",
      "AVNRT: A-V nodda oluşan re-entry (yeniden uyarılma) mekanizmasıyla bir kısır döngü oluşur ve kalp hızı çok yüksek hızlara çıkar.",
      "Hızın arttığı, özellikle dakikada 160'ın üzerine çıktığı durumlarda P dalgaları QRS'lerin içinde kalır ve tam olarak görülmez.",
    ],
    kaynak: [18, 19, 20, 21],
  },
  "atriyal-flatter": {
    id: "atriyal-flatter",
    ad: "ATRİYAL FLATTER",
    kisaAd: "Atriyal flatter",
    kategori: "hizli",
    sinif: "dar-duzenli",
    analiz: { ritim: "duzenli", pDalgasi: "flatter", pQrs: "degerlendirilemez", qrs: "dar" },
    ozet: "Testere dişi görünümünde flatter dalgaları, dar QRS",
    aciklama: [
      "P dalgası yerine flatter dalgaları vardır: testere dişi görünümü (trase ters çevrildiğinde daha belirgin).",
      "Flatter–QRS ilişkisi geçiş oranıyla değerlendirilir (örneğin 4/1 geçişli flatter).",
      "Değişen iletili atriyal flatter, dar QRS'li düzensiz taşikardi olarak görülebilir.",
    ],
    kaynak: [16, 22],
  },
  "atriyal-fibrilasyon": {
    id: "atriyal-fibrilasyon",
    ad: "DAR QRS'Lİ DÜZENSİZ TAŞİKARDİ (ATRİYAL FİBRİLASYON)",
    kisaAd: "Atriyal fibrilasyon",
    kategori: "hizli",
    sinif: "dar-duzensiz",
    analiz: { ritim: "duzensiz", pDalgasi: "yok", pQrs: "degerlendirilemez", qrs: "dar" },
    ozet: "Dar QRS düzensiz → AF",
    aciklama: [
      "Atriyumlardaki çok sayıda reentry halkası ile ortaya çıkan bir ritim bozukluğudur.",
      "Dar QRS'li düzensiz bir taşikardidir.",
      "P dalgası izlenmez.",
      "Erişkinde en sık görülen taşikardidir; SVO için risk oluşturur.",
    ],
    kaynak: [23, 24],
  },
  "ventrikuler-tasikardi": {
    id: "ventrikuler-tasikardi",
    ad: "GENİŞ QRS'Lİ DÜZENLİ TAŞİKARDİ (VENTRİKÜLER TAŞİKARDİ)",
    kisaAd: "Ventriküler taşikardi",
    kategori: "hizli",
    sinif: "genis-duzenli",
    analiz: { ritim: "duzenli", pDalgasi: "yok", pQrs: "degerlendirilemez", qrs: "genis" },
    ozet: "Geniş QRS düzenli (monomorfik) → VT",
    aciklama: [
      "Ventriküler ritimler AV kavşağın altından kaynaklanır ve geniş QRS'lidir.",
      "Geniş QRS'li düzenli taşikardide ayırıcı tanı: VT, dal bloklu SVT, preeksitasyonlu SVT.",
    ],
    kaynak: [15, 16, 25],
  },
  "dal-blogu-af": {
    id: "dal-blogu-af",
    ad: "GENİŞ QRS'Lİ DÜZENSİZ TAŞİKARDİ (DAL BLOĞU VE AF)",
    kisaAd: "Dal bloğu + AF",
    kategori: "hizli",
    sinif: "genis-duzensiz-monomorfik",
    analiz: { ritim: "duzensiz", pDalgasi: "yok", pQrs: "degerlendirilemez", qrs: "genis" },
    ozet: "Geniş QRS düzensiz (monomorfik?) → Dal bloğu/WPW ve AF",
    aciklama: [
      "Sağ dal bloğu: iletinin sağ dalda gecikmesi. V1–V3'te M paterni (rR') görülür.",
      "Sol dal bloğu: iletinin sol dalda gecikmesi. DI, V5 ve V6'da çentikli veya bozuk biçimli geniş QRS görülür.",
      "WPW sendromu: kısa PR, geniş QRS, delta dalgası.",
      "Pre-eksitasyon ve atriyal fibrilasyonun birlikte olması durumunda geniş QRS'li düzensiz bir taşikardi izlenir.",
    ],
    kaynak: [26, 27, 28],
  },
  torsades: {
    id: "torsades",
    ad: "GENİŞ QRS'Lİ DÜZENSİZ TAŞİKARDİ (TORSADES DE POINTES)",
    kisaAd: "Torsades de Pointes",
    kategori: "hizli",
    sinif: "genis-duzensiz-polimorfik",
    analiz: { ritim: "duzensiz", pDalgasi: "yok", pQrs: "degerlendirilemez", qrs: "genis-polimorfik" },
    ozet: "Geniş QRS düzensiz (polimorfik) → Torsades de Pointes",
    aciklama: [
      "Polimorfik VT'nin bir formudur; QRS kompleksleri şekil ve genlik değiştirerek izoelektrik hat etrafında döner.",
      "Hızı değerlendirmek zordur.",
    ],
    kaynak: [16, 29],
  },
  "sinus-bradikardisi": {
    id: "sinus-bradikardisi",
    ad: "SİNÜS BRADİKARDİSİ",
    kisaAd: "Sinüs bradikardisi",
    kategori: "yavas",
    analiz: { ritim: "duzenli", pDalgasi: "var", pQrs: "her-p-qrs", qrs: "dar" },
    ozet: "Normal sinüs ritmi, hız yavaş",
    aciklama: ["Normal sinüs ritminin tüm özelliklerini taşır; yalnızca hız yavaştır (<60/dk)."],
    kaynak: [31, 36],
  },
  "av-blok-1": {
    id: "av-blok-1",
    ad: "BİRİNCİ DERECE A-V BLOK",
    kisaAd: "1. derece AV blok",
    kategori: "yavas",
    analiz: { ritim: "duzenli", pDalgasi: "var", pQrs: "pr-uzun", qrs: "dar" },
    ozet: "P-R mesafesinde sabit uzama",
    aciklama: ["Her P'yi QRS izler; P-R mesafesi 0,20 saniyeden uzundur ve sabittir."],
    kaynak: [32, 36],
  },
  "av-blok-2-tip1": {
    id: "av-blok-2-tip1",
    ad: "İKİNCİ DERECE A-V BLOK TİP 1",
    kisaAd: "2. derece AV blok tip 1",
    kategori: "yavas",
    analiz: { ritim: "duzensiz", pDalgasi: "var", pQrs: "pr-ilerleyici", qrs: "dar" },
    ozet: "P-R mesafesinde ilerleyici uzama · Her P'ye QRS yanıtı yok",
    aciklama: [
      "Progresif PR uzaması, bir P dalgasına QRS yanıtı oluşmayana kadar devam eder.",
      "Her P'ye QRS yanıtı yoktur; her QRS'in P'si vardır.",
    ],
    kaynak: [33, 36],
  },
  "av-blok-2-tip2": {
    id: "av-blok-2-tip2",
    ad: "İKİNCİ DERECE A-V BLOK TİP 2",
    kisaAd: "2. derece AV blok tip 2",
    kategori: "yavas",
    analiz: { ritim: "duzenli", pDalgasi: "var", pQrs: "pr-sabit-blok", qrs: "dar" },
    ozet: "Birçok P'ye QRS yanıtı yok · Her QRS'in P'si var",
    aciklama: [
      "PR mesafesinde uzama olmadan bazı P dalgalarına QRS cevabı görülmez.",
      "Geniş QRS aralıklarının olması durumunda her an tam bloğa dönüşebilir.",
      "Tam blokla en sık karıştırılan ritim bozukluğudur: her P'yi QRS izlemez, ancak her QRS'ten önce P dalgası mevcuttur.",
    ],
    kaynak: [34, 36],
  },
  "av-blok-3": {
    id: "av-blok-3",
    ad: "ÜÇÜNCÜ DERECE A-V TAM BLOK",
    kisaAd: "3. derece (tam) AV blok",
    kategori: "yavas",
    analiz: { ritim: "duzenli", pDalgasi: "var", pQrs: "iliski-yok", qrs: "genis" },
    ozet: "Birçok P'ye QRS yanıtı yok · Her QRS'in P'si yok",
    aciklama: [
      "P dalgaları kendi arasında, QRS'ler kendi aralarında düzenliyken P ve QRS dalgaları arasında hiçbir düzen kalmamıştır.",
      "Her P'yi QRS izlemez ve her QRS öncesinde bir P dalgası yoktur.",
      "PR aralıklarının sabit olmaması, 2. derece Mobitz tip II'den ayrımında önemlidir.",
    ],
    kaynak: [35, 36],
  },
  vf: {
    id: "vf",
    ad: "VENTRİKÜLER FİBRİLASYON (VF)",
    kisaAd: "VF",
    kategori: "arrest",
    soklanir: true,
    ozet: "Şoklanır arrest ritmi — organize QRS yok",
    aciklama: [
      "Organize QRS kompleksi, P dalgası ve T dalgası seçilemez; düzensiz, kaotik dalgalanmalar izlenir.",
      "Ritim bozuklukları sınıflamasında şoklanır arrest ritimleri arasındadır (VF, nabızsız VT).",
    ],
    kaynak: [14],
  },
  "nabizsiz-vt": {
    id: "nabizsiz-vt",
    ad: "NABIZSIZ VENTRİKÜLER TAŞİKARDİ (nVT)",
    kisaAd: "Nabızsız VT",
    kategori: "arrest",
    soklanir: true,
    ozet: "Şoklanır arrest ritmi — VT görünümü, nabız yok",
    aciklama: [
      "Monitörde geniş QRS'li düzenli taşikardi (VT) görülür ancak hastanın nabzı alınamaz.",
      "Ritim bozuklukları sınıflamasında şoklanır arrest ritimleri arasındadır (VF, nabızsız VT).",
    ],
    kaynak: [14],
  },
  asistoli: {
    id: "asistoli",
    ad: "ASİSTOLİ",
    kisaAd: "Asistoli",
    kategori: "arrest",
    soklanir: false,
    ozet: "Şoklanmaz arrest ritmi — elektriksel aktivite yok",
    aciklama: [
      "Ventriküler elektriksel aktivite yoktur; düze yakın bir çizgi izlenir.",
      "Ritim bozuklukları sınıflamasında şoklanmaz arrest ritimleri arasındadır (asistoli, NEA).",
    ],
    kaynak: [14],
  },
  nea: {
    id: "nea",
    ad: "NABIZSIZ ELEKTRİKSEL AKTİVİTE (NEA)",
    kisaAd: "NEA",
    kategori: "arrest",
    soklanir: false,
    ozet: "Şoklanmaz arrest ritmi — organize ritim var, nabız yok",
    aciklama: [
      "Monitörde organize bir elektriksel aktivite (ritim) görülmesine rağmen nabız alınamaz.",
      "Ritim bozuklukları sınıflamasında şoklanmaz arrest ritimleri arasındadır (asistoli, NEA).",
    ],
    kaynak: [14],
  },
};

export const RITIM_LISTESI: Ritim[] = Object.values(RITIMLER);

/* ───────────── 5 adımlı değerlendirme: seçenek etiketleri (slayt 8) ───────────── */

export const RITIM_ETIKET: Record<RitimDuzeni, string> = {
  duzenli: "Düzenli",
  duzensiz: "Düzensiz",
};

export const P_ETIKET: Record<PDalgasi, string> = {
  var: "Var",
  yok: "Yok",
  flatter: "Yok — flatter (testere dişi) dalgaları var",
};

export const PQRS_ETIKET: Record<PQrsIliskisi, string> = {
  "her-p-qrs": "Her P'yi QRS izliyor",
  "pr-uzun": "Her P'yi QRS izliyor, P-R mesafesi uzun (>0,20 sn)",
  "pr-ilerleyici": "P-R giderek uzuyor, bir P'ye QRS yanıtı yok",
  "pr-sabit-blok": "P-R sabit, birçok P'ye QRS yanıtı yok (her QRS'in P'si var)",
  "iliski-yok": "İlişki yok (her QRS'in P'si yok)",
  degerlendirilemez: "Değerlendirilemez",
};

export const QRS_ETIKET: Record<QrsGenisligi, string> = {
  dar: "Normal (dar) — ≤0,12 sn",
  genis: "Geniş — >0,12 sn",
  "genis-polimorfik": "Geniş, polimorfik (şekli değişken)",
};

/** Kalp hızı sınıfları (slayt 8): 40/↓, 40–60, 60–100, 100–150, 150/↑ */
export function hizSinifi(hiz: number): string {
  if (hiz < 40) return "40/dk altı — bradikardi";
  if (hiz < 60) return "40–60/dk — bradikardi";
  if (hiz <= 100) return "60–100/dk — normal";
  if (hiz <= 150) return "100–150/dk — taşikardi";
  return "150/dk üstü — taşikardi";
}

export const DEGERLENDIRME_ADIMLARI = [
  { key: "ritim", baslik: "Ritim", soru: "Ritim düzenli mi?", ipucu: "Her R-R ve P-P aralığı birbirine eşit mi?" },
  { key: "hiz", baslik: "Hız", soru: "Kalp hızı yaklaşık kaç?", ipucu: "Düzenliyse 300 / R-R arasındaki büyük kare; düzensizse 15 büyük karedeki R × 20" },
  { key: "pDalgasi", baslik: "P dalgası", soru: "P dalgası var mı?", ipucu: "D2'ye bak: QRS'ten önce, pozitif, küçük yuvarlak dalga" },
  { key: "pQrs", baslik: "P-QRS ilişkisi", soru: "P-QRS ilişkisi nasıl?", ipucu: "Her P'ye QRS yanıtı var mı? P-R aralığı (≤0,20 sn)" },
  { key: "qrs", baslik: "QRS genişliği", soru: "QRS genişliği nasıl?", ipucu: "0,10–0,12 sn normal; 0,12 sn (3 küçük kare) üstü geniş" },
] as const;

export type AdimKey = (typeof DEGERLENDIRME_ADIMLARI)[number]["key"];
