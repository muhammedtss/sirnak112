"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SIRNAK_112_EKG_DATA, EkgModule } from "@/data/ekg-training-data";
import {
  Lock,
  ChevronRight,
  Activity,
  Menu,
  X,
  PlayCircle,
  CheckCircle2,
  Ruler,
  RotateCcw,
} from "lucide-react";
import EkgExamSimulator from "./EkgExamSimulator";
import EkgGuidedEducation from "./EkgGuidedEducation";

export default function EkgTrainingLayout() {
  const [activeTab, setActiveTab] = useState<"training" | "exam">("training");


  // Sidebar rendering and legacy states removed since Guided Education incorporates everything in one scrollable page.


  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-200 font-sans">
      <div className="flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Activity className="text-emerald-500" size={22} />
          <span className="font-bold tracking-wider text-sm">
            ŞIRNAK 112 - İNTERAKTİF EKG EĞİTİM VE SINAV SİSTEMİ
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 md:p-8 relative">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Tab Switcher */}
            <div className="flex items-center gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl w-full">
              <button
                onClick={() => setActiveTab("training")}
                className={`flex-1 flex justify-center py-3.5 px-2 rounded-xl text-sm sm:text-base font-black tracking-wide transition-all ${
                  activeTab === "training"
                    ? "bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                📚 İnteraktif Eğitim Modu
              </button>
              <button
                onClick={() => setActiveTab("exam")}
                className={`flex-1 flex justify-center py-3.5 px-2 rounded-xl text-sm sm:text-base font-black tracking-wide transition-all ${
                  activeTab === "exam"
                    ? "bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                🏆 Vaka Sınavı Modu
              </button>
            </div>

            {activeTab === "training" ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key="guided-education"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                >
                  <EkgGuidedEducation onGoToExam={() => { setActiveTab("exam"); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
                </motion.div>
              </AnimatePresence>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key="exam-mode"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                >
                  <EkgExamSimulator />
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
