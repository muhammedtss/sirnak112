"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EkgModule } from "@/data/ekg-training-data";
import { Check, Activity, Target } from "lucide-react";

interface Props {
  module: EkgModule;
  onComplete: () => void;
}

export default function TreeBuilderGame({ module, onComplete }: Props) {
  const isTree = module.type === "tree-builder";
  const isSummary = module.type === "summary-match";

  // Flatten the match pairs depending on the module
  const matchPairs = useMemo(() => {
    let pairs: { id: string, prompt: string, answer: string }[] = [];
    if (isTree && module.interactivePayload?.tachycardiaMatrix) {
      const matrix = module.interactivePayload.tachycardiaMatrix;
      Object.keys(matrix).forEach((key, idx) => {
        pairs.push({
          id: `tree-${idx}`,
          prompt: key,
          answer: (matrix[key] as string[]).join(", ")
        });
      });
    } else if (isSummary && module.interactivePayload?.fastRhythmsSummary) {
      const fast = module.interactivePayload.fastRhythmsSummary;
      fast.forEach((item: any, idx: number) => {
        pairs.push({
          id: `fast-${idx}`,
          prompt: item.feature,
          answer: item.match
        });
      });
      const slow = module.interactivePayload.slowRhythmsSummary;
      slow.forEach((item: any, idx: number) => {
        pairs.push({
          id: `slow-${idx}`,
          prompt: item.description,
          answer: item.rhythm
        });
      });
    }
    return pairs;
  }, [module, isTree, isSummary]);

  const [shuffledAnswers, setShuffledAnswers] = useState<{id: string, text: string}[]>([]);
  const [matched, setMatched] = useState<Record<string, string>>({});
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [errorPair, setErrorPair] = useState<string | null>(null);

  useEffect(() => {
    // Shuffle answers initially
    const answers = matchPairs.map(p => ({ id: p.id, text: p.answer }));
    for (let i = answers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [answers[i], answers[j]] = [answers[j], answers[i]];
    }
    setShuffledAnswers(answers);
    setMatched({});
  }, [matchPairs]);

  useEffect(() => {
    if (selectedPrompt && selectedAnswer) {
      const correctPair = matchPairs.find(p => p.id === selectedPrompt);
      if (correctPair && correctPair.answer === selectedAnswer) {
        setMatched(prev => ({ ...prev, [selectedPrompt]: selectedAnswer }));
        setSelectedPrompt(null);
        setSelectedAnswer(null);
      } else {
        // Error flash
        setErrorPair(selectedPrompt);
        setTimeout(() => {
          setErrorPair(null);
          setSelectedPrompt(null);
          setSelectedAnswer(null);
        }, 800);
      }
    }
  }, [selectedPrompt, selectedAnswer, matchPairs]);

  useEffect(() => {
    if (matchPairs.length > 0 && Object.keys(matched).length === matchPairs.length) {
      const timer = setTimeout(() => {
        onComplete();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [matched, matchPairs, onComplete]);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Verbatim Content Section */}
      {(module.verbatimContent.headings || module.verbatimContent.bullets) && (
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
      )}

      {/* Interactive Area */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6 relative overflow-hidden flex flex-col">
        {/* Grid Background */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, #10b981 1px, transparent 1px),
              linear-gradient(to bottom, #10b981 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />

        <div className="relative z-10">
          <h4 className="text-center text-slate-300 mb-6 text-sm font-medium flex items-center justify-center gap-2">
            <Target size={18} className="text-emerald-500" />
            Eşleştirme Görevi: Seçenekleri Doğru Alanlara Yerleştirin
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Prompts Column */}
            <div className="space-y-3">
              <h5 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-3">Tanımlar / Kategoriler</h5>
              {matchPairs.map((pair) => {
                const isMatched = !!matched[pair.id];
                const isSelected = selectedPrompt === pair.id;
                const isError = errorPair === pair.id;

                return (
                  <div
                    key={pair.id}
                    onClick={() => !isMatched && setSelectedPrompt(isSelected ? null : pair.id)}
                    className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-center min-h-[80px] ${
                      isMatched
                        ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400"
                        : isError
                        ? "bg-red-500/20 border-red-500 text-red-300 animate-shake"
                        : isSelected
                        ? "bg-slate-800 border-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                        : "bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500"
                    }`}
                  >
                    <div className="text-sm font-semibold mb-1">{pair.prompt}</div>
                    {isMatched && (
                      <div className="text-xs font-bold text-emerald-300 mt-1 flex items-center gap-1">
                        <Check size={14} /> {matched[pair.id]}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Answers Column */}
            <div className="space-y-3">
              <h5 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-3">Seçenekler</h5>
              <div className="flex flex-wrap gap-2">
                <AnimatePresence>
                  {shuffledAnswers.map((answer) => {
                    // check if this answer text is already matched
                    const isUsed = Object.values(matched).includes(answer.text);
                    if (isUsed) return null;

                    const isSelected = selectedAnswer === answer.text;

                    return (
                      <motion.button
                        key={answer.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        onClick={() => setSelectedAnswer(isSelected ? null : answer.text)}
                        className={`p-3 rounded-xl border-2 text-sm font-bold transition-all text-left ${
                          isSelected
                            ? "bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.6)] scale-105"
                            : "bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700"
                        }`}
                      >
                        {answer.text}
                      </motion.button>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          </div>
          
          {Object.keys(matched).length === matchPairs.length && matchPairs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 text-center text-emerald-400 font-bold bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/30"
            >
              Tebrikler! Tüm eşleştirmeleri doğru yaptınız.
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
