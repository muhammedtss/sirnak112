import { ShieldCheck } from "lucide-react";
import { InfoList, InfoPage, InfoSection } from "@/components/kurumsal/InfoPage";
import { SITE_INFO } from "@/lib/site-info";
import { seoFor } from "@/lib/seo";

export const metadata = seoFor("/gizlilik");

export default function GizlilikPage() {
  return (
    <InfoPage title="Gizlilik" icon={<ShieldCheck style={{ width: 16, height: 16 }} />}>
      <InfoSection title="Kısaca">
        <p>
          {SITE_INFO.uygulama} <strong>hesap açtırmaz, kişisel veri istemez ve toplamaz.</strong> Çerez, reklam, analitik
          veya üçüncü taraf izleme aracı kullanmaz. Uygulama kendiliğinden yalnızca kendi sunucusundan içerik yükler;
          başka bir sunucuya yalnızca Eğitim bölümünde bir belgeyi veya videoyu siz açtığınızda bağlanılır.
        </p>
      </InfoSection>

      <InfoSection title="Hesaplayıcılara girilen bilgiler">
        <p>
          İlaç dozu, yanık, skala ve benzeri hesaplayıcılara girilen değerler (kilo, yaş grubu, yanık yüzdesi, skor
          seçimleri) <strong>yalnızca cihazınızda</strong> işlenir; sunucuya gönderilmez ve kaydedilmez. Sayfa kapatıldığında
          silinir.
        </p>
        <p>
          Envanter kontrol listesindeki işaretlemeler de yalnızca sayfa açıkken cihazın belleğinde tutulur. Kontrol
          raporunun Excel dosyası cihazınızda oluşturulur; sunucuya gönderilmez, yalnızca siz indirdiğinizde veya
          paylaştığınızda cihazınıza ya da seçtiğiniz uygulamaya geçer.
        </p>
      </InfoSection>

      <InfoSection title="Cihazınızda saklananlar">
        <InfoList
          items={[
            <><strong>Tema tercihi</strong> (açık/koyu) — tarayıcının yerel depolamasında.</>,
            <><strong>EKG eğitim ilerlemesi</strong> (tamamlanan dersler, sınav sonuçları) — tarayıcının yerel depolamasında; isim veya kimlik bilgisi içermez.</>,
            <><strong>Çevrimdışı içerik</strong> (sayfalar, görseller) — internetsiz çalışabilmek için tarayıcı önbelleğinde.</>,
          ]}
        />
        <p>Bu veriler cihazınızdan dışarı gönderilmez. Tarayıcının site verilerini temizleyerek hepsini silebilirsiniz.</p>
      </InfoSection>

      <InfoSection title="Eğitim belgeleri ve videoları">
        <p>
          Eğitim bölümündeki belgeler uygulamaya kopyalanmaz; dokunduğunuzda Sağlık Bakanlığı&apos;nın dosya sunucusundan
          (dosyamerkez.saglik.gov.tr) açılır.
        </p>
        <p>
          Videolar YouTube&apos;un gizlilik geliştirilmiş modunda (youtube-nocookie.com) oynatılır. Oynatıcı ve küçük resimler
          sayfa açılışında yüklenmez; <strong>yalnızca bir videoya dokunduğunuzda</strong> YouTube&apos;a bağlanılır. Bu durumda
          YouTube (Google), oynatma için gereken teknik bilgileri kendi gizlilik politikası kapsamında işleyebilir.
        </p>
      </InfoSection>

      <InfoSection title="Barındırma">
        <p>
          Uygulama bir bulut barındırma hizmeti üzerinden yayınlanır. Barındırma sağlayıcısı, her web sitesinde olduğu
          gibi, hizmetin güvenliği ve işleyişi için teknik erişim kayıtlarını (ör. IP adresi, istek zamanı) kendi
          politikası kapsamında sınırlı süre tutabilir. Bu kayıtlar uygulama tarafından toplanmaz veya kullanılmaz.
        </p>
      </InfoSection>

      {SITE_INFO.iletisim.eposta && (
        <InfoSection title="İletişim">
          <p>
            Gizlilikle ilgili sorularınız için:{" "}
            <a className="text-fg underline underline-offset-2" href={`mailto:${SITE_INFO.iletisim.eposta}`}>
              {SITE_INFO.iletisim.eposta}
            </a>
          </p>
        </InfoSection>
      )}
    </InfoPage>
  );
}
