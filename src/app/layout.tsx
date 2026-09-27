import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Background } from "@/components/ui/Background";
import { BottomNav } from "@/components/layout/BottomNav";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Şırnak 112 - Acil Protokol",
  description: "Şırnak 112 Acil Saglik Hizmetleri Protokol ve Ilac Uygulamasi",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png' }
    ]
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${outfit.variable} h-[100dvh]`}>
      <body className="flex flex-col h-full relative antialiased overflow-hidden">
        {/* Layered premium background — fixed, stays behind everything */}
        <Background />

        <div className="flex-1 overflow-y-auto w-full relative z-10" id="main-scroll-container">
          {children}
        </div>
        <div className="shrink-0 w-full relative z-50 bg-transparent">
          <BottomNav />
        </div>
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(function(reg) {
                  navigator.serviceWorker.ready.then(function(swRegistration) {
                    const urls = performance.getEntriesByType('resource')
                      .map(r => r.name)
                      .filter(name => name.includes('/_next/static/'));
                    if (swRegistration.active) {
                      swRegistration.active.postMessage({ type: 'CACHE_LOADED_RESOURCES', urls });
                    }
                  });
                });
              });
            }

            document.addEventListener('click', (e) => {
              if (!navigator.onLine) {
                const anchor = e.target.closest('a');
                if (anchor && anchor.href && anchor.href.startsWith(window.location.origin)) {
                  e.preventDefault();
                  e.stopPropagation();
                  window.location.href = anchor.href;
                }
              }
            }, true);
          `}
        </Script>
      </body>
    </html>
  );
}
