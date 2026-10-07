import { Accessibility } from "lucide-react";
import { InfoList, InfoPage, InfoSection } from "@/components/kurumsal/InfoPage";
import { SITE_INFO } from "@/lib/site-info";
import { seoFor } from "@/lib/seo";

export const metadata = seoFor("/erisilebilirlik");

export default function ErisilebilirlikPage() {
  return (
    <InfoPage title="Erişilebilirlik" icon={<Accessibility style={{ width: 16, height: 16 }} />}>
      <InfoSection title="Hedef">
        <p>
          {SITE_INFO.uygulama}, <strong>WCAG 2.1 AA</strong> düzeyini hedefler. Uygulama sahada, tek elle, değişken ışık
          koşullarında ve stres altında kullanıldığı için erişilebilirlik aynı zamanda hasta güvenliği konusudur.
        </p>
      </InfoSection>

      <InfoSection title="Uygulanan önlemler">
        <InfoList
          items={[
            "Metin kontrastı koyu ve açık temada WCAG AA (en az 4,5:1) düzeyinde.",
            "Dokunma hedefleri en az 44 × 44 piksel; küçük filtre düğmelerinde dokunma alanı genişletildi.",
            "Klavye ile gezinme ve tüm etkileşimli öğelerde görünür odak halkası.",
            "Ekran okuyucular için Türkçe etiketler; hesap sonuçları ve hata mesajları sesli olarak duyurulur.",
            "İşletim sisteminde “hareketi azalt” seçiliyse arayüz animasyonları kapanır.",
            "Sayfa yakınlaştırma serbesttir; görsel algoritmalar parmakla yakınlaştırılabilir.",
            "Açık ve koyu tema; gece vardiyası ve güneş altı kullanım için.",
          ]}
        />
      </InfoSection>

      <InfoSection title="Bilinen sınırlamalar">
        <InfoList
          items={[
            "Görsel akış şemaları taranmış görüntüdür ve ekran okuyucuyla okunamaz. Aynı içerik “Vaka Protokolleri” bölümünde metin olarak, adım adım sunulur.",
            "EKG şeritleri görseldir; her şeridin değerlendirme ölçütleri ve tanısı metin olarak verilir.",
            "Ana sayfadaki imza animasyonu, “hareketi azalt” tercihinde de oynar; küçük ve içerikten bağımsızdır.",
          ]}
        />
      </InfoSection>

      {SITE_INFO.iletisim.eposta && (
        <InfoSection title="Geri bildirim">
          <p>
            Erişilebilirlik sorunlarını bildirmek için:{" "}
            <a className="text-fg underline underline-offset-2" href={`mailto:${SITE_INFO.iletisim.eposta}`}>
              {SITE_INFO.iletisim.eposta}
            </a>
          </p>
        </InfoSection>
      )}
    </InfoPage>
  );
}
