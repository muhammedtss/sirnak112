"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EkgModule } from "@/data/ekg-training-data";
import { CheckCircle, Info, ChevronRight, Activity } from "lucide-react";

interface Props {
  module: EkgModule;
  onComplete: () => void;
}

export default function InteractiveWaveAnatomy({ module, onComplete }: Props) {
  const isAnatomy = module.type === "interactive-anatomy";
  const isWave = module.type === "interactive-wave";

  // For Anatomy
  const sequence = module.interactivePayload?.correctConductionSequence || [];
  const [currentStep, setCurrentStep] = useState(0);

  // For Wave
  const hotspots = module.interactivePayload?.waveHotspots || [];
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [visitedHotspots, setVisitedHotspots] = useState<Set<string>>(new Set());

  // Check completion
  useEffect(() => {
    if (isAnatomy && sequence.length > 0) {
      if (currentStep >= sequence.length) {
        onComplete();
      }
    }
  }, [currentStep, isAnatomy, sequence, onComplete]);

  useEffect(() => {
    if (isWave && hotspots.length > 0) {
      if (visitedHotspots.size === hotspots.length) {
        const timer = setTimeout(() => {
          onComplete();
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [visitedHotspots, isWave, hotspots, onComplete]);

  const handleNextAnatomy = () => {
    if (currentStep < sequence.length) {
      setCurrentStep((s) => s + 1);
    }
  };

  const handleHotspotClick = (id: string) => {
    setActiveHotspot(id);
    setVisitedHotspots((prev) => new Set(prev).add(id));
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Verbatim Content Section */}
      <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-5 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
        {module.verbatimContent.headings?.map((h, i) => (
          <h3 key={i} className="text-emerald-400 font-bold text-lg mb-3 uppercase tracking-wide">
            {h}
          </h3>
        ))}
        {module.verbatimContent.bullets && module.verbatimContent.bullets.length > 0 && (
          <ul className="space-y-3">
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
      </div>

      {/* Interactive Area */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[300px]">
        {/* ECG Grid Background */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, #ef4444 1px, transparent 1px),
              linear-gradient(to bottom, #ef4444 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />

        {isAnatomy && (
          <div className="relative z-10 w-full max-w-md">
            <h4 className="text-center text-slate-400 mb-6 text-sm font-medium">Kalbin İleti Sistemi Adımları</h4>
            <div className="space-y-4">
              {sequence.map((step: string, index: number) => {
                const isRevealed = index < currentStep;
                const isCurrent = index === currentStep;
                const isFuture = index > currentStep;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: isFuture ? 0 : 1, x: isFuture ? -20 : 0, display: isFuture ? "none" : "flex" }}
                    className={`items-center p-4 rounded-xl border transition-all ${
                      isRevealed 
                        ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
                        : isCurrent
                        ? 'bg-slate-800 border-slate-600 text-slate-300 cursor-pointer hover:bg-slate-700 shadow-[0_0_10px_rgba(255,255,255,0.1)]'
                        : ''
                    }`}
                    onClick={() => isCurrent && handleNextAnatomy()}
                  >
                    <div className="flex-1 font-semibold">{step}</div>
                    {isRevealed && <CheckCircle size={20} className="text-emerald-500" />}
                    {isCurrent && (
                      <div className="flex items-center text-xs animate-pulse text-slate-400">
                        Tıkla <ChevronRight size={16} />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
            {currentStep >= sequence.length && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 text-center text-emerald-400 font-bold bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/30"
              >
                İleti Sistemi Tamamlandı!
              </motion.div>
            )}
          </div>
        )}

        {isWave && (
          <div className="relative z-10 w-full">
            <h4 className="text-center text-slate-400 mb-6 text-sm font-medium">EKG Dalgalarını Keşfetmek İçin Tıklayın</h4>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {hotspots.map((spot: any) => {
                const isVisited = visitedHotspots.has(spot.id);
                const isActive = activeHotspot === spot.id;

                return (
                  <button
                    key={spot.id}
                    onClick={() => handleHotspotClick(spot.id)}
                    className={`px-5 py-3 rounded-xl font-bold transition-all text-sm border-2 ${
                      isActive 
                        ? 'bg-emerald-500 text-slate-950 border-emerald-500 scale-105 shadow-[0_0_15px_rgba(16,185,129,0.5)]' 
                        : isVisited 
                        ? 'bg-slate-800 text-emerald-400 border-emerald-500/30' 
                        : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    {spot.label}
                  </button>
                );
              })}
            </div>

            <div className="h-[120px]">
              <AnimatePresence mode="wait">
                {activeHotspot && (
                  <motion.div
                    key={activeHotspot}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-xl p-5"
                  >
                    {(() => {
                      const spot = hotspots.find((h: any) => h.id === activeHotspot);
                      return (
                        <div className="flex gap-4 items-start">
                          <div className="text-emerald-500 mt-1">
                            <Info size={24} />
                          </div>
                          <div>
                            <h5 className="font-bold text-white text-lg mb-1">{spot?.label}</h5>
                            <p className="text-slate-300 text-sm leading-relaxed">{spot?.description}</p>
                          </div>
                        </div>
                      );
                    })()}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {visitedHotspots.size === hotspots.length && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-center text-emerald-400 text-sm font-medium"
              >
                Tüm dalgalar incelendi.
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
