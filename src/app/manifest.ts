import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Şırnak 112 Acil Protokol",
    short_name: "112 Protokol",
    description: "Şırnak 112 Acil Protokol ve EKG Simülatörü",
    start_url: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#10b981",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable"
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      }
    ],
  };
}
