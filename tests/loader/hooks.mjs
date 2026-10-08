/* Testler için modül çözümleyici (bağımlılık yok):
   - "@/x" → src/x (tsconfig paths ile aynı)
   - uzantısız göreli importlar → .ts / .tsx / index.ts
   - JSON dosyaları → `export default <json>` (kaynak kod JSON'u import özniteliği olmadan içe aktarıyor) */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SRC = path.resolve(fileURLToPath(new URL("../../src/", import.meta.url)));
const EXTS = ["", ".ts", ".tsx", ".js", ".mjs", "/index.ts"];

function tryFile(base) {
  for (const ext of EXTS) {
    const f = base + ext;
    if (fs.existsSync(f) && fs.statSync(f).isFile()) return f;
  }
  return null;
}

export async function resolve(specifier, context, next) {
  let base = null;
  if (specifier.startsWith("@/")) base = path.join(SRC, specifier.slice(2));
  else if ((specifier.startsWith("./") || specifier.startsWith("../")) && context.parentURL?.startsWith("file:")) {
    base = path.resolve(path.dirname(fileURLToPath(context.parentURL)), specifier);
  }
  if (base) {
    const f = tryFile(base);
    if (f) return { url: pathToFileURL(f).href, shortCircuit: true };
  }
  return next(specifier, context);
}

export async function load(url, context, next) {
  if (url.endsWith(".json")) {
    const source = `export default ${fs.readFileSync(fileURLToPath(url), "utf8")};`;
    return { format: "module", source, shortCircuit: true };
  }
  return next(url, context);
}
