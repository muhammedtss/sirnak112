import cocukData from "@/data/cocuk.json";
import eriskinData from "@/data/eriskin.json";
import yenidoganData from "@/data/yenidogan.json";
import envanterData from "@/data/ambulans-envanter.json";
import { DERSLER } from "@/lib/ekg/lessons";

/* ════════════════════════════════════════════════════════════════
   Dinamik rotaların build-time parametreleri — tek kaynak.
   • Sayfalar generateStaticParams'ta bunu kullanır → HTML build'de üretilir.
   • /sw-manifest aynı listeyi kullanır → service worker tüm detay
     sayfalarını çevrimdışı için önceden kaydeder.
   Yeni bir dinamik rota eklenirse buraya da eklenmelidir; eklenmeyen
   rotalar çevrimdışı önbelleğe alınmaz (build sırasında uyarı verilir).
   ════════════════════════════════════════════════════════════════ */

type Params = Record<string, string>;

const ids = (data: object): Params[] => Object.keys(data).map(id => ({ id }));

export const ALGORITHM_IMAGE_CATEGORIES = ["yetiskin", "cocuk", "yenidogan"] as const;
export const ENVANTER_SECTIONS = ["ilaclar"] as const;

export const STATIC_PARAMS: Record<string, () => Params[]> = {
  "/algoritmalar/cocuk/[id]": () => ids(cocukData),
  "/algoritmalar/eriskin/[id]": () => ids(eriskinData),
  "/algoritmalar/yenidogan/[id]": () => ids(yenidoganData),
  "/vaka-protokolleri/cocuk/[id]": () => ids(cocukData),
  "/vaka-protokolleri/eriskin/[id]": () => ids(eriskinData),
  "/vaka-protokolleri/yenidogan/[id]": () => ids(yenidoganData),
  "/algoritmalar-gorsel/[kategori]": () => ALGORITHM_IMAGE_CATEGORIES.map(kategori => ({ kategori })),
  "/envanter/[tip]": () => Object.keys(envanterData).map(tip => ({ tip })),
  "/envanter/[tip]/[kategori]": () =>
    Object.keys(envanterData).flatMap(tip => ENVANTER_SECTIONS.map(kategori => ({ tip, kategori }))),
  "/ekg-egitim/ders/[slug]": () => DERSLER.map(d => ({ slug: d.slug })),
};

export function staticParamsFor(route: string): Params[] {
  const generator = STATIC_PARAMS[route];
  if (!generator) throw new Error(`static-params: "${route}" için parametre tanımlı değil`);
  return generator();
}
