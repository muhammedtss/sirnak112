import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DosyaListesi } from "@/components/egitim/DosyaListesi";
import { EgitimSayfa } from "@/components/egitim/EgitimSayfa";
import { VideoListesi } from "@/components/egitim/VideoListesi";
import { bolumBySlug, kisaBaslik } from "@/lib/egitim";
import { pageMeta } from "@/lib/seo";
import { staticParamsFor } from "@/lib/static-params";

export const dynamicParams = false;

export function generateStaticParams() {
  return staticParamsFor("/egitim/dokumanlar/[slug]");
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const b = bolumBySlug((await params).slug);
  if (!b) return { title: "Eğitim Dökümanları" };
  const videolar = b.videolar.length ? ` ve ${b.videolar.length} eğitim videosu` : "";
  return pageMeta(
    `/egitim/dokumanlar/${b.slug}`,
    b.baslik,
    `Sağlık Bakanlığı ASHGM ${kisaBaslik(b.baslik)} eğitimi: ${b.dosyalar.length} eğitim belgesi${videolar}; kaynak sitedeki özgün dosyalar.`,
  );
}

export default async function BolumPage({ params }: { params: Promise<{ slug: string }> }) {
  const b = bolumBySlug((await params).slug);
  if (!b) notFound();

  return (
    <EgitimSayfa title={kisaBaslik(b.baslik)} back="/egitim/dokumanlar" kaynak={{ url: b.kaynakUrl, baslik: b.baslik }}>
      <h2 className="text-lg font-extrabold leading-snug text-balance px-1">{b.baslik}</h2>

      <section aria-labelledby="belgeler" className="space-y-2">
        <h3 id="belgeler" className="text-[11px] font-bold uppercase tracking-widest text-subtle px-1 tabular-nums">
          Belgeler ({b.dosyalar.length})
        </h3>
        <DosyaListesi dosyalar={b.dosyalar} />
      </section>

      {b.videolar.length > 0 && (
        <section aria-labelledby="videolar" className="space-y-2">
          <h3 id="videolar" className="text-[11px] font-bold uppercase tracking-widest text-subtle px-1 tabular-nums">
            Videolar ({b.videolar.length})
          </h3>
          <VideoListesi videolar={b.videolar} />
        </section>
      )}
    </EgitimSayfa>
  );
}
