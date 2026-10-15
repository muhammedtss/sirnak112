/* Tıbbi sözlük: tekillik, bağlar, bağlantı hedefleri, MeSH biçimi, doz içermeme ve arama sıralaması. */
import { test } from "node:test";
import assert from "node:assert/strict";
import eriskin from "@/data/eriskin.json";
import cocuk from "@/data/cocuk.json";
import yenidogan from "@/data/yenidogan.json";
import { BOLUMLER } from "@/lib/egitim";
import { ROUTE_SEO } from "@/lib/seo";
import { KISALTMA, SOZLUK, sozlukAra, tanimi, terimById } from "@/lib/sozluk";
import { normalizeTr } from "@/lib/text";

const ALGORITMALAR: Record<string, Record<string, unknown>> = { eriskin, cocuk, yenidogan };

test("Sözlük: yeterli kapsam, kimlik ve terimler tekil", () => {
  assert.ok(SOZLUK.terimler.length >= 700, `terim sayısı ${SOZLUK.terimler.length}`);
  const idler = new Set<string>();
  const adlar = new Set<string>();
  for (const t of SOZLUK.terimler) {
    assert.match(t.id, /^[a-z0-9]+(-[a-z0-9]+)*$/, t.id);
    assert.ok(!idler.has(t.id), `tekrar eden kimlik: ${t.id}`);
    assert.ok(!adlar.has(normalizeTr(t.terim)), `tekrar eden terim: ${t.terim}`);
    idler.add(t.id);
    adlar.add(normalizeTr(t.terim));
  }
});

test("Sözlük: her terimin tanımı var ya da tanımlı bir terime bağlı", () => {
  const kategoriler = new Set(SOZLUK.kategoriler.map(k => k.id));
  for (const t of SOZLUK.terimler) {
    assert.ok(kategoriler.has(t.kat), `${t.terim}: bilinmeyen kategori ${t.kat}`);
    if (t.bak) {
      assert.equal(t.kat, KISALTMA, `${t.terim}: yalnızca kısaltmalar bağlanır`);
      assert.ok(terimById(t.bak)?.tanim, `${t.terim}: bağlı terim (${t.bak}) tanımsız`);
    }
    const { tanim } = tanimi(t);
    assert.ok(tanim.length >= 20, `${t.terim}: tanım çok kısa ya da yok`);
    assert.match(tanim, /[.!?)]$/, `${t.terim}: tanım cümle olarak bitmeli`);
  }
  for (const k of SOZLUK.kategoriler) {
    assert.equal(k.sayi, SOZLUK.terimler.filter(t => t.kat === k.id).length, k.id);
  }
});

test("Sözlük: tanımlarda doz bilgisi yok (dozlar İlaç Dozu modülünde)", () => {
  const DOZ = /\b\d+([.,]\d+)?\s*(mg|mcg|µg|g|mL|ml|IU|ünite)\s*\/\s*kg\b|\bmcg\b|µg/i;
  const ihlal = SOZLUK.terimler.filter(t => t.tanim && DOZ.test(t.tanim)).map(t => t.terim);
  assert.deepEqual(ihlal, []);
});

test("Sözlük: ilgili bağlantılar var olan sayfalara gider", () => {
  const egitimSluglari = new Set(BOLUMLER.map(b => `/egitim/dokumanlar/${b.slug}`));
  const sorunlar: string[] = [];
  for (const t of SOZLUK.terimler) {
    for (const b of t.ilgili ?? []) {
      const alg = b.yol.match(/^\/algoritmalar\/(eriskin|cocuk|yenidogan)\/(SB-ASH-[A-Z]+-\d+)$/);
      const gecerli = alg ? Boolean(ALGORITMALAR[alg[1]][alg[2]]) : b.yol in ROUTE_SEO || egitimSluglari.has(b.yol);
      if (!gecerli) sorunlar.push(`${t.terim} → ${b.yol}`);
      if (!b.ad.trim()) sorunlar.push(`${t.terim}: bağlantı adı boş`);
    }
  }
  assert.deepEqual(sorunlar, []);
});

test("Sözlük: MeSH karşılıkları geçerli biçimde", () => {
  for (const t of SOZLUK.terimler) {
    if (!t.mesh) continue;
    assert.match(t.mesh.id, /^D\d{6}$/, t.terim);
    assert.ok(t.mesh.ad.trim(), t.terim);
  }
});

test("Sözlük araması: Türkçe karakter farkı gözetmez, terim eşleşmesi öne çıkar", () => {
  assert.equal(sozlukAra("kpr")[0]?.terim, "KPR");
  assert.equal(sozlukAra("KOAH")[0]?.terim, "KOAH");
  assert.ok(sozlukAra("kalp durmasi").some(t => t.terim === "Kardiyak arrest"));
  assert.equal(sozlukAra("siyanoz")[0]?.terim, "Siyanoz");
  assert.ok(sozlukAra("heart arrest").some(t => t.terim === "Kardiyak arrest"));
  assert.ok(sozlukAra("apne").some(t => t.terim === "Solunum arresti"));
  assert.equal(sozlukAra("", "travma").length, SOZLUK.kategoriler.find(k => k.id === "travma")?.sayi);
  assert.deepEqual(sozlukAra("bulunmayan-kelime-xyz"), []);
});
