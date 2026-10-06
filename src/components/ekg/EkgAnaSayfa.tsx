"use client";

import Link from "next/link";
import { BookMarked, CheckCircle2, ChevronRight, Circle, Trophy } from "lucide-react";
import { DERSLER } from "@/lib/ekg/lessons";
import { useIlerleme } from "@/lib/ekg/progress";

const tarihBicim = (iso: string) =>
  new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

/** EKG eğitim merkezi: dersler, vaka sınavı, ritim atlası ve ilerleme. */
export default function EkgAnaSayfa() {
  const { tamamlananDersler, sinavlar } = useIlerleme();
  const tamam = DERSLER.filter(d => tamamlananDersler.includes(d.slug)).length;
  const siradaki = DERSLER.find(d => !tamamlananDersler.includes(d.slug)) ?? DERSLER[0];
  const son = sinavlar[0];

  return (
    <div className="space-y-6">
      <section className="glass-card p-5 relative overflow-hidden" style={{ borderColor: "rgba(16,185,129,0.25)" }}>
        <div
          className="absolute -top-8 -right-8 w-40 h-40 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(16,185,129,0.28) 0%, transparent 70%)", filter: "blur(18px)" }}
        />
        <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-400">Temel EKG ve Ritim Bozuklukları</p>
        <h2 className="text-xl font-extrabold mt-1 leading-snug">Bakmak ve görmek farklı şeylerdir.</h2>
        <p className="text-xs text-muted mt-1.5 leading-relaxed max-w-md">
          Ritimleri 5 adımlı ortak bir yöntemle değerlendirmeyi öğrenin, gerçek EKG&apos;lerle pratik yapın ve vaka sınavıyla
          kendinizi sınayın.
        </p>
        <div className="mt-4 space-y-1.5">
          <div className="flex justify-between text-[11px] font-bold">
            <span className="text-muted">Eğitim ilerlemesi</span>
            <span className="text-emerald-400">{tamam}/{DERSLER.length} ders</span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full w-full rounded-full bg-emerald-400 origin-left transition-transform duration-200 ease-out" style={{ transform: `scaleX(${tamam / DERSLER.length})` }} />
          </div>
        </div>
        <Link
          href={`/ekg-egitim/ders/${siradaki.slug}`}
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-black bg-emerald-500 text-slate-950"
        >
          {tamam === 0 ? "Eğitime başla" : tamam === DERSLER.length ? "Baştan göz at" : `Devam et: ${siradaki.baslik}`}
          <ChevronRight className="w-4 h-4" />
        </Link>
      </section>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link href="/ekg-egitim/sinav" className="glass-card glass-hover p-4 flex items-start gap-3" style={{ borderColor: "rgba(245,158,11,0.25)" }}>
          <span className="w-10 h-10 shrink-0 rounded-2xl flex items-center justify-center bg-amber-500/15 border border-amber-500/30">
            <Trophy className="w-5 h-5 text-amber-400" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-bold">Vaka Sınavı</span>
            <span className="block text-[11px] text-muted mt-0.5">
              {son ? `Son sonuç: %${Math.round((son.adimDogru / son.adimToplam) * 100)} · ${son.kapsam}` : "Gerçek ve üretilmiş vakalarla 5 adımlı değerlendirme"}
            </span>
          </span>
        </Link>
        <Link href="/ekg-egitim/atlas" className="glass-card glass-hover p-4 flex items-start gap-3" style={{ borderColor: "rgba(56,189,248,0.25)" }}>
          <span className="w-10 h-10 shrink-0 rounded-2xl flex items-center justify-center bg-sky-500/15 border border-sky-500/30">
            <BookMarked className="w-5 h-5 text-sky-400" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-bold">Ritim Atlası</span>
            <span className="block text-[11px] text-muted mt-0.5">Tüm ritimlerin kriterleri ve örnek şeritleri — hızlı başvuru</span>
          </span>
        </Link>
      </div>

      <section className="space-y-2">
        <h2 className="text-[11px] font-bold uppercase tracking-widest text-subtle">Dersler</h2>
        <ol className="glass-card divide-y divide-white/5 overflow-hidden">
          {DERSLER.map(d => {
            const ok = tamamlananDersler.includes(d.slug);
            return (
              <li key={d.slug}>
                <Link href={`/ekg-egitim/ders/${d.slug}`} className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors">
                  {ok ? <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" /> : <Circle className="w-5 h-5 shrink-0 text-subtle" />}
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold">
                      {d.no}. {d.baslik}
                    </span>
                    <span className="block text-[11px] text-muted truncate">{d.ozet}</span>
                  </span>
                  <ChevronRight className="w-4 h-4 shrink-0 text-subtle" />
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      {sinavlar.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-subtle">Sınav geçmişi (bu cihaz)</h2>
          <ul className="glass-card divide-y divide-white/5 overflow-hidden">
            {sinavlar.slice(0, 5).map(s => {
              const y = Math.round((s.adimDogru / s.adimToplam) * 100);
              return (
                <li key={s.tarih} className="flex items-center justify-between gap-3 px-4 py-2.5">
                  <span className="min-w-0">
                    <span className="block text-xs font-bold">{s.kapsam} · {s.soruSayisi} vaka</span>
                    <span className="block text-[11px] text-subtle">{tarihBicim(s.tarih)} · {s.taniDogru}/{s.soruSayisi} tanı doğru</span>
                  </span>
                  <span className={`text-sm font-black tabular-nums ${y >= 85 ? "text-emerald-400" : y >= 60 ? "text-amber-400" : "text-red-400"}`}>%{y}</span>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <p className="text-[11px] text-subtle leading-relaxed">
        Kaynak: ASH Genel Müdürlüğü Eğitim ve Projeler Daire Başkanlığı — “Temel EKG (Elektrokardiyografi)” eğitim sunumu. Gerçek
        vaka görüntüleri bu sunumdan alınmıştır; alıştırma şeritleri standart kağıt ölçeğinde (25 mm/sn, 10 mm/mV) üretilir.
      </p>
    </div>
  );
}
