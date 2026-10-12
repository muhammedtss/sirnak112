/* Ventilatör başlangıç ayarı: tidal volüm 6–8 mL/kg (2026-10-12 yönetmelik güncellemesi). */
import { test } from "node:test";
import assert from "node:assert/strict";
import { dakikaVolumu, tidalVolum, TIDAL_ML_KG } from "@/lib/ventilator";

test("Tidal volüm aralığı 6–8 mL/kg", () => {
  assert.deepEqual(TIDAL_ML_KG, { min: 6, max: 8 });
  assert.deepEqual(tidalVolum(70), { min: "420", max: "560" });
  assert.deepEqual(tidalVolum(62.5), { min: "375", max: "500" });
});

test("Dakika volümü = tidal volüm × solunum sayısı", () => {
  assert.deepEqual(dakikaVolumu(70, 12), { min: "5.0", max: "6.7" }); // 420×12, 560×12 mL
  assert.deepEqual(dakikaVolumu(70, 10), { min: "4.2", max: "5.6" });
});
