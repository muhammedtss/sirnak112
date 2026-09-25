"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EkgModule, RhythmAnalysisData } from "@/data/ekg-training-data";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  Info,
  Ruler,
} from "lucide-react";
import DigitalCaliper from "./DigitalCaliper";

interface Props {
  module: EkgModule;
  onComplete: () => void;
}

const PARAMETERS = [
  { key: "ritim", label: "1. Ritim" },
  { key: "hiz", label: "2. Hız" },
  { key: "pDalgasi", label: "3. P Dalgası" },
  { key: "pQrsIliskisi", label: "4. P-QRS İlişkisi" },
  { key: "qrsGenisligi", label: "5. QRS Genişliği" },
] as const;

export default function RhythmSimulator({ module, onComplete }: Props) {
  const cases = module.interactivePayload?.cases || [];
  const [currentCaseIndex, setCurrentCaseIndex] = useState(0);

  const currentCase = cases[currentCaseIndex];

  const [step, setStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showNotes, setShowNotes] = useState(false);
  const [caliperOpen, setCaliperOpen] = useState(false);

  useEffect(() => {
    setStep(0);
    setErrorMsg(null);
    setShowNotes(false);
    setCaliperOpen(false);
  }, [currentCaseIndex]);

  const options = useMemo(() => {
    if (!currentCase) return [];

    if (step < 5) {
      const paramKey = PARAMETERS[step].key;
      const correct = currentCase[paramKey];
      const allVals = Array.from(
        new Set(cases.map((c: any) => c[paramKey])),
      ) as string[];
      const distractors = allVals.filter((v) => v !== correct);
      distractors.sort(() => Math.random() - 0.5);
      const selectedOpts = [correct, ...distractors.slice(0, 3)];
      return selectedOpts.sort(() => Math.random() - 0.5);
    } else {
      const correct = currentCase.tani;
      const allVals = Array.from(
        new Set(cases.map((c: any) => c.tani)),
      ) as string[];
      const distractors = allVals.filter((v) => v !== correct);
      distractors.sort(() => Math.random() - 0.5);
      const selectedOpts = [correct, ...distractors.slice(0, 3)];
      return selectedOpts.sort(() => Math.random() - 0.5);
    }
  }, [currentCase, step, cases]);

  const relevantNotes = useMemo(() => {
    const allNotes = module.verbatimContent.notes || [];
    if (!currentCase || allNotes.length === 0) return [];
    const taniUpper = currentCase.tani.toUpperCase();

    if (taniUpper.includes("SVT")) {
      return allNotes.filter((n) => n.includes("PSVT") || n.includes("AVNRT"));
    }
    if (taniUpper.includes("FİBRİLASYON") && !taniUpper.includes("DAL")) {
      return allNotes.filter((n) => n.includes("Atriyal Fibrilasyon:"));
    }
    if (taniUpper.includes("DAL BLOĞU")) {
      return allNotes.filter(
        (n) => n.includes("Dal Blokları") || n.includes("WPW"),
      );
    }
    return allNotes;
  }, [currentCase, module.verbatimContent.notes]);

  const handleOptionClick = (opt: string) => {
    if (step < 5) {
      const paramKey = PARAMETERS[step].key;
      const correct = currentCase[paramKey];
      if (opt === correct) {
        setErrorMsg(null);
        setStep((s) => s + 1);
      } else {
        let msg = "Yanlış seçim, lütfen EKG trasesini tekrar inceleyin.";
        if (paramKey === "ritim") {
          msg =
            currentCase.ritim === "DÜZENLİ"
              ? "R-R aralıklarına dikkat et, birbirine eşit! (Düzenli)"
              : "R-R aralıklarına dikkat et, aralıklar birbirinden farklı! (Düzensiz)";
        } else if (paramKey === "hiz") {
          msg =
            "Üstteki 'Pergeli Aç' butonunu kullanarak R-R arasındaki büyük kareleri (300/kare) veya 15 kare içindeki R sayısını (x20) ölçün.";
        } else if (paramKey === "pDalgasi") {
          msg =
            "Her QRS öncesinde düzenli bir P dalgası veya testere dişi (flatter) görünümü olup olmadığına dikkat edin.";
        } else if (paramKey === "pQrsIliskisi") {
          msg =
            "Her P dalgasını bir QRS kompleksi takip ediyor mu ve P-R mesafesi normal mi (0.12-0.20 sn)?";
        } else if (paramKey === "qrsGenisligi") {
          msg =
            "QRS genişliği 0.12 saniyeden (3 küçük kare) dar mı yoksa geniş mi?";
        }
        setErrorMsg(msg);
      }
    } else {
      if (opt === currentCase.tani) {
        setErrorMsg(null);
        setShowNotes(true);
      } else {
        setErrorMsg(
          "Yanlış tanı! Sol tarafta doğruladığınız 5 parametreyi birleştirerek tekrar düşünün.",
        );
      }
    }
  };

  const handleNextCase = () => {
    if (currentCaseIndex < cases.length - 1) {
      setCurrentCaseIndex((i) => i + 1);
    } else {
      onComplete();
    }
  };

  if (!currentCase) return null;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* EKG Strip Display & Caliper Container */}
      <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.5)]">
        <div className="p-3.5 bg-slate-800 border-b border-slate-700 flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-3">
            <span className="text-emerald-400 font-black tracking-widest text-sm">
              VAKA {currentCaseIndex + 1} / {cases.length}
            </span>
            <span className="text-xs bg-slate-900 text-slate-400 px-2.5 py-1 rounded-md border border-slate-700">
              Slayt {currentCase.slide}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCaliperOpen(!caliperOpen)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                caliperOpen
                  ? "bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                  : "bg-slate-700 text-emerald-400 hover:bg-slate-600"
              }`}
            >
              <Ruler size={14} /> Pergeli {caliperOpen ? "Kapat" : "Aç"}
            </button>
            <span className="text-slate-400 text-xs hidden sm:flex items-center gap-1">
              <Activity size={14} className="text-emerald-500" /> EKG Monitörü
            </span>
          </div>
        </div>

        {/* Pergel ve EKG Görüntüsü Alanı */}
        <div className="w-full relative bg-white overflow-x-auto">
          <div className="min-w-[700px] w-full relative">
            {caliperOpen && (
              <div className="relative z-20">
                <DigitalCaliper onClose={() => setCaliperOpen(false)} />
              </div>
            )}

            <div
              className={`w-full h-[260px] sm:h-[300px] flex items-center justify-center p-2 bg-white ${
                caliperOpen
                  ? "absolute bottom-0 left-0 right-0 z-10"
                  : "relative"
              }`}
            >
              <img
                src={currentCase.stripImage}
                alt={`EKG Vaka ${currentCaseIndex + 1}`}
                className="max-h-full w-full object-contain pointer-events-none select-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 5-Step Interactive Decision Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Locked/Unlocked Steps Table */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
          <h4 className="text-slate-300 font-bold mb-4 uppercase text-sm border-b border-slate-800 pb-2">
            Ritim Değerlendirme Aşamaları
          </h4>
          <div className="space-y-2.5">
            {PARAMETERS.map((p, idx) => {
              const isCompleted = step > idx;
              const isCurrent = step === idx;
              const val = isCompleted
                ? currentCase[p.key as keyof RhythmAnalysisData]
                : "???";

              return (
                <div
                  key={p.key}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    isCompleted
                      ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                      : isCurrent
                        ? "bg-slate-800 border-blue-500 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.25)]"
                        : "bg-slate-950/60 border-slate-800/80 text-slate-500 opacity-60"
                  }`}
                >
                  <span className="font-semibold text-sm shrink-0">
                    {p.label}
                  </span>
                  <div className="flex items-center gap-2 text-right">
                    <span className="text-xs font-bold">{val}</span>
                    {isCompleted && (
                      <CheckCircle
                        size={16}
                        className="text-emerald-500 shrink-0"
                      />
                    )}
                    {isCurrent && (
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shrink-0" />
                    )}
                  </div>
                </div>
              );
            })}

            {/* Final Diagnosis Row */}
            <div
              className={`flex items-center justify-between p-3.5 rounded-xl border mt-4 transition-all ${
                showNotes
                  ? "bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.25)]"
                  : step === 5
                    ? "bg-amber-500/10 border-amber-500 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.25)]"
                    : "bg-slate-950/60 border-slate-800 text-slate-500 opacity-50"
              }`}
            >
              <span className="font-black text-sm uppercase">NİHAİ TANI</span>
              <div className="flex items-center gap-2 text-right">
                <span className="text-xs font-black">
                  {showNotes ? currentCase.tani : "???"}
                </span>
                {showNotes && (
                  <CheckCircle
                    size={18}
                    className="text-emerald-400 shrink-0"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Active Question & Options */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between min-h-[320px]">
          {!showNotes ? (
            <>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400 block mb-1">
                  ADIM {step + 1} / 6
                </span>
                <h4 className="text-white font-bold text-lg mb-1">
                  {step < 5
                    ? `${PARAMETERS[step].label} Nedir?`
                    : "Bu EKG'nin Nihai Tanısı Nedir?"}
                </h4>
                <p className="text-slate-400 text-xs mb-4">
                  Yukarıdaki EKG trasesini inceleyerek doğru seçeneğe tıklayın.
                </p>

                <div className="grid grid-cols-1 gap-2.5">
                  <AnimatePresence mode="popLayout">
                    {options.map((opt) => (
                      <motion.button
                        key={opt}
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        onClick={() => handleOptionClick(opt)}
                        className="text-left p-3.5 rounded-xl border border-slate-700 bg-slate-800/90 hover:bg-slate-700 hover:border-emerald-500/60 text-sm font-semibold text-slate-100 transition-all active:scale-[0.99]"
                      >
                        {opt}
                      </motion.button>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3.5 bg-red-500/10 border border-red-500/40 rounded-xl flex gap-3 items-start"
                >
                  <AlertTriangle
                    className="text-red-500 shrink-0 mt-0.5"
                    size={18}
                  />
                  <p className="text-red-300 text-xs font-semibold leading-relaxed">
                    {errorMsg}
                  </p>
                </motion.div>
              )}
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col h-full justify-between"
            >
              <div>
                <div className="flex items-center gap-2.5 text-emerald-400 mb-2">
                  <CheckCircle size={26} />
                  <div>
                    <h4 className="font-black text-lg leading-none">
                      Tebrikler, Doğru Tanı!
                    </h4>
                    <span className="text-xs font-bold text-white mt-1 block">
                      {currentCase.tani}
                    </span>
                  </div>
                </div>

                {relevantNotes.length > 0 && (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl mt-4">
                    <h5 className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase mb-2">
                      <Info size={14} /> Sunum Bilgi Notu
                    </h5>
                    <div className="space-y-2 max-h-[160px] overflow-y-auto pr-2">
                      {relevantNotes.map((n, i) => (
                        <p
                          key={i}
                          className="text-slate-200 text-xs leading-relaxed"
                        >
                          {n}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleNextCase}
                className="w-full mt-6 py-3.5 bg-emerald-500 text-slate-950 font-black uppercase tracking-wider rounded-xl hover:bg-emerald-400 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] flex justify-center items-center gap-2"
              >
                {currentCaseIndex < cases.length - 1
                  ? "Sonraki Vakaya Geç"
                  : "Modülü Tamamla"}
                <ChevronRight size={18} />
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
