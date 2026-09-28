import type { Metadata } from "next";
import { WifiOff } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { AppHeader } from "@/components/layout/AppHeader";
import { RetryLink } from "./RetryLink";

export const metadata: Metadata = {
  title: "Çevrimdışı · Şırnak 112 - Acil Protokol",
};

/* Service worker, çevrimdışıyken önbellekte bulunmayan bir sayfa
   istendiğinde bu sayfayı gösterir (sw.js → OFFLINE_URL). */
export default function OfflinePage() {
  return (
    <PageShell>
      <AppHeader title="Çevrimdışı" back="/" />
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16 gap-5 max-w-md mx-auto">
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center glass-card"
          style={{ background: "rgba(251,191,36,0.1)", borderColor: "rgba(251,191,36,0.3)" }}
        >
          <WifiOff style={{ width: 36, height: 36, color: "#FBBF24" }} />
        </div>
        <h1 className="text-xl font-extrabold">İnternet bağlantısı yok</h1>
        <p className="text-sm text-muted leading-relaxed">
          Bu sayfa henüz cihazınıza kaydedilmemiş. Uygulamanın geri kalanı çevrimdışı çalışmaya devam eder;
          bağlantı geldiğinde bu sayfa da otomatik olarak kaydedilir.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {/* Düz <a>: çevrimdışıyken tam sayfa yüklemesi service worker önbelleğinden karşılanır */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/"
            className="px-6 py-3 rounded-xl font-bold text-sm"
            style={{ background: "var(--primary)", color: "#fff" }}
          >
            Ana Sayfaya Dön
          </a>
          <RetryLink />
        </div>
      </main>
    </PageShell>
  );
}
