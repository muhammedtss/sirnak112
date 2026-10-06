# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Hastane öncesi acil sağlık personeli: paramedikler, acil tıp teknisyenleri (ATT) ve hekimler. Kullanım belirli bir il ya da ekiple sınırlı değildir; uygulama genel olarak tüm 112 sahası için tasarlanır.

Kullanım sahnesi: olay yerinde, ambulans kabininde, nakil sırasında. Kullanıcı çoğu zaman stres altındadır, tek eliyle telefon tutar, diğer eli hastadadır. Gece vardiyasında karanlık kabinde, gündüz güneş altında parlak ortamda kullanılır. Ağırlıklı cihaz telefondur; uygulama PWA olarak ana ekrana eklenir.

Yaptıkları iş: o anki vakaya uygun algoritmayı, ilaç dozunu, skalayı veya formülü bulmak ve uygulamak.

## Product Purpose

Acil vaka sırasında kullanıcının doğru araca (algoritma, vaka protokolü, skala/hesaplayıcı, ilaç dozu, envanter, evrak, ICD-10, EKG eğitimi) **en az dokunuşla ve en kısa sürede** ulaşmasını sağlamak. İnternet olmasa da tam çalışır.

Başarı ölçütü: aracın bulunma ve kullanılma süresi. Hiçbir arayüz öğesi bu süreyi uzatamaz.

## Positioning

- İçerik Sağlık Bakanlığı "EK-2 Hastane Öncesi Acil Tıbbi Yardım ve Bakım Akış Şemaları" dokümanına birebir dayanır; dokümanda telefon simgesiyle işaretli basamaklar uygulamada **KKM** olarak gösterilir.
- Akış şemaları adım adım, karar dallarıyla etkileşimli ilerletilir; orijinal şema görselleri de açılabilir.
- Kiloya göre doz, Parkland, yanık haritası (Lund-Browder), ETT, GKS gibi hesaplayıcılar sahada hesap yapmayı ortadan kaldırır.
- Tam çevrimdışı: tüm sayfalar ve hesaplayıcılar ilk açılışta cihaza kaydedilir.

## Operating Context

- 8 modül ve rotaları sabittir: Algoritmalar (`/algoritmalar-gorsel`), Vaka Protokolleri (`/vaka-protokolleri`), Skalalar (`/skalalar`), İlaç Dozu (`/ilac-doz`), Envanter (`/envanter`), Evraklar (`/evraklar`), ICD-10 (`/icd10`), EKG Eğitimi (`/ekg-egitim`).
- Alt navigasyon: Ana Sayfa, Skalalar, Protokoller, İlaç, Envanter.
- Kaynak dokümanlar: EK-2 akış şemaları (PDF) ve "Temel EKG ve Ritim Bozuklukları" eğitim sunumu.

## Capabilities and Constraints

- Next.js (App Router, statik üretim), Tailwind CSS v4, `next/font` ile Outfit, framer-motion, lucide-react.
- Koyu tema varsayılandır; açık tema da desteklenir (`data-theme` ile).
- PWA: manifest, service worker, çevrimdışı önbellek ve başlıktaki çevrimdışı durum butonu korunmalıdır.
- **Klinik içerik ve hesaplama mantığı yalnızca tıbbi kaynakla ve onayla değişir.** Doz formülleri, skala puanlamaları, algoritma adımları, ICD-10 ve EKG içerikleri görsel çalışmalarda hiçbir koşulda değiştirilmez. Veri dosyaları: `src/data/*`, `src/lib/burn.ts`, `src/lib/ekg/*`.
- Proje düzenli tıbbi kontrolden geçer.

## Brand Commitments

- Ad: "Acil Protokol Sistemi"; başlıkta "Şırnak 112 Acil Sağlık" üst satırı ve "Developed by Kadir Taş" satırı bulunur. Metinler korunur.
- Modüllerin kategori renkleri kullanıcılar tarafından tanınır ve korunur.
- Türkçe arayüz.

## Evidence on Hand

- `public/` altında EK-2 algoritma görselleri (Yetiskin/Cocuk/Dogum_Yenidogan_Algoritmalari), ambulans evrakları, EKG vaka görselleri, yanık haritası SVG'si.
- Kullanıcı yorumu, kullanım istatistiği veya ölçülmüş performans verisi yoktur; uydurulmamalıdır.

## Product Principles

1. **Hız her şeyin önünde.** Hiçbir güzelleştirme bir araca ulaşma süresini uzatamaz.
2. **Klinik doğruluk dokunulmazdır.** Görsel katman ile klinik veri birbirinden ayrı tutulur.
3. **Saha koşulu tasarlar.** Tek el, stres, karanlık kabin ve güneş altı okunabilirlik her kararın süzgecidir.
4. **İnternet bir varsayım değildir.** Her özellik çevrimdışı çalışmalıdır.
5. **Tanıdık kalır.** Değişiklikler iyileştirmedir; kullanıcı uygulamasını tanımaya devam eder.

## Accessibility & Inclusion

- Metinlerde WCAG AA kontrastı (4.5:1), hem koyu hem açık temada; güneş altı okunabilirlik kritik.
- Dokunma hedefleri en az 44×44px (tek elle, eldivenle kullanım).
- `prefers-reduced-motion` desteklenmeli; klavye ve ekran okuyucu erişimi için görünür odak durumları.
