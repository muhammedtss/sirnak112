import type { ReactNode } from "react";
import { seoFor } from "@/lib/seo";

export const metadata = seoFor("/skalalar/lma");

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
