/* İlaç doz hesabı (src/lib/doz.ts) ve ilaç verisinin hesaplanabilirliği (src/data/ilaclar.json). */
import { test } from "node:test";
import assert from "node:assert/strict";
import ilaclar from "@/data/ilaclar.json";
import { dopaminCcSaat, dozHesapla, kiloGecersiz, kiloGerekli, kiloYuksek, type DoseInfo } from "@/lib/doz";

type Ilac = { id: string; name: string; cases: Record<string, { caseName: string; eriskin: DoseInfo; cocuk: DoseInfo }> };
const ILACLAR = ilaclar as unknown as Record<string, Ilac>;
const info = (ilac: string, vaka: string, yas: "eriskin" | "cocuk") => ILACLAR[ilac].cases[vaka][yas];

test("Kiloya dayalı doz: kg × doz/kg", () => {
  // %0,9 NaCl, hipovolemik şok, çocuk: 20 mL/kg
  assert.equal(dozHesapla(info("0_9_nacl", "hipovolemik_sok", "cocuk"), "0_9_nacl", "20"), "400");
  // Adrenalin, arrest, çocuk: 0,01 mg/kg → 18 kg = 0,18 mg
  assert.equal(dozHesapla(info("adrenalin", "arrest", "cocuk"), "adrenalin", "18"), "0.18");
  // Ondalık sonuç 2 haneye yuvarlanır: 0,15 mg/kg × 13,3 kg = 1,995 → "2.00"
  assert.equal(dozHesapla(info("salbutamol", "astim_koah", "cocuk"), "salbutamol", "13.3"), "2.00");
});

test("Kilo girilmeden veya geçersiz kiloyla doz hesaplanmaz", () => {
  const i = info("0_9_nacl", "hipovolemik_sok", "cocuk");
  for (const w of ["", "0", "abc", "301", "-5"]) assert.equal(dozHesapla(i, "0_9_nacl", w), null, `kilo "${w}"`);
});

test("Kilo doğrulama sınırları", () => {
  assert.equal(kiloGecersiz(""), false); // henüz girilmedi
  assert.equal(kiloGecersiz("0"), true);
  assert.equal(kiloGecersiz("300"), false);
  assert.equal(kiloGecersiz("300.1"), true);
  assert.equal(kiloYuksek("150"), false);
  assert.equal(kiloYuksek("151"), true);
  assert.equal(kiloYuksek("400"), false); // geçersiz kilo "yüksek" sayılmaz, hata gösterilir
});

test("Kontrendike (isAvailable=false) durumda doz yok", () => {
  const kontrendike: DoseInfo = { isAvailable: false, isWeightBased: true, dosePerKg: 1, unit: "mg", fixedDose: null, maxDose: null, route: null, notes: null };
  assert.equal(dozHesapla(kontrendike, "x", "20"), null);
});

test("Dopamin: kilo zorunlu, cc/saat = kg × 1,5", () => {
  for (const vaka of Object.keys(ILACLAR.dopamin.cases)) {
    for (const yas of ["eriskin", "cocuk"] as const) {
      const i = info("dopamin", vaka, yas);
      if (!i.isAvailable) continue;
      assert.equal(kiloGerekli(i, "dopamin"), true);
      assert.equal(dozHesapla(i, "dopamin", ""), null, `${vaka}/${yas} kilosuz`);
    }
  }
  assert.equal(dopaminCcSaat(70), "105.0");
  assert.equal(dopaminCcSaat(12.5), "18.8");
});

test("Veri: kullanılabilir her ilaç/vaka/yaş için doz hesaplanabiliyor ve birimi var", () => {
  const sorunlar: string[] = [];
  for (const [id, ilac] of Object.entries(ILACLAR)) {
    for (const [vaka, c] of Object.entries(ilac.cases)) {
      for (const yas of ["eriskin", "cocuk"] as const) {
        const i = c[yas];
        if (!i || !i.isAvailable) continue;
        const kg = yas === "eriskin" ? "70" : "20";
        const doz = dozHesapla(i, id, kg);
        if (doz === null || doz === "") sorunlar.push(`${id}/${vaka}/${yas}: doz hesaplanamıyor`);
        if (!i.unit) sorunlar.push(`${id}/${vaka}/${yas}: birim yok`);
        if (i.isWeightBased && !(typeof i.dosePerKg === "number" && i.dosePerKg > 0) && !i.fixedDose)
          sorunlar.push(`${id}/${vaka}/${yas}: kiloya dayalı ama doz/kg yok`);
      }
    }
  }
  assert.deepEqual(sorunlar, []);
});
