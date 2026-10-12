import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { EgitimSayfa } from "@/components/egitim/EgitimSayfa";
import { kategori, kisaBaslik } from "@/lib/egitim";
import { seoFor } from "@/lib/seo";

export const metadata = seoFor("/egitim/dokumanlar");

const k = kategori("dokumanlar");

export default function DokumanlarPage() {
  return (
    <EgitimSayfa title={k.baslik} back="/egitim" badge={k.bolumler.length} kaynak={{ url: k.kaynakUrl, baslik: k.baslik }}>
      <ul className="glass-card overflow-hidden divide-y divide-(--glass-border)">
        {k.bolumler.map(b => (
          <li key={b.slug}>
            <Link href={`/egitim/dokumanlar/${b.slug}`} className="liste-satir flex items-center gap-3 px-4 py-3.5 min-h-14">
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-semibold leading-snug text-pretty">{kisaBaslik(b.baslik)}</span>
                <span className="block text-[11px] text-muted mt-0.5 tabular-nums">
                  {b.dosyalar.length} belge
                  {b.videolar.length > 0 && ` · ${b.videolar.length} video`}
                </span>
              </span>
              <ChevronRight aria-hidden="true" className="liste-ileri shrink-0 text-subtle" style={{ width: 16, height: 16 }} />
            </Link>
          </li>
        ))}
      </ul>
    </EgitimSayfa>
  );
}
