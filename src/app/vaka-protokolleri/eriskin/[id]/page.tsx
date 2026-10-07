import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { notFound } from "next/navigation";
import AlgorithmViewer from "@/components/algorithm/AlgorithmViewer";
import eriskinProtokolData from "@/data/eriskin.json";
import { PageShell } from "@/components/layout/PageShell";
import { AppHeader } from "@/components/layout/AppHeader";
import { ArrowLeft } from "lucide-react";
import { staticParamsFor } from "@/lib/static-params";

export function generateStaticParams() {
  return staticParamsFor("/vaka-protokolleri/eriskin/[id]");
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const kayit = (eriskinProtokolData as Record<string, { title: string }>)[id];
  if (!kayit) return {};
  return pageMeta(
    `/vaka-protokolleri/eriskin/${id}`,
    `${kayit.title} — Erişkin Vaka Protokolü`,
    `${kayit.title}: hastane öncesi erişkin acil vaka protokolü, Sağlık Bakanlığı akış şemasına göre adım adım.`,
  );
}

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
