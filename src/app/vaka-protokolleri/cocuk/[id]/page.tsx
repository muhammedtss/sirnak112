import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { notFound } from "next/navigation";
import AlgorithmViewer from "@/components/algorithm/AlgorithmViewer";
import cocukData from "@/data/cocuk.json";
import { PageShell } from "@/components/layout/PageShell";
import { AppHeader } from "@/components/layout/AppHeader";
import { ArrowLeft } from "lucide-react";
import { staticParamsFor } from "@/lib/static-params";

export function generateStaticParams() {
  return staticParamsFor("/vaka-protokolleri/cocuk/[id]");
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const kayit = (cocukData as Record<string, { title: string }>)[id];
  if (!kayit) return {};
  return pageMeta(
    `/vaka-protokolleri/cocuk/${id}`,
    `${kayit.title} — Çocuk Vaka Protokolü`,
    `${kayit.title}: hastane öncesi çocuk acil vaka protokolü, Sağlık Bakanlığı akış şemasına göre adım adım.`,
  );
}

export default async function CocukVakaSayfasi({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const algoritmaId = resolvedParams.id;
  const algoritma = (cocukData as any)[algoritmaId];

  if (!algoritma) {
    notFound();
  }

  return (
    <PageShell>
      <AppHeader
        title={algoritma.title}
        back="/vaka-protokolleri/cocuk"
        icon={<ArrowLeft style={{ width: 16, height: 16 }} />}
      />
      <main className="flex-1 overflow-y-auto pb-10">
        <AlgorithmViewer algorithm={algoritma} category="cocuk" />
      </main>
    </PageShell>
  );
}
