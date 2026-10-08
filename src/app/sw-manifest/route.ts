import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { STATIC_PARAMS } from "@/lib/static-params";

/* ════════════════════════════════════════════════════════════════
   /sw-manifest — service worker'ın çevrimdışı önbellek listesi.
   Build sırasında BİR KEZ üretilir (force-static):
     • pages : src/app altındaki tüm sayfalar (dinamik rotalar
               STATIC_PARAMS ile genişletilir)
     • core  : her cihaza otomatik indirilen küçük public dosyalar
     • packs : isteğe bağlı büyük paketler (algoritma görselleri)
   Her dosyanın içerik hash'i (rev) vardır; SW yalnızca değişen
   dosyaları yeniden indirir. `version` her build'de değişir.
   ════════════════════════════════════════════════════════════════ */

export const dynamic = "force-static";

const APP_DIR = path.join(process.cwd(), "src", "app");
const PUBLIC_DIR = path.join(process.cwd(), "public");

/** Çevrimdışı önbelleğe hiç alınmayacak public dosyalar (SW'nin kendisi). */
const EXCLUDED_PUBLIC = new Set(["/sw.js"]);

/** İsteğe bağlı indirilen büyük paketler. */
const PACKS: Record<string, { label: string; dirs: string[] }> = {
  algoritmalar: {
    label: "Algoritma görselleri",
    dirs: ["/Yetiskin_Algoritmalari/", "/Cocuk_Algoritmalari/", "/Dogum_Yenidogan_Algoritmalari/"],
  },
};

interface OfflineFile { url: string; size: number; rev: string }

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

/**
 * Build'in ürettiği tüm /_next/static dosyaları (JS, CSS, font).
 * Sayfa HTML'lerinde geçmeyen, sonradan yüklenen parçalar (ör. arama dizini) da
 * çevrimdışı önbelleğe girsin ve senkronda budanmasın diye SW'ye açıkça verilir.
 */
function collectStatics(): string[] {
  const dir = path.join(process.cwd(), ".next", "static");
  if (!fs.existsSync(dir)) return [];
  return walk(dir)
    .filter(f => !f.endsWith(".map"))
    .map(f => "/_next/static/" + path.relative(dir, f).split(path.sep).join("/"))
    .sort();
}

/** src/app içindeki page dosyalarından URL listesi. */
function collectPages(): string[] {
  const pages = new Set<string>();
  for (const file of walk(APP_DIR)) {
    if (!/^page\.(tsx|ts|jsx|js)$/.test(path.basename(file))) continue;

    const segments = path
      .relative(APP_DIR, path.dirname(file))
      .split(path.sep)
      .filter(s => s && !(s.startsWith("(") && s.endsWith(")"))); // route group'lar URL'ye girmez
    if (segments.some(s => s.startsWith("_") || s.startsWith("@"))) continue;

    const route = "/" + segments.join("/");
    if (!route.includes("[")) {
      pages.add(route);
      continue;
    }

    const generator = STATIC_PARAMS[route];
    if (!generator) {
      console.warn(`[sw-manifest] "${route}" için STATIC_PARAMS tanımlı değil — çevrimdışı önbelleğe alınmayacak.`);
      continue;
    }
    for (const params of generator()) {
      pages.add(route.replace(/\[([^\]]+)\]/g, (_, key: string) => encodeURIComponent(params[key])));
    }
  }
  return [...pages].sort();
}

function collectPublicFiles(): OfflineFile[] {
  return walk(PUBLIC_DIR)
    .map(file => {
      const rel = "/" + path.relative(PUBLIC_DIR, file).split(path.sep).join("/");
      return { rel, file };
    })
    .filter(({ rel }) => !EXCLUDED_PUBLIC.has(rel) && !path.basename(rel).startsWith("."))
    .map(({ rel, file }) => {
      const buffer = fs.readFileSync(file);
      return {
        url: encodeURI(rel), // tarayıcının istek URL'siyle birebir aynı biçim (Türkçe karakter, boşluk)
        size: buffer.length,
        rev: crypto.createHash("sha1").update(buffer).digest("hex").slice(0, 12),
        rel,
      };
    })
    .sort((a, b) => a.url.localeCompare(b.url))
    .map(({ url, size, rev }) => ({ url, size, rev }));
}

function buildManifest() {
  const pages = collectPages();
  const files = collectPublicFiles();

  const packs = Object.fromEntries(
    Object.entries(PACKS).map(([name, pack]) => {
      const packFiles = files.filter(f => pack.dirs.some(d => decodeURI(f.url).startsWith(d)));
      return [name, { label: pack.label, files: packFiles, bytes: packFiles.reduce((s, f) => s + f.size, 0) }];
    })
  );
  const packUrls = new Set(Object.values(packs).flatMap(p => p.files.map(f => f.url)));
  const core = files.filter(f => !packUrls.has(f.url));

  // Sayfa HTML'leri her build'de yeni chunk hash'leri içerir → sürüm build'e özgü olmalı.
  const buildId = process.env.VERCEL_DEPLOYMENT_ID ?? process.env.VERCEL_GIT_COMMIT_SHA ?? String(Date.now());
  const version = crypto
    .createHash("sha1")
    .update(JSON.stringify({ buildId, pages, files }))
    .digest("hex")
    .slice(0, 16);

  return {
    version,
    generatedAt: new Date().toISOString(),
    offlineUrl: "/offline",
    pages,
    // public dışında üretilen dosyalar (src/app/favicon.ico, manifest.ts)
    extra: ["/favicon.ico", "/manifest.webmanifest"],
    statics: collectStatics(),
    core,
    packs,
  };
}

export function GET() {
  return Response.json(buildManifest(), {
    headers: { "Cache-Control": "no-cache" },
  });
}
