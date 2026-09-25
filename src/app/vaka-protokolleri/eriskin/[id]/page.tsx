import { notFound } from "next/navigation";
import AlgorithmViewer from "@/components/algorithm/AlgorithmViewer";
import eriskinProtokolData from "@/data/eriskin.json";
import { PageShell } from "@/components/layout/PageShell";
import { AppHeader } from "@/components/layout/AppHeader";
import { ArrowLeft } from "lucide-react";

export default async function EriskinProtokolSayfasi({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const protokolId = resolvedParams.id;

  const protokol = (eriskinProtokolData as any)[protokolId];

  if (!protokol) {
    notFound();
  }

  return (
    <PageShell>
      <AppHeader
        title={protokol.title}
        back="/vaka-protokolleri/eriskin"
        icon={<ArrowLeft style={{ width: 16, height: 16 }} />}
      />
      <main className="flex-1 overflow-y-auto pb-10">
        <AlgorithmViewer algorithm={protokol} category="eriskin" />
      </main>
    </PageShell>
  );
}
