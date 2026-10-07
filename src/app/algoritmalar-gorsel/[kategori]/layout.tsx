import type { ReactNode } from "react";
import type { Metadata } from "next";
import { staticParamsFor } from "@/lib/static-params";
import { pageMeta } from "@/lib/seo";

const ETIKET: Record<string, string> = { yetiskin: "Erişkin", cocuk: "Çocuk", yenidogan: "Doğum ve Yenidoğan" };

export async function generateMetadata({ params }: { params: Promise<{ kategori: string }> }): Promise<Metadata> {
  const { kategori } = await params;
  const etiket = ETIKET[kategori];
  if (!etiket) return {};
  return pageMeta(
    `/algoritmalar-gorsel/${kategori}`,
    `${etiket} Görsel Algoritmaları`,
    `${etiket} hastane öncesi acil akış şemaları ve anahtar noktalar; Sağlık Bakanlığı algoritmaları, parmakla yakınlaştırılabilir.`,
  );
}

// Sayfa istemci bileşeni olduğu için statik parametreler layout'ta tanımlanır.
export function generateStaticParams() {
  return staticParamsFor("/algoritmalar-gorsel/[kategori]");
}

export default function AlgoritmaGorselKategoriLayout({ children }: { children: ReactNode }) {
  return children;
}
