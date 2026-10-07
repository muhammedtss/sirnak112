import Link from "next/link";
import { Info } from "lucide-react";

/** Hesaplayıcı sayfalarının altındaki kısa tıbbi sorumluluk notu (tam metin: /hakkinda#sorumluluk). */
export function ClinicalNote({ className = "" }: { className?: string }) {
  return (
    <p className={`flex items-start gap-2 text-xs text-muted leading-relaxed ${className}`}>
      <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" aria-hidden="true" />
      <span>
        Karar destek aracıdır; klinik değerlendirmenin ve hekim talimatının yerine geçmez. Sonuçları hastanın durumuna
        göre doğrulayın.{" "}
        <Link href="/hakkinda#sorumluluk" className="underline underline-offset-2 hover:text-fg">
          Sorumluluk reddi ve kaynaklar
        </Link>
      </span>
    </p>
  );
}
