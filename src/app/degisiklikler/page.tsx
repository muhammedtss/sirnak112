import { History } from "lucide-react";
import { InfoList, InfoPage, InfoSection } from "@/components/kurumsal/InfoPage";
import { KLINIK_DEGISIKLIKLER, tarihTr } from "@/lib/site-info";
import { seoFor } from "@/lib/seo";

export const metadata = seoFor("/degisiklikler");

export default function DegisikliklerPage() {
  return (
    <InfoPage title="Klinik Değişiklikler" icon={<History style={{ width: 16, height: 16 }} />}>
      <p className="text-xs text-muted px-1">
        Doz, formül, akış ve klinik veriyi etkileyen değişiklikler, en yenisi üstte. Arayüz ve tasarım değişiklikleri bu
        listede yer almaz. Günlük 25 Eylül 2026&apos;dan itibaren tutulmaktadır.
      </p>
      {KLINIK_DEGISIKLIKLER.map(d => (
        <InfoSection key={`${d.tarih}-${d.baslik}`} title={d.baslik}>
          <p className="text-xs font-semibold text-fg tabular-nums">
            <time dateTime={d.tarih}>{tarihTr(d.tarih)}</time>
          </p>
          <InfoList items={d.ayrinti} />
          {d.kaynak && <p className="text-xs">Kaynak: {d.kaynak}</p>}
        </InfoSection>
      ))}
    </InfoPage>
  );
}
