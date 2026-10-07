"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Droplet, RotateCcw, X, BookOpen } from "lucide-react";
import BurnMap, { type BurnMapView } from "@/components/skalalar/BurnMap";
import {
  AGE_OPTIONS,
  BURN_ZONES,
  formatPercent,
  totalBurnPercent,
  zonePercent,
  defaultParklandGroup,
  parklandEsikKarsilandi,
  parklandSaatlikHiz,
  PARKLAND_ETIKET,
  PARKLAND_KATSAYI,
  type AgeGroup,
  type ParklandGroup,
} from "@/lib/burn";

const VIEW_OPTIONS: { value: BurnMapView; label: string }[] = [
  { value: "both", label: "Ön + Arka" },
  { value: "anterior", label: "Ön" },
  { value: "posterior", label: "Arka" },
];

interface BurnCalculatorEmbedProps {
  /** "tbsa": önce yanık yüzdesi, kilo isteğe bağlı (İnteraktif Yanık Hesaplama)
   *  "parkland": önce yaş & kilo, ardından yüzde ve sıvı hesabı (Parkland Formülü) */
  variant?: "tbsa" | "parkland";
}

export default function BurnCalculatorEmbed({ variant = "tbsa" }: BurnCalculatorEmbedProps) {
  const [kilo, setKilo] = useState("");
  const [ageGroup, setAgeGroup] = useState<AgeGroup>("Erişkin");
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [view, setView] = useState<BurnMapView>("both");
  const [inputMode, setInputMode] = useState<"visual" | "manual">("visual");
  const [manualTbsa, setManualTbsa] = useState("");
  const [isZoomed, setIsZoomed] = useState(false);
  // Parkland formül grubu: yaş grubundan varsayılır, elle değiştirilebilir; elektrik çarpması herkes için 4 mL
  const [yasGrubuSecim, setYasGrubuSecim] = useState<Exclude<ParklandGroup, "elektrik"> | null>(null);
  const [elektrik, setElektrik] = useState(false);

  const toggleZone = useCallback((id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  useEffect(() => {
    if (!isZoomed) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setIsZoomed(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isZoomed]);

  const calculatedTbsa = useMemo(() => totalBurnPercent(selected, ageGroup), [selected, ageGroup]);
  const selectedZones = useMemo(() => BURN_ZONES.filter(z => selected.has(z.id)), [selected]);

  const manualValue = parseFloat(manualTbsa.replace(",", "."));
  const tbsa = inputMode === "manual" ? (Number.isFinite(manualValue) ? manualValue : 0) : calculatedTbsa;
  const tbsaInvalid = tbsa < 0 || tbsa > 100;

  const k = parseFloat(kilo);
  const kiloInvalid = kilo !== "" && (!Number.isFinite(k) || k <= 0 || k > 300);
  const valid = !kiloInvalid && k > 0 && tbsa > 0 && !tbsaInvalid;

  const yasGrubu = yasGrubuSecim ?? defaultParklandGroup(ageGroup);
  const grup: ParklandGroup = elektrik ? "elektrik" : yasGrubu;
  const katsayi = PARKLAND_KATSAYI[grup];
  const saatlikHiz = valid ? parklandSaatlikHiz(grup, k, tbsa) : null;
  const esikKarsilandi = valid ? parklandEsikKarsilandi(k, tbsa) : true;

  /* ───────────── Parçalar ───────────── */

  const ageSelector = (
    <div className="space-y-2">
      <label className="text-xs font-bold text-muted uppercase tracking-wide">Yaş Grubu (Lund-Browder)</label>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {AGE_OPTIONS.map(age => (
          <button
            key={age}
            type="button"
            onClick={() => setAgeGroup(age)}
            aria-pressed={ageGroup === age}
            className={`py-2.5 px-2 rounded-lg text-sm font-bold transition active:scale-[0.97] ${
              ageGroup === age
                ? "bg-teal-500/20 text-teal-300 border border-teal-500/50 shadow-[0_0_15px_rgba(20,184,166,0.3)] ring-2 ring-teal-500/20"
                : "bg-black/20 text-muted border border-white/5 hover:bg-white/5"
            }`}
          >
            {age === "Erişkin" ? "Erişkin" : `${age} yaş`}
          </button>
        ))}
      </div>
      {ageGroup !== "Erişkin" && (
        <p className="text-[11px] text-subtle leading-relaxed">
          Çocukta baş, uyluk ve alt bacak yüzdeleri Lund-Browder tablosuna göre yaşa uyarlanır; haritadaki etiketler de güncellenir.
        </p>
      )}
    </div>
  );

  const formulSecici = (
    <div className="space-y-2">
      <span className="text-xs font-bold text-muted uppercase tracking-wide">Formül Grubu</span>
      <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Parkland formül grubu">
        {(["buyuk", "kucuk"] as const).map(g => (
          <button
            key={g}
            type="button"
            role="radio"
            aria-checked={!elektrik && yasGrubu === g}
            disabled={elektrik}
            onClick={() => setYasGrubuSecim(g)}
            className={`min-h-11 px-2 py-1.5 rounded-lg text-xs font-bold leading-tight transition active:scale-[0.97] disabled:opacity-40 ${
              !elektrik && yasGrubu === g
                ? "bg-teal-500/20 text-teal-300 border border-teal-500/50"
                : "bg-black/20 text-muted border border-white/5 hover:bg-white/5"
            }`}
          >
            {PARKLAND_ETIKET[g]} <span className="font-semibold opacity-80 tabular-nums">· {PARKLAND_KATSAYI[g]} mL</span>
          </button>
        ))}
      </div>
      <label className="flex items-center gap-3 min-h-11 px-3 rounded-lg border border-white/10 bg-black/20 cursor-pointer">
        <input
          type="checkbox"
          checked={elektrik}
          onChange={e => setElektrik(e.target.checked)}
          className="w-5 h-5 accent-amber-500"
        />
        <span className="text-sm font-bold">Elektrik çarpması <span className="font-semibold text-muted tabular-nums">· herkes için 4 mL</span></span>
      </label>
      {ageGroup === "10" && !elektrik && yasGrubuSecim === null && (
        <p className="text-[11px] text-subtle leading-relaxed">10 yaş grubu 10–14 yaşı kapsar; hasta 13 yaş ve üzeriyse “13 yaş üstü / erişkin”i seçin.</p>
      )}
    </div>
  );

  const kiloInput = (
    <div className="space-y-2">
      <label htmlFor="burn-kilo" className="text-xs font-bold text-muted uppercase tracking-wide">Hasta Kilosu (kg)</label>
      <input
        id="burn-kilo"
        type="text"
        inputMode="decimal"
        value={kilo}
        onChange={e => {
          const val = e.target.value.replace(",", ".");
          if (val === "" || /^\d*\.?\d*$/.test(val)) setKilo(val);
        }}
        placeholder="Örn: 70"
        className="w-full text-xl font-black text-white bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition placeholder-white/20"
      />
      {kiloInvalid && (
        <p className="text-xs font-bold text-red-400">Lütfen geçerli bir kilo değeri giriniz (1–300 kg arası).</p>
      )}
    </div>
  );

  const tbsaCard = (
    <div className="glass-card rounded-2xl shadow-sm">
      <div className="px-4 py-3 border-b border-white/10 bg-orange-500/5 flex justify-between items-center gap-3">
        <p className="text-xs font-bold text-orange-400 uppercase tracking-widest">
          {variant === "parkland" ? "2. Adım · " : "1. Adım · "}Yanık Yüzdesi
        </p>
        <span className="text-orange-300 font-black bg-orange-500/20 px-2.5 py-0.5 rounded text-sm tabular-nums" aria-live="polite">
          %{formatPercent(tbsa)}
        </span>
      </div>

      <div className="p-4 flex flex-col gap-4">
        <div className="flex bg-black/20 p-1 rounded-xl" role="tablist">
          {(["visual", "manual"] as const).map(m => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={inputMode === m}
              onClick={() => setInputMode(m)}
              className={`flex-1 min-h-11 py-2 text-sm font-bold rounded-lg transition ${
                inputMode === m ? "bg-orange-500/20 text-orange-300 border border-orange-500/50 shadow-sm" : "text-muted hover:bg-white/5"
              }`}
            >
              {m === "visual" ? "Haritadan Seç" : "Manuel Gir"}
            </button>
          ))}
        </div>

        {inputMode === "manual" ? (
          <div className="space-y-3 animate-in fade-in">
            <label htmlFor="burn-manual" className="text-xs font-bold text-muted uppercase tracking-wide">Tahmini Yanık Yüzdesi (%)</label>
            <input
              id="burn-manual"
              type="text"
              inputMode="decimal"
              value={manualTbsa}
              onChange={e => {
                const val = e.target.value.replace(",", ".");
                if (val === "" || /^\d*\.?\d*$/.test(val)) setManualTbsa(val);
              }}
              placeholder="Örn: 15.5"
              className="w-full text-xl font-black text-white bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition placeholder-white/20"
            />
            {tbsaInvalid && <p className="text-xs font-bold text-red-400">Yanık yüzdesi %100&apos;ü geçemez.</p>}
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in">
            <p className="text-xs text-subtle leading-relaxed">
              Yanık olan bölgelere dokunun; her bölgenin yüzdesi toplama eklenir, tekrar dokununca çıkarılır.
              Sağ/sol <strong className="text-muted">hastaya göredir</strong>. Yalnızca 2. ve 3. derece yanıkları işaretleyin.
            </p>

            <div className="flex bg-black/20 p-1 rounded-xl" role="radiogroup" aria-label="Görünüm">
              {VIEW_OPTIONS.map(o => (
                <button
                  key={o.value}
                  type="button"
                  role="radio"
                  aria-checked={view === o.value}
                  onClick={() => setView(o.value)}
                  className={`flex-1 min-h-10 py-1.5 text-xs font-bold rounded-lg transition chip-hit ${
                    view === o.value ? "bg-white/10 text-white border border-white/20" : "text-muted hover:bg-white/5"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>

            <div className="rounded-xl bg-black/[0.03] dark:bg-black/20 border border-white/10 px-2 pt-2 pb-3">
              {view === "both" ? (
                <div className="grid grid-cols-2 text-center text-[11px] font-bold uppercase tracking-widest text-subtle mb-1">
                  <span>Ön</span>
                  <span>Arka</span>
                </div>
              ) : (
                <p className="text-center text-[11px] font-bold uppercase tracking-widest text-subtle mb-1">
                  {view === "anterior" ? "Ön" : "Arka"}
                </p>
              )}
              <BurnMap selected={selected} onToggle={toggleZone} ageGroup={ageGroup} view={view} />
            </div>

            <div className="flex items-center justify-between rounded-xl bg-orange-500/10 border border-orange-500/25 px-4 py-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-orange-300/80">Toplam Yanık (TBSA)</p>
                <p className="text-[11px] text-subtle">{selectedZones.length} bölge seçili</p>
              </div>
              <p className="text-3xl font-black text-orange-400 tabular-nums">%{formatPercent(calculatedTbsa)}</p>
            </div>

            {selectedZones.length > 0 && (
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-muted uppercase tracking-widest">Seçili bölgeler</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedZones.map(z => (
                    <button
                      key={z.id}
                      type="button"
                      onClick={() => toggleZone(z.id)}
                      aria-label={`${z.name_tr} bölgesini çıkar`}
                      className="flex items-center gap-1 px-2 py-1 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-300 text-xs font-bold hover:bg-red-500/20 hover:border-red-500/40 hover:text-red-300 transition"
                    >
                      {z.name_tr}
                      <span className="opacity-70 text-[11px]">%{formatPercent(zonePercent(z, ageGroup))}</span>
                      <X className="w-3 h-3 opacity-60" />
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setSelected(new Set())}
                  className="w-full min-h-11 py-2 bg-red-500/10 text-red-400 rounded-lg text-sm font-bold border border-red-500/20 active:scale-[0.97] transition flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Seçimleri Temizle
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => setIsZoomed(true)}
              className="w-full min-h-11 flex items-center justify-center gap-2 py-2 text-xs font-bold text-muted rounded-lg border border-white/10 hover:bg-white/5 transition"
            >
              <BookOpen className="w-3.5 h-3.5" /> Referans Lund-Browder Şeması
            </button>
          </div>
        )}
      </div>
    </div>
  );

  /* ───────────── Sayfa ───────────── */

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-200">
      {variant === "parkland" ? (
        <>
          <div className="glass-card rounded-2xl shadow-sm">
            <div className="px-4 py-3 border-b border-white/10 bg-teal-500/5">
              <p className="text-xs font-bold text-teal-400 uppercase tracking-widest">1. Adım · Yaş &amp; Kilo</p>
            </div>
            <div className="p-4 flex flex-col gap-5">
              {ageSelector}
              {formulSecici}
              {kiloInput}
            </div>
          </div>
          {tbsaCard}
        </>
      ) : (
        <>
          <div className="glass-card rounded-2xl shadow-sm p-4">{ageSelector}</div>
          {tbsaCard}
          <div className="glass-card rounded-2xl shadow-sm">
            <div className="px-4 py-3 border-b border-white/10 bg-teal-500/5">
              <p className="text-xs font-bold text-teal-400 uppercase tracking-widest">2. Adım · Sıvı İhtiyacı (Parkland)</p>
            </div>
            <div className="p-4 flex flex-col gap-5">
              {formulSecici}
              {kiloInput}
            </div>
          </div>
        </>
      )}

      {/* Sonuç: Parkland — saatlik başlangıç hızı (SB Hastane Öncesi Akış Şemaları s. 48, 133) */}
      {valid && saatlikHiz !== null && (
        <div role="status" aria-live="polite" className="space-y-3 animate-in fade-in slide-in-from-bottom-4">
          {!esikKarsilandi && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-xs text-amber-200/90 leading-relaxed">
              <span className="font-bold text-amber-400 block mb-1">Sıvı eşiğinin altında</span>
              Hastane öncesinde sıvı tedavisi; vücut ağırlığı 30 kg ve üzerindeyse %15 ve üzeri,
              30 kg altındaysa %10 ve üzeri yanıkta verilir. Bu hastada yanık %{formatPercent(tbsa)}, kilo {k} kg.
            </div>
          )}

          <div className="bg-teal-600 rounded-2xl p-5 text-center text-white shadow-[0_0_30px_rgba(13,148,136,0.3)] border border-teal-400">
            <div className="flex items-center justify-center gap-2 mb-2 opacity-90">
              <Droplet className="w-4 h-4" />
              <p className="text-xs font-bold uppercase tracking-wider">Saatlik Başlangıç Sıvısı (Ringer Laktat)</p>
            </div>
            <p className="text-5xl font-black tracking-tight tabular-nums">
              {saatlikHiz.toFixed(0)} <span className="text-xl opacity-80">mL/saat</span>
            </p>
            <p className="text-[11px] opacity-90 mt-1 tabular-nums">
              ({katsayi} × %{formatPercent(tbsa)} × {k} kg) / 16 · {PARKLAND_ETIKET[grup]}
            </p>
          </div>

          <div className="glass-card rounded-2xl p-4 grid grid-cols-2 gap-3 text-center">
            <div>
              <p className="text-[11px] font-bold text-muted uppercase tracking-wide">İlk 8 saatte</p>
              <p className="text-2xl font-black tabular-nums">{(saatlikHiz * 8).toFixed(0)} <span className="text-xs font-bold text-muted">mL</span></p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-muted uppercase tracking-wide">24 saatlik toplam</p>
              <p className="text-2xl font-black tabular-nums">{(katsayi * tbsa * k).toFixed(0)} <span className="text-xs font-bold text-muted">mL</span></p>
            </div>
            <p className="col-span-2 text-[11px] text-subtle leading-relaxed">
              Saatlik hız, 24 saatlik toplamın ({katsayi} mL × kg × %VYA) yarısının ilk 8 saatte verilmesine karşılık gelir.
            </p>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-xs text-amber-200/90 leading-relaxed shadow-inner space-y-1.5">
            <span className="font-bold text-amber-400 block">⚠️ Klinik Not (SB Akış Şemaları)</span>
            <p>1. derece yanıklar yanık yüzdesine dahil edilmez.</p>
            <p>Formül saatlik başlangıç miktarını verir; idrar çıkışına göre saatlik miktar %10–30 oranında artırılır veya azaltılır
              (hedef idrar çıkışı erişkinde 0,5–1 mL/kg/saat, çocukta 1 mL/kg/saat).</p>
            <p>1 saatten kısa nakillerde 500 mL Ringer Laktat; uzun süreli nakillerde Parkland formülü kullanılır, vital bulgu ve idrar takibi yapılır.</p>
            {grup === "kucuk" && <p>İnfant ve 30 kg altı küçük çocuklarda Ringer Laktat ile birlikte verilmelidir.</p>}
          </div>
        </div>
      )}

      {/* Referans şema (tam ekran) */}
      {isZoomed && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Referans Lund-Browder şeması"
          className="fixed inset-0 z-[100] backdrop-blur-md flex items-center justify-center p-2 sm:p-6 cursor-zoom-out animate-in fade-in zoom-in-95 duration-200"
          style={{ backgroundColor: "var(--bg)" }}
          onClick={() => setIsZoomed(false)}
        >
          <div className="relative w-full h-full max-w-5xl flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/burn-reference.svg" alt="Lund-Browder referans şeması" className="w-full h-full object-contain svg-invert-in-dark" />
          </div>
          <button
            type="button"
            className="absolute top-6 right-6 px-4 py-2 rounded-full text-sm font-bold border transition shadow-lg"
            style={{ backgroundColor: "var(--glass-bg-hover)", borderColor: "var(--glass-border)", color: "var(--fg)" }}
          >
            Kapat
          </button>
        </div>
      )}
    </div>
  );
}
