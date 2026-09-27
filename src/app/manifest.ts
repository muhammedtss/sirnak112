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
    ],
  };
}
