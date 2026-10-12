/* START ve Jump START: her yol kaynak şemadaki renk koduna gider (ASHGM TİLYAD Triyaj sunumu, s. 24–34). */
import { test } from "node:test";
import assert from "node:assert/strict";
import { getAlgorithmImages } from "@/data/algorithmImages";
import { JUMP_START, START, TRIAJ_AKISLARI, yurut, type TriajAkisi, type TriajKodu } from "@/lib/triaj";

/** Cevaplar seçenek etiketleriyle verilir; okunur ve seçenek sırası değişse de bozulmaz. */
function sonuc(akis: TriajAkisi, etiketler: string[]): TriajKodu | null {
  const cevaplar: number[] = [];
  for (const etiket of etiketler) {
    const { adimlar } = yurut(akis, cevaplar);
    const adim = adimlar[adimlar.length - 1];
    const j = adim.secenekler.findIndex(s => s.etiket === etiket);
    assert.ok(j >= 0, `${akis.id}/${adim.id}: "${etiket}" seçeneği yok`);
    cevaplar.push(j);
  }
  return yurut(akis, cevaplar).kod;
}

test("START: kaynak şemadaki tüm dallar", () => {
  const S = (...e: string[]) => sonuc(START, e);
  assert.equal(S("Yürüyor"), "yesil");
  assert.equal(S("Yürüyemiyor", "Solunum yok", "Solunum var"), "kirmizi"); // başa pozisyon sonrası
  assert.equal(S("Yürüyemiyor", "Solunum yok", "Solunum yok"), "siyah");
  assert.equal(S("Yürüyemiyor", "Solunum var", "10/dk'dan az"), "kirmizi");
  assert.equal(S("Yürüyemiyor", "Solunum var", "30/dk'dan fazla"), "kirmizi");
  assert.equal(S("Yürüyemiyor", "Solunum var", "10–30/dk", "Hayır"), "kirmizi"); // KGD > 2 sn veya distal nabız yok
  assert.equal(S("Yürüyemiyor", "Solunum var", "10–30/dk", "Evet", "Komutlara uymuyor"), "kirmizi");
  assert.equal(S("Yürüyemiyor", "Solunum var", "10–30/dk", "Evet", "Komutlara uyuyor"), "sari");
});

test("Jump START: kaynak şemadaki tüm dallar", () => {
  const J = (...e: string[]) => sonuc(JUMP_START, e);
  assert.equal(J("Yürüyor"), "yesil");
  assert.equal(J("Yürüyemiyor", "Solunum yok", "Solunum var"), "kirmizi"); // başa pozisyon sonrası
  assert.equal(J("Yürüyemiyor", "Solunum yok", "Solunum yok", "Nabız yok"), "siyah"); // karotis
  assert.equal(J("Yürüyemiyor", "Solunum yok", "Solunum yok", "Nabız var", "Solunum var"), "kirmizi"); // 5 soluk sonrası
  assert.equal(J("Yürüyemiyor", "Solunum yok", "Solunum yok", "Nabız var", "Solunum yok"), "siyah");
  assert.equal(J("Yürüyemiyor", "Solunum var", "15/dk'dan az"), "kirmizi");
  assert.equal(J("Yürüyemiyor", "Solunum var", "45/dk'dan fazla"), "kirmizi");
  assert.equal(J("Yürüyemiyor", "Solunum var", "15–45/dk", "Distal nabız yok"), "kirmizi");
  assert.equal(J("Yürüyemiyor", "Solunum var", "15–45/dk", "Distal nabız var", "Komutlara uymuyor"), "kirmizi");
  assert.equal(J("Yürüyemiyor", "Solunum var", "15–45/dk", "Distal nabız var", "Komutlara uyuyor"), "sari");
});

test("Triyaj akışları: her adım ulaşılabilir, her yol bir renk koduyla biter, döngü yok", () => {
  for (const akis of TRIAJ_AKISLARI) {
    const gorulen = new Set<string>();
    const gez = (id: string, yol: string[]) => {
      assert.ok(akis.adimlar[id], `${akis.id}: "${id}" adımı yok`);
      assert.ok(!yol.includes(id), `${akis.id}: döngü ${[...yol, id].join(" → ")}`);
      gorulen.add(id);
      const a = akis.adimlar[id];
      assert.equal(a.id, id);
      assert.ok(a.soru.trim() && a.secenekler.length >= 2, `${akis.id}/${id}`);
      for (const s of a.secenekler) if ("adim" in s.sonuc) gez(s.sonuc.adim, [...yol, id]);
    };
    gez(akis.baslangic, []);
    assert.deepEqual([...gorulen].sort(), Object.keys(akis.adimlar).sort(), `${akis.id}: ulaşılamayan adım`);
  }
});

test("Triyaj: resmi akış şeması görselleri tanımlı (Algoritmayı Gör)", () => {
  for (const akis of TRIAJ_AKISLARI) {
    const gorseller = getAlgorithmImages(akis.algoritmaId);
    assert.ok(gorseller.some(g => g.label === "Akış Şeması"), akis.algoritmaId);
  }
});
