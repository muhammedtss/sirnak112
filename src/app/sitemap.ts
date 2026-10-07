import type { MetadataRoute } from "next";
import { ROUTE_SEO, SITE_URL } from "@/lib/seo";
import { STATIC_PARAMS } from "@/lib/static-params";

export const dynamic = "force-static";

/** Tüm statik sayfalar + build'de üretilen detay sayfaları (algoritmalar, vaka protokolleri, dersler...). */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const urls: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...Object.keys(ROUTE_SEO).map(path => ({
      url: `${SITE_URL}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: path.split("/").length === 2 ? 0.9 : 0.7,
    })),
  ];

  for (const [route, params] of Object.entries(STATIC_PARAMS)) {
    for (const p of params()) {
      const path = route.replace(/\[(\w+)\]/g, (_, key: string) => encodeURIComponent(p[key]));
      urls.push({ url: `${SITE_URL}${path}`, lastModified: now, changeFrequency: "monthly", priority: 0.6 });
    }
  }
  return urls;
}
