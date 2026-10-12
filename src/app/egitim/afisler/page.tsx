import { DosyaListesi } from "@/components/egitim/DosyaListesi";
import { EgitimSayfa } from "@/components/egitim/EgitimSayfa";
import { kategori } from "@/lib/egitim";
import { seoFor } from "@/lib/seo";

export const metadata = seoFor("/egitim/afisler");

const k = kategori("afisler");

export default function AfislerPage() {
  return (
    <EgitimSayfa title={k.baslik} back="/egitim" badge={k.dosyalar.length} kaynak={{ url: k.kaynakUrl, baslik: k.baslik }}>
      <p className="text-xs text-muted leading-relaxed text-pretty px-1">
        Baskıya hazır yüksek çözünürlüklü PDF dosyalarıdır; boyutları büyüktür, mümkünse kablosuz ağda indirin.
      </p>
      <DosyaListesi dosyalar={k.dosyalar} />
    </EgitimSayfa>
  );
}
