"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SIRNAK_112_EKG_DATA, RhythmAnalysisData } from "@/data/ekg-training-data";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  Ruler,
  Award,
  RefreshCcw
} from "lucide-react";
import DigitalCaliper from "./DigitalCaliper";

const PARAMETERS = [
  { key: "ritim", label: "1. Ritim" },
  { key: "hiz", label: "2. Hız" },
  { key: "pDalgasi", label: "3. P Dalgası" },
  { key: "pQrsIliskisi", label: "4. P-QRS İlişkisi" },
  { key: "qrsGenisligi", label: "5. QRS Genişliği" },
] as const;

export default function EkgExamSimulator() {
  const cases = useMemo(() => {
    const mod6 = SIRNAK_112_EKG_DATA.find((m) => m.id === "mod-6")?.interactivePayload?.cases || [];
    const mod7 = SIRNAK_112_EKG_DATA.find((m) => m.id === "mod-7")?.interactivePayload?.cases || [];
    const combined = [...mod6, ...mod7];
    // Sınav modu olduğu için karıştırabiliriz
    return combined.sort(() => Math.random() - 0.5);
  }, []);

  const [currentCaseIndex, setCurrentCaseIndex] = useState(0);
  const currentCase = cases[currentCaseIndex];

  const [step, setStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showNotes, setShowNotes] = useState(false);
  const [caliperOpen, setCaliperOpen] = useState(false);

  // Exam states
  const [score, setScore] = useState(100);
  const [totalErrors, setTotalErrors] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

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
      const correct = currentCase[paramKey as keyof RhythmAnalysisData] as string;
      const allVals = Array.from(
        new Set(cases.map((c: any) => c[paramKey]))
      ) as string[];
      const distractors = allVals.filter((v) => v !== correct);
      distractors.sort(() => Math.random() - 0.5);
      const selectedOpts = [correct, ...distractors.slice(0, 3)];
      return selectedOpts.sort(() => Math.random() - 0.5);
    } else {
      const correct = currentCase.tani;
      const allVals = Array.from(
        new Set(cases.map((c: any) => c.tani))
      ) as string[];
      const distractors = allVals.filter((v) => v !== correct);
      distractors.sort(() => Math.random() - 0.5);
      const selectedOpts = [correct, ...distractors.slice(0, 3)];
      return selectedOpts.sort(() => Math.random() - 0.5);
    }
  }, [currentCase, step, cases]);

  const handleOptionClick = (opt: string) => {
    if (step < 5) {
      const paramKey = PARAMETERS[step].key;
      const correct = currentCase[paramKey as keyof RhythmAnalysisData];
      if (opt === correct) {
        setErrorMsg(null);
        setStep((s) => s + 1);
      } else {
        setScore((s) => Math.max(0, s - 5));
        setTotalErrors((e) => e + 1);
        setErrorMsg("Hatalı değerlendirme (-5 Puan). Traseyi tekrar inceleyin.");
      }
    } else {
      if (opt === currentCase.tani) {
        setErrorMsg(null);
        setShowNotes(true);
      } else {
        setScore((s) => Math.max(0, s - 5));
        setTotalErrors((e) => e + 1);
        setErrorMsg("Hatalı değerlendirme (-5 Puan). Traseyi tekrar inceleyin.");
      }
    }
  };

  const handleNextCase = () => {
    if (currentCaseIndex < cases.length - 1) {
      setCurrentCaseIndex((i) => i + 1);
    } else {
      setIsFinished(true);
    }
  };

  const restartExam = () => {
    setCurrentCaseIndex(0);
    setScore(100);
    setTotalErrors(0);
    setIsFinished(false);
  };

  if (isFinished) {
    const isSuccess = score >= 70;
    return (
      <div className="w-full max-w-2xl mx-auto mt-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900 border-2 border-slate-700 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
        >
          {/* Top Decoration */}
          <div className={`absolute top-0 left-0 right-0 h-3 ${isSuccess ? 'bg-emerald-500' : 'bg-red-500'}`} />
          
          <div className="text-center mb-8">
            <Award className={`w-20 h-20 mx-auto mb-4 ${isSuccess ? 'text-emerald-500' : 'text-red-500'}`} />
            <h2 className="text-2xl font-black text-white tracking-widest uppercase mb-2">Şırnak 112 EKG Değerlendirme Karnesi</h2>
            <p className="text-slate-400 font-semibold">Vaka Sınavı Sonuç Raporu</p>
          </div>

          <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 mb-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-4 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-sm font-bold block mb-1">Toplam Vaka</span>
                <span className="text-3xl font-black text-white">{cases.length}</span>
              </div>
              <div className="text-center p-4 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-sm font-bold block mb-1">Nihai Puan</span>
                <span className={`text-3xl font-black ${isSuccess ? 'text-emerald-400' : 'text-red-400'}`}>{score}</span>
              </div>
              <div className="text-center p-4 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-sm font-bold block mb-1">Doğru Karar</span>
                <span className="text-2xl font-black text-emerald-500">{cases.length * 6}</span>
              </div>
              <div className="text-center p-4 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-sm font-bold block mb-1">Hatalı Karar</span>
                <span className="text-2xl font-black text-red-500">{totalErrors}</span>
              </div>
            </div>
          </div>

          <div className={`text-center p-6 rounded-2xl mb-8 ${isSuccess ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
            <h3 className={`text-2xl font-black uppercase tracking-wider mb-2 ${isSuccess ? 'text-emerald-400' : 'text-red-400'}`}>
              {isSuccess ? 'BAŞARILI' : 'BAŞARISIZ'}
            </h3>
            <p className={`font-semibold ${isSuccess ? 'text-emerald-300' : 'text-red-300'}`}>
              {isSuccess ? 'Tebrikler! EKG değerlendirme testini başarıyla tamamladınız.' : 'Eğitim Modunu Tekrar İnceleyin.'}
            </p>
          </div>

          <button onClick={restartExam} className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-black uppercase tracking-widest rounded-xl transition-colors flex items-center justify-center gap-2">
            <RefreshCcw size={20} /> Yeniden Başla
          </button>
        </motion.div>
      </div>
    );
  }

  if (!currentCase) return null;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Exam Header HUD */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
            <Activity className="text-amber-400" size={20} />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sınav İlerlemesi</span>
            <div className="text-lg font-black text-white">VAKA {currentCaseIndex + 1} <span className="text-slate-500">/ {cases.length}</span></div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-right">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-0.5">Kalan Puan</span>
            <div className="text-xl font-black text-emerald-400 flex items-center justify-end gap-1.5">
              {score} <span className="text-sm">HP</span>
            </div>
          </div>
          <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-right">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-0.5">Hata Sayısı</span>
            <div className="text-xl font-black text-red-400 flex items-center justify-end gap-1.5">
              {totalErrors} <AlertTriangle size={14} className="text-red-500/70" />
            </div>
          </div>
        </div>
      </div>

      {/* EKG Strip Display & Caliper Container */}
      <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.5)]">
        <div className="p-3.5 bg-slate-800 border-b border-slate-700 flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-3">
            <span className="text-amber-400 font-black tracking-widest text-sm">
              EKG MONİTÖRÜ
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCaliperOpen(!caliperOpen)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                caliperOpen
                  ? "bg-amber-500 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.4)]"
                  : "bg-slate-700 text-amber-400 hover:bg-slate-600"
              }`}
            >
              <Ruler size={14} /> Pergeli {caliperOpen ? "Kapat" : "Aç"}
            </button>
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
                        ? "bg-slate-800 border-amber-500 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.25)]"
                        : "bg-slate-950/60 border-slate-800/80 text-slate-500 opacity-60"
                  }`}
                >
                  <span className="font-semibold text-sm shrink-0">
                    {p.label}
                  </span>
                  <div className="flex items-center gap-2 text-right">
                    <span className="text-xs font-bold">{val as React.ReactNode}</span>
                    {isCompleted && (
                      <CheckCircle
                        size={16}
                        className="text-emerald-500 shrink-0"
                      />
                    )}
                    {isCurrent && (
                      <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
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
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-1">
                  ADIM {step + 1} / 6
                </span>
                <h4 className="text-white font-bold text-lg mb-1">
                  {step < 5
                    ? `${PARAMETERS[step].label} Nedir?`
                    : "Bu EKG'nin Nihai Tanısı Nedir?"}
                </h4>
                <p className="text-slate-400 text-xs mb-4">
                  Yukarıdaki EKG trasesini inceleyerek doğru seçeneğe tıklayın. Dikkat, hatalı seçimler puan kaybettirir!
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
                        className="text-left p-3.5 rounded-xl border border-slate-700 bg-slate-800/90 hover:bg-slate-700 hover:border-blue-500/60 text-sm font-semibold text-slate-100 transition-all active:scale-[0.99]"
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
              className="flex flex-col h-full justify-center"
            >
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/20 border-4 border-emerald-500/30 mb-4">
                  <CheckCircle size={40} className="text-emerald-400" />
                </div>
                <h4 className="font-black text-2xl text-white mb-2">
                  Tebrikler, Doğru Tanı!
                </h4>
                <div className="inline-block bg-slate-800 border border-slate-700 px-4 py-2 rounded-lg">
                  <span className="text-sm font-bold text-emerald-400">
                    {currentCase.tani}
                  </span>
                </div>
              </div>

              <button
                onClick={handleNextCase}
                className="w-full mt-auto py-4 bg-amber-500 text-slate-950 font-black uppercase tracking-wider rounded-xl hover:bg-amber-400 transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] flex justify-center items-center gap-2"
              >
                {currentCaseIndex < cases.length - 1
                  ? "Sıradaki Vakaya Geç"
                  : "Sınavı Tamamla ve Sonucu Gör"}
                <ChevronRight size={20} />
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
