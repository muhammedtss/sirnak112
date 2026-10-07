import { ClinicalNote } from "@/components/kurumsal/ClinicalNote";
import { Pill } from "lucide-react";
import DrugDoseCalculator from "@/components/drugs/DrugDoseCalculator";
import { PageShell } from "@/components/layout/PageShell";
import { AppHeader } from "@/components/layout/AppHeader";

export default function IlacDozPage() {
  return (
    <PageShell>
      <AppHeader
        title="İlaç Doz Hesaplayıcı"
        icon={<Pill style={{ width: 16, height: 16 }} />}
        back="/"
      />
      <div className="flex-1 overflow-y-auto">
        <DrugDoseCalculator />
        <div className="w-full max-w-md mx-auto px-4 -mt-10 pb-10">
          <ClinicalNote />
        </div>
      </div>
    </PageShell>
  );
}
