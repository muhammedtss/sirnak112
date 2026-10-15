/* ════════════════════════════════════════════════════════════════
   Tıbbi sözlük: src/data/sozluk/*.txt → src/data/sozluk.json
     npm run sozluk:derle            (yalnızca derler)
     npm run sozluk:derle -- --mesh  (eksik MeSH karşılıklarını NLM'den çeker)

   Kaynak dosya biçimi (Excel'de "|" ayırıcıyla açılabilir):
     # kategori: <id> | <Kategori adı>
     Terim | Eş anlamlılar (; ile) | İngilizce | Tanım | İlgili (boşlukla)
   İlgili: "Y-09", "C-05", "DY-01" → algoritma; "/yol" → uygulama sayfası.
   Kısaltmalarda 2. sütun açılımdır; tanım boşsa açılımla eşleşen terime bağlanır.

   MeSH (Medical Subject Headings) karşılıkları U.S. National Library of Medicine'den
   NCBI E-utilities ile alınır ve src/data/sozluk-mesh.json'da önbelleklenir.
   ════════════════════════════════════════════════════════════════ */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const KAYNAK = path.join(ROOT, "src", "data", "sozluk");
const CIKTI = path.join(ROOT, "src", "data", "sozluk.json");
const MESH = path.join(ROOT, "src", "data", "sozluk-mesh.json");
const MESH_CEK = process.argv.includes("--mesh");

const hatalar = [];
const hata = (yer, m) => hatalar.push(`${yer}: ${m}`);

/* ── Yardımcılar ── */
const trKucuk = s => s.replace(/I/g, "ı").replace(/İ/g, "i").toLowerCase();
const normal = s =>
  trKucuk(s)
    .replace(/[çğıöşü]/g, c => ({ ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u" })[c])
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/\s+/g, " ")
    .trim();
const slug = s => normal(s).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

/* ── İlgili bağlantı adları: algoritma başlıkları, SEO başlıkları, eğitim bölümleri ── */
const ALG_DOSYA = { Y: "eriskin", C: "cocuk", DY: "yenidogan" };
const algoritmalar = Object.fromEntries(
  Object.entries(ALG_DOSYA).map(([k, d]) => [k, JSON.parse(fs.readFileSync(path.join(ROOT, "src", "data", `${d}.json`), "utf8"))]),
);
const seoMetin = fs.readFileSync(path.join(ROOT, "src", "lib", "seo.ts"), "utf8");
const seoBaslik = Object.fromEntries([...seoMetin.matchAll(/"(\/[^"]*)":\s*\{\s*title:\s*"([^"]+)"/g)].map(m => [m[1], m[2]]));
const egitim = JSON.parse(fs.readFileSync(path.join(ROOT, "src", "data", "egitim.json"), "utf8"));
for (const b of egitim.kategoriler.find(k => k.id === "dokumanlar").bolumler) {
  seoBaslik[`/egitim/dokumanlar/${b.slug}`] = b.baslik.replace(/\s+Eğitim Dökümanları$/, "") + " (Eğitim)";
}
const EK_ADLAR = { "/ekg-egitim/atlas": "EKG Ritim Atlası", "/ilac-doz": "İlaç Dozu", "/icd10": "ICD-10", "/evraklar": "Evraklar", "/envanter": "Ambulans Envanteri", "/gizlilik": "Gizlilik" };

function ilgiliCoz(token, yer) {
  const alg = token.match(/^(DY|Y|C)-(\d{2})$/);
  if (alg) {
    const id = `SB-ASH-${token}`;
    const a = algoritmalar[alg[1]][id];
    if (!a) return hata(yer, `algoritma yok: ${token}`);
    const kat = ALG_DOSYA[alg[1]];
    const etiket = { eriskin: "Erişkin", cocuk: "Çocuk", yenidogan: "Yenidoğan" }[kat];
    return { ad: `${a.title} (${etiket} algoritması)`, yol: `/algoritmalar/${kat}/${id}` };
  }
  if (token.startsWith("/")) {
    const ad = EK_ADLAR[token] ?? seoBaslik[token];
    if (!ad) return hata(yer, `bilinmeyen sayfa: ${token}`);
    return { ad, yol: token };
  }
  return hata(yer, `ilgili biçimi tanınmadı: ${token}`);
}

/* ── Kaynakları oku ── */
const kategoriler = [];
const terimler = [];
for (const dosya of fs.readdirSync(KAYNAK).filter(f => f.endsWith(".txt")).sort()) {
  const satirlar = fs.readFileSync(path.join(KAYNAK, dosya), "utf8").split(/\r?\n/);
  let kat = null;
  satirlar.forEach((satir, i) => {
    const yer = `${dosya}:${i + 1}`;
    const k = satir.match(/^#\s*kategori:\s*([a-z]+)\s*\|\s*(.+)$/);
    if (k) {
      kat = k[1];
      kategoriler.push({ id: kat, ad: k[2].trim() });
      return;
    }
    if (!satir.trim() || satir.startsWith("#")) return;
    if (!kat) return hata(yer, "kategori satırı yok");
    const s = satir.split("|").map(x => x.trim());
    if (s.length < 4 || s.length > 5) return hata(yer, `${s.length} sütun (4–5 olmalı)`);
    const [terim, es, en, tanim, ilgili = ""] = s;
    if (!terim) return hata(yer, "terim boş");
    if (tanim && !/[.!?)]$/.test(tanim)) hata(yer, "tanım nokta ile bitmeli");
    terimler.push({
      id: slug(terim),
      terim,
      es: es ? es.split(";").map(x => x.trim()).filter(Boolean) : [],
      en: en || undefined,
      kat,
      tanim: tanim || undefined,
      ilgili: ilgili.split(/\s+/).filter(Boolean).map(t => ilgiliCoz(t, yer)).filter(Boolean),
      yer,
    });
  });
}

/* ── Tekillik ve kısaltma bağları ── */
const idler = new Map();
for (const t of terimler) {
  if (idler.has(t.id)) hata(t.yer, `"${t.terim}" tekrar ediyor (${idler.get(t.id).yer})`);
  idler.set(t.id, t);
}
const adIndeksi = new Map();
for (const t of terimler.filter(t => t.kat !== "kisaltma")) {
  for (const ad of [t.terim, ...t.es]) if (!adIndeksi.has(normal(ad))) adIndeksi.set(normal(ad), t);
}
for (const t of terimler) {
  if (t.kat === "kisaltma") {
    const hedef = t.es.map(a => adIndeksi.get(normal(a))).find(Boolean);
    if (hedef) t.bak = hedef.id;
  }
  if (!t.tanim && !t.bak) hata(t.yer, `"${t.terim}" için tanım yok ve bağlanacak terim bulunamadı`);
}

/* ── MeSH karşılıkları ── */
const mesh = fs.existsSync(MESH) ? JSON.parse(fs.readFileSync(MESH, "utf8")) : {};
if (MESH_CEK) {
  const eksik = [...new Set(terimler.map(t => t.en).filter(Boolean))].filter(en => !(en in mesh));
  console.log(`MeSH: ${eksik.length} İngilizce terim sorgulanacak`);
  const bekle = ms => new Promise(r => setTimeout(r, ms));
  const E = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";
  const bulunan = {};
  for (const [i, en] of eksik.entries()) {
    try {
      const r = await fetch(`${E}/esearch.fcgi?db=mesh&retmode=json&retmax=5&term=${encodeURIComponent(`"${en}"[MeSH Terms]`)}`);
      const ids = ((await r.json()).esearchresult?.idlist ?? []).filter(id => id.startsWith("68"));
      bulunan[en] = ids;
    } catch (e) {
      console.warn("  hata:", en, e.message);
    }
    if (i % 50 === 49) console.log(`  ${i + 1}/${eksik.length}`);
    await bekle(380);
  }
  const tumIdler = [...new Set(Object.values(bulunan).flat())];
  const ozet = {};
  for (let i = 0; i < tumIdler.length; i += 150) {
    const r = await fetch(`${E}/esummary.fcgi?db=mesh&retmode=json&id=${tumIdler.slice(i, i + 150).join(",")}`);
    const j = (await r.json()).result ?? {};
    for (const id of j.uids ?? []) ozet[id] = { ad: j[id].ds_meshterms?.[0] ?? "", terimler: (j[id].ds_meshterms ?? []).map(x => x.toLowerCase()) };
    await bekle(400);
  }
  for (const [en, ids] of Object.entries(bulunan)) {
    // Tek sonuç ya da İngilizce terimi başlık/eş terim olarak içeren sonuç kabul edilir
    const uygun = ids.length === 1 ? ids[0] : ids.find(id => ozet[id]?.terimler.includes(en.toLowerCase()));
    mesh[en] = uygun && ozet[uygun] ? { id: "D" + uygun.slice(2).padStart(6, "0"), ad: ozet[uygun].ad } : null;
  }
  fs.writeFileSync(MESH, JSON.stringify(Object.fromEntries(Object.entries(mesh).sort(([a], [b]) => a.localeCompare(b))), null, 1) + "\n");
}

/* ── Çıktı ── */
if (hatalar.length) {
  console.error("Sözlük derlenemedi:\n  " + hatalar.join("\n  "));
  process.exit(1);
}
const sirali = terimler.sort((a, b) => a.terim.localeCompare(b.terim, "tr", { sensitivity: "base" }));
const cikti = {
  surum: new Date().toISOString().slice(0, 10),
  meshSurum: "MeSH (U.S. National Library of Medicine), NCBI E-utilities ile alındı",
  kategoriler: kategoriler.map(k => ({ ...k, sayi: terimler.filter(t => t.kat === k.id).length })),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- yer yalnızca hata iletisi için
  terimler: sirali.map(({ yer, ilgili, es, ...t }) => ({
    ...t,
    ...(es.length ? { es } : {}),
    ...(ilgili.length ? { ilgili } : {}),
    ...(t.en && mesh[t.en] ? { mesh: mesh[t.en] } : {}),
  })),
};
fs.writeFileSync(CIKTI, JSON.stringify(cikti) + "\n");
const meshli = cikti.terimler.filter(t => t.mesh).length;
console.log(`${path.relative(ROOT, CIKTI)}: ${cikti.terimler.length} terim, ${kategoriler.length} kategori, ${meshli} MeSH karşılığı`);
for (const k of cikti.kategoriler) console.log(`  ${k.ad}: ${k.sayi}`);
