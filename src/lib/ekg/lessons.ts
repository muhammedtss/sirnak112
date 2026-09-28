/* EKG eğitim dersleri — kaynak sunumun akışıyla (slayt aralıkları). */

export interface Ders {
  slug: string;
  no: number;
  baslik: string;
  ozet: string;
  slaytlar: string;
}

export const DERSLER: Ders[] = [
  { slug: "giris", no: 1, baslik: "Giriş ve Hedefler", ozet: "Ortak bir değerlendirme yöntemi", slaytlar: "1–3" },
  { slug: "ileti-sistemi", no: 2, baslik: "Kalbin İleti Sistemi", ozet: "SA düğümden Purkinje liflerine", slaytlar: "4–5" },
  { slug: "ekg-kagidi", no: 3, baslik: "EKG Kağıdı ve Dalgalar", ozet: "Kare, süre ve P-QRS-T", slaytlar: "6–7" },
  { slug: "degerlendirme", no: 4, baslik: "Ritim Değerlendirme Aşamaları", ozet: "5 adım, hız hesabı, normal sinüs ritmi", slaytlar: "8–12" },
  { slug: "siniflandirma", no: 5, baslik: "Aritmi ve Sınıflandırma", ozet: "Hızlı, yavaş ve arrest ritimler", slaytlar: "13–16" },
  { slug: "hizli-ritimler", no: 6, baslik: "Hızlı Ritimler", ozet: "Taşikardi vakaları, PSVT, AF, dal blokları, WPW", slaytlar: "17–30" },
  { slug: "yavas-ritimler", no: 7, baslik: "Yavaş Ritimler ve AV Bloklar", ozet: "Bradikardi ve AV blok vakaları", slaytlar: "31–36" },
  { slug: "arrest-ritimleri", no: 8, baslik: "Arrest Ritimleri", ozet: "Şoklanır ve şoklanmaz ritimler", slaytlar: "14" },
];

export const dersBySlug = (slug: string) => DERSLER.find(d => d.slug === slug);
