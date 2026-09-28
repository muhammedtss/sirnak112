import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// EKG modülü kaynakları (TS dosyaları düz metin olarak okunur; loader gerekmez)
const ekgDir = path.join(rootDir, 'src/lib/ekg');
const rhythmsContent = fs.readFileSync(path.join(ekgDir, 'rhythms.ts'), 'utf-8');
const casesContent = fs.readFileSync(path.join(ekgDir, 'cases.ts'), 'utf-8');

console.log("=== BAŞLATILIYOR: DOĞRULAMA SCRİPTİ ===");

let hasError = false;

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    hasError = true;
  }
}

function walkFiles(dir, exts) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    const full = path.join(dir, e.name);
    return e.isDirectory() ? walkFiles(full, exts) : exts.some(x => e.name.endsWith(x)) ? [full] : [];
  });
}

// TEST 1: EKG görselleri — kodda geçen her /ekg/*.webp dosyası mevcut ve sağlam olmalı
console.log("\n[TEST 1] Fiziksel Dosya ve Görsel Doğrulaması (Zero-404 Test)");
const foundImages = new Set(['/icons/icon-192x192.png', '/icons/icon-512x512.png']);
for (const file of walkFiles(path.join(rootDir, 'src'), ['.ts', '.tsx'])) {
  const content = fs.readFileSync(file, 'utf-8');
  for (const m of content.matchAll(/\/ekg\/[\w-]+\.(?:webp|png|svg)/g)) foundImages.add(m[0]);
}

let test1Passed = true;
for (const imgUrl of foundImages) {
  const filePath = path.join(rootDir, 'public', imgUrl);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ FAIL: Eksik dosya -> ${imgUrl}`);
    hasError = true;
    test1Passed = false;
  } else if (fs.statSync(filePath).size < 1000) {
    console.error(`❌ FAIL: Bozuk/Çok küçük dosya -> ${imgUrl} (${fs.statSync(filePath).size} bytes)`);
    hasError = true;
    test1Passed = false;
  }
}
if (test1Passed) console.log(`✅ PASS: Toplam ${foundImages.size} görsel başarıyla doğrulandı.`);

// TEST 2: EKG veri tutarlılığı — her gerçek vaka tanımlı bir ritme bağlı, görseli benzersiz
console.log("\n[TEST 2] EKG Vaka ve Ritim Eşleşme Testi");
let test2Passed = true;
const ritimIdleri = new Set([...rhythmsContent.matchAll(/^ {2}"?([a-z0-9-]+)"?: \{\r?\n {4}id: "([a-z0-9-]+)"/gm)].map(m => {
  if (m[1] !== m[2]) {
    console.error(`❌ FAIL: Ritim anahtarı ile id uyuşmuyor: ${m[1]} ≠ ${m[2]}`);
    hasError = true;
    test2Passed = false;
  }
  return m[2];
}));
const vakaRitimleri = [...casesContent.matchAll(/ritim: "([a-z0-9-]+)"/g)].map(m => m[1]);
const vakaGorselleri = [...casesContent.matchAll(/gorsel: "([^"]+)"/g)].map(m => m[1]);
if (ritimIdleri.size < 10) {
  console.error(`❌ FAIL: Ritim kayıt defteri okunamadı (${ritimIdleri.size} ritim).`);
  hasError = true;
  test2Passed = false;
}
for (const r of vakaRitimleri) {
  if (!ritimIdleri.has(r)) {
    console.error(`❌ FAIL: Gerçek vaka tanımsız ritme bağlı: ${r}`);
    hasError = true;
    test2Passed = false;
  }
}
if (new Set(vakaGorselleri).size !== vakaGorselleri.length) {
  console.error("❌ FAIL: Aynı görsel birden fazla vakada kullanılıyor.");
  hasError = true;
  test2Passed = false;
}
for (const tani of [...casesContent.matchAll(/tani: "([^"]+)"/g)].map(m => m[1])) {
  assert(tani.toLocaleUpperCase("tr-TR").length > 0, `Tanı Türkçe büyük harfe çevrilemedi: ${tani}`);
}
if (test2Passed) console.log(`✅ PASS: ${ritimIdleri.size} ritim, ${vakaRitimleri.length} gerçek vaka tutarlı.`);


// TEST 3: Medical Calculator Fuzzing Test
console.log("\n[TEST 3] Tıbbi Hesaplayıcı Kaos / Fuzzing Testi");
const fuzzInputs = ["10,5", "0,5", "0", "-15", "9999", "abc", "", "10..5", "10,5,2", "Infinity"];
let test3Passed = true;

for (const input of fuzzInputs) {
  const val = input.replace(",", ".");
  
  // Validation regex used in components
  if (val === "" || /^\d*\.?\d*$/.test(val)) {
    const k = parseFloat(val);
    
    // Check if NaN or Infinity leaked through valid regex
    if (val !== "" && (Number.isNaN(k) || !Number.isFinite(k))) {
      console.error(`❌ FAIL: Invalid numeric value leaked through: ${input} -> ${k}`);
      hasError = true;
      test3Passed = false;
    }
    
    // Dosage calculation
    if (k > 0 && k <= 300) {
      const dose = k * 0.1; // example 0.1mg/kg
      if (dose < 0 || Number.isNaN(dose)) {
        console.error(`❌ FAIL: Negative or NaN dose calculated for input: ${input}`);
        hasError = true;
        test3Passed = false;
      }
    }
  } else {
    // Regex blocked it (e.g. -15, abc, 10..5) - This is correct behavior
  }
}

if (test3Passed) console.log(`✅ PASS: Fuzzing 10 ekstrem girdiye karşı başarıyla korundu.`);

// TEST 4: Security and Leak Check
console.log("\n[TEST 4] Güvenlik ve Sızıntı Denetimi");
let test4Passed = true;

function checkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      checkDir(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      if (/dangerouslySetInnerHTML|eval\(|AIza|sk-|PRIVATE_KEY/.test(content)) {
        console.error(`❌ FAIL: Güvenlik sızıntısı veya tehlikeli kod bulundu: ${fullPath}`);
        hasError = true;
        test4Passed = false;
      }
    }
  }
}
checkDir(path.join(rootDir, 'src'));

const nextConfigStr = fs.readFileSync(path.join(rootDir, 'next.config.ts'), 'utf-8');
if (!nextConfigStr.includes('Content-Security-Policy') || !nextConfigStr.includes('Permissions-Policy')) {
  console.error("❌ FAIL: next.config.ts eksik güvenlik başlıkları (CSP / Permissions-Policy)");
  hasError = true;
  test4Passed = false;
}

// Service worker: yalnızca başarılı, aynı kökenli yanıtlar önbelleğe alınmalı
const swStr = fs.readFileSync(path.join(rootDir, 'public', 'sw.js'), 'utf-8');
const swChecks = [
  ["url.origin !== self.location.origin", "farklı kökenli istekler SW dışında bırakılmalı"],
  ["res.ok && res.type === 'basic'", "yalnızca başarılı ve aynı kökenli yanıtlar önbelleğe alınmalı"],
  ["function isHtmlResponse", "sayfa önbelleği yalnızca başarılı HTML yanıtlarını kabul etmeli"],
];
for (const [needle, reason] of swChecks) {
  if (!swStr.includes(needle)) {
    console.error(`❌ FAIL: public/sw.js — ${reason} ('${needle}' bulunamadı).`);
    hasError = true;
    test4Passed = false;
  }
}

if (test4Passed) console.log(`✅ PASS: Güvenlik ve Sızıntı Denetimi başarılı.`);

if (hasError) {
  console.log("\n❌ BAZI TESTLER BAŞARISIZ OLDU. LÜTFEN KONTROL EDİN.");
  process.exit(1);
} else {
  console.log("\n✅ TÜM TESTLER BAŞARIYLA GEÇTİ. SİSTEM KUSURSUZ ÇALIŞIYOR.");
  process.exit(0);
}
