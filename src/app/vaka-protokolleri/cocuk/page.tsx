"use client";
import { useState } from "react";
import Link from "next/link";
import { Search, ChevronRight } from "lucide-react";
import cocukData from "@/data/cocuk.json";
import { PageShell } from "@/components/layout/PageShell";
import { AppHeader } from "@/components/layout/AppHeader";

export default function CocukVakaListesi() {
  const [searchTerm, setSearchTerm] = useState("");
  const all = (Object.values(cocukData) as any[]).sort((a, b) =>
    a.title.localeCompare(b.title, "tr")
  );
  const filtered = all.filter((a: any) =>
    a.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageShell>
      <AppHeader title="Çocuk Vaka Protokolleri" back="/vaka-protokolleri" badge={all.length} />
      <div className="sticky top-[57px] z-10 px-4 py-3 glass border-b" style={{ borderColor: "var(--glass-border)" }}>
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-subtle" style={{ width: 15, height: 15 }} />
          <input type="text" className="glass-input w-full pl-10 pr-4 py-2.5 text-sm" placeholder="Protokol ara..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>
      <main className="flex-1 px-4 py-4 w-full max-w-md mx-auto">
        <div className="flex flex-col gap-2.5">
          {filtered.length > 0 ? filtered.map((algo: any) => (
            <Link key={algo.id} href={`/vaka-protokolleri/cocuk/${algo.id}`} className="glass-card glass-hover flex items-center justify-between px-4 py-3.5 group">
              <span className="text-sm font-semibold leading-tight">{algo.title}</span>
              <ChevronRight className="shrink-0 text-subtle group-hover:text-primary transition-colors" style={{ width: 16, height: 16 }} />
            </Link>
          )) : (
            <div className="text-center py-16"><span className="text-4xl mb-3 block">🔍</span><p className="text-muted text-sm font-medium">Sonuç bulunamadı</p></div>
          )}
        </div>
      </main>
    </PageShell>
  );
}
