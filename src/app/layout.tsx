import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Background } from "@/components/ui/Background";
import { BottomNav } from "@/components/layout/BottomNav";
import { OfflineManager } from "@/components/pwa/OfflineManager";
import { MotionProvider } from "@/components/ui/MotionProvider";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Şırnak 112 - Acil Protokol",
  description: "Şırnak 112 Acil Saglik Hizmetleri Protokol ve Ilac Uygulamasi",
  applicationName: "Şırnak 112 Acil Protokol",
  appleWebApp: {
    capable: true,
    title: "112 Protokol",
    statusBarStyle: "black-translucent",
  },
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
  themeColor: "#090C14",
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

        <MotionProvider>
          <div className="flex-1 overflow-y-auto w-full relative z-10" id="main-scroll-container">
            {children}
          </div>
          <div className="shrink-0 w-full relative z-50 bg-transparent">
            <BottomNav />
          </div>
        </MotionProvider>
        <OfflineManager />
      </body>
    </html>
  );
}
