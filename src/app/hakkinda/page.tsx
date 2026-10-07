import Link from "next/link";
import { Info } from "lucide-react";
import { InfoList, InfoPage, InfoSection } from "@/components/kurumsal/InfoPage";
import { KAYNAKLAR, KLINIK_SON_GUNCELLEME, SITE_INFO, tarihTr } from "@/lib/site-info";
import { seoFor } from "@/lib/seo";

export const metadata = seoFor("/hakkinda");

export default function HakkindaPage() {
  const { uygulama, kurum, gelistirici, surum, klinikOnay, iletisim } = SITE_INFO;

  return (
    <InfoPage title="Hakkında" icon={<Info style={{ width: 16, height: 16 }} />}>
      <InfoSection title={uygulama}>
        <p>
          <strong>{uygulama}</strong>, {kurum} bünyesinde 112 acil sağlık personeli (paramedik, acil tıp teknisyeni,
          hekim) için hazırlanmış bir hastane öncesi karar destek uygulamasıdır. Kritik vakalarda doğru algoritmaya,
          ilaç dozuna ve skalaya en az dokunuşla ulaşmayı amaçlar.
        </p>
        <InfoList
          items={[
            "Erişkin, çocuk ve yenidoğan acil algoritmaları ve adım adım vaka protokolleri",
            "İlaç doz hesaplayıcı, klinik skalalar, yanık yüzdesi ve Parkland sıvı hesabı",
            "ICD-10 tanı kodu bulucu, ambulans envanteri ve evrak örnekleri",
            "EKG eğitimi: dersler, ritim atlası ve vaka sınavı",
            "İnternet bağlantısı olmadan çalışır; telefona uygulama olarak eklenebilir",
          ]}
        />
      </InfoSection>

      <InfoSection id="kaynaklar" title="İçerik kaynakları">
        <ul className="space-y-3">
          {KAYNAKLAR.map(k => (
            <li key={k.baslik} className="space-y-0.5">
              <p className="text-fg font-semibold">{k.baslik}</p>
              <p className="text-xs">{k.yayinlayan}</p>
              <p className="text-xs">Kullanıldığı yer: {k.kapsam}</p>
            </li>
          ))}
        </ul>
        <p className="text-xs">
          Klinik içerik son güncelleme: <strong>{tarihTr(KLINIK_SON_GUNCELLEME)}</strong>.{" "}
          <Link href="/degisiklikler" className="underline underline-offset-2">
            Klinik değişiklik günlüğü
          </Link>
        </p>
      </InfoSection>

      <InfoSection id="sorumluluk" title="Tıbbi sorumluluk reddi">
        <p>
          Bu uygulama bir <strong>karar destek aracıdır</strong>. Klinik değerlendirmenin, hekim talimatının ve
          Sağlık Komuta Kontrol Merkezi (SKKM) yönlendirmesinin yerine geçmez.
        </p>
        <InfoList
          items={[
            "Algoritmalar bağlayıcı ve kesin talimat niteliği taşımaz; her vakanın kendine özgü durumu gözetilerek mesleki bilgi ve deneyimle karar verilmelidir.",
            "Hesaplayıcı sonuçları (doz, sıvı, skor) uygulamadan önce hastanın kilosu, yaşı ve klinik durumuyla doğrulanmalıdır.",
            "İçerik yayımlanan kaynaklarla uyumlu tutulmaya çalışılır; güncel mevzuat ve kurum talimatları her zaman önceliklidir.",
            "Uygulamanın kullanımından doğabilecek sonuçların sorumluluğu ilgili mevzuat çerçevesinde uygulayıcıya aittir.",
          ]}
        />
      </InfoSection>

      <InfoSection title="Künye">
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5">
          <dt>Kurum</dt>
          <dd className="text-fg">{kurum}</dd>
          <dt>Geliştiren</dt>
          <dd className="text-fg">{gelistirici}</dd>
          {klinikOnay && (
            <>
              <dt>Klinik içerik onayı</dt>
              <dd className="text-fg">{klinikOnay}</dd>
            </>
          )}
          {surum && (
            <>
              <dt>Sürüm</dt>
              <dd className="text-fg tabular-nums">{surum}</dd>
            </>
          )}
          {iletisim.eposta && (
            <>
              <dt>E-posta</dt>
              <dd>
                <a className="text-fg underline underline-offset-2" href={`mailto:${iletisim.eposta}`}>
                  {iletisim.eposta}
                </a>
              </dd>
            </>
          )}
          {iletisim.telefon && (
            <>
              <dt>Telefon</dt>
              <dd className="text-fg tabular-nums">{iletisim.telefon}</dd>
            </>
          )}
        </dl>
        <p className="text-xs pt-1">
          <Link href="/gizlilik" className="underline underline-offset-2">Gizlilik</Link>
          {" · "}
          <Link href="/erisilebilirlik" className="underline underline-offset-2">Erişilebilirlik</Link>
          {" · "}
          <Link href="/degisiklikler" className="underline underline-offset-2">Klinik değişiklikler</Link>
        </p>
      </InfoSection>
    </InfoPage>
  );
}
