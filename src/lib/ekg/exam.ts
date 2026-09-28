import {
  RITIMLER,
  RITIM_ETIKET,
  P_ETIKET,
  PQRS_ETIKET,
  QRS_ETIKET,
  DEGERLENDIRME_ADIMLARI,
  hizSinifi,
  type PQrsIliskisi,
  type RitimAnalizi,
  type RitimId,
} from "./rhythms";
import { GERCEK_VAKALAR, type GercekVaka } from "./cases";
import { uret, rastgeleSeed, type UretilmisSerit } from "./generator";

/* ════════════════════════════════════════════════════════════════
   Sınav motoru.
   Her soru, kaynaktaki 5 adımlı değerlendirme + tanı adımlarından
   oluşur (arrest ritimlerinde: tanı + şok kararı). Vakalar kaynak
   sunumdaki gerçek EKG'ler ile üretilmiş şeritlerin karışımıdır.
   ════════════════════════════════════════════════════════════════ */

export type Kapsam = "hizli" | "yavas" | "arrest" | "karisik";

export const KAPSAMLAR: { id: Kapsam; baslik: string; aciklama: string }[] = [
  { id: "hizli", baslik: "Hızlı ritimler", aciklama: "Taşikardiler: dar/geniş, düzenli/düzensiz" },
  { id: "yavas", baslik: "Yavaş ritimler", aciklama: "Sinüs bradikardisi ve AV bloklar" },
  { id: "arrest", baslik: "Arrest ritimleri", aciklama: "VF, nabızsız VT, asistoli, NEA" },
  { id: "karisik", baslik: "Karışık", aciklama: "Tüm ritimlerden" },
];

export type AdimTuru = "ritim" | "hiz" | "pDalgasi" | "pQrs" | "qrs" | "tani" | "sok";

export interface Secenek {
  id: string;
  etiket: string;
}

export interface SoruAdimi {
  tur: AdimTuru;
  baslik: string;
  soru: string;
  ipucu?: string;
  secenekler: Secenek[];
  dogru: string;
  aciklama: string;
}

export type SoruSeridi = { tur: "gercek"; vaka: GercekVaka } | { tur: "uretilmis"; serit: UretilmisSerit };

export interface Soru {
  id: string;
  ritim: RitimId;
  serit: SoruSeridi;
  senaryo?: string;
  adimlar: SoruAdimi[];
}

const RITIM_HAVUZU: Record<Exclude<Kapsam, "karisik">, RitimId[]> = {
  hizli: ["sinus-tasikardisi", "svt", "atriyal-flatter", "atriyal-fibrilasyon", "ventrikuler-tasikardi", "dal-blogu-af", "torsades"],
  yavas: ["sinus-bradikardisi", "av-blok-1", "av-blok-2-tip1", "av-blok-2-tip2", "av-blok-3"],
  arrest: ["vf", "nabizsiz-vt", "asistoli", "nea"],
};

const ARREST_SENARYO = "Hasta yanıtsız, solunumu yok ve nabzı alınamıyor. Monitörde aşağıdaki ritim izleniyor.";

/* ───────────── Yardımcılar ───────────── */

function karistir<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const HIZ_ADAYLARI = [30, 37, 45, 50, 60, 75, 90, 100, 120, 140, 150, 180, 200, 240, 300];

function hizSecenekleri(dogru: number): Secenek[] {
  const uzak = HIZ_ADAYLARI.filter(h => Math.abs(h - dogru) / dogru > 0.22);
  // Doğruya en yakın geçerli çeldiriciler (ayırt edici ama zorlayıcı)
  const celdiriciler = uzak.sort((a, b) => Math.abs(Math.log(a / dogru)) - Math.abs(Math.log(b / dogru))).slice(0, 3);
  return karistir([dogru, ...celdiriciler]).map(h => ({ id: String(h), etiket: `≈ ${h}/dk` }));
}

/** Üretilmiş şeritte kaynaktaki yöntemle hız: düzenliyse 300/büyük kare, düzensizse 3 sn'deki R × 20. */
function uretilmisHiz(serit: UretilmisSerit, analiz?: RitimAnalizi): { hiz: number; hesap: string } | null {
  if (!serit.hiz) return null;
  if (analiz?.ritim === "duzensiz" || serit.ritim === "torsades") {
    const n = serit.qrsZamanlari.filter(t => t < 3).length;
    return { hiz: n * 20, hesap: `15 büyük karede (3 sn) ${n} R × 20 = ${n * 20}/dk` };
  }
  const kare = 300 / serit.hiz;
  const kareMetin = kare.toFixed(1).replace(".0", "").replace(".", ",");
  return { hiz: serit.hiz, hesap: `R-R arası ≈ ${kareMetin} büyük kare → 300 / ${kareMetin} ≈ ${serit.hiz}/dk` };
}

function secenekler<T extends string>(etiketler: Record<T, string>, dogru: T, adet?: number): Secenek[] {
  const hepsi = Object.keys(etiketler) as T[];
  const diger = karistir(hepsi.filter(k => k !== dogru));
  const secilen = adet ? [dogru, ...diger.slice(0, adet - 1)] : hepsi;
  return (adet ? karistir(secilen) : secilen).map(k => ({ id: k, etiket: etiketler[k] }));
}

function taniSecenekleri(ritim: RitimId): Secenek[] {
  const r = RITIMLER[ritim];
  let havuz: RitimId[];
  if (r.kategori === "arrest") havuz = RITIM_HAVUZU.arrest;
  else if (r.kategori === "normal") havuz = ["normal-sinus", "sinus-bradikardisi", "sinus-tasikardisi", "av-blok-1"];
  else havuz = RITIM_HAVUZU[r.kategori];
  const diger = karistir(havuz.filter(id => id !== ritim)).slice(0, 3);
  return karistir([ritim, ...diger]).map(id => ({ id, etiket: RITIMLER[id].kisaAd }));
}

/* ───────────── Soru oluşturma ───────────── */

function soruOlustur(ritim: RitimId, serit: SoruSeridi, index: number): Soru {
  const r = RITIMLER[ritim];
  const gercek = serit.tur === "gercek" ? serit.vaka : null;
  const uretilmis = serit.tur === "uretilmis" ? serit.serit : null;
  const analiz = gercek ? r.analiz : uretilmis?.analiz;
  const adimlar: SoruAdimi[] = [];
  const kaynakNot = (metin: string) => (gercek ? `Kaynak tablo: ${metin}` : "");

  if (r.kategori === "arrest") {
    adimlar.push({
      tur: "tani",
      baslik: "Tanı",
      soru: "Monitördeki arrest ritmi hangisi?",
      secenekler: taniSecenekleri(ritim),
      dogru: ritim,
      aciklama: [r.ozet, ...r.aciklama.slice(0, 1)].join(" "),
    });
    adimlar.push({
      tur: "sok",
      baslik: "Şok kararı",
      soru: "Bu ritim şoklanabilir mi?",
      secenekler: [
        { id: "evet", etiket: "Şoklanır ritim" },
        { id: "hayir", etiket: "Şoklanmaz ritim" },
      ],
      dogru: r.soklanir ? "evet" : "hayir",
      aciklama: "Şoklanır arrest ritimleri: VF ve nabızsız VT. Şoklanmaz: asistoli ve NEA.",
    });
    return { id: `s${index}-${ritim}`, ritim, serit, senaryo: ARREST_SENARYO, adimlar };
  }

  if (!analiz) throw new Error(`${ritim} için analiz tanımlı değil`);

  const hizBilgi = gercek
    ? { hiz: gercek.hiz, hesap: `${gercek.hizHesabi} ≈ ${gercek.hiz}/dk` }
    : uretilmis
      ? uretilmisHiz(uretilmis, analiz)
      : null;

  for (const a of DEGERLENDIRME_ADIMLARI) {
    if (a.key === "ritim") {
      adimlar.push({
        tur: "ritim",
        baslik: a.baslik,
        soru: a.soru,
        ipucu: a.ipucu,
        secenekler: secenekler(RITIM_ETIKET, analiz.ritim),
        dogru: analiz.ritim,
        aciklama:
          (analiz.ritim === "duzenli"
            ? "R-R aralıkları birbirine eşit: ritim düzenli."
            : "R-R aralıkları birbirinden farklı: ritim düzensiz.") +
          (uretilmis?.not ? ` (${uretilmis.not})` : "") +
          (gercek ? ` ${kaynakNot(gercek.kaynakTablo.ritim)}` : ""),
      });
    } else if (a.key === "hiz" && hizBilgi) {
      adimlar.push({
        tur: "hiz",
        baslik: a.baslik,
        soru: a.soru,
        ipucu: a.ipucu,
        secenekler: hizSecenekleri(hizBilgi.hiz),
        dogru: String(hizBilgi.hiz),
        aciklama: `${hizBilgi.hesap} → ${hizSinifi(hizBilgi.hiz)}.${
          uretilmis?.atriyalHiz ? ` (Atriyal hız ≈ ${uretilmis.atriyalHiz}/dk)` : ""
        }${gercek ? ` ${kaynakNot(gercek.kaynakTablo.hiz)}` : ""}`,
      });
    } else if (a.key === "pDalgasi") {
      adimlar.push({
        tur: "pDalgasi",
        baslik: a.baslik,
        soru: a.soru,
        ipucu: a.ipucu,
        secenekler: secenekler(P_ETIKET, analiz.pDalgasi),
        dogru: analiz.pDalgasi,
        aciklama: `${P_ETIKET[analiz.pDalgasi]}.${gercek ? ` ${kaynakNot(gercek.kaynakTablo.pDalgasi)}` : ""}`,
      });
    } else if (a.key === "pQrs") {
      adimlar.push({
        tur: "pQrs",
        baslik: a.baslik,
        soru: a.soru,
        ipucu: a.ipucu,
        secenekler: secenekler<PQrsIliskisi>(PQRS_ETIKET, analiz.pQrs, 4),
        dogru: analiz.pQrs,
        aciklama: `${PQRS_ETIKET[analiz.pQrs]}.${uretilmis?.not ? ` (${uretilmis.not})` : ""}${
          gercek ? ` ${kaynakNot(gercek.kaynakTablo.pQrs)}` : ""
        }`,
      });
    } else if (a.key === "qrs") {
      adimlar.push({
        tur: "qrs",
        baslik: a.baslik,
        soru: a.soru,
        ipucu: a.ipucu,
        secenekler: secenekler(QRS_ETIKET, analiz.qrs),
        dogru: analiz.qrs,
        aciklama: `${QRS_ETIKET[analiz.qrs]}.${gercek ? ` ${kaynakNot(gercek.kaynakTablo.qrs)}` : ""}`,
      });
    }
  }

  adimlar.push({
    tur: "tani",
    baslik: "Tanı",
    soru: "Bu bulgularla tanınız nedir?",
    secenekler: taniSecenekleri(ritim),
    dogru: ritim,
    aciklama: `${r.ad} — ${r.ozet}.`,
  });

  return { id: `s${index}-${ritim}`, ritim, serit, adimlar };
}

/** Kapsama göre, ritimleri dengeli dağıtan ve gerçek/üretilmiş vakaları karıştıran sınav. */
export function sinavOlustur(kapsam: Kapsam, soruSayisi: number, gercekDahil = true): Soru[] {
  const ritimler: RitimId[] =
    kapsam === "karisik"
      ? ["normal-sinus", ...RITIM_HAVUZU.hizli, ...RITIM_HAVUZU.yavas, ...RITIM_HAVUZU.arrest]
      : RITIM_HAVUZU[kapsam];

  // Ritimleri turlar halinde karıştır; ardışık aynı ritim olmasın
  const sira: RitimId[] = [];
  while (sira.length < soruSayisi) {
    const tur = karistir(ritimler);
    if (sira.length && tur[0] === sira[sira.length - 1]) tur.push(tur.shift()!);
    sira.push(...tur);
  }

  const kullanilanGercek = new Set<string>();
  return sira.slice(0, soruSayisi).map((ritim, i) => {
    const vaka = GERCEK_VAKALAR.find(v => v.ritim === ritim && !kullanilanGercek.has(v.id));
    if (gercekDahil && vaka && Math.random() < 0.5) {
      kullanilanGercek.add(vaka.id);
      return soruOlustur(ritim, { tur: "gercek", vaka }, i);
    }
    return soruOlustur(ritim, { tur: "uretilmis", serit: uret(ritim, rastgeleSeed()) }, i);
  });
}
