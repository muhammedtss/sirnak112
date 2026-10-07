import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { notFound } from "next/navigation";
import { BookOpen } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { AppHeader } from "@/components/layout/AppHeader";
import DersSayfasi from "@/components/ekg/ders/DersSayfasi";
import { dersBySlug } from "@/lib/ekg/lessons";
import { staticParamsFor } from "@/lib/static-params";

export const dynamicParams = false;

export function generateStaticParams() {
  return staticParamsFor("/ekg-egitim/ders/[slug]");
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const ders = dersBySlug((await params).slug);
  if (!ders) return { title: "EKG Eğitimi" };
  return pageMeta(`/ekg-egitim/ders/${ders.slug}`, `${ders.baslik} · EKG Eğitimi`, `EKG eğitimi ${ders.no}. ders: ${ders.ozet}.`);
}

export default async function DersPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ders = dersBySlug(slug);
  if (!ders) notFound();

  return (
    <PageShell>
      <AppHeader title={`${ders.no}. ${ders.baslik}`} back="/ekg-egitim" icon={<BookOpen style={{ width: 16, height: 16 }} />} />
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-5 pb-24">
        <DersSayfasi slug={slug} />
      </main>
    </PageShell>
  );
}
