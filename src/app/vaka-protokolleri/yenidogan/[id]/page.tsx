import { notFound } from "next/navigation";
import AlgorithmViewer from "@/components/algorithm/AlgorithmViewer";
import yenidoganData from "@/data/yenidogan.json";
import { PageShell } from "@/components/layout/PageShell";
import { AppHeader } from "@/components/layout/AppHeader";
import { ArrowLeft } from "lucide-react";

export default async function YenidoganVakaSayfasi({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const algoritmaId = resolvedParams.id;
  const algoritma = (yenidoganData as any)[algoritmaId];

  if (!algoritma) {
    notFound();
  }

  return (
    <PageShell>
      <AppHeader
        title={algoritma.title}
        back="/vaka-protokolleri/yenidogan"
        icon={<ArrowLeft style={{ width: 16, height: 16 }} />}
      />
      <main className="flex-1 overflow-y-auto pb-10">
        <AlgorithmViewer algorithm={algoritma} category="yenidogan" />
      </main>
    </PageShell>
  );
}
