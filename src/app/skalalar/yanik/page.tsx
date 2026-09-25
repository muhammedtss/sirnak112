"use client";

import { PageShell } from "@/components/layout/PageShell";
import { AppHeader } from "@/components/layout/AppHeader";
import { ArrowLeft } from "lucide-react";
import BurnCalculatorEmbed from "@/components/skalalar/BurnCalculatorEmbed";

export default function YanikHesaplamaPage() {
  return (
    <PageShell>
      <AppHeader title="İnteraktif Yanık Hesaplama" back="/skalalar" icon={<ArrowLeft style={{ width: 16, height: 16 }} />} />

      <main className="flex-1 w-full max-w-3xl mx-auto py-6 px-4">
        <BurnCalculatorEmbed />
      </main>
    </PageShell>
  );
}
