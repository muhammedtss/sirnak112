# Acil Protokol

**Şırnak İl Ambulans Servisi Başhekimliği** için geliştirilmiş, 112 acil sağlık personeline (paramedik, ATT, hekim) yönelik hastane öncesi karar destek uygulaması.

Canlı: **https://www.112acilsaglik.com** · Geliştiren: Kadir TAŞ

> Karar destek aracıdır; klinik değerlendirmenin ve hekim talimatının yerine geçmez. Ayrıntı: `/hakkinda#sorumluluk`.

## Modüller

| Modül | Yol | İçerik |
|---|---|---|
| Görsel algoritmalar | `/algoritmalar-gorsel` | SB akış şemaları (erişkin, çocuk, doğum/yenidoğan), parmakla yakınlaştırma |
| Algoritmalar / Vaka protokolleri | `/algoritmalar`, `/vaka-protokolleri` | Aynı akışların adım adım, karar noktalı metin hali |
| İlaç dozu | `/ilac-doz` | Kiloya göre doz, uygulama yolu, maksimum doz, dopamin cc/saat |
| Skalalar | `/skalalar` | GKS, AVPU, APGAR, PAT, Parkland, yanık yüzdesi (Lund-Browder), ventilatör, ETT, LMA… |
| Envanter | `/envanter` | Ambulans tipine göre ilaç kontrol listesi |
| Evraklar | `/evraklar` | Form ve tutanak örnekleri, orijinal dosyalar |
| ICD-10 | `/icd10` | Türkçe aramalı tanı kodu bulucu |
| EKG eğitimi | `/ekg-egitim` | Dersler, ritim atlası, vaka sınavı |
| Kurumsal | `/hakkinda`, `/gizlilik`, `/erisilebilirlik`, `/degisiklikler` | Kaynaklar, sorumluluk reddi, KVKK, erişilebilirlik, klinik değişiklik günlüğü |

## Teknik özet

- **Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4.** Tüm sayfalar build sırasında statik üretilir (~220 sayfa).
- **Çevrimdışı çalışır (PWA):** `public/sw.js` + `/sw-manifest`. Tüm sayfalar ve build dosyaları ilk açılışta cihaza kaydedilir; algoritma görselleri (11,8 MB) isteğe bağlı paket. iOS ayrıntıları: [`docs/ios-offline.md`](docs/ios-offline.md).
- **Sunucu tarafı veri yok, kişisel veri yok.** Hesaplamalar tarayıcıda yapılır; çerez, analitik ve üçüncü taraf istek yoktur.
- **Güvenlik başlıkları:** sıkı CSP (üretimde `unsafe-eval` yok, yalnızca `'self'`), HSTS, X-Frame-Options, Permissions-Policy (`next.config.ts`).
- **Erişilebilirlik:** WCAG 2.1 AA hedefi; açık/koyu tema, 44 px dokunma hedefleri, hareket azaltma desteği.

## Klasör yapısı

```
src/
  app/            Sayfalar (her modül bir klasör), sitemap.ts, robots.ts, manifest.ts, sw-manifest/
  components/     Arayüz bileşenleri (algorithm, drugs, ekg, envanter, kurumsal, layout, pwa, search, skalalar, ui)
  data/           KLİNİK VERİ: algoritmalar (eriskin/cocuk/yenidogan.json), ilaclar.json, icd10.json,
                  ambulans-envanter.json, burn-zones.json, algorithmImages.ts
  lib/            Hesaplama ve yardımcılar: burn.ts (Lund-Browder, Parkland), doz.ts (ilaç dozu),
                  algoritma.ts, ekg/, seo.ts, site-info.ts (kurum, kaynaklar, değişiklik günlüğü)
public/           Görseller, evraklar, ikonlar, sw.js
tests/            Otomatik testler (npm test)
scripts/          Bütünlük denetimi, ikon ve görsel üretimi
docs/             Güncel plan ve iOS analizi; docs/arsiv/ altında tamamlanmış planlar ve denetim raporları
```

## Geliştirme

Node.js 22.6 veya üzeri gerekir.

```bash
npm install
npm run dev        # http://localhost:3000 (çevrimdışı mod geliştirmede kapalıdır)
npm test           # klinik hesap ve veri bütünlüğü testleri
npm run build      # önce bütünlük denetimi + testler, sonra üretim derlemesi
npm start          # üretim sunucusu
```

`npm run build` öncesinde **otomatik olarak** `scripts/verify-integrity.mjs` ve `npm test` çalışır; biri başarısız olursa derleme (ve Vercel yayını) durur.

## Klinik içerik güncelleme süreci

1. İlgili veri dosyasını güncelleyin (`src/data/…` veya hesaplama için `src/lib/…`). Kaynak belgeyi ve sayfa numarasını not edin.
2. `src/lib/site-info.ts` › `KLINIK_DEGISIKLIKLER` listesinin **en üstüne** tarih, açıklama ve kaynakla bir kayıt ekleyin. Bu kayıt `/degisiklikler` sayfasında yayınlanır ve "klinik içerik son güncelleme" tarihini belirler.
3. Gerekirse `tests/` altına yeni bir test ekleyin (ör. yeni bir formülün kaynak belgedeki örneği).
4. `npm test` ve `npm run build` çalıştırın; ardından tarayıcıda ilgili sayfayı kontrol edin.
5. Klinik değişiklikler yayına alınmadan önce sorumlu hekim onayından geçmelidir.

Test kapsamı: Parkland (SB akış şemaları s. 48/133 örnekleri ve sıvı eşiği), Lund-Browder (her yaşta toplam %100), ilaç dozu (hesap, yuvarlama, kilo sınırları, kontrendikasyon; veri dosyasındaki her kullanılabilir ilaç/vaka/yaş), algoritma akışları (tüm bağlantılar, yönlendirmeler, her adıma erişilebilirlik), ICD-10 kod biçimi, görsel dosyaları, SEO rotaları.

## Diğer görevler

| Görev | Nasıl |
|---|---|
| Yeni sayfa eklemek | `src/app/<yol>/page.tsx` + `src/lib/seo.ts › ROUTE_SEO` kaydı + istemci sayfasıysa `layout.tsx` (`seoFor`) |
| Dinamik rota eklemek | `src/lib/static-params.ts`'e ekleyin; çevrimdışı önbellek ve sitemap buradan beslenir |
| Kurum bilgilerini (sürüm, iletişim, klinik onay) girmek | `src/lib/site-info.ts › SITE_INFO`; boş alanlar sitede gösterilmez |
| Uygulama ikonlarını yeniden üretmek | `node scripts/generate-icons.mjs` |
| Yeni algoritma görsellerini (PNG) WebP'ye çevirmek | `node scripts/optimize-algorithm-images.mjs` |
| Alan adını değiştirmek | `NEXT_PUBLIC_SITE_URL` ortam değişkeni (canonical, sitemap, Open Graph) |

## Barındırma ve taşınabilirlik

Şu an Vercel üzerinde yayınlanır; `main` dalına her push yeni sürümü otomatik yayınlar. Uygulama kişisel veri işlemediği ve tüm sayfalar statik olduğu için herhangi bir Node.js sunucusuna (kurum içi sunucu, yerli bulut, container) taşınabilir:

```bash
npm ci && npm run build && npm start   # varsayılan port 3000; önüne HTTPS ters vekil (nginx vb.) konmalı
```

Service Worker yalnızca HTTPS (veya localhost) altında çalışır. Güvenlik başlıkları `next.config.ts` içinde tanımlıdır ve sunucudan bağımsız olarak uygulanır.
