/* ════════════════════════════════════════════════════════════════
   Eğitim kataloğunu SB ASHGM sitesinden yeniden üretir → src/data/egitim.json
     npm run egitim:guncelle
   1) acilafet.saglik.gov.tr "Eğitim" bölümünün dört kategorisini gezer
      (kategori → eğitim/kitap sayfası → alt sayfalar).
   2) Sayfalardaki dosyamerkez.saglik.gov.tr belgelerini ve YouTube videolarını toplar.
   3) Her belgeye HEAD isteğiyle boyut ve erişilebilirlik bakar (404 → "erisilemez").
   4) Video başlıklarını YouTube oEmbed'den alır (kaynak başlıktan farklıysa altBaslik).
   Belgeler indirilmez; yalnızca bağlantı, ad, tür ve boyut kaydedilir.
   Kurum isteğiyle alınmayanlar: "Afiş ve Posterler" kategorisi ve ders programları
   (dikey/yatay program çizelgeleri) — bkz. LISTELENMEZ.
   ════════════════════════════════════════════════════════════════ */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const CIKTI = path.join(ROOT, "src", "data", "egitim.json");
const SRC = "https://acilafet.saglik.gov.tr";
const UA = { "User-Agent": "Mozilla/5.0 (acil-protokol egitim katalog)" };
const KATEGORILER = [
  ["Eğitim Dökümanları", "/TR-121057/egitim-dokumanlari.html"],
  ["Eğitim Videoları", "/TR-121056/egitim-videolari.html"],
  ["Eğitim Kitapları", "/TR-121096/egitim-kitaplari.html"],
];
const HATALAR = [];
const bekle = ms => new Promise(r => setTimeout(r, ms));

/* ── Sayfa okuma ── */
async function getir(yol) {
  const url = new URL(yol, SRC).href; // Türkçe karakterli yollar yüzde kodlanır
  try {
    const res = await fetch(url, { headers: UA, signal: AbortSignal.timeout(40_000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const t = await res.text();
    await bekle(400); // kaynak sunucuya nazik
    return t;
  } catch (e) {
    HATALAR.push([yol, String(e.message ?? e)]);
    return "";
  }
}

const VARLIK = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: "\u00a0", times: "×", ndash: "–", mdash: "—", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“", hellip: "…" };
const cozVarlik = s =>
  s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, v) =>
    v[0] === "#" ? String.fromCodePoint(v[1].toLowerCase() === "x" ? parseInt(v.slice(2), 16) : parseInt(v.slice(1), 10)) : (VARLIK[v] ?? m),
  );
const temiz = s => cozVarlik(s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ")).trim();

function icerik(t) {
  const i = t.indexOf('class="pages_content"');
  if (i < 0) return "";
  let seg = t.slice(i);
  for (const dur of ["<footer", 'class="footer']) {
    const j = seg.indexOf(dur);
    if (j > 0) seg = seg.slice(0, j);
  }
  return seg;
}

/** Kategori/ara sayfa listesindeki öğeler (tr[data-id] içindeki ilk bağlantı). */
function satirlar(t) {
  const out = [];
  for (const m of icerik(t).matchAll(/<tr data-id="(\d+)">([\s\S]*?)<\/tr>/g)) {
    const a = m[2].match(/<a href="([^"]+)"[^>]*title="([^"]*)"/);
    if (a) out.push({ url: a[1], baslik: temiz(a[2]) });
  }
  return out;
}

function sayfaBasligi(t) {
  const m = t.match(/class="pages_content_header"[\s\S]*?<h\d[^>]*>([\s\S]*?)<\/h\d>/);
  return m ? temiz(m[1]) : "";
}

function varliklar(t) {
  const seg = icerik(t);
  const dosyalar = [];
  for (const m of seg.matchAll(/<a[^>]+href="(https?:\/\/dosyamerkez\.saglik\.gov\.tr\/Eklenti\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/g)) {
    dosyalar.push({ url: m[1], ad: temiz(m[2]) || path.posix.basename(m[1]) });
  }
  const videolar = [];
  for (const m of seg.matchAll(/(?:youtube(?:-nocookie)?\.com\/(?:embed\/|watch\?v=|shorts\/)|youtu\.be\/)([\w-]{11})/g)) {
    if (!videolar.includes(m[1])) videolar.push(m[1]);
  }
  return { dosyalar, videolar };
}

async function gez(url, derinlik = 0, gorulen = new Set()) {
  if (gorulen.has(url) || derinlik > 3) return null;
  gorulen.add(url);
  const t = await getir(url);
  if (!t) return { url, baslik: "", dosyalar: [], videolar: [], alt: [], hata: true };
  const dugum = { url, baslik: sayfaBasligi(t), ...varliklar(t), alt: [] };
  for (const r of satirlar(t)) {
    const cocuk = await gez(r.url, derinlik + 1, gorulen);
    if (cocuk) {
      cocuk.baslik ||= r.baslik;
      cocuk.listeBasligi = r.baslik;
      dugum.alt.push(cocuk);
    }
  }
  return dugum;
}

/* ── Belge boyutları (HEAD) ── */
async function boyutlar(urller) {
  const sonuc = new Map();
  const kuyruk = [...new Set(urller)];
  const isci = async () => {
    for (let u; (u = kuyruk.shift()); ) {
      try {
        const res = await fetch(u, { method: "HEAD", headers: { "User-Agent": "Mozilla/5.0" }, signal: AbortSignal.timeout(30_000) });
        sonuc.set(u, { durum: res.status, bayt: Number(res.headers.get("content-length") ?? 0) });
      } catch (e) {
        sonuc.set(u, { durum: String(e.message ?? e), bayt: 0 });
      }
    }
  };
  await Promise.all(Array.from({ length: 6 }, isci));
  return sonuc;
}

async function oembed(id) {
  try {
    const u = "https://www.youtube.com/oembed?format=json&url=" + encodeURIComponent(`https://www.youtube.com/watch?v=${id}`);
    const res = await fetch(u, { signal: AbortSignal.timeout(20_000) });
    return res.ok ? ((await res.json()).title ?? "") : "";
  } catch {
    return "";
  }
}

/* ── Başlık ve ad düzeltmeleri ── */
const KUCUK = new Set(["VE", "İLE", "İÇİN", "VEYA", "DA", "DE"]);
const KISALTMA = new Set(["KBRN", "OED", "TYD", "ASGE", "UMKE", "SKKM"]);
const trKucuk = s => s.replace(/I/g, "ı").replace(/İ/g, "i").toLowerCase();
function trBuyukIlk(w) {
  if (!w) return w;
  if (!/\p{L}/u.test(w[0])) return w[0] + trBuyukIlk(w.slice(1)); // "(SAĞLIK" → "(Sağlık"
  const f = w[0] === "i" ? "İ" : w[0] === "ı" ? "I" : w[0].toUpperCase();
  return f + trKucuk(w.slice(1));
}
/** 'TEMEL EĞİTİM MODÜLÜ (TEM) EĞİTİM DÖKÜMANLARI' → 'Temel Eğitim Modülü (TEM) Eğitim Dökümanları'.
    Parantez içi kısaltmalar ve zaten karışık yazılmış başlıklar korunur. */
function baslik(s) {
  s = s.replace(/\s+/g, " ").trim();
  if (s !== s.toUpperCase()) return s;
  return s
    .split(" ")
    .map((tok, i) => {
      const cekirdek = tok.replace(/^[()]+|[()]+$/g, "").replace(/\.+$/, "");
      if (tok.startsWith("(") && tok.endsWith(")") && /^\p{L}+$/u.test(cekirdek) && cekirdek.length <= 7) return tok; // (TEM), (İLYAD)
      if (/^[A-ZÇĞİÖŞÜ]{2,4}$/.test(cekirdek) && KISALTMA.has(cekirdek)) return tok;
      if (i > 0 && KUCUK.has(tok)) return trKucuk(tok);
      return trBuyukIlk(tok);
    })
    .join(" ");
}

function slug(s) {
  const kisa = s.match(/\(([A-ZÇĞİÖŞÜ]{2,7})\)/);
  if (kisa) s = kisa[1];
  s = trKucuk(s);
  for (const [a, b] of [["ç", "c"], ["ğ", "g"], ["ı", "i"], ["ö", "o"], ["ş", "s"], ["ü", "u"]]) s = s.replaceAll(a, b);
  s = s.normalize("NFD").replace(/\p{M}/gu, "");
  s = s.replace(/\(.*?\)/g, "").replace(/\b(egitim|dokumanlari|dokumanlar)\b/g, "");
  return s.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

const TUR = { ".pptx": "PPTX", ".ppt": "PPT", ".pdf": "PDF", ".docx": "DOCX", ".doc": "DOC", ".xlsx": "XLSX", ".xls": "XLS", ".rar": "RAR", ".zip": "ZIP" };
/** Kaynakta "tıklayınız" gibi genel bağlantı metni olan belgelerin okunur adları (sayfa bağlamından). */
const AD_DUZELT = {
  "oksijen-egitim-rehberi": "Eğitim Rehberi",
  "uygulama-ilkeleri": "Uygulama Kılavuzu",
  "skkmegitim-kitabi20mayis": "SKKM Eğitim Kitabı",
  "ilk-yardim-egitimi-kitabi-mayis-2025": "Sağlık Bakanlığı İlk Yardım Eğitimi Kitabı (Mayıs 2025)",
};
function dosyaAdi(ad, url) {
  for (const [anahtar, dogru] of Object.entries(AD_DUZELT)) if (url.includes(anahtar)) return dogru;
  return ad.trim().replace(/\.(pptx?|pdf|docx?|xlsx?|rar|zip)$/i, "").trim();
}
const okunur = ad => /[A-ZÇĞİÖŞÜ ]/.test(ad);
/** Ders programları listelenmez ("Eğitim Programı Tanıtımı" sunumu gibi ders içerikleri kalır). */
const LISTELENMEZ = /(dikey|yatay).*program|ders program/;

/* ── Çalıştır ── */
const katalog = [];
for (const [ad, url] of KATEGORILER) {
  process.stdout.write(`gezilen: ${ad}\n`);
  const n = await gez(url);
  n.baslik = ad;
  katalog.push(n);
}

const tumDosyaUrl = [];
(function topla(n) {
  n.dosyalar.forEach(f => tumDosyaUrl.push(f.url));
  n.alt.forEach(topla);
})({ dosyalar: [], alt: katalog });
process.stdout.write(`boyut kontrolü: ${new Set(tumDosyaUrl).size} belge\n`);
const boy = await boyutlar(tumDosyaUrl);

function dosyalar(liste) {
  const adlar = new Map();
  for (const f of liste) {
    const a = dosyaAdi(f.ad, f.url);
    if (!adlar.has(f.url) || (okunur(a) && !okunur(adlar.get(f.url)))) adlar.set(f.url, a);
  }
  return [...adlar].filter(([, a]) => !LISTELENMEZ.test(trKucuk(a))).map(([u, a]) => {
    const ext = path.posix.extname(new URL(u).pathname).toLowerCase();
    const b = boy.get(u) ?? {};
    const d = { ad: a, url: u, tur: TUR[ext] ?? ext.replace(/^\./, "").toUpperCase(), bayt: b.bayt ?? 0 };
    if (b.durum !== 200) d.erisilemez = true;
    return d;
  });
}

async function videolar(n, kaynakBaslik) {
  const out = [];
  for (const id of n.videolar) {
    const yt = await oembed(id);
    const b = baslik(kaynakBaslik);
    const v = { id, baslik: b };
    if (yt && trKucuk(yt) !== trKucuk(b)) v.altBaslik = yt;
    out.push(v);
  }
  return out;
}

const kat = Object.fromEntries(katalog.map(c => [c.baslik, c]));
const bugun = new Date();
const cikti = {
  kaynak: SRC + "/TR-120867/egitim.html",
  yayinlayan: "T.C. Sağlık Bakanlığı Acil Sağlık Hizmetleri Genel Müdürlüğü",
  aktarim: `${bugun.getFullYear()}-${String(bugun.getMonth() + 1).padStart(2, "0")}-${String(bugun.getDate()).padStart(2, "0")}`,
  kategoriler: [],
};

// 1) Eğitim Dökümanları: her eğitim bir bölüm (belgeler + varsa alt sayfalardaki videolar)
const bolumler = [];
for (const n of kat["Eğitim Dökümanları"].alt) {
  const b = baslik(n.listeBasligi || n.baslik);
  const vids = [];
  for (const c of n.alt) vids.push(...(await videolar(c, c.listeBasligi || c.baslik)));
  bolumler.push({ slug: slug(b), baslik: b, kaynakUrl: SRC + n.url, dosyalar: dosyalar(n.dosyalar), videolar: vids });
}
cikti.kategoriler.push({ id: "dokumanlar", baslik: "Eğitim Dökümanları", kaynakUrl: SRC + kat["Eğitim Dökümanları"].url, bolumler });

// 2) Eğitim Videoları
const vids = [];
for (const n of kat["Eğitim Videoları"].alt) vids.push(...(await videolar(n, n.listeBasligi || n.baslik)));
cikti.kategoriler.push({ id: "videolar", baslik: "Eğitim Videoları", kaynakUrl: SRC + kat["Eğitim Videoları"].url, videolar: vids });

// 3) Eğitim Kitapları: kaynak sayfası açılmayan kitap da "erisilemez" olarak listelenir
const kitaplar = kat["Eğitim Kitapları"].alt.map(n => {
  const ds = dosyalar(n.dosyalar);
  return { baslik: baslik(n.listeBasligi || n.baslik), kaynakUrl: SRC + n.url, dosyalar: ds, ...(ds.length ? {} : { erisilemez: true }) };
});
cikti.kategoriler.push({ id: "kitaplar", baslik: "Eğitim Kitapları", kaynakUrl: SRC + kat["Eğitim Kitapları"].url, kitaplar });

fs.writeFileSync(CIKTI, JSON.stringify(cikti, null, 1) + "\n");

const erisilemez = cikti.kategoriler.flatMap(c => [...(c.bolumler ?? []), ...(c.kitaplar ?? [])]).flatMap(b => b.dosyalar.filter(d => d.erisilemez).map(d => d.ad));
console.log(`\n${path.relative(ROOT, CIKTI)} yazıldı:`);
for (const c of cikti.kategoriler) {
  const n = c.bolumler?.length ?? c.videolar?.length ?? c.kitaplar?.length ?? c.dosyalar?.length;
  console.log(`  ${c.baslik}: ${n}`);
}
if (erisilemez.length) console.log("  Kaynakta erişilemeyen belgeler:", erisilemez.join(", "));
if (HATALAR.length) console.log("  Açılamayan sayfalar:", HATALAR.map(([y, e]) => `${y} (${e})`).join(", "));
