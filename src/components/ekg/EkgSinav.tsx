"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Award,
  CheckCircle2,
  ChevronRight,
  HeartPulse,
  Lightbulb,
  RotateCcw,
  Siren,
  XCircle,
} from "lucide-react";
import EkgStrip, { type StripKaynak } from "./EkgStrip";
import { KAPSAMLAR, sinavOlustur, type Kapsam, type Soru } from "@/lib/ekg/exam";
import { RITIMLER, type RitimId } from "@/lib/ekg/rhythms";
import { sinaviKaydet } from "@/lib/ekg/progress";

type Cevaplar = Record<string, string[]>; // soru id → adım cevapları

function seritKaynak(s: Soru, no: number): StripKaynak {
  return s.serit.tur === "gercek"
    ? {
        tur: "gercek",
        gorsel: s.serit.vaka.gorsel,
        genislik: s.serit.vaka.genislik,
        yukseklik: s.serit.vaka.yukseklik,
        onikiDerivasyon: s.serit.vaka.onikiDerivasyon,
        alt: `Vaka ${no} EKG şeridi`,
      }
    : { tur: "uretilmis", serit: s.serit.serit, alt: `Vaka ${no} EKG şeridi` };
}

/* ───────────── Kurulum ───────────── */

function Kurulum({ onBasla }: { onBasla: (k: Kapsam, n: number) => void }) {
  const [kapsam, setKapsam] = useState<Kapsam>("karisik");
  const [sayi, setSayi] = useState(10);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-[11px] font-bold uppercase tracking-widest text-subtle">Kapsam</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {KAPSAMLAR.map(k => (
            <button
              key={k.id}
              type="button"
              onClick={() => setKapsam(k.id)}
              aria-pressed={kapsam === k.id}
              className={`text-left rounded-xl border px-4 py-3 transition ${
                kapsam === k.id
                  ? "border-amber-500/50 bg-amber-500/10 ring-2 ring-amber-500/20"
                  : "border-white/10 bg-black/[0.03] dark:bg-black/20 hover:bg-white/5"
              }`}
            >
              <p className={`text-sm font-bold ${kapsam === k.id ? "text-amber-400" : ""}`}>{k.baslik}</p>
              <p className="text-[11px] text-muted mt-0.5">{k.aciklama}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-[11px] font-bold uppercase tracking-widest text-subtle">Vaka sayısı</p>
        <div className="flex gap-2">
          {[5, 10, 20].map(n => (
            <button
              key={n}
              type="button"
              onClick={() => setSayi(n)}
              aria-pressed={sayi === n}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition ${
                sayi === n ? "border-amber-500/50 bg-amber-500/10 text-amber-400" : "border-white/10 text-muted hover:bg-white/5"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-black/[0.03] dark:bg-black/20 p-4 text-xs text-muted leading-relaxed space-y-1.5">
        <p>
          Her vakada kaynaktaki <strong className="text-white">5 adımlı değerlendirmeyi</strong> (ritim, hız, P dalgası, P-QRS
          ilişkisi, QRS genişliği) yapıp tanıyı seçeceksiniz. Arrest ritimlerinde tanı ve şok kararı sorulur.
        </p>
        <p>Vakalar kaynak eğitim sunumundaki gerçek EKG&apos;ler ile üretilmiş şeritlerin karışımıdır; her sınav farklıdır.</p>
      </div>

      <button
        type="button"
        onClick={() => onBasla(kapsam, sayi)}
        className="w-full py-3.5 rounded-xl font-black text-sm bg-amber-500 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.25)] active:scale-[0.98] transition-transform"
      >
        Sınavı Başlat
      </button>
    </div>
  );
}

/* ───────────── Soru ───────────── */

function SoruEkrani({
  soru,
  no,
  toplam,
  cevaplar,
  onCevap,
  onSonraki,
}: {
  soru: Soru;
  no: number;
  toplam: number;
  cevaplar: string[];
  onCevap: (secim: string) => void;
  onSonraki: () => void;
}) {
  const [ipucu, setIpucu] = useState(false);
  const adimIndex = cevaplar.length;
  const bitti = adimIndex >= soru.adimlar.length;
  // Son cevaplanan adım (geri bildirim gösterimi için)
  const [bekleyen, setBekleyen] = useState<number | null>(null);
  const aktif = bekleyen ?? adimIndex;
  const adim = soru.adimlar[Math.min(aktif, soru.adimlar.length - 1)];
  const secim = bekleyen !== null ? cevaplar[bekleyen] : undefined;

  const kaynak = useMemo(() => seritKaynak(soru, no), [soru, no]);

  return (
    <div className="space-y-5">
      {/* İlerleme */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] font-bold">
          <span className="text-amber-400 uppercase tracking-widest">Vaka {no} / {toplam}</span>
          <span className="text-subtle">{soru.serit.tur === "gercek" ? "Gerçek EKG (kaynak sunum)" : "Alıştırma şeridi"}</span>
        </div>
        <div className="flex gap-1">
          {soru.adimlar.map((a, i) => {
            const c = cevaplar[i];
            const durum = c === undefined ? "bos" : c === a.dogru ? "dogru" : "yanlis";
            return (
              <div
                key={a.tur}
                className={`h-1.5 flex-1 rounded-full ${
                  durum === "dogru" ? "bg-emerald-400" : durum === "yanlis" ? "bg-red-400" : i === aktif ? "bg-amber-400/60" : "bg-white/10"
                }`}
              />
            );
          })}
        </div>
      </div>

      {soru.senaryo && (
        <div className="flex gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs font-semibold text-red-300 leading-relaxed">
          <Siren className="w-4 h-4 shrink-0 mt-0.5" /> {soru.senaryo}
        </div>
      )}

      <EkgStrip kaynak={kaynak} etiket={`Vaka ${no}`} key={soru.id} />

      {/* Tamamlanan adımlar */}
      {adimIndex > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {soru.adimlar.slice(0, adimIndex).map((a, i) => {
            if (i === bekleyen) return null;
            const ok = cevaplar[i] === a.dogru;
            const dogruEtiket = a.secenekler.find(s => s.id === a.dogru)?.etiket;
            return (
              <span
                key={a.tur}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold border ${
                  ok ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" : "text-red-300 border-red-500/30 bg-red-500/10"
                }`}
              >
                {ok ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                {a.baslik}: {dogruEtiket}
              </span>
            );
          })}
        </div>
      )}

      {!bitti || bekleyen !== null ? (
        <div className="glass-card p-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-amber-400">
                Adım {aktif + 1} · {adim.baslik}
              </p>
              <p className="text-base font-bold mt-1">{adim.soru}</p>
            </div>
            {adim.ipucu && secim === undefined && (
              <button
                type="button"
                onClick={() => setIpucu(v => !v)}
                aria-pressed={ipucu}
                className="shrink-0 p-2 rounded-lg text-amber-400 hover:bg-amber-500/10"
                aria-label="İpucu"
              >
                <Lightbulb className="w-4 h-4" />
              </button>
            )}
          </div>
          {ipucu && adim.ipucu && secim === undefined && (
            <p className="text-[11px] text-amber-200/80 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">{adim.ipucu}</p>
          )}

          <div className="grid gap-2">
            {adim.secenekler.map(s => {
              const secili = secim === s.id;
              const dogru = s.id === adim.dogru;
              const kilitli = secim !== undefined;
              let cls = "border-white/10 bg-black/[0.03] dark:bg-black/20 hover:bg-white/5";
              if (kilitli && dogru) cls = "border-emerald-500/50 bg-emerald-500/15 text-emerald-300";
              else if (kilitli && secili) cls = "border-red-500/50 bg-red-500/15 text-red-300 t-shake";
              else if (kilitli) cls = "border-white/5 opacity-50";
              return (
                <button
                  key={s.id}
                  type="button"
                  disabled={kilitli}
                  onClick={() => {
                    setBekleyen(adimIndex);
                    setIpucu(false);
                    onCevap(s.id);
                  }}
                  className={`flex items-center justify-between gap-2 text-left px-4 py-3 rounded-xl border text-sm font-semibold transition ${cls}`}
                >
                  {s.etiket}
                  {kilitli && dogru && <CheckCircle2 className="w-4 h-4 shrink-0 t-icon-in" aria-label="Doğru cevap" />}
                  {kilitli && secili && !dogru && <XCircle className="w-4 h-4 shrink-0 t-icon-in" aria-label="Yanlış cevap" />}
                </button>
              );
            })}
          </div>

          {secim !== undefined && (
            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
              <p
                role="status"
                className={`text-xs leading-relaxed rounded-lg px-3 py-2 border ${
                  secim === adim.dogru
                    ? "text-emerald-200/90 bg-emerald-500/10 border-emerald-500/20"
                    : "text-red-200/90 bg-red-500/10 border-red-500/20"
                }`}
              >
                <strong>{secim === adim.dogru ? "Doğru. " : "Yanlış. "}</strong>
                {adim.aciklama}
              </p>
              <button
                type="button"
                onClick={() => setBekleyen(null)}
                className="w-full min-h-11 py-3 rounded-xl text-sm font-bold bg-amber-500 text-slate-950 active:scale-[0.97] transition-transform"
              >
                {bekleyen === soru.adimlar.length - 1 ? "Vaka özetini gör" : "Sonraki adım"}
              </button>
            </div>
          )}
        </div>
      ) : (
        <VakaOzeti soru={soru} cevaplar={cevaplar} onSonraki={onSonraki} sonMu={no === toplam} />
      )}
    </div>
  );
}

function VakaOzeti({ soru, cevaplar, onSonraki, sonMu }: { soru: Soru; cevaplar: string[]; onSonraki: () => void; sonMu: boolean }) {
  const r = RITIMLER[soru.ritim];
  const dogru = soru.adimlar.filter((a, i) => cevaplar[i] === a.dogru).length;
  const tablo = soru.serit.tur === "gercek" ? soru.serit.vaka.kaynakTablo : null;

  return (
    <div className="glass-card p-4 space-y-4 animate-in fade-in">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-subtle">Tanı</p>
        <p className="text-base font-black mt-0.5">{r.ad}</p>
        <p className="text-xs text-muted mt-1">{r.ozet}</p>
        <p className="text-[11px] font-bold mt-2 text-amber-400">
          {dogru}/{soru.adimlar.length} adım doğru
        </p>
      </div>

      {tablo && (
        <div className="rounded-xl border border-white/10 overflow-hidden">
          <p className="px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-subtle bg-white/5">
            Kaynak sunumdaki değerlendirme · Slayt {soru.serit.tur === "gercek" ? soru.serit.vaka.kaynakSlayt : ""}
          </p>
          <dl className="divide-y divide-white/5 text-xs">
            {(
              [
                ["Ritim", tablo.ritim],
                ["Hız", tablo.hiz],
                ["P dalgası", tablo.pDalgasi],
                ["P-QRS ilişkisi", tablo.pQrs],
                ["QRS genişliği", tablo.qrs],
                ["Tanı", tablo.tani],
              ] as const
            ).map(([k, v]) => (
              <div key={k} className="grid grid-cols-[7.5rem_1fr] gap-2 px-3 py-2">
                <dt className="font-bold text-muted">{k}</dt>
                <dd className="font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      <ul className="space-y-1.5">
        {r.aciklama.map(a => (
          <li key={a} className="text-xs text-muted leading-relaxed flex gap-2">
            <span className="text-emerald-400 shrink-0">•</span>
            {a}
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onSonraki}
        className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl text-sm font-bold bg-amber-500 text-slate-950 active:scale-[0.98] transition-transform"
      >
        {sonMu ? "Sonuçları gör" : "Sonraki vaka"} <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

/* ───────────── Sonuç ───────────── */

function Sonuc({
  sorular,
  cevaplar,
  onYeni,
  onYanlislar,
}: {
  sorular: Soru[];
  cevaplar: Cevaplar;
  onYeni: () => void;
  onYanlislar: (ritimler: RitimId[]) => void;
}) {
  const adimToplam = sorular.reduce((s, q) => s + q.adimlar.length, 0);
  const adimDogru = sorular.reduce((s, q) => s + q.adimlar.filter((a, i) => cevaplar[q.id]?.[i] === a.dogru).length, 0);
  const taniDogru = sorular.filter(q => {
    const i = q.adimlar.findIndex(a => a.tur === "tani");
    return cevaplar[q.id]?.[i] === q.adimlar[i].dogru;
  }).length;
  const yuzde = Math.round((adimDogru / adimToplam) * 100);

  const ritimBazli = new Map<RitimId, { dogru: number; toplam: number }>();
  sorular.forEach(q => {
    const tamDogru = q.adimlar.every((a, i) => cevaplar[q.id]?.[i] === a.dogru);
    const cur = ritimBazli.get(q.ritim) ?? { dogru: 0, toplam: 0 };
    ritimBazli.set(q.ritim, { dogru: cur.dogru + (tamDogru ? 1 : 0), toplam: cur.toplam + 1 });
  });
  const hatalilar = [...ritimBazli.entries()].filter(([, v]) => v.dogru < v.toplam).map(([k]) => k);

  const renk = yuzde >= 85 ? "#34D399" : yuzde >= 60 ? "#FBBF24" : "#F87171";

  return (
    <div className="space-y-5 animate-in fade-in">
      <div className="glass-card p-6 text-center space-y-2">
        <Award className="w-10 h-10 mx-auto" style={{ color: renk }} />
        <p className="text-5xl font-black tabular-nums" style={{ color: renk }}>%{yuzde}</p>
        <p className="text-sm font-bold">
          {adimDogru}/{adimToplam} adım doğru · {taniDogru}/{sorular.length} tanı doğru
        </p>
      </div>

      <div className="glass-card overflow-hidden">
        <p className="px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-subtle border-b border-white/10">Ritim bazında</p>
        <ul className="divide-y divide-white/5">
          {[...ritimBazli.entries()].map(([id, v]) => (
            <li key={id} className="flex items-center justify-between px-4 py-2.5 text-sm">
              <Link href={`/ekg-egitim/atlas#${id}`} className="font-semibold hover:underline">
                {RITIMLER[id].kisaAd}
              </Link>
              <span className={`text-xs font-bold ${v.dogru === v.toplam ? "text-emerald-400" : "text-red-400"}`}>
                {v.dogru}/{v.toplam}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid gap-2">
        {hatalilar.length > 0 && (
          <button
            type="button"
            onClick={() => onYanlislar(hatalilar)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold border border-red-500/30 bg-red-500/10 text-red-300"
          >
            <RotateCcw className="w-4 h-4" /> Hatalı ritimlerle tekrar çalış
          </button>
        )}
        <button
          type="button"
          onClick={onYeni}
          className="w-full py-3 rounded-xl text-sm font-bold bg-amber-500 text-slate-950"
        >
          Yeni sınav
        </button>
        <Link
          href="/ekg-egitim"
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold border border-white/10 text-muted"
        >
          <HeartPulse className="w-4 h-4" /> EKG eğitimine dön
        </Link>
      </div>
    </div>
  );
}

/* ───────────── Ana bileşen ───────────── */

export default function EkgSinav() {
  const [sorular, setSorular] = useState<Soru[] | null>(null);
  const [kapsam, setKapsam] = useState<Kapsam>("karisik");
  const [index, setIndex] = useState(0);
  const [cevaplar, setCevaplar] = useState<Cevaplar>({});
  const [bitti, setBitti] = useState(false);

  const basla = (k: Kapsam, n: number, liste?: Soru[]) => {
    setKapsam(k);
    setSorular(liste ?? sinavOlustur(k, n));
    setIndex(0);
    setCevaplar({});
    setBitti(false);
    document.getElementById("main-scroll-container")?.scrollTo({ top: 0 });
  };

  const bitir = (tumCevaplar: Cevaplar, liste: Soru[]) => {
    const ritimler: Partial<Record<RitimId, { dogru: number; toplam: number }>> = {};
    let adimDogru = 0;
    let adimToplam = 0;
    let taniDogru = 0;
    liste.forEach(q => {
      const c = tumCevaplar[q.id] ?? [];
      const dogrular = q.adimlar.filter((a, i) => c[i] === a.dogru).length;
      adimDogru += dogrular;
      adimToplam += q.adimlar.length;
      const ti = q.adimlar.findIndex(a => a.tur === "tani");
      if (c[ti] === q.adimlar[ti].dogru) taniDogru++;
      const cur = ritimler[q.ritim] ?? { dogru: 0, toplam: 0 };
      ritimler[q.ritim] = { dogru: cur.dogru + (dogrular === q.adimlar.length ? 1 : 0), toplam: cur.toplam + 1 };
    });
    sinaviKaydet({
      tarih: new Date().toISOString(),
      kapsam: KAPSAMLAR.find(k => k.id === kapsam)?.baslik ?? kapsam,
      soruSayisi: liste.length,
      adimDogru,
      adimToplam,
      taniDogru,
      ritimler,
    });
    setBitti(true);
    document.getElementById("main-scroll-container")?.scrollTo({ top: 0 });
  };

  if (!sorular) return <Kurulum onBasla={(k, n) => basla(k, n)} />;

  if (bitti) {
    return (
      <Sonuc
        sorular={sorular}
        cevaplar={cevaplar}
        onYeni={() => setSorular(null)}
        onYanlislar={ritimler => {
          // Hatalı ritimlerden yeni üretilmiş vakalar (her ritimden 2)
          const tumu = sinavOlustur("karisik", 40, false);
          const liste = ritimler.flatMap(r => tumu.filter(q => q.ritim === r).slice(0, 2));
          basla(kapsam, liste.length, liste.length ? liste : undefined);
        }}
      />
    );
  }

  const soru = sorular[index];
  return (
    <SoruEkrani
      key={soru.id}
      soru={soru}
      no={index + 1}
      toplam={sorular.length}
      cevaplar={cevaplar[soru.id] ?? []}
      onCevap={secim => setCevaplar(c => ({ ...c, [soru.id]: [...(c[soru.id] ?? []), secim] }))}
      onSonraki={() => {
        if (index + 1 < sorular.length) {
          setIndex(index + 1);
          document.getElementById("main-scroll-container")?.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          bitir(cevaplar, sorular);
        }
      }}
    />
  );
}
