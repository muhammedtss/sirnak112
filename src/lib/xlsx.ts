/* ════════════════════════════════════════════════════════════════
   Bağımlılıksız, en küçük XLSX (Office Open XML) yazıcısı.
   Dosya tarayıcıda, cihazın kendisinde üretilir: hiçbir sunucuya veri
   gitmez, CSP dışı betik gerekmez, çevrimdışı da çalışır.
   Paket, sıkıştırmasız (STORE) bir ZIP arşividir; Excel, LibreOffice,
   Google E-Tablolar ve Numbers bu biçimi açar.
   Hücre biçimleri (STIL) rapor tablosu için sabittir.
   ════════════════════════════════════════════════════════════════ */

export type HucreDegeri = string | number | null;
export interface Hucre {
  v: HucreDegeri;
  /** STIL değerlerinden biri */
  s?: number;
}

export interface Sayfa {
  /** Excel sayfa adı (en çok 31 karakter; [ ] : * ? / \ kullanılamaz) */
  ad: string;
  satirlar: (Hucre | HucreDegeri)[][];
  /** Sütun genişlikleri (karakter) */
  sutunlar?: number[];
  /** Birleştirilmiş hücreler, ör. "A1:F1" */
  birlesik?: string[];
  /** Otomatik filtre aralığı, ör. "A13:F52" */
  filtre?: string;
  /** Sabit yükseklik verilecek satırlar (1 tabanlı satır no → punto) */
  yukseklik?: Record<number, number>;
}

/** styles.xml içindeki cellXfs sırası */
export const STIL = {
  varsayilan: 0,
  baslik: 1,
  etiket: 2,
  tabloBaslik: 3,
  metin: 4,
  sayi: 5,
  yetersizMetin: 6,
  yetersizSayi: 7,
  yetersizDurum: 8,
  yeterliMetin: 9,
  yeterliSayi: 10,
  yeterliDurum: 11,
  bekleyenMetin: 12,
  bekleyenSayi: 13,
  bekleyenDurum: 14,
  not: 15,
  ozetSayi: 16,
} as const;

export const XLSX_MIME = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

const NS = "http://schemas.openxmlformats.org/spreadsheetml/2006/main";
const NS_R = "http://schemas.openxmlformats.org/officeDocument/2006/relationships";
const BASLIK = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';

/** XML 1.0'da geçersiz denetim karakterleri atılır, özel karakterler kaçırılır. */
function kacir(s: string): string {
  return s
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F￾￿]/g, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** 0 → A, 25 → Z, 26 → AA */
export function sutunHarfi(i: number): string {
  let s = "";
  for (let n = i + 1; n > 0; n = Math.floor((n - 1) / 26)) s = String.fromCharCode(65 + ((n - 1) % 26)) + s;
  return s;
}

const xf = (font: number, fill: number, border: number, hiza = "") =>
  `<xf numFmtId="0" fontId="${font}" fillId="${fill}" borderId="${border}" xfId="0" applyFont="1" applyFill="1" applyBorder="1"${hiza ? ` applyAlignment="1"><alignment ${hiza}/></xf>` : "/>"}`;
const SOL = 'vertical="center" wrapText="1"';
const ORTA = 'horizontal="center" vertical="center"';

// Sıra STIL nesnesiyle aynı olmalı
const HUCRE_BICIMLERI = [
  xf(0, 0, 0),
  xf(2, 0, 0, 'vertical="center"'),
  xf(1, 0, 0, 'vertical="center"'),
  xf(3, 2, 1, 'horizontal="center" vertical="center" wrapText="1"'),
  xf(0, 0, 1, SOL),
  xf(0, 0, 1, ORTA),
  xf(0, 3, 1, SOL),
  xf(0, 3, 1, ORTA),
  xf(5, 3, 1, ORTA),
  xf(0, 4, 1, SOL),
  xf(0, 4, 1, ORTA),
  xf(6, 4, 1, ORTA),
  xf(0, 5, 1, SOL),
  xf(0, 5, 1, ORTA),
  xf(7, 5, 1, ORTA),
  xf(4, 0, 0, 'vertical="top" wrapText="1"'),
  xf(1, 0, 0, 'horizontal="left" vertical="center"'),
];

const font = (ic: string) => `<font>${ic}<sz val="11"/><name val="Calibri"/><family val="2"/></font>`;
const dolgu = (rgb: string) => `<fill><patternFill patternType="solid"><fgColor rgb="FF${rgb}"/><bgColor indexed="64"/></patternFill></fill>`;
const kenar = (yon: string) => `<${yon} style="thin"><color rgb="FFD1D5DB"/></${yon}>`;

const STYLES =
  BASLIK +
  `<styleSheet xmlns="${NS}">` +
  `<fonts count="8">${font("")}${font("<b/>")}<font><b/><sz val="14"/><name val="Calibri"/><family val="2"/></font>${font('<b/><color rgb="FFFFFFFF"/>')}<font><i/><sz val="9"/><color rgb="FF6B7280"/><name val="Calibri"/><family val="2"/></font>${font('<b/><color rgb="FFB91C1C"/>')}${font('<b/><color rgb="FF047857"/>')}${font('<color rgb="FF6B7280"/>')}</fonts>` +
  `<fills count="6"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill>${dolgu("374151")}${dolgu("FEE2E2")}${dolgu("DCFCE7")}${dolgu("F3F4F6")}</fills>` +
  `<borders count="2"><border><left/><right/><top/><bottom/><diagonal/></border><border>${kenar("left")}${kenar("right")}${kenar("top")}${kenar("bottom")}<diagonal/></border></borders>` +
  `<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>` +
  `<cellXfs count="${HUCRE_BICIMLERI.length}">${HUCRE_BICIMLERI.join("")}</cellXfs>` +
  `<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>` +
  `</styleSheet>`;

function sayfaXml(sayfa: Sayfa, metinNo: (s: string) => number): string {
  const enGenis = Math.max(1, sayfa.sutunlar?.length ?? 0, ...sayfa.satirlar.map(r => r.length));
  const satirlar = sayfa.satirlar
    .map((satir, i) => {
      const r = i + 1;
      const ht = sayfa.yukseklik?.[r];
      const hucreler = satir
        .map((h, j) => {
          const { v, s = 0 } = h !== null && typeof h === "object" ? h : { v: h };
          const ref = `${sutunHarfi(j)}${r}`;
          const st = s ? ` s="${s}"` : "";
          if (v === null || v === "") return s ? `<c r="${ref}"${st}/>` : "";
          if (typeof v === "number") return Number.isFinite(v) ? `<c r="${ref}"${st}><v>${v}</v></c>` : `<c r="${ref}"${st}/>`;
          return `<c r="${ref}"${st} t="s"><v>${metinNo(v)}</v></c>`;
        })
        .join("");
      return `<row r="${r}"${ht ? ` ht="${ht}" customHeight="1"` : ""}>${hucreler}</row>`;
    })
    .join("");
  const cols = sayfa.sutunlar?.length
    ? `<cols>${sayfa.sutunlar.map((w, i) => `<col min="${i + 1}" max="${i + 1}" width="${w}" customWidth="1"/>`).join("")}</cols>`
    : "";
  const birlesik = sayfa.birlesik?.length
    ? `<mergeCells count="${sayfa.birlesik.length}">${sayfa.birlesik.map(m => `<mergeCell ref="${m}"/>`).join("")}</mergeCells>`
    : "";
  return (
    BASLIK +
    `<worksheet xmlns="${NS}" xmlns:r="${NS_R}">` +
    `<sheetPr><pageSetUpPr fitToPage="1"/></sheetPr>` +
    `<dimension ref="A1:${sutunHarfi(enGenis - 1)}${Math.max(1, sayfa.satirlar.length)}"/>` +
    `<sheetViews><sheetView workbookViewId="0"/></sheetViews>` +
    `<sheetFormatPr defaultRowHeight="15"/>` +
    cols +
    `<sheetData>${satirlar}</sheetData>` +
    (sayfa.filtre ? `<autoFilter ref="${sayfa.filtre}"/>` : "") +
    birlesik +
    `<pageMargins left="0.5" right="0.5" top="0.6" bottom="0.6" header="0.3" footer="0.3"/>` +
    `<pageSetup paperSize="9" orientation="portrait" fitToWidth="1" fitToHeight="0"/>` +
    `</worksheet>`
  );
}

/* ── ZIP (STORE) ── */

const CRC_TABLO = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

export function crc32(veri: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < veri.length; i++) c = CRC_TABLO[(c ^ veri[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function zip(dosyalar: { ad: string; veri: Uint8Array }[], tarih: Date): Uint8Array<ArrayBuffer> {
  const enc = new TextEncoder();
  const saat = (tarih.getHours() << 11) | (tarih.getMinutes() << 5) | (tarih.getSeconds() >> 1);
  const gun = ((Math.max(1980, tarih.getFullYear()) - 1980) << 9) | ((tarih.getMonth() + 1) << 5) | tarih.getDate();
  const yerel: Uint8Array[] = [];
  const merkez: Uint8Array[] = [];
  let konum = 0;

  for (const d of dosyalar) {
    const ad = enc.encode(d.ad);
    const crc = crc32(d.veri);
    const lh = new DataView(new ArrayBuffer(30));
    lh.setUint32(0, 0x04034b50, true);
    lh.setUint16(4, 20, true);
    lh.setUint16(6, 0x0800, true); // UTF-8 adlar
    lh.setUint16(8, 0, true); // STORE
    lh.setUint16(10, saat, true);
    lh.setUint16(12, gun, true);
    lh.setUint32(14, crc, true);
    lh.setUint32(18, d.veri.length, true);
    lh.setUint32(22, d.veri.length, true);
    lh.setUint16(26, ad.length, true);
    lh.setUint16(28, 0, true);
    yerel.push(new Uint8Array(lh.buffer), ad, d.veri);

    const ch = new DataView(new ArrayBuffer(46));
    ch.setUint32(0, 0x02014b50, true);
    ch.setUint16(4, 20, true);
    ch.setUint16(6, 20, true);
    ch.setUint16(8, 0x0800, true);
    ch.setUint16(10, 0, true);
    ch.setUint16(12, saat, true);
    ch.setUint16(14, gun, true);
    ch.setUint32(16, crc, true);
    ch.setUint32(20, d.veri.length, true);
    ch.setUint32(24, d.veri.length, true);
    ch.setUint16(28, ad.length, true);
    ch.setUint32(42, konum, true);
    merkez.push(new Uint8Array(ch.buffer), ad);

    konum += 30 + ad.length + d.veri.length;
  }

  const merkezBoyut = merkez.reduce((t, p) => t + p.length, 0);
  const son = new DataView(new ArrayBuffer(22));
  son.setUint32(0, 0x06054b50, true);
  son.setUint16(8, dosyalar.length, true);
  son.setUint16(10, dosyalar.length, true);
  son.setUint32(12, merkezBoyut, true);
  son.setUint32(16, konum, true);

  const parcalar = [...yerel, ...merkez, new Uint8Array(son.buffer)];
  const cikti = new Uint8Array(parcalar.reduce((t, p) => t + p.length, 0));
  let i = 0;
  for (const p of parcalar) {
    cikti.set(p, i);
    i += p.length;
  }
  return cikti;
}

/** Sayfalardan .xlsx dosyasının baytlarını üretir. */
export function xlsxOlustur(sayfalar: Sayfa[], belge: { baslik: string; tarih: Date }): Uint8Array<ArrayBuffer> {
  const metinler: string[] = [];
  const dizin = new Map<string, number>();
  let basvuru = 0;
  const metinNo = (s: string) => {
    basvuru++;
    let n = dizin.get(s);
    if (n === undefined) {
      n = metinler.length;
      metinler.push(s);
      dizin.set(s, n);
    }
    return n;
  };
  const sayfaXmlleri = sayfalar.map(s => sayfaXml(s, metinNo));

  const sayfaAdi = (ad: string) => kacir(ad.replace(/[[\]:*?/\\]/g, " ").slice(0, 31));
  const filtreAdlari = sayfalar
    .map((s, i) => {
      if (!s.filtre) return "";
      const [bas, son] = s.filtre.split(":").map(r => r.replace(/^([A-Z]+)(\d+)$/, "$$$1$$$2"));
      return `<definedName name="_xlnm._FilterDatabase" localSheetId="${i}" hidden="1">'${sayfaAdi(s.ad).replace(/'/g, "''")}'!${bas}:${son}</definedName>`;
    })
    .join("");

  const workbook =
    BASLIK +
    `<workbook xmlns="${NS}" xmlns:r="${NS_R}">` +
    `<bookViews><workbookView/></bookViews>` +
    `<sheets>${sayfalar.map((s, i) => `<sheet name="${sayfaAdi(s.ad)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join("")}</sheets>` +
    (filtreAdlari ? `<definedNames>${filtreAdlari}</definedNames>` : "") +
    `</workbook>`;

  const n = sayfalar.length;
  const workbookRels =
    BASLIK +
    `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
    sayfalar.map((_, i) => `<Relationship Id="rId${i + 1}" Type="${NS_R}/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join("") +
    `<Relationship Id="rId${n + 1}" Type="${NS_R}/styles" Target="styles.xml"/>` +
    `<Relationship Id="rId${n + 2}" Type="${NS_R}/sharedStrings" Target="sharedStrings.xml"/>` +
    `</Relationships>`;

  const sst =
    BASLIK +
    `<sst xmlns="${NS}" count="${basvuru}" uniqueCount="${metinler.length}">` +
    metinler.map(s => `<si><t xml:space="preserve">${kacir(s)}</t></si>`).join("") +
    `</sst>`;

  const ct = "application/vnd.openxmlformats-officedocument";
  const contentTypes =
    BASLIK +
    `<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">` +
    `<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>` +
    `<Default Extension="xml" ContentType="application/xml"/>` +
    `<Override PartName="/xl/workbook.xml" ContentType="${ct}.spreadsheetml.sheet.main+xml"/>` +
    sayfalar.map((_, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="${ct}.spreadsheetml.worksheet+xml"/>`).join("") +
    `<Override PartName="/xl/styles.xml" ContentType="${ct}.spreadsheetml.styles+xml"/>` +
    `<Override PartName="/xl/sharedStrings.xml" ContentType="${ct}.spreadsheetml.sharedStrings+xml"/>` +
    `<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>` +
    `<Override PartName="/docProps/app.xml" ContentType="${ct}.extended-properties+xml"/>` +
    `</Types>`;

  const rels =
    BASLIK +
    `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
    `<Relationship Id="rId1" Type="${NS_R}/officeDocument" Target="xl/workbook.xml"/>` +
    `<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>` +
    `<Relationship Id="rId3" Type="${NS_R}/extended-properties" Target="docProps/app.xml"/>` +
    `</Relationships>`;

  const w3c = belge.tarih.toISOString().replace(/\.\d{3}Z$/, "Z");
  const core =
    BASLIK +
    `<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">` +
    `<dc:title>${kacir(belge.baslik)}</dc:title>` +
    `<dcterms:created xsi:type="dcterms:W3CDTF">${w3c}</dcterms:created>` +
    `<dcterms:modified xsi:type="dcterms:W3CDTF">${w3c}</dcterms:modified>` +
    `</cp:coreProperties>`;
  const app =
    BASLIK +
    `<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"><Application>Acil Protokol</Application></Properties>`;

  const enc = new TextEncoder();
  return zip(
    [
      { ad: "[Content_Types].xml", veri: enc.encode(contentTypes) },
      { ad: "_rels/.rels", veri: enc.encode(rels) },
      { ad: "docProps/core.xml", veri: enc.encode(core) },
      { ad: "docProps/app.xml", veri: enc.encode(app) },
      { ad: "xl/workbook.xml", veri: enc.encode(workbook) },
      { ad: "xl/_rels/workbook.xml.rels", veri: enc.encode(workbookRels) },
      { ad: "xl/styles.xml", veri: enc.encode(STYLES) },
      { ad: "xl/sharedStrings.xml", veri: enc.encode(sst) },
      ...sayfaXmlleri.map((x, i) => ({ ad: `xl/worksheets/sheet${i + 1}.xml`, veri: enc.encode(x) })),
    ],
    belge.tarih,
  );
}
