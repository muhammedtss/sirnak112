\# UI Yükseltme Planı — Şırnak 112 Acil Protokol Sistemi



> \*\*Bu dosya Claude Code için bir çalışma talimatıdır.\*\*

> Proje kök dizinine koy ve Claude Code'a şunu yaz:

> `UI-UPGRADE.md dosyasını oku ve Faz 0'dan başlayarak uygula. Her fazın sonunda dur ve onayımı bekle.`



\---



\## 1. Amaç



Arayüzü bir üst seviyeye taşımak; \*\*ama ürünün kimliğini, renk dilini ve "kritik anda hızlı erişim" özünü korumak.\*\*



Bu bir \*\*refinement\*\* (iyileştirme) işidir, \*\*redesign\*\* (yeniden tasarım) değildir. Hedef, mevcut kullanıcının siteyi açtığında "aynı uygulama, ama çok daha iyi hissettiriyor" demesidir. "Bu başka bir site olmuş" dememesi gerekir.



\### Ürün bağlamı (tüm kararların süzgeci)



\- \*\*Kullanıcı:\*\* 112 acil sağlık personeli (paramedik, ATT, hekim). Saha koşullarında, ambulansta, çoğu zaman tek elle ve stres altında kullanıyor.

\- \*\*Cihaz:\*\* Ağırlıklı olarak telefon, PWA olarak ana ekrana eklenmiş. Gece vardiyasında karanlık ortam, gündüz güneş altında parlak ortam.

\- \*\*Başarı ölçütü:\*\* Kullanıcının doğru araca (skala, doz, algoritma) \*\*en az dokunuşla ve en kısa sürede\*\* ulaşması.

\- \*\*Impeccable modu:\*\* `Operate`. Tarama hızı, tutarlılık ve gerçek kullanım sahnesi, görsel gösterişin önündedir.



\### Temel ilke



> \*\*Hiçbir güzelleştirme, kullanıcının bir araca ulaşma süresini 1 milisaniye bile uzatamaz.\*\*

> Giriş animasyonu bir kartın tıklanabilir olmasını geciktiriyorsa, o animasyon yapılmaz.



\---



\## 2. Korunacaklar (dokunulmaz liste)



Aşağıdakiler ürünün özüdür. Hiçbir faz bunları değiştiremez. Değişiklik gerekiyorsa \*\*önce sor\*\*.



\### Görsel kimlik

| Öğe | Mevcut değer | Kural |

|---|---|---|

| Arka plan | `--bg: #090c14` (koyu lacivert) | Korunur |

| Yüzey | `--bg-surface: #101520` | Korunur |

| Ana renk | `--primary: #0d9488` / `--primary-light: #2dd4bf` (teal) | Korunur. "Sistemi" vurgusu ve aktif durumlar teal kalır. |

| Durum renkleri | `--success #34d399`, `--warning #fbbf24`, `--danger #f87171` | Korunur. Klinik anlam taşırlar. |

| Font | \*\*Outfit\*\* | Korunur. Font değişmez, yalnızca ölçek ve ağırlık düzenlenebilir. |

| Kart dili | Glass kart, `--radius-2xl: 1.75rem`, ince beyaz kenar, iç parlama | Korunur. İnceltilebilir, kaldırılamaz. |

| Kategori renk kodlaması | Her modülün kendi ikon rengi (Algoritmalar turuncu, Vaka Protokolleri mor, Skalalar yeşil, İlaç Dozu amber, Envanter kırmızı, Evraklar pembe, ICD-10 cyan, EKG yeşil) | Korunur. Kullanıcılar modülleri renkle tanıyor. |

| Filigran ikonlar | Kartların sağ altındaki büyük, soluk ikonlar | Korunur. Konumu ve opaklığı düzenlenebilir. |

| Alt navigasyon | Yüzen hap (pill) şeklinde alt bar, aktif öğe teal daire | Korunur. |

| Varsayılan tema | Koyu tema | Korunur. Açık tema da desteklenmeye devam eder. |



\### İçerik ve yapı

\- \*\*Bilgi mimarisi değişmez:\*\* 8 modül, sıraları ve rotaları (`/algoritmalar-gorsel`, `/vaka-protokolleri`, `/skalalar`, `/ilac-doz`, `/envanter`, `/evraklar`, `/icd10`, `/ekg-egitim`) aynı kalır.

\- \*\*Metinler değişmez:\*\* Başlıklar, alt başlıklar ve "Developed by" satırı aynen kalır. `clarify` komutu yalnızca \*\*öneri listesi\*\* üretir, metni kendisi değiştirmez.

\- \*\*Klinik içerik ve hesaplama mantığına DOKUNULMAZ:\*\* Doz formülleri, skala puanlama mantığı, algoritma adımları, ICD-10 verisi ve EKG içerikleri yalnızca görsel katmanda değiştirilir. Bir bileşenin JSX ya da CSS'i düzenlenirken hesaplama fonksiyonları, veri dosyaları ve sabitler \*\*hiçbir koşulda\*\* değiştirilmez.

\- \*\*PWA davranışı korunur:\*\* `theme-color`, manifest, ikonlar, offline ve senkron göstergesi aynı kalır.



\---



\## 3. Mevcut durum tespiti



Canlı sitenin ana sayfası incelenerek tespit edildi. Faz 1'deki denetim bu listeyi doğrulamalı ve genişletmelidir.



\### Teknik altyapı

\- Next.js (Turbopack build), Tailwind CSS, `next/font` ile Outfit

\- Tasarım token'ları `:root` içinde CSS değişkeni olarak tanımlı

\- Tema `data-theme="dark"` ile `<html>` üzerinde yönetiliyor

\- Animasyon kütüphanesi yok. Yalnızca `spin` ve `pulse` keyframe'leri var.



\### Tespit edilen sorunlar



| # | Sorun | Etki | Öncelik |

|---|---|---|---|

| S1 | \*\*Sticky header'ın arka planı tamamen şeffaf\*\* (`background: transparent`, `backdrop-filter: none`). Kaydırınca kartlar başlığın ve "Developed by" satırının altından geçiyor, metinler üst üste biniyor. | Okunabilirlik, profesyonel görünüm | \*\*Kritik\*\* |

| S2 | \*\*`prefers-reduced-motion` desteği yok.\*\* Hiçbir medya sorgusu tanımlı değil. | Erişilebilirlik | \*\*Kritik\*\* |

| S3 | Kartlarda \*\*filigran ikon ile chevron (›) aynı sağ alt köşede çakışıyor\*\*. Görsel gürültü oluşuyor ve tıklama ipucu kayboluyor. | Tarama hızı | Yüksek |

| S4 | \*\*Grid tutarsızlığı:\*\* Bazı genişliklerde (\~760px) ICD-10 ve EKG Eğitimi kartları 2'li ızgaradan çıkıp ortalanmış, daha geniş tekli kartlara dönüşüyor. | Ritim, düzen | Yüksek |

| S5 | \*\*Düşük kontrastlı metin:\*\* "Developed by" satırı `--fg-subtle` (%30 opaklık), kart alt başlıkları `--fg-muted` (%55 opaklık) ile yazılmış. Güneş altında okunmaları zor. | Okunabilirlik (WCAG) | Yüksek |

| S6 | \*\*Hero CTA'sı ("Algoritmalar ›") ilk kartla aynı yere gidiyor.\*\* Hero, kullanıcıyı ızgaradaki bir karttan daha hızlı bir yere götürmüyor. | Bilgi hiyerarşisi | Orta |

| S7 | \*\*`transition: all 0.5s`\*\* kullanımı var. Hem yavaş hem performans açısından riskli (layout özelliklerini de canlandırır). | Performans, his | Orta |

| S8 | \*\*Tüm geçişlerde genel `ease` eğrisi\*\* kullanılıyor. Basma (press) geri bildirimi yok ya da belirsiz. | Dokunsal his | Orta |

| S9 | Hero'nun sağ üstündeki \*\*mor/indigo bulanık ışık lekesi\*\*, teal ana renkle ilişkisiz ve jenerik bir "AI glow" etkisi yaratıyor. | Marka tutarlılığı | Düşük |

| S10 | "Canlı — Güncel Protokoller" rozeti \*\*kırmızı tonlu\*\*. Acil bağlamda kırmızı "alarm/hata" anlamı taşır, burada ise olumlu bir durum anlatılıyor. | Anlamsal renk | Düşük, \*\*önce sor\*\* |



\---



\## 4. Skill → görev haritası



| Görev | Kullanılacak skill | Kullanılmayacak |

|---|---|---|

| Bağlam, denetim, tipografi, düzen, son cila | `impeccable` | — |

| Detay incelemesi (radius, gölge, hizalama, hit area) | `make-interfaces-feel-better` | — |

| Bileşen geçişleri (hover, press, modal, dropdown, akordeon, sekme, tema ikonu) | `transitions-dev` | GSAP |

| Var olan geçişleri iyileştirme | `transitions-polish` | — |

| GSAP | \*\*Varsayılan olarak kullanılmaz.\*\* Yalnızca Faz 5'teki iki opsiyonel öğe için, onay alınırsa. | Ana sayfa ızgarası, navigasyon, sayfa geçişleri |



\*\*GSAP neden kısıtlı?\*\* Bu bir acil karar destek aracı. Scroll animasyonları, parallax ve sahne geçişleri burada değer katmaz, gecikme ekler. Saf CSS geçişleri (Transitions.dev) bu ürünün ihtiyacının %95'ini karşılar ve sıfır bağımlılıkla gelir.



\---



\## 5. Hareket (motion) bütçesi



Tüm animasyonlar bu sınırlara uyar:



| Kural | Değer |

|---|---|

| Etkileşim geri bildirimi (hover, press) | \*\*≤ 150ms\*\* |

| Bileşen açma/kapama (modal, dropdown, akordeon) | \*\*≤ 220ms\*\* açılış, kapanış açılıştan daha hızlı |

| Sayfa geçişi | \*\*≤ 200ms\*\*. Hedef sayfa içeriği beklemez, geçiş sırasında tıklanabilir. |

| Giriş (entrance) animasyonu | \*\*Ana sayfa ızgarasında YOK.\*\* Kartlar ilk karede tıklanabilir olmalı. |

| Canlandırılabilir özellikler | Yalnızca `transform`, `opacity` ve gerekiyorsa `filter: blur()`. `width`, `height`, `top`, `margin` canlandırılmaz. |

| `transition: all` | \*\*Yasak.\*\* Her geçiş özellikleri açıkça listeler. |

| Basma geri bildirimi | `:active` durumunda `scale(0.97)`, \~100ms |

| `prefers-reduced-motion: reduce` | Tüm transform animasyonları kapanır, yalnızca ≤100ms'lik opacity değişimleri kalır. "Canlı" rozetinin `pulse` animasyonu durur. |

| Döngüsel animasyon | Yalnızca "Canlı" rozetindeki nokta ve senkron ikonundaki `spin`. Başka sonsuz animasyon eklenmez. |



\---



\## 6. Uygulama fazları



> \*\*Genel kurallar\*\*

> - Çalışmaya başlamadan önce yeni bir git branch'i aç: `git checkout -b ui-upgrade`

> - Her faz ayrı commit(ler) halinde ilerler. Commit mesajı fazı belirtir, örneğin `ui(faz-2): header'a scroll-aware arka plan`.

> - \*\*Her fazın sonunda dur\*\*, ne değiştiğini özetle ve onay bekle.

> - Her faz sonunda `npm run build` hatasız geçmelidir.

> - Değişiklikleri hem \*\*koyu\*\* hem \*\*açık\*\* temada, hem \*\*375px (mobil)\*\* hem \*\*1280px (masaüstü)\*\* genişlikte kontrol et.



\---



\### Faz 0 — Bağlam kurulumu



\*\*Amaç:\*\* Skill'lerin ürünü doğru anlaması. Kod değişikliği yok.



1\. `/impeccable init` komutunu çalıştır. PRODUCT.md oluşturulurken \*\*bu dosyanın 1. ve 2. bölümlerini\*\* kaynak olarak kullan. Özellikle şunları kaydet:

&#x20;  - Mod: `Operate`

&#x20;  - Kullanıcı ve kullanım sahnesi (saha, stres, tek el, gece/gündüz)

&#x20;  - Dokunulmaz liste (Bölüm 2)

2\. `/impeccable document` komutunu çalıştır. Mevcut koddan DESIGN.md üretilsin; mevcut token'lar, kart dili ve kategori renkleri \*\*olduğu gibi\*\* belgelensin.

3\. DESIGN.md'nin sonuna bu dosyanın \*\*5. bölümündeki hareket bütçesini\*\* ekle.



\*\*Çıktı:\*\* `PRODUCT.md`, `DESIGN.md`

\*\*Dur:\*\* İki dosyayı bana göster, onayımı bekle.



\---



\### Faz 1 — Denetim (yalnızca rapor, kod değişikliği YOK)



\*\*Amaç:\*\* Sorunların tam ve önceliklendirilmiş listesi.



1\. `/impeccable audit` ile ana sayfa ve her modül sayfası için erişilebilirlik, performans ve responsive denetimi yap.

2\. `/impeccable critique` ile ana sayfa için heuristik UX değerlendirmesi yap.

3\. `/make-interfaces-feel-better full` ile ana sayfa ve en az şu üç modül sayfasını incele: `/ilac-doz`, `/skalalar`, `/algoritmalar-gorsel`.

4\. Bulguları bu dosyanın \*\*3. bölümündeki tabloyla birleştir\*\* ve tek bir rapor yaz: `docs/ui-audit.md`. Raporda:

&#x20;  - Her bulgu için konum (dosya ve satır), sorun, önerilen düzeltme ve hangi fazda çözüleceği yer alsın.

&#x20;  - Bölüm 2'deki dokunulmaz listeyi ihlal edecek öneriler ayrı bir başlık altında "\*\*Uygulanmayacaklar\*\*" olarak işaretlensin.



\*\*Çıktı:\*\* `docs/ui-audit.md`

\*\*Dur:\*\* Raporu göster, hangi bulguların uygulanacağına ben karar vereceğim.



\---



\### Faz 2 — Temel katman (token'lar ve global stiller)



\*\*Amaç:\*\* Bütün bileşenlerin üzerine oturduğu zemini sağlamlaştırmak.



1\. \*\*Tipografi\*\* (`/impeccable typeset`, Outfit sabit kalır)

&#x20;  - Net bir tip ölçeği tanımla (örneğin 12 / 14 / 16 / 20 / 24 / 32) ve CSS değişkeni olarak ekle.

&#x20;  - Başlıklarda `text-wrap: balance`, paragraflarda `text-wrap: pretty` kullan.

&#x20;  - Değişen sayılar (doz sonuçları, skala puanları, sayaçlar) için `font-variant-numeric: tabular-nums` uygula.

&#x20;  - Kök layout'a `-webkit-font-smoothing: antialiased` ekle.

2\. \*\*Kontrast (S5)\*\*

&#x20;  - `--fg-muted` ve `--fg-subtle` değerlerini, koyu ve açık temada \*\*WCAG AA (4.5:1)\*\* sağlayacak şekilde ayarla. Ton (renk) korunur, yalnızca opaklık veya açıklık değişir.

3\. \*\*Yüzeyler\*\*

&#x20;  - `make-interfaces-feel-better` ilkelerine göre: iç içe öğelerde \*\*concentric radius\*\* (dış radius = iç radius + padding). Kart içindeki ikon kutusu ve rozetler bu kurala uydurulur.

&#x20;  - Yalnızca derinlik için kullanılan kenarlıkları katmanlı, şeffaf `box-shadow` ile değiştir. Yapı veya durum bildiren kenarlıklar kalır.

4\. \*\*Hareket altyapısı (S2, S7)\*\*

&#x20;  - Bölüm 5'teki bütçeye uygun easing ve süre token'larını tanımla (`--ease-out`, `--dur-fast`, `--dur-base` gibi).

&#x20;  - Global `@media (prefers-reduced-motion: reduce)` bloğunu ekle.

&#x20;  - Projedeki tüm `transition: all` kullanımlarını bul ve özellikleri açıkça listeleyen geçişlerle değiştir.



\*\*Kabul ölçütü:\*\* Görsel olarak site neredeyse aynı görünür; metinler daha okunaklıdır. `transition: all` araması sıfır sonuç verir.

\*\*Dur:\*\* Önce/sonra ekran görüntüsü (koyu + açık, mobil) ile özetle.



\---



\### Faz 3 — Bileşenler



Her bileşen için önce `/impeccable polish <bileşen>` çalıştırılır, ardından `/make-interfaces-feel-better quick <bileşen>` ile doğrulanır.



\#### 3.1 Header (S1)

\- Sticky header'a \*\*kaydırmaya duyarlı arka plan\*\* ekle: sayfa en üstteyken şeffaf kalsın, kaydırma başlayınca `--glass-bg` + `backdrop-filter: blur(...)` ve alt kenarda ince ayraç belirsin. Geçiş ≤150ms.

\- `backdrop-filter` desteklemeyen tarayıcılar için opak yedek arka plan tanımla.

\- Kaydırınca başlık bloğu kompaktlaşabilir ("Developed by" satırı gizlenip başlık küçülebilir), ama \*\*arama, senkron ve tema butonları her zaman görünür ve tıklanabilir\*\* kalmalı.

\- İkon butonlarının dokunma alanı en az \*\*44×44px\*\* olmalı.



\#### 3.2 Hero kartı (S6, S9, S10)

\- Mor/indigo ışık lekesini (S9) \*\*teal ana renk ailesine\*\* çek ya da çok daha sönük hale getir.

\- "Canlı" rozetinin rengi (S10): \*\*Bana sor.\*\* Öneri: teal veya success yeşili. Kırmızı alarm çağrışımı yapıyor.

\- Hero CTA'sı (S6): \*\*Bana sor.\*\* Seçenekler:

&#x20; - (a) CTA'yı hızlı aramaya bağla ("Protokol ara…")

&#x20; - (b) Son kullanılan araca bağla

&#x20; - (c) Olduğu gibi bırak

\- Hero metni ve hiyerarşisi `/impeccable typeset hero` ile düzenlenir. Metin içeriği değişmez.



\#### 3.3 Modül kartları (S3, S4)

\- \*\*Çakışma (S3):\*\* Chevron ile filigran ikonu ayır. Öneri: chevron sağ üst köşeye, ikon kutusunun hizasına; filigran sağ altta kalsın ve opaklığı biraz düşsün.

\- \*\*Grid (S4):\*\* 8 kart her genişlikte tutarlı bir ızgarada dursun: mobilde 2 sütun, tablette 2 ya da 4, masaüstünde 4 sütun. Ortalanmış yetim kart kalmasın.

\- \*\*Durumlar:\*\* Hover (masaüstü): hafif yükselme ve kenar parlaması. `:active`: `scale(0.97)`. `:focus-visible`: teal odak halkası. Hepsi Bölüm 5 bütçesinde.

\- Tüm kart yüzeyi tıklanabilir ve klavyeyle erişilebilir olmalı.

\- Kategori renkleri kart hover parlamasında da kullanılabilir. Örneğin İlaç Dozu kartı hover'da amber tonlu kenar parlaması alır.



\#### 3.4 Alt navigasyon

\- Aktif öğe göstergesini sekmeler arasında \*\*kayan\*\* hale getir (`transitions-dev` → Tabs sliding).

\- Her öğe en az 44×44px dokunma alanına sahip olsun. iOS'ta ev çubuğu için `env(safe-area-inset-bottom)` boşluğu eklensin.

\- İkonlara erişilebilir etiket (`aria-label`) ve `aria-current="page"` ekle.



\#### 3.5 Arama

\- Arama açılışı için `transitions-dev` → Modal veya Panel reveal kullan. Açılışta input'a otomatik odaklanılsın.

\- Sonuç listesinde klavye navigasyonu (↑ ↓ Enter, Esc ile kapatma) olsun.

\- Sonuç yoksa net bir boş durum mesajı gösterilsin.



\#### 3.6 Tema ve senkron ikonları

\- Tema değiştirme ikonu: `transitions-dev` → Icon swap (güneş ↔ ay).

\- Senkron ikonu: mevcut `spin` animasyonu korunur. Senkron tamamlandığında ikon geçişi Icon swap ile yapılsın.



\*\*Dur:\*\* Her alt bölüm (3.1 – 3.6) bitince kısa özet ver ve onay bekle.



\---



\### Faz 4 — Modül sayfaları



\*\*Kritik uyarı:\*\* Bu fazda klinik hesaplama ve veri dosyalarına dokunulmaz. Yalnızca görünüm katmanı değişir.



Her modül sayfası için sırayla:

1\. `/impeccable audit <sayfa>`

2\. `/impeccable layout <sayfa>`: boşluk, ritim, hiyerarşi

3\. Uygun Transitions.dev geçişleri:



| Modül | Önerilen geçişler |

|---|---|

| \*\*İlaç Dozu\*\* | Sonuç değiştiğinde \*\*Number pop-in\*\*. Hatalı giriş için \*\*Error state shake\*\*. Tüm sonuç sayılarında `tabular-nums`. Sonuç kartı ekranın en görünür yerinde olmalı. |

| \*\*Skalalar\*\* | Puan için Number pop-in. Kriter seçimi için Checkbox check. Bölümler için Accordion. Toplam puanın yorumu (hafif/orta/ağır) durum renkleriyle. |

| \*\*Algoritmalar\*\* | Akış adımları için Accordion. Adım detayları için Panel reveal. |

| \*\*Vaka Protokolleri\*\* | Adım listesi için Accordion. "Tamamlandı" işaretleri için Checkbox check. |

| \*\*Envanter\*\* | Kontrol listesi için Checkbox check. Kaydedildi bildirimi için Toast. |

| \*\*Evraklar\*\* | Form doğrulama hataları için Error state shake. Gönderim/kayıt sonrası Toast. |

| \*\*ICD-10\*\* | Arama sonuçları için yükleme sırasında Skeleton loader and reveal. |

| \*\*EKG Eğitimi\*\* | Sınav sorularında doğru cevap için Success check, yanlış cevap için Error state shake. Atlas görselleri için Modal. |



4\. `/make-interfaces-feel-better quick <sayfa>` ile doğrula.



\*\*Dur:\*\* Her modül bitince onay bekle. Sıra: İlaç Dozu → Skalalar → Algoritmalar → Vaka Protokolleri → diğerleri.



\---



\### Faz 5 — Opsiyonel GSAP dokunuşları (yalnızca onayla)



Bu faz \*\*varsayılan olarak atlanır\*\*. Yalnızca ben açıkça onaylarsam uygulanır.



1\. \*\*Hero'da EKG çizgisi:\*\* Hero kartının arka planında, sayfa ilk yüklendiğinde \*\*bir kez\*\* soldan sağa çizilen ince, teal renkli bir EKG çizgisi (`gsap-plugins` → DrawSVG). Kurallar:

&#x20;  - Süre ≤ 1.2s, hiçbir öğenin tıklanabilirliğini engellemez.

&#x20;  - `prefers-reduced-motion` açıkken hiç oynamaz; çizgi statik olarak görünür.

&#x20;  - Döngü yok.

2\. \*\*Görsel algoritmalarda yol vurgusu:\*\* Akış şemasında seçilen karar yolunun bağlantı çizgilerinin vurgulanması (DrawSVG + Timeline).



GSAP kullanılırsa:

\- `gsap-react` kurallarına uyulur: `useGSAP` hook'u, scope ve cleanup.

\- GSAP yalnızca bu bileşenlerde \*\*dinamik import\*\* ile yüklenir, ana bundle'a eklenmez.



\---



\### Faz 6 — Son cila ve doğrulama



1\. `/impeccable polish` ile tüm site üzerinde son kalite geçişi yap.

2\. `/make-interfaces-feel-better full` ile tüm site için son detay incelemesi yap ve kalan bulguları düzelt.

3\. `/impeccable optimize` ile performans kontrolü yap. Lighthouse mobil skorları Faz 0 öncesine göre \*\*düşmemiş\*\* olmalı.

4\. Aşağıdaki kabul kontrol listesini tek tek doğrula ve sonuçları `docs/ui-audit.md` sonuna ekle.



\---



\## 7. Kabul kontrol listesi



\### Öz korundu mu?

\- \[ ] Renk token'ları (`--bg`, `--primary`, durum renkleri) aynı

\- \[ ] Outfit fontu aynı

\- \[ ] Kategori renk kodlaması aynı

\- \[ ] Glass kart dili ve filigran ikonlar duruyor

\- \[ ] Alt navigasyon yapısı aynı

\- \[ ] 8 modül, sıraları ve rotaları aynı

\- \[ ] Klinik veri ve hesaplama dosyalarında \*\*sıfır değişiklik\*\* (`git diff main --stat` ile kontrol et)



\### Kalite

\- \[ ] S1 – S10 sorunlarının hepsi çözüldü ya da bilinçli olarak "uygulanmayacak" olarak işaretlendi

\- \[ ] Tüm metinler WCAG AA kontrastını sağlıyor (koyu + açık tema)

\- \[ ] Tüm dokunma hedefleri ≥ 44×44px

\- \[ ] Tüm etkileşimli öğelerde görünür `:focus-visible` durumu var

\- \[ ] `prefers-reduced-motion` açıkken hiçbir transform animasyonu oynamıyor

\- \[ ] Projede `transition: all` kullanımı yok

\- \[ ] Hiçbir animasyon Bölüm 5 bütçesini aşmıyor

\- \[ ] Ana sayfa ilk karede tamamen tıklanabilir (giriş animasyonu yok)



\### Teknik

\- \[ ] `npm run build` hatasız

\- \[ ] Lighthouse mobil Performance ve Accessibility skorları düşmedi

\- \[ ] PWA kurulumu, offline modu ve senkron göstergesi çalışıyor

\- \[ ] 375px, 768px ve 1280px genişliklerde yetim kart ya da taşma yok

\- \[ ] iOS Safari'de safe-area boşlukları doğru



\---



\## 8. Claude Code için kısa hatırlatma



\- Bu bir \*\*refinement\*\* işidir: kimliği koru, detayları iyileştir.

\- Emin olmadığın her görsel kararda \*\*sor\*\*. Özellikle Bölüm 3'te "Bana sor" ile işaretli maddelerde.

\- Klinik veri ve hesaplama mantığı \*\*asla\*\* değişmez.

\- Hız her şeyden önce gelir: süslemek uğruna kullanıcıyı bekletme.

