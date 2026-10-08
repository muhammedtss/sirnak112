/* Yanık hesapları: Parkland (SB Hastane Öncesi Akış Şemaları s. 48, 133) ve Lund-Browder. */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  AGE_OPTIONS,
  BURN_ZONES,
  defaultParklandGroup,
  formatPercent,
  parklandEsikKarsilandi,
  parklandSaatlikHiz,
  totalBurnPercent,
  zonePercent,
} from "@/lib/burn";

test("Parkland: saatlik başlangıç hızı = (k × %VYA × kg) / 16", () => {
  assert.equal(parklandSaatlikHiz("buyuk", 70, 20), 175); // (2 × 20 × 70) / 16
  assert.equal(parklandSaatlikHiz("kucuk", 20, 15), 56.25); // (3 × 15 × 20) / 16
  assert.equal(parklandSaatlikHiz("elektrik", 70, 20), 350); // (4 × 20 × 70) / 16
  assert.equal(parklandSaatlikHiz("kucuk", 70, 20), 262.5);
});

test("Parkland: katsayı yaş grubundan gelir (13 yaş üstü/erişkin 2, altı 3)", () => {
  for (const age of ["0", "1", "5", "10"] as const) assert.equal(defaultParklandGroup(age), "kucuk", age);
  for (const age of ["15", "Erişkin"] as const) assert.equal(defaultParklandGroup(age), "buyuk", age);
});

test("Parkland: hastane öncesi sıvı eşiği (≥30 kg → %15, <30 kg → %10)", () => {
  assert.equal(parklandEsikKarsilandi(70, 14.99), false);
  assert.equal(parklandEsikKarsilandi(70, 15), true);
  assert.equal(parklandEsikKarsilandi(30, 14), false); // 30 kg "ve üzeri" grubunda
  assert.equal(parklandEsikKarsilandi(30, 15), true);
  assert.equal(parklandEsikKarsilandi(29.9, 9.9), false);
  assert.equal(parklandEsikKarsilandi(29.9, 10), true);
});

test("Lund-Browder: her yaş grubunda tüm bölgelerin toplamı %100", () => {
  const ids = BURN_ZONES.map(z => z.id);
  for (const age of AGE_OPTIONS) {
    const sum = BURN_ZONES.reduce((s, z) => s + zonePercent(z, age), 0);
    assert.ok(Math.abs(sum - 100) < 0.01, `${age}: toplam %${sum}`);
    assert.equal(totalBurnPercent(ids, age), 100, age);
  }
});

test("Lund-Browder: yaşla değişen bölgeler tabloyla aynı", () => {
  const head = BURN_ZONES.find(z => z.region === "head")!;
  assert.equal(zonePercent(head, "0"), 9.5);
  assert.equal(zonePercent(head, "15"), 4.5);
  const thigh = BURN_ZONES.find(z => z.region === "thigh")!;
  assert.equal(zonePercent(thigh, "0"), 2.75);
  const leg = BURN_ZONES.find(z => z.region === "leg")!;
  assert.equal(zonePercent(leg, "10"), 3);
});

test("Yanık: seçimsiz toplam 0, bilinmeyen bölge yok sayılır", () => {
  assert.equal(totalBurnPercent([], "Erişkin"), 0);
  assert.equal(totalBurnPercent(["yok-boyle-bolge"], "Erişkin"), 0);
});

test("Yüzde biçimi Türkçe ondalık", () => {
  assert.equal(formatPercent(3.5), "3,5");
  assert.equal(formatPercent(2.75), "2,75");
  assert.equal(formatPercent(13), "13");
});
