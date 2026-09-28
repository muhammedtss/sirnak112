import type { Metadata } from "next";
import { Trophy } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { AppHeader } from "@/components/layout/AppHeader";
import EkgSinav from "@/components/ekg/EkgSinav";

export const metadata: Metadata = { title: "Vaka Sınavı · EKG Eğitimi" };

export default function EkgSinavPage() {
  return (
    <PageShell>
      <AppHeader title="EKG Vaka Sınavı" back="/ekg-egitim" icon={<Trophy style={{ width: 16, height: 16 }} />} />
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-5 pb-24">
        <EkgSinav />
      </main>
    </PageShell>
  );
}
