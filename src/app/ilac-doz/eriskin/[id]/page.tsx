import { NOINDEX } from "@/lib/seo";

// Yapım aşamasında / bağlantısız sayfa: arama motorlarında listelenmesin
export const metadata = NOINDEX;

export default function Page() {
  return <div>İlaç Doz - Erişkin Detay Sayfası</div>;
}
