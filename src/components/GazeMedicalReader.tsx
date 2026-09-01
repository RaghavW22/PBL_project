import React, { useState, useEffect, useRef } from 'react';
import { Eye, BookOpen, Volume2, Sparkles, HelpCircle, X, Check, Activity, Search, ShieldCheck } from 'lucide-react';

interface GazeMedicalReaderProps {
  className?: string;
}

interface TermDefinition {
  term: string;
  category: string;
  range: string;
  plainEnglish: string;
  advice: string;
}

const MEDICAL_DICTIONARY: Record<string, TermDefinition> = {
  neutrophil: {
    term: "Neutrophils (Absolute)",
    category: "Immune System / WBC",
    range: "40% - 65%",
    plainEnglish: "White blood cells that act like first-responder firefighters against routine bacterial infections.",
    advice: "Mild 72% elevation indicates your immune system is actively recovering from minor inflammation or cold."
  },
  ferritin: {
    term: "Serum Ferritin",
    category: "Iron Reserves & Blood",
    range: "20 - 250 ng/mL",
    plainEnglish: "A blood protein that stores iron inside your body cells so your tissue has steady energy.",
    advice: "Low-normal (22 ng/mL) reserves can cause mild tiredness. Eating iron-rich spinach, lentils, and beans helps!"
  },
  glucose: {
    term: "Fasting Blood Glucose",
    category: "Metabolic & Sugar",
    range: "70 - 99 mg/dL",
    plainEnglish: "The amount of sugar circulating in your bloodstream after an overnight fast.",
    advice: "92 mg/dL is optimal, demonstrating healthy insulin sensitivity and balanced blood sugar."
  },
  platelet: {
    term: "Platelet Count (PLT)",
    category: "Blood Coagulation",
    range: "150 - 450 x10^3/uL",
    plainEnglish: "Tiny blood cell fragments that help your blood clot to heal scratches and wounds.",
    advice: "240 x10^3/uL is within the ideal safe reference range."
  },
  wbc: {
    term: "White Blood Cells (WBC)",
    category: "Immune Defense",
    range: "4.5 - 11.0 x10^3/uL",
    plainEnglish: "Your body's primary defense squad protecting you from viruses, bacteria, and illness.",
    advice: "8.2 x10^3/uL indicates a balanced, active immune system."
  },
  risk: {
    term: "Health Risk Index",
    category: "Clinical Assessment",
    range: "0 - 100 Index",
    plainEnglish: "A overall wellness score weighting lab variances against LOINC international medical standards.",
    advice: "Score of 88/100 reflects strong overall health with minor iron monitoring recommended."
  }
};

export const GazeMedicalReader: React.FC<GazeMedicalReaderProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Lens pupil positions (dx, dy) in pixels
  const [leftPupil, setLeftPupil] = useState({ x: 0, y: 0 });
  const [rightPupil, setRightPupil] = useState({ x: 0, y: 0 });
  
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [activeTermKey, setActiveTermKey] = useState<string>("neutrophil");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      
      const angle = Math.atan2(deltaY, deltaX);
      const distance = Math.hypot(deltaX, deltaY);

      // Max eye pupil shift limit
      const maxShift = 7;
      const shiftRatio = Math.min(distance / 160, 1);
      const pupilX = Math.cos(angle) * (maxShift * shiftRatio);
      const pupilY = Math.sin(angle) * (maxShift * shiftRatio);

      setLeftPupil({ x: pupilX, y: pupilY });
      setRightPupil({ x: pupilX, y: pupilY });
      setCoords({ x: Math.round(e.clientX), y: Math.round(e.clientY) });

      // AUTOMATIC HOVER MEDICAL TERM GAZE DETECTION
      const elem = document.elementFromPoint(e.clientX, e.clientY);
      if (elem) {
        const text = (elem.textContent || '').toLowerCase();
        if (text.includes('ferritin') || text.includes('iron')) {
          setActiveTermKey('ferritin');
        } else if (text.includes('glucose') || text.includes('sugar')) {
          setActiveTermKey('glucose');
        } else if (text.includes('platelet') || text.includes('plt')) {
          setActiveTermKey('platelet');
        } else if (text.includes('wbc') || text.includes('white blood')) {
          setActiveTermKey('wbc');
        } else if (text.includes('risk') || text.includes('score')) {
          setActiveTermKey('risk');
        } else if (text.includes('neutrophil')) {
          setActiveTermKey('neutrophil');
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const activeDef = MEDICAL_DICTIONARY[activeTermKey] || MEDICAL_DICTIONARY['neutrophil'];

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    
    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    const textToSay = `${activeDef.term}. ${activeDef.plainEnglish} ${activeDef.advice}`;
    const utterance = new SpeechSynthesisUtterance(textToSay);
    utterance.rate = 0.95;
    
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 z-40 bg-slate-900 border border-cyan-500/40 rounded-full px-4 py-2.5 text-xs font-mono text-cyan-300 shadow-2xl backdrop-blur-xl flex items-center gap-2 hover:bg-slate-800 transition-all animate-fadeIn"
      >
        <Eye className="w-4 h-4 text-cyan-400 animate-pulse" />
        <span className="font-bold">Open Medical Gaze Explainer</span>
      </button>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`liquid-glass-active rounded-3xl p-5 border border-cyan-500/40 shadow-2xl relative overflow-hidden backdrop-blur-2xl transition-all space-y-4 max-w-md w-full ${className}`}
    >
      {/* Radial Accent Glow */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top Bar Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white tracking-wide uppercase font-mono">GAZE MEDICAL EXPLAINER LENS</h4>
            <p className="text-[10px] text-cyan-300 font-mono">HOVER CURSOR OVER ANY TERM TO EXPLAIN</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            GAZE ACTIVE
          </span>
          <button 
            onClick={() => setIsMinimized(true)}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors text-xs"
            title="Minimize Lens"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Reticle + Active Definition Display */}
      <div className="flex items-start gap-4">
        
        {/* Real-time Tracking Optical Reticle SVG */}
        <div className="relative w-20 h-20 flex-shrink-0 rounded-2xl bg-slate-950 border border-cyan-500/40 shadow-inner flex items-center justify-center p-1.5 mt-1">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="1.5" fill="none" strokeDasharray="4 3" />
            <circle cx="50" cy="50" r="32" stroke="rgba(6, 182, 212, 0.4)" strokeWidth="1" fill="none" />
            
            {/* LEFT EYE PUPIL */}
            <circle cx="35" cy="50" r="10" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
            <circle cx="35" cy="50" r="8" fill="#ffffff" />
            <circle cx={35 + leftPupil.x} cy={50 + leftPupil.y} r="4" fill="#0284c7" />
            <circle cx={35 + leftPupil.x + 1} cy={50 + leftPupil.y - 1} r="1.2" fill="#ffffff" />

            {/* RIGHT EYE PUPIL */}
            <circle cx="65" cy="50" r="10" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
            <circle cx="65" cy="50" r="8" fill="#ffffff" />
            <circle cx={65 + rightPupil.x} cy={50 + rightPupil.y} r="4" fill="#0284c7" />
            <circle cx={65 + rightPupil.x + 1} cy={50 + rightPupil.y - 1} r="1.2" fill="#ffffff" />
          </svg>

          <span className="absolute -bottom-1.5 text-[8px] font-mono px-1.5 py-0.5 rounded-full bg-cyan-500 text-slate-950 font-bold uppercase">
            GAZE LENS
          </span>
        </div>

        {/* Dynamic Medical Explanation Box */}
        <div className="space-y-2 flex-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-white flex items-center gap-1.5">
              <span>{activeDef.term}</span>
              <span className="text-[10px] font-mono text-cyan-300 font-normal">({activeDef.range})</span>
            </span>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-slate-900 text-cyan-300 border border-white/10">
              {activeDef.category}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/90 border border-cyan-500/30 space-y-2 text-xs leading-relaxed">
            <p className="text-slate-200 font-sans font-medium">
              💡 <strong>6th-Grade Meaning:</strong> {activeDef.plainEnglish}
            </p>
            <p className="text-cyan-300 font-sans text-[11px] pt-1.5 border-t border-white/10">
              🩺 <strong>Clinical Advice:</strong> {activeDef.advice}
            </p>
          </div>
        </div>

      </div>

      {/* Quick Select Pill Buttons */}
      <div className="space-y-1.5 pt-1">
        <p className="text-[10px] font-mono text-slate-400 uppercase">QUICK INSPECT MEDICAL TERMS:</p>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(MEDICAL_DICTIONARY).map(([key, def]) => (
            <button
              key={key}
              onClick={() => setActiveTermKey(key)}
              className={`px-2.5 py-1 text-[10px] font-mono rounded-lg transition-all ${
                activeTermKey === key
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                  : 'bg-slate-900 text-slate-300 border border-white/10 hover:text-white'
              }`}
            >
              {def.term.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Audio Narration Bar */}
      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono">
        <span className="text-[10px] text-slate-400 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>6th-Grade Plain English</span>
        </span>

        <button
          onClick={handleSpeak}
          className={`px-3 py-1.5 rounded-xl border text-xs font-bold font-mono transition-all flex items-center gap-1.5 ${
            isSpeaking 
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
              : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/30'
          }`}
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>{isSpeaking ? "Stop Speech" : "Listen Audio"}</span>
        </button>
      </div>

    </div>
  );
};
