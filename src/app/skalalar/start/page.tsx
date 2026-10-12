import { Tag } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { AppHeader } from "@/components/layout/AppHeader";
import { TriajEkrani } from "@/components/skalalar/TriajEkrani";
import { seoFor } from "@/lib/seo";

export const metadata = seoFor("/skalalar/start");

export default function StartPage() {
  return (
    <PageShell>
      <AppHeader title="START" back="/skalalar" icon={<Tag style={{ width: 16, height: 16 }} />} />
      <main className="flex-1">
        <TriajEkrani akisId="start" />
      </main>
    </PageShell>
  );
}
