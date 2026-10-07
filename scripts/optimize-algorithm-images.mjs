/* Algoritma akış şeması görsellerini PNG'den WebP'ye çevirir.
   Çalıştırma: node scripts/optimize-algorithm-images.mjs
   - En fazla 2600 px genişlik, kalite 85: telefonda 4× yakınlaştırmada bile yazılar net
     (karşılaştırma: docs/gelistirme-plani.md, Faz B1)
   - Çevrilen PNG silinir; orijinaller git geçmişinde ve kaynak PDF'te durur. */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, "$1")), "..");
const DIRS = ["Yetiskin_Algoritmalari", "Cocuk_Algoritmalari", "Dogum_Yenidogan_Algoritmalari"];
const MAX_W = 2600;

let before = 0, after = 0, n = 0;
for (const dir of DIRS) {
  const abs = path.join(root, "public", dir);
  for (const f of fs.readdirSync(abs).filter(f => f.toLowerCase().endsWith(".png"))) {
    const src = path.join(abs, f);
    const out = src.replace(/\.png$/i, ".webp");
    before += fs.statSync(src).size;
    await sharp(src)
      .resize({ width: MAX_W, withoutEnlargement: true })
      .webp({ quality: 85, effort: 6 })
      .toFile(out);
    after += fs.statSync(out).size;
    fs.unlinkSync(src);
    n++;
  }
}
console.log(`${n} görsel: ${(before / 1e6).toFixed(1)} MB → ${(after / 1e6).toFixed(1)} MB (−%${Math.round(100 - (after * 100) / before)})`);
