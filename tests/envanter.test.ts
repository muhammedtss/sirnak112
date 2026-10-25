/* Envanter kontrolü: işaret durumu, eksik hesabı ve cihazda üretilen Excel raporu. */
import { test } from "node:test";
import assert from "node:assert/strict";
import zlib from "node:zlib";
import envanterData from "@/data/ambulans-envanter.json";
import {
  adetTemizle,
  bosDurumlar,
  durumlariSakla,
  eksikMiktar,
  envanterRaporu,
  kayitliDurumlar,
  mevcutKarsiliyor,
  raporDosyaAdi,
  raporSatirlari,
  sayimlar,
  tarihSaat,
  type EnvanterIlac,
} from "@/lib/envanter";
import { sutunHarfi } from "@/lib/xlsx";

const veri = envanterData as Record<string, { id: string; name: string; ilaclar: (EnvanterIlac & { gerekliMiktar: string })[] }>;
const acil = veri.acil_yardim;

test("envanter verisi: her ambulansta benzersiz kimlik ve sayısal gerekli miktar", () => {
  for (const [tip, a] of Object.entries(veri)) {
    assert.ok(a.ilaclar.length > 0, tip);
    assert.equal(new Set(a.ilaclar.map(i => i.id)).size, a.ilaclar.length, `${tip}: tekrar eden kimlik`);
    for (const i of a.ilaclar) assert.match(i.gerekliMiktar, /^\d+$/, `${tip}/${i.name}`);
  }
});

test("mevcut adet yalnızca rakam kabul eder", () => {
  assert.equal(adetTemizle("-5"), "5");
  assert.equal(adetTemizle("2.5"), "25");
  assert.equal(adetTemizle("007"), "7");
  assert.equal(adetTemizle("0"), "0");
  assert.equal(adetTemizle("12abc"), "12");
  assert.equal(adetTemizle("123456"), "1234");
  assert.equal(adetTemizle(""), "");
});

test("eksik miktar: girilmeyen adet 0 sayılır, eksi değer çıkmaz", () => {
  assert.equal(eksikMiktar("20", ""), 20);
  assert.equal(eksikMiktar("20", "12"), 8);
  assert.equal(eksikMiktar("20", "25"), 0);
  assert.equal(mevcutKarsiliyor("20", "20"), true);
  assert.equal(mevcutKarsiliyor("20", "19"), false);
  assert.equal(mevcutKarsiliyor("20", ""), false);
});

test("işaretler ambulans tipine göre bellekte ayrı tutulur", () => {
  const d = bosDurumlar(acil.ilaclar);
  d["1"] = { status: "yeterli", mevcutMiktar: "" };
  durumlariSakla("test_tip", d);
  assert.equal(kayitliDurumlar("test_tip", acil.ilaclar)["1"].status, "yeterli");
  assert.equal(kayitliDurumlar("baska_tip", acil.ilaclar)["1"].status, "unchecked");
  // Listeye sonradan eklenen kalem boş başlar
  const fazla = [...acil.ilaclar, { id: "yeni", name: "Yeni", gerekliMiktar: "1" }];
  assert.equal(kayitliDurumlar("test_tip", fazla)["yeni"].status, "unchecked");
});

test("rapor satırları: önce yetersiz, sonra yeterli, en sonda kontrol edilmeyen", () => {
  const d = bosDurumlar(acil.ilaclar);
  d["5"] = { status: "yeterli", mevcutMiktar: "" };
  d["3"] = { status: "yetersiz", mevcutMiktar: "" };
  d["1"] = { status: "yetersiz", mevcutMiktar: "12" };
  const s = raporSatirlari(acil.ilaclar, d);
  assert.deepEqual(
    s.slice(0, 3).map(r => [r.no, r.durum, r.mevcut, r.eksik]),
    [
      [1, "yetersiz", 12, 8],
      [3, "yetersiz", 0, 6],
      [5, "yeterli", null, 0],
    ],
  );
  assert.equal(s[3].durum, "unchecked");
  assert.equal(s[3].eksik, null);
  assert.equal(s.length, acil.ilaclar.length);
  assert.deepEqual(sayimlar(acil.ilaclar, d), { toplam: 39, yeterli: 1, yetersiz: 2, bekleyen: 36 });
});

test("tarih ve dosya adı cihazın yerel saatiyle yazılır", () => {
  const t = new Date(2026, 9, 5, 9, 7);
  assert.equal(tarihSaat(t), "05.10.2026 09:07");
  assert.equal(raporDosyaAdi("acil_yardim", t), "ilac-kontrol-acil-yardim-2026-10-05-0907.xlsx");
  assert.equal(sutunHarfi(0), "A");
  assert.equal(sutunHarfi(25), "Z");
  assert.equal(sutunHarfi(26), "AA");
});

/** STORE biçimli ZIP'i merkez dizinden okur; CRC'yi Node'un zlib'iyle bağımsız denetler. */
function zipAc(buf: Uint8Array): Map<string, string> {
  const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  const son = buf.length - 22;
  assert.equal(dv.getUint32(son, true), 0x06054b50, "merkez dizin sonu");
  const adet = dv.getUint16(son + 10, true);
  let p = dv.getUint32(son + 16, true);
  const dosyalar = new Map<string, string>();
  const dec = new TextDecoder();
  for (let i = 0; i < adet; i++) {
    assert.equal(dv.getUint32(p, true), 0x02014b50);
    const crc = dv.getUint32(p + 16, true);
    const boyut = dv.getUint32(p + 20, true);
    const adUz = dv.getUint16(p + 28, true);
    const yerel = dv.getUint32(p + 42, true);
    const ad = dec.decode(buf.subarray(p + 46, p + 46 + adUz));
    assert.equal(dv.getUint32(yerel, true), 0x04034b50, ad);
    const bas = yerel + 30 + dv.getUint16(yerel + 26, true);
    const icerik = buf.subarray(bas, bas + boyut);
    assert.equal(zlib.crc32(icerik), crc, `${ad} CRC`);
    dosyalar.set(ad, dec.decode(icerik));
    p += 46 + adUz;
  }
  return dosyalar;
}

test("Excel raporu: geçerli OOXML paketi, durumlar ve sayılar doğru hücrelerde", () => {
  const d = bosDurumlar(acil.ilaclar);
  d["1"] = { status: "yetersiz", mevcutMiktar: "12" };
  d["2"] = { status: "yeterli", mevcutMiktar: "" };
  const { dosyaAdi, veri: bayt } = envanterRaporu({
    tip: "acil_yardim",
    ambulansAdi: acil.name,
    ilaclar: acil.ilaclar,
    durumlar: d,
    tarih: new Date(2026, 9, 25, 14, 32),
  });
  assert.equal(dosyaAdi, "ilac-kontrol-acil-yardim-2026-10-25-1432.xlsx");
  const z = zipAc(bayt);
  for (const ad of [
    "[Content_Types].xml",
    "_rels/.rels",
    "xl/workbook.xml",
    "xl/_rels/workbook.xml.rels",
    "xl/styles.xml",
    "xl/sharedStrings.xml",
    "xl/worksheets/sheet1.xml",
    "docProps/core.xml",
    "docProps/app.xml",
  ]) {
    assert.ok(z.has(ad), ad);
  }
  // Excel, extended-properties ad alanı yanlışsa dosyayı hiç açmıyor
  assert.match(z.get("docProps/app.xml")!, /xmlns="http:\/\/schemas\.openxmlformats\.org\/officeDocument\/2006\/extended-properties"/);

  const sst = [...z.get("xl/sharedStrings.xml")!.matchAll(/<t xml:space="preserve">([^<]*)<\/t>/g)].map(m => m[1]);
  const sayfa = z.get("xl/worksheets/sheet1.xml")!;
  const hucre = (ref: string) => {
    const m = sayfa.match(new RegExp(`<c r="${ref}"([^>]*?)(?:/>|><v>([^<]*)</v></c>)`));
    if (!m) return undefined;
    if (m[2] === undefined) return null;
    return m[1].includes('t="s"') ? sst[Number(m[2])] : Number(m[2]);
  };
  assert.equal(hucre("A1"), "Ambulans İlaç Kontrol Raporu");
  assert.equal(hucre("B3"), acil.name);
  assert.equal(hucre("B4"), "25.10.2026 14:32");
  assert.deepEqual(["B8", "B9", "B10", "B11"].map(hucre), [39, 1, 1, 37]);
  assert.equal(hucre("F13"), "Durum");
  // İlk veri satırı yetersiz kalem: No, ad, gerekli, mevcut, eksik, durum
  assert.deepEqual(["A14", "B14", "C14", "D14", "E14", "F14"].map(hucre), [1, "Adrenalin amp 1 mg", 20, 12, 8, "Yetersiz"]);
  assert.deepEqual(["A15", "B15", "C15", "D15", "E15", "F15"].map(hucre), [2, "Lidokain %2 amp", 2, null, 0, "Yeterli"]);
  assert.equal(hucre("F16"), "Kontrol edilmedi");
  assert.match(sayfa, /<autoFilter ref="A13:F52"\/>/);
  // XML'e çıplak & girmez
  assert.ok(!/&(?!amp;|lt;|gt;|quot;)/.test(z.get("xl/sharedStrings.xml")!));
});
