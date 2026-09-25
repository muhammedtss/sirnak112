"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import { Search, X, Copy, Check, FileSearch } from "lucide-react";
import icdData from "@/data/icd10.json";
import { PageShell } from "@/components/layout/PageShell";
import { AppHeader } from "@/components/layout/AppHeader";

interface IcdEntry {
  kod: string; ad: string; tr: string; kategori: string; anahtar: string;
}
const data = icdData as IcdEntry[];

const kategoriler = [
  "Tümü","Kardiyovasküler","Solunum","Nöroloji","Gastrointestinal",
  "Endokrin/Metabolik","Ürogenital","Obstetrik","Travma","Travma/Çevre",
  "Zehirlenme","Enfeksiyon","Psikiyatri","Semptom/Bulgu",
];

/* Map categories to design system glass pill classes */
const katRenk: Record<string, { bg: string; color: string; dot: string; border: string }> = {
  "Kardiyovasküler":    { bg: "rgba(248,113,113,0.12)", color: "#FCA5A5", dot: "#EF4444", border: "rgba(248,113,113,0.25)" },
  "Solunum":            { bg: "rgba(56,189,248,0.10)",  color: "#7DD3FC", dot: "#38BDF8", border: "rgba(56,189,248,0.22)" },
  "Nöroloji":           { bg: "rgba(167,139,250,0.10)", color: "#C4B5FD", dot: "#A78BFA", border: "rgba(167,139,250,0.22)" },
  "Gastrointestinal":   { bg: "rgba(251,191,36,0.10)",  color: "#FDE68A", dot: "#FBBF24", border: "rgba(251,191,36,0.22)" },
  "Endokrin/Metabolik": { bg: "rgba(52,211,153,0.10)",  color: "#6EE7B7", dot: "#34D399", border: "rgba(52,211,153,0.22)" },
  "Ürogenital":         { bg: "rgba(34,211,238,0.10)",  color: "#A5F3FC", dot: "#22D3EE", border: "rgba(34,211,238,0.22)" },
  "Obstetrik":          { bg: "rgba(244,114,182,0.10)", color: "#FBCFE8", dot: "#F472B6", border: "rgba(244,114,182,0.22)" },
  "Travma":             { bg: "rgba(251,146,60,0.10)",  color: "#FED7AA", dot: "#FB923C", border: "rgba(251,146,60,0.22)" },
  "Travma/Çevre":       { bg: "rgba(234,179,8,0.10)",   color: "#FEF08A", dot: "#EAB308", border: "rgba(234,179,8,0.22)" },
  "Zehirlenme":         { bg: "rgba(132,204,22,0.10)",  color: "#D9F99D", dot: "#84CC16", border: "rgba(132,204,22,0.22)" },
  "Enfeksiyon":         { bg: "rgba(52,211,153,0.10)",  color: "#6EE7B7", dot: "#10B981", border: "rgba(52,211,153,0.22)" },
  "Psikiyatri":         { bg: "rgba(99,102,241,0.12)",  color: "#C7D2FE", dot: "#6366F1", border: "rgba(99,102,241,0.25)" },
  "Semptom/Bulgu":      { bg: "rgba(148,163,184,0.10)", color: "#CBD5E1", dot: "#94A3B8", border: "rgba(148,163,184,0.22)" },
};
const defaultRenk = { bg: "rgba(148,163,184,0.10)", color: "#CBD5E1", dot: "#94A3B8", border: "rgba(148,163,184,0.22)" };
const renk = (kat: string) => katRenk[kat] ?? defaultRenk;

function score(entry: IcdEntry, query: string): number {
  const q = query.toLowerCase().trim();
  if (!q) return 0;
  const terms = q.split(/\s+/);
  let s = 0;
  for (const t of terms) {
    if (entry.kod.toLowerCase().startsWith(t)) s += 30;
    if (entry.tr.toLowerCase().includes(t)) s += 20;
    if (entry.ad.toLowerCase().includes(t)) s += 15;
    if (entry.anahtar.toLowerCase().includes(t)) s += 10;
    if (entry.kategori.toLowerCase().includes(t)) s += 5;
  }
  return s;
}

export default function ICD10Page() {
  const [query, setQuery] = useState("");
  const [kategori, setKategori] = useState("Tümü");
  const [copied, setCopied] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const results = useMemo(() => {
    const q = query.trim();
    let list = data;
    if (kategori !== "Tümü") list = list.filter((e) => e.kategori === kategori);
    if (!q) return list.slice(0, 50);
    return list
      .map((e) => ({ entry: e, s: score(e, q) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 60)
      .map((x) => x.entry);
  }, [query, kategori]);

  const copyCode = (kod: string) => {
    navigator.clipboard.writeText(kod).then(() => {
      setCopied(kod);
      setTimeout(() => setCopied(null), 1500);
    });
  };

  return (
    <PageShell>
      <AppHeader
        title="ICD-10 Kod Bulucu"
        icon={<FileSearch style={{ width: 16, height: 16 }} />}
        back="/"
        badge={data.length}
      />

      {/* Sticky search + filter bar */}
      <div
        className="sticky top-[57px] z-10 px-4 py-3 space-y-2.5 glass border-b"
        style={{ borderColor: "var(--glass-border)" }}
      >
        {/* Search input */}
        <div className="relative">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-subtle"
            style={{ width: 15, height: 15 }}
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tanı, semptom, kod ara… (ör: MI, I21, hipertansiyon)"
            className="glass-input w-full pl-10 pr-9 py-2.5 text-sm font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle hover:text-muted transition-colors"
            >
              <X style={{ width: 15, height: 15 }} />
            </button>
          )}
        </div>

        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-0.5">
          {kategoriler.map((k) => {
            const isActive = kategori === k;
            const r = renk(k);
            return (
              <button
                key={k}
                onClick={() => setKategori(k)}
                className="shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full border transition-all"
                style={
                  isActive
                    ? { background: r.bg, color: r.color, borderColor: r.border }
                    : { background: "rgba(255,255,255,0.04)", color: "var(--fg-muted)", borderColor: "var(--glass-border)" }
                }
              >
                {k}
              </button>
            );
          })}
        </div>
      </div>

      {/* Result count */}
      <div className="px-4 pt-3 pb-1 max-w-2xl mx-auto w-full">
        <p className="text-[11px] font-medium text-subtle">
          {results.length} sonuç{query ? ` — "${query}"` : ""}
          {kategori !== "Tümü" ? ` — ${kategori}` : ""}
          {!query && " (ilk 50 — arama yapın)"}
        </p>
      </div>

      {/* Results */}
      <main className="flex-1 px-4 pb-6 space-y-2 mt-1 w-full max-w-2xl mx-auto">
        {results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-5xl mb-3">🔍</span>
            <p className="text-sm font-bold">Sonuç bulunamadı</p>
            <p className="text-subtle text-xs mt-1">Farklı anahtar kelime deneyin</p>
          </div>
        ) : (
          results.map((entry, idx) => {
            const r = renk(entry.kategori);
            const isCopied = copied === entry.kod;
            return (
              <div
                key={`${entry.kod}-${idx}`}
                className="glass-card overflow-hidden"
                style={{ borderColor: r.border }}
              >
                <div className="px-3.5 py-3 flex items-start gap-3">
                  {/* Copy button / code badge */}
                  <div className="shrink-0 mt-0.5">
                    <button
                      onClick={() => copyCode(entry.kod)}
                      title="Kodu kopyala"
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-sm font-bold transition-all active:scale-95"
                      style={
                        isCopied
                          ? { background: "rgba(52,211,153,0.2)", color: "#34D399", borderColor: "rgba(52,211,153,0.4)" }
                          : { background: r.bg, color: r.color, borderColor: r.border }
                      }
                    >
                      {isCopied ? (
                        <>
                          <Check style={{ width: 11, height: 11 }} strokeWidth={3} />
                          <span className="text-[11px]">Kopyalandı</span>
                        </>
                      ) : (
                        <>
                          <span>{entry.kod}</span>
                          <Copy style={{ width: 10, height: 10, opacity: 0.5 }} />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Entry content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold leading-tight" style={{ color: r.color }}>{entry.tr}</p>
                    <p className="text-[11px] text-subtle mt-0.5 leading-snug">{entry.ad}</p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: r.dot }} />
                      <span className="text-[10px] font-semibold" style={{ color: r.color, opacity: 0.8 }}>{entry.kategori}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </main>
    </PageShell>
  );
}
