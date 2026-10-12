/* Eğitim kataloğu (src/data/egitim.json): yapı, bağlantı alan adları, tekil kimlikler ve rotalar. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { BOLUMLER, EGITIM, boyutTr, kategori, kisaBaslik } from "@/lib/egitim";
import { ROUTE_SEO } from "@/lib/seo";
import { staticParamsFor } from "@/lib/static-params";

const KAYNAK = /^https:\/\/acilafet\.saglik\.gov\.tr\/TR-\d+\/[^\s]+\.html$/;
const DOSYA = /^https:\/\/dosyamerkez\.saglik\.gov\.tr\/Eklenti\/\d+\/[^\s]+$/;
const YT = /^[\w-]{11}$/;

const tumDosyalar = () => [
  ...kategori("dokumanlar").bolumler.flatMap(b => b.dosyalar),
  ...kategori("kitaplar").kitaplar.flatMap(k => k.dosyalar),
  ...kategori("afisler").dosyalar,
];
const tumVideolar = () => [...kategori("videolar").videolar, ...BOLUMLER.flatMap(b => b.videolar)];

test("Eğitim: kaynak sitedeki dört kategori, aynı sırayla", () => {
  assert.deepEqual(
    EGITIM.kategoriler.map(k => [k.id, k.baslik]),
    [
      ["dokumanlar", "Eğitim Dökümanları"],
      ["videolar", "Eğitim Videoları"],
      ["kitaplar", "Eğitim Kitapları"],
      ["afisler", "Afiş ve Posterler"],
    ],
  );
  assert.match(EGITIM.kaynak, KAYNAK);
  assert.match(EGITIM.aktarim, /^\d{4}-\d{2}-\d{2}$/);
  for (const k of EGITIM.kategoriler) assert.match(k.kaynakUrl, KAYNAK, k.id);
});

test("Eğitim: bölüm kimlikleri tekil ve URL'ye uygun, her bölümde içerik var", () => {
  const sluglar = BOLUMLER.map(b => b.slug);
  assert.equal(new Set(sluglar).size, sluglar.length, "tekrarlanan slug");
  for (const b of BOLUMLER) {
    assert.match(b.slug, /^[a-z0-9]+(-[a-z0-9]+)*$/, b.slug);
    assert.match(b.kaynakUrl, KAYNAK, b.slug);
    assert.ok(b.baslik.trim() && kisaBaslik(b.baslik).trim(), b.slug);
    assert.ok(b.dosyalar.length + b.videolar.length > 0, `${b.slug}: boş bölüm`);
  }
  assert.deepEqual(staticParamsFor("/egitim/dokumanlar/[slug]"), sluglar.map(slug => ({ slug })));
});

test("Eğitim: belgeler yalnızca Bakanlık dosya sunucusuna bağlanır; erişilebilir olanın boyutu bilinir", () => {
  const sorunlar: string[] = [];
  for (const d of tumDosyalar()) {
    if (!DOSYA.test(d.url)) sorunlar.push(`alan adı: ${d.url}`);
    if (!d.ad.trim() || !/^[A-Z0-9]{2,5}$/.test(d.tur)) sorunlar.push(`ad/tür: ${d.url}`);
    if (!d.erisilemez && !(d.bayt > 0)) sorunlar.push(`boyut yok: ${d.url}`);
  }
  assert.deepEqual(sorunlar, []);
  // Aynı bölüm içinde aynı belge iki kez listelenmez
  for (const b of BOLUMLER) assert.equal(new Set(b.dosyalar.map(d => d.url)).size, b.dosyalar.length, b.slug);
  for (const k of kategori("kitaplar").kitaplar) assert.ok(k.dosyalar.length > 0 || k.erisilemez, k.baslik);
});

test("Eğitim: video kimlikleri geçerli YouTube kimliği, her listede tekil", () => {
  tumVideolar().forEach(v => {
    assert.match(v.id, YT);
    assert.ok(v.baslik.trim(), v.id);
  });
  // Kaynakta bazı videolar hem "Eğitim Videoları"nda hem ilgili eğitimin sayfasında yer alır; liste içinde tekrar olmaz.
  for (const liste of [kategori("videolar").videolar, ...BOLUMLER.map(b => b.videolar)]) {
    assert.equal(new Set(liste.map(v => v.id)).size, liste.length);
  }
});

test("Eğitim: kategori sayfalarının SEO kaydı var", () => {
  for (const yol of ["/egitim", ...EGITIM.kategoriler.map(k => `/egitim/${k.id}`)]) assert.ok(ROUTE_SEO[yol], yol);
});

test("Eğitim: dosya boyutu Türkçe biçimde", () => {
  assert.equal(boyutTr(40_274_431), "40,3 MB");
  assert.equal(boyutTr(11_856), "12 KB");
  assert.equal(boyutTr(187_400_000), "187 MB");
  assert.equal(boyutTr(0), "");
});
