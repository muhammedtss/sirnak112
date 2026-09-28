"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Pause, Play, RefreshCw, RotateCcw } from "lucide-react";
import { Bilgi, Bolum, Figur, HizliSoru, Maddeler } from "./ortak";
import EkgStrip from "../EkgStrip";
import { RITIMLER } from "@/lib/ekg/rhythms";
import { NORMAL_SINUS_GORSEL } from "@/lib/ekg/cases";
import { rastgeleSeed, uret, MM_PER_SEC, MM_PER_MV } from "@/lib/ekg/generator";

/* ════════════════════════ 1. Giriş ════════════════════════ */

export function GirisDersi() {
  return (
    <div className="space-y-4">
      <Bolum baslik="Bakmak ve görmek farklı şeylerdir!" slayt="2">
        <p className="text-sm leading-relaxed">
          Öyleyse nasıl bakmalı? <strong>Öncelikle ortak bir yöntemimiz olmalı.</strong> Bu eğitimde her ritmi aynı 5 adımla
          değerlendireceğiz; böylece ekip içinde herkes aynı dili konuşur.
        </p>
      </Bolum>
      <Bolum baslik="Amaç" slayt="3">
        <p className="text-sm leading-relaxed">Acil hasta değerlendirmesinde ritim bozukluklarının tanınmasıyla ilgili bilgi kazanmak.</p>
      </Bolum>
      <Bolum baslik="Öğrenim hedefleri" altBaslik="Katılımcılar bu eğitimin sonunda;" slayt="3">
        <Maddeler
          items={[
            "Ritim değerlendirme aşamalarını söyleyebilmeli",
            "Normal sinüs ritminin özelliklerini söyleyebilmeli",
            "Taşiaritmileri sınıflayabilmeli",
            "Sık görülen hızlı ritimleri tanıyabilmeli",
            "Bradiaritmileri sınıflayabilmeli",
            "Sık görülen yavaş ritimleri tanıyabilmeli",
          ]}
        />
      </Bolum>
    </div>
  );
}

/* ════════════════════════ 2. İleti sistemi ════════════════════════ */

const ILETI_SIRASI = [
  { ad: "Sinoatriyal (SA) düğüm", not: "Uyarının başladığı yer; kalbin doğal pacemaker'ı." },
  { ad: "Atriyoventriküler (AV) düğüm", not: "Atriyumlardan gelen uyarı AV kavşakta toplanır." },
  { ad: "His demeti", not: "AV kavşaktan ventriküllere uzanan iletim yolu." },
  { ad: "Sağ dal / Sol dal", not: "Uyarı iki dala ayrılarak ventriküllere iletilir." },
  { ad: "Purkinje lifleri", not: "Tüm ventrikül kas hücrelerini uyarır." },
];

function IletiAnimasyonu() {
  const [aktif, setAktif] = useState(-1);
  const [oynuyor, setOynuyor] = useState(false);

  useEffect(() => {
    if (!oynuyor) return;
    const t = setInterval(() => {
      setAktif(a => {
        if (a >= ILETI_SIRASI.length - 1) {
          setOynuyor(false);
          return a;
        }
        return a + 1;
      });
    }, 1100);
    return () => clearInterval(t);
  }, [oynuyor]);

  return (
    <div className="space-y-3">
      <ol className="relative space-y-2 pl-7">
        <span className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-white/10" aria-hidden="true" />
        {ILETI_SIRASI.map((s, i) => {
          const on = i <= aktif;
          return (
            <li key={s.ad} className="relative">
              <span
                className={`absolute -left-7 top-2 w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-black transition-all duration-300 ${
                  on ? "bg-amber-400 border-amber-300 text-slate-900 shadow-[0_0_14px_rgba(251,191,36,0.7)]" : "border-white/20 text-muted"
                }`}
              >
                {i + 1}
              </span>
              <div className={`rounded-xl border px-3 py-2 transition-all duration-300 ${on ? "border-amber-500/40 bg-amber-500/10" : "border-white/10"}`}>
                <p className="text-sm font-bold">{s.ad}</p>
                <p className="text-[11px] text-muted">{s.not}</p>
              </div>
            </li>
          );
        })}
      </ol>
      <button
        type="button"
        onClick={() => {
          if (oynuyor) setOynuyor(false);
          else {
            setAktif(-1);
            setOynuyor(true);
          }
        }}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold border border-amber-500/30 bg-amber-500/10 text-amber-400"
      >
        {oynuyor ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        {oynuyor ? "Durdur" : "Uyarının yolculuğunu oynat"}
      </button>
    </div>
  );
}

function IletiSiralama() {
  // Sabit karışık sıra (SSR ile uyumlu)
  const karisik = useMemo(() => [3, 0, 4, 1, 2], []);
  const [secilen, setSecilen] = useState<number[]>([]);
  const [hata, setHata] = useState<number | null>(null);
  const bitti = secilen.length === ILETI_SIRASI.length;

  const tikla = (i: number) => {
    if (secilen.includes(i)) return;
    if (i === secilen.length) setSecilen(s => [...s, i]);
    else {
      setHata(i);
      setTimeout(() => setHata(null), 600);
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted">Uyarının izlediği yolu sırasıyla seçin.</p>
      <div className="flex flex-wrap gap-2">
        {karisik.map(i => {
          const sira = secilen.indexOf(i);
          return (
            <button
              key={i}
              type="button"
              onClick={() => tikla(i)}
              disabled={sira >= 0}
              className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
                sira >= 0
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                  : hata === i
                    ? "border-red-500/60 bg-red-500/15 text-red-300"
                    : "border-white/10 hover:bg-white/5"
              }`}
            >
              {sira >= 0 && <span className="mr-1">{sira + 1}.</span>}
              {ILETI_SIRASI[i].ad}
            </button>
          );
        })}
      </div>
      {bitti && (
        <Bilgi renk="emerald">
          <span className="font-bold">Doğru sıra!</span> SAD → AV nod → His demeti → Sağ/Sol dal → Purkinje lifleri.
          <button type="button" onClick={() => setSecilen([])} className="ml-2 inline-flex items-center gap-1 font-bold underline">
            <RotateCcw className="w-3 h-3" /> Tekrar
          </button>
        </Bilgi>
      )}
    </div>
  );
}

export function IletiSistemiDersi() {
  return (
    <div className="space-y-4">
      <Bolum baslik="Kalbin ileti sistemi" slayt="4">
        <p className="text-sm leading-relaxed">
          Kalp, kendi kendine uyarı oluşturabilen ve bunu tüm kalp hücrelerine ulaştırabilen özel bir ileti sistemine sahiptir.
          Bu sisteme <strong>kalbin uyarı ve iletim sistemi</strong> denir.
        </p>
        <Figur src="/ekg/ileti-sistemi-1.webp" alt="Kalbin ileti sistemi" genislik={624} yukseklik={484} maxH={320} />
      </Bolum>
      <Bolum baslik="Uyarının yolculuğu" slayt="5">
        <p className="text-sm leading-relaxed">
          Sinüs düğümünden AV kavşağa gelen ileti, His demetini ve sağ/sol dalları geçerek Purkinje lifleri aracılığıyla tüm
          ventrikülleri uyarır.
        </p>
        <Figur src="/ekg/ileti-sistemi-2.webp" alt="Sinüs düğümünden Purkinje liflerine iletim" genislik={676} yukseklik={526} maxH={300} />
        <IletiAnimasyonu />
        <Bilgi>
          Sinoatriyal düğüm dışında atriyumların bazı bölümlerinde, atriyoventriküler kavşakta, His demetinde, sağ ve sol dallarda
          da pacemaker hücreleri (ileti başlatma yeteneği olan hücreler) vardır.
        </Bilgi>
      </Bolum>
      <Bolum baslik="Alıştırma: İletim sırası">
        <IletiSiralama />
      </Bolum>
    </div>
  );
}

/* ════════════════════════ 3. EKG kağıdı ve dalgalar ════════════════════════ */

const DALGALAR = [
  { id: "P", etiket: "P dalgası", renk: "#EF4444", metin: "EKG'nin ilk pozitif dalgasıdır. Atriyal depolarizasyonu ifade eder. Var mı / yok mu? (D2'ye bak!)" },
  { id: "PR", etiket: "PR aralığı", renk: "#F97316", metin: "P dalgasının başından QRS'in başına kadar olan süre. Normali 0,12–0,20 sn; üst sınır 0,20 sn (5 küçük kare)." },
  { id: "QRS", etiket: "QRS kompleksi", renk: "#0EA5E9", metin: "Q'nun başından S'nin sonuna kadar olan zamandır. Ventriküler depolarizasyonu ifade eder. Genişlemiş mi? (üst sınır 0,12 sn = 3 küçük kare)" },
  { id: "ST", etiket: "ST segmenti", renk: "#A855F7", metin: "Normalde izoelektrik hattadır. V2 ve V3 derivasyonlarında 2 mm, diğer tüm derivasyonlarda 1 mm yükselme elevasyon kabul edilir." },
  { id: "T", etiket: "T dalgası", renk: "#14B8A6", metin: "Ventriküler repolarizasyon. Yüksekliği aynı derivasyondaki R dalgasının 2/3'ünden fazla, 1/8'inden az olmamalıdır." },
] as const;

function DalgaAnatomisi() {
  const [secili, setSecili] = useState<(typeof DALGALAR)[number]["id"]>("P");
  const W = 36;
  const H = 22;
  const base = 15;
  // Tek bir normal atım (sn): P merkezi 0,24 · PR 0,16 · QRS 0,08 · T merkezi 0,86
  const pc = 0.24, pOn = pc - 0.05, qrsOn = pOn + 0.16, r = qrsOn + 0.04, tc = r + 0.3;
  const g = (t: number, c: number, w: number, a: number) => a * Math.exp(-0.5 * ((t - c) / w) ** 2);
  const path = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 360; i++) {
      const t = (i / 360) * (W / MM_PER_SEC);
      const v = g(t, pc, 0.022, 0.16) + g(t, r - 0.022, 0.008, -0.12) + g(t, r, 0.011, 1.1) + g(t, r + 0.024, 0.01, -0.3) + g(t, tc, 0.05, 0.3);
      pts.push(`${i ? "L" : "M"}${(t * MM_PER_SEC).toFixed(2)} ${(base - v * MM_PER_MV).toFixed(2)}`);
    }
    return pts.join("");
  }, [pc, r, tc]);

  const bant: Record<string, [number, number]> = {
    P: [pOn, pOn + 0.1],
    PR: [pOn, qrsOn],
    QRS: [qrsOn, qrsOn + 0.08],
    ST: [qrsOn + 0.08, tc - 0.11],
    T: [tc - 0.11, tc + 0.11],
  };
  const aktif = DALGALAR.find(d => d.id === secili)!;
  const [b0, b1] = bant[secili];

  return (
    <div className="space-y-3">
      <div className="rounded-xl overflow-hidden border border-white/10 bg-white">
        <svg viewBox={`0 0 ${W} ${H}`} className="block w-full h-auto" role="img" aria-label="Normal bir atımda P, PR, QRS, ST ve T">
          <defs>
            <pattern id="dk" width={1} height={1} patternUnits="userSpaceOnUse">
              <path d="M1 0H0V1" fill="none" stroke="#F4C3CC" strokeWidth={0.05} />
            </pattern>
            <pattern id="db" width={5} height={5} patternUnits="userSpaceOnUse">
              <rect width={5} height={5} fill="url(#dk)" />
              <path d="M5 0H0V5" fill="none" stroke="#E07C92" strokeWidth={0.13} />
            </pattern>
          </defs>
          <rect width={W} height={H} fill="#FFF7F8" />
          <rect width={W} height={H} fill="url(#db)" />
          <rect x={b0 * MM_PER_SEC} y={0} width={(b1 - b0) * MM_PER_SEC} height={H} fill={aktif.renk} fillOpacity={0.14} />
          <line x1={b0 * MM_PER_SEC} x2={b1 * MM_PER_SEC} y1={H - 2} y2={H - 2} stroke={aktif.renk} strokeWidth={0.35} />
          <path d={path} fill="none" stroke="#1F2937" strokeWidth={0.3} strokeLinejoin="round" />
          {Object.entries(bant).map(([id, [s, e]]) => (
            <rect
              key={id}
              x={s * MM_PER_SEC}
              y={id === "PR" ? H - 4 : 0}
              width={(e - s) * MM_PER_SEC}
              height={id === "PR" ? 4 : H - 4}
              fill="transparent"
              style={{ cursor: "pointer" }}
              onClick={() => setSecili(id as typeof secili)}
            />
          ))}
          {[
            ["P", pc, base - 2.8],
            ["Q", r - 0.03, base + 2.4],
            ["R", r + 0.028, base - 10.5],
            ["S", r + 0.04, base + 4.2],
            ["T", tc, base - 4.4],
          ].map(([l, t, y]) => (
            <text key={l as string} x={(t as number) * MM_PER_SEC} y={y as number} fontSize={1.8} fontWeight={800} textAnchor="middle" fill="#334155">
              {l}
            </text>
          ))}
        </svg>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {DALGALAR.map(d => (
          <button
            key={d.id}
            type="button"
            onClick={() => setSecili(d.id)}
            aria-pressed={secili === d.id}
            className="px-3 py-1.5 rounded-lg text-xs font-bold border transition-all"
            style={
              secili === d.id
                ? { borderColor: d.renk, background: `${d.renk}22`, color: d.renk }
                : { borderColor: "var(--glass-border-h)" }
            }
          >
            {d.etiket}
          </button>
        ))}
      </div>
      <div className="rounded-xl border px-3.5 py-3 text-sm leading-relaxed" style={{ borderColor: `${aktif.renk}55`, background: `${aktif.renk}14` }}>
        <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: aktif.renk }}>{aktif.etiket}</p>
        {aktif.metin}
      </div>
    </div>
  );
}

export function EkgKagidiDersi() {
  return (
    <div className="space-y-4">
      <Bolum baslik="EKG nedir?" slayt="6">
        <p className="text-sm leading-relaxed">
          EKG, kalbin elektriksel aktivitesinin elektrotlarla özel bir kağıda ya da monitör ekranına yansıtılmasıdır. Kalpte
          oluşan elektriksel aktivitenin vücut yüzeyine konan elektrotlar yardımıyla elde edilen kaydına elektrokardiyografi,
          kayıt yapan cihaza da elektrokardiyograf denir. EKG, kalbin elektriksel haritasının resmidir.
        </p>
        <Figur src="/ekg/ekg-kagidi.webp" alt="EKG kağıdı, süreler ve dalgalar" genislik={1245} yukseklik={534} />
      </Bolum>

      <Bolum baslik="EKG kağıdı" slayt="6">
        <div className="grid grid-cols-2 gap-2 text-center">
          {[
            ["Kağıt hızı", "25 mm/sn"],
            ["1 küçük kare (1 mm)", "0,04 sn"],
            ["1 büyük kare (5 mm)", "0,20 sn"],
            ["5 büyük kare", "1 saniye"],
            ["15 büyük kare", "3 saniye"],
            ["Dikey 10 mm", "1 mV"],
          ].map(([k, v]) => (
            <div key={k} className="rounded-xl border border-white/10 bg-black/[0.03] dark:bg-black/20 px-2 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wide text-subtle">{k}</p>
              <p className="text-base font-black mt-0.5">{v}</p>
            </div>
          ))}
        </div>
      </Bolum>

      <Bolum baslik="Dalgalar ve aralıklar" altBaslik="Şekil üzerinde bir bölüme ya da aşağıdaki etiketlere dokunun" slayt="7">
        <DalgaAnatomisi />
      </Bolum>

      <Bolum baslik="Kendini sına">
        <div className="space-y-2">
          <HizliSoru soru="1 küçük kare kaç saniyedir?" secenekler={["0,02 sn", "0,04 sn", "0,20 sn"]} dogru="0,04 sn" aciklama="Kağıt 25 mm/sn hızla akar: 1 mm = 1/25 sn = 0,04 sn." />
          <HizliSoru soru="QRS genişliğinin üst sınırı kaç küçük karedir?" secenekler={["2", "3", "5"]} dogru="3" aciklama="0,12 sn ÷ 0,04 sn = 3 küçük kare." />
          <HizliSoru soru="PR aralığının üst sınırı kaç büyük karedir?" secenekler={["1", "2", "3"]} dogru="1" aciklama="0,20 sn = 5 küçük kare = 1 büyük kare." />
        </div>
      </Bolum>
    </div>
  );
}

/* ════════════════════════ 4. Değerlendirme aşamaları ════════════════════════ */

const ASAMALAR = [
  ["Ritim", "Ritmik / aritmik"],
  ["Hız", "40/↓ · 40–60 · 60–100 · 100–150 · 150/↑"],
  ["P dalgası", "P dalgası var mı?"],
  ["P-QRS ilişkisi", "Her P dalgasına QRS yanıtı var mı? / P-R aralığı (0,20 sn ↑)"],
  ["QRS genişliği", "0,10–0,12 sn (0,12 sn ↑)"],
];

function HizAlistirmasi() {
  const [seed, setSeed] = useState(7);
  const [secim, setSecim] = useState<number | null>(null);
  // Kaynaktaki tablo (slayt 10): büyük kare → hız
  const tablo: [number, number][] = [[2, 150], [3, 100], [4, 75], [5, 60], [6, 50], [7, 43], [8, 37]];
  const [kare, hiz] = tablo[seed % tablo.length];
  // R-R = tam sayıda büyük kare olacak şekilde sinüs ritmi
  const serit = useMemo(
    () => uret(hiz > 100 ? "sinus-tasikardisi" : hiz < 60 ? "sinus-bradikardisi" : "normal-sinus", seed, 6, { hiz }),
    [seed, hiz]
  );

  const secenekler = [150, 100, 75, 60, 50, 43, 37];
  const dogru = hiz;

  return (
    <div className="space-y-3">
      <EkgStrip kaynak={{ tur: "uretilmis", serit, alt: "Hız hesaplama alıştırması" }} etiket="Alıştırma · düzenli ritim" />
      <p className="text-xs text-muted">İki R arasındaki büyük kareleri sayın (gerekirse kaliperi açın) ve 300&apos;e bölün.</p>
      <div className="grid grid-cols-4 gap-2">
        {secenekler.map(s => {
          const kilit = secim !== null;
          const cls =
            kilit && s === dogru
              ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-300"
              : kilit && s === secim
                ? "border-red-500/50 bg-red-500/15 text-red-300"
                : "border-white/10 hover:bg-white/5";
          return (
            <button key={s} type="button" disabled={kilit} onClick={() => setSecim(s)} className={`py-2 rounded-lg border text-xs font-bold ${cls}`}>
              {s}
            </button>
          );
        })}
      </div>
      {secim !== null && (
        <Bilgi renk={secim === dogru ? "emerald" : "red"}>
          {secim === dogru ? "Doğru! " : `Doğru cevap ${dogru}/dk. `}R-R arası {kare} büyük kare → 300 / {kare} ≈ {hiz}/dk.
        </Bilgi>
      )}
      <button
        type="button"
        onClick={() => { setSeed(rastgeleSeed()); setSecim(null); }}
        className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400"
      >
        <RefreshCw className="w-3.5 h-3.5" /> Yeni şerit
      </button>
    </div>
  );
}

function DuzensizHizAlistirmasi() {
  const [seed, setSeed] = useState(21);
  const [secim, setSecim] = useState<number | null>(null);
  const serit = useMemo(() => uret("atriyal-fibrilasyon", seed), [seed]);
  const n = serit.qrsZamanlari.filter(t => t < 3).length;
  const dogru = n * 20;
  const secenekler = Array.from(new Set([dogru - 40, dogru - 20, dogru, dogru + 20, dogru + 40].filter(v => v > 0))).slice(0, 5);

  return (
    <div className="space-y-3">
      <EkgStrip kaynak={{ tur: "uretilmis", serit, alt: "Düzensiz ritimde hız alıştırması" }} etiket="Alıştırma · düzensiz ritim · ilk 15 büyük kare = 3 sn" />
      <p className="text-xs text-muted">Şeridin ilk 15 büyük karesindeki (3 saniye) R dalgalarını sayın ve 20 ile çarpın.</p>
      <div className="flex flex-wrap gap-2">
        {secenekler.map(s => {
          const kilit = secim !== null;
          const cls =
            kilit && s === dogru
              ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-300"
              : kilit && s === secim
                ? "border-red-500/50 bg-red-500/15 text-red-300"
                : "border-white/10 hover:bg-white/5";
          return (
            <button key={s} type="button" disabled={kilit} onClick={() => setSecim(s)} className={`px-4 py-2 rounded-lg border text-xs font-bold ${cls}`}>
              {s}/dk
            </button>
          );
        })}
      </div>
      {secim !== null && (
        <Bilgi renk={secim === dogru ? "emerald" : "red"}>
          {secim === dogru ? "Doğru! " : ""}İlk 15 büyük karede {n} R dalgası var: {n} × 20 = {dogru}/dk.
        </Bilgi>
      )}
      <button
        type="button"
        onClick={() => { setSeed(rastgeleSeed()); setSecim(null); }}
        className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400"
      >
        <RefreshCw className="w-3.5 h-3.5" /> Yeni şerit
      </button>
    </div>
  );
}

export function DegerlendirmeDersi() {
  const nsr = RITIMLER["normal-sinus"];
  return (
    <div className="space-y-4">
      <Bolum baslik="Ritim değerlendirme aşamaları" altBaslik="Her EKG'de aynı sırayla" slayt="8">
        <ol className="space-y-2">
          {ASAMALAR.map(([k, v], i) => (
            <li key={k} className="flex gap-3 rounded-xl border border-white/10 bg-black/[0.03] dark:bg-black/20 px-3 py-2.5">
              <span className="w-6 h-6 shrink-0 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black flex items-center justify-center">{i + 1}</span>
              <div>
                <p className="text-sm font-bold">{k}</p>
                <p className="text-xs text-muted">{v}</p>
              </div>
            </li>
          ))}
        </ol>
      </Bolum>

      <Bolum baslik="1. Ritmin değerlendirilmesi" slayt="9">
        <p className="text-sm leading-relaxed">
          Ritmin düzenli olabilmesi için her bir <strong>R–R</strong> ve <strong>P–P</strong> aralıkları (ventriküler ve atriyal
          depolarizasyon aralıkları) birbirine eşit olmalıdır.
        </p>
        <Figur src="/ekg/ritim-duzen.webp" alt="R-R ve P-P aralıklarının karşılaştırılması" genislik={2000} yukseklik={448} />
        <Bilgi>İpucu: Şeritlerdeki <strong>Kaliper</strong> ile bir R-R aralığını ölçüp ortadaki noktadan sürükleyerek diğer aralıklarla karşılaştırabilirsiniz.</Bilgi>
      </Bolum>

      <Bolum baslik="2. Kalp hızı — ritim düzenliyse" altBaslik="300 / R-R arasındaki büyük kare sayısı" slayt="10">
        <Figur src="/ekg/hiz-300-yontemi.webp" alt="300 yöntemi ile hız hesaplama" genislik={1400} yukseklik={323} />
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 text-center">
          {[[1, 300], [2, 150], [3, 100], [4, 75], [6, 50], [7, 43], [8, 37], [9, 33]].map(([k, h]) => (
            <div key={k} className="rounded-lg border border-white/10 py-1.5">
              <p className="text-[10px] text-subtle font-bold">{k} kare</p>
              <p className="text-sm font-black">{h}</p>
            </div>
          ))}
        </div>
        <HizAlistirmasi />
      </Bolum>

      <Bolum baslik="2. Kalp hızı — ritim düzensizse" slayt="11">
        <p className="text-sm leading-relaxed">
          EKG trasesi yeterince uzun değilse <strong>15 büyük kare</strong> (3 saniye) içerisindeki R dalgaları sayılır ve çıkan
          rakam <strong>20 ile çarpılarak</strong> kalp atım hızı bulunur.
        </p>
        <Figur src="/ekg/hiz-15-kare-yontemi.webp" alt="15 büyük kare yöntemi" genislik={1400} yukseklik={194} aciklama="Örnek: 3 sn'lik (15 büyük kare) sürede 6 QRS varsa kalp hızı 6 × 20 = 120/dk'dır." />
        <DuzensizHizAlistirmasi />
      </Bolum>

      <Bolum baslik="Normal sinüs ritmi" slayt="12">
        <Maddeler items={nsr.aciklama} />
        <EkgStrip
          kaynak={{ tur: "gercek", ...NORMAL_SINUS_GORSEL, alt: "Normal sinüs ritmi — kaynak sunum" }}
          etiket="Kaynak sunum · Slayt 12"
        />
        <Bilgi renk="emerald">
          <CheckCircle2 className="inline w-3.5 h-3.5 mr-1 -mt-0.5" />
          Normal sinüs ritmini iyi tanımak, tüm aritmileri tanımanın temelidir: her aritmi bu kriterlerden en az birinin bozulmasıdır.
        </Bilgi>
      </Bolum>
    </div>
  );
}
