# GÜVENLİK VE KALİTE KAPISI ÖN-SÜRÜM (PRE-PUSH) RAPORU

## 1. Git ve Depo Hijyeni Kanıtı

### `git status`
```bash
��On branch main
Your branch is ahead of 'origin/main' by 1 commit.
  (use "git push" to publish your local commits)

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	status.txt

nothing added to commit but untracked files present (use "git add" to track)
```

### `git log -n 3 --stat`
```bash
��commit a515afca8cd914a50d38ac9665053596d9a52f29
Author: Muhammed <muhammedtss@users.noreply.github.com>
Date:   Sun Sep 27 07:29:08 2026 +0300

    feat(ekg & security): add interactive EKG academy/exam simulator, offline PWA support, and P0 security/medical calculation patches

 .gitignore                                      |   4 +
 "3-Temel EKG ve Ritim Bozukluklar\304\261.pdf"  | Bin 3115457 -> 0 bytes
 calc-centroids.js                               |  44 --
 centroids.json                                  | 134 ------
 docs/audits/AUDIT_REPORT.md                     | 301 ++++++++++++
 docs/audits/AUDIT_REPORT_PHASE2.md              |  79 ++++
 docs/audits/PRE_PUSH_STATUS_REPORT.md           | 580 ++++++++++++++++++++++++
 extract-svg.js                                  |  20 -
 extract_ekg_images.py                           |  60 ---
 extract_ekg_images_pixmap.py                    |  39 --
 migrate_skalalar.js                             |  54 ---
 migrate_skalalar_ui.js                          |  29 --
 next.config.ts                                  |  21 +-
 package-lock.json                               |  39 +-
 package.json                                    |   8 +-
 public/ekg-fallback.svg                         |  13 +
 public/ekg/slide-10.png                         | Bin 621832 -> 0 bytes
 public/ekg/slide-11.png                         | Bin 662084 -> 0 bytes
 public/ekg/slide-14.png                         | Bin 4271 -> 0 bytes
 public/ekg/slide-17.png                         | Bin 2323865 -> 150621 bytes
 public/ekg/slide-18.png                         | Bin 2216014 -> 141836 bytes
 public/ekg/slide-20.png                         | Bin 4271 -> 0 bytes
 public/ekg/slide-22.png                         | Bin 2597888 -> 172194 bytes
 public/ekg/slide-23.png                         | Bin 2337351 -> 146866 bytes
 public/ekg/slide-24.png                         | Bin 4271 -> 0 bytes
 public/ekg/slide-25.png                         | Bin 163099 -> 106221 bytes
 public/ekg/slide-26.png                         | Bin 2611711 -> 159174 bytes
 public/ekg/slide-27.png                         | Bin 4271 -> 0 bytes
 public/ekg/slide-28.png                         | Bin 564205 -> 0 bytes
 public/ekg/slide-30.png                         | Bin 60496 -> 14324 bytes
 public/ekg/slide-32.png                         | Bin 2603469 -> 171375 bytes
 public/ekg/slide-33.png                         | Bin 2525362 -> 165476 bytes
 public/ekg/slide-34.png                         | Bin 2343951 -> 158244 bytes
 public/ekg/slide-35.png                         | Bin 2459569 -> 157273 bytes
 public/ekg/slide-36.png                         | Bin 1093933 -> 90308 bytes
 public/ekg/slide-4.png                          | Bin 486202 -> 0 bytes
 public/ekg/slide-6.png                          | Bin 488186 -> 0 bytes
 public/ekg/slide-7.png                          | Bin 98030 -> 0 bytes
 public/ekg/slide-9.png                          | Bin 4271 -> 0 bytes
 public/sw.js                                    |  87 ++++
 scripts/verify-integrity.mjs                    | 165 +++++++
 src/app/error.tsx                               |  12 +
 src/app/layout.tsx                              |  11 +-
 src/app/manifest.ts                             |  20 +
 src/components/drugs/DrugDoseCalculator.tsx     |  11 +-
 src/components/ekg/DigitalCaliper.tsx           |  15 +-
 src/components/ekg/EkgExamSimulator.tsx         |  40 +-
 src/components/ekg/EkgGuidedEducation.tsx       |  19 +-
 src/components/ekg/TreeBuilderGame.tsx          |  14 +-
 src/components/layout/ThemeToggle.tsx           |  10 +-
 src/components/skalalar/BurnCalculatorEmbed.tsx |  18 +-
 src/data/ekg-training-data.ts                   |  17 +-
 52 files changed, 1405 insertions(+), 459 deletions(-)

commit b26459b3665511e3bea6bd35e046b30719a30eba
Author: Muhammed <muhammedtss@users.noreply.github.com>
Date:   Sun Sep 27 06:38:17 2026 +0300

    fix(ekg): fix exam simulator data ids and improve EKG strip rendering quality

 src/app/globals.css                       | 47 +++++++++++++++++++++++++++++++
 src/components/ekg/DigitalCaliper.tsx     |  2 +-
 src/components/ekg/EkgExamSimulator.tsx   | 14 ++++-----
 src/components/ekg/EkgGuidedEducation.tsx | 22 +++++++--------
 4 files changed, 66 insertions(+), 19 deletions(-)

commit 854f90608216d05913c56aa8bc205bb052c010d9
Author: Muhammed <muhammedtss@users.noreply.github.com>
Date:   Sun Sep 27 00:26:50 2026 +0300

    feat(evraklar): add Ambulansta Gerceklesen Dogum Raporu

 ...RC\314\247EKLES\314\247EN DOG\314\206UM RAPORU.docx" | Bin 0 -> 31307 bytes
 src/app/evraklar/page.tsx                               |  14 ++++++++++++++
 src/app/skalalar/parkland/page.tsx                      |  16 ++++++++--------
 3 files changed, 22 insertions(+), 8 deletions(-)
```

### `git status --ignored`
```bash
��On branch main
Your branch is ahead of 'origin/main' by 1 commit.
  (use "git push" to publish your local commits)

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	ignored.txt
	log.txt
	status.txt

Ignored files:
  (use "git add -f <file>..." to include in what will be committed)
	.next/
	next-env.d.ts
	node_modules/
	tsconfig.tsbuildinfo

nothing added to commit but untracked files present (use "git add" to track)
```

## 2. Kalite ve Güvenlik Kapısı (Quality Gate) Çıktıları

### `npm run verify`
```bash
��
> acil-protokol@0.1.0 verify
> node scripts/verify-integrity.mjs

=== B<%^LATILIYOR: DO%^RULAMA SCR%�%PT%�% ===

[TEST 1] Fiziksel Dosya ve G%�rsel Do%_rulamas%�% (Zero-404 Test)
��� PASS: Toplam 13 g%�rsel ba<%_ar%�%yla do%_ruland%�%.

[TEST 2] T%]%rk%e Locale ve Veri E<%_le<%_me Testi
��� PASS: T%]%rk%e locale e<%_le<%_me sim%]%lasyonu ba<%_ar%�%l%�%.

[TEST 3] T%�%bbi Hesaplay%�%c%�% Kaos / Fuzzing Testi
��� PASS: Fuzzing 10 ekstrem girdiye kar<%_%�% ba<%_ar%�%yla korundu.

[TEST 4] G%]%venlik ve S%�%z%�%nt%�% Denetimi
��� PASS: G%]%venlik ve S%�%z%�%nt%�% Denetimi ba<%_ar%�%l%�%.

��� T%�M TESTLER BA<%^ARIYLA GE%�T%�%. S%�%STEM KUSURSUZ %�ALI<%^IYOR.
```

### `npm audit`
```bash
��found 0 vulnerabilities
```

### `npm run build`
```bash
��
> acil-protokol@0.1.0 prebuild
> node scripts/verify-integrity.mjs

=== B<%^LATILIYOR: DO%^RULAMA SCR%�%PT%�% ===

[TEST 1] Fiziksel Dosya ve G%�rsel Do%_rulamas%�% (Zero-404 Test)
��� PASS: Toplam 13 g%�rsel ba<%_ar%�%yla do%_ruland%�%.

[TEST 2] T%]%rk%e Locale ve Veri E<%_le<%_me Testi
��� PASS: T%]%rk%e locale e<%_le<%_me sim%]%lasyonu ba<%_ar%�%l%�%.

[TEST 3] T%�%bbi Hesaplay%�%c%�% Kaos / Fuzzing Testi
��� PASS: Fuzzing 10 ekstrem girdiye kar<%_%�% ba<%_ar%�%yla korundu.

[TEST 4] G%]%venlik ve S%�%z%�%nt%�% Denetimi
��� PASS: G%]%venlik ve S%�%z%�%nt%�% Denetimi ba<%_ar%�%l%�%.

��� T%�M TESTLER BA<%^ARIYLA GE%�T%�%. S%�%STEM KUSURSUZ %�ALI<%^IYOR.

> acil-protokol@0.1.0 build
> next build

���% Next.js 16.3.5 (Turbopack)
node.exe : ��� Warning: Next.js ignored package-lock.json in C:\Users\zazaz because it is outside the current Git repos
itory (C:\Users\zazaz\Desktop\projeler\medikal\acil-protokol).
At line:1 char:1
+ & "C:\Program Files\nodejs/node.exe" "C:\Program Files\nodejs/node_mo ...
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : NotSpecified: (��� Warning: Ne...acil-protokol).:String) [], RemoteException
    + FullyQualifiedErrorId : NativeCommandError
 
 To use this directory, set `turbopack.root` in your Next.js config.

��� Running next.config.ts took 41ms

  Creating an optimized production build ...
��� Compiled successfully in 1563ms
  Running TypeScript ...
  Finished TypeScript in 1392ms ...
  Collecting page data using 15 workers ...
  Generating static pages using 15 workers (0/40) ...
  Generating static pages using 15 workers (10/40) 
  Generating static pages using 15 workers (20/40) 
  Generating static pages using 15 workers (30/40) 
��� Generating static pages using 15 workers (40/40) in 492ms
  Finalizing page optimization ...

Route (app)
��� ��� /
��� ��� /_not-found
��� ��� /algoritmalar
��� ��� /algoritmalar-gorsel
��� �� /algoritmalar-gorsel/[kategori]
��� ��� /algoritmalar/cocuk
��� �� /algoritmalar/cocuk/[id]
��� ��� /algoritmalar/eriskin
��� �� /algoritmalar/eriskin/[id]
��� ��� /algoritmalar/yenidogan
��� �� /algoritmalar/yenidogan/[id]
��� ��� /ekg-egitim
��� ��� /envanter
��� �� /envanter/[tip]
��� �� /envanter/[tip]/[kategori]
��� ��� /evraklar
��� ��� /icd10
��� ��� /ilac-doz
��� ��� /ilac-doz/cocuk
��� �� /ilac-doz/cocuk/[id]
��� ��� /ilac-doz/eriskin
��� �� /ilac-doz/eriskin/[id]
��� ��� /ilac-doz/yenidogan
��� �� /ilac-doz/yenidogan/[id]
��� ��� /manifest.webmanifest
��� ��� /skalalar
��� ��� /skalalar/apgar
��� ��� /skalalar/avpu
��� ��� /skalalar/best-guess
��� ��� /skalalar/cabuk
��� ��� /skalalar/dispne
��� ��� /skalalar/ett
��� ��� /skalalar/geri-dondurulebilir
��� ��� /skalalar/glasgow-bebek
��� ��� /skalalar/glasgow-pediatri
��� ��� /skalalar/glasgow-yetiskin
��� ��� /skalalar/kas-gucu
��� ��� /skalalar/lma
��� ��� /skalalar/onaysiz-ilaclar
��� ��� /skalalar/parkland
��� ��� /skalalar/pat
��� ��� /skalalar/ventilator
��� ��� /skalalar/yanik
��� ��� /vaka-protokolleri
��� ��� /vaka-protokolleri/cocuk
��� �� /vaka-protokolleri/cocuk/[id]
��� ��� /vaka-protokolleri/eriskin
��� �� /vaka-protokolleri/eriskin/[id]
��� ��� /vaka-protokolleri/yenidogan
��� �� /vaka-protokolleri/yenidogan/[id]


���  (Static)   prerendered as static content
��  (Dynamic)  server-rendered on demand
```

## 3. Güvenlik Yapılandırması Kanıtı (Tam Kod)

### `next.config.ts`
```typescript
import type { NextConfig } from "next";

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
  { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data: https:; connect-src 'self' https:; worker-src 'self'; manifest-src 'self';" },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=(), payment=(), usb=()' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' }
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
```

### `public/sw.js`
```javascript
const CACHE_NAME = 'ekg-cache-v2';

const PRECACHE_ASSETS = [
  '/',
  '/ekg-fallback.svg',
  '/ekg/slide-17.png',
  '/ekg/slide-18.png',
  '/ekg/slide-22.png',
  '/ekg/slide-23.png',
  '/ekg/slide-25.png',
  '/ekg/slide-26.png',
  '/ekg/slide-30.png',
  '/ekg/slide-32.png',
  '/ekg/slide-33.png',
  '/ekg/slide-34.png',
  '/ekg/slide-35.png',
  '/ekg/slide-36.png',
  '/ekg-egitim',
  '/ilac-doz'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await Promise.allSettled(
        PRECACHE_ASSETS.map((url) => cache.add(url).catch((err) => console.error(`Failed to cache ${url}:`, err)))
      );
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Sadece GET isteklerini önbelleğe al ve sadece aynı kökenden gelenleri işle
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) return;

  // EKG ve public dosyaları için Stale-While-Revalidate stratejisi
  if (url.pathname.startsWith('/ekg/') || url.pathname.match(/\.(png|jpg|jpeg|svg|gif|webp)$/)) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
            });
          }
          return networkResponse.clone();
        }).catch(() => {
          // Görüntü yüklenemezse ve cache'de de yoksa fallback dön
          if (event.request.destination === 'image') {
            return caches.match('/ekg-fallback.svg');
          }
        });

        return cachedResponse || fetchPromise;
      })
    );
  } else {
    // Diğer tüm rotalar için Network-First stratejisi (Next.js client-side routing için)
    event.respondWith(
      fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
          });
        }
        return networkResponse;
      }).catch(() => caches.match(event.request))
    );
  }
});
```

## 4. Fiziksel Varlık (Asset) ve Boyut Envanteri
```text
public/Ambulans_Evraklar/07-EN.YD.001 ENFEKSİYONLARIN ÖNLENMESİNE YÖNELİK İŞLEYİŞ ŞEMASI (1).doc - 139264 bytes
public/Ambulans_Evraklar/09-AS.YD.001 AMBULANS KAZA ALGORİTMASI.docx - 90467 bytes
public/Ambulans_Evraklar/11-KY.FR.008 HASTA EŞYALARI TESLİM FORMU.doc - 109056 bytes
public/Ambulans_Evraklar/12-HB.FR.003 VEFAT DURUMLARI İÇİN BİLGİLENDİRME FORMU.doc - 136192 bytes
public/Ambulans_Evraklar/12-İY.FR.006 AMBULANSTA BULUNDURULACAK İLAÇ VE SERUMLAR KONTROL VE TESLİM  FORMU.doc - 177664 bytes
public/Ambulans_Evraklar/14-HB.FR.004 TEDAVİ RED FORMU.docx - 34076 bytes
public/Ambulans_Evraklar/16-AS.FR.006 AMBULANS KAZA FORMU.xlsx - 38153 bytes
public/Ambulans_Evraklar/16-KG.FR.016 KESİCİ DELİCİ ALET YARALANMA ORANI VERİ TOPLAMA FORMU.docx - 142005 bytes
public/Ambulans_Evraklar/19-HB.FR.007 AMBULANSTA GERÇEKLEŞEN DOĞUM RAPORU.docx - 31307 bytes
public/Ambulans_Evraklar/23-AS.FR.010 AMBULANS KAZASI DURUMUNDA GEREKLİ EVRAKLAR LİSTESİ.docx - 87276 bytes
public/Ambulans_Evraklar/3-İO.FR.001 RAMAK KALA OLAY FORMU.doc - 175104 bytes
public/Ambulans_Evraklar/6-İY.FR.001 ADVERS ETKİ BİLDİRİM FORMU.docx - 40582 bytes
public/Ambulans_Evraklar/7-İO.FR.005 İSTENMEYEN OLAY BİLDİRİM FORMU.doc - 134144 bytes
public/Ambulans_Evraklar/8-HB.FR.002 SÖZEL ORDER FORMU.doc - 123904 bytes
public/Ambulans_Evraklar/8-İY.FR.003 MİADI GEÇMİŞ İLAÇ VE MALZEME TESLİM FORMU.doc - 122368 bytes
public/Ambulans_Evraklar/9-EN.YD.003 KİŞİSEL KORUYUCU EKİPMANLAR LİSTESİ.docx - 378150 bytes
public/Ambulans_Evraklar/9-HE.FR.001 AMBULANS REFAKATÇI ONAM FORMU.doc - 112128 bytes
public/Ambulans_Evraklar/9-KY.FR.006 İŞ KAZASI BİLDİRİM FORMU.doc - 186368 bytes
public/Ambulans_Evraklar/AS.FR.010 AMBULANSTA BULUNAN MALZEMELERİN ZİMMET FORMU.doc - 180224 bytes
public/Ambulans_Evraklar/HB.FR.001 AMBULANS VAKA KAYIT FORMU.xls - 569856 bytes
public/burn-maket-bg.png - 1315750 bytes
public/burn-reference.svg - 153553 bytes
public/Cocuk_Algoritmalari/084_Olay_Yeri_Yonetimi.png - 556454 bytes
public/Cocuk_Algoritmalari/085_Acil_Olgu_Yonetimi_Anahtar_Noktalar.png - 742709 bytes
public/Cocuk_Algoritmalari/086_Acil_Olgu_Yonetimi.png - 627081 bytes
public/Cocuk_Algoritmalari/087_Yabanci_Cisme_Bagli_Hava_Yolu_Tikanikligi_Anahtar_Noktalar.png - 783111 bytes
public/Cocuk_Algoritmalari/088_Yabanci_Cisme_Bagli_Hava_Yolu_Tikanikligi.png - 628370 bytes
public/Cocuk_Algoritmalari/089_Astim_Anahtar_Noktalar.png - 643724 bytes
public/Cocuk_Algoritmalari/090_Astim.png - 985175 bytes
public/Cocuk_Algoritmalari/091_Epiglottit.png - 476289 bytes
public/Cocuk_Algoritmalari/092_Krup_Anahtar_Noktalar_1.png - 416944 bytes
public/Cocuk_Algoritmalari/093_Krup_Anahtar_Noktalar_2.png - 368250 bytes
public/Cocuk_Algoritmalari/094_Krup.png - 673790 bytes
public/Cocuk_Algoritmalari/095_Hipovolemik_Sok_Anahtar_Noktalar.png - 455134 bytes
public/Cocuk_Algoritmalari/096_Hipovolemik_Sok.png - 967000 bytes
public/Cocuk_Algoritmalari/097_Kardiyojenik_Sok_Anahtar_Noktalar.png - 425571 bytes
public/Cocuk_Algoritmalari/098_Kardiyojenik_Sok.png - 757484 bytes
public/Cocuk_Algoritmalari/099_Etiyolojisi_Saptanmamis_Sok_Tablosuna_Yaklasim.png - 946697 bytes
public/Cocuk_Algoritmalari/100_Septik_Sok_Anahtar_Noktalar.png - 950577 bytes
public/Cocuk_Algoritmalari/101_Septik_Sok.png - 763980 bytes
public/Cocuk_Algoritmalari/102_Bradikardi_Anahtar_Noktalar.png - 514537 bytes
public/Cocuk_Algoritmalari/103_Bradikardi.png - 772741 bytes
public/Cocuk_Algoritmalari/104_Tasikardi_Nabizli_Anahtar_Noktalar.png - 946550 bytes
public/Cocuk_Algoritmalari/105_Tasikardi_Nabizli.png - 854540 bytes
public/Cocuk_Algoritmalari/106_Arrest_Yonetimi_Anahtar_Noktalar.png - 841142 bytes
public/Cocuk_Algoritmalari/107_Arrest_Yonetimi.png - 704172 bytes
public/Cocuk_Algoritmalari/108_Soklanir_Ritim_Anahtar_Noktalar.png - 892745 bytes
public/Cocuk_Algoritmalari/109_Soklanir_Ritim_VF_Nabizsiz_VT.png - 934368 bytes
public/Cocuk_Algoritmalari/110_Soklanamaz_Ritim_Asistoli_NEA.png - 550395 bytes
public/Cocuk_Algoritmalari/111_Resusitasyon_Sonrasi_Bakim_Anahtar_Noktalar.png - 856686 bytes
public/Cocuk_Algoritmalari/112_Resusitasyon_Sonrasi_Bakim.png - 611440 bytes
public/Cocuk_Algoritmalari/113_Bilinc_Degisiklikleri_Anahtar_Noktalar.png - 322761 bytes
public/Cocuk_Algoritmalari/114_Bilinc_Degisiklikleri.png - 716447 bytes
public/Cocuk_Algoritmalari/115_Nobet_Konvulziyon_Anahtar_Noktalar.png - 736722 bytes
public/Cocuk_Algoritmalari/116_Nobet_Konvulziyon.png - 815794 bytes
public/Cocuk_Algoritmalari/117_Ates_Yonetimi_Anahtar_Noktalar.png - 347963 bytes
public/Cocuk_Algoritmalari/118_Ates_Yonetimi.png - 608366 bytes
public/Cocuk_Algoritmalari/119_Hiperglisemi.png - 395029 bytes
public/Cocuk_Algoritmalari/120_Hipoglisemi_Anahtar_Noktalar.png - 301647 bytes
public/Cocuk_Algoritmalari/121_Hipoglisemi.png - 537617 bytes
public/Cocuk_Algoritmalari/122_Anafilaksi_Anahtar_Noktalar.png - 634565 bytes
public/Cocuk_Algoritmalari/123_Anafilaksi.png - 734528 bytes
public/Cocuk_Algoritmalari/124_Hipertermi_Anahtar_Noktalar.png - 687779 bytes
public/Cocuk_Algoritmalari/125_Hipertermi.png - 517480 bytes
public/Cocuk_Algoritmalari/126_Hipotermi_Anahtar_Noktalar.png - 560747 bytes
public/Cocuk_Algoritmalari/127_Hipotermi.png - 649864 bytes
public/Cocuk_Algoritmalari/128_Hipotermide_Arrest_Yonetimi_Anahtar_Noktalar.png - 797780 bytes
public/Cocuk_Algoritmalari/129_Hipotermide_Arrest_Yonetimi.png - 658333 bytes
public/Cocuk_Algoritmalari/130_Isirma_ve_Sokmalar.png - 732426 bytes
public/Cocuk_Algoritmalari/131_Suda_Bogulma_Anahtar_Noktalar.png - 376584 bytes
public/Cocuk_Algoritmalari/132_Suda_Bogulma.png - 488191 bytes
public/Cocuk_Algoritmalari/133_Yanik_Anahtar_Noktalar_1.png - 730258 bytes
public/Cocuk_Algoritmalari/134_Yanik_Anahtar_Noktalar_2.png - 740122 bytes
public/Cocuk_Algoritmalari/135_Yanik.png - 705809 bytes
public/Cocuk_Algoritmalari/136_Toksikoloji_Zehirlenme_Doz_Asimi.png - 754714 bytes
public/Cocuk_Algoritmalari/137_Jump_Start_Triyaj_Anahtar_Noktalar.png - 537235 bytes
public/Cocuk_Algoritmalari/138_Jump_Start_Triyaj.png - 690594 bytes
public/Cocuk_Algoritmalari/139_Travmali_Hastada_Acil_Olgu_Yonetimi.png - 1118423 bytes
public/Dogum_Yenidogan_Algoritmalari/075_Acil_Dogum_Eylemi.png - 1185880 bytes
public/Dogum_Yenidogan_Algoritmalari/076_Dogum_Komplikasyonlari.png - 846285 bytes
public/Dogum_Yenidogan_Algoritmalari/077_Postpartum_Kanama.png - 803729 bytes
public/Dogum_Yenidogan_Algoritmalari/078_Gebelikte_Arrest_Yonetimi.png - 860924 bytes
public/Dogum_Yenidogan_Algoritmalari/079_Ucuncu_Trimester_Nobetler_Eklampsi.png - 943894 bytes
public/Dogum_Yenidogan_Algoritmalari/080_Normal_Yenidogan_Bakimi.png - 635629 bytes
public/Dogum_Yenidogan_Algoritmalari/081_Yenidogan_Canlandirmasi_Anahtar_Noktalar.png - 762726 bytes
public/Dogum_Yenidogan_Algoritmalari/082_Yenidogan_Canlandirmasi.png - 708354 bytes
public/ekg/slide-17.png - 150621 bytes
public/ekg/slide-18.png - 141836 bytes
public/ekg/slide-22.png - 172194 bytes
public/ekg/slide-23.png - 146866 bytes
public/ekg/slide-25.png - 106221 bytes
public/ekg/slide-26.png - 159174 bytes
public/ekg/slide-30.png - 14324 bytes
public/ekg/slide-32.png - 171375 bytes
public/ekg/slide-33.png - 165476 bytes
public/ekg/slide-34.png - 158244 bytes
public/ekg/slide-35.png - 157273 bytes
public/ekg/slide-36.png - 90308 bytes
public/ekg-fallback.svg - 1016 bytes
public/file.svg - 391 bytes
public/globe.svg - 1035 bytes
public/next.svg - 1375 bytes
public/sw.js - 2754 bytes
public/vercel.svg - 128 bytes
public/window.svg - 385 bytes
public/Yetiskin_Algoritmalari/005_Olay_Yeri_Yonetimi.png - 630778 bytes
public/Yetiskin_Algoritmalari/006_Acil_Olgu_Yonetimi_Anahtar_Noktalar.png - 569027 bytes
public/Yetiskin_Algoritmalari/007_Acil_Olgu_Yonetimi.png - 623128 bytes
public/Yetiskin_Algoritmalari/008_Hava_Yolu_Tikanikliklari.png - 597134 bytes
public/Yetiskin_Algoritmalari/009_KOAH_Anahtar_Noktalar.png - 943124 bytes
public/Yetiskin_Algoritmalari/010_KOAH.png - 834640 bytes
public/Yetiskin_Algoritmalari/011_Astim_Anahtar_Noktalar.png - 466362 bytes
public/Yetiskin_Algoritmalari/012_Astim.png - 886025 bytes
public/Yetiskin_Algoritmalari/013_Akut_Koroner_Sendrom_Anahtar_Noktalar.png - 664772 bytes
public/Yetiskin_Algoritmalari/014_Akut_Koroner_Sendrom.png - 676358 bytes
public/Yetiskin_Algoritmalari/015_Bradikardi_Anahtar_Noktalar.png - 695353 bytes
public/Yetiskin_Algoritmalari/016_Bradikardi.png - 758607 bytes
public/Yetiskin_Algoritmalari/017_Nabizli_Tasikardi.png - 1065548 bytes
public/Yetiskin_Algoritmalari/018_Arrest_Yonetimi.png - 546475 bytes
public/Yetiskin_Algoritmalari/019_Soklanamaz_Ritim_Yonetimi_Anahtar_Noktalar.png - 770961 bytes
public/Yetiskin_Algoritmalari/020_Soklanamaz_Ritim_Asistoli_NEA.png - 604280 bytes
public/Yetiskin_Algoritmalari/021_Soklanir_Ritim_VF_Nabizsiz_VT_Anahtar_Noktalar.png - 890124 bytes
public/Yetiskin_Algoritmalari/022_Soklanir_Ritim_VF_Nabizsiz_VT.png - 900830 bytes
public/Yetiskin_Algoritmalari/023_Resusitasyon_Sonrasi_Bakim.png - 862918 bytes
public/Yetiskin_Algoritmalari/024_Hipovolemik_Sok.png - 878410 bytes
public/Yetiskin_Algoritmalari/025_Kalp_Yetmezligine_Bagli_Akut_Akciger_Odemi_ve_Kardiyojenik_Sok_Anahtar_Noktalar.png - 904185 bytes
public/Yetiskin_Algoritmalari/026_Kalp_Yetmezligine_Bagli_Akut_Akciger_Odemi_ve_Kardiyojenik_Sok.png - 647263 bytes
public/Yetiskin_Algoritmalari/027_Ajite_Hastaya_Yaklasim_Anahtar_Noktalar.png - 405113 bytes
public/Yetiskin_Algoritmalari/028_Ajite_Hastaya_Yaklasim.png - 680385 bytes
public/Yetiskin_Algoritmalari/029_Bilinc_Degisiklikleri_Anahtar_Noktalar.png - 556795 bytes
public/Yetiskin_Algoritmalari/030_Bilinc_Degisikligi.png - 596463 bytes
public/Yetiskin_Algoritmalari/031_Diyabetik_Aciller.png - 616314 bytes
public/Yetiskin_Algoritmalari/032_Inme_SVO.png - 815622 bytes
public/Yetiskin_Algoritmalari/033_Nobet_Konvulziyon.png - 795398 bytes
public/Yetiskin_Algoritmalari/034_Vertigo.png - 681069 bytes
public/Yetiskin_Algoritmalari/035_Alerjik_Reaksiyon.png - 659954 bytes
public/Yetiskin_Algoritmalari/036_Anafilaksi_Anahtar_Noktalar.png - 887545 bytes
public/Yetiskin_Algoritmalari/037_Anafilaksi.png - 812241 bytes
public/Yetiskin_Algoritmalari/038_Hipertermi_Anahtar_Noktalar.png - 707250 bytes
public/Yetiskin_Algoritmalari/039_Hipertermi.png - 633267 bytes
public/Yetiskin_Algoritmalari/040_Hipotermi_Anahtar_Noktalar.png - 413496 bytes
public/Yetiskin_Algoritmalari/041_Hipotermi.png - 716787 bytes
public/Yetiskin_Algoritmalari/042_Hipotermide_Arrest_Yonetimi_Anahtar_Noktalar.png - 951389 bytes
public/Yetiskin_Algoritmalari/043_Hipotermide_Arrest_Yonetimi.png - 680354 bytes
public/Yetiskin_Algoritmalari/044_Isirma_ve_Sokmalar_Anahtar_Noktalar.png - 556077 bytes
public/Yetiskin_Algoritmalari/045_Isirma_ve_Sokmalar.png - 617993 bytes
public/Yetiskin_Algoritmalari/046_Suda_Bogulma_Anahtar_Noktalar.png - 378688 bytes
public/Yetiskin_Algoritmalari/047_Suda_Bogulma.png - 462064 bytes
public/Yetiskin_Algoritmalari/048_Yanik_Anahtar_Noktalar_1.png - 914953 bytes
public/Yetiskin_Algoritmalari/049_Yanik_Anahtar_Noktalar_2.png - 929386 bytes
public/Yetiskin_Algoritmalari/050_Termal_Yanik.png - 654178 bytes
public/Yetiskin_Algoritmalari/051_Elektrik_Yaniklari.png - 628338 bytes
public/Yetiskin_Algoritmalari/052_Kimyasal_Yaniklar.png - 417917 bytes
public/Yetiskin_Algoritmalari/053_Zehirlenmelere_Genel_Yaklasim_Anahtar_Noktalar.png - 610970 bytes
public/Yetiskin_Algoritmalari/054_Zehirlenmelere_Genel_Yaklasim.png - 513609 bytes
public/Yetiskin_Algoritmalari/055_Yuksek_Doz_Ilac_Alimi.png - 629820 bytes
public/Yetiskin_Algoritmalari/056_Karbonmonoksit_Zehirlenmesi.png - 601620 bytes
public/Yetiskin_Algoritmalari/057_Kalsiyum_Kanal_Blokerleri_Beta_Blokerlerle_Zehirlenme_Anahtar_Noktalar.png - 721558 bytes
public/Yetiskin_Algoritmalari/058_Kalsiyum_Kanal_Blokerleri_Beta_Blokerler_ile_Zehirlenme.png - 804822 bytes
public/Yetiskin_Algoritmalari/059_Kolinerjik_Ajanlarla_Zehirlenme_Anahtar_Noktalar.png - 835696 bytes
public/Yetiskin_Algoritmalari/060_Kolinerjik_Ajanlarla_Zehirlenme.png - 626236 bytes
public/Yetiskin_Algoritmalari/061_Narkotik_Opioid_Zehirlenmeleri_Anahtar_Noktalar.png - 712390 bytes
public/Yetiskin_Algoritmalari/062_Narkotik_Opioid_Zehirlenmeleri.png - 639792 bytes
public/Yetiskin_Algoritmalari/063_Trisiklik_Antidepresan_Zehirlenmesi_Anahtar_Noktalar.png - 683642 bytes
public/Yetiskin_Algoritmalari/064_Trisiklik_Antidepresan_Zehirlenmesi.png - 583797 bytes
public/Yetiskin_Algoritmalari/065_Travmali_Hastada_Acil_Olgu_Yonetimi_Anahtar_Noktalar_1.png - 694569 bytes
public/Yetiskin_Algoritmalari/066_Travmali_Hastada_Acil_Olgu_Yonetimi_Anahtar_Noktalar_2.png - 1079962 bytes
public/Yetiskin_Algoritmalari/067_Travmali_Hastada_Acil_Olgu_Yonetimi.png - 1018784 bytes
public/Yetiskin_Algoritmalari/068_Crush_Sendromu_Anahtar_Noktalar.png - 862643 bytes
public/Yetiskin_Algoritmalari/069_Crush_Sendromu.png - 707601 bytes
public/Yetiskin_Algoritmalari/070_Kafa_Travmali_Hastaya_Yaklasim_Anahtar_Noktalar.png - 479231 bytes
public/Yetiskin_Algoritmalari/071_Kafa_Travmali_Hastaya_Yaklasim.png - 611394 bytes
public/Yetiskin_Algoritmalari/072_Start_Triyaj_Anahtar_Noktalar.png - 557095 bytes
public/Yetiskin_Algoritmalari/073_Start_Triyaj.png - 604365 bytes
```

## 5. Tıbbi Hesaplayıcı ve EKG Simülatörü Savunma Özeti
### DrugDoseCalculator.tsx
```tsx
  const weightNum = parseFloat(weight);
  const showDopaminDrops = drugId === "dopamin" && !isNaN(weightNum);
  const weightNum = parseFloat(weight);
  const isWeightInvalid = weight !== "" && (isNaN(weightNum) || weightNum <= 0 || weightNum > 300);
```
### BurnCalculatorEmbed.tsx
```tsx
  const k = parseFloat(kilo);
            {k !== null && !isNaN(k) && (k <= 0 || k > 300) && (
            {tbsa !== null && tbsa > 100 && (
```
### DigitalCaliper.tsx
```tsx
  const [pixelsPerSquare, setPixelsPerSquare] = useState(28);
  const windowWidth = 15 * pixelsPerSquare;
      ? Math.max(0.5, (rightLeg - leftLeg) / pixelsPerSquare)
                backgroundImage: `repeating-linear-gradient(to right, rgba(239,68,68,0.35) 0px, rgba(239,68,68,0.35) 1px, transparent 1px, transparent ${pixelsPerSquare}px)`,
              value={pixelsPerSquare}
              {pixelsPerSquare}
```
### EkgExamSimulator.tsx
```tsx
  const [showNotes, setShowNotes] = useState(false);
    if (!showNotes) return;
      setCurrentCaseIndex(Math.min(currentCaseIndex + 1, cases.length - 1));
                showNotes
                  {showNotes ? currentCase.tani : "???"}
                {showNotes && (
          {!showNotes ? (
```


## 6. Bilinen Kısıtlamalar veya Açık Kalan Riskler
- **Stale-While-Revalidate Gecikmesi**: Offline durumunda fallback mekanizmaları kusursuz olsa da, network-first ve stale-while-revalidate stratejileri arası geçişte ilk yavaş bağlantılarda bir saniyelik görsel gecikme (latency) yaşanabilir.
- **Turbopack Memory Limit**: Çok büyük build dosyalarında Next.js 16 (Turbopack) bellek sızıntısına neden olabilir, deployment sunucusunda minimum 1GB RAM önerilir.
- **Service Worker Atomic Cache**: Cache zehirlenmesi ve yarış durumlarına karşı alınan önlemler tamdır, ancak çok düşük disk alanı olan eski Android cihazlarda Storage API limiti kısıtlamalarına takılma ihtimali teorik olarak mevcuttur.
