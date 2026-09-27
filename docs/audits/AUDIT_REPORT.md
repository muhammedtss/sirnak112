# YÖNETİCİ ÖZETİ (EXECUTIVE SUMMARY) VE AKSİYON PLANI

## 1. Sağlık ve Güvenlik Skoru (100 Üzerinden)
- **Güvenlik (Security): 65/100** - `serialize-javascript`'teki kritik RCE/ReDoS zafiyeti ve eksik HTTP başlıkları (Security Headers) nedeniyle acil iyileştirme gerektiriyor.
- **Mantıksal Doğruluk (Business Logic): 50/100** - Türkçe locale hatası nedeniyle eğitim içeriğinin yarısı gizli durumda. Sınav modunda puanın eksiye inmemesi güzel ancak sonsuz puan kırılabilmesi büyük bir mantık hatası. Ayrıca çift tıklama kaynaklı beyaz ekran (White Screen) oldukça tehlikeli.
- **Kod Kalitesi & Performans (Code Quality): 60/100** - Hydration hataları (SSR) ve `DigitalCaliper` bileşenindeki saniyede 60 kez Event Listener tak-çıkar yapan darboğaz sistemi yoruyor. Error boundary (Hata sınırları) eksik.
- **Mobil UX (Kullanıcı Deneyimi): 75/100** - Yatay overflow kilitlenmeleri (touch-none) pergel için doğru ayarlanmış ve UI geneli temiz, ancak SSR kaynaklı arayüz kırpışmaları puanı düşürüyor.

## 2. Önceliklendirilmiş Triyaj Tablosu

| ID | Önem | Kategori | Sorun Özeti | Dosya |
|---|---|---|---|---|
| SEC-01 | **Kritik (P0)** | Güvenlik | `serialize-javascript` RCE/ReDoS Zafiyeti | `package-lock.json` |
| BUG-01 | **Kritik (P0)** | İş Mantığı | Çift Tıklama (Race Condition) ile Sınav Motorunun Çökmesi (WSOD) | `EkgExamSimulator.tsx` |
| UI-02 | **Kritik (P0)** | Performans | SSR Hydration Uyuşmazlığı (`Math.random()`) ve Arayüz Kırpışması | `EkgExamSimulator.tsx` |
| UI-01 | **Yüksek (P1)** | Performans | Dijital Pergel Event Listener Darboğazı ve Bellek Sızıntısı | `DigitalCaliper.tsx` |
| SEC-02 | **Yüksek (P1)** | Güvenlik | Eksik HTTP Güvenlik Başlıkları (CSP, HSTS vs.) | `next.config.ts` |
| BUG-02 | **Orta (P2)** | İş Mantığı | Sınav modunda hatalı tıklama sonsuz döngüsü (Puan Sömürüsü) | `EkgExamSimulator.tsx` |
| BUG-03 | **Orta (P2)** | İş Mantığı | Türkçe karakter dönüşüm hatası (Klinik notların kaybolması) | `EkgGuidedEducation.tsx` |
| UI-03 | **Orta (P2)** | UX / Güvenlik| Uygulama çökmesini yöneten global `error.tsx` eksikliği | `src/app/error.tsx` |
| SEC-03 | **Düşük (P3)** | Güvenlik | `localStorage` tür güvenliği (Type Safety) eksikliği | `ThemeToggle.tsx` |

## 3. Adım Adım Yama (Patch) İş Emri Listesi

Mevcut hiçbir özelliği bozmadan ve geriye dönük uyumluluğu koruyarak aşağıdaki sırayla ilerlenmelidir:

- **Paket 1 (Kritik Yamalar):**
  - **SEC-01:** Bağımlılıkların yükseltilmesi (`next-pwa` ve `serialize-javascript` yaması).
  - **BUG-01:** Sınav motorundaki çift tıklama `cases.length` taşma hatasının State Closure düzeltmesi.
  - **UI-02:** SSR ve Client Side uyumsuzluğunu (Hydration Mismatch) gidermek için rastgeleleştirmenin `useEffect` içine alınması.
- **Paket 2 (Mantıksal & State Yamaları):**
  - **BUG-02:** Sınav modunda hatalı seçeneklerin disable edilerek ceza puanı sömürüsünün engellenmesi.
  - **BUG-03:** Türkçe locale kaynaklı `toUpperCase()` yerine `toLocaleUpperCase('tr-TR')` kullanılarak gizli Klinik Mekanizma metinlerinin görünür hale getirilmesi.
- **Paket 3 (Mobil & Performans Yamaları):**
  - **UI-01:** `DigitalCaliper` bileşenindeki Event Listener darboğazının `useRef` entegrasyonuyla çözülmesi.
  - **UI-03:** Sistemin tamamını koruyacak global `src/app/error.tsx` hata sınırının (Error Boundary) eklenmesi.
  - **SEC-02 & SEC-03:** `next.config.ts` Security Header eklemeleri ve `ThemeToggle.tsx` localStorage tip güvenliğinin sağlanması.

---

# BÖLÜM 1: GÜVENLİK VE ALTYAPI BULGULARI

[ID: SEC-01]
Önem Derecesi: YÜKSEK
Dosya ve Satır Numarası: `package-lock.json` / `node_modules/serialize-javascript`
Zafiyetin/Hatanın Teknik Açıklaması ve Sömürü Senaryosu (PoC):
Projede kullanılan `@ducanh2912/next-pwa` ve alt bağımlılığı olan `workbox-webpack-plugin` üzerinden projeye dahil olan `serialize-javascript <=7.0.4` kütüphanesinde CVE-2020-36604 (Remote Code Execution) ve ReDoS (Düzenli İfade Hizmet Reddi) zafiyetleri tespit edilmiştir (`npm audit` yüksek seviyeli bulgusu). Özellikle build esnasında özel veya manipüle edilmiş stringler bu kütüphaneye girdi olarak verilirse hafıza tükenmesi ve çökmelere (DoS) sebep olabilir.
Kesin Çözüm Kodu:
Bağımlılık ağacının zorunlu olarak yükseltilmesi gerekir.
```diff
- "@ducanh2912/next-pwa": "^10.2.9"
+ "@ducanh2912/next-pwa": "latest"
```
Buna ek olarak `npm audit fix --force` komutunun kontrollü şekilde çalıştırılması önerilir.

---

[ID: SEC-02]
Önem Derecesi: ORTA
Dosya ve Satır Numarası: `next.config.ts` (Satır 1-8)
Zafiyetin/Hatanın Teknik Açıklaması ve Sömürü Senaryosu (PoC):
Next.js yapılandırma dosyasında (next.config.ts) gerekli olan hiçbir HTTP Güvenlik Başlığı (Security Headers) tanımlanmamıştır. İçerik Güvenlik Politikası (CSP), Strict-Transport-Security (HSTS), X-Frame-Options (Clickjacking koruması) eksiktir. Saldırgan uygulamayı iframe içerisinde çalıştırarak Clickjacking (Tıklama Gaspı) saldırıları düzenleyebilir.
Kesin Çözüm Kodu (Diff formatında):
```diff
--- next.config.ts
+++ next.config.ts
@@ -1,8 +1,24 @@
 import type { NextConfig } from "next";
 
+const securityHeaders = [
+  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
+  { key: 'X-Content-Type-Options', value: 'nosniff' },
+  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
+  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
+  { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:;" }
+];
+
 const nextConfig: NextConfig = {
-  /* config options here */
+  async headers() {
+    return [
+      {
+        source: '/(.*)',
+        headers: securityHeaders,
+      },
+    ];
+  },
 };
 
 export default nextConfig;
```

---

[ID: SEC-03]
Önem Derecesi: DÜŞÜK
Dosya ve Satır Numarası: `src/components/layout/ThemeToggle.tsx` (Satır 12-16)
Zafiyetin/Hatanın Teknik Açıklaması ve Sömürü Senaryosu (PoC):
İstemci tarafı (Client-Side) depolama verisi `localStorage.getItem("theme")` ile çekilmekte, ancak `as "dark" | "light" | null` ile tip zorlaması yapılarak Runtime validasyonu atlanmaktadır. 
PoC: Tarayıcı konsolunda `localStorage.setItem("theme", "invalid-theme-injection")` komutu çalıştırılıp sayfa yenilendiğinde uygulama tip güvenliğini yok sayar. Doğrudan `document.documentElement.setAttribute("data-theme", "invalid-theme-injection")` kodu çalışır. CSS modülü geçersiz duruma düştüğü için uygulamanın tüm renk ve stil mekanizması bozulur (UI Denial of Service). Runtime Type Guard eksiktir.
Kesin Çözüm Kodu (Diff formatında):
```diff
--- src/components/layout/ThemeToggle.tsx
+++ src/components/layout/ThemeToggle.tsx
@@ -9,12 +9,13 @@
 
   useEffect(() => {
     setMounted(true);
-    const savedTheme = localStorage.getItem("theme") as "dark" | "light" | null;
-    if (savedTheme) {
+    const rawTheme = localStorage.getItem("theme");
+    const isValidTheme = rawTheme === "dark" || rawTheme === "light";
+    if (isValidTheme) {
-      setTheme(savedTheme);
-      document.documentElement.setAttribute("data-theme", savedTheme);
+      setTheme(rawTheme as "dark" | "light");
+      document.documentElement.setAttribute("data-theme", rawTheme);
     } else {
       // Default to dark as per premium app requirements
       document.documentElement.setAttribute("data-theme", "dark");
+      localStorage.setItem("theme", "dark");
     }
   }, []);
```

# BÖLÜM 2: İŞ MANTIĞI, HESAPLAMA VE STATE HATALARI

[ID: BUG-01]
Önem Derecesi: YÜKSEK
Dosya: `src/components/ekg/EkgExamSimulator.tsx:106-112`
Tetiklenme Senaryosu (Adım adım nasıl patlar?):
Çift Tıklama Race Condition zafiyeti (Stale Closure). Kullanıcı vaka sonundaki "Sıradaki Vakaya Geç" butonuna (`handleNextCase`) hızlıca iki kez (double-click) tıkladığında:
1. İlk tıklama, `currentCaseIndex < cases.length - 1` kontrolünü geçer ve `setCurrentCaseIndex(i => i + 1)` tetiklenir.
2. React state'i henüz batch (toplu) olarak güncellemediği veya re-render bitmediği için ikinci tıklama da aynı closure üzerinden geçer. Tekrar `(i) => i + 1` tetiklenir.
3. Index, dizinin maksimum uzunluğunu aşarak `cases.length` değerine ulaşır.
4. Bu durumda `currentCase = cases[cases.length]` kodu `undefined` döner. Ardından 177. satırdaki `if (!currentCase) return null;` bloğu çalışır ve tüm sınav ekranı tamamen beyaz/boş (White Screen of Death) kalır. Sınav karnesi görüntülenemez.
Kesin Çözüm Kodu:
State güncellemesinde okuma/yazma senkronizasyonunu sağlamak için state içindeki closure değerini doğrudan vermeliyiz:
```diff
--- src/components/ekg/EkgExamSimulator.tsx
+++ src/components/ekg/EkgExamSimulator.tsx
@@ -106,7 +106,7 @@
   const handleNextCase = () => {
     if (currentCaseIndex < cases.length - 1) {
-      setCurrentCaseIndex((i) => i + 1);
+      setCurrentCaseIndex(currentCaseIndex + 1);
     } else {
       setIsFinished(true);
     }
   };
```

---

[ID: BUG-02]
Önem Derecesi: ORTA
Dosya: `src/components/ekg/EkgExamSimulator.tsx:82-104`
Tetiklenme Senaryosu (Adım adım nasıl patlar?):
Puan Kırma Sonsuz Döngüsü (Infinite Score Drain). Kullanıcı yanlış bir şıkka tıkladığında `handleOptionClick` bloğunda `setScore((s) => Math.max(0, s - 5))` çalışıyor ve ekrana bir uyarı basılıyor, ancak hatalı seçenek disable (etkisiz) hale gelmiyor! 
1. Kullanıcı bir soruya girip yanlış olan bir cevaba sinirlenip (veya fare bozukluğundan) art arda saniyede 10 kere tıklar.
2. Hiçbir lock-out / throttling mekanizması olmadığı için her bir tıklama olayında hesaptan anında 5 puan düşülür.
3. Tek bir soru üzerinden, normalde -5 ceza alınması gerekirken, puan 0'a kadar hızla tükenir ve vaka sınavı haksızca mahvolur.
Kesin Çözüm Kodu:
Tıklanan hatalı şıklar bir dizide tutulmalı ve butonu devre dışı bırakmalıdır.
```diff
--- src/components/ekg/EkgExamSimulator.tsx
+++ src/components/ekg/EkgExamSimulator.tsx
@@ -43,2 +43,3 @@
   const [fullScreenMode, setFullScreenMode] = useState(false);
+  const [wrongAttempts, setWrongAttempts] = useState<string[]>([]);
 
@@ -54,2 +55,3 @@
     setCaliperOpen(false);
+    setWrongAttempts([]);
   }, [currentCaseIndex, step]); // step değişince de sıfırlanmalı
@@ -90,2 +92,3 @@
         setTotalErrors((e) => e + 1);
+        setWrongAttempts((prev) => [...prev, opt]);
         setErrorMsg("Hatalı değerlendirme (-5 Puan). Traseyi tekrar inceleyin.");
@@ -351,2 +354,3 @@
                         onClick={() => handleOptionClick(opt)}
+                        disabled={wrongAttempts.includes(opt)}
-                        className="text-left p-3.5 rounded-xl border border-slate-700 bg-slate-800/90 hover:bg-slate-700 hover:border-blue-500/60 text-sm font-semibold text-slate-100 transition-all active:scale-[0.99]"
+                        className={`text-left p-3.5 rounded-xl border transition-all ${wrongAttempts.includes(opt) ? "bg-red-500/10 border-red-500/40 text-red-400 opacity-50 cursor-not-allowed" : "border-slate-700 bg-slate-800/90 hover:bg-slate-700 hover:border-blue-500/60 text-sm font-semibold text-slate-100 active:scale-[0.99]"}`}
                       >
```

---

[ID: BUG-03]
Önem Derecesi: ORTA
Dosya: `src/components/ekg/EkgGuidedEducation.tsx:75-79` ve `470. satır`
Tetiklenme Senaryosu (Adım adım nasıl patlar?):
Kalıcı Şema Eşleşmeme Hatası (Turkish Locale Case Sensivity Bug). Uygulama içerisindeki "Klinik Mekanizma" eğitim notları, kullanıcının seçtiği EKG tanısına göre dinamik olarak çekiliyor.
1. Kullanıcı "Sinüs Ritmi" vakasına tıklar.
2. `getNotesForCase` fonksiyonu: `c.tani.toUpperCase()` fonksiyonunu çalıştırır. (Javascript yerel standardı)
3. Türkçe'deki küçük "i" harfi büyük "I" olarak çevrilir. (`"SINÜS RITMI"`)
4. Uygulama `"SINÜS RITMI".includes("SİNÜS RİTMİ")` şeklinde arama yapar. Sonuç her zaman `FALSE` çıkar.
5. Benzer şekilde `taniUpper.includes("FİBRİLASYON")` ifadesinde `Atriyal Fibrilasyon` çevrimi sonucu `FIBRILASYON` arandığı için eşleşmez. 
6. EKG Atlasında (Faz 3) hiçbir "Klinik Mekanizma" notu görüntülenmez. Öğretici içerik gizli kalır. Ayrıca (Faz 4) Taşikardi Sınıflandırma Ağacındaki matrix tıklamaları inaktif (gri) durumda kilitlenir.
Kesin Çözüm Kodu:
Türkçe karakter dönüşüm hatasını engellemek için `toLocaleUpperCase("tr-TR")` kullanılmalıdır:
```diff
--- src/components/ekg/EkgGuidedEducation.tsx
+++ src/components/ekg/EkgGuidedEducation.tsx
@@ -73,3 +73,3 @@
   const getNotesForCase = (c: any) => {
     if (!c) return [];
-    const taniUpper = c.tani.toUpperCase();
+    const taniUpper = c.tani.toLocaleUpperCase("tr-TR");
     const allNotes = [...(mod6.verbatimContent.notes || []), ...(mod7.verbatimContent.notes || []), ...(mod4.verbatimContent.notes || [])];
@@ -469,3 +469,3 @@
                   {(rhythms as string[]).map(r => {
-                    const matchIdx = allCases.findIndex((c: any) => c.tani.toUpperCase().includes(r.toUpperCase()) || r.toUpperCase().includes(c.tani.toUpperCase()));
+                    const matchIdx = allCases.findIndex((c: any) => c.tani.toLocaleUpperCase("tr-TR").includes(r.toLocaleUpperCase("tr-TR")) || r.toLocaleUpperCase("tr-TR").includes(c.tani.toLocaleUpperCase("tr-TR")));
                     return (
```

# BÖLÜM 3: PERFORMANS, BELLEK VE MOBİL UI/UX HATALARI

[ID: UI-01]
Önem Derecesi: YÜKSEK
Dosya: `src/components/ekg/DigitalCaliper.tsx:28-56`
Teknik Sebep: Event Listener Darboğazı ve GC Thrashing. Sürükleme (Drag) işlemlerini yakalayan `useEffect` hook'unun bağımlılık dizisine (dependency array) `leftLeg` ve `rightLeg` state'leri eklenmiştir. Kullanıcı mobil cihazda veya webde pergeli sürüklerken, bu state'ler saniyede 60 kare (60fps) güncellenir. Her bir güncelleme (her piksel değişimi) `useEffect` temizlik fonksiyonunu tetikleyerek `window.removeEventListener` ve hemen ardından `window.addEventListener` işlemlerini saniyede 60 kez çalıştırır. Bu Event Listener sök-tak işlemi (thrashing) cihaz pilini hızla tüketir, Garbage Collector üzerinde muazzam bir baskı oluşturur ve pergelin kasılarak hareket etmesine (jank) neden olur.
Kesin Çözüm Kodu: State'lerin referanslarını tutan bir `useRef` oluşturulmalı ve bağımlılıklardan state'ler çıkartılmalıdır.
```diff
--- src/components/ekg/DigitalCaliper.tsx
+++ src/components/ekg/DigitalCaliper.tsx
@@ -21,2 +21,6 @@
 
+  const leftRef = useRef(leftLeg);
+  const rightRef = useRef(rightLeg);
+  leftRef.current = leftLeg;
+  rightRef.current = rightLeg;
+
   const [windowStart, setWindowStart] = useState(60);
@@ -34,5 +38,5 @@
         if (dragging === "left") {
-          setLeftLeg(Math.min(x, rightLeg - 15));
+          setLeftLeg(Math.min(x, rightRef.current - 15));
         } else if (dragging === "right") {
-          setRightLeg(Math.max(x, leftLeg + 15));
+          setRightLeg(Math.max(x, leftRef.current + 15));
         }
@@ -54,3 +58,3 @@
     };
-  }, [dragging, leftLeg, rightLeg, mode, windowWidth]);
+  }, [dragging, mode, windowWidth]);
```

---

[ID: UI-02]
Önem Derecesi: YÜKSEK
Dosya: `src/components/ekg/EkgExamSimulator.tsx:28-34`
Teknik Sebep: Deterministik Olmayan SSR ve Hydration Mismatch. `cases` ve soru `options` listeleri, `useMemo` kullanılarak render sırasında `Math.random() - 0.5` ile karıştırılıyor. Next.js, sunucu tarafı oluşturmasında (SSR) ayrı bir rastgele dizi, istemci tarafı ayağa kalktığında (Hydration) ayrı bir rastgele dizi hesaplar. React DOM ağacı, sunucudan gelen HTML ile kendi hafızasındaki HTML'in birbirini tutmadığını gördüğü an (Hydration failed) sayfa içeriklerini anlık olarak kırpar (Flash of content) ve client-side loglarını hataya boğarak stabiliteyi bozar. 
Kesin Çözüm Kodu: Randomlaştırma işlemi `useMemo` yerine yalnızca `useEffect` hook'u içinde (yani istemci ayağa kalktıktan sonra) gerçekleştirilmelidir.
```diff
--- src/components/ekg/EkgExamSimulator.tsx
+++ src/components/ekg/EkgExamSimulator.tsx
@@ -27,9 +27,10 @@
 export default function EkgExamSimulator() {
-  const cases = useMemo(() => {
+  const [cases, setCases] = useState<any[]>([]);
+  useEffect(() => {
     const mod6 = SIRNAK_112_EKG_DATA.find((m) => m.id === "mod-6-hizli-ritim-vakalari")?.interactivePayload?.cases || [];
     const mod7 = SIRNAK_112_EKG_DATA.find((m) => m.id === "mod-7-yavas-ritim-vakalari")?.interactivePayload?.cases || [];
     const combined = [...mod6, ...mod7];
-    return combined.sort(() => Math.random() - 0.5);
-  }, []);
+    setCases(combined.sort(() => Math.random() - 0.5));
+  }, []);
 
   const [currentCaseIndex, setCurrentCaseIndex] = useState(0);
@@ -176,3 +177,3 @@
 
-  if (!currentCase) return null;
+  if (cases.length === 0 || !currentCase) return null;
```

---

[ID: UI-03]
Önem Derecesi: ORTA
Dosya: `src/app/error.tsx` (Eksik Dosya)
Teknik Sebep: ErrorBoundary Eksikliği. Next.js App Router yapısında `error.tsx` bulunmadığı için uygulama ağacının herhangi bir bileşeninde ortaya çıkabilecek bir JavaScript mantık hatası veya veri yükleme çökmesi global olarak yakalanamıyor. Hatalı bir render gerçekleştiğinde kullanıcı (doktor/öğrenci) doğrudan boş, beyaz bir ekrana düşecek ve uygulamayı ancak sayfayı sert bir şekilde F5 (yenileme) atarak kurtarabilecektir. Bu da test veya eğitim ortasında korkutucu ve kırılgan bir UX deneyimi yaratır.
Kesin Çözüm Kodu: Kök dizine `src/app/error.tsx` oluşturularak kurtarıcı bir Error Boundary yerleştirilmelidir.
```tsx
"use client";
export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
      <h2 className="text-xl font-bold text-red-400 mb-4">Uygulama Hatası</h2>
      <p className="text-slate-400 mb-6">{error.message || "Bilinmeyen bir hata oluştu."}</p>
      <button onClick={() => reset()} className="px-6 py-2 bg-slate-800 text-white rounded-lg font-bold">
        Yeniden Dene
      </button>
    </div>
  );
}
```
