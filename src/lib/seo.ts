import type { Metadata } from "next";

/* ════════════════════════════════════════════════════════════════
   SEO — tek kaynak.
   • Her statik rotanın başlığı ve açıklaması burada.
   • İstemci ("use client") sayfalar metadata dışa aktaramadığı için
     rota klasöründeki layout.tsx `seoFor(yol)` ile okur.
   • sitemap.ts aynı haritayı kullanır.
   Alan adı değişirse NEXT_PUBLIC_SITE_URL ortam değişkeni ile verilir.
   ════════════════════════════════════════════════════════════════ */

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.112acilsaglik.com").replace(/\/$/, "");
export const SITE_NAME = "Acil Protokol";
export const ORG_NAME = "Şırnak İl Ambulans Servisi Başhekimliği";

export const DEFAULT_TITLE = `${SITE_NAME} — ${ORG_NAME}`;
export const DEFAULT_DESCRIPTION =
  "112 acil sağlık personeli için hastane öncesi acil algoritmaları, vaka protokolleri, ilaç doz hesaplayıcı, " +
  "Glasgow ve APGAR gibi skalalar, Parkland yanık formülü, ICD-10 kod bulucu ve EKG eğitimi. İnternetsiz çalışır.";

export const KEYWORDS = [
  "112 acil protokol",
  "hastane öncesi acil algoritmaları",
  "acil tıp algoritmaları",
  "paramedik",
  "ATT",
  "ambulans",
  "ilaç doz hesaplama",
  "Glasgow koma skalası",
  "Parkland formülü",
  "yanık yüzdesi hesaplama",
  "ICD-10 kodları",
  "EKG ritim eğitimi",
  "Şırnak 112",
  "Şırnak İl Ambulans Servisi",
];

type RouteSeo = { title: string; description: string };

export const ROUTE_SEO: Record<string, RouteSeo> = {
  "/algoritmalar-gorsel": {
    title: "Görsel Acil Algoritmaları",
    description: "Sağlık Bakanlığı hastane öncesi acil akış şemaları: erişkin, çocuk ve doğum/yenidoğan algoritmaları, parmakla yakınlaştırılabilir.",
  },
  "/algoritmalar": {
    title: "Acil Algoritmalar",
    description: "Erişkin, çocuk ve yenidoğan hastane öncesi acil algoritmaları; karar noktalarıyla adım adım.",
  },
  "/algoritmalar/eriskin": { title: "Erişkin Acil Algoritmaları", description: "Arrest, şok, solunum sıkıntısı, travma ve zehirlenmeler için erişkin hastane öncesi acil algoritmaları." },
  "/algoritmalar/cocuk": { title: "Çocuk Acil Algoritmaları", description: "Pediatrik arrest, solunum yolu, şok, nöbet ve travma için hastane öncesi çocuk acil algoritmaları." },
  "/algoritmalar/yenidogan": { title: "Doğum ve Yenidoğan Algoritmaları", description: "Sahada doğum ve yenidoğan resüsitasyonu için hastane öncesi acil algoritmaları." },
  "/vaka-protokolleri": { title: "Vaka Protokolleri", description: "Acil vakalarda adım adım ilerleyen etkileşimli protokoller: erişkin, çocuk ve yenidoğan." },
  "/vaka-protokolleri/eriskin": { title: "Erişkin Vaka Protokolleri", description: "Erişkin acil vakalar için adım adım, karar destekli hastane öncesi protokoller." },
  "/vaka-protokolleri/cocuk": { title: "Çocuk Vaka Protokolleri", description: "Pediatrik acil vakalar için adım adım, karar destekli hastane öncesi protokoller." },
  "/vaka-protokolleri/yenidogan": { title: "Yenidoğan Vaka Protokolleri", description: "Doğum ve yenidoğan acilleri için adım adım hastane öncesi protokoller." },
  "/ilac-doz": { title: "İlaç Doz Hesaplayıcı", description: "Acil ilaçlar için kiloya göre doz hesaplama: endikasyon, uygulama yolu, maksimum doz ve dopamin infüzyon hızı." },
  "/skalalar": { title: "Tıbbi Skalalar ve Hesaplayıcılar", description: "Glasgow, AVPU, APGAR, PAT, kas gücü, dispne skalaları; Parkland formülü, yanık yüzdesi, ventilatör, ETT ve LMA hesaplama." },
  "/skalalar/glasgow-yetiskin": { title: "Glasgow Koma Skalası (GKS)", description: "Erişkinde göz, sözel ve motor yanıtla Glasgow Koma Skalası hesaplama ve kafa travması şiddeti." },
  "/skalalar/avpu": { title: "AVPU Skalası", description: "Saha triajı için hızlı bilinç değerlendirmesi: Alert, Voice, Pain, Unresponsive." },
  "/skalalar/kas-gucu": { title: "Kas Gücü Skalası (MRC)", description: "MRC kas gücü skalası ile iskelet kası gücünü 0–5 arasında değerlendirme." },
  "/skalalar/dispne": { title: "Dispne Skalası (mMRC)", description: "mMRC skalası ile günlük aktivitelerde nefes darlığı şiddetini değerlendirme." },
  "/skalalar/parkland": { title: "Parkland Formülü — Yanık Sıvı Hesaplama", description: "Yanıkta saatlik başlangıç Ringer Laktat hızı: (2/3/4 × %VYA × kg) / 16. Lund-Browder ile yanık yüzdesi, elektrik yanığı." },
  "/skalalar/ventilator": { title: "Ventilatör Ayarı Hesaplama", description: "Koruyucu akciğer ventilasyonu için tidal volüm, PEEP, FiO₂, I:E oranı ve solunum frekansı." },
  "/skalalar/geri-dondurulebilir": { title: "Arrest — 5H 5T Geri Döndürülebilir Nedenler", description: "Kardiyak arrestte aranması gereken geri döndürülebilir nedenler: 5H ve 5T." },
  "/skalalar/yanik": { title: "Yanık Yüzdesi Hesaplama (Lund-Browder)", description: "Vücut haritasına dokunarak yanık yüzdesi (TBSA) hesaplama; yaşa göre Lund-Browder değerleri ve sıvı ihtiyacı." },
  "/skalalar/glasgow-pediatri": { title: "Pediatrik Glasgow Koma Skalası", description: "2 yaş üstü çocuklar için uyarlanmış Glasgow Koma Skalası hesaplama." },
  "/skalalar/glasgow-bebek": { title: "Bebek Glasgow Koma Skalası", description: "2 yaş altı bebeklerde infant normlarına göre Glasgow Koma Skalası." },
  "/skalalar/apgar": { title: "APGAR Skoru Hesaplama", description: "Yenidoğanın 1. ve 5. dakika APGAR skoru: görünüm, nabız, grimas, aktivite, solunum." },
  "/skalalar/pat": { title: "Pediatrik Değerlendirme Üçgeni (PAT)", description: "Görünüm, solunum eforu ve dolaşım ile çocukta aciliyetin hızlı değerlendirilmesi." },
  "/skalalar/best-guess": { title: "Best Guess Çocuk Kilo Tahmini", description: "Çocuklarda yaşa göre vücut ağırlığı tahmini: 12 ay altı, 1–4 yaş ve 5–14 yaş." },
  "/skalalar/ett": { title: "Pediatrik ETT Boyutu Hesaplama", description: "Yaş ve kiloya göre endotrakeal tüp boyutu, yerleştirme derinliği, blade ve aspirasyon sondası." },
  "/skalalar/lma": { title: "LMA Numara Seçimi", description: "Kiloya göre laringeal maske (LMA) numarası, kaf hacmi ve uyumlu ETT boyutu." },
  "/envanter": { title: "Ambulans Envanteri", description: "Acil yardım, hasta nakil ve hava/deniz ambulansları için ilaç ve malzeme kontrol listeleri." },
  "/evraklar": { title: "Ambulans Evrakları ve Formlar", description: "Vaka kayıt formu, tedavi red formu ve diğer 112 ambulans evrakları; indirilebilir orijinal dosyalar." },
  "/icd10": { title: "ICD-10 Tanı Kodu Bulucu", description: "Acil serviste sık kullanılan ICD-10 tanı kodlarını Türkçe anahtar kelime veya kodla arayın, tek dokunuşla kopyalayın." },
  "/ekg-egitim": { title: "EKG Eğitimi", description: "Temel EKG ve ritim bozuklukları: dersler, gerçek EKG şeritleriyle ritim atlası ve vaka sınavı." },
  "/ekg-egitim/atlas": { title: "EKG Ritim Atlası", description: "Hızlı, yavaş ve arrest ritimleri; gerçek EKG şeritleri ve değerlendirme ölçütleriyle." },
  "/ekg-egitim/sinav": { title: "EKG Vaka Sınavı", description: "Gerçek EKG şeritleriyle adım adım ritim değerlendirme sınavı." },
};

/** Alt sayfaların openGraph'ı kökünkünü tamamen ezer; ortak alanlar her sayfada tekrar verilir. */
export const OG_BASE = {
  siteName: `${SITE_NAME} — ${ORG_NAME}`,
  locale: "tr_TR",
  type: "website" as const,
  images: [{ url: "/og.png", width: 1200, height: 630, alt: `${SITE_NAME} — ${ORG_NAME}` }],
};

/** Sayfa metadata'sı: başlık "<sayfa> · Acil Protokol" olur. */
export function pageMeta(path: string, title: string, description: string): Metadata {
  return {
    // absolute: üst segmentin düz başlığı şablonu sıfırladığı için ek her sayfada açıkça verilir
    title: { absolute: `${title} · ${SITE_NAME}` },
    description,
    alternates: { canonical: path },
    openGraph: { ...OG_BASE, title: `${title} · ${SITE_NAME}`, description, url: path },
  };
}

export function seoFor(path: string): Metadata {
  const s = ROUTE_SEO[path];
  if (!s) throw new Error(`seo: "${path}" için kayıt yok`);
  return pageMeta(path, s.title, s.description);
}

/** Arama motorlarında listelenmemesi gereken sayfalar (çevrimdışı yedek sayfa, yapım aşamasındaki sayfalar). */
export const NOINDEX: Metadata = { robots: { index: false, follow: true } };
