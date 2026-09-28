"use client";

import { PageShell } from "@/components/layout/PageShell";
import { AppHeader } from "@/components/layout/AppHeader";
import { Flame } from "lucide-react";
import BurnCalculatorEmbed from "@/components/skalalar/BurnCalculatorEmbed";

export default function ParklandPage() {
  return (
    <PageShell>
      <AppHeader title="Yanık (Lund-Browder / Parkland)" back="/skalalar" icon={<Flame style={{ width: 16, height: 16 }} />} />

      <main className="flex-1 px-3 sm:px-6 py-4 sm:py-6 w-full max-w-xl mx-auto pb-20">
        <BurnCalculatorEmbed variant="parkland" />
      </main>
    </PageShell>
  );
}
