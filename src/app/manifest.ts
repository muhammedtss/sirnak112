import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Acil Protokol — Şırnak İl Ambulans Servisi",
    short_name: "112 Protokol",
    description:
      "Hastane öncesi acil algoritmaları, ilaç doz hesaplayıcı, skalalar, ICD-10 ve EKG eğitimi. İnternetsiz çalışır.",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    lang: "tr",
    dir: "ltr",
    categories: ["medical", "health", "education"],
    background_color: "#090C14",
    theme_color: "#090C14",
    prefer_related_applications: false,
    icons: [
      { src: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      // Maskable: simge %80'lik güvenli alanın içinde; Android dairesel/yuvarlak kırpınca kesilmez
      { src: "/icons/icon-maskable-192x192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/icon-maskable-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "İlaç Dozu", url: "/ilac-doz", icons: [{ src: "/icons/icon-192x192.png", sizes: "192x192" }] },
      { name: "Skalalar", url: "/skalalar", icons: [{ src: "/icons/icon-192x192.png", sizes: "192x192" }] },
      { name: "Görsel Algoritmalar", url: "/algoritmalar-gorsel", icons: [{ src: "/icons/icon-192x192.png", sizes: "192x192" }] },
    ],
  };
}
