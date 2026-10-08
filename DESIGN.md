---
name: Acil Protokol Sistemi
description: Hastane öncesi acil sağlık personeli için çevrimdışı çalışan protokol, doz ve skala aracı
colors:
  night-cabin: "#090C14"
  cabin-surface: "#101520"
  signal-white: "#F1F5FF"
  protocol-teal: "#0D9488"
  protocol-teal-light: "#2DD4BF"
  vital-green: "#34D399"
  caution-amber: "#FBBF24"
  alarm-red: "#F87171"
  day-slate: "#F1F5F9"
  day-surface: "#F8FAFC"
  day-ink: "#1E293B"
  day-teal: "#0F766E"
  day-teal-light: "#14B8A6"
  module-algoritmalar: "#F97316"
  module-protokoller: "#8B5CF6"
  module-skalalar: "#34D399"
  module-ilac: "#F59E0B"
  module-envanter: "#EF4444"
  module-evraklar: "#EC4899"
  module-icd10: "#06B6D4"
  module-ekg: "#10B981"
typography:
  display:
    fontFamily: "Outfit, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Outfit, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Outfit, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.5
  label:
    fontFamily: "Outfit, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0.1em"
rounded:
  input: "0.875rem"
  card: "1.75rem"
  nav: "2rem"
  pill: "9999px"
spacing:
  gutter: "16px"
  card-gap: "12px"
  card-pad: "16px"
components:
  card-glass:
    backgroundColor: "rgba(16, 21, 32, 0.55)"
    textColor: "{colors.signal-white}"
    rounded: "{rounded.card}"
    padding: "16px"
  input-glass:
    backgroundColor: "rgba(255, 255, 255, 0.05)"
    textColor: "{colors.signal-white}"
    rounded: "{rounded.input}"
    padding: "12px 16px"
  nav-bottom:
    backgroundColor: "rgba(16, 21, 32, 0.55)"
    rounded: "{rounded.nav}"
    padding: "8px"
  nav-item-active:
    backgroundColor: "rgba(45, 212, 191, 0.35)"
    textColor: "{colors.protocol-teal-light}"
    rounded: "{rounded.pill}"
    size: "48px"
  badge-primary:
    backgroundColor: "rgba(45, 212, 191, 0.35)"
    textColor: "{colors.protocol-teal-light}"
    rounded: "{rounded.pill}"
    padding: "2px 10px"
---

# Design System: Acil Protokol Sistemi

## Overview

**Creative North Star: "Cebinizdeki Protokol"**

Arayüz, acil ekiplerin başucu protokol kitabının her an elde olan dijital halidir. Bilgi öndedir, süs arkadadır. Koyu, gece kabinine uygun bir zeminin üzerinde yarı saydam cam kartlar durur. Renk, dekor için değil, yön bulmak için kullanılır: her modülün kendi rengi vardır ve kullanıcı modülleri bu renklerden tanır.

Yoğunluk orta düzeydedir. Kartlar büyük ve tek elle rahat dokunulacak boyuttadır, metin kısa ve taranabilirdir. Kartlar ve butonlar **dokunsal ve kendinden emindir**: geniş dokunma alanları, belirgin basma geri bildirimi (scale 0.97) ve net aktif durumlar.

Sistem sahada değişken ışığa göre kurulmuştur. Koyu tema varsayılandır, açık tema aynı yapıyı açık slate zemine taşır.

**Key Characteristics:**
- Koyu lacivert zemin (`night-cabin`) üzerinde cam (glassmorphism) kartlar
- Tek marka rengi: protokol teal'i; aktif durum, vurgu ve odak bu renkte
- Modül başına sabit kategori rengi (ikon kutusu ve filigran ikon)
- Büyük köşe yarıçapı (1.75rem) ve hap şeklinde alt navigasyon
- Klinik anlamlı durum renkleri (yeşil / amber / kırmızı) yalnızca durum bildirmek için

## Colors

Koyu, soğuk bir zemin, tek bir teal marka rengi ve modül başına ayrılmış canlı kategori renkleri.

### Primary
- **Protokol Teal'i** (#0D9488; açık ton #2DD4BF): Marka rengi. "Sistemi" vurgusu, aktif navigasyon öğesi, rozetler, klavye odak halkası (`--focus-ring`: 2px zemin + 2px açık teal) ve birincil eylemler. Açık temada #0F766E / #14B8A6.
- **Teal Parıltısı** (rgba(45,212,191,0.35)): Aktif öğe ve rozet arka planı, metin parlaması.

### Neutral
- **Gece Kabini** (#090C14): Uygulama zemini (koyu tema).
- **Kabin Yüzeyi** (#101520): Opak yüzeyler, açılır paneller.
- **Sinyal Beyazı** (#F1F5FF): Birincil metin. İkincil metin %62, silik metin %50 opaklıkla aynı tondan türetilir (`--fg-muted` 6,9:1, `--fg-subtle` 4,9:1). Açık temada %75 / %66 (6,4:1 / 4,7:1). Her ikisi de WCAG AA'yı geçer.
- **Gündüz Slate'i** (#F1F5F9 / yüzey #F8FAFC / mürekkep #1E293B): Açık tema karşılıkları.
- **Cam** (rgba(16,21,32,0.55), kenar rgba(255,255,255,0.07)): Kart ve navigasyon yüzeyi.

### Durum (klinik anlam taşır)
- **Hayati Yeşil** (#34D399): Başarı, doğru, normal aralık.
- **Dikkat Amberi** (#FBBF24): Uyarı, orta şiddet.
- **Alarm Kırmızısı** (#F87171): Tehlike, kritik adım (KKM etiketi), hata.

### Modül renkleri
Algoritmalar #F97316 · Vaka Protokolleri #8B5CF6 · Skalalar #34D399 · İlaç Dozu #F59E0B · Envanter #EF4444 · Evraklar #EC4899 · ICD-10 #06B6D4 · EKG Eğitimi #10B981. İkon kutusunda %13 ve kenarda %20 opaklıkla, filigran ikonda %10 opaklıkla kullanılır.

### Named Rules
**The One Voice Rule.** Teal tek marka sesidir; aktif, seçili ve odaklı durumları yalnızca teal anlatır.
**The Clinical Color Rule.** Yeşil, amber ve kırmızı yalnızca klinik ya da sistem durumu bildirir; dekorasyon için kullanılmaz.
**The Recognition Rule.** Modül renkleri sabittir; bir modülün rengi değiştirilmez ve başka modüle verilmez.

## Typography

**Display Font:** Outfit (system-ui yedekli)
**Body Font:** Outfit
**Label Font:** Outfit, büyük harf ve geniş harf aralığıyla

**Character:** Tek aile, geometrik ve sıcak. Hiyerarşi ağırlık (500 → 800) ve boyutla kurulur, ikinci bir yazı ailesi yoktur.

### Hierarchy
- **Display** (800, 1.5rem, 1.15): Ana sayfa başlığı "Acil Protokol Sistemi".
- **Title** (700, 1rem, 1.25, sıkı harf aralığı): Sayfa başlıkları (AppHeader), kart başlıkları.
- **Body** (500, 0.875rem, 1.5): Açıklamalar, algoritma adımları.
- **Label** (700, 0.6875rem, 0.1em, BÜYÜK HARF): Bölüm etiketleri, "Şırnak 112 Acil Sağlık" üst satırı, adım numaraları.

Tip ölçeği `:root` içinde token olarak tanımlıdır: 11 (etiket tabanı) / 12 / 14 / 16 / 20 / 24 / 32px. **11px'in altına inilmez.** Başlıklarda `text-wrap: balance`, paragraflarda `text-wrap: pretty`; değişen sayılarda (doz, puan, sıvı) `tabular-nums`.

### Named Rules
**The Single Family Rule.** Outfit tek yazı ailesidir; hiyerarşi ağırlık ve boyutla kurulur.
**The 11px Floor Rule.** Hiçbir metin 11px'ten küçük olamaz; güneş altında okunabilirlik tabanı budur.

## Layout

Mobil öncelikli tek sütun akış; içerik `max-w-xl` (36rem) ile `max-w-3xl` (48rem) arası kapsayıcılarda ortalanır. Kenar boşluğu 16px'tir. Ana sayfa modülleri 2 sütunlu ızgarada (12px aralık) durur; ICD-10 ve EKG Eğitimi kartları tam satır kaplayan, ortalanmış daha dar kartlardır. Başlık (AppHeader) yapışkandır (sticky); alt navigasyon kaydırma alanının dışında, ekranın altında sabit bir haptır ve iOS güvenli alanı kadar alt boşluk bırakır. Uygulama kökü `100dvh` yüksekliğindedir ve yalnızca içerik alanı kayar.

## Elevation & Depth

Derinlik, cam katmanlamayla verilir: yarı saydam yüzey + `backdrop-filter: blur(20px) saturate(180%)` + ince açık kenar + yumuşak gölge. Arka planda **statik** bulanık renk küreleri ve çok silik bir nokta ızgarası bulunur.

### Shadow Vocabulary
- **Cam dinlenme** (`box-shadow: 0 8px 32px rgba(0,0,0,0.35), 0 1px 0 rgba(255,255,255,0.04) inset`): Kartlar, başlık, alt navigasyon.
- **Cam hover** (`box-shadow: 0 12px 40px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.06) inset`): Masaüstünde fareyle üzerine gelinen kart.
- **Odak parıltısı** (`box-shadow: 0 0 0 3px rgba(45,212,191,0.35)`): Odaklanan giriş alanı.

### Named Rules
**The Glass Not Paper Rule.** Yüzeyler opak kağıt değil camdır; arka plan hafifçe görünür, kenar ince ve açıktır.

## Shapes

Yumuşak, büyük köşeler: kartlar 1.75rem, alt navigasyon 2rem, giriş alanları 0.875rem, ikon kutuları 1rem (rounded-2xl), rozet ve aktif navigasyon göstergesi tam yuvarlak. Keskin köşe kullanılmaz. Filigran ikonlar kartın sağ altından taşar ve hafif döndürülmüştür (-12°).

## Components

### Cards / Containers (cam kart)
- **Corner Style:** 1.75rem
- **Background:** cam (rgba(16,21,32,0.55)), hover'da rgba(20,28,48,0.72)
- **Shadow Strategy:** cam dinlenme, hover'da cam hover
- **Border:** 1px rgba(255,255,255,0.07), hover'da 0.14
- **Internal Padding:** 16px
- **Press:** `:active` → `scale(0.97)`
- **Modül kartı:** sol üstte modül renginde 40px ikon kutusu, altta başlık (14px, 600) ve açıklama (11px, muted), sağ altta chevron ve 80px filigran ikon.

### Inputs / Fields
- **Style:** rgba(255,255,255,0.05) zemin, ince cam kenar, 0.875rem köşe, blur(12px)
- **Focus:** teal kenar (rgba(45,212,191,0.6)) ve 3px teal parıltı halkası
- **Hesaplayıcı girişleri:** büyük (text-xl, 900) sayısal yazı, sonuç kartları teal/turuncu dolgulu.

### Navigation
- **Alt navigasyon:** cam hap, maks 24rem genişlik, 5 öğe; her öğe 48×48px. Aktif öğe teal parıltı dairesi ve teal ikon (çizgi 2.5); diğerleri silik ikon (çizgi 1.8). Aktif gösterge öğeler arasında yay animasyonuyla kayar.
- **Başlık (AppHeader):** cam şerit, solda geri butonu (36px daire) ve teal ikon kutusu, ortada başlık, sağda çevrimdışı durum ve tema butonları.

### Chips / Badges
- **Rozet:** teal parıltı zemin, açık teal metin, tam yuvarlak.
- **Kategori hapları:** `pill-*` sınıfları; renk %12-15 zemin, açık ton metin, %22-25 kenar.
- **KKM etiketi:** kritik adım kartının sol üstünde kırmızı (#EF4444 %90) küçük etiket; kart kırmızı tonlu.

### Algoritma adım kartı (imza bileşen)
Adımlar dikey bir hat üzerinde cam kartlar olarak dizilir; karar adımlarında iki seçenek butonu (Evet yeşil, Hayır kırmızı ya da özel etiketler) yan yana durur. Yönlendirme adımları mavi vurgulu bağlantı butonudur.

## Do's and Don'ts

### Do:
- **Do** teal'i yalnızca marka, aktif ve odak durumları için kullan.
- **Do** modül kartlarında kategori rengini ikon kutusu ve filigran ikonda koru.
- **Do** her dokunma hedefini en az 44×44px yap; basmada `scale(0.97)` geri bildirimi ver.
- **Do** hem koyu hem açık temada kontrol et; açık tema override'ları (`[data-theme="light"]`) korunmalı.

### Don't:
- **Don't** yazı ailesini değiştirme; Outfit sabittir.
- **Don't** durum renklerini (yeşil/amber/kırmızı) dekorasyon için kullanma.
- **Don't** modül renklerini değiştirme ya da modüller arasında takas etme.
- **Don't** klinik veri ve hesaplama dosyalarına görsel çalışma sırasında dokunma.

## Motion Budget

*(docs/arsiv/ui-yukseltme-plani.md Bölüm 5'ten; tüm animasyonlar bu sınırlara uyar.)*

| Kural | Değer |
|---|---|
| Etkileşim geri bildirimi (hover, press) | ≤ 150ms |
| Bileşen açma/kapama (modal, dropdown, akordeon) | ≤ 220ms açılış; kapanış açılıştan daha hızlı |
| Sayfa geçişi | ≤ 200ms; hedef sayfa içeriği beklemez, geçiş sırasında tıklanabilir |
| Giriş (entrance) animasyonu | Ana sayfa ızgarasında YOK; kartlar ilk karede tıklanabilir |
| Canlandırılabilir özellikler | Yalnızca `transform`, `opacity` ve gerekiyorsa `filter: blur()`; `width`, `height`, `top`, `margin` canlandırılmaz |
| `transition: all` | Yasak; her geçiş özellikleri açıkça listeler |
| Basma geri bildirimi | `:active` → `scale(0.97)`, ~100ms |
| `prefers-reduced-motion: reduce` | Tüm transform animasyonları kapanır; yalnızca ≤100ms opacity değişimleri kalır; "Canlı" rozetinin `pulse` animasyonu durur |
| Döngüsel animasyon | Yalnızca "Canlı" rozetindeki nokta ve senkron ikonundaki `spin`; başka sonsuz animasyon eklenmez |

**Token'lar** (`globals.css :root`): `--ease-out` cubic-bezier(0.22, 1, 0.36, 1), `--ease-in-out` cubic-bezier(0.65, 0, 0.35, 1), `--dur-press` 100ms, `--dur-fast` 150ms, `--dur-base` 200ms. Tailwind'de `transition` (açık özellik listesi) + `duration-150`/`duration-200`; `transition-all` kullanılmaz. framer-motion `MotionConfig reducedMotion="user"` ile sarılıdır.
