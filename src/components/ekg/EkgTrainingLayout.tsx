"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SIRNAK_112_EKG_DATA, EkgModule } from "@/data/ekg-training-data";
import { Lock, Unlock, ChevronRight, Activity, Menu, X, PlayCircle } from "lucide-react";
import InteractiveWaveAnatomy from "./InteractiveWaveAnatomy";
import TreeBuilderGame from "./TreeBuilderGame";

export default function EkgTrainingLayout() {
  const [unlockedIndex, setUnlockedIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

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
    localStorage.setItem("sirnak112_ekg_progress", JSON.stringify({ unlockedIndex: newUnlocked }));
  };

  const completeActiveModule = () => {
    if (activeIndex === unlockedIndex && activeIndex < SIRNAK_112_EKG_DATA.length - 1) {
      saveProgress(activeIndex + 1);
    }
  };

  const handleNextModule = () => {
    if (activeIndex < SIRNAK_112_EKG_DATA.length - 1 && activeIndex < unlockedIndex) {
      setActiveIndex(activeIndex + 1);
    }
  };

  if (!isClient) return null;

  const activeModule = SIRNAK_112_EKG_DATA[activeIndex];
  const progressPercent = Math.round(((unlockedIndex + 1) / SIRNAK_112_EKG_DATA.length) * 100);

  const renderModuleContent = (module: EkgModule) => {
    if (module.type === "interactive-anatomy" || module.type === "interactive-wave") {
      return <InteractiveWaveAnatomy module={module} onComplete={completeActiveModule} />;
    }
    if (module.type === "tree-builder" || module.type === "summary-match") {
      return <TreeBuilderGame module={module} onComplete={completeActiveModule} />;
    }

    // Default renderer for intro, caliper-training, rhythm-simulator
    return (
      <div className="flex flex-col gap-6 w-full">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          {module.verbatimContent.headings?.map((h, i) => (
            <h3 key={i} className="text-emerald-400 font-bold text-lg mb-4 uppercase tracking-wide">
              {h}
            </h3>
          ))}
          {module.verbatimContent.bullets && module.verbatimContent.bullets.length > 0 && (
            <ul className="space-y-4">
              {module.verbatimContent.bullets.map((b, i) => (
                <li key={i} className="flex gap-3 text-slate-300 text-sm leading-relaxed">
                  <span className="text-emerald-500 mt-1">
                    <Activity size={16} />
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}
          {module.verbatimContent.notes && module.verbatimContent.notes.length > 0 && (
            <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              {module.verbatimContent.notes.map((n, i) => (
                <p key={i} className="text-emerald-100 text-xs italic mb-2 last:mb-0">{n}</p>
              ))}
            </div>
          )}
        </div>

        {/* Generic mock simulator renderer for rhythm-simulator if needed */}
        {module.type === "rhythm-simulator" && module.interactivePayload?.cases && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col items-center">
            <h4 className="text-slate-400 mb-4 text-sm font-medium">Vaka Simülasyonları Listesi</h4>
            <div className="grid grid-cols-1 gap-4 w-full">
              {module.interactivePayload.cases.map((c: any, i: number) => (
                <div key={i} className="p-4 bg-slate-900 border border-slate-700 rounded-xl flex flex-col gap-2">
                  <img src={c.stripImage} alt={c.tani} className="w-full h-auto bg-white/5 rounded" />
                  <div className="text-emerald-400 font-bold text-sm mt-2">{c.tani}</div>
                  <div className="text-slate-400 text-xs">Hız: {c.hiz} | Ritim: {c.ritim} | P: {c.pDalgasi}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Free completion for passive modules */}
        <div className="flex justify-center mt-4">
          <button
            onClick={completeActiveModule}
            disabled={activeIndex < unlockedIndex}
            className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
              activeIndex < unlockedIndex
                ? 'bg-slate-800 text-emerald-500 border border-emerald-500/30'
                : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
            }`}
          >
            {activeIndex < unlockedIndex ? 'GÖREV TAMAMLANDI' : 'OKUDUM, İLERLE'}
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-950 text-slate-200 font-sans">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Activity className="text-emerald-500" size={24} />
          <span className="font-bold tracking-wider">EKG EĞİTİMİ</span>
        </div>
        <button onClick={() => setDrawerOpen(!drawerOpen)} className="p-2 text-slate-300">
          {drawerOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Drawer / Sidebar */}
      <AnimatePresence>
        {(drawerOpen || (typeof window !== 'undefined' && window.innerWidth >= 1024)) && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className={`fixed lg:static inset-y-0 left-0 w-[280px] bg-slate-900 border-r border-slate-800 z-40 lg:z-auto flex flex-col pt-16 lg:pt-0 transform transition-transform lg:transform-none shadow-2xl lg:shadow-none`}
          >
            <div className="hidden lg:flex items-center gap-3 p-6 border-b border-slate-800">
              <Activity className="text-emerald-500" size={28} />
              <span className="font-black text-lg tracking-widest text-white">EKG EĞİTİMİ</span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {SIRNAK_112_EKG_DATA.map((mod, idx) => {
                const isUnlocked = idx <= unlockedIndex;
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
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                        : isUnlocked
                        ? "bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600"
                        : "bg-slate-900/50 border-slate-800/50 text-slate-600 cursor-not-allowed opacity-60"
                    }`}
                  >
                    <div className="shrink-0">
                      {isUnlocked ? <PlayCircle size={18} /> : <Lock size={18} />}
                    </div>
                    <div className="flex-1 text-xs font-bold leading-tight">
                      M{idx + 1}: {mod.title.split('-')[0].trim()}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-slate-800">
          <div 
            className="h-full bg-emerald-500 transition-all duration-500 ease-out shadow-[0_0_10px_#10b981]" 
            style={{ width: `${progressPercent}%` }} 
          />
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          {/* Subtle background monitor line */}
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-emerald-500/5 pointer-events-none" />
          
          <div className="max-w-3xl mx-auto space-y-6">
            <header className="mb-8">
              <span className="text-emerald-500 text-xs font-black tracking-widest uppercase mb-2 block">
                MODÜL {activeIndex + 1} / {SIRNAK_112_EKG_DATA.length}
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
                {activeModule.title}
              </h1>
            </header>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeModule.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderModuleContent(activeModule)}
              </motion.div>
            </AnimatePresence>
            
            {activeIndex < unlockedIndex && activeIndex < SIRNAK_112_EKG_DATA.length - 1 && (
              <div className="flex justify-end mt-8 pb-12">
                <button
                  onClick={handleNextModule}
                  className="px-6 py-2.5 bg-emerald-500 text-slate-950 font-bold rounded-xl flex items-center gap-2 hover:bg-emerald-400 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                >
                  Sonraki Modül <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
