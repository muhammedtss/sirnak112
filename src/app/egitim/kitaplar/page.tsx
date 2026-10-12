import { DosyaListesi } from "@/components/egitim/DosyaListesi";
import { EgitimSayfa } from "@/components/egitim/EgitimSayfa";
import { kategori, type EgitimDosya } from "@/lib/egitim";
import { seoFor } from "@/lib/seo";

export const metadata = seoFor("/egitim/kitaplar");

const k = kategori("kitaplar");

/** Her kitap tek satır: kitap adı gösterilir; birden çok dosyası olan kitapta dosya adı eklenir. */
const satirlar: EgitimDosya[] = k.kitaplar.flatMap(kitap =>
  kitap.dosyalar.length === 0
    ? [{ ad: kitap.baslik, url: "", tur: "", bayt: 0, erisilemez: true }]
    : kitap.dosyalar.map(d => ({ ...d, ad: kitap.dosyalar.length > 1 ? `${kitap.baslik} — ${d.ad}` : kitap.baslik })),
);

export default function KitaplarPage() {
  return (
    <EgitimSayfa title={k.baslik} back="/egitim" badge={k.kitaplar.length} kaynak={{ url: k.kaynakUrl, baslik: k.baslik }}>
      <DosyaListesi dosyalar={satirlar} />
    </EgitimSayfa>
  );
}
