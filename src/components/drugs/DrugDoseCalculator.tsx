"use client";

import { useState, useMemo } from "react";
import ilaclarData from "@/data/ilaclar.json";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DoseInfo {
  isAvailable: boolean;
  isWeightBased: boolean;
  dosePerKg: number | null;
  unit: string | null;
  fixedDose: string | null;
  maxDose: string | null;
  route: string | null;
  notes: string | null;
}

interface DrugCase {
  caseName: string;
  eriskin: DoseInfo;
  cocuk: DoseInfo;
}

interface Drug {
  id: string;
  name: string;
  cases: Record<string, DrugCase>;
}

type AgeGroup = "eriskin" | "cocuk";

const ALL_DRUGS = ilaclarData as unknown as Record<string, Drug>;

// ─── Step Indicator ───────────────────────────────────────────────────────────

function StepBadge({ step, label, active, done }: { step: number; label: string; active: boolean; done: boolean }) {
  return (
    <div className={`flex items-center gap-2 transition-all duration-300 ${active ? "opacity-100" : done ? "opacity-60" : "opacity-30"}`}>
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all border ${
        done 
          ? "bg-teal-500/20 border-teal-500/50 text-teal-400" 
          : active 
            ? "bg-teal-500/20 border-teal-500/50 text-teal-400 shadow-[0_0_15px_rgba(59,130,246,0.3)] ring-2 ring-teal-500/30" 
            : "glass-card text-subtle border-white/5"
      }`}>
        {done ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        ) : step}
      </div>
      <span className={`text-xs font-semibold tracking-wide ${active ? "text-teal-400" : "text-subtle"}`}>{label}</span>
    </div>
  );
}

// ─── Result Card ──────────────────────────────────────────────────────────────

function ResultCard({ dose, doseInfo, ageGroup, weight, drugId }: {
  dose: string;
  doseInfo: DoseInfo;
  ageGroup: AgeGroup;
  weight: string;
  drugId?: string;
}) {
  const ageLabel = ageGroup === "eriskin" ? "Erişkin" : "Çocuk";
  const weightNum = parseFloat(weight);
  const showDopaminDrops = drugId === "dopamin" && !isNaN(weightNum);

  return (
    <div className="mt-5 rounded-2xl overflow-hidden shadow-lg border border-teal-500/30 glass-card animate-in fade-in slide-in-from-bottom-4 duration-400">
      {/* Header */}
      <div className="bg-teal-500/20 px-5 py-3 flex items-center justify-between border-b border-teal-500/30">
        <span className="text-teal-400 text-sm font-bold uppercase tracking-widest">Hesaplanan Doz</span>
        <span className="bg-white/10 text-white text-xs font-bold px-3 py-1 rounded-full">{ageLabel}</span>
      </div>

      {/* Main Dose */}
      <div className="bg-white/5 px-5 py-5 text-center">
        <p className="text-6xl font-black text-white leading-none tracking-tight drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">{dose}</p>
        <p className="text-lg text-teal-400 font-semibold mt-1">{doseInfo.unit}</p>
        {doseInfo.isWeightBased && weight && (
          <p className="text-xs text-subtle mt-1">{weight} kg × {doseInfo.dosePerKg} {doseInfo.unit}/kg</p>
        )}
        {showDopaminDrops && (
          <div className="mt-4 bg-orange-500/10 border border-orange-500/30 rounded-xl p-3">
            <p className="text-[11px] text-orange-400 font-bold uppercase tracking-widest mb-1">cc/dk Ayar Değeri</p>
            <p className="text-2xl font-black text-orange-300">{(weightNum * 1.5).toFixed(1)} <span className="text-sm font-bold text-orange-400/80">cc/dk</span></p>
          </div>
        )}
      </div>

      {/* Meta info */}
      <div className="bg-black/20 border-t border-white/5 px-5 py-4 space-y-3">
        {doseInfo.route && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-teal-500/10 border border-teal-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              </svg>
            </div>
            <div>
              <p className="text-[11px] text-muted font-medium uppercase tracking-wide">Uygulama Yolu</p>
              <p className="text-sm font-bold text-white">{doseInfo.route}</p>
            </div>
          </div>
        )}

        {doseInfo.maxDose && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <div>
              <p className="text-[11px] text-amber-400 font-medium uppercase tracking-wide">Maksimum Doz</p>
              <p className="text-sm font-bold text-white">{doseInfo.maxDose}</p>
            </div>
          </div>
        )}

        {doseInfo.notes && (
          <div className="bg-teal-500/10 border border-teal-500/30 rounded-xl p-3 flex gap-3">
            <svg className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
            <p className="text-xs text-teal-200 leading-relaxed font-medium">{doseInfo.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DrugDoseCalculator() {
  const [selectedDrugId, setSelectedDrugId] = useState<string>("");
  const [drugSearch, setDrugSearch] = useState<string>("");
  const [selectedCaseKey, setSelectedCaseKey] = useState<string>("");
  const [ageGroup, setAgeGroup] = useState<AgeGroup>("eriskin");
  const [weight, setWeight] = useState<string>("");
  const [showDrugDropdown, setShowDrugDropdown] = useState(false);

  // Filtered drug list
  const filteredDrugs = useMemo(() => {
    const query = drugSearch.toLowerCase();
    return Object.values(ALL_DRUGS)
      .filter((d) => d.name.toLowerCase().includes(query))
      .sort((a, b) => a.name.localeCompare(b.name, "tr"));
  }, [drugSearch]);

  const selectedDrug = selectedDrugId ? ALL_DRUGS[selectedDrugId] : null;
  const selectedCase = selectedDrug && selectedCaseKey ? selectedDrug.cases[selectedCaseKey] : null;
  const currentDoseInfo: DoseInfo | null = selectedCase ? selectedCase[ageGroup] : null;

  // Weight validation
  const weightNum = parseFloat(weight);
  const isWeightInvalid = weight !== "" && (isNaN(weightNum) || weightNum <= 0 || weightNum > 300);
  const isWeightHigh = !isWeightInvalid && weightNum > 150;

  const isSpecialWeightDrug = selectedDrugId === "dopamin";
  const requiresWeight = currentDoseInfo?.isWeightBased || isSpecialWeightDrug;

  // Calculate dose
  const calculatedDose = useMemo(() => {
    if (!currentDoseInfo) return null;
    if (!currentDoseInfo.isAvailable) return null;
    
    if (requiresWeight) {
      if (!weight || isWeightInvalid || weightNum > 300) return null;
      if (currentDoseInfo.isWeightBased && currentDoseInfo.dosePerKg) {
        const raw = weightNum * currentDoseInfo.dosePerKg;
        return raw % 1 === 0 ? raw.toString() : raw.toFixed(2);
      }
      return currentDoseInfo.fixedDose;
    }
    return currentDoseInfo.fixedDose;
  }, [currentDoseInfo, weight, weightNum, isWeightInvalid, requiresWeight]);

  const step = !selectedDrugId ? 1 : !selectedCaseKey ? 2 : !currentDoseInfo?.isAvailable ? 3 : (requiresWeight && !calculatedDose) ? 3 : 4;

  const handleDrugSelect = (drug: Drug) => {
    setSelectedDrugId(drug.id);
    setDrugSearch(drug.name);
    setShowDrugDropdown(false);
    setSelectedCaseKey("");
    setWeight("");
  };

  const handleReset = () => {
    setSelectedDrugId("");
    setDrugSearch("");
    setSelectedCaseKey("");
    setWeight("");
    setAgeGroup("eriskin");
    setShowDrugDropdown(false);
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 pt-4 pb-16 flex flex-col gap-5 font-sans">
      {/* Step Indicator */}
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
        <StepBadge step={1} label="İlaç" active={step === 1} done={step > 1} />
        <div className="flex-1 h-px bg-white/20 min-w-[20px]" />
        <StepBadge step={2} label="Vaka" active={step === 2} done={step > 2} />
        <div className="flex-1 h-px bg-white/20 min-w-[20px]" />
        <StepBadge step={3} label="Hasta" active={step === 3} done={step > 3} />
        <div className="flex-1 h-px bg-white/20 min-w-[20px]" />
        <StepBadge step={4} label="Doz" active={step === 4} done={false} />
      </div>

      {/* ── STEP 1: Drug Selection ─────────────────────────────────────────── */}
      <div className="glass-card rounded-2xl shadow-sm border border-white/10 overflow-visible">
        <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
          <p className="text-xs font-bold text-subtle uppercase tracking-widest">Adım 1 · İlaç Seç</p>
          {selectedDrugId && (
            <button onClick={handleReset} className="text-xs text-red-400 hover:text-red-300 font-semibold transition-colors">
              Sıfırla
            </button>
          )}
        </div>
        <div className="p-4 relative">
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <input
              type="text"
              value={drugSearch}
              onChange={(e) => { setDrugSearch(e.target.value); setShowDrugDropdown(true); setSelectedDrugId(""); setSelectedCaseKey(""); setWeight(""); }}
              onFocus={() => setShowDrugDropdown(true)}
              placeholder="İlaç adı yaz veya seç..."
              className="w-full glass-input rounded-xl pl-10 pr-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all"
            />
          </div>

          {/* Dropdown */}
          {showDrugDropdown && filteredDrugs.length > 0 && (
            <div className="absolute left-4 right-4 top-[calc(100%-8px)] z-30 bg-background/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 max-h-64 overflow-y-auto no-scrollbar">
              {filteredDrugs.map((drug) => (
                <button
                  key={drug.id}
                  onMouseDown={() => handleDrugSelect(drug)}
                  className={`w-full text-left px-4 py-3.5 glass-hover transition-colors border-b border-white/5 last:border-0 ${selectedDrugId === drug.id ? "bg-white/10 text-white font-bold" : "text-muted"}`}
                >
                  <span className="text-sm font-semibold">{drug.name}</span>
                  <span className="text-xs text-subtle ml-2">· {Object.keys(drug.cases).length} vaka</span>
                </button>
              ))}
            </div>
          )}

          {/* Selected drug chip */}
          {selectedDrug && (
            <div className="mt-3 flex items-center gap-2 bg-teal-500/10 border border-teal-500/30 px-3 py-2 rounded-xl">
              <svg className="w-4 h-4 text-teal-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span className="text-sm font-bold text-teal-300 truncate">{selectedDrug.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── STEP 2: Case Selection ─────────────────────────────────────────── */}
      {selectedDrug && (
        <div className="glass-card rounded-2xl shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="px-4 py-3 border-b border-white/10">
            <p className="text-xs font-bold text-subtle uppercase tracking-widest">Adım 2 · Vaka / Endikasyon Seç</p>
          </div>
          <div className="p-4 flex flex-col gap-2">
            {Object.entries(selectedDrug.cases).map(([caseKey, caseVal]) => (
              <button
                key={caseKey}
                onClick={() => { setSelectedCaseKey(caseKey); setWeight(""); }}
                className={`w-full text-left px-4 py-3.5 rounded-xl border transition-all duration-150 active:scale-[0.98] shadow-sm min-h-[52px] ${
                  selectedCaseKey === caseKey
                    ? "bg-teal-500/20 border-teal-500/50 text-teal-300 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                    : "glass-card text-muted hover:border-white/30 hover:bg-white/5"
                }`}
              >
                <span className="text-sm font-bold leading-tight">{caseVal.caseName}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── STEP 3: Age + Weight ───────────────────────────────────────────── */}
      {selectedCase && (
        <div className="glass-card rounded-2xl shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="px-4 py-3 border-b border-white/10">
            <p className="text-xs font-bold text-subtle uppercase tracking-widest">Adım 3 · Yaş Grubu ve Kilo</p>
          </div>
          <div className="p-4 flex flex-col gap-4">
            {/* Age Toggle */}
            <div className="grid grid-cols-2 gap-2 bg-black/20 p-1.5 rounded-xl border border-white/5">
              {(["eriskin", "cocuk"] as AgeGroup[]).map((ag) => {
                const info = selectedCase[ag];
                const isDisabled = !info.isAvailable;
                return (
                  <button
                    key={ag}
                    disabled={isDisabled}
                    onClick={() => { setAgeGroup(ag); setWeight(""); }}
                    title={isDisabled ? "Bu yaş grubunda kontrendikedir" : undefined}
                    className={`py-3 rounded-lg text-sm font-bold transition-all duration-200 active:scale-95 min-h-[48px] ${
                      isDisabled
                        ? "opacity-40 cursor-not-allowed bg-transparent text-subtle line-through"
                        : ageGroup === ag
                          ? "bg-white/10 text-white shadow-md border border-white/20"
                          : "text-muted hover:bg-white/5"
                    }`}
                  >
                    {ag === "eriskin" ? "Erişkin" : "Çocuk"}
                    {isDisabled && <span className="block text-[10px] font-medium normal-case no-underline opacity-80 text-red-400">Kontrendike</span>}
                  </button>
                );
              })}
            </div>

            {/* Kontrendike uyarı */}
            {currentDoseInfo && !currentDoseInfo.isAvailable && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
                <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <div>
                  <p className="text-sm font-bold text-red-300">Bu yaş grubunda kontrendikedir</p>
                  <p className="text-xs text-red-200 mt-0.5">Bu ilaç seçilen yaş grubu için kullanılmaz. Lütfen diğer yaş grubunu seçin.</p>
                </div>
              </div>
            )}

            {/* Weight Input */}
            {currentDoseInfo?.isAvailable && requiresWeight && (
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-muted uppercase tracking-wide flex items-center gap-2">
                  <svg className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                  </svg>
                  Hasta Kilosu (kg)
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={weight}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "" || /^\d*\.?\d*$/.test(val)) {
                      const num = parseFloat(val);
                      if (val === "" || num >= 0) setWeight(val);
                    }
                  }}
                  onKeyDown={(e) => { if (["-", "+", "e", "E"].includes(e.key)) e.preventDefault(); }}
                  placeholder="Örn: 70"
                  className={`w-full border rounded-xl px-4 py-4 text-3xl font-black text-center tracking-wide focus:outline-none transition-all ${
                    isWeightInvalid
                      ? "border-red-500/50 bg-red-500/10 text-red-400 focus:ring-2 focus:ring-red-500/50"
                      : isWeightHigh
                        ? "border-amber-500/50 bg-amber-500/10 text-amber-400 focus:ring-2 focus:ring-amber-500/50"
                        : "border-white/20 bg-black/20 text-white focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                  }`}
                />
                {/* Weight warnings */}
                {isWeightInvalid && weightNum > 300 && (
                  <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 px-3 py-2 rounded-lg">
                    <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" />
                    </svg>
                    <p className="text-xs font-bold text-red-300">Geçersiz Kilo — Hesaplama yapılamaz (Maks: 300 kg)</p>
                  </div>
                )}
                {isWeightHigh && !isWeightInvalid && (
                  <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-2 rounded-lg">
                    <svg className="w-4 h-4 text-amber-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" />
                    </svg>
                    <p className="text-xs font-bold text-amber-300">Dikkat: Yüksek Kilo Değeri — Lütfen kontrol edin</p>
                  </div>
                )}
              </div>
            )}


            {/* Fixed dose preview */}
            {currentDoseInfo?.isAvailable && !requiresWeight && currentDoseInfo.fixedDose && (
              <div className="bg-teal-500/10 border border-teal-500/30 rounded-xl p-4">
                <p className="text-xs text-teal-400 font-bold uppercase tracking-wide mb-1">Sabit Doz (Kilo Bağımsız)</p>
                <p className="text-4xl font-black text-teal-300">{currentDoseInfo.fixedDose}</p>
                <p className="text-base text-teal-400/80 font-semibold mt-0.5">{currentDoseInfo.unit}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── STEP 4: Result ────────────────────────────────────────────────── */}
      {currentDoseInfo?.isAvailable && calculatedDose !== null && (
        <ResultCard
          dose={calculatedDose}
          doseInfo={currentDoseInfo}
          ageGroup={ageGroup}
          weight={weight}
          drugId={selectedDrugId}
        />
      )}
    </div>
  );
}
