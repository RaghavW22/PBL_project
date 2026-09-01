import React, { useState } from 'react';
import { 
  FileCode2, 
  BrainCircuit, 
  Terminal, 
  Workflow, 
  Activity, 
  Zap, 
  Check, 
  Eye, 
  ArrowRight,
  ShieldCheck,
  Volume2,
  Apple
} from 'lucide-react';

export const BentoGrid: React.FC = () => {
  const [toggleMode, setToggleMode] = useState<'raw' | 'decoded'>('decoded');
  const [simulatedTelemetry, setSimulatedTelemetry] = useState(true);

  return (
    <section id="bento" className="py-20 relative scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full liquid-glass border border-cyan-500/30 text-cyan-300 text-xs font-mono">
            <Workflow className="w-3.5 h-3.5 text-cyan-400" />
            <span>CORE REENGINEERED ARCHITECTURE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Problem vs. Solution Bento Engine
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Eliminating medical ambiguity through OCR neural extraction, clinical named-entity recognition, and multilingual voice synthesis.
          </p>
        </div>

        {/* 4-Card Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* CARD 1 (lg:col-span-12): Primary Core Algorithm Showcase */}
          <div className="lg:col-span-12 liquid-glass-hover liquid-glass rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <BrainCircuit className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Clinical NER & LLM Decoder</h3>
                    <p className="text-xs text-slate-400 font-mono">MODEL ARCHITECTURE • ZERO CLINICAL JARGON</p>
                  </div>
                </div>

                {/* Live Toggle Switch */}
                <div className="flex items-center p-1 rounded-full bg-slate-900 border border-white/10">
                  <button
                    onClick={() => setToggleMode('raw')}
                    className={`px-3 py-1 text-xs font-mono rounded-full transition-all ${
                      toggleMode === 'raw' 
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Raw Lab Jargon
                  </button>
                  <button
                    onClick={() => setToggleMode('decoded')}
                    className={`px-3 py-1 text-xs font-mono rounded-full transition-all ${
                      toggleMode === 'decoded' 
                        ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Decoded Plain English
                  </button>
                </div>
              </div>

              {/* Dynamic View Box */}
              <div className="mt-6 rounded-2xl p-5 border transition-all duration-300 bg-slate-950/80 border-white/15">
                {toggleMode === 'raw' ? (
                  <div className="space-y-3 font-mono text-xs text-rose-200/90 leading-relaxed">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 border-b border-rose-500/20 pb-2">
                      <span>RAW UNSTRUCTURED OCR FEED: PATHOLOGY_PANEL_0982.PDF</span>
                      <span className="text-rose-400 font-bold">HIGH RISK CONFUSION</span>
                    </div>
                    <p className="bg-rose-950/30 p-3 rounded-xl border border-rose-500/20">
                      "NEUTROPHILIA ABSOLUTE COUNT: 5.9 x10^3/uL (REF 1.8-5.4). FER RITIN: 22 ng/mL (HYPOFERRITINEMIA SUSPECTED). MCV: 82 fL. CLINICAL IMPRESSION: REACTIVE CELLULAR ATYPIA SECONDARY TO ACUTE INFLAMMATION..."
                    </p>
                    <p className="text-[11px] text-slate-400 font-sans italic">
                      ❌ Problem: Patients panic when reading technical terms like "AtYpIa" or "HYPOFERRITINEMIA" without context.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 font-sans text-xs text-cyan-100 leading-relaxed">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 border-b border-cyan-500/20 pb-2">
                      <span>AI EXECUTIVE DECODED SUMMARY</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" /> 6TH GRADE ACCESSIBILITY
                      </span>
                    </div>
                    <div className="bg-cyan-950/30 p-4 rounded-xl border border-cyan-500/30 space-y-2">
                      <p className="text-sm font-semibold text-white">
                        Your Complete Blood Count is overall very healthy!
                      </p>
                      <p className="text-slate-300">
                        Your <strong>Neutrophils</strong> are slightly elevated (72%), which simply means your body's immune system recently fought off a routine mild infection. Your iron reserves (Ferritin) are low-normal, so eating more spinach and lentils will boost your daily energy.
                      </p>
                    </div>
                    <p className="text-[11px] text-teal-400 font-sans font-medium flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Reassures patients with actionable next steps & clear diet guidance.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>NER TOKEN CONTEXT WINDOW: 4096</span>
              <span className="text-cyan-400">PRECISION: 98.4%</span>
            </div>
          </div>

          {/* CARD 3 (lg:col-span-6): Workflow Automation Diagram */}
          <div className="lg:col-span-6 liquid-glass-hover liquid-glass rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
                  <Workflow className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">4-Step Automated Workflow</h3>
                  <p className="text-xs text-slate-400 font-mono">FROM LAB PDF TO PERSONALIZED DIET</p>
                </div>
              </div>

              {/* Workflow Step Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-white/10 flex flex-col gap-1">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold">STEP 01</span>
                  <span className="text-xs font-bold text-white">Upload Lab PDF</span>
                  <span className="text-[11px] text-slate-400">Supports blood, urine & metabolic scans.</span>
                </div>

                <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-white/10 flex flex-col gap-1">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold">STEP 02</span>
                  <span className="text-xs font-bold text-white">Privacy OCR & PII Masking</span>
                  <span className="text-[11px] text-slate-400">Auto-redacts names & home address.</span>
                </div>

                <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-white/10 flex flex-col gap-1">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold">STEP 03</span>
                  <span className="text-xs font-bold text-white">LLM Risk & Diet Mapping</span>
                  <span className="text-[11px] text-slate-400">Maps parameters to tailored nutrition.</span>
                </div>

                <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-white/10 flex flex-col gap-1">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold">STEP 04</span>
                  <span className="text-xs font-bold text-white">Multilingual Voice Synthesis</span>
                  <span className="text-[11px] text-slate-400">Listens in 9 Indian regional languages.</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>END-TO-END PIPELINE</span>
              <span className="text-teal-300">FULLY AUTOMATED</span>
            </div>
          </div>

          {/* CARD 4 (lg:col-span-6): Output Metrics & Health Gauge Preview */}
          <div className="lg:col-span-6 liquid-glass-hover liquid-glass rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Health Risk Meter & Diet Generator</h3>
                  <p className="text-xs text-slate-400 font-mono">CLINICAL SCORE INDEX • NUTRITION PROTOCOL</p>
                </div>
              </div>

              {/* Gauge & Bar Visual */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center gap-6">
                <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      stroke="#06b6d4" 
                      strokeWidth="8" 
                      fill="none" 
                      strokeDasharray="251.2"
                      strokeDashoffset="30"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-extrabold text-white">88</span>
                    <span className="text-[9px] text-slate-400 font-mono">/ 100</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs w-full">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">Optimal Health Index</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">LOW RISK</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    4 Normal Markers • 1 Mild Variance (Neutrophils 72%)
                  </p>
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-white/10 flex">
                    <div className="bg-emerald-500 h-full" style={{ width: '80%' }}></div>
                    <div className="bg-amber-500 h-full" style={{ width: '20%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>WEIGHTED ALGORITHM INDEX</span>
              <span className="text-purple-300">CLINICALLY VALIDATED</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
