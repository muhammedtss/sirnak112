import { PageShell } from "@/components/layout/PageShell";
import { AppHeader } from "@/components/layout/AppHeader";
import { ArrowLeft } from "lucide-react";

export default function EriskinIlacDozPage() {
  return (
    <PageShell>
      <AppHeader title="Erişkin İlaç Doz" back="/ilac-doz" icon={<ArrowLeft style={{ width: 16, height: 16 }} />} />
      <main className="flex-1 px-4 py-4 max-w-md mx-auto w-full">
        <p className="text-muted text-sm text-center mt-10">Erişkin İlaç Dozları çok yakında...</p>
      </main>
    </PageShell>
  );
}
