"use client";

import { useMemo, useState } from "react";
import { RefreshCw, Zap, ZapOff } from "lucide-react";
import EkgStrip from "./EkgStrip";
import {
  RITIMLER,
  RITIM_ETIKET,
  P_ETIKET,
  PQRS_ETIKET,
  QRS_ETIKET,
  type RitimId,
} from "@/lib/ekg/rhythms";
import { gercekVakaByRitim } from "@/lib/ekg/cases";
import { rastgeleSeed, uret } from "@/lib/ekg/generator";

/** Bir ritmin özet kartı: kriterler, kaynaktaki gerçek şerit ve üretilmiş örnek. */
export default function RitimKarti({ ritimId, varsayilanSeed = 1 }: { ritimId: RitimId; varsayilanSeed?: number }) {
  const r = RITIMLER[ritimId];
  const vaka = gercekVakaByRitim(ritimId);
  const [seed, setSeed] = useState(varsayilanSeed);
  const serit = useMemo(() => uret(ritimId, seed), [ritimId, seed]);

  const kriterler = r.analiz
    ? [
        ["Ritim", RITIM_ETIKET[serit.analiz?.ritim ?? r.analiz.ritim]],
        ["P dalgası", P_ETIKET[r.analiz.pDalgasi]],
        ["P-QRS ilişkisi", PQRS_ETIKET[r.analiz.pQrs]],
        ["QRS", QRS_ETIKET[r.analiz.qrs]],
      ]
    : null;

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <p className="text-sm font-bold">{r.ozet}</p>
        {r.soklanir !== undefined && (
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border ${
              r.soklanir ? "text-red-400 border-red-500/30 bg-red-500/10" : "text-sky-400 border-sky-500/30 bg-sky-500/10"
            }`}
          >
            {r.soklanir ? <Zap className="w-3 h-3" /> : <ZapOff className="w-3 h-3" />}
            {r.soklanir ? "Şoklanır ritim" : "Şoklanmaz ritim"}
          </span>
        )}
      </div>

      {kriterler && (
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {kriterler.map(([k, v]) => (
            <div key={k} className="rounded-lg bg-black/[0.03] dark:bg-black/20 border border-white/10 px-3 py-2">
              <dt className="text-[10px] font-bold uppercase tracking-widest text-subtle">{k}</dt>
              <dd className="text-xs font-semibold mt-0.5">{v}</dd>
            </div>
          ))}
        </dl>
      )}

      <ul className="space-y-1.5">
        {r.aciklama.map(a => (
          <li key={a} className="text-xs text-muted leading-relaxed flex gap-2">
            <span className="text-emerald-400 shrink-0">•</span>
            {a}
          </li>
        ))}
      </ul>

      {vaka && (
        <EkgStrip
          kaynak={{
            tur: "gercek",
            gorsel: vaka.gorsel,
            genislik: vaka.genislik,
            yukseklik: vaka.yukseklik,
            onikiDerivasyon: vaka.onikiDerivasyon,
            ipucu: vaka.ipucuCizgileri,
            alt: `${r.kisaAd} — kaynak sunumdaki EKG`,
          }}
          etiket={`Kaynak vaka · Slayt ${vaka.kaynakSlayt} · ${vaka.hizHesabi} ≈ ${vaka.hiz}/dk`}
        />
      )}

      <div className="space-y-2">
        <EkgStrip
          kaynak={{ tur: "uretilmis", serit, alt: `${r.kisaAd} — örnek şerit` }}
          etiket={`Örnek şerit${serit.hiz ? ` · ${serit.hiz}/dk` : ""}${serit.not ? ` · ${serit.not}` : ""}`}
        />
        <button
          type="button"
          onClick={() => setSeed(rastgeleSeed())}
          className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 hover:text-emerald-300"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Yeni örnek üret
        </button>
      </div>
    </div>
  );
}
