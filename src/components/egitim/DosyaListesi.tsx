import { ArrowUpRight, FileArchive, FileSpreadsheet, FileText, FileX, Presentation, type LucideIcon } from "lucide-react";
import { boyutTr, type EgitimDosya } from "@/lib/egitim";
import { EGITIM_RENK } from "./renk";

const TUR_IKON: Record<string, LucideIcon> = {
  PPTX: Presentation,
  PPT: Presentation,
  XLSX: FileSpreadsheet,
  XLS: FileSpreadsheet,
  RAR: FileArchive,
  ZIP: FileArchive,
};

/**
 * Bakanlık dosya sunucusundaki özgün belgelere bağlantı listesi.
 * Dosyalar uygulamaya kopyalanmaz; dokunulunca yeni sekmede (mobilde indirme olarak) açılır.
 * Kaynakta bulunamayan (404) belgeler bağlantısız, "erişilemiyor" notuyla listelenir.
 */
export function DosyaListesi({ dosyalar }: { dosyalar: EgitimDosya[] }) {
  return (
    <ul className="glass-card overflow-hidden divide-y divide-(--glass-border)">
      {dosyalar.map(d => {
        if (d.erisilemez) {
          return (
            <li key={d.url || d.ad} className="flex items-center gap-3 px-4 py-3 min-h-14">
              <TurKutusu ikon={FileX} soluk />
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-semibold leading-snug text-pretty text-muted">{d.ad}</span>
                <span className="block text-[11px] text-subtle mt-0.5">Kaynak sitede şu an erişilemiyor</span>
              </span>
            </li>
          );
        }
        const boyut = boyutTr(d.bayt);
        return (
          <li key={d.url}>
            <a
              href={d.url}
              target="_blank"
              rel="noopener noreferrer"
              className="liste-satir flex items-center gap-3 px-4 py-3 min-h-14"
            >
              <TurKutusu ikon={TUR_IKON[d.tur] ?? FileText} />
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-semibold leading-snug text-pretty">{d.ad}</span>
                <span className="block text-[11px] text-muted mt-0.5 tabular-nums">
                  {d.tur}
                  {boyut && ` · ${boyut}`}
                </span>
              </span>
              <ArrowUpRight aria-hidden="true" className="liste-ok shrink-0 text-subtle" style={{ width: 18, height: 18 }} />
              <span className="sr-only">(yeni sekmede açılır)</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

function TurKutusu({ ikon: Ikon, soluk }: { ikon: LucideIcon; soluk?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
      style={
        soluk
          ? { background: "var(--glass-bg)", border: "1px solid var(--glass-border)", color: "var(--fg-subtle)" }
          : { background: `${EGITIM_RENK}22`, border: `1px solid ${EGITIM_RENK}33`, color: EGITIM_RENK }
      }
    >
      <Ikon style={{ width: 18, height: 18 }} strokeWidth={2} />
    </span>
  );
}
