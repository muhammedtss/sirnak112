import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, KEYWORDS, OG_BASE, ORG_NAME, SITE_NAME, SITE_URL } from "@/lib/seo";
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
  metadataBase: new URL(SITE_URL),
  title: { default: DEFAULT_TITLE, template: `%s · ${SITE_NAME}` },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: KEYWORDS,
  authors: [{ name: ORG_NAME }],
  creator: ORG_NAME,
  publisher: ORG_NAME,
  category: "medical",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  openGraph: { ...OG_BASE, title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION, url: "/" },
  twitter: { card: "summary_large_image", title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION, images: ["/og.png"] },
  formatDetection: { telephone: false },
  appleWebApp: {
    capable: true,
    title: "112 Protokol",
    statusBarStyle: "black-translucent",
  },
  // Next 16 yalnızca "mobile-web-app-capable" basar; eski iOS sürümleri tam ekran için bu etiketi arar
  other: { "apple-mobile-web-app-capable": "yes" },
  icons: {
    icon: [
      { url: '/icons/icon.svg', type: 'image/svg+xml' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' }
    ]
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  // black-translucent durum çubuğuyla birlikte: içerik çentiğin altına uzanır, güvenli alan boşlukları CSS'te
  viewportFit: "cover",
  themeColor: "#090C14",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" data-theme="dark" className={`${outfit.variable} h-[100dvh]`} suppressHydrationWarning>
      <head>
        {/* Kayıtlı temayı ilk boyamadan önce uygula (açık temada koyu parlamayı önler).
            Bilerek eşzamanlı: async/defer olsaydı ilk kare yanlış temayla boyanırdı. */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="/theme-init.js" />
      </head>
      <body className="flex flex-col h-full relative antialiased overflow-hidden pt-[env(safe-area-inset-top)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
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
