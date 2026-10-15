"use client";

import { useCallback, useDeferredValue, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, BookA, ChevronRight, CornerDownRight, Search, X } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { AppHeader } from "@/components/layout/AppHeader";
import { basHarf, HARFLER, KISALTMA, SOZLUK, sozlukAra, tanimi, type SozlukTerimi } from "@/lib/sozluk";

/** Sözlük modülünün rengi (DESIGN.md · module-sozluk). */
export const SOZLUK_RENK = "#D946EF";

const KATEGORI_ADI = Object.fromEntries(SOZLUK.kategoriler.map(k => [k.id, k.ad]));

/** Kartı görünür alanın ortasına getirir (aramadan veya kısaltma bağından gelince). */
function kartaGit(id: string, yumusak = true) {
  const el = document.getElementById(`t-${id}`);
  if (!el) return;
  const azHareket = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: yumusak && !azHareket ? "smooth" : "auto", block: "center" });
}

export function SozlukSayfasi() {
  const [sorgu, setSorgu] = useState("");
  const [kat, setKat] = useState<string | null>(null);
  const [isaretli, setIsaretli] = useState<string | null>(null);
  const gecikmeliSorgu = useDeferredValue(sorgu);

  const sonuc = useMemo(() => sozlukAra(gecikmeliSorgu, kat ?? undefined), [gecikmeliSorgu, kat]);
  const aramaVar = gecikmeliSorgu.trim().length > 0;

  // Harf grupları yalnızca arama yokken (alfabetik liste)
  const gruplar = useMemo(() => {
    if (aramaVar) return null;
    const m = new Map<string, SozlukTerimi[]>();
    for (const t of sonuc) {
      const h = basHarf(t.terim);
      if (!m.has(h)) m.set(h, []);
      m.get(h)!.push(t);
    }
    return HARFLER.filter(h => m.has(h)).map(h => [h, m.get(h)!] as const);
  }, [sonuc, aramaVar]);

  // Aramadan gelinen terim (#t-…) işaretlenir; Next istemci gezintisi :target'ı güncellemez
  useEffect(() => {
    const oku = () => {
      const m = location.hash.match(/^#t-([a-z0-9-]+)$/);
      if (!m) return;
      setIsaretli(m[1]);
      // Sayfa açılışında yazı tipi yüklenince satır kırılımları ve kart yükseklikleri değişir:
      // yazı tipleri hazır olunca konumlanır, kısa süre sonra bir kez daha düzeltilir.
      document.fonts.ready.then(() => {
        kartaGit(m[1], false);
        setTimeout(() => kartaGit(m[1], false), 400);
      });
    };
    const zaman = setTimeout(oku);
    window.addEventListener("hashchange", oku);
    return () => {
      clearTimeout(zaman);
      window.removeEventListener("hashchange", oku);
    };
  }, []);

  /** Kısaltmadan bağlı terime geçiş: filtreler temizlenir, kart işaretlenir. */
  const terimeGec = useCallback((id: string) => {
    setSorgu("");
    setKat(null);
    setIsaretli(id);
    history.replaceState(null, "", `#t-${id}`);
    setTimeout(() => kartaGit(id), 60);
  }, []);

  return (
    <PageShell>
      <AppHeader title="Tıbbi Sözlük" back="/" badge={SOZLUK.terimler.length} icon={<BookA style={{ width: 16, height: 16 }} />} />

      {/* ── Arama ve kategori ── */}
      <div className="sticky top-(--app-header-h) z-10 px-4 py-3 glass border-b space-y-3" style={{ borderColor: "var(--glass-border)" }}>
        <div className="relative max-w-2xl mx-auto">
          <Search aria-hidden="true" className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-subtle" style={{ width: 16, height: 16 }} />
          <input
            type="search"
            enterKeyHint="search"
            aria-label="Sözlükte ara"
            className="glass-input w-full pl-10 pr-11 py-2.5 text-sm"
            placeholder="Terim, kısaltma veya İngilizce karşılık ara…"
            value={sorgu}
            onChange={e => setSorgu(e.target.value)}
          />
          {sorgu && (
            <button type="button" onClick={() => setSorgu("")} aria-label="Aramayı temizle" className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-subtle hover:text-fg">
              <X style={{ width: 16, height: 16 }} />
            </button>
          )}
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1.5 -my-1.5 max-w-2xl mx-auto" role="group" aria-label="Kategori">
          {[{ id: null, ad: "Tümü", sayi: SOZLUK.terimler.length }, ...SOZLUK.kategoriler].map(k => {
            const secili = kat === k.id;
            return (
              <button
                key={k.id ?? "tumu"}
                type="button"
                onClick={() => setKat(k.id)}
                aria-pressed={secili}
                className="chip-hit shrink-0 text-xs font-bold px-3 py-1.5 rounded-full border transition-colors"
                style={
                  secili
                    ? { background: "color-mix(in srgb, var(--primary-light) 16%, transparent)", borderColor: "color-mix(in srgb, var(--primary-light) 50%, transparent)", color: "var(--accent-text)" }
                    : { background: "var(--glass-bg)", borderColor: "var(--glass-border)", color: "var(--fg-muted)" }
                }
              >
                {k.ad} <span className="tabular-nums opacity-70">{k.sayi}</span>
              </button>
            );
          })}
        </div>
      </div>

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 pt-4 pb-24 space-y-5">
        {/* ── Harf dizini ── */}
        {gruplar && gruplar.length > 1 && (
          <nav aria-label="Harf dizini" className="flex flex-wrap gap-1.5">
            {gruplar.map(([h]) => (
              <a key={h} href={`#harf-${h}`} className="sozluk-harf">
                {h}
              </a>
            ))}
          </nav>
        )}

        <p aria-live="polite" className="text-xs font-semibold text-subtle tabular-nums px-1">
          {aramaVar ? `${sonuc.length} sonuç` : `${sonuc.length} terim`}
          {kat && ` · ${KATEGORI_ADI[kat]}`}
        </p>

        {sonuc.length === 0 && (
          <div className="glass-card p-6 text-center space-y-1">
            <p className="text-sm font-bold">Sonuç bulunamadı</p>
            <p className="text-xs text-muted">Farklı bir yazım, kısaltma veya İngilizce karşılık deneyin.</p>
          </div>
        )}

        {gruplar
          ? gruplar.map(([h, liste]) => (
              <section key={h} aria-labelledby={`harf-${h}`} className="space-y-2.5">
                <h2 id={`harf-${h}`} className="scroll-mt-48 text-lg font-extrabold px-1" style={{ color: SOZLUK_RENK }}>
                  {h}
                </h2>
                {liste.map(t => (
                  <TerimKarti key={t.id} t={t} isaretli={isaretli === t.id} terimeGec={terimeGec} />
                ))}
              </section>
            ))
          : sonuc.length > 0 && (
              <div className="space-y-2.5">
                {sonuc.slice(0, 200).map(t => (
                  <TerimKarti key={t.id} t={t} isaretli={isaretli === t.id} terimeGec={terimeGec} />
                ))}
                {sonuc.length > 200 && <p className="text-xs text-subtle text-center">İlk 200 sonuç gösteriliyor; aramayı daraltın.</p>}
              </div>
            )}

        <footer className="text-[11px] text-subtle leading-relaxed space-y-1.5 px-1 pt-2">
          <p className="text-pretty">
            Tanımlar hastane öncesi acil sağlık personeline yönelik genel bilgilendirme amacıyla hazırlanmıştır; doz ve tedavi
            kararı için ilgili algoritma, İlaç Dozu modülü ve hekim talimatı esastır.
          </p>
          <p className="text-pretty">
            Uluslararası karşılıklar: U.S. National Library of Medicine, Medical Subject Headings (MeSH). NLM bu uygulamayı onaylamaz
            veya desteklemez. Sözlük sürümü: <time dateTime={SOZLUK.surum}>{SOZLUK.surum}</time>.
          </p>
        </footer>
      </main>
    </PageShell>
  );
}

function TerimKarti({ t, isaretli, terimeGec }: { t: SozlukTerimi; isaretli: boolean; terimeGec: (id: string) => void }) {
  const { tanim, kaynak } = tanimi(t);
  const kisaltma = t.kat === KISALTMA;
  return (
    <article id={`t-${t.id}`} data-isaretli={isaretli} className="sozluk-kart glass-card p-4 scroll-mt-48">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-bold leading-snug text-pretty">{t.terim}</h3>
        <span className="shrink-0 text-[11px] font-semibold text-subtle mt-0.5">{KATEGORI_ADI[t.kat]}</span>
      </div>
      {kisaltma && t.es && <p className="text-sm font-semibold mt-0.5 text-pretty" style={{ color: "var(--accent-text)" }}>{t.es.join(" · ")}</p>}
      {!kisaltma && t.es && <p className="text-xs text-muted mt-0.5 text-pretty">Diğer adları: {t.es.join(", ")}</p>}
      {t.en && (
        <p lang="en" className="text-xs text-subtle italic mt-0.5">
          {t.en}
        </p>
      )}
      {tanim && <p className="text-sm text-muted leading-relaxed mt-2 text-pretty">{tanim}</p>}
      {kaynak && (
        <button type="button" onClick={() => terimeGec(kaynak.id)} className="mt-2 inline-flex items-center gap-1.5 min-h-9 text-xs font-bold" style={{ color: "var(--accent-text)" }}>
          <CornerDownRight aria-hidden="true" style={{ width: 14, height: 14 }} />
          {kaynak.terim}
        </button>
      )}
      {(t.ilgili?.length || t.mesh) && (
        <div className="flex flex-wrap gap-2 mt-3">
          {t.ilgili?.map(b => (
            <Link key={b.yol} href={b.yol} className="sozluk-bag chip-hit">
              {b.ad}
              <ChevronRight aria-hidden="true" style={{ width: 13, height: 13 }} />
            </Link>
          ))}
          {t.mesh && (
            <a href={`https://meshb.nlm.nih.gov/record/ui?ui=${t.mesh.id}`} target="_blank" rel="noopener noreferrer" className="sozluk-bag chip-hit" lang="en">
              MeSH: {t.mesh.ad}
              <ArrowUpRight aria-hidden="true" style={{ width: 13, height: 13 }} />
              <span className="sr-only">(yeni sekmede açılır)</span>
            </a>
          )}
        </div>
      )}
    </article>
  );
}
