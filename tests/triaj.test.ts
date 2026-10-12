/* START ve Jump START: her yol kaynak şemadaki renk koduna gider (ASHGM TİLYAD Triyaj sunumu, s. 24–34). */
import { test } from "node:test";
import assert from "node:assert/strict";
import eriskin from "@/data/eriskin.json";
import cocuk from "@/data/cocuk.json";
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

/* Algoritmalar / Vaka Protokolleri'ndeki Start Triyaj ve Jump Start Triyaj akışları resmi şemadaki dallarla aynı
   (Tebliğ ambulans ekleri s. 73 ve 138; sunumdaki şemalar aynı). Her yol: verilen cevap metinleri → renk kodu. */
type Dugum = { id: string; type: string; content: string; nextId?: string; yesId?: string; noId?: string; yesText?: string; noText?: string };
function yapraklar(algo: { startNodeId: string; nodes: Record<string, Dugum> }): Record<string, string> {
  const out: Record<string, string> = {};
  const gez = (id: string, yol: string[]) => {
    const n = algo.nodes[id];
    if (n.type === "decision") {
      gez(n.yesId!, [...yol, n.yesText ?? "Evet"]);
      gez(n.noId!, [...yol, n.noText ?? "Hayır"]);
    } else if (n.nextId) gez(n.nextId, yol);
    else out[yol.join(" › ")] = n.content.match(/(YEŞİL|SARI|KIRMIZI|SİYAH) KOD/)?.[1] ?? `?? ${n.content}`;
  };
  gez(algo.startNodeId, []);
  return out;
}

test("Algoritma SB-ASH-Y-41 Start Triyaj: şemadaki tüm dallar", () => {
  const algo = (eriskin as unknown as Record<string, { startNodeId: string; nodes: Record<string, Dugum> }>)["SB-ASH-Y-41"];
  const Y = "Yürüyemiyor", K = "10–30/dk", N = "KGD 2 sn'den kısa ve distal nabız var";
  assert.deepEqual(yapraklar(algo), {
    "Yürüyor": "YEŞİL",
    [`${Y} › Solunum yok › Solunum var`]: "KIRMIZI",
    [`${Y} › Solunum yok › Solunum yok`]: "SİYAH",
    [`${Y} › Solunum var › 10/dk'dan az veya 30/dk'dan fazla`]: "KIRMIZI",
    [`${Y} › Solunum var › ${K} › KGD 2 sn'den uzun veya distal nabız yok`]: "KIRMIZI",
    [`${Y} › Solunum var › ${K} › ${N} › Uyuyor`]: "SARI",
    [`${Y} › Solunum var › ${K} › ${N} › Uymuyor`]: "KIRMIZI",
  });
});

test("Algoritma SB-ASH-C-29 Jump Start Triyaj: şemadaki tüm dallar (A-V-P uygun → sarı)", () => {
  const algo = (cocuk as unknown as Record<string, { startNodeId: string; nodes: Record<string, Dugum> }>)["SB-ASH-C-29"];
  const Y = "Yürüyemiyor", V = "Solunum VAR", YOK = "Solunum YOK", R = "15–45/dk", DN = "Distal nabız VAR";
  assert.deepEqual(yapraklar(algo), {
    "Yürüyor": "YEŞİL",
    [`${Y} › ${YOK} › ${V}`]: "KIRMIZI",
    [`${Y} › ${YOK} › ${YOK} › Nabız YOK`]: "SİYAH",
    [`${Y} › ${YOK} › ${YOK} › Nabız VAR › ${V}`]: "KIRMIZI",
    [`${Y} › ${YOK} › ${YOK} › Nabız VAR › ${YOK}`]: "SİYAH",
    [`${Y} › ${V} › 15/dk'dan az veya 45/dk'dan fazla`]: "KIRMIZI",
    [`${Y} › ${V} › ${R} › Distal nabız YOK`]: "KIRMIZI",
    [`${Y} › ${V} › ${R} › ${DN} › Komutlara uyuyor (A-V-P uygun yanıt)`]: "SARI",
    [`${Y} › ${V} › ${R} › ${DN} › Komutlara uymuyor (Uygunsuz yanıt U-P)`]: "KIRMIZI",
  });
});
