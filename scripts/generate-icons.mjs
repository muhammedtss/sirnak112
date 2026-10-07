/* Uygulama ikonlarını tek bir SVG tasarımından üretir.
   Çalıştırma: node scripts/generate-icons.mjs
   - "any" ikonlar: simge tuvalin ~%72'si (köşeler launcher tarafından yuvarlanır)
   - "maskable" ikonlar: simge %80'lik güvenli dairenin içinde (~%56), arka plan taşar
   - apple-touch-icon: saydamlık yok, tam dolu arka plan (iOS köşeleri kendisi yuvarlar) */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, "$1")), "..");
const pub = path.join(root, "public");

/** scale: simgenin 512'lik tuvaldeki göreli boyutu */
function svg(scale) {
  const s = scale;
  const arm = 300 * s; // kol uzunluğu
  const w = 92 * s; // kol kalınlığı
  const r = 18 * s;
  const rect = (deg) =>
    `<rect x="${256 - w / 2}" y="${256 - arm / 2}" width="${w}" height="${arm}" rx="${r}" transform="rotate(${deg} 256 256)"/>`;
  // EKG çizgisi: yıldızın ortasından geçen tek atım
  const k = s;
  const pts = [
    [256 - 190 * k, 256], [256 - 70 * k, 256], [256 - 48 * k, 256 - 26 * k], [256 - 26 * k, 256 + 18 * k],
    [256 - 4 * k, 256 - 92 * k], [256 + 22 * k, 256 + 70 * k], [256 + 44 * k, 256], [256 + 190 * k, 256],
  ].map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <radialGradient id="bg" cx="50%" cy="38%" r="75%">
      <stop offset="0" stop-color="#12303A"/>
      <stop offset="0.55" stop-color="#0C1A24"/>
      <stop offset="1" stop-color="#090C14"/>
    </radialGradient>
    <linearGradient id="star" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#5EEAD4"/>
      <stop offset="1" stop-color="#0D9488"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#bg)"/>
  <g fill="url(#star)">${rect(0)}${rect(60)}${rect(120)}</g>
  <polyline points="${pts}" fill="none" stroke="#090C14" stroke-width="${30 * k}" stroke-linecap="round" stroke-linejoin="round"/>
  <polyline points="${pts}" fill="none" stroke="#FFFFFF" stroke-width="${15 * k}" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
}

const any = svg(1.0);
const maskable = svg(0.78);

fs.mkdirSync(path.join(pub, "icons"), { recursive: true });
fs.writeFileSync(path.join(pub, "icons", "icon.svg"), any);

const jobs = [
  [any, 192, "icons/icon-192x192.png"],
  [any, 512, "icons/icon-512x512.png"],
  [maskable, 192, "icons/icon-maskable-192x192.png"],
  [maskable, 512, "icons/icon-maskable-512x512.png"],
  [any, 180, "apple-touch-icon.png"],
  [any, 48, "icons/favicon-48.png"],
  [any, 32, "icons/favicon-32.png"],
  [any, 16, "icons/favicon-16.png"],
];
for (const [src, size, out] of jobs) {
  await sharp(Buffer.from(src)).resize(size, size).png({ compressionLevel: 9 }).toFile(path.join(pub, out));
  console.log("✓", out);
}
