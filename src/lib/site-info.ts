/* ════════════════════════════════════════════════════════════════
   Kurumsal bilgiler, kaynaklar ve klinik değişiklik günlüğü — tek kaynak.
   Hakkında, Gizlilik, Erişilebilirlik ve Değişiklikler sayfaları buradan okur.
   Değeri `null` olan alanlar sitede GÖSTERİLMEZ (uydurma bilgi yayınlanmaz);
   kurum bilgiyi verdiğinde yalnızca burası doldurulur.
   ════════════════════════════════════════════════════════════════ */

export const SITE_INFO = {
  uygulama: "Acil Protokol",
  kurum: "Şırnak İl Ambulans Servisi Başhekimliği",
  gelistirici: "Kadir TAŞ",
  /** Örn. "1.0.0" — kurum onayıyla doldurulacak */
  surum: null as string | null,
  /** Klinik içeriği gözden geçiren / onaylayan kişi veya birim */
  klinikOnay: null as string | null,
  iletisim: {
    eposta: null as string | null,
    telefon: null as string | null,
  },
};

export interface Kaynak {
  baslik: string;
  yayinlayan: string;
  kapsam: string;
}

/** Yalnızca doğrulanmış kaynaklar. Kaynağı belgelenmemiş modüller burada listelenmez. */
export const KAYNAKLAR: Kaynak[] = [
  {
    baslik: "Hastane Öncesi Acil Tıbbi Yardım ve Bakım Akış Şemaları",
    yayinlayan: "T.C. Sağlık Bakanlığı",
    kapsam: "Acil algoritmalar, vaka protokolleri, görsel akış şemaları, yanık sıvı resüsitasyonu (Parkland)",
  },
  {
    baslik: "Yanık tedavi algoritması (2012) — Lund-Browder şeması",
    yayinlayan: "T.C. Sağlık Bakanlığı Sağlık Hizmetleri Genel Müdürlüğü",
    kapsam: "Yaşa göre vücut yüzey alanı yüzdeleri (yanık hesaplama)",
  },
  {
    baslik: "Temel EKG (Elektrokardiyografi) eğitim sunumu",
    yayinlayan: "T.C. Sağlık Bakanlığı ASH Genel Müdürlüğü, Eğitim ve Projeler Daire Başkanlığı",
    kapsam: "EKG eğitimi dersleri, ritim atlası ve gerçek vaka görüntüleri",
  },
  {
    baslik: "ICD-10 — Uluslararası Hastalık Sınıflaması, 10. revizyon",
    yayinlayan: "Dünya Sağlık Örgütü",
    kapsam: "ICD-10 tanı kodu bulucu",
  },
  {
    baslik: "Standart klinik skalalar",
    yayinlayan: "Uluslararası kabul görmüş yayımlanmış skalalar",
    kapsam: "Glasgow Koma Skalası, APGAR, AVPU, mMRC dispne, MRC kas gücü, Pediatrik Değerlendirme Üçgeni",
  },
];

export interface KlinikDegisiklik {
  /** ISO tarih (YYYY-AA-GG) */
  tarih: string;
  baslik: string;
  ayrinti: string[];
  kaynak?: string;
}

/** En yeni üstte. Yalnızca klinik içeriği (doz, formül, akış, veri) etkileyen değişiklikler. */
export const KLINIK_DEGISIKLIKLER: KlinikDegisiklik[] = [
  {
    tarih: "2026-10-08",
    baslik: "Eksik akış şeması eklendi, kırık algoritma yönlendirmeleri düzeltildi",
    ayrinti: [
      "Çocuk: \"Etiyolojisi Saptanmamış Şok Tablosuna Yaklaşım\" tablosu görsel algoritmalara eklendi (önceden hiçbir listeden açılmıyordu).",
      "Eklampsi → Diyabetik Aciller ve Yenidoğan Canlandırması → Arrest Yönetimi yönlendirmeleri açılmıyordu (404); artık doğru algoritmaya gider.",
      "\"İlgili algoritmaya git\" türü genel yönlendirmeler kategori listesini açar; hastanın durumuna uygun algoritma seçilir.",
      "Algoritma içerikleri değişmedi.",
    ],
    kaynak: "SB Hastane Öncesi Akış Şemaları (s. 99)",
  },
  {
    tarih: "2026-10-07",
    baslik: "Parkland formülü akış şemalarına göre güncellendi",
    ayrinti: [
      "Yanıkta saatlik başlangıç Ringer Laktat hızı = (k × yanık VYA % × kg) / 16.",
      "k = 2 (13 yaş üstü ve erişkin), 3 (13 yaş altı), 4 (elektrik çarpması, her yaş).",
      "Hastane öncesi sıvı eşiği uyarısı: 30 kg ve üzeri için %15, 30 kg altı için %10 ve üzeri yanık.",
      "Önceki hesap (4 mL × kg × VYA %, 24 saatlik toplam) kaldırıldı.",
    ],
    kaynak: "SB Hastane Öncesi Akış Şemaları, Yanık Anahtar Noktalar (s. 48 ve 133)",
  },
  {
    tarih: "2026-09-29",
    baslik: "Parkland 24 saatlik toplam hesabına döndürüldü",
    ayrinti: ["kg × 4 × yanık %; yarısı ilk 8 saatte, yarısı sonraki 16 saatte. (7 Ekim 2026'da yeniden değiştirildi.)"],
  },
  {
    tarih: "2026-09-28",
    baslik: "Algoritma ve vaka protokolleri akış şemalarına göre düzeltildi",
    ayrinti: [
      "Acil doğum: \"40 cc/dk\" ifadesi \"40 damla/dk\" olarak düzeltildi.",
      "Çocuk asistoli/NEA: adrenalin \"damar yolu açılır açılmaz\" verilir.",
      "Çocuk taşikardi: adenozin maksimum dozları (6/12 mg); amiodaron iki başarısız kardiyoversiyon sonrası.",
      "Çocuk nöbet: diazepam ve midazolam yaş ve yola göre dozlar; fenitoin birimi mg/kg/dk.",
      "Kardiyoversiyon enerjileri, hipotermik arrestte defibrilasyon erteleme, %20 dekstrozun periferik yoldan verilemeyeceği, ETT 2 yaş altı 4 mm eklendi.",
      "Yanık sıvısı akış şemasındaki saatlik başlangıç hızına geçirildi (29 Eylül'de geri alındı, 7 Ekim'de yeniden uygulandı).",
      "Telefonla danışılması gereken adımlar KKM işaretiyle gösterildi.",
      "Erişilemeyen veya döngüye giren akış dalları onarıldı.",
    ],
    kaynak: "SB Hastane Öncesi Akış Şemaları",
  },
  {
    tarih: "2026-09-28",
    baslik: "Yanık haritası ve Lund-Browder değerleri",
    ayrinti: [
      "33 bölgeli etkileşimli yanık haritası eklendi.",
      "Bölge yüzdeleri Lund-Browder değerlerine çekildi; her yaş grubunda toplam %100.",
    ],
    kaynak: "SB Sağlık Hizmetleri Genel Müdürlüğü, Yanık tedavi algoritması (2012)",
  },
  {
    tarih: "2026-09-28",
    baslik: "EKG modülü kaynak sunumdan yeniden kuruldu",
    ayrinti: ["Ritim–görüntü eşleşmeleri kaynak sunumun slaytlarına göre düzeltildi; görüntülerden cevap tabloları çıkarıldı."],
    kaynak: "ASH GM — Temel EKG eğitim sunumu",
  },
  {
    tarih: "2026-09-27",
    baslik: "Atropin: çocuk bradikardisinde kontrendike olarak işaretlendi",
    ayrinti: ["İlaç doz hesaplayıcısında ilgili yaş grubu için hesap yapılmaz, uyarı gösterilir."],
  },
  {
    tarih: "2026-09-25",
    baslik: "ETT boyutu formülleri yaş sınırı olmadan uygulanıyor",
    ayrinti: ["Pediatrik ETT hesaplayıcısında formüller yaş aralığı kısıtlaması olmadan uygulanır."],
  },
];

/** Klinik içeriğin son güncellenme tarihi (günlüğün en yeni kaydı). */
export const KLINIK_SON_GUNCELLEME = KLINIK_DEGISIKLIKLER[0].tarih;

/** "2026-10-07" → "7 Ekim 2026" */
export function tarihTr(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}
