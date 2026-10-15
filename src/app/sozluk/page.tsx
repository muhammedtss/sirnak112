import { SozlukSayfasi } from "@/components/sozluk/SozlukSayfasi";
import { seoFor } from "@/lib/seo";

export const metadata = seoFor("/sozluk");

export default function SozlukPage() {
  return <SozlukSayfasi />;
}
