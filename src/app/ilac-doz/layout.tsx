import type { ReactNode } from "react";
import { seoFor } from "@/lib/seo";

export const metadata = seoFor("/ilac-doz");

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
