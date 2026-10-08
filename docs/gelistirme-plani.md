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

## Faz B sonuçları (2026-10-08)

| Ölçüm | Önce (canlı) | Sonra | Fark |
|---|---|---|---|
| Ana sayfa ilk yükleme JS (gzip) | 278 KB | 206 KB | −%26 |
| Ana sayfa ilk yükleme JS (açık) | 965 KB | 654 KB | −%32 |
| Diğer sayfalar ilk yükleme JS (gzip) | ~230–240 KB | ~202–214 KB | ≈ −26 KB her sayfada |
| Algoritma görselleri (çevrimdışı paket) | 92,5 MB (PNG) | 11,8 MB (WebP) | −%87 |
| Arama verisi ilk yüklemede | Evet | Hayır (arama açılınca) | — |

Ek düzeltmeler:
- Service Worker (v7) artık build'in tüm static dosyalarını önbelleğe alır; sonradan yüklenen parçalar (arama, animasyon motoru) çevrimdışında da çalışır. Doğrulandı: 64/64 dosya önbellekte.
- Algoritmalar, Vaka Protokolleri, Görsel Algoritmalar ve Envanter liste sayfalarındaki giriş animasyonu kaldırıldı: kartlar sunucudan görünmez geliyor ve JS yüklenene kadar gizli kalıyordu.
- Alt menüdeki aktif daire CSS ile çiziliyor (görünüm aynı).
- Kullanılmayan `PageTransition` ve `GlassCard` bileşenleri silindi.

Ölçüm yöntemi: sayfanın ilk HTML'inde yüklenen tüm JS dosyalarının gzip −9 boyutu (aynı betikle hem canlı hem yerel). Lighthouse skorları PageSpeed kotası açılınca eklenecek.

## Faz C sonuçları (2026-10-08)

- `npm test`: Node'un yerleşik test koşucusu, **yeni bağımlılık yok**. `prebuild` adımında çalışır; bir test kırılırsa Vercel yayına almaz.
- **20 test:** Parkland (PDF örnekleri ve eşik), Lund-Browder (her yaşta %100), ilaç dozu (hesap, yuvarlama, kilo sınırları, kontrendikasyon, dopamin) ve veri bütünlüğü (algoritma bağlantıları ve erişilebilirlik, ICD-10, görsel dosyaları, SEO rotaları, değişiklik günlüğü).
- **Testlerin bulduğu gerçek hata:** 7 algoritma yönlendirmesi 404 veriyordu (canlıda doğrulandı):
  - Yenidoğan → erişkin/çocuk yönlendirmeleri yanlış kategoride aranıyordu (Eklampsi → Diyabetik Aciller, Yenidoğan Canlandırması → Arrest Yönetimi). Artık hedefin kendi kategorisine gidiyor.
  - "İlgili algoritmaya git" türü 5 genel yönlendirme var olmayan bir sayfaya bağlanıyordu. Artık kategori listesini açıyor ve "Hastanın durumuna uygun algoritmayı listeden seçin" diyor.
  - Klinik veri (JSON) değiştirilmedi; düzeltme görüntüleyicide.
- İlaç doz hesabı bileşenden `src/lib/doz.ts`'e birebir taşındı (test edilebilir); davranış aynı.

## İlerleme

- [x] Faz A — kurumsal sayfalar, sorumluluk notu, alt bilgi, SEO kayıtları
- [x] Faz B — görseller WebP, arama dizini ve animasyon motoru ilk yüklemeden çıkarıldı
- [x] Faz C — 20 otomatik test, build öncesi zorunlu; 7 kırık algoritma yönlendirmesi bulundu ve düzeltildi
- [ ] Faz D
- [ ] Faz E
