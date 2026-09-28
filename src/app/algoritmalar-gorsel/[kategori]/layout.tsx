import type { ReactNode } from "react";
import { staticParamsFor } from "@/lib/static-params";

// Sayfa istemci bileşeni olduğu için statik parametreler layout'ta tanımlanır.
export function generateStaticParams() {
  return staticParamsFor("/algoritmalar-gorsel/[kategori]");
}

export default function AlgoritmaGorselKategoriLayout({ children }: { children: ReactNode }) {
  return children;
}
