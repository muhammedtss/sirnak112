# iOS'ta çevrimdışı kullanım analizi

Tarih: 2026-10-07 · Kapsam: `public/sw.js`, `src/lib/pwa/*`, `src/app/manifest.ts`, `src/app/layout.tsx`

## Kısa cevap

**Evet, mümkün.** Tek şartla: uygulama **Ana Ekrana eklenip oradan açılmalı**. Safari sekmesinde açık siteyle de çalışır, ama iOS o depolamayı silebilir. Bu yüzden saha kullanımı için yalnızca ana ekran sürümü güvenilirdir.

## Neden çalışır

| Gereksinim | iOS durumu | Uygulamada |
|---|---|---|
| Service Worker + Cache API | iOS 11.3'ten beri var | `public/sw.js` sayfaları, RSC yüklerini ve dosyaları önbelleğe alıyor; çevrimdışıyken önbellekten sunuyor |
| Manifest ile tam ekran açılış | iOS 11.3+ (`display: standalone`) | `src/app/manifest.ts` |
| Eski iOS'ta tam ekran etiketi | `apple-mobile-web-app-capable` | `layout.tsx` › `other` (2026-10-07'de eklendi) |
| Ana ekran ikonu | `apple-touch-icon` 180×180, saydamlıksız | `public/apple-touch-icon.png` (yenilendi) |
| Kalıcı depolama isteği | Safari 17+ `navigator.storage.persist()`; ana ekran uygulamalarına genelde verilir | `sw-client.ts:160` |
| Depolama kotası | iOS 17+: diskin önemli bir yüzdesi; iOS 16 ve öncesi ~1 GB civarı | Çekirdek (212 sayfa + 57 dosya) birkaç MB; isteğe bağlı algoritma görselleri paketi **92 MB** — iki sınırın da altında |
| Diğer tarayıcılarla ana ekrana ekleme | iOS 16.4+ Chrome/Edge/Firefox Paylaş menüsünde de var | Yönerge Safari'yi anlatıyor, diğerleri de aynı adımlar |

## Bilinmesi gereken iOS kısıtları

1. **Safari sekmesi ile ana ekran uygulamasının depolaması ayrıdır.** Safari'de indirilen çevrimdışı içerik, ana ekrandaki uygulamaya geçmez. Uygulama ana ekrandan ilk açıldığında internet varken kendi önbelleğini doldurur. Bunu otomatik yapıyor: çekirdek paket her cihaza iner.
2. **7 günlük silme kuralı (ITP).** Safari, 7 gün kullanılmayan sitelerin betikle yazılmış verisini (Cache dahil) silebilir. Ana ekran uygulamaları kendi kullanım gün sayacıyla değerlendirilir. Düzenli açılan uygulamada pratikte sorun olmaz; uzun süre açılmazsa bir sonraki çevrimiçi açılışta yeniden iner.
3. **Kurulum düğmesi yok.** iOS `beforeinstallprompt` desteklemez. Bu yüzden çevrimdışı panelinde iPhone'a özel adım adım yönerge gösteriliyor (`src/components/pwa/InstallCard.tsx`).
4. **Arka planda güncelleme yok.** Background Sync ve Periodic Sync iOS'ta yok. İçerik güncellemeleri uygulama internet varken açıldığında iniyor. Protokol güncellemesinden sonra personelin uygulamayı bir kez çevrimiçi açması gerekir.
5. **Kotayı aşma riski düşük ama sıfır değil.** Cihazda yer çok azsa iOS önbelleği küçültebilir. Algoritma görselleri paketi bu yüzden isteğe bağlı tutulmalı (şu anki tasarım böyle).

## Doğrulanamayanlar

Bu ortamda gerçek iPhone/WebKit yok. Chromium'da yapılan çevrimdışı testler WebKit davranışını birebir göstermez. Sahaya çıkmadan önce bir iPhone'da şu kontrol listesi uygulanmalı:

- [ ] Safari'de https://www.112acilsaglik.com aç → Paylaş → Ana Ekrana Ekle → Ekle. Simge yeni ikonla görünüyor mu?
- [ ] Ana ekrandan aç: adres çubuğu yok, üst kısım çentiğin/saatin altına girmiyor mu?
- [ ] Başlıktaki bulut düğmesi → "İnternetsiz kullanıma hazır" görünene kadar bekle.
- [ ] İsteğe bağlı: Algoritma görselleri paketini indir (92 MB, Wi-Fi'de).
- [ ] Uygulamayı tamamen kapat → **Uçak modu** → ana ekrandan yeniden aç.
- [ ] Çevrimdışıyken: ana sayfa, bir vaka protokolü, İlaç Dozu hesabı, bir skala, ICD-10 araması, bir görsel algoritma (paket indirildiyse) ve EKG dersi açılıyor mu?
- [ ] 1 hafta sonra uçak modunda tekrar aç: içerik hâlâ duruyor mu?

## Öneriler

- Sahaya dağıtırken personele "Safari'de değil, **ana ekrandaki simgeden** açın" mesajı verilmeli.
- Protokol güncellemelerinden sonra "uygulamayı bir kez internetteyken açın" duyurusu yapılmalı. Uygulama yeni sürümü açılışta kendisi alıyor.
