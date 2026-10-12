import Link from "next/link";
import { BookOpen, ChevronRight, Files, ImageIcon, PlayCircle, type LucideIcon } from "lucide-react";
import { EgitimSayfa } from "@/components/egitim/EgitimSayfa";
import { EGITIM_RENK } from "@/components/egitim/renk";
import { EGITIM, kategori, kategoriYolu, ozet, type KategoriId } from "@/lib/egitim";
import { seoFor } from "@/lib/seo";

export const metadata = seoFor("/egitim");

const o = ozet();

/** Kaynak sitedeki sırayla dört kategori. */
const KARTLAR: { id: KategoriId; ikon: LucideIcon; aciklama: string }[] = [
  { id: "dokumanlar", ikon: Files, aciklama: `${o.egitim} eğitim · ${o.belge} belge` },
  { id: "videolar", ikon: PlayCircle, aciklama: `${kategori("videolar").videolar.length} uygulama videosu` },
  { id: "kitaplar", ikon: BookOpen, aciklama: `${o.kitap} kitap ve rehber` },
  { id: "afisler", ikon: ImageIcon, aciklama: `${o.afis} afiş · baskıya hazır PDF` },
];

const SAYILAR: [number, string][] = [
  [o.belge, "belge"],
  [o.video, "video"],
  [o.kitap, "kitap"],
  [o.afis, "afiş"],
];

export default function EgitimPage() {
  return (
    <EgitimSayfa title="Eğitim" back="/" kaynak={{ url: EGITIM.kaynak, baslik: "Eğitim" }}>
      <section className="hero-card glass-card p-5 relative overflow-hidden" style={{ "--kat": EGITIM_RENK } as React.CSSProperties}>
        <div
          aria-hidden="true"
          className="absolute -top-8 -right-8 w-40 h-40 rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${EGITIM_RENK}47 0%, transparent 70%)`, filter: "blur(18px)" }}
        />
        <p className="kat-text text-[11px] font-bold uppercase tracking-widest relative">T.C. Sağlık Bakanlığı · ASHGM</p>
        <h2 className="text-xl font-extrabold mt-1 leading-snug text-balance relative">Eğitim dokümanları, videoları ve kitapları</h2>
        <p className="text-xs text-muted mt-1.5 leading-relaxed max-w-md text-pretty relative">
          Acil Sağlık Hizmetleri Genel Müdürlüğü&apos;nün eğitim sayfasındaki içerik, aynı kategori düzeniyle. Belgeler
          Bakanlığın kendi sunucusundan açılır.
        </p>
        <dl className="mt-4 grid grid-cols-4 gap-2 relative">
          {SAYILAR.map(([sayi, ad]) => (
            // dt önce (geçerli dl), sayı görsel olarak üstte
            <div key={ad} className="flex flex-col-reverse rounded-xl px-2 py-2 text-center" style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>
              <dt className="text-[11px] font-semibold text-muted mt-1">{ad}</dt>
              <dd className="text-lg font-extrabold tabular-nums leading-none">{sayi}</dd>
            </div>
          ))}
        </dl>
      </section>

      <nav aria-label="Eğitim kategorileri" className="grid grid-cols-2 gap-3">
        {KARTLAR.map(({ id, ikon: Ikon, aciklama }) => (
          <Link
            key={id}
            href={kategoriYolu(id)}
            className="module-card glass-card flex flex-col p-4 gap-3 relative overflow-hidden"
            style={{ "--accent": EGITIM_RENK } as React.CSSProperties}
          >
            <Ikon
              aria-hidden="true"
              className="module-watermark absolute -right-3 -bottom-3 pointer-events-none"
              style={{ width: 76, height: 76, color: EGITIM_RENK }}
              strokeWidth={1.5}
            />
            <span className="flex items-center justify-between relative">
              <span
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${EGITIM_RENK}22`, border: `1px solid ${EGITIM_RENK}33` }}
              >
                <Ikon aria-hidden="true" style={{ width: 20, height: 20, color: EGITIM_RENK }} strokeWidth={2} />
              </span>
              <ChevronRight aria-hidden="true" className="module-chevron shrink-0" style={{ width: 16, height: 16 }} />
            </span>
            <span className="flex flex-col relative mt-1">
              <span className="text-sm font-semibold leading-tight">{kategori(id).baslik}</span>
              <span className="text-xs text-muted font-medium mt-1 tabular-nums">{aciklama}</span>
            </span>
          </Link>
        ))}
      </nav>
    </EgitimSayfa>
  );
}
