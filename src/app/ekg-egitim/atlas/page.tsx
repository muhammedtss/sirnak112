import type { Metadata } from "next";
import { BookMarked } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { AppHeader } from "@/components/layout/AppHeader";
import RitimAtlasi from "@/components/ekg/RitimAtlasi";

export const metadata: Metadata = { title: "Ritim Atlası · EKG Eğitimi" };

export default function RitimAtlasiPage() {
  return (
    <PageShell>
      <AppHeader title="Ritim Atlası" back="/ekg-egitim" icon={<BookMarked style={{ width: 16, height: 16 }} />} />
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-5 pb-24">
        <RitimAtlasi />
      </main>
    </PageShell>
  );
}
