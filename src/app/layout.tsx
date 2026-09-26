import type { Metadata } from "next";
import { Outfit } from "next/font/google";
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
      </body>
    </html>
  );
}
