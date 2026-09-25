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
import InteractiveWaveAnatomy from "./InteractiveWaveAnatomy";
import TreeBuilderGame from "./TreeBuilderGame";
import RhythmSimulator from "./RhythmSimulator";
import DigitalCaliper from "./DigitalCaliper";

export default function EkgTrainingLayout() {
  const [unlockedIndex, setUnlockedIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [caliperDemoOpen, setCaliperDemoOpen] = useState(true);

  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem("sirnak112_ekg_progress");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (typeof parsed.unlockedIndex === "number") {
          setUnlockedIndex(parsed.unlockedIndex);
          setActiveIndex(parsed.unlockedIndex);
        }
      } catch (e) {
        console.error("Progress load error", e);
      }
    }
  }, []);

  const saveProgress = (newUnlocked: number) => {
    setUnlockedIndex(newUnlocked);
    localStorage.setItem(
      "sirnak112_ekg_progress",
      JSON.stringify({ unlockedIndex: newUnlocked }),
    );
  };

  const completeActiveModule = () => {
    if (activeIndex < SIRNAK_112_EKG_DATA.length - 1) {
      const nextIdx = activeIndex + 1;
      if (nextIdx > unlockedIndex) {
        saveProgress(nextIdx);
      }
      setActiveIndex(nextIdx);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      saveProgress(SIRNAK_112_EKG_DATA.length - 1);
    }
  };

  const resetProgress = () => {
    if (confirm("Eğitim ilerlemenizi sıfırlamak istediğinize emin misiniz?")) {
      localStorage.removeItem("sirnak112_ekg_progress");
      setUnlockedIndex(0);
      setActiveIndex(0);
      setDrawerOpen(false);
    }
  };

  if (!isClient) return null;

  const activeModule = SIRNAK_112_EKG_DATA[activeIndex];
  const progressPercent = Math.round(
    ((unlockedIndex + 1) / SIRNAK_112_EKG_DATA.length) * 100,
  );

  const renderSidebarList = () => (
    <>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {SIRNAK_112_EKG_DATA.map((mod, idx) => {
          const isUnlocked = idx <= unlockedIndex;
          const isCompleted = idx < unlockedIndex;
          const isActive = idx === activeIndex;

          return (
            <button
              key={mod.id}
              disabled={!isUnlocked}
              onClick={() => {
                setActiveIndex(idx);
                setDrawerOpen(false);
              }}
              className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all border ${
                isActive
                  ? "bg-emerald-500/15 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                  : isUnlocked
                    ? "bg-slate-800/50 border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:border-slate-600"
                    : "bg-slate-900/40 border-slate-800/50 text-slate-600 cursor-not-allowed opacity-50"
              }`}
            >
              <div className="shrink-0">
                {isCompleted ? (
                  <CheckCircle2 size={18} className="text-emerald-500" />
                ) : isUnlocked ? (
                  <PlayCircle size={18} className="text-emerald-400" />
                ) : (
                  <Lock size={18} />
                )}
              </div>
              <div className="flex-1 text-xs font-bold leading-snug">
                M{idx + 1}: {mod.title}
              </div>
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={resetProgress}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold text-slate-400 hover:text-red-400 hover:bg-slate-800/60 transition-colors"
        >
          <RotateCcw size={14} /> İlerlemeyi Sıfırla
        </button>
      </div>
    </>
  );

  const renderModuleContent = (module: EkgModule) => {
    if (
      module.type === "interactive-anatomy" ||
      module.type === "interactive-wave"
    ) {
      return (
        <InteractiveWaveAnatomy
          module={module}
          onComplete={completeActiveModule}
        />
      );
    }
    if (module.type === "tree-builder" || module.type === "summary-match") {
      return (
        <TreeBuilderGame module={module} onComplete={completeActiveModule} />
      );
    }
    if (module.type === "rhythm-simulator") {
      return (
        <RhythmSimulator module={module} onComplete={completeActiveModule} />
      );
    }

    // Default renderer for 'intro' & 'caliper-training'
    return (
      <div className="flex flex-col gap-6 w-full">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          {module.verbatimContent.headings?.map((h, i) => (
            <h3
              key={i}
              className="text-emerald-400 font-bold text-lg mb-4 uppercase tracking-wide"
            >
              {h}
            </h3>
          ))}
          {module.verbatimContent.bullets &&
            module.verbatimContent.bullets.length > 0 && (
              <ul className="space-y-3.5">
                {module.verbatimContent.bullets.map((b, i) => (
                  <li
                    key={i}
                    className="flex gap-3 text-slate-200 text-sm leading-relaxed"
                  >
                    <span className="text-emerald-500 mt-1 shrink-0">
                      <Activity size={16} />
                    </span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}
          {module.verbatimContent.notes &&
            module.verbatimContent.notes.length > 0 && (
              <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                {module.verbatimContent.notes.map((n, i) => (
                  <p
                    key={i}
                    className="text-emerald-100 text-xs sm:text-sm leading-relaxed mb-2 last:mb-0"
                  >
                    {n}
                  </p>
                ))}
              </div>
            )}
        </div>

        {module.type === "caliper-training" && (
          <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            <div className="p-4 bg-slate-800 border-b border-slate-700 flex flex-wrap justify-between items-center gap-2">
              <div>
                <h4 className="text-white font-bold uppercase text-sm">
                  İnteraktif Kalp Hızı Ölçüm Aracı (Pergel Eğitimi)
                </h4>
                <p className="text-slate-400 text-xs">
                  R1 ve R2 bacaklarını iki R dalgası arasına sürükleyerek hızı
                  ölçün.
                </p>
              </div>
              <button
                onClick={() => setCaliperDemoOpen(!caliperDemoOpen)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  caliperDemoOpen
                    ? "bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    : "bg-slate-700 text-emerald-400 hover:bg-slate-600"
                }`}
              >
                <Ruler size={16} /> Pergeli {caliperDemoOpen ? "Kapat" : "Aç"}
              </button>
            </div>

            <div className="w-full relative bg-white overflow-x-auto">
              <div className="min-w-[700px] w-full relative">
                {/* Örnek Trase Arka Planı */}
                <div
                  className="w-full h-[260px] sm:h-[300px] flex items-center justify-center p-2"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, rgba(239,68,68,0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(239,68,68,0.18) 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                    backgroundColor: "#fff8f8",
                  }}
                >
                  <img
                    src="/ekg/slide-17.png"
                    alt="Örnek EKG Trasesi"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                    className="max-h-full w-full object-contain pointer-events-none select-none"
                  />
                </div>

                {/* Pergel Katmanı */}
                {caliperDemoOpen && (
                  <div className="absolute inset-0 z-10">
                    <DigitalCaliper onClose={() => setCaliperDemoOpen(false)} />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end mt-4 pb-32">
          <button
            onClick={completeActiveModule}
            className="px-8 py-3.5 rounded-xl font-black uppercase tracking-wider flex items-center gap-2 transition-all bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
          >
            {activeIndex < unlockedIndex
              ? "Sonraki Modüle Geç"
              : "Tamamla ve Devam Et"}
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-950 text-slate-200 font-sans">
      {/* Mobile Header (z-40) */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Activity className="text-emerald-500" size={22} />
          <span className="font-bold tracking-wider text-sm">
            ŞIRNAK 112 - EKG EĞİTİMİ
          </span>
        </div>
        <button
          onClick={() => setDrawerOpen(!drawerOpen)}
          className="p-2 text-slate-300 hover:text-white rounded-lg bg-slate-800"
        >
          {drawerOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Desktop Static Sidebar */}
      <aside className="hidden lg:flex w-[300px] shrink-0 bg-slate-900 border-r border-slate-800 flex-col h-screen sticky top-0">
        <div className="flex items-center gap-3 p-6 border-b border-slate-800">
          <Activity className="text-emerald-500 shrink-0" size={28} />
          <div>
            <span className="font-black text-base tracking-widest text-white block">
              TEMEL EKG
            </span>
            <span className="text-[11px] text-emerald-400 font-semibold">
              Şırnak 112 İnteraktif Eğitim
            </span>
          </div>
        </div>
        {renderSidebarList()}
      </aside>

      {/* Mobile Drawer & Backdrop (z-50 -> Pergelin üstünde!) */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed inset-y-0 left-0 w-[280px] bg-slate-900 border-r border-slate-800 z-50 flex flex-col lg:hidden shadow-2xl"
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Activity className="text-emerald-500" size={22} />
                  <span className="font-black text-sm tracking-wider text-white">
                    MODÜLLER
                  </span>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
              {renderSidebarList()}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Progress Bar */}
        <div className="h-1.5 w-full bg-slate-800 sticky top-[57px] lg:top-0 z-30">
          <div
            className="h-full bg-emerald-500 transition-all duration-500 ease-out shadow-[0_0_10px_#10b981]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <main className="flex-1 p-4 md:p-8 relative">
          <div className="max-w-4xl mx-auto space-y-6">
            <header className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-emerald-500 text-xs font-black tracking-widest uppercase">
                  MODÜL {activeIndex + 1} / {SIRNAK_112_EKG_DATA.length} (SLAYT{" "}
                  {activeModule.slideNumbers.join(", ")})
                </span>
                <span className="text-xs font-bold text-slate-400">
                  Genel İlerleme: %{progressPercent}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
                {activeModule.title}
              </h1>
            </header>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeModule.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                {renderModuleContent(activeModule)}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
