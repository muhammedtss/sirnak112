import Link from "next/link";
import { notFound } from "next/navigation";
import envanterData from "@/data/ambulans-envanter.json";
import EnvanterIlacListesi from "@/components/envanter/EnvanterIlacListesi";
import { PageShell } from "@/components/layout/PageShell";
import { AppHeader } from "@/components/layout/AppHeader";
import { ArrowLeft } from "lucide-react";

const ambulansNames: Record<string, string> = {
  acil_yardim: "Acil Yardım ve Yoğun Bakım",
  hasta_nakil: "Hasta Nakil",
  hava_deniz: "Hava ve Deniz",
};

interface PageProps {
  params: Promise<{ tip: string; kategori: string }>;
}

export default async function EnvanterKategoriPage({ params }: PageProps) {
  const { tip, kategori } = await params;
  const data = envanterData as Record<string, { id: string; name: string; ilaclar: { id: string; name: string; gerekliMiktar: string | number }[] }>;
  const ambulans = data[tip];

  if (!ambulans || kategori !== "ilaclar") {
    notFound();
  }

  return (
    <PageShell>
      <AppHeader
        title="İlaçlar"
        back={`/envanter/${tip}`}
        icon={<ArrowLeft style={{ width: 16, height: 16 }} />}
        right={<span className="text-[11px] font-semibold text-primary">{ambulansNames[tip] || ambulans.name}</span>}
      />
      <main className="flex-1 overflow-y-auto px-4 py-4 w-full">
        <EnvanterIlacListesi ilaclar={ambulans.ilaclar} />
      </main>
    </PageShell>
  );
}
