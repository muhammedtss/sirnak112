# UI Denetim Raporu — Faz 1

> Tarih: 2026-10-06 · Branch: `ui-upgrade` · Kod değişikliği yapılmadı.
> Kapsam: ana sayfa (tam), `/ilac-doz`, `/skalalar`, `/algoritmalar-gorsel` (detay incelemesi) ve tüm `src/` (kod taraması).
> Yöntem: `impeccable audit` (kod taraması + kontrast hesabı), `impeccable critique` (iki bağımsız değerlendirme: tasarım incelemesi + otomatik dedektör/tarayıcı), `make-interfaces-feel-better full`.
> Canlı inceleme: 375px, 760px, 1280px; koyu ve açık tema.

---

## 1. Özet puanlar

### Teknik denetim (impeccable audit)

| # | Boyut | Puan | Ana bulgu |
|---|---|---|---|
| 1 | Erişilebilirlik | 1/4 | Görünür odak durumu yok (tüm uygulamada 1 yer), pinch-zoom kapalı, alt navigasyon etiketsiz, `--fg-subtle` 2,5:1 |
| 2 | Performans | 2/4 | 3 sonsuz bulanık arka plan animasyonu, 87 `transition-all`, ana sayfada giriş animasyonu |
| 3 | Responsive | 2/4 | Başlık butonları 36–40px, masaüstünde ızgara sınırsız genişliyor, ICD-10/EKG kartları farklı genişlikte |
| 4 | Tema | 2/4 | Arama penceresi yalnızca açık renkli; açık temada teal ve "Canlı" rozeti okunmuyor |
| 5 | Uygulama bütünlüğü | 2/4 | Dedektör: 9 uyarı + 197 öneri; jenerik "AI dashboard" kalıpları (mor küreler, nabız noktası, glow) |
| | **Toplam** | **9/20** | **Zayıf — ciddi iyileştirme gerekli** |

### UX değerlendirmesi (Nielsen sezgiselleri, ana sayfa)

**21/40 — Kabul edilebilir.** En düşükler: kullanıcı kontrolü (2), tutarlılık (2), hata önleme (2), hatırlama yerine tanıma (2), verimlilik (2). Bilişsel yük: kontrol listesinin 4/8 maddesi başarısız (yüksek). Ana sayfada 17 dokunma hedefi var, 5'i tekrar.

---

## 2. plan.md S1–S10 doğrulaması

| # | Plan tespiti | Sonuç | Kanıt | Faz |
|---|---|---|---|---|
| S1 | Sticky header şeffaf, kartlar altından geçiyor | **Belirti doğru, teşhis farklı.** Arka plan tamamen şeffaf değil; `linear-gradient(var(--bg) 60%, transparent)`, `backdrop-filter` yok. 133px'lik başlığın alt %40'ı şeffaflaşıyor; "Sistemi" ve "Developed by" satırı tam bu bölgede, kaydırınca kartlarla üst üste biniyor (iki temada doğrulandı). | `src/app/page.tsx:52` | 3.1 |
| S2 | `prefers-reduced-motion` yok | **Doğrulandı.** `src` içinde hiçbir reduced-motion desteği yok. | — | 2 |
| S3 | Filigran ve chevron çakışıyor | **Doğrulandı.** Filigran `-right-4 -bottom-4` 80px, chevron 14px sağ altta `opacity-30` (≈2,5:1). | `page.tsx:126, 148-151` | 3.3 |
| S4 | ~760px'te ICD-10/EKG kartları ızgaradan çıkıyor | **Doğrulandı, ama her genişlikte ve kod gereği:** `col-span-2` + `w-[65%]`. 375px: normal kart 166px, ICD/EKG 223px. 1280px'te ızgaranın üst sınırı yok, kartlar ~600px. | `page.tsx:117-122` | 3.3 |
| S5 | Düşük kontrast | **Kısmen.** `--fg-muted` AA'yı geçiyor (koyu 5,82, açık 4,54 — sınırda). **`--fg-subtle` geçemiyor** (2,50 / 2,31). "Developed by" 2,0 / 1,91. Ek: pasif nav ikonları 2,5:1, koyu temada arama ikonu 2,58:1, açık temada teal vurgu 2,27:1, "Canlı" rozeti 1,43:1. Asıl okunabilirlik sorunlarından biri 10px kart açıklamaları. | `globals.css:11-12, 31-32`; `BottomNav.tsx`; `GlobalSearchModal.tsx:187` | 2 |
| S6 | Hero CTA ilk kartla aynı yere gidiyor | **Doğrulandı.** İkisi de `/algoritmalar-gorsel`. | `page.tsx:37, 99-105` | 3.2 (sor) |
| S7 | `transition: all 0.5s` | **Doğrulandı ve yaygın:** 23 dosyada 87 `transition-all`; filigranda `transition-all duration-500`. | `page.tsx:126` ve diğerleri | 2 |
| S8 | Genel `ease`, basma geri bildirimi yok | **Kısmen.** Kartlarda `scale(0.97)` var. Nav linklerinde yok; tema/çevrimdışı butonlarında `scale-90` (aşırı). Her yerde genel `ease`. | `globals.css:86,104,106` | 2 + 3 |
| S9 | Hero'da mor/indigo ışık | **Doğrulandı ve daha geniş:** tüm uygulamanın arka planı indigo/mor küreler (`Background.tsx`), hero kenarı ve küresi de indigo. | `page.tsx:79, 82-88`; `Background.tsx:12-41` | 3.2 |
| S10 | "Canlı" rozeti kırmızı | **Doğrulandı.** Ek: içerik statik ve çevrimdışı, "Canlı" anlamsal olarak da yanıltıcı; açık temada okunmuyor (1,43:1). | `page.tsx:91-93` | 3.2 (sor) |

---

## 3. Yeni bulgular (plan dışında)

### P0 — Engelleyici
Yok.

### P1 — Büyük (WCAG ihlali ya da sahada ciddi zorluk)

| # | Bulgu | Konum | Öneri | Faz |
|---|---|---|---|---|
| Y1 | **Ana sayfa kartları ilk karede görünmüyor.** Stagger + spring + blur giriş animasyonu; SSR HTML'de 10 adet `opacity:0`. Hareket bütçesindeki "ilk karede tıklanabilir" kuralını ihlal ediyor. | `page.tsx:22-34, 74-78, 109-119` | Izgara ve hero giriş animasyonunu tamamen kaldır. | 2 |
| Y2 | **Görünür klavye odağı yok.** `:focus-visible` tüm uygulamada yalnızca yanık haritasında var. | genel | Global teal odak halkası (`:focus-visible`). | 2 |
| Y3 | **Pinch-zoom kapalı** (`maximumScale: 1, userScalable: false`). Güneş altında ve presbiyopide büyütme yapılamıyor (WCAG 1.4.4). | `src/app/layout.tsx:36-38` | `maximumScale` ve `userScalable` kaldırılsın. *(Karar gerekli, bkz. §6)* | 2 |
| Y4 | **Alt navigasyon etiketsiz.** Yalnızca ikon; görünür metin, `aria-label` ve `aria-current` yok. | `BottomNav.tsx` | `aria-label` + `aria-current="page"`; pasif ikon rengi ≥3:1. | 3.4 |
| Y5 | **Arama Türkçe harflerde sahte negatif veriyor.** `toLowerCase()` yüzünden "inme" aranınca "İnme / SVO" bulunmuyor; "ısırma" da 0 sonuç. Kritik anda güveni sarsar. | `GlobalSearchModal.tsx:155,159` | `toLocaleLowerCase('tr')` + ı/i, İ/I normalizasyonu. (Klinik veri değil, arama mantığı.) | 3.5 |
| Y6 | **Arama penceresi koyu temayı yok sayıyor:** sabit `bg-white`/slate; gece kabininde göz kamaştırıyor. Arka plana dokununca kapanmıyor. Başlığın stacking context'inde kaldığı için alt nav üstte ve tıklanabilir (test sırasında arka plana dokunmak sayfa değiştirdi). | `GlobalSearchModal.tsx:187, 208, 210` | Cam dile ve temaya uyarla; portal ile `body`'ye taşı; arka plan tıkla-kapat; otomatik odak ve ok tuşları. | 3.5 |
| Y7 | **Dokunma hedefleri < 44px:** geri butonu 36px, çevrimdışı ve tema 36px, arama 40px. | `AppHeader.tsx:39`, `OfflineButton.tsx:192`, `ThemeToggle.tsx:36`, `GlobalSearchModal.tsx:187` | 44×44 hedef (görsel boyut aynı kalabilir, hit-area genişletilir). | 3.1 |
| Y8 | **Arama kapsamı dar:** yalnızca algoritmalar ve ilaçlar indekslenmiş; Skalalar, ICD-10, EKG, Envanter, Evraklar, Vaka Protokolleri yok ("gks" → 0 sonuç). Sonuçlar eski `/algoritmalar` rotasına gidiyor. | `GlobalSearchModal.tsx` | İndeksi genişlet. *(Karar gerekli, bkz. §6 — kapsam genişlemesi)* | 3.5 |

### P2 — Küçük

| # | Bulgu | Konum | Öneri | Faz |
|---|---|---|---|---|
| Y9 | **Sonsuz arka plan animasyonları:** 3 bulanık küre 7–12 sn döngüde sürekli hareket ediyor. Bütçedeki "yalnızca Canlı noktası ve spin" kuralını ihlal ediyor; çevre görüşte dikkat dağıtıyor, pil tüketiyor. | `Background.tsx:12-41` | Küreleri statik yap, renklerini teal ailesine çek (S9 ile birlikte). | 2 / 3.2 |
| Y10 | **Skalalarda hesaplayıcıya ulaşmak 2 dokunuş:** önce akordeon açılıyor, sonra "Hesaplamayı Aç". Akordeon ayrıca `height` animasyonu kullanıyor (bütçe ihlali). | `src/app/skalalar/page.tsx:136-200` | Kart doğrudan hesaplayıcıyı açsın, açıklama kartta kısa satır olarak dursun. *(IA değişikliği — Faz 4'te sorulacak)* | 4 |
| Y11 | **10px metin:** kart açıklamaları ve ~60 yerde `text-[10px]`; DESIGN.md'deki 11px taban ile çelişiyor (DESIGN.md'nin kendisi de kart açıklamasını 10px tarif ediyor — düzeltilecek). | `page.tsx:146` ve 58 yer | Tip ölçeğinde en küçük boyut 12px. | 2 |
| Y12 | **Tema geçişi 300ms** (`body` transition), bütçenin üstünde; genel `ease`. | `globals.css:67` | Süre/easing token'ları. | 2 |
| Y13 | **Global `user-select: none`:** ICD-10 kodları ve doz metinleri kopyalanamıyor. | `globals.css:66` | Yalnızca etkileşimli öğelerde kapat; içerik metni seçilebilir olsun. *(Karar gerekli)* | 2 |
| Y14 | **Tema butonu aria-label İngilizce** ("Toggle Theme"); koyu temada güneş ikonu gösteriyor (eylem mi durum mu belirsiz). | `ThemeToggle.tsx:37` | Türkçe etiket; ikon geçişi (Faz 3.6). | 3.6 |
| Y15 | **İlaç Dozu:** adım göstergesinde "2", "3", "4" 1,2:1 kontrast; placeholder 2,5:1. Sonuç sayılarında `tabular-nums` yok. | `DrugDoseCalculator.tsx:39, 238, 394` | Pasif adımlar ≥3:1; `tabular-nums`. | 4 |
| Y16 | **Masaüstünde içerik sınırsız genişliyor:** 1280px'te kartlar ~600px. | `page.tsx` ızgara | Ana sayfa kapsayıcısına max-width + 4 sütun. | 3.3 |
| Y17 | **Açık tema override'ları `!important` ile sabit beyaz sınıfları eziyor** (14 kural). Kırılgan; yeni bileşenlerde unutuluyor. | `globals.css:111-124` | Token'lara geçiş (kademeli, Faz 4'te dokunulan sayfalarda). | 4 |

### P3 — Cila

| # | Bulgu | Konum | Öneri | Faz |
|---|---|---|---|---|
| Y18 | `text-wrap: balance/pretty` hiçbir yerde yok. | genel | Başlık/paragraf kuralları. | 2 |
| Y19 | Kart içi ikon kutusu (`rounded-2xl` = 16px, padding 16px) dış kart (28px) ile eşmerkezli değil: 16 + 16 = 32 olmalı ya da iç 12px. | `page.tsx:129` | Concentric radius. | 2 |
| Y20 | Bazı kartlarda `rounded-2xl` sınıfı `glass-card`'ın 1.75rem'iyle çakışıyor (hangisinin kazandığı katman sırasına bağlı); niyet belirsiz. | `DrugDoseCalculator.tsx:216,272,296` | Tek radius kaynağı. | 2 |
| Y21 | Algoritma görsellerinde 1px görsel çerçevesi (outline) yok. | `algoritmalar-gorsel/[kategori]/page.tsx:130,242` | `outline: 1px solid oklch(1 0 0 / .1)` (koyu) / `oklch(0 0 0 / .1)` (açık). | 4 |
| Y22 | `/skalalar/pat` kutusunda `from-indigo-600 to-purple-700` degrade (AI paleti). | `skalalar/pat/page.tsx:231` | Modül rengine çek. | 4 |

---

## 4. make-interfaces-feel-better (full) — özet

| Kategori | İncelenen | Sonuç |
|---|---|---|
| Tipografi | globals.css, ana sayfa, ilac-doz, skalalar | 3 bulgu (Y11, Y15 tabular-nums, Y18) |
| Yüzeyler | kart, ikon kutusu, header, arama, nav | 4 bulgu (S3, Y7, Y19, Y20) + Y21 |
| Animasyon | page.tsx, Background, skalalar akordeon, globals | 5 bulgu (Y1, S7, S8, Y9, Y10) |
| İkonlar | BottomNav, ThemeToggle, kart ikonları | 2 bulgu (Y4 pasif ikon kontrastı, Y14); stroke ağırlıkları tutarlı (lucide, 1.8/2.5) |
| Performans | transition-all, sonsuz animasyonlar, blur | 2 bulgu (S7, Y9) |

**Verdict: Block** (HIGH: Y1, Y2, Y5, Y6, Y7 ve S5'in `--fg-subtle` kısmı).
Basma ölçeği notu: skill 0.96 öneriyor, plan 0.97 diyor — **plan değeri (0.97) korunacak.**

**Değerlendirilip reddedilenler:**
| Konum | Aday | Reddedilme sebebi |
|---|---|---|
| cam kartlar | Kenarlıkları tamamen gölgeye çevirmek | Kenar cam dilinin yapısal parçası (DESIGN.md "Glass Not Paper"); yalnızca derinlik amaçlı olanlar değerlendirilecek |
| filigran ikon kırpılması | "clipped-overflow" dedektör uyarısı | Bilinçli tasarım, dokunulmaz listede |
| "Şırnak 112 Acil Sağlık" üst satırı | "kicker-above-heading" uyarısı | Metin ve yapı korunacak |

---

## 5. Dedektör sonuçları (otomatik)

- **CLI** (`src/app`, `src/components`): 9 uyarı, 197 öneri.
  - `gray-on-color` ×8 (EKG sayfaları, amber/zümrüt zemin üzerinde koyu yazı) → **yanlış pozitif** (≈8–10:1 kontrast).
  - `ai-color-palette` ×1 → `skalalar/pat/page.tsx:231` (Y22).
  - `design-system-color` ×133 → çoğu gürültü (cam rgba değerleri, modül renkleri DESIGN.md'de metin olarak var ama token değil). Gerçek sapma: sayfalarda tekrar eden sabit modül rgba'ları ve ICD-10 kategori paleti.
  - `design-system-font-size` ×63 → `text-[10px]` (Y11).
- **Render taraması** (headless): `/` 20 bulgu (radial-spotlight-glow ×3, dark-glow ×2, 10–11px metin ×10, pulsing-dot, düşük kontrast "Developed by"), `/ilac-doz` 9, `/skalalar` 4, `/algoritmalar-gorsel/yetiskin` 6.
- **Tarayıcı overlay'i çalışmadı:** sitenin kendi CSP kuralı (`script-src 'self'`) dış betiği engelledi; yerine CLI ile render taraması kullanıldı. (Bu bir güvenlik özelliği, sorun değil.)

---

## 6. Karar gerektiren konular

| # | Konu | Seçenekler | Öneri |
|---|---|---|---|
| K1 | **S10 "Canlı" rozeti** | (a) teal, (b) success yeşili, (c) metni ve anlamı değiştir ("Çevrimdışı hazır" gibi gerçek durum) — metin değişikliği dokunulmaz listeye takılır | (a) teal, nokta animasyonu reduced-motion'da durur |
| K2 | **S6 Hero CTA** | (a) hızlı aramaya bağla ("Protokol ara…"), (b) son kullanılan araç, (c) olduğu gibi | (a): arama en hızlı yol; hero ekranın en değerli alanı |
| K3 | **Y3 pinch-zoom** | Aç / kapalı kalsın | Aç (WCAG 1.4.4; güneş altı) |
| K4 | **Y8 aramanın kapsamı** | Tüm modülleri indeksle / yalnızca mevcut | Tümü (Faz 3.5) |
| K5 | **Y10 skalalarda tek dokunuşla erişim** | Kart doğrudan hesaplayıcıyı açsın / akordeon kalsın | Doğrudan aç |
| K6 | **Y13 metin seçimi** | İçerikte seçime izin ver / global kapalı kalsın | İçerikte izin ver (kodları kopyalamak için) |

---

## 7. Uygulanmayacaklar (dokunulmaz listeyi ihlal eder)

| Öneri (kaynak) | Neden uygulanmıyor |
|---|---|
| Kartları "saha araçları" ve "idari/eğitim" olarak grupla veya yeniden sırala (critique) | 8 modülün sırası ve bilgi mimarisi dokunulmaz |
| Alt nav etiketlerini kart adlarıyla eşitle ("Protokoller" → "Vaka Protokolleri") (critique) | Metinler değişmez — yalnızca öneri olarak not edildi |
| Arka plan nokta ızgarasını ve cam dili kaldır (dedektör: radial-glow, dark-glow) | Kart dili ve kimlik korunur; yalnızca renk ve hareket düzenlenecek |
| Hero sloganını değiştir / kaldır (critique) | Metinler değişmez; yalnızca hiyerarşi ve CTA bağlantısı (K2) |
| "Developed by" satırını kaldır (critique) | Metin korunur; yalnızca kontrastı düzeltilecek |
| Font değişikliği | Outfit sabit |

---

## 8. Olumlu bulgular

- Modül renk sistemi tutarlı ve tanımayı gerçekten hızlandırıyor.
- Çevrimdışı durum butonu: Türkçe, durum odaklı, `aria-expanded`, Esc ile kapanıyor.
- Kartın tamamı tıklanabilir, `:active` basma geri bildirimi var.
- Alt navigasyon başparmak bölgesinde, öğeler 48×48.
- `--fg-muted` AA'yı geçiyor; birincil metin ve koyu temada teal (10,5:1) çok iyi.
- Tüm sayfalar statik ve çevrimdışı; dedektörün CSP engeline takılması güvenlik politikasının çalıştığını gösteriyor.

---

## 9. Önerilen sıra

1. **Faz 2:** Y1 (giriş animasyonu), S2 (reduced-motion), Y2 (odak), S7 (`transition-all`), S5/Y11 (kontrast + 12px taban), Y3 (zoom, K3'e göre), Y9 (sonsuz animasyon), tip ölçeği, `tabular-nums`, `text-wrap`.
2. **Faz 3:** 3.1 header (S1, Y7) → 3.2 hero (S6, S9, S10) → 3.3 kartlar (S3, S4, Y16) → 3.4 nav (Y4) → 3.5 arama (Y5, Y6, Y8) → 3.6 tema/senkron ikonları (Y14).
3. **Faz 4:** İlaç Dozu (Y15) → Skalalar (Y10) → Algoritmalar (Y21) → diğerleri (Y17, Y22).
