# 🚨 EKG & TIP SİMÜLATÖRLERİ - FAZ 2 DERİN DENETİM RAPORU (KÖR NOKTALAR)

**Tarih:** 27 Eylül 2026
**Denetçi:** AppSec & Principal Next.js Mimarı
**Kapsam:** EKG Eğitim Alt Bileşenleri (`InteractiveWaveAnatomy`, `TreeBuilderGame`), `DigitalCaliper` Düzensiz Mod, İlaç/Yanık Hesaplayıcıları ve PWA/Offline Dayanıklılık.

---

## BÖLÜM 1: EKG BİLEŞENLERİNDEKİ MANTIKSAL (STATE) KİLİTLENMELERİ

### [ID: DEEP-01] DigitalCaliper: Düzensiz Modda Marker (İşaretleyici) Senkronizasyon Kaybı
- **Önem Derecesi:** Kritik (P1 - Yanlış Nabız Hesabı)
- **Dosya:Satır:** `src/components/ekg/DigitalCaliper.tsx : 45-48, 240-250`
- **Kanıt/Senaryo:** Düzensiz (Irregular) modda `windowStart` (15 karelik pencere) sürüklendiğinde veya `pixelsPerSquare` (Kalibrasyon) değiştirildiğinde, EKG trasesine önceden konulan R dalgası işaretleyicileri (`markers`) eski mutlak X koordinatlarında kalıyor. Pencere kaydığı için işaretler pencere dışına çıkıyor ancak `bpm = markers.length * 20` formülü hala bu dışarıda kalan işaretleri de sayıyor, bu da yanlış taşikardi/bradikardi teşhisine yol açıyor!
- **Kesin Çözüm Kodu:**
Pencere konumu (`windowStart`) veya kalibrasyon (`windowWidth` / `pixelsPerSquare`) değiştiğinde mevcut işaretleri temizlemek en güvenli yoldur.
```tsx
  useEffect(() => {
    // Pencere boyutu veya konumu değişirse işaretleri sıfırla ki yanlış hesap olmasın
    setMarkers([]);
  }, [windowStart, windowWidth]);
```

### [ID: DEEP-02] EkgExamSimulator: StrictMode / GC Kaynaklı Şıkların Yeniden Karılması
- **Önem Derecesi:** Orta (P2 - UX/Hydration Hatası)
- **Dosya:Satır:** `src/components/ekg/EkgExamSimulator.tsx : 60-83`
- **Kanıt/Senaryo:** `options` dizisi `useMemo` içerisinde `Math.random() - 0.5` kullanılarak oluşturuluyor. React `useMemo`'yu kesin bir cache garantisi olarak sunmaz (Garbage Collector silebilir veya StrictMode çift render atar). Yanlış bir şıkka tıklandığında `setScore` tetiklenir, eğer React bu esnada cache temizlerse `options` yeniden hesaplanır ve şıkların yerleri aniden değişerek kullanıcıyı şaşırtır.
- **Kesin Çözüm Kodu:**
`options` bir `useState` içine alınmalı ve sadece `step` veya `currentCase` değiştiğinde bir `useEffect` aracılığıyla güncellenmelidir. (Render fonksiyonu içinde `Math.random()` anti-pattern'dir).

### [ID: DEEP-03] TreeBuilderGame: Race Condition (Hızlı Tıklama) Kaynaklı State Silinmesi
- **Önem Derecesi:** Orta (P2 - State Kilitlenmesi)
- **Dosya:Satır:** `src/components/ekg/TreeBuilderGame.tsx : 75-81`
- **Kanıt/Senaryo:** Kullanıcı yanlış bir eşleştirme yaptığında `errorPair` state'i atanır ve 800ms'lik bir `setTimeout` başlar. Kullanıcı bu 800ms dolmadan hemen başka bir `prompt`'a (kutuya) tıklarsa `setSelectedPrompt` yeni değeri alır, ancak saniyeler sonra süresi dolan timeout `setSelectedPrompt(null)` çalıştırarak kullanıcının yeni seçimini haksız yere iptal eder (siler).
- **Kesin Çözüm Kodu:**
Kullanıcı hata durumundayken (veya timeout bitene kadar) tıklamaları disable etmeliyiz:
```tsx
onClick={() => !isMatched && !errorPair && setSelectedPrompt(isSelected ? null : pair.id)}
```

---

## BÖLÜM 2: TIBBİ HESAPLAYICILAR VE SINIR (EDGE-CASE) HATALARI

### [ID: DEEP-04] DrugDoseCalculator & BurnCalculatorEmbed: Nokta/Virgül (Kültürel Ayrım) Zafiyeti ve Veri Kaybı
- **Önem Derecesi:** Kritik (P0 - Ölümcül Doz / Eksik Dozaj Hatası)
- **Dosya:Satır:** `src/components/skalalar/BurnCalculatorEmbed.tsx : 153` ve `DrugDoseCalculator.tsx : 351`
- **Kanıt/Senaryo:** `type="number"` olan inputlarda kullanıcı ondalıklı sayı girmek için mobil Türkçe klavyede "virgül" (`,`) kullandığında (Örn: `10,5` kilo), JS `parseFloat("10,5")` fonksiyonu virgülü tanımaz ve sayıyı `10` olarak keser (truncate). Bebeklerde 0.5 kg bile dozajı değiştirirken bu sessiz (silent) veri kaybı eksik veya hatalı sıvı/ilaç verilmesine neden olur.
- **Kesin Çözüm Kodu:**
Input `type="text" inputMode="decimal"` olarak değiştirilmeli ve on-change esnasında virgüller noktaya çevrilmelidir:
```tsx
onChange={(e) => {
  const val = e.target.value.replace(",", "."); // Virgülü noktaya çevir
  if (val === "" || /^\d*\.?\d*$/.test(val)) {
    setKilo(val);
  }
}}
```

### [ID: DEEP-05] DrugDoseCalculator: 0 Kg Sınır Durumu
- **Önem Derecesi:** Düşük (P3)
- **Dosya:Satır:** `DrugDoseCalculator.tsx : 160-161`
- **Kanıt/Senaryo:** Kullanıcı silme işlemi yaptığında input boş kalıyor veya 0 girilebiliyor. Kod 0'ı "Geçersiz Kilo" olarak doğru biçimde yakalayıp `calculatedDose`'u `null` yapsa da, `0` değerinde `isNaN` veya `<=` kontrolleri sessiz kalıyor ve kullanıcıya açıkça "Kilo 0 olamaz" uyarısı verilmiyor.

---

## BÖLÜM 3: PWA VE ÇEVRİMDIŞI (OFFLINE) DAYANIKLILIK KÖR NOKTASI

### [ID: DEEP-06] PWA Yapılandırması ve Service Worker Eksikliği
- **Önem Derecesi:** Kritik (P0 - Sahada Çalışmama)
- **Dosya:Satır:** `next.config.ts`, `public/`, `src/app/`
- **Kanıt/Senaryo:** Sistem "Şırnak sahasında" internetsiz çalışmak üzere kurgulanmak isteniyor. Ancak denetimde projede `next-pwa` veya `serwist` yapılandırması, `manifest.json` dosyası ve `/public/ekg/` içindeki statik görüntüleri cache'leyecek bir Service Worker (`sw.js`) olmadığı tespit edilmiştir. İnternet kesildiğinde EKG simülatörü çalışmayacak ve `<img src="...">` etiketleri kırık resim simgesi gösterecektir (Image Fallback yok).
- **Kesin Çözüm Kodu:**
1. `next-pwa` (veya `@serwist/next`) paketinin kurularak `next.config.ts`'in sarmalanması.
2. `public/manifest.json` (veya `src/app/manifest.ts`) oluşturulması.
3. Resim etiketlerine fallback eklenmesi: `onError={(e) => e.currentTarget.src = '/fallback-ekg.png'}`.

---
**Özet:** Mimari ve güvenlik açısından Phase 1'deki sorunlar çözülse de, mobil cihazlardaki Türkçe ondalık klavyesi ve internetin olmadığı saha şartları için (PWA eksikliği) projede ciddi kör noktalar bulunmaktadır. Bu raporun onaylanmasının ardından yamalara başlanabilir.
