"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EkgModule, RhythmAnalysisData } from "@/data/ekg-training-data";
import { Activity, AlertTriangle, CheckCircle, ChevronRight, Info } from "lucide-react";

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

  // State for the 5-step form + Diagnosis
  const [step, setStep] = useState(0); // 0 to 5 (5 is diagnosis)
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showNotes, setShowNotes] = useState(false);

  // Reset state when case changes
  useEffect(() => {
    setStep(0);
    setErrorMsg(null);
    setShowNotes(false);
  }, [currentCaseIndex]);

  // Generate options for the current step
  const options = useMemo(() => {
    if (!currentCase) return [];
    
    if (step < 5) {
      const paramKey = PARAMETERS[step].key;
      const correct = currentCase[paramKey];
      // Get all unique values for this param from all cases
      const allVals = Array.from(new Set(cases.map((c: any) => c[paramKey])));
      // Ensure correct is there, then add up to 3 distractors
      let distractors = allVals.filter(v => v !== correct);
      // Shuffle distractors
      distractors.sort(() => Math.random() - 0.5);
      const selectedOpts = [correct, ...distractors.slice(0, 3)];
      // Shuffle options
      return selectedOpts.sort(() => Math.random() - 0.5);
    } else {
      // Step 5: Diagnosis
      const correct = currentCase.tani;
      const allVals = Array.from(new Set(cases.map((c: any) => c.tani)));
      let distractors = allVals.filter(v => v !== correct);
      distractors.sort(() => Math.random() - 0.5);
      const selectedOpts = [correct, ...distractors.slice(0, 3)];
      return selectedOpts.sort(() => Math.random() - 0.5);
    }
  }, [currentCase, step, cases]);

  const handleOptionClick = (opt: string) => {
    if (step < 5) {
      const paramKey = PARAMETERS[step].key;
      const correct = currentCase[paramKey];
      if (opt === correct) {
        setErrorMsg(null);
        setStep(s => s + 1);
      } else {
        // Generate contextual error message
        let msg = "Yanlış seçim, lütfen tekrar inceleyin.";
        if (paramKey === "ritim") {
          msg = currentCase.ritim === "DÜZENLİ" 
            ? "R-R aralıklarına dikkat et, birbirine eşit! (Düzenli)" 
            : "R-R aralıklarına dikkat et, aralıklar farklı! (Düzensiz)";
        } else if (paramKey === "hiz") {
          msg = "Kalp hızını hesaplarken R-R arasındaki büyük kareleri (300/kare sayısı) veya 3 saniyedeki kompleks sayısını (x20) kullanın.";
        } else if (paramKey === "pDalgasi") {
          msg = "EKG'nin her QRS öncesindeki P dalgalarını dikkatlice arayın.";
        } else if (paramKey === "qrsGenisligi") {
          msg = "QRS kompleksinin 3 küçük kareden (0.12sn) dar mı yoksa geniş mi olduğuna dikkat edin.";
        }
        setErrorMsg(msg);
      }
    } else {
      // Diagnosis step
      if (opt === currentCase.tani) {
        setErrorMsg(null);
        setShowNotes(true);
      } else {
        setErrorMsg("Yanlış tanı. Daha önce seçtiğiniz 5 parametreyi göz önünde bulundurun.");
      }
    }
  };

  const handleNextCase = () => {
    if (currentCaseIndex < cases.length - 1) {
      setCurrentCaseIndex(i => i + 1);
    } else {
      onComplete();
    }
  };

  if (!currentCase) return null;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* EKG Strip Display */}
      <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.5)]">
        <div className="p-3 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
          <span className="text-emerald-500 font-bold tracking-widest text-sm">VAKA {currentCaseIndex + 1} / {cases.length}</span>
          <span className="text-slate-400 text-xs flex items-center gap-1"><Activity size={14}/> EKG Monitörü</span>
        </div>
        <div className="w-full overflow-x-auto relative EKG-GRID-BACKGROUND bg-[#ffefef]">
          {/* A soft CSS grid overlay to make it look like EKG paper if the image has transparent background, 
              but since we extracted PDF images, they probably have their own grid. We'll just display it. */}
          <div className="min-w-[600px] w-full max-h-[300px] flex items-center justify-center p-2 bg-white overflow-hidden">
            <img 
              src={currentCase.stripImage} 
              alt="EKG Strip" 
              className="max-h-full w-auto object-contain scale-100 hover:scale-125 transition-transform duration-300 origin-center cursor-zoom-in"
            />
          </div>
        </div>
      </div>

      {/* Interactive Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Progress/Parameters */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
          <h4 className="text-slate-300 font-bold mb-4 uppercase text-sm border-b border-slate-800 pb-2">Karar Adımları</h4>
          <div className="space-y-3">
            {PARAMETERS.map((p, idx) => {
              const isCompleted = step > idx;
              const isCurrent = step === idx;
              const val = isCompleted ? currentCase[p.key as keyof RhythmAnalysisData] : "???";

              return (
                <div 
                  key={p.key} 
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    isCompleted 
                      ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400"
                      : isCurrent
                      ? "bg-slate-800 border-blue-500 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                      : "bg-slate-900 border-slate-800 text-slate-500 opacity-50"
                  }`}
                >
                  <span className="font-semibold text-sm">{p.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold">{val}</span>
                    {isCompleted && <CheckCircle size={16} className="text-emerald-500" />}
                    {isCurrent && <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />}
                  </div>
                </div>
              );
            })}

            {/* Diagnosis Row */}
            <div 
              className={`flex items-center justify-between p-3 rounded-xl border mt-4 transition-all ${
                showNotes 
                  ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                  : step === 5
                  ? "bg-red-500/10 border-red-500/50 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.3)]"
                  : "bg-slate-900 border-slate-800 text-slate-500 opacity-50"
              }`}
            >
              <span className="font-black text-sm uppercase">NİHAİ TANI</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold">{showNotes ? currentCase.tani : "???"}</span>
                {showNotes && <CheckCircle size={18} className="text-emerald-500" />}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Interaction Area */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between min-h-[300px]">
          {!showNotes ? (
            <>
              <div>
                <h4 className="text-white font-bold mb-1">
                  {step < 5 ? PARAMETERS[step].label : "Nihai Tanı Seçimi"}
                </h4>
                <p className="text-slate-400 text-xs mb-4">Lütfen doğru seçeneği işaretleyin.</p>
                
                <div className="grid grid-cols-1 gap-2">
                  <AnimatePresence mode="popLayout">
                    {options.map((opt) => (
                      <motion.button
                        key={opt}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        onClick={() => handleOptionClick(opt)}
                        className="text-left p-3 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 hover:border-slate-500 text-sm font-semibold text-slate-200 transition-all active:scale-95"
                      >
                        {opt}
                      </motion.button>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {errorMsg && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg flex gap-3 items-start"
                >
                  <AlertTriangle className="text-red-500 shrink-0" size={18} />
                  <p className="text-red-400 text-xs font-bold leading-relaxed">{errorMsg}</p>
                </motion.div>
              )}
            </>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col h-full"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 text-emerald-500 mb-3">
                  <CheckCircle size={24} />
                  <h4 className="font-black text-lg">Doğru Tanı!</h4>
                </div>
                
                {module.verbatimContent.notes && module.verbatimContent.notes.length > 0 && (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl mt-4">
                    <h5 className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase mb-2">
                      <Info size={14} /> Klinik Bilgi Notu
                    </h5>
                    <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                      {module.verbatimContent.notes.map((n, i) => (
                        <p key={i} className="text-slate-300 text-xs leading-relaxed">{n}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleNextCase}
                className="w-full mt-4 py-3 bg-emerald-500 text-slate-950 font-black uppercase tracking-wider rounded-xl hover:bg-emerald-400 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] flex justify-center items-center gap-2"
              >
                {currentCaseIndex < cases.length - 1 ? "Sonraki Vakaya Geç" : "Modülü Tamamla"}
                <ChevronRight size={18} />
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
