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
  title: "Sirnak 112 - Acil Protokol",
  description: "Sirnak 112 Acil Saglik Hizmetleri Protokol ve Ilac Uygulamasi",
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
    <html lang="tr" className={`${outfit.variable} h-full`}>
      <body className="flex flex-col relative antialiased">
        {/* Layered premium background — fixed, stays behind everything */}
        <Background />

        {/* Each page renders its own header + content.
            Root layout only provides the ambient BG and bottom nav shell. */}
        {children}

        <BottomNav />
      </body>
    </html>
  );
}
