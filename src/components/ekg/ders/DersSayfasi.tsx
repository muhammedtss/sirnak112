"use client";

import Link from "next/link";
import { CheckCircle2, ChevronLeft, ChevronRight, Trophy } from "lucide-react";
import { DERSLER } from "@/lib/ekg/lessons";
import { dersiTamamla, useIlerleme } from "@/lib/ekg/progress";
import { DegerlendirmeDersi, EkgKagidiDersi, GirisDersi, IletiSistemiDersi } from "./TemelDersler";
import { ArrestRitimleriDersi, HizliRitimlerDersi, SiniflandirmaDersi, YavasRitimlerDersi } from "./RitimDersleri";

const ICERIK: Record<string, () => React.ReactElement> = {
  giris: GirisDersi,
  "ileti-sistemi": IletiSistemiDersi,
  "ekg-kagidi": EkgKagidiDersi,
  degerlendirme: DegerlendirmeDersi,
  siniflandirma: SiniflandirmaDersi,
  "hizli-ritimler": HizliRitimlerDersi,
  "yavas-ritimler": YavasRitimlerDersi,
  "arrest-ritimleri": ArrestRitimleriDersi,
};

export default function DersSayfasi({ slug }: { slug: string }) {
  const { tamamlananDersler } = useIlerleme();
  const i = DERSLER.findIndex(d => d.slug === slug);
  const ders = DERSLER[i];
  const onceki = DERSLER[i - 1];
  const sonraki = DERSLER[i + 1];
  const Icerik = ICERIK[slug];
  const tamam = tamamlananDersler.includes(slug);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 text-[11px] font-bold">
        <span className="uppercase tracking-widest text-emerald-400">Ders {ders.no} / {DERSLER.length}</span>
        <span className="text-subtle">Kaynak: slayt {ders.slaytlar}</span>
      </div>

      <Icerik />

      <div className="glass-card p-4 space-y-3">
        {tamam ? (
          <p className="flex items-center justify-center gap-1.5 text-sm font-bold text-emerald-400">
            <CheckCircle2 className="w-4 h-4" /> Bu dersi tamamladınız
          </p>
        ) : (
          <button
            type="button"
            onClick={() => dersiTamamla(slug)}
            className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl text-sm font-black bg-emerald-500 text-slate-950 active:scale-[0.98] transition-transform"
          >
            <CheckCircle2 className="w-4 h-4" /> Dersi tamamladım
          </button>
        )}
        <div className="flex gap-2">
          {onceki && (
            <Link
              href={`/ekg-egitim/ders/${onceki.slug}`}
              className="flex-1 flex items-center justify-center gap-1 py-2.5 rounded-xl text-xs font-bold border border-white/10 text-muted hover:bg-white/5"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Önceki
            </Link>
          )}
          {sonraki ? (
            <Link
              href={`/ekg-egitim/ders/${sonraki.slug}`}
              onClick={() => dersiTamamla(slug)}
              className="flex-[2] flex items-center justify-center gap-1 py-2.5 rounded-xl text-xs font-bold border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
            >
              {sonraki.no}. {sonraki.baslik} <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <Link
              href="/ekg-egitim/sinav"
              onClick={() => dersiTamamla(slug)}
              className="flex-[2] flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 text-slate-950"
            >
              <Trophy className="w-3.5 h-3.5" /> Vaka sınavına geç
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
