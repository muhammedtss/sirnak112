/* Veri bütünlüğü: algoritma akışları, ICD-10, görsel dosyaları, rotalar ve kurumsal bilgiler. */
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import eriskin from "@/data/eriskin.json";
import cocuk from "@/data/cocuk.json";
import yenidogan from "@/data/yenidogan.json";
import icd10 from "@/data/icd10.json";
import { algorithmImages } from "@/data/algorithmImages";
import { ROUTE_SEO } from "@/lib/seo";
import { KLINIK_DEGISIKLIKLER, KAYNAKLAR } from "@/lib/site-info";
import { GENEL_YONLENDIRMELER, hedefKategorisi, type AlgoritmaKategorisi } from "@/lib/algoritma";

type Node = { id: string; type: "action" | "decision" | "redirect"; content: string; nextId?: string | null; yesId?: string; noId?: string; targetAlgorithmId?: string };
type Algo = { id: string; title: string; startNodeId: string; nodes: Record<string, Node> };
const KATEGORILER: [string, Record<string, Algo>][] = [
  ["eriskin", eriskin as unknown as Record<string, Algo>],
  ["cocuk", cocuk as unknown as Record<string, Algo>],
  ["yenidogan", yenidogan as unknown as Record<string, Algo>],
];
const ROOT = process.cwd();
const TUMU = Object.fromEntries(KATEGORILER) as Record<AlgoritmaKategorisi, Record<string, Algo>>;

test("Algoritmalar: başlangıç düğümü var, tüm bağlantılar mevcut düğümlere gider", () => {
  const sorunlar: string[] = [];
  for (const [kat, algos] of KATEGORILER) {
    for (const [key, a] of Object.entries(algos)) {
      const yer = `${kat}/${key}`;
      if (a.id !== key) sorunlar.push(`${yer}: id anahtarla aynı değil (${a.id})`);
      if (!a.title?.trim()) sorunlar.push(`${yer}: başlık boş`);
      if (!a.nodes[a.startNodeId]) sorunlar.push(`${yer}: başlangıç düğümü yok (${a.startNodeId})`);
      for (const n of Object.values(a.nodes)) {
        const at = `${yer}#${n.id}`;
        if (!n.content?.trim() && n.type !== "redirect") sorunlar.push(`${at}: içerik boş`);
        for (const hedef of [n.nextId, n.yesId, n.noId]) {
          if (hedef && !a.nodes[hedef]) sorunlar.push(`${at}: olmayan düğüme gidiyor (${hedef})`);
        }
        if (n.type === "decision" && (!n.yesId || !n.noId)) sorunlar.push(`${at}: karar düğümünde evet/hayır dalı eksik`);
        if (n.type === "redirect" && n.targetAlgorithmId) {
          // Uygulamadaki çözümleyiciyle: hedef ya genel yönlendirme ya da bulunduğu kategoride mevcut
          const hedef = n.targetAlgorithmId;
          const hk = hedefKategorisi(hedef);
          if (hk === null && !GENEL_YONLENDIRMELER.has(hedef)) sorunlar.push(`${at}: tanınmayan yönlendirme (${hedef})`);
          if (hk !== null && !TUMU[hk][hedef]) sorunlar.push(`${at}: hedef ${hk} kategorisinde yok (${hedef})`);
        }
      }
    }
  }
  assert.deepEqual(sorunlar, []);
});

test("Algoritmalar: kimlik ön eki bulunduğu kategoriyle aynı (yönlendirme çözümleyicisinin dayanağı)", () => {
  for (const [kat, algos] of KATEGORILER) {
    for (const id of Object.keys(algos)) assert.equal(hedefKategorisi(id), kat, id);
  }
});

test("Algoritmalar: her düğüme başlangıçtan ulaşılabiliyor", () => {
  const ulasilamaz: string[] = [];
  for (const [kat, algos] of KATEGORILER) {
    for (const [key, a] of Object.entries(algos)) {
      const gorulen = new Set<string>();
      const kuyruk = [a.startNodeId];
      while (kuyruk.length) {
        const id = kuyruk.pop()!;
        if (gorulen.has(id) || !a.nodes[id]) continue;
        gorulen.add(id);
        const n = a.nodes[id];
        [n.nextId, n.yesId, n.noId].forEach(h => h && kuyruk.push(h));
      }
      const kalan = Object.keys(a.nodes).filter(id => !gorulen.has(id));
      if (kalan.length) ulasilamaz.push(`${kat}/${key}: ${kalan.join(", ")}`);
    }
  }
  assert.deepEqual(ulasilamaz, []);
});

test("ICD-10: kod biçimi geçerli, kodlar tekil, Türkçe ad dolu", () => {
  const kayitlar = icd10 as { kod: string; ad: string; tr: string; kategori: string }[];
  const gorulen = new Set<string>();
  const sorunlar: string[] = [];
  for (const e of kayitlar) {
    if (!/^[A-Z][0-9]{2}(\.[0-9A-Z]{1,4})?$/.test(e.kod)) sorunlar.push(`biçim: ${e.kod}`);
    if (gorulen.has(e.kod)) sorunlar.push(`tekrar: ${e.kod}`);
    gorulen.add(e.kod);
    if (!e.tr?.trim() || !e.kategori?.trim()) sorunlar.push(`eksik alan: ${e.kod}`);
  }
  assert.deepEqual(sorunlar, []);
  assert.ok(kayitlar.length > 200);
});

test("Algoritma görselleri: listedeki her dosya diskte var", () => {
  const eksik = Object.values(algorithmImages)
    .flat()
    .map(img => img.src)
    .filter(src => !fs.existsSync(path.join(ROOT, "public", decodeURI(src))));
  assert.deepEqual(eksik, []);
});

test("SEO: kayıtlı her rotanın sayfası var, başlık ve açıklama dolu", () => {
  const sorunlar: string[] = [];
  for (const [rota, s] of Object.entries(ROUTE_SEO)) {
    if (!fs.existsSync(path.join(ROOT, "src", "app", rota, "page.tsx"))) sorunlar.push(`sayfa yok: ${rota}`);
    if (!s.title.trim() || s.description.trim().length < 40) sorunlar.push(`zayıf metin: ${rota}`);
  }
  assert.deepEqual(sorunlar, []);
});

test("Kurumsal: klinik değişiklik günlüğü tarih sıralı ve kaynaklar dolu", () => {
  const tarihler = KLINIK_DEGISIKLIKLER.map(d => d.tarih);
  tarihler.forEach(t => assert.match(t, /^\d{4}-\d{2}-\d{2}$/));
  assert.deepEqual([...tarihler].sort().reverse(), tarihler, "en yeni üstte olmalı");
  assert.ok(KAYNAKLAR.length > 0);
  KAYNAKLAR.forEach(k => assert.ok(k.baslik && k.yayinlayan && k.kapsam));
});
