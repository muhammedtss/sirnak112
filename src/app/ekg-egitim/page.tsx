import type { Metadata } from "next";
import { HeartPulse } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { AppHeader } from "@/components/layout/AppHeader";
import EkgAnaSayfa from "@/components/ekg/EkgAnaSayfa";

export const metadata: Metadata = { title: "EKG Eğitimi · Şırnak 112" };

export default function EkgEgitimPage() {
  return (
    <PageShell>
      <AppHeader title="EKG Eğitimi" back="/" icon={<HeartPulse style={{ width: 16, height: 16 }} />} />
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-5 pb-24">
        <EkgAnaSayfa />
      </main>
    </PageShell>
  );
}
