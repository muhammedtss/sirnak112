# Bakanlık sunumu öncesi geliştirme planı

Tarih: 2026-10-08 · Dal: `kurumsal-ve-optimizasyon` · Canlı: https://www.112acilsaglik.com

Bu rapor, sitenin bakanlığa sunulmadan önce tamamlanması gereken her şeyi listeler ve fazlara böler. Fazlar sırayla uygulanır, her faz ayrı commit'lerle ilerler. Push için ayrıca onay alınır.

## Başlangıç ölçümleri (2026-10-08, canlı site)

| Ölçüm | Değer | Değerlendirme |
|---|---|---|
| Sunucu yanıtı (TTFB) | 324 ms | İyi |
| Ana sayfa toplam aktarım | 317 KB | JS ağırlıklı |
| Ana sayfa JavaScript | 251 KB sıkıştırılmış / 855 KB açık | Fazla |
| Arama verisi (her açılışta) | ~156 KB açık | Arama açılmadan gereksiz |
| Animasyon kütüphanesi (framer-motion) | ~49 KB sıkıştırılmış | Ana sayfada az kullanılıyor |
| Algoritma görselleri | 133 PNG, 92,5 MB, 3508×2481 | WebP ile örneklemde −%82 … −%93 |
| Otomatik test | Yok | Klinik hesaplayıcılar test edilmiyor |
| Hakkında / kaynak / sorumluluk reddi / gizlilik / erişilebilirlik | Yok | Kamu sitesi için eksik |
| CSP | `unsafe-eval` içeriyor | Üretimde gereksiz |
| README | Varsayılan şablon | Proje anlatılmıyor |

Lighthouse (PageSpeed) skorları API günlük kotası dolduğu için alınamadı; Faz B sonunda ölçülecek.

---

## Faz A — Kurumsal katman (bakanlık hazırlığı)

| # | İş | Çıktı |
|---|---|---|
| A1 | Site bilgileri için tek kaynak: kurum, geliştirici, sürüm, son güncelleme, kaynaklar, iletişim, klinik onay | `src/lib/site-info.ts` |
| A2 | **Hakkında ve Kaynaklar** sayfası: amaç, kapsam, kullanıcılar, içerik kaynakları, sürüm, geliştirici | `/hakkinda` |
| A3 | **Tıbbi sorumluluk reddi**: Hakkında sayfasında tam metin + hesaplayıcı sayfalarında kısa not | `ClinicalNote` bileşeni |
| A4 | **Gizlilik / KVKK bildirimi**: hangi verinin işlenmediği, cihazda ne saklandığı, barındırma | `/gizlilik` |
| A5 | **Erişilebilirlik beyanı**: hedef standart (WCAG 2.1 AA), yapılanlar, bilinen sınırlar, geri bildirim | `/erisilebilirlik` |
| A6 | **Klinik değişiklik günlüğü**: hangi klinik içerik, ne zaman, hangi kaynağa göre değişti | `/degisiklikler` |
| A7 | Ana sayfa alt bilgi: Hakkında · Gizlilik · Erişilebilirlik · Değişiklikler · sürüm | `page.tsx` |
| A8 | Yeni sayfaların SEO kayıtları ve site haritası | `seo.ts` |

## Faz B — Hız ve optimizasyon

| # | İş | Beklenen kazanç |
|---|---|---|
| B1 | Algoritma görsellerini WebP'ye çevir (yakınlaştırmada okunurluk korunarak), referansları güncelle | 92,5 MB → ~10 MB; çevrimdışı paket ~9× küçük |
| B2 | Arama dizinini yalnızca arama açılınca yükle | Ana sayfadan ~156 KB JS çıkar |
| B3 | Animasyon kütüphanesini ana sayfanın ilk yüklemesinden çıkar | ~49 KB sıkıştırılmış |
| B4 | Önce/sonra ölçümü: JS boyutları, sayfa ağırlığı, Lighthouse | Rapor tablosu |

## Faz C — Güvenilirlik ve test

| # | İş | Çıktı |
|---|---|---|
| C1 | Bağımlılıksız test altyapısı (Node yerleşik test koşucusu) | `npm test`, build öncesi otomatik |
| C2 | Klinik hesap testleri: Parkland (PDF örnekleri), Lund-Browder (her yaşta toplam %100), yanık eşiği | `tests/` |
| C3 | Veri bütünlüğü testleri: algoritma düğüm bağlantıları, ICD-10 kod biçimi, ilaç verisi alanları, görsel dosyaları | `tests/` |
| C4 | İsteğe bağlı: Vercel Speed Insights / Analytics (çerezsiz) | **Onay gerekir** (yeni paket + Vercel ayarı) |

## Faz D — Güvenlik ve barındırma

| # | İş | Çıktı |
|---|---|---|
| D1 | CSP'den üretimde `unsafe-eval`'i kaldır (geliştirmede kalır) | `next.config.ts` |
| D2 | `security.txt` (güvenlik bildirimi iletişimi) | **İletişim e-postası gerekir** |
| D3 | Yerli/kurumsal sunucuya taşınabilirlik notu | `docs/` |

## Faz E — Dokümantasyon

| # | İş | Çıktı |
|---|---|---|
| E1 | README: proje, modüller, mimari, kurulum, içerik güncelleme süreci, test | `README.md` |
| E2 | Bu raporun sonuç bölümü: yapılanlar ve önce/sonra ölçümleri | bu dosya |

---

## Senden gereken bilgiler

Bunlar gelene kadar ilgili alanlar sitede **gizli** kalır; hiçbir şey uydurulmaz.

1. **İletişim:** kurumsal e-posta (ve istenirse telefon). Hakkında sayfası ve `security.txt` için.
2. **Klinik onay:** içeriği gözden geçiren/onaylayan kişi veya birim adı.
3. **Sürüm numarası:** öneri `1.0.0` (bakanlık sunumu ilk resmi sürüm).
4. **Vercel Analytics:** isteniyor mu? (C4)

## İlerleme

- [ ] Faz A
- [ ] Faz B
- [ ] Faz C
- [ ] Faz D
- [ ] Faz E
