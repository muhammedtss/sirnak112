import Link from "next/link";
import { notFound } from "next/navigation";
import envanterData from "@/data/ambulans-envanter.json";
import { PageShell } from "@/components/layout/PageShell";
import { AppHeader } from "@/components/layout/AppHeader";
import { Stethoscope, ArrowLeft } from "lucide-react";

const ambulansNames: Record<string, string> = {
  acil_yardim: "Acil Yardım ve Yoğun Bakım",
  hasta_nakil: "Hasta Nakil",
  hava_deniz: "Hava ve Deniz",
};

interface PageProps {
  params: Promise<{ tip: string }>;
}

export default async function AmbulansDetayPage({ params }: PageProps) {
  const { tip } = await params;
  const data = envanterData as Record<string, { id: string; name: string; ilaclar: { id: string; name: string; gerekliMiktar: string }[] }>;
  const ambulans = data[tip];

  if (!ambulans) {
    notFound();
  }

  const sections = [
    {
      id: "ilaclar",
      label: "İlaçlar",
      icon: <Stethoscope style={{ width: 24, height: 24 }} strokeWidth={2} />,
      accent: "#10B981", // emerald-500
      glow: "rgba(16,185,129,0.2)",
      border: "rgba(16,185,129,0.25)",
    },
  ];

  return (
    <PageShell>
      <AppHeader
        title={ambulansNames[tip] || ambulans.name}
        back="/envanter"
        icon={<ArrowLeft style={{ width: 16, height: 16 }} />}
      />
      <main className="flex-1 flex flex-col justify-center px-4 w-full max-w-md mx-auto gap-4 py-8">
        <p className="text-sm text-subtle font-semibold text-center mb-2">Kontrol edilecek kategoriyi seçin</p>
        {sections.map((section) => (
          <Link
            key={section.id}
            href={`/envanter/${tip}/${section.id}`}
            className="glass-card glass-hover flex items-center gap-4 p-5"
            style={{ borderColor: section.border }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: section.glow, border: `1px solid ${section.border}`, color: section.accent }}
            >
              {section.icon}
            </div>
            <span className="text-xl font-bold tracking-wide flex-1">{section.label}</span>
          </Link>
        ))}
      </main>
    </PageShell>
  );
}
