import { EgitimSayfa } from "@/components/egitim/EgitimSayfa";
import { VideoListesi } from "@/components/egitim/VideoListesi";
import { kategori } from "@/lib/egitim";
import { seoFor } from "@/lib/seo";

export const metadata = seoFor("/egitim/videolar");

const k = kategori("videolar");

export default function VideolarPage() {
  return (
    <EgitimSayfa title={k.baslik} back="/egitim" badge={k.videolar.length} kaynak={{ url: k.kaynakUrl, baslik: k.baslik }}>
      <p className="text-xs text-muted leading-relaxed text-pretty px-1">
        Videoya dokunun, bu sayfada oynatılsın. Oynatıcı yalnızca dokunduğunuzda YouTube&apos;dan yüklenir.
      </p>
      <VideoListesi videolar={k.videolar} />
    </EgitimSayfa>
  );
}
