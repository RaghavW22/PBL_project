import React, { useState, useEffect, useRef } from 'react';
import { 
  Eye, 
  HelpCircle, 
  Search, 
  Volume2, 
  Sparkles, 
  X, 
  ChevronRight, 
  ShieldCheck, 
  ArrowUpRight,
  MessageSquare,
  Check,
  FileUp,
  Globe,
  Lock,
  LogIn
} from 'lucide-react';

interface GazeMedicalReaderProps {
  className?: string;
}

interface QuerySolution {
  id: string;
  category: 'Website Help' | 'Report & Terms' | 'Privacy & Security';
  q: string;
  solution: string;
  actionText?: string;
  actionTarget?: string;
}

const QUERY_DATABASE: QuerySolution[] = [
  {
    id: 'upload-help',
    category: 'Website Help',
    q: 'How do I upload my lab report PDF or image?',
    solution: 'Login to unlock tools, then scroll to the Report Uploader section. Drag & drop your PDF, PNG, or JPG lab report. Our OCR engine automatically extracts parameters while masking personal identity data.',
    actionText: 'Scroll to Report Uploader',
    actionTarget: '#uploader-section'
  },
  {
    id: 'voice-help',
    category: 'Website Help',
    q: 'How do I listen to my report in Indian regional languages?',
    solution: 'After logging in, use the Language Selector in the top navigation bar to choose from 9 Indian regional speech accents (Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, English India). Click Play Audio on your report summary!',
    actionText: 'Select Voice Language',
    actionTarget: '#overview'
  },
  {
    id: 'privacy-help',
    category: 'Privacy & Security',
    q: 'Is my personal medical data kept private and secure?',
    solution: '100% private! All patient full names, SSNs, phone numbers, and addresses are automatically redacted on your device before AI analysis. All connections are encrypted via 256-bit SSL.',
  },
  {
    id: 'auth-help',
    category: 'Website Help',
    q: 'Why is login required to access the dashboard & tools?',
    solution: 'Firebase authentication ensures your medical reports and personalized health records remain strictly confidential and accessible only to you.',
  },
  {
    id: 'cbc-term',
    category: 'Report & Terms',
    q: 'What is Complete Blood Count (CBC) & LOINC Risk Score?',
    solution: 'CBC measures red cells, white cells, neutrophils, and platelets. Our LOINC Risk Score weights observed values against international clinical reference standards to generate a 0-100 health index.',
  },
  {
    id: 'neutrophil-term',
    category: 'Report & Terms',
    q: 'What does a slightly elevated Neutrophil count mean?',
    solution: 'Neutrophils are immune firefighters. A mild elevation (like 70-75%) is very common when your body is clearing routine inflammation, seasonal allergies, or a minor cold.',
  }
];

export const GazeMedicalReader: React.FC<GazeMedicalReaderProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Lens pupil positions (dx, dy) in pixels
  const [leftPupil, setLeftPupil] = useState({ x: 0, y: 0 });
  const [rightPupil, setRightPupil] = useState({ x: 0, y: 0 });
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSolution, setSelectedSolution] = useState<QuerySolution>(QUERY_DATABASE[0]);
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
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const filteredQueries = QUERY_DATABASE.filter(item => 
    item.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.solution.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    
    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    const textToSay = `${selectedSolution.q}. ${selectedSolution.solution}`;
    const utterance = new SpeechSynthesisUtterance(textToSay);
    utterance.rate = 0.95;
    
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleActionClick = (targetSelector?: string) => {
    if (!targetSelector) return;
    const elem = document.querySelector(targetSelector);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 z-40 bg-slate-900 border border-cyan-500/40 rounded-full px-4 py-2.5 text-xs font-mono text-cyan-300 shadow-2xl backdrop-blur-xl flex items-center gap-2 hover:bg-slate-800 transition-all animate-fadeIn"
      >
        <Eye className="w-4 h-4 text-cyan-400 animate-pulse" />
        <span className="font-bold">Open Website Query Solver</span>
      </button>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`liquid-glass-active rounded-3xl p-5 border border-cyan-500/40 shadow-2xl relative overflow-hidden backdrop-blur-2xl transition-all space-y-4 max-w-md w-full ${className}`}
    >
      {/* Background Radial Glow */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <HelpCircle className="w-4.5 h-4.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white tracking-wide uppercase font-mono">GAZE WEBSITE QUERY SOLVER</h4>
            <p className="text-[10px] text-cyan-300 font-mono">INSTANT AI HELP & NAVIGATION ASSISTANT</p>
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
            title="Minimize"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Reticle + Active Query Solution Box */}
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
            GAZE SOLVER
          </span>
        </div>

        {/* Selected Query Solution Details */}
        <div className="space-y-2 flex-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-white/10">
              {selectedSolution.category}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/90 border border-cyan-500/30 space-y-2 text-xs leading-relaxed">
            <p className="text-white font-bold font-sans">
              ❓ {selectedSolution.q}
            </p>
            <p className="text-slate-300 font-sans text-[11px] pt-1.5 border-t border-white/10">
              💡 {selectedSolution.solution}
            </p>
            
            {selectedSolution.actionText && (
              <button
                onClick={() => handleActionClick(selectedSolution.actionTarget)}
                className="mt-1 text-[10px] font-mono text-cyan-300 hover:text-white hover:underline font-bold flex items-center gap-1"
              >
                <span>{selectedSolution.actionText}</span>
                <ArrowUpRight className="w-3 h-3 text-cyan-400" />
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Search Query Input */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Ask any query (e.g. upload, voice, privacy, CBC)..."
          className="w-full bg-slate-900 border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans transition-colors"
        />
      </div>

      {/* Quick Select Query List */}
      <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
        <p className="text-[10px] font-mono text-slate-400 uppercase">SELECT A FREQUENT QUERY:</p>
        <div className="space-y-1">
          {filteredQueries.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedSolution(item)}
              className={`w-full text-left p-2 rounded-xl text-[11px] font-medium transition-all flex items-center justify-between group ${
                selectedSolution.id === item.id 
                  ? 'bg-cyan-500/20 text-white border border-cyan-500/40 font-bold' 
                  : 'bg-slate-900/60 text-slate-300 hover:text-white border border-white/5 hover:border-cyan-500/30'
              }`}
            >
              <span className="truncate pr-2">{item.q}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Audio Narration Bar */}
      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono">
        <span className="text-[10px] text-slate-400 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Real-Time Solution Engine</span>
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
          <span>{isSpeaking ? "Stop Voice" : "Listen Solution"}</span>
        </button>
      </div>

    </div>
  );
};
