/**
 * Algoritma ID → Görsel dosya yolları eşleştirme tablosu.
 * Etiket kuralı:
 *   "Anahtar Noktalar"  → _Anahtar_Noktalar içeren dosyalar
 *   "Akış Şeması"       → ana algoritma görseli
 */

export interface AlgorithmImage {
  src: string;
  label: string;
}

const Y = "/Yetiskin_Algoritmalari/";
const C = "/Cocuk_Algoritmalari/";
const D = "/Dogum_Yenidogan_Algoritmalari/";

export const algorithmImages: Record<string, AlgorithmImage[]> = {
  // ── YETİŞKİN ─────────────────────────────────────────────────────────────
  "SB-ASH-Y-01": [
    { src: `${Y}005_Olay_Yeri_Yonetimi.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-Y-02": [
    { src: `${Y}006_Acil_Olgu_Yonetimi_Anahtar_Noktalar.png`, label: "Anahtar Noktalar" },
    { src: `${Y}007_Acil_Olgu_Yonetimi.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-Y-03": [
    { src: `${Y}008_Hava_Yolu_Tikanikliklari.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-Y-04": [
    { src: `${Y}009_KOAH_Anahtar_Noktalar.png`, label: "Anahtar Noktalar" },
    { src: `${Y}010_KOAH.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-Y-05": [
    { src: `${Y}011_Astim_Anahtar_Noktalar.png`, label: "Anahtar Noktalar" },
    { src: `${Y}012_Astim.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-Y-06": [
    { src: `${Y}013_Akut_Koroner_Sendrom_Anahtar_Noktalar.png`, label: "Anahtar Noktalar" },
    { src: `${Y}014_Akut_Koroner_Sendrom.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-Y-07": [
    { src: `${Y}015_Bradikardi_Anahtar_Noktalar.png`, label: "Anahtar Noktalar" },
    { src: `${Y}016_Bradikardi.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-Y-08": [
    { src: `${Y}017_Nabizli_Tasikardi.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-Y-09": [
    { src: `${Y}018_Arrest_Yonetimi.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-Y-10": [
    { src: `${Y}019_Soklanamaz_Ritim_Yonetimi_Anahtar_Noktalar.png`, label: "Anahtar Noktalar" },
    { src: `${Y}020_Soklanamaz_Ritim_Asistoli_NEA.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-Y-11": [
    { src: `${Y}021_Soklanir_Ritim_VF_Nabizsiz_VT_Anahtar_Noktalar.png`, label: "Anahtar Noktalar" },
    { src: `${Y}022_Soklanir_Ritim_VF_Nabizsiz_VT.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-Y-12": [
    { src: `${Y}023_Resusitasyon_Sonrasi_Bakim.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-Y-13": [
    { src: `${Y}024_Hipovolemik_Sok.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-Y-14": [
    { src: `${Y}025_Kalp_Yetmezligine_Bagli_Akut_Akciger_Odemi_ve_Kardiyojenik_Sok_Anahtar_Noktalar.png`, label: "Anahtar Noktalar" },
    { src: `${Y}026_Kalp_Yetmezligine_Bagli_Akut_Akciger_Odemi_ve_Kardiyojenik_Sok.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-Y-15": [
    { src: `${Y}027_Ajite_Hastaya_Yaklasim_Anahtar_Noktalar.png`, label: "Anahtar Noktalar" },
    { src: `${Y}028_Ajite_Hastaya_Yaklasim.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-Y-16": [
    { src: `${Y}029_Bilinc_Degisiklikleri_Anahtar_Noktalar.png`, label: "Anahtar Noktalar" },
    { src: `${Y}030_Bilinc_Degisikligi.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-Y-17": [
    { src: `${Y}031_Diyabetik_Aciller.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-Y-18": [
    { src: `${Y}032_Inme_SVO.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-Y-19": [
    { src: `${Y}033_Nobet_Konvulziyon.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-Y-20": [
    { src: `${Y}034_Vertigo.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-Y-21": [
    { src: `${Y}035_Alerjik_Reaksiyon.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-Y-22": [
    { src: `${Y}036_Anafilaksi_Anahtar_Noktalar.png`, label: "Anahtar Noktalar" },
    { src: `${Y}037_Anafilaksi.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-Y-23": [
    { src: `${Y}038_Hipertermi_Anahtar_Noktalar.png`, label: "Anahtar Noktalar" },
    { src: `${Y}039_Hipertermi.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-Y-24": [
    { src: `${Y}040_Hipotermi_Anahtar_Noktalar.png`, label: "Anahtar Noktalar" },
    { src: `${Y}041_Hipotermi.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-Y-25": [
    { src: `${Y}042_Hipotermide_Arrest_Yonetimi_Anahtar_Noktalar.png`, label: "Anahtar Noktalar" },
    { src: `${Y}043_Hipotermide_Arrest_Yonetimi.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-Y-26": [
    { src: `${Y}044_Isirma_ve_Sokmalar_Anahtar_Noktalar.png`, label: "Anahtar Noktalar" },
    { src: `${Y}045_Isirma_ve_Sokmalar.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-Y-27": [
    { src: `${Y}046_Suda_Bogulma_Anahtar_Noktalar.png`, label: "Anahtar Noktalar" },
    { src: `${Y}047_Suda_Bogulma.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-Y-28": [
    { src: `${Y}048_Yanik_Anahtar_Noktalar_1.png`, label: "Anahtar Noktalar 1" },
    { src: `${Y}049_Yanik_Anahtar_Noktalar_2.png`, label: "Anahtar Noktalar 2" },
    { src: `${Y}050_Termal_Yanik.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-Y-29": [
    { src: `${Y}051_Elektrik_Yaniklari.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-Y-30": [
    { src: `${Y}052_Kimyasal_Yaniklar.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-Y-31": [
    { src: `${Y}053_Zehirlenmelere_Genel_Yaklasim_Anahtar_Noktalar.png`, label: "Anahtar Noktalar" },
    { src: `${Y}054_Zehirlenmelere_Genel_Yaklasim.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-Y-32": [
    { src: `${Y}055_Yuksek_Doz_Ilac_Alimi.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-Y-33": [
    { src: `${Y}056_Karbonmonoksit_Zehirlenmesi.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-Y-34": [
    { src: `${Y}057_Kalsiyum_Kanal_Blokerleri_Beta_Blokerlerle_Zehirlenme_Anahtar_Noktalar.png`, label: "Anahtar Noktalar" },
    { src: `${Y}058_Kalsiyum_Kanal_Blokerleri_Beta_Blokerler_ile_Zehirlenme.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-Y-35": [
    { src: `${Y}059_Kolinerjik_Ajanlarla_Zehirlenme_Anahtar_Noktalar.png`, label: "Anahtar Noktalar" },
    { src: `${Y}060_Kolinerjik_Ajanlarla_Zehirlenme.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-Y-36": [
    { src: `${Y}061_Narkotik_Opioid_Zehirlenmeleri_Anahtar_Noktalar.png`, label: "Anahtar Noktalar" },
    { src: `${Y}062_Narkotik_Opioid_Zehirlenmeleri.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-Y-37": [
    { src: `${Y}063_Trisiklik_Antidepresan_Zehirlenmesi_Anahtar_Noktalar.png`, label: "Anahtar Noktalar" },
    { src: `${Y}064_Trisiklik_Antidepresan_Zehirlenmesi.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-Y-38": [
    { src: `${Y}065_Travmali_Hastada_Acil_Olgu_Yonetimi_Anahtar_Noktalar_1.png`, label: "Anahtar Noktalar 1" },
    { src: `${Y}066_Travmali_Hastada_Acil_Olgu_Yonetimi_Anahtar_Noktalar_2.png`, label: "Anahtar Noktalar 2" },
    { src: `${Y}067_Travmali_Hastada_Acil_Olgu_Yonetimi.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-Y-39": [
    { src: `${Y}068_Crush_Sendromu_Anahtar_Noktalar.png`, label: "Anahtar Noktalar" },
    { src: `${Y}069_Crush_Sendromu.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-Y-40": [
    { src: `${Y}070_Kafa_Travmali_Hastaya_Yaklasim_Anahtar_Noktalar.png`, label: "Anahtar Noktalar" },
    { src: `${Y}071_Kafa_Travmali_Hastaya_Yaklasim.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-Y-41": [
    { src: `${Y}072_Start_Triyaj_Anahtar_Noktalar.png`, label: "Anahtar Noktalar" },
    { src: `${Y}073_Start_Triyaj.png`, label: "Akış Şeması" },
  ],

  // ── ÇOCUK ─────────────────────────────────────────────────────────────────
  "SB-ASH-C-01": [
    { src: `${C}084_Olay_Yeri_Yonetimi.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-C-02": [
    { src: `${C}085_Acil_Olgu_Yonetimi_Anahtar_Noktalar.png`, label: "Anahtar Noktalar" },
    { src: `${C}086_Acil_Olgu_Yonetimi.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-C-03": [
    { src: `${C}087_Yabanci_Cisme_Bagli_Hava_Yolu_Tikanikligi_Anahtar_Noktalar.png`, label: "Anahtar Noktalar" },
    { src: `${C}088_Yabanci_Cisme_Bagli_Hava_Yolu_Tikanikligi.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-C-04": [
    { src: `${C}089_Astim_Anahtar_Noktalar.png`, label: "Anahtar Noktalar" },
    { src: `${C}090_Astim.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-C-05": [
    { src: `${C}091_Epiglottit.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-C-06": [
    { src: `${C}092_Krup_Anahtar_Noktalar_1.png`, label: "Anahtar Noktalar 1" },
    { src: `${C}093_Krup_Anahtar_Noktalar_2.png`, label: "Anahtar Noktalar 2" },
    { src: `${C}094_Krup.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-C-07": [
    { src: `${C}095_Hipovolemik_Sok_Anahtar_Noktalar.png`, label: "Anahtar Noktalar" },
    { src: `${C}096_Hipovolemik_Sok.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-C-08": [
    { src: `${C}097_Kardiyojenik_Sok_Anahtar_Noktalar.png`, label: "Anahtar Noktalar" },
    { src: `${C}098_Kardiyojenik_Sok.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-C-09": [
    { src: `${C}100_Septik_Sok_Anahtar_Noktalar.png`, label: "Anahtar Noktalar" },
    { src: `${C}101_Septik_Sok.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-C-10": [
    { src: `${C}102_Bradikardi_Anahtar_Noktalar.png`, label: "Anahtar Noktalar" },
    { src: `${C}103_Bradikardi.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-C-11": [
    { src: `${C}104_Tasikardi_Nabizli_Anahtar_Noktalar.png`, label: "Anahtar Noktalar" },
    { src: `${C}105_Tasikardi_Nabizli.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-C-12": [
    { src: `${C}106_Arrest_Yonetimi_Anahtar_Noktalar.png`, label: "Anahtar Noktalar" },
    { src: `${C}107_Arrest_Yonetimi.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-C-13": [
    { src: `${C}108_Soklanir_Ritim_Anahtar_Noktalar.png`, label: "Anahtar Noktalar" },
    { src: `${C}109_Soklanir_Ritim_VF_Nabizsiz_VT.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-C-14": [
    { src: `${C}110_Soklanamaz_Ritim_Asistoli_NEA.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-C-15": [
    { src: `${C}111_Resusitasyon_Sonrasi_Bakim_Anahtar_Noktalar.png`, label: "Anahtar Noktalar" },
    { src: `${C}112_Resusitasyon_Sonrasi_Bakim.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-C-16": [
    { src: `${C}113_Bilinc_Degisiklikleri_Anahtar_Noktalar.png`, label: "Anahtar Noktalar" },
    { src: `${C}114_Bilinc_Degisiklikleri.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-C-17": [
    { src: `${C}115_Nobet_Konvulziyon_Anahtar_Noktalar.png`, label: "Anahtar Noktalar" },
    { src: `${C}116_Nobet_Konvulziyon.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-C-18": [
    { src: `${C}117_Ates_Yonetimi_Anahtar_Noktalar.png`, label: "Anahtar Noktalar" },
    { src: `${C}118_Ates_Yonetimi.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-C-19": [
    { src: `${C}119_Hiperglisemi.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-C-20": [
    { src: `${C}120_Hipoglisemi_Anahtar_Noktalar.png`, label: "Anahtar Noktalar" },
    { src: `${C}121_Hipoglisemi.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-C-21": [
    { src: `${C}122_Anafilaksi_Anahtar_Noktalar.png`, label: "Anahtar Noktalar" },
    { src: `${C}123_Anafilaksi.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-C-22": [
    { src: `${C}124_Hipertermi_Anahtar_Noktalar.png`, label: "Anahtar Noktalar" },
    { src: `${C}125_Hipertermi.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-C-23": [
    { src: `${C}126_Hipotermi_Anahtar_Noktalar.png`, label: "Anahtar Noktalar" },
    { src: `${C}127_Hipotermi.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-C-24": [
    { src: `${C}128_Hipotermide_Arrest_Yonetimi_Anahtar_Noktalar.png`, label: "Anahtar Noktalar" },
    { src: `${C}129_Hipotermide_Arrest_Yonetimi.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-C-25": [
    { src: `${C}130_Isirma_ve_Sokmalar.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-C-26": [
    { src: `${C}131_Suda_Bogulma_Anahtar_Noktalar.png`, label: "Anahtar Noktalar" },
    { src: `${C}132_Suda_Bogulma.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-C-27": [
    { src: `${C}133_Yanik_Anahtar_Noktalar_1.png`, label: "Anahtar Noktalar 1" },
    { src: `${C}134_Yanik_Anahtar_Noktalar_2.png`, label: "Anahtar Noktalar 2" },
    { src: `${C}135_Yanik.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-C-28": [
    { src: `${C}136_Toksikoloji_Zehirlenme_Doz_Asimi.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-C-29": [
    { src: `${C}137_Jump_Start_Triyaj_Anahtar_Noktalar.png`, label: "Anahtar Noktalar" },
    { src: `${C}138_Jump_Start_Triyaj.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-C-30": [
    { src: `${C}139_Travmali_Hastada_Acil_Olgu_Yonetimi.png`, label: "Akış Şeması" },
  ],

  // ── DOĞUM / YENİDOĞAN ────────────────────────────────────────────────────
  "SB-ASH-DY-01": [
    { src: `${D}075_Acil_Dogum_Eylemi.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-DY-02": [
    { src: `${D}076_Dogum_Komplikasyonlari.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-DY-03": [
    { src: `${D}077_Postpartum_Kanama.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-DY-04": [
    { src: `${D}078_Gebelikte_Arrest_Yonetimi.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-DY-05": [
    { src: `${D}079_Ucuncu_Trimester_Nobetler_Eklampsi.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-DY-06": [
    { src: `${D}080_Normal_Yenidogan_Bakimi.png`, label: "Akış Şeması" },
  ],
  "SB-ASH-DY-07": [
    { src: `${D}081_Yenidogan_Canlandirmasi_Anahtar_Noktalar.png`, label: "Anahtar Noktalar" },
    { src: `${D}082_Yenidogan_Canlandirmasi.png`, label: "Akış Şeması" },
  ],
};

/**
 * Bir algoritma için görsel listesini döner.
 * Eşleşme yoksa boş dizi döner.
 */
export function getAlgorithmImages(algorithmId: string): AlgorithmImage[] {
  return algorithmImages[algorithmId] ?? [];
}
