import type { ReactNode } from "react";
import { ArrowUpRight, GraduationCap } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { AppHeader } from "@/components/layout/AppHeader";
import { EGITIM } from "@/lib/egitim";
import { tarihTr } from "@/lib/site-info";
import { CevrimdisiNot } from "./CevrimdisiNot";

/** Eğitim modülü sayfalarının ortak iskeleti: başlık, çevrimdışı notu, içerik ve kaynak satırı. */
export function EgitimSayfa({
  title,
  back,
  badge,
  kaynak,
  children,
}: {
  title: string;
  back: string;
  badge?: number;
  /** Bu sayfanın kaynak sitedeki karşılığı */
  kaynak: { url: string; baslik: string };
  children: ReactNode;
}) {
  return (
    <PageShell>
      <AppHeader title={title} back={back} badge={badge} icon={<GraduationCap style={{ width: 16, height: 16 }} />} />
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 pt-4 pb-24 space-y-5">
        <CevrimdisiNot />
        {children}
        <KaynakNotu {...kaynak} />
      </main>
    </PageShell>
  );
}

export function KaynakNotu({ url, baslik }: { url: string; baslik: string }) {
  return (
    <footer className="text-[11px] text-subtle leading-relaxed space-y-1 px-1">
      <p className="text-pretty">
        Kaynak: {EGITIM.yayinlayan},{" "}
        <a href={url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 decoration-(--glass-border-h) hover:text-fg">
          “{baslik}” sayfası
          <ArrowUpRight aria-hidden="true" className="inline align-[-2px] ml-0.5" style={{ width: 12, height: 12 }} />
          <span className="sr-only">(yeni sekmede açılır)</span>
        </a>{" "}
        · <time dateTime={EGITIM.aktarim}>{tarihTr(EGITIM.aktarim)}</time> tarihinde aktarıldı.
      </p>
      <p className="text-pretty">
        Belgeler Bakanlığın dosya sunucusundan açılır, videolar YouTube üzerinden oynatılır; ikisi de internet bağlantısı
        gerektirir.
      </p>
    </footer>
  );
}
