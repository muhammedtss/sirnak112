import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { notFound } from "next/navigation";
import AlgorithmViewer from "@/components/algorithm/AlgorithmViewer";
import eriskinData from "@/data/eriskin.json";
import { PageShell } from "@/components/layout/PageShell";
import { AppHeader } from "@/components/layout/AppHeader";
import { ArrowLeft } from "lucide-react";
import { staticParamsFor } from "@/lib/static-params";

export function generateStaticParams() {
  return staticParamsFor("/algoritmalar/eriskin/[id]");
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const kayit = (eriskinData as Record<string, { title: string }>)[id];
  if (!kayit) return {};
  return pageMeta(
    `/algoritmalar/eriskin/${id}`,
    `${kayit.title} — Erişkin Algoritması`,
    `${kayit.title}: hastane öncesi erişkin acil algoritma, Sağlık Bakanlığı akış şemasına göre adım adım.`,
  );
}

export default async function EriskinAlgoritmaSayfasi({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const algoritmaId = resolvedParams.id;

  const algoritma = (eriskinData as any)[algoritmaId];

  if (!algoritma) {
    notFound();
  }

  return (
    <PageShell>
      <AppHeader
        title={algoritma.title}
        back="/algoritmalar/eriskin"
        icon={<ArrowLeft style={{ width: 16, height: 16 }} />}
      />
      <main className="flex-1 overflow-y-auto pb-10">
        <AlgorithmViewer algorithm={algoritma} category="eriskin" />
      </main>
    </PageShell>
  );
}
