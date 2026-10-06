"use client";

import { useState, type ReactNode } from "react";
import { ChevronRight, RotateCcw, Zap, ZapOff } from "lucide-react";
import { Bilgi, Bolum, Eslestirme, Figur, HizliSoru, Maddeler, VakaInceleme } from "./ortak";
import RitimKarti from "../RitimKarti";
import { RITIMLER, type RitimId } from "@/lib/ekg/rhythms";

/* ════════════════════════ 5. Aritmi ve sınıflandırma ════════════════════════ */

const TASIKARDI_AGACI: Record<"dar" | "genis", Record<"duzenli" | "duzensiz", { ad: string; vurgu?: boolean }[]>> = {
  genis: {
    duzenli: [{ ad: "VT", vurgu: true }, { ad: "Dal bloklu SVT" }, { ad: "Preeksitasyonlu SVT" }],
    duzensiz: [{ ad: "Dal bloklu AF" }, { ad: "Preeksitasyonlu AF" }, { ad: "Polimorfik VT", vurgu: true }],
  },
  dar: {
    duzenli: [{ ad: "Sinüs taşikardisi" }, { ad: "PSVT — AVNRT / AVRT", vurgu: true }, { ad: "Atriyal flatter" }, { ad: "Atriyal taşikardi" }],
    duzensiz: [{ ad: "Atriyal fibrilasyon", vurgu: true }, { ad: "Değişen iletili atriyal flatter" }],
  },
};

function Secim({ aktif, onClick, children }: { aktif: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={aktif}
      className={`flex-1 py-3 rounded-xl border text-sm font-bold transition ${
        aktif ? "border-orange-500/50 bg-orange-500/15 text-orange-300" : "border-white/10 hover:bg-white/5"
      }`}
    >
      {children}
    </button>
  );
}

function TasikardiAgaci() {
  const [qrs, setQrs] = useState<"dar" | "genis" | null>(null);
  const [duzen, setDuzen] = useState<"duzenli" | "duzensiz" | null>(null);

  return (
    <div className="space-y-3">
      <p className="text-[11px] font-bold uppercase tracking-widest text-subtle">1 · QRS genişliği</p>
      <div className="flex gap-2">
        <Secim aktif={qrs === "dar"} onClick={() => { setQrs("dar"); setDuzen(null); }}>Dar QRS</Secim>
        <Secim aktif={qrs === "genis"} onClick={() => { setQrs("genis"); setDuzen(null); }}>Geniş QRS</Secim>
      </div>
      {qrs && (
        <>
          <p className="text-[11px] font-bold uppercase tracking-widest text-subtle flex items-center gap-1">
            <ChevronRight className="w-3 h-3" /> 2 · Ritim
          </p>
          <div className="flex gap-2">
            <Secim aktif={duzen === "duzenli"} onClick={() => setDuzen("duzenli")}>Düzenli</Secim>
            <Secim aktif={duzen === "duzensiz"} onClick={() => setDuzen("duzensiz")}>Düzensiz</Secim>
          </div>
        </>
      )}
      {qrs && duzen && (
        <div className="rounded-xl border border-orange-500/30 bg-orange-500/10 p-3 space-y-1.5 animate-in fade-in">
          <p className="text-[11px] font-bold uppercase tracking-widest text-orange-400">
            {qrs === "dar" ? "Dar" : "Geniş"} QRS · {duzen === "duzenli" ? "düzenli" : "düzensiz"} taşikardi
          </p>
          <ul className="space-y-1">
            {TASIKARDI_AGACI[qrs][duzen].map(t => (
              <li key={t.ad} className={`text-sm ${t.vurgu ? "font-black text-orange-300" : "font-semibold"}`}>
                • {t.ad}
              </li>
            ))}
          </ul>
          <button type="button" onClick={() => { setQrs(null); setDuzen(null); }} className="flex items-center gap-1 text-[11px] font-bold text-muted pt-1">
            <RotateCcw className="w-3 h-3" /> Baştan
          </button>
        </div>
      )}
    </div>
  );
}

export function SiniflandirmaDersi() {
  return (
    <div className="space-y-4">
      <Bolum baslik="Aritmi" slayt="13">
        <p className="text-sm leading-relaxed">
          Aritmi terimi düzenli sinüs ritmi dışındaki tüm ritimleri ifade eder. Kalbin pompa işlevini gerçekleştiren elektriksel
          mekanizmanın normal işleyişi için üç koşulun gerçekleşmesi gerekir. Normal uyarı sisteminde;
        </p>
        <Maddeler
          items={[
            "Uyarı belli bir noktadan başlar: sinoatriyal düğüm (SAD).",
            "Uyarı belli bir yolu izler: SAD → AV nod → His demeti → Purkinje lifleri.",
            "Döngüsünü belli bir zaman aralığında tamamlar.",
          ]}
        />
        <Bilgi renk="amber">
          Bu koşulların biri ya da daha fazlası yoksa ritim bozukluğu oluşur. Ritim bozuklukları; <strong>uyarı oluşumunda</strong> ya
          da <strong>uyarı iletiminde</strong> ortaya çıkar.
        </Bilgi>
      </Bolum>

      <Bolum baslik="Ritim bozuklukları" slayt="14">
        <div className="grid gap-2 sm:grid-cols-3">
          {[
            { baslik: "Hızlı ritimler (taşikardiler)", renk: "#F97316", alt: ["Dar QRS'li: düzenli / düzensiz", "Geniş QRS'li: düzenli / düzensiz"] },
            { baslik: "Yavaş ritimler (bradikardiler)", renk: "#38BDF8", alt: ["Sinüs bradikardisi", "AV bloklar"] },
            { baslik: "Arrest ritimler", renk: "#F87171", alt: ["Şoklanır: VF, nabızsız VT", "Şoklanmaz: asistoli, NEA"] },
          ].map(k => (
            <div key={k.baslik} className="rounded-xl border p-3" style={{ borderColor: `${k.renk}55`, background: `${k.renk}12` }}>
              <p className="text-xs font-black" style={{ color: k.renk }}>{k.baslik}</p>
              <ul className="mt-1.5 space-y-0.5">
                {k.alt.map(a => <li key={a} className="text-[11px] text-muted">• {a}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </Bolum>

      <Bolum baslik="Taşikardi sınıflandırması ve QRS genişliği" slayt="15">
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-black/[0.03] dark:bg-black/20 p-3">
            <p className="text-sm font-black">Supraventriküler</p>
            <p className="text-xs text-muted mt-1">A-V kavşağın üstünden kaynaklanır. Dar QRS&apos;lidir*.</p>
          </div>
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3">
            <p className="text-sm font-black">Ventriküler</p>
            <p className="text-xs text-muted mt-1">AV kavşağın altından kaynaklanır. Geniş QRS&apos;li ritimlerdir.</p>
          </div>
        </div>
        <p className="text-[11px] text-subtle">
          Sınır: fibröz iskelet. *Dal bloğu veya preeksitasyon varsa supraventriküler ritimler de geniş QRS&apos;li olabilir.
        </p>
      </Bolum>

      <Bolum baslik="Taşikardiler: karar ağacı" altBaslik="Önce QRS genişliği, sonra ritim" slayt="16">
        <TasikardiAgaci />
      </Bolum>

      <Bolum baslik="Kendini sına">
        <div className="space-y-2">
          <HizliSoru soru="Geniş QRS'li düzenli taşikardide ilk düşünülmesi gereken tanı?" secenekler={["AF", "VT", "Sinüs taşikardisi"]} dogru="VT" aciklama="Geniş QRS düzenli (monomorfik) → VT." />
          <HizliSoru soru="Dar QRS'li düzensiz taşikardi en sık hangisidir?" secenekler={["PSVT", "Atriyal fibrilasyon", "VT"]} dogru="Atriyal fibrilasyon" aciklama="Dar QRS düzensiz → AF; erişkinde en sık görülen taşikardidir." />
        </div>
      </Bolum>
    </div>
  );
}

/* ════════════════════════ Vaka seçici ════════════════════════ */

function VakaSecici({ ritimler }: { ritimler: RitimId[] }) {
  const [secili, setSecili] = useState<RitimId>(ritimler[0]);
  const i = ritimler.indexOf(secili);
  return (
    <div className="space-y-3">
      <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
        {ritimler.map((r, k) => (
          <button
            key={r}
            type="button"
            onClick={() => setSecili(r)}
            aria-pressed={secili === r}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
              secili === r ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-300" : "border-white/10 text-muted hover:bg-white/5"
            }`}
          >
            Vaka {k + 1}
          </button>
        ))}
      </div>
      <VakaInceleme key={secili} ritimId={secili} />
      {i < ritimler.length - 1 && (
        <button
          type="button"
          onClick={() => setSecili(ritimler[i + 1])}
          className="w-full flex items-center justify-center gap-1 py-2.5 rounded-xl text-xs font-bold border border-white/10 text-muted hover:bg-white/5"
        >
          Sonraki vaka <ChevronRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

/* ════════════════════════ 6. Hızlı ritimler ════════════════════════ */

export function HizliRitimlerDersi() {
  return (
    <div className="space-y-4">
      <Bolum baslik="Vaka incelemesi" altBaslik="Önce şeridi kendiniz değerlendirin, sonra adımları tek tek açın" slayt="17–29">
        <VakaSecici
          ritimler={["sinus-tasikardisi", "svt", "atriyal-flatter", "atriyal-fibrilasyon", "ventrikuler-tasikardi", "dal-blogu-af", "torsades"]}
        />
      </Bolum>

      <Bolum baslik="Paroksismal supraventriküler taşikardi (PSVT)" slayt="19–21">
        <Maddeler items={RITIMLER.svt.aciklama.slice(0, 3)} />
        <div className="grid gap-3 sm:grid-cols-[1fr_2fr] items-start">
          <Figur src="/ekg/avnrt-mekanizma.webp" alt="AVNRT mekanizması" genislik={1209} yukseklik={1306} maxH={260} aciklama="AVNRT: A-V nodda re-entry ile kısır döngü." />
          <Figur src="/ekg/avnrt-trase.webp" alt="AVNRT başlangıcı (DII)" genislik={1400} yukseklik={576} aciklama="Hız 160/dk'nın üzerine çıktığında P dalgaları QRS'lerin içinde kalır ve tam olarak görülmez." />
        </div>
      </Bolum>

      <Bolum baslik="Atriyal fibrilasyon" slayt="24">
        <div className="grid gap-3 sm:grid-cols-[2fr_1fr] items-start">
          <Maddeler items={RITIMLER["atriyal-fibrilasyon"].aciklama} />
          <Figur src="/ekg/af-mekanizma.webp" alt="Atriyumlarda çok sayıda reentry halkası" genislik={1208} yukseklik={1253} maxH={220} />
        </div>
        <Figur src="/ekg/af-trase.webp" alt="Atriyal fibrilasyon traseleri" genislik={1400} yukseklik={329} />
      </Bolum>

      <Bolum baslik="Dal blokları" slayt="27">
        <p className="text-sm leading-relaxed">
          <strong>Sağ dal bloğu:</strong> iletinin sağ dalda gecikmesi. V1–V3&apos;te M paterni (rR&apos;) görülür.
        </p>
        <Figur src="/ekg/sag-dal-blogu.webp" alt="Sağ dal bloğu V1–V6" genislik={1400} yukseklik={240} />
        <p className="text-sm leading-relaxed">
          <strong>Sol dal bloğu:</strong> iletinin sol dalda gecikmesi. DI, V5 ve V6&apos;da çentikli veya bozuk biçimli geniş QRS
          görülür.
        </p>
        <Figur src="/ekg/sol-dal-blogu.webp" alt="Sol dal bloğu" genislik={1400} yukseklik={269} />
      </Bolum>

      <Bolum baslik="WPW sendromu" slayt="28">
        <div className="grid grid-cols-2 gap-3">
          <Figur src="/ekg/wpw-aksesuar-yol.webp" alt="Aksesuar yol" genislik={335} yukseklik={308} maxH={200} />
          <Figur src="/ekg/wpw-delta.webp" alt="Kısa PR, geniş QRS, delta dalgası" genislik={327} yukseklik={309} maxH={200} />
        </div>
        <Maddeler items={["Kısa PR", "Geniş QRS", "Delta dalgası"]} />
        <Figur src="/ekg/wpw-af-trase.webp" alt="Preeksitasyonlu AF" genislik={1400} yukseklik={93} />
        <Bilgi renk="amber">Pre-eksitasyon ve atriyal fibrilasyonun birlikte olması durumunda geniş QRS&apos;li düzensiz bir taşikardi izlenir.</Bilgi>
      </Bolum>

      <Bolum baslik="Özet: hızlı ritimler" slayt="30">
        <Eslestirme
          baslik="Bulguyu ritimle eşleştirin"
          ciftler={[
            { sol: "Dar QRS düzenli", sag: "PSVT" },
            { sol: "Dar QRS düzensiz", sag: "AF" },
            { sol: "Geniş QRS düzenli (monomorfik)", sag: "VT" },
            { sol: "Geniş QRS düzensiz (monomorfik?)", sag: "Dal bloğu/WPW ve AF" },
            { sol: "Geniş QRS düzensiz (polimorfik)", sag: "Torsades de Pointes" },
          ]}
        />
      </Bolum>
    </div>
  );
}

/* ════════════════════════ 7. Yavaş ritimler ════════════════════════ */

const YAVAS = ["sinus-bradikardisi", "av-blok-1", "av-blok-2-tip1", "av-blok-2-tip2", "av-blok-3"] as const;

export function YavasRitimlerDersi() {
  return (
    <div className="space-y-4">
      <Bolum baslik="Vaka incelemesi" altBaslik="2. derece tip 1 vakasında “PR işaretleri” ile ilerleyici uzamayı görün" slayt="31–35">
        <VakaSecici ritimler={[...YAVAS]} />
      </Bolum>

      <Bolum baslik="Özet: yavaş ritimler" slayt="36">
        <div className="rounded-xl border border-white/10 overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-white/5">
              <tr>
                <th className="text-left px-3 py-2 font-bold">Ritim</th>
                <th className="text-left px-3 py-2 font-bold">Ayırt edici bulgu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {YAVAS.map(id => (
                <tr key={id}>
                  <td className="px-3 py-2 font-bold align-top">{RITIMLER[id].kisaAd}</td>
                  <td className="px-3 py-2 text-muted">{RITIMLER[id].ozet}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Bilgi renk="amber">
          <strong>Tip 2 mi, tam blok mu?</strong> Her ikisinde de birçok P&apos;ye QRS yanıtı yoktur. Tip 2&apos;de her QRS&apos;in önünde
          sabit PR ile bir P vardır; tam blokta PR aralıkları sabit değildir, P ve QRS birbirinden bağımsızdır.
        </Bilgi>
        <Eslestirme
          baslik="Ritmi bulgusuyla eşleştirin"
          ciftler={YAVAS.map(id => ({ sol: RITIMLER[id].kisaAd, sag: RITIMLER[id].ozet }))}
        />
      </Bolum>
    </div>
  );
}

/* ════════════════════════ 8. Arrest ritimleri ════════════════════════ */

const ARREST: RitimId[] = ["vf", "nabizsiz-vt", "asistoli", "nea"];

export function ArrestRitimleriDersi() {
  const [secili, setSecili] = useState<RitimId>("vf");
  return (
    <div className="space-y-4">
      <Bolum baslik="Arrest ritimleri" slayt="14">
        <p className="text-sm leading-relaxed">
          Kaynak sınıflamada arrest ritimleri, defibrilasyona yanıt verip vermemelerine göre iki gruba ayrılır. Nabız
          değerlendirmesi ritim tanısının ayrılmaz parçasıdır: monitördeki görüntü tek başına yeterli değildir.
        </p>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3">
            <p className="flex items-center gap-1 text-xs font-black text-red-400"><Zap className="w-3.5 h-3.5" /> Şoklanır</p>
            <p className="text-[11px] text-muted mt-1">VF · nabızsız VT</p>
          </div>
          <div className="rounded-xl border border-sky-500/30 bg-sky-500/10 p-3">
            <p className="flex items-center gap-1 text-xs font-black text-sky-400"><ZapOff className="w-3.5 h-3.5" /> Şoklanmaz</p>
            <p className="text-[11px] text-muted mt-1">Asistoli · NEA</p>
          </div>
        </div>
        <Bilgi renk="amber">
          Bu bölümdeki şeritler kaynak sunumda bulunmadığı için üretilmiş örneklerdir.
        </Bilgi>
      </Bolum>

      <Bolum baslik="Ritimler">
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {ARREST.map(id => (
            <button
              key={id}
              type="button"
              onClick={() => setSecili(id)}
              aria-pressed={secili === id}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold border ${
                secili === id ? "border-red-500/50 bg-red-500/15 text-red-300" : "border-white/10 text-muted hover:bg-white/5"
              }`}
            >
              {RITIMLER[id].kisaAd}
            </button>
          ))}
        </div>
        <RitimKarti key={secili} ritimId={secili} varsayilanSeed={5} />
      </Bolum>

      <Bolum baslik="Kendini sına">
        <div className="space-y-2">
          <HizliSoru soru="Monitörde organize ritim var ama nabız yok. Ritim?" secenekler={["Asistoli", "NEA", "VF"]} dogru="NEA" aciklama="Nabızsız elektriksel aktivite: organize elektriksel aktiviteye rağmen nabız alınamaz; şoklanmaz." />
          <HizliSoru soru="Hangisi şoklanır ritimdir?" secenekler={["Asistoli", "NEA", "VF"]} dogru="VF" aciklama="Şoklanır ritimler: VF ve nabızsız VT." />
        </div>
      </Bolum>
    </div>
  );
}
