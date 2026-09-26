"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SIRNAK_112_EKG_DATA, RhythmAnalysisData } from "@/data/ekg-training-data";
import { 
  Play, BookOpen, Activity, Zap, Heart, Search, Ruler, ChevronDown, ChevronRight, Stethoscope, Scale, Maximize2, X
} from "lucide-react";
import DigitalCaliper from "./DigitalCaliper";

export default function EkgGuidedEducation({ onGoToExam }: { onGoToExam: () => void }) {
  
  // -- Data Extraction --
  const mod2 = SIRNAK_112_EKG_DATA.find(m => m.id === "mod-2-ileti-sistemi")!;
  const mod3 = SIRNAK_112_EKG_DATA.find(m => m.id === "mod-3-ekg-kagidi-ve-dalgalar")!;
  const mod4 = SIRNAK_112_EKG_DATA.find(m => m.id === "mod-4-degerlendirme-ve-nsr")!;
  const mod5 = SIRNAK_112_EKG_DATA.find(m => m.id === "mod-5-aritmi-siniflandirma")!;
  const mod6 = SIRNAK_112_EKG_DATA.find(m => m.id === "mod-6-hizli-ritim-vakalari")!;
  const mod7 = SIRNAK_112_EKG_DATA.find(m => m.id === "mod-7-yavas-ritim-vakalari")!;
  const mod8 = SIRNAK_112_EKG_DATA.find(m => m.id === "mod-8-ozet-eslestirme")!;

  const allCases = [...(mod6.interactivePayload?.cases || []), ...(mod7.interactivePayload?.cases || [])];

  // -- Faz 1 States --
  const [activeNodeIdx, setActiveNodeIdx] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeWave, setActiveWave] = useState<string | null>(null);

  const conductionSequence = mod2.interactivePayload.correctConductionSequence;

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setActiveNodeIdx(prev => {
          if (prev >= conductionSequence.length - 1) {
            setIsPlaying(false);
            return -1;
          }
          return prev + 1;
        });
      }, 1500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, conductionSequence.length]);

  // -- Faz 2 States --
  const [bigBoxes, setBigBoxes] = useState(3);
  const rate = Math.round(300 / bigBoxes);

  // -- Faz 3 States --
  const [selectedCaseIdx, setSelectedCaseIdx] = useState<number>(0);
  const [selectedCaseIdx2, setSelectedCaseIdx2] = useState<number>(1);
  const [vsModeActive, setVsModeActive] = useState(false);
  const [revealedSteps, setRevealedSteps] = useState<Record<number, boolean>>({});
  const [caliperOpen, setCaliperOpen] = useState(false);
  const [caliperOpen2, setCaliperOpen2] = useState(false); // For vs mode trace 2
  const [fullScreenMode, setFullScreenMode] = useState<number | null>(null); // null, 1 (trace 1), 2 (trace 2)
  
  const selectedCase = allCases[selectedCaseIdx];
  const selectedCase2 = allCases[selectedCaseIdx2];
  const faz3Ref = useRef<HTMLDivElement>(null);

  const handleCaseSelect = (idx: number) => {
    setSelectedCaseIdx(idx);
    setRevealedSteps({});
    setCaliperOpen(false);
    if (!vsModeActive) {
      faz3Ref.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getNotesForCase = (c: any) => {
    if (!c) return [];
    const taniUpper = c.tani.toUpperCase();
    const allNotes = [...(mod6.verbatimContent.notes || []), ...(mod7.verbatimContent.notes || []), ...(mod4.verbatimContent.notes || [])];
    
    if (taniUpper.includes("SVT")) return allNotes.filter(n => n.includes("PSVT") || n.includes("AVNRT"));
    if (taniUpper.includes("FİBRİLASYON") && !taniUpper.includes("DAL")) return allNotes.filter(n => n.includes("Atriyal Fibrilasyon"));
    if (taniUpper.includes("DAL BLOĞU") || taniUpper.includes("WPW") || taniUpper.includes("POLİMORFİK")) return allNotes.filter(n => n.includes("Dal Blokları") || n.includes("WPW"));
    if (taniUpper.includes("SİNÜS RİTMİ") || taniUpper.includes("BRADİKARDİSİ")) return allNotes.filter(n => n.includes("NORMAL SİNÜS RİTMİ"));
    return [];
  };

  const currentNotes = getNotesForCase(selectedCase);

  const STEPS = [
    { key: "ritim", label: "1. Ritim Analizi" },
    { key: "hiz", label: "2. Hız Analizi" },
    { key: "pDalgasi", label: "3. P Dalgası" },
    { key: "pQrsIliskisi", label: "4. P-QRS İlişkisi" },
    { key: "qrsGenisligi", label: "5. QRS Genişliği" },
  ];

  return (
    <div className="space-y-12 pb-20">
      
      {/* FAZ 1 */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-500/30">
            <Heart className="text-blue-400" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Faz 1: Görsel Kalp İleti Sistemi ve Dalga Rehberi</h2>
            <p className="text-slate-400 text-sm font-medium">Kalbin elektriksel yolculuğunu ve EKG dalgalarının anlamını keşfedin.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* İleti Sistemi */}
          <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800">
            <h3 className="text-lg font-bold text-white mb-4">Kalbin İleti Sistemi</h3>
            <button 
              onClick={() => { setIsPlaying(true); setActiveNodeIdx(0); }}
              disabled={isPlaying}
              className="mb-6 w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Zap size={18} /> {isPlaying ? "İleti Sistemi Çalışıyor..." : "İleti Sistemini Çalıştır"}
            </button>
            <div className="space-y-3 relative">
              <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-800 z-0" />
              {conductionSequence.map((node: string, idx: number) => {
                const isActive = activeNodeIdx >= idx;
                const isCurrent = activeNodeIdx === idx;
                return (
                  <div key={idx} className="relative z-10 flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${isCurrent ? 'bg-blue-500 border-blue-400 shadow-[0_0_15px_#3b82f6]' : isActive ? 'bg-emerald-500 border-emerald-400' : 'bg-slate-900 border-slate-700'}`}>
                      <span className="text-xs font-bold text-white">{idx + 1}</span>
                    </div>
                    <div className={`flex-1 p-3 rounded-xl border transition-all duration-500 ${isCurrent ? 'bg-blue-500/20 border-blue-500 text-blue-300' : isActive ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                      <span className="font-bold">{node}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* EKG Dalgaları */}
          <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 flex flex-col">
            <h3 className="text-lg font-bold text-white mb-4">EKG Dalga Rehberi</h3>
            <div className="flex-1 flex flex-col gap-4">
              {mod3.interactivePayload.waveHotspots.map((wave: any) => (
                <div 
                  key={wave.id} 
                  onClick={() => setActiveWave(wave.id)}
                  className={`cursor-pointer p-4 rounded-xl border transition-all ${activeWave === wave.id ? 'bg-emerald-500/20 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-slate-900 border-slate-800 hover:border-slate-600'}`}
                >
                  <h4 className={`font-black text-lg mb-1 ${activeWave === wave.id ? 'text-emerald-400' : 'text-slate-300'}`}>{wave.label}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">{wave.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAZ 2 */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
          <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center border border-purple-500/30">
            <Activity className="text-purple-400" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Faz 2: Adım Adım Hız ve Ritim Hesaplama Atölyesi</h2>
            <p className="text-slate-400 text-sm font-medium">Büyük kare hesabı (300 / Büyük Kare Sayısı) mantığını pratik edin.</p>
          </div>
        </div>
        
        <div className="bg-slate-950 rounded-2xl p-6 md:p-10 border border-slate-800 text-center">
          <div className="mb-10">
            <h3 className="text-6xl font-black text-white mb-2">{rate} <span className="text-2xl text-slate-500">atım/dk</span></h3>
            <p className="text-purple-400 font-bold text-lg">300 / {bigBoxes} Büyük Kare</p>
          </div>
          
          <div className="relative h-32 w-full max-w-2xl mx-auto bg-slate-900 rounded-xl border border-slate-700 overflow-hidden mb-10 flex items-center justify-center">
            {/* Grid background */}
            <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
            
            {/* R Waves */}
            <div className="relative h-full flex items-center transition-all duration-300" style={{ width: `${bigBoxes * 40}px` }}>
              <div className="absolute left-0 bottom-4 w-1 h-24 bg-emerald-500 shadow-[0_0_10px_#10b981]" />
              <div className="absolute right-0 bottom-4 w-1 h-24 bg-emerald-500 shadow-[0_0_10px_#10b981]" />
              
              {/* Connection line */}
              <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-slate-600 flex items-center justify-center">
                <span className="bg-slate-900 px-2 text-xs font-bold text-slate-300">{bigBoxes} Kare</span>
              </div>
            </div>
          </div>

          <div className="max-w-xl mx-auto">
            <label className="text-sm font-bold text-slate-400 mb-4 block">R-R Arası Büyük Kare Sayısını Değiştirin:</label>
            <input 
              type="range" 
              min="1" max="9" 
              value={bigBoxes} 
              onChange={e => setBigBoxes(parseInt(e.target.value))}
              className="w-full accent-purple-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between mt-2 text-xs text-slate-500 font-bold px-1">
              <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAZ 3 */}
      <section ref={faz3Ref} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
          <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center border border-amber-500/30">
            <BookOpen className="text-amber-400" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Faz 3: İnteraktif Ritim Atlası ve Eğitmen Rehberi</h2>
            <p className="text-slate-400 text-sm font-medium">Tüm EKG vakalarını adım adım rehber eşliğinde inceleyin.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Ritim Katalogu</h3>
            <p className="text-xs text-slate-400">İncelemek istediğiniz vakayı seçin veya kıyaslama modunu açın.</p>
          </div>
          <button
            onClick={() => setVsModeActive(!vsModeActive)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all ${vsModeActive ? 'bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 'bg-slate-800 text-amber-400 hover:bg-slate-700 border border-amber-500/30'}`}
          >
            <Scale size={18} /> {vsModeActive ? "VS Modunu Kapat" : "İki Ritmi Karşılaştır (VS Modu)"}
          </button>
        </div>

        {vsModeActive ? (
          <div className="mb-8 p-5 bg-slate-950 border border-amber-500/30 rounded-2xl shadow-inner">
            <h4 className="text-amber-400 font-bold mb-4 uppercase text-sm">Karşılaştırılacak Ritimleri Seçin</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-emerald-400 block mb-1">1. Ritim</label>
                <select 
                  value={selectedCaseIdx} 
                  onChange={e => setSelectedCaseIdx(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-3 outline-none focus:border-emerald-500"
                >
                  {allCases.map((c: any, i: number) => <option key={i} value={i}>{c.tani}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-blue-400 block mb-1">2. Ritim</label>
                <select 
                  value={selectedCaseIdx2} 
                  onChange={e => setSelectedCaseIdx2(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-3 outline-none focus:border-blue-500"
                >
                  {allCases.map((c: any, i: number) => <option key={i} value={i}>{c.tani}</option>)}
                </select>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-8 flex flex-wrap gap-2">
            {allCases.map((c: any, i: number) => (
              <button 
                key={i}
                onClick={() => handleCaseSelect(i)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${selectedCaseIdx === i ? 'bg-amber-500 text-slate-950 shadow-[0_0_10px_rgba(245,158,11,0.4)]' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'}`}
              >
                {c.tani}
              </button>
            ))}
          </div>
        )}

        {/* Selected Case Area */}
        {vsModeActive ? (
          <div className="space-y-8">
            {/* Traces */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Rhythm 1 Trace */}
              <div className="bg-slate-950 rounded-2xl overflow-hidden border border-emerald-500/30">
                <div className="p-3 bg-emerald-500/10 border-b border-emerald-500/30 flex justify-between items-center">
                  <span className="font-bold text-emerald-400 text-sm uppercase">{selectedCase?.tani}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCaliperOpen(!caliperOpen)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${caliperOpen ? "bg-emerald-500 text-slate-950" : "bg-slate-800 text-emerald-400 hover:bg-slate-700"}`}
                    >
                      <Ruler size={12} /> Pergeli {caliperOpen ? "Kapat" : "Aç"}
                    </button>
                    <button onClick={() => setFullScreenMode(1)} className="p-1 rounded-lg bg-slate-800 text-blue-400 hover:bg-slate-700"><Maximize2 size={14}/></button>
                  </div>
                </div>
                {caliperOpen ? (
                  <DigitalCaliper onClose={() => setCaliperOpen(false)}>
                    {selectedCase?.stripImage && <img src={selectedCase.stripImage} alt="EKG 1" className="max-h-full max-w-none object-contain pointer-events-none select-none z-10" />}
                  </DigitalCaliper>
                ) : (
                  <div className="w-full relative bg-white p-2 flex justify-center min-h-[180px] overflow-x-auto">
                    {selectedCase?.stripImage && <img src={selectedCase.stripImage} alt="EKG 1" className="max-h-full max-w-none object-contain pointer-events-none select-none z-10" />}
                  </div>
                )}
              </div>

              {/* Rhythm 2 Trace */}
              <div className="bg-slate-950 rounded-2xl overflow-hidden border border-blue-500/30">
                <div className="p-3 bg-blue-500/10 border-b border-blue-500/30 flex justify-between items-center">
                  <span className="font-bold text-blue-400 text-sm uppercase">{selectedCase2?.tani}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCaliperOpen2(!caliperOpen2)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${caliperOpen2 ? "bg-blue-500 text-slate-950" : "bg-slate-800 text-blue-400 hover:bg-slate-700"}`}
                    >
                      <Ruler size={12} /> Pergeli {caliperOpen2 ? "Kapat" : "Aç"}
                    </button>
                    <button onClick={() => setFullScreenMode(2)} className="p-1 rounded-lg bg-slate-800 text-blue-400 hover:bg-slate-700"><Maximize2 size={14}/></button>
                  </div>
                </div>
                {caliperOpen2 ? (
                  <DigitalCaliper onClose={() => setCaliperOpen2(false)}>
                    {selectedCase2?.stripImage && <img src={selectedCase2.stripImage} alt="EKG 2" className="max-h-full max-w-none object-contain pointer-events-none select-none z-10" />}
                  </DigitalCaliper>
                ) : (
                  <div className="w-full relative bg-white p-2 flex justify-center min-h-[180px] overflow-x-auto">
                    {selectedCase2?.stripImage && <img src={selectedCase2.stripImage} alt="EKG 2" className="max-h-full max-w-none object-contain pointer-events-none select-none z-10" />}
                  </div>
                )}
              </div>
            </div>

            {/* Comparison Table */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 border-b border-slate-700">
                    <th className="p-4 text-sm font-black text-slate-400 w-1/4">Parametre</th>
                    <th className="p-4 text-sm font-black text-emerald-400 w-[37.5%]">{selectedCase?.tani}</th>
                    <th className="p-4 text-sm font-black text-blue-400 w-[37.5%]">{selectedCase2?.tani}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {STEPS.map((step) => {
                    const val1 = String(selectedCase?.[step.key as keyof RhythmAnalysisData] || "-");
                    const val2 = String(selectedCase2?.[step.key as keyof RhythmAnalysisData] || "-");
                    const isDifferent = val1 !== val2;

                    return (
                      <tr key={step.key} className={isDifferent ? "bg-amber-500/5" : ""}>
                        <td className={`p-4 font-bold text-sm ${isDifferent ? "text-amber-400" : "text-slate-300"}`}>
                          {step.label}
                        </td>
                        <td className={`p-4 text-sm ${isDifferent ? "text-amber-300 font-bold" : "text-slate-400"}`}>
                          {val1}
                        </td>
                        <td className={`p-4 text-sm ${isDifferent ? "text-amber-300 font-bold" : "text-slate-400"}`}>
                          {val2}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="p-3 bg-slate-900 text-xs text-slate-500 text-center border-t border-slate-800">
                Farklı olan parametreler <span className="text-amber-400 font-bold">sarı renkle</span> vurgulanmıştır.
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800">
                <div className="p-3 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
                  <span className="font-bold text-amber-400 text-sm uppercase">{selectedCase?.tani}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCaliperOpen(!caliperOpen)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${caliperOpen ? "bg-amber-500 text-slate-950" : "bg-slate-800 text-amber-400 hover:bg-slate-700"}`}
                    >
                      <Ruler size={14} /> Pergeli {caliperOpen ? "Kapat" : "Aç"}
                    </button>
                    <button onClick={() => setFullScreenMode(1)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all bg-slate-800 text-blue-400 hover:bg-slate-700">
                      <Maximize2 size={14} /> <span className="hidden sm:inline">Tam Ekran</span>
                    </button>
                  </div>
                </div>
                {caliperOpen ? (
                  <DigitalCaliper onClose={() => setCaliperOpen(false)}>
                    {selectedCase?.stripImage && <img src={selectedCase.stripImage} alt="EKG" className="max-h-full max-w-none object-contain pointer-events-none select-none z-10" />}
                  </DigitalCaliper>
                ) : (
                  <div className="w-full relative bg-white p-2 flex justify-center min-h-[250px] overflow-x-auto">
                    {selectedCase?.stripImage && <img src={selectedCase.stripImage} alt="EKG" className="max-h-full max-w-none object-contain pointer-events-none select-none z-10" />}
                  </div>
                )}
              </div>

              {currentNotes.length > 0 && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5">
                  <h4 className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase mb-3">
                    <Stethoscope size={18} /> Klinik Mekanizma
                  </h4>
                  <div className="space-y-3">
                    {currentNotes.map((note: string, i: number) => (
                      <p key={i} className="text-emerald-100/90 text-sm leading-relaxed">{note}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
              <h4 className="text-white font-bold mb-6 text-lg border-b border-slate-800 pb-3">5 Adımlı Eğitmen Rehberi</h4>
              <div className="space-y-4">
                {STEPS.map((step, i) => {
                  const isRevealed = revealedSteps[i];
                  const answer = selectedCase?.[step.key as keyof RhythmAnalysisData];
                  return (
                    <div key={step.key} className="relative">
                      <button 
                        onClick={() => setRevealedSteps(s => ({...s, [i]: true}))}
                        className={`w-full text-left p-4 rounded-xl border transition-all ${isRevealed ? 'bg-amber-500/10 border-amber-500/40' : 'bg-slate-900 border-slate-700 hover:border-slate-500'}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`font-bold ${isRevealed ? 'text-amber-400' : 'text-slate-300'}`}>{step.label}</span>
                          {!isRevealed && <ChevronDown size={18} className="text-slate-500" />}
                        </div>
                        
                        <AnimatePresence>
                          {isRevealed && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              className="mt-3 pt-3 border-t border-amber-500/20"
                            >
                              <p className="text-white font-medium mb-2"><span className="text-slate-400 text-xs uppercase tracking-wider block mb-1">Durum:</span> {String(answer)}</p>
                              <p className="text-slate-400 text-sm bg-black/20 p-3 rounded-lg border border-white/5"><span className="text-amber-500 font-bold">Eğitmen Notu:</span> Bu ritimde {step.label.toLowerCase()} değerlendirildiğinde '{String(answer)}' olduğu görülmektedir. Trase üzerindeki özellikleri inceleyiniz.</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* FAZ 4 */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-8 border-b border-slate-800 pb-4">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-500/30">
            <Search className="text-emerald-400" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Faz 4: İnteraktif Sınıflandırma Tabloları</h2>
            <p className="text-slate-400 text-sm font-medium">Algoritmalar ve ritim özetleri. Ritme tıklayarak doğrudan inceleyin.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Taşikardi Ağacı */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-red-400 mb-4 border-b border-red-500/20 pb-2">Taşikardi Sınıflandırması</h3>
            {Object.entries(mod5.interactivePayload.tachycardiaMatrix).map(([cat, rhythms]) => (
              <div key={cat} className="mb-4 last:mb-0">
                <h4 className="text-xs font-black text-slate-500 mb-2">{cat}</h4>
                <div className="flex flex-wrap gap-2">
                  {(rhythms as string[]).map(r => {
                    const matchIdx = allCases.findIndex((c: any) => c.tani.toUpperCase().includes(r.toUpperCase()) || r.toUpperCase().includes(c.tani.toUpperCase()));
                    return (
                      <button 
                        key={r}
                        onClick={() => {
                          if(matchIdx >= 0) handleCaseSelect(matchIdx);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${matchIdx >= 0 ? 'bg-slate-800 text-white hover:bg-amber-500 hover:text-black border border-slate-700' : 'bg-slate-900 text-slate-500 border border-slate-800 cursor-default'}`}
                      >
                        {r}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Bradikardi ve Özetler */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-blue-400 mb-4 border-b border-blue-500/20 pb-2">Bradikardi ve Bloklar</h3>
            <div className="space-y-3">
              {mod8.interactivePayload.slowRhythmsSummary.map((item: any, i: number) => {
                const matchIdx = allCases.findIndex((c: any) => c.tani.toUpperCase().includes(item.rhythm.toUpperCase()));
                return (
                  <div key={i} className="flex flex-col p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <button 
                      onClick={() => { if(matchIdx >= 0) handleCaseSelect(matchIdx); }}
                      className={`text-left font-bold text-sm mb-1 transition-colors ${matchIdx >= 0 ? 'text-white hover:text-amber-400' : 'text-slate-300'}`}
                    >
                      {item.rhythm}
                    </button>
                    <span className="text-xs text-slate-500">{item.description}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-8 border-t border-slate-800">
          <button 
            onClick={onGoToExam}
            className="group px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black uppercase tracking-widest text-lg rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center gap-3 transition-all active:scale-95"
          >
            Kendimi Hazır Hissediyorum <span className="bg-slate-950 text-emerald-400 p-1.5 rounded-lg group-hover:bg-slate-900"><ChevronRight size={24} /></span> Vaka Sınavına Geç
          </button>
        </div>
      </section>

      {/* Tam Ekran Modu Modalı */}
      <AnimatePresence>
        {fullScreenMode !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-slate-950 flex flex-col justify-center items-center p-2 sm:p-6"
          >
            <button 
              onClick={() => setFullScreenMode(null)} 
              className="absolute top-4 right-4 z-[70] bg-slate-800 p-2 rounded-full text-slate-300 hover:text-white hover:bg-slate-700 shadow-xl border border-slate-600"
            >
              <X size={24} />
            </button>
            
            <div className="w-full max-w-7xl">
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-white uppercase tracking-widest">
                  {fullScreenMode === 1 ? selectedCase?.tani : selectedCase2?.tani}
                </h3>
                <p className="text-emerald-400 text-sm font-semibold">Genişletilmiş İnceleme Modu</p>
              </div>
              <div className="w-full border-4 border-slate-800 rounded-xl overflow-hidden bg-white shadow-[0_0_50px_rgba(0,0,0,0.8)]">
                <DigitalCaliper>
                  <img 
                    src={fullScreenMode === 1 ? selectedCase?.stripImage : selectedCase2?.stripImage} 
                    alt="EKG Fullscreen" 
                    className="max-h-[50vh] sm:max-h-[70vh] max-w-none object-contain pointer-events-none select-none z-10" 
                  />
                </DigitalCaliper>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
