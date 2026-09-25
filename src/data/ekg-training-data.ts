// types/ekg-training.ts

export interface RhythmAnalysisData {
  ritim: string;
  hiz: string;
  pDalgasi: string;
  pQrsIliskisi: string;
  qrsGenisligi: string;
  tani: string;
}

export interface EkgModule {
  id: string;
  slideNumbers: number[];
  title: string;
  type: 'intro' | 'interactive-anatomy' | 'interactive-wave' | 'caliper-training' | 'tree-builder' | 'rhythm-simulator' | 'summary-match';
  verbatimContent: {
    headings?: string[];
    bullets?: string[];
    notes?: string[];
  };
  interactivePayload?: any;
}

export const SIRNAK_112_EKG_DATA: EkgModule[] = [
  {
    id: "mod-1-amac",
    slideNumbers: [1, 2, 3],
    title: "TEMEL EKG (ELEKTROKARDİYOGRAFİ) - Giriş ve Hedefler",
    type: "intro",
    verbatimContent: {
      headings: [
        "Bakmak ve görmek faklı şeylerdir! Öyleyse nasıl bakmalı? ÖNCELİKLE ORTAK BİR YÖNTEMİMİZ OLMALI",
        "AMAÇ: Acil hasta değerlendirmesinde ritim bozukluklarının tanımasıyla ilgili bilgi kazanmak"
      ],
      bullets: [
        "Katılımcılar bu oturumun sonunda;",
        "1. Ritim değerlendirme aşamalarını söyleyebilmeli",
        "2. Normal sinüs ritminin özelliklerini söyleyebilmeli",
        "3. Taşiaritmileri sınıflayabilmeli",
        "4. Sık görülen hızlı ritimleri tanıyabilmeli",
        "5. Bradiaritmileri sınıflayabilmeli",
        "6. Sık görülen yavaş ritimleri tanıyabilmeli"
      ]
    }
  },
  {
    id: "mod-2-ileti-sistemi",
    slideNumbers: [4, 5],
    title: "KALBİN İLETİ SİSTEMİ",
    type: "interactive-anatomy",
    verbatimContent: {
      bullets: [
        "Kalp, kendi kendine uyarı oluşturabilen ve bunu tüm kalp hücrelerine ulaştırabilen özel bir ileti sistemine sahiptir. Bu sisteme kalbin uyarı ve iletim sistemi denir.",
        "Sinüs Düğümünden AV kavşağa gelen ileti, his demetini ve sağ/sol dalları geçerek purkinje lifleri aracılığı ile tüm ventrikülleri uyarır."
      ]
    },
    interactivePayload: {
      anatomicalLabels: [
        "Vena Kava Superior", "Sağ Atriyum", "Sol Atriyum",
        "Sinoatriyal düğüm", "Atriyoventriküler düğüm",
        "His Demeti", "Sağ Dal", "Sol Dal", "Purkinje Lifleri"
      ],
      correctConductionSequence: [
        "Sinoatriyal düğüm", "Atriyoventriküler düğüm", "His Demeti", "Sağ Dal / Sol Dal", "Purkinje Lifleri"
      ]
    }
  },
  {
    id: "mod-3-ekg-kagidi-ve-dalgalar",
    slideNumbers: [6, 7],
    title: "GENEL BİLGİLER ve DALGA ÖZELLİKLERİ",
    type: "interactive-wave",
    verbatimContent: {
      bullets: [
        "EKG kalbin elektriksel aktivitesinin elektrotlarla özel bir kağıda ya da monitör ekranına yansıtılmasıdır.",
        "Kağıt Hızı - 25 mm/saniye | 1 küçük kare: 1 mm = 0,04 saniye | 1 büyük kare: 5 mm = 0,2 saniye | 5 büyük kare = 1 Saniye | Dikey 10 mm = 1 mV"
      ]
    },
    interactivePayload: {
      waveHotspots: [
        {
          id: "P",
          label: "P (D2'ye bak!)",
          description: "EKG'nin ilk pozitif dalgasıdır. Atriyal depolarizasyonu ifade eder. Var mı/yok mu?"
        },
        {
          id: "PR",
          label: "PR (0,20sn)",
          description: "P-R Aralığı: Maksimum 0,20 sn"
        },
        {
          id: "QRS",
          label: "QRS (0,12sn)",
          description: "Q'nun başından S'nin sonuna kadar olan zamandır. Ventriküler depolarizasyonu ifade eder. Genişlemiş mi?"
        },
        {
          id: "ST",
          label: "ST Segmenti",
          description: "V2 ve V3 derivasyonlarında 2mm, diğer tüm derivasyonlarda 1mm yükselme elevasyon kabul edilir"
        },
        {
          id: "T",
          label: "T Dalgası",
          description: "Ventriküler repolarizasyon. Yüksekliği aynı derivasyondaki R dalgasının 2/3'ünden fazla, 1/8'inden az olmamalıdır"
        }
      ]
    }
  },
  {
    id: "mod-4-degerlendirme-ve-nsr",
    slideNumbers: [8, 9, 10, 11, 12],
    title: "RİTİM DEĞERLENDİRME AŞAMALARI & NORMAL SİNÜS RİTMİ",
    type: "caliper-training",
    verbatimContent: {
      headings: ["RİTİM DEĞERLENDİRME AŞAMALARI"],
      bullets: [
        "Ritim: Ritmik/Aritmik. Ritmin düzenli olabilmesi için, her bir R-R ve P-P aralıkları (ventriküler depolarizasyon ve atrial depolarizasyon aralıkları) birbirine eşit olmalıdır.",
        "Hız: 40/↓, 40-60, 60-100, 100-150, 150/↑",
        "Kalp Hızının Değerlendirilmesi-1 (Düzenli): 300 / R-R arasındaki büyük kare sayısı (1 kare=300, 2=150, 3=100, 4=75, 6=50, 7=43, 8=37, 9=33)",
        "Kalp Hızının Değerlendirilmesi-2 (Ritim düzensizse): EKG trasesi yeterince uzun değilse, 15 tane büyük kare (3 saniye) içerisindeki R dalgası sayılır ve çıkan rakam 20 ile çarpılarak, kalp atım hızı bulunur.",
        "P dalgası: P dalgası var mı?",
        "P-QRS ilişkisi: Her P dalgasına QRS yanıtı var mı? / P-R aralığı (0.20 sn)",
        "QRS genişliği: 0.10 - 0.12 sn, (0.12 sn ↑)"
      ],
      notes: [
        "NORMAL SİNÜS RİTMİ - Normal bir EKG'de: Ritim düzenli olmalı | Kalp hızı 60-100/dakika olmalı | P dalgası bulunmalı | Her P dalgasını QRS izlemeli (her atriyal aktiviteyi, ventriküler aktivite izlemeli) | P-R aralığı 0.12-0.20 saniye olmalı | QRS genişliği maksimum 0.10-0.12 saniye olmalı | ST segmenti izoelektrik hatta olmalı"
      ]
    }
  },
  {
    id: "mod-5-aritmi-siniflandirma",
    slideNumbers: [13, 14, 15, 16],
    title: "ARİTMİ MEKANİZMASI VE SINIFLANDIRMA",
    type: "tree-builder",
    verbatimContent: {
      bullets: [
        "Normal uyarı sisteminde; Uyarı belli bir noktadan başlar; Sino atriyal düğümden (SAD)",
        "Uyarı belli bir yolu izler; SAD -> AV nod -> Hiss demeti -> Purkinje Lifleri",
        "Döngüsünü belli bir zaman aralığında tamamlar. Bu koşulların biri ya da daha fazlası yoksa ritim bozukluğu oluşur.",
        "Ritim bozuklukları; 1) Uyarı oluşumunda, 2) Uyarı iletiminde",
        "Supraventriküler: A-V kavşağın üstünden kaynaklanır. Dar QRS'lidir*",
        "Ventriküler: AV kavşağın altından kaynaklanır. Geniş QRS'li ritimlerdir. (Sınır: Fibröz iskelet)"
      ]
    },
    interactivePayload: {
      mainTree: {
        "HIZLI RİTİMLER (TAŞİKARDİLER)": ["DAR QRS'Lİ (DÜZENLİ / DÜZENSİZ)", "GENİŞ QRS'Lİ (DÜZENLİ / DÜZENSİZ)"],
        "YAVAŞ RİTİMLER (BRADİKARDİLER)": [],
        "ARREST RİTİMLER": ["ŞOKLANIR (VF, n VT)", "ŞOKLANMAZ (ASİSTOLİ, NEA)"]
      },
      tachycardiaMatrix: {
        "GENİŞ QRS - DÜZENLİ": ["VT", "Dal bloklu SVT", "Preeksitasyonlu SVT"],
        "GENİŞ QRS - DÜZENSİZ": ["Dal bloklu AF", "Preeksitasyonlu AF", "Polimorfik VT"],
        "DAR QRS - DÜZENLİ": ["Sinüs taşikardisi", "PSVT - AVNRT - AVRT", "Atriyal flatter", "Atriyal taşikardi"],
        "DAR QRS - DÜZENSİZ": ["Atriyal Fibrilasyon", "Değişen iletili Atriyal Flatter"]
      }
    }
  },
  {
    id: "mod-6-hizli-ritim-vakalari",
    slideNumbers: [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
    title: "HIZLI RİTİMLER: İNTERAKTİF TANI SİMÜLATÖRÜ",
    type: "rhythm-simulator",
    verbatimContent: {
      notes: [
        "PSVT: Sık rastlanan dar kompleks taşikardilerden biridir. PSVT AV nodda ve AV nod ile aksesuar yol arasında oluşan reentry mekanizması ile meydana gelir. En sık AV nodal reentral taşikardi (%50-60) ve AV reentral taşikardi (%30-40) görülür.",
        "AVNRT (Atriyo Ventriküler Nodal Reentran Taşikardi): A-V nodda oluşan re-entry (yeniden uyarılma) mekanizmasıyla bir kısır döngü oluşur ve kalp hızı çok yüksek hızlara çıkar. Hızın arttığı özellikle dakikada 160'ın üzerine çıktığı durumlarda, P dalgaları QRS'lerin içinde kalır ve tam olarak görülmez.",
        "Atriyal Fibrilasyon: Atriyumlardaki çok sayıda reentry halkaları ile ortaya çıkan bir ritim bozukluğu. Dar QRS'li düzensiz bir taşikardidir. P dalgası izlenmez. En sık görülen ritim bozukluğudur.",
        "Dal Blokları - Sağ Dal Bloğu: İletinin sağ dalda gecikmesi. V1-V3'de M paterni (rR') dalgaları görülür. Sol Dal Bloğu: İletinin sol dalda gecikmesi. DI, V5 ve V6'da çentikli veya bozuk biçimli geniş QRS (rR') dalgaları görülür.",
        "WPW sendromu (Accessory Pathway): Kısa PR, Geniş QRS, Delta dalgası. Pre-eksitasyon ve atrial fibrilasyonun birlikte olması durumunda geniş QRS'li düzensiz bir taşikardi izlenir."
      ]
    },
    interactivePayload: {
      cases: [
        {
          slide: 17,
          stripImage: "/ekg/slide-17.png",
          ritim: "DÜZENLİ",
          hiz: "300/2: TAŞİKARDİ",
          pDalgasi: "VAR",
          pQrsIliskisi: "Her 'p' yi QRS izliyor",
          qrsGenisligi: "NORMAL(DAR)",
          tani: "SİNÜS TAŞİKARDİSİ"
        },
        {
          slide: 18,
          stripImage: "/ekg/slide-18.png",
          ritim: "DÜZENLİ",
          hiz: "12x20: TAŞİKARDİ",
          pDalgasi: "YOK",
          pQrsIliskisi: "DEĞERLENDİRİLEMEZ",
          qrsGenisligi: "NORMAL (DAR) QRS",
          tani: "DAR QRS'Lİ DÜZENLİ TAŞİKARDİ (SVT)"
        },
        {
          slide: 22,
          stripImage: "/ekg/slide-22.png",
          ritim: "DÜZENLİ",
          hiz: "300/4: NORMAL",
          pDalgasi: "YOK/FLATTER dalgaları var(Testere dişi görünümü)",
          pQrsIliskisi: "Değerlendirilemiyor (4/1 geçişli flatter-QRS ilişkisi)",
          qrsGenisligi: "NORMAL(DAR)",
          tani: "ATRİAL FLATTER"
        },
        {
          slide: 23,
          stripImage: "/ekg/slide-23.png",
          ritim: "DÜZENSİZ",
          hiz: "10x20: TAŞİKARDİ",
          pDalgasi: "YOK",
          pQrsIliskisi: "DEĞERLENDİRİLEMEZ",
          qrsGenisligi: "NORMAL (DAR)",
          tani: "DAR QRS'Lİ DÜZENSİZ TAŞİKARDİ (ATRİAL FİBRİLASYON)"
        },
        {
          slide: 25,
          stripImage: "/ekg/slide-25.png",
          ritim: "DÜZENLİ",
          hiz: "9x20: TAŞİKARDİ",
          pDalgasi: "YOK",
          pQrsIliskisi: "DEĞERLENDİRİLEMEZ",
          qrsGenisligi: "GENİŞ QRS",
          tani: "GENİŞ QRS'Lİ DÜZENLİ TAŞİKARDİ (VENTRİKÜLER TAŞİKARDİ)"
        },
        {
          slide: 26,
          stripImage: "/ekg/slide-26.png",
          ritim: "DÜZENSİZ",
          hiz: "7x20: TAŞİKARDİ",
          pDalgasi: "YOK",
          pQrsIliskisi: "DEĞERLENDİRİLEMEZ",
          qrsGenisligi: "GENİŞ QRS (MONOMORFİK?)",
          tani: "GENİŞ QRS'Lİ DÜZENSİZ TAŞİKARDİ (Dal bloğu ve AF)"
        },
        {
          slide: 30,
          stripImage: "/ekg/slide-30.png",
          ritim: "DÜZENSİZ",
          hiz: "9x20: TAŞİKARDİ (Hızı değerlendirmek zor)",
          pDalgasi: "YOK",
          pQrsIliskisi: "DEĞERLENDİRİLEMEZ",
          qrsGenisligi: "GENİŞ QRS (POLİMORFİK)",
          tani: "GENİŞ QRS'Lİ DÜZENSİZ TAŞİKARDİ (Torsades de Pointes)"
        }
      ]
    }
  },
  {
    id: "mod-7-yavas-ritim-vakalari",
    slideNumbers: [32, 33, 34, 35, 36],
    title: "YAVAŞ RİTİMLER VE AV BLOKLAR: İNTERAKTİF TANI SİMÜLATÖRÜ",
    type: "rhythm-simulator",
    verbatimContent: {},
    interactivePayload: {
      cases: [
        {
          slide: 32,
          stripImage: "/ekg/slide-32.png",
          ritim: "DÜZENLİ",
          hiz: "300/8: BRADİKARDİ",
          pDalgasi: "VAR",
          pQrsIliskisi: "Her 'p' yi QRS izliyor",
          qrsGenisligi: "NORMAL(DAR)",
          tani: "SİNÜS BRADİKARDİSİ"
        },
        {
          slide: 33,
          stripImage: "/ekg/slide-33.png",
          ritim: "DÜZENLİ",
          hiz: "300/4: NORMAL",
          pDalgasi: "VAR",
          pQrsIliskisi: "Her 'p' yi QRS izliyor/ P-R mesafesi uzun",
          qrsGenisligi: "NORMAL(DAR)",
          tani: "BİRİNCİ DERECE A-V BLOK"
        },
        {
          slide: 34,
          stripImage: "/ekg/slide-34.png",
          ritim: "DÜZENSİZ",
          hiz: "3x20",
          pDalgasi: "VAR",
          pQrsIliskisi: "Her 'p' yi QRS izlemiyor (A-V BLOK-Her QRS'in p'si var)",
          qrsGenisligi: "NORMAL(DAR)",
          tani: "İKİNCİ DERECE A-V BLOK TİP 1"
        },
        {
          slide: 35,
          stripImage: "/ekg/slide-35.png",
          ritim: "DÜZENLİ",
          hiz: "300/8: BRADİKARDİ",
          pDalgasi: "VAR",
          pQrsIliskisi: "Bir çok 'p'yi QRS izlemiyor (A-V BLOK-Her QRS'in p'si var)",
          qrsGenisligi: "NORMAL(DAR)",
          tani: "İKİNCİ DERECE A-V BLOK TİP 2"
        },
        {
          slide: 36,
          stripImage: "/ekg/slide-36.png",
          ritim: "DÜZENLİ",
          hiz: "300/8: BRADİKARDİ",
          pDalgasi: "VAR",
          pQrsIliskisi: "İLİŞKİ YOK (Bir çok p'yi QRS izlemiyor, her QRS'in p'si yok)",
          qrsGenisligi: "GENİŞ QRS",
          tani: "ÜÇÜNCÜ DERECE A-V TAM BLOK"
        }
      ]
    }
  },
  {
    id: "mod-8-ozet-eslestirme",
    slideNumbers: [31, 37],
    title: "GENEL ÖZET: HIZLI VE YAVAŞ RİTİMLER",
    type: "summary-match",
    verbatimContent: {},
    interactivePayload: {
      fastRhythmsSummary: [
        { feature: "Dar QRS düzenli", match: "PSVT" },
        { feature: "Dar QRS düzensiz", match: "AF" },
        { feature: "Geniş QRS düzenli (monomorfik)", match: "VT" },
        { feature: "Geniş QRS düzensiz (monomorfik?)", match: "Dal bloğu/WPW ve AF" },
        { feature: "Geniş QRS düzensiz (polimorfik)", match: "Torsades de Pointes" }
      ],
      slowRhythmsSummary: [
        { rhythm: "SİNÜS BRADİKARDİSİ", description: "Normal sinüs ritmi hız yavaş" },
        { rhythm: "BİRİNCİ DERECE A-V BLOK", description: "P-R mesafesinde sabit uzama" },
        { rhythm: "İKİNCİ DERECE A-V BLOK TİP 1", description: "P-R mesafesinde ilerleyici uzama | Her P'ye QRS yanıtı yok" },
        { rhythm: "İKİNCİ DERECE A-V BLOK TİP 2", description: "Bir çok P'ye QRS yanıtı yok | Her QRS'in P'si var" },
        { rhythm: "ÜÇÜNCÜ DERECE A-V TAM BLOK", description: "Bir çok P'ye QRS yanıtı yok | Her QRS'in P'si yok" }
      ]
    }
  }
];