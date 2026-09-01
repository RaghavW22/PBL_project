import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Eye, 
  Activity, 
  ShieldCheck, 
  Stethoscope, 
  HelpCircle, 
  X, 
  MessageSquare, 
  FileText, 
  ChevronRight,
  Info,
  Check
} from 'lucide-react';

interface CursorDoctorProps {
  className?: string;
  variant?: 'card' | 'floating';
}

interface ClinicalQA {
  q: string;
  a: string;
}

const CLINICAL_FAQS: ClinicalQA[] = [
  {
    q: "What does my Complete Blood Count (CBC) mean?",
    a: "CBC measures red cells (oxygen), white cells (immune defense), neutrophils (bacterial response), and platelets (clotting). ReportSarthi translates technical terms into clear 6th-grade English so you understand your results without panic."
  },
  {
    q: "Why are my Neutrophils slightly elevated?",
    a: "Neutrophils act like immune firefighters. A mild elevation (like 70-75%) is very common when your body is clearing a minor routine cold, mild inflammation, or seasonal stress."
  },
  {
    q: "How does ReportSarthi generate my diet recommendations?",
    a: "Our clinical engine maps low or high parameters (like low Ferritin or high Fasting Sugar) to tailored nutrition protocols—recommending iron-rich foods (spinach, lentils) or low-glycemic meal choices."
  },
  {
    q: "Is my personal medical data private?",
    a: "100% private! All personal identifiers (name, address, phone numbers) are masked on your device before text processing. Data is transmitted via 256-bit SSL encryption."
  }
];

export const CursorDoctor: React.FC<CursorDoctorProps> = ({ 
  className = '', 
  variant = 'card' 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Pupil positions (dx, dy) in pixels
  const [leftPupil, setLeftPupil] = useState({ x: 0, y: 0 });
  const [rightPupil, setRightPupil] = useState({ x: 0, y: 0 });
  
  // Head tilt rotation angle
  const [headTilt, setHeadTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [inspectTarget, setInspectTarget] = useState<string>("DEFAULT");
  
  // Speech text state
  const [speechText, setSpeechText] = useState("🩺 Hover your cursor over any metric or button to inspect instant clinical AI insights!");

  // Q&A Drawer Modal state
  const [qaOpen, setQaOpen] = useState(false);
  const [selectedQa, setSelectedQa] = useState<ClinicalQA | null>(null);

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

      // Eye pupil shift limit (max 7px radius)
      const maxShift = 7;
      const shiftRatio = Math.min(distance / 160, 1);
      const pupilX = Math.cos(angle) * (maxShift * shiftRatio);
      const pupilY = Math.sin(angle) * (maxShift * shiftRatio);

      setLeftPupil({ x: pupilX, y: pupilY });
      setRightPupil({ x: pupilX, y: pupilY });

      // Subtle 3D card perspective tilt
      const rotateY = Math.max(-10, Math.min(10, (deltaX / window.innerWidth) * 20));
      const rotateX = Math.max(-10, Math.min(10, -(deltaY / window.innerHeight) * 20));
      setHeadTilt({ rotateX, rotateY });

      // REAL-TIME CLINICAL SCREEN INSPECTION
      const elem = document.elementFromPoint(e.clientX, e.clientY);
      if (elem) {
        const text = (elem.textContent || '').toLowerCase();
        
        if (text.includes('neutrophil')) {
          setInspectTarget("Neutrophils Metric");
          setSpeechText("🩺 Clinical Insight: Neutrophils act like immune firefighters. 72% elevation indicates active routine recovery.");
        } else if (text.includes('ferritin') || text.includes('iron')) {
          setInspectTarget("Ferritin Iron Reserve");
          setSpeechText("🩺 Clinical Insight: Ferritin measures stored iron. Low-normal values (22 ng/mL) benefit from spinach & lentils.");
        } else if (text.includes('glucose') || text.includes('sugar')) {
          setInspectTarget("Fasting Glucose");
          setSpeechText("🩺 Clinical Insight: Fasting Glucose (92 mg/dL) shows optimal blood sugar control & healthy insulin sensitivity.");
        } else if (text.includes('wbc') || text.includes('white blood')) {
          setInspectTarget("White Blood Cells");
          setSpeechText("🩺 Clinical Insight: WBC (8.2 x10^3/uL) is within standard bounds. Your immune system is balanced.");
        } else if (text.includes('risk') || text.includes('score')) {
          setInspectTarget("Health Risk Meter");
          setSpeechText("🩺 Clinical Inspector: Risk Score (88/100) weights parameter variances against LOINC international clinical standards.");
        } else if (text.includes('upload') || text.includes('drop')) {
          setInspectTarget("Report Uploader");
          setSpeechText("🩺 Clinical Inspector: PDF/Image parser supports CBC, Lipid, Metabolic & Pathology panels with automatic PII redactor.");
        } else if (text.includes('language') || text.includes('speech') || text.includes('accent')) {
          setInspectTarget("Multilingual Voice Reader");
          setSpeechText("🩺 Clinical Inspector: Synthesizes medical summaries in 9 Indian regional speech accents (Hindi, Tamil, Telugu, etc.).");
        } else if (text.includes('encrypted') || text.includes('hipaa') || text.includes('privacy') || text.includes('lock')) {
          setInspectTarget("Security Shield");
          setSpeechText("🔒 Privacy Guarantee: Patient names and addresses are masked on-device prior to medical AI summary generation.");
        } else {
          setInspectTarget("General Screen Inspection");
          setSpeechText("🩺 Dr. Sarthi Clinical Gaze: Hover cursor over any lab parameter or section to inspect real-time AI guidance!");
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (variant === 'floating') {
    return (
      <>
        <div className="fixed bottom-6 left-6 z-40 hidden md:block animate-fadeIn">
          <div 
            ref={containerRef}
            onClick={() => setQaOpen(true)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="liquid-glass-active rounded-3xl p-3 border border-cyan-500/40 shadow-2xl backdrop-blur-2xl flex items-center gap-3 cursor-pointer group hover:scale-105 transition-all"
          >
            {/* Doctor Avatar SVG Container */}
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-slate-900 to-blue-600/30 border border-cyan-400/40 flex items-center justify-center overflow-hidden flex-shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full p-1">
                <path d="M 20 85 Q 50 65 80 85 L 85 100 L 15 100 Z" fill="#0284c7" opacity="0.8" />
                <path d="M 35 70 L 50 100 L 65 70 Z" fill="#e0f2fe" />
                <path d="M 30 75 C 30 90, 70 90, 70 75" stroke="#06b6d4" strokeWidth="4" fill="none" strokeLinecap="round" />
                <circle cx="50" cy="88" r="4" fill="#38bdf8" />
                <circle cx="50" cy="45" r="28" fill="#fde047" opacity="0.15" />
                <circle cx="50" cy="45" r="24" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
                <path d="M 26 40 C 26 22, 74 22, 74 40 Z" fill="#0f172a" />
                <path d="M 35 25 Q 50 18 65 25" stroke="#38bdf8" strokeWidth="2" fill="none" />
                <rect x="30" y="38" width="16" height="12" rx="3" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
                <rect x="54" y="38" width="16" height="12" rx="3" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
                <line x1="46" y1="44" x2="54" y2="44" stroke="#38bdf8" strokeWidth="1.5" />
                <circle cx="38" cy="44" r="5" fill="#ffffff" />
                <circle cx={38 + leftPupil.x} cy={44 + leftPupil.y} r="2.5" fill="#0284c7" />
                <circle cx={38 + leftPupil.x + 0.8} cy={44 + leftPupil.y - 0.8} r="0.8" fill="#ffffff" />
                <circle cx="62" cy="44" r="5" fill="#ffffff" />
                <circle cx={62 + rightPupil.x} cy={44 + rightPupil.y} r="2.5" fill="#0284c7" />
                <circle cx={62 + rightPupil.x + 0.8} cy={44 + rightPupil.y - 0.8} r="0.8" fill="#ffffff" />
                <path d="M 43 56 Q 50 62 57 56" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>

            <div className="flex flex-col pr-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Dr. Sarthi AI</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </span>
              <span className="text-[10px] text-cyan-300 font-mono flex items-center gap-1">
                <Eye className="w-3 h-3 text-cyan-400" />
                <span>Inspect Screen & Ask QA</span>
              </span>
            </div>
          </div>
        </div>

        {/* CLINICAL QA DRAWER MODAL */}
        {qaOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
            <div className="liquid-glass-active rounded-3xl p-6 sm:p-8 w-full max-w-lg border border-cyan-500/40 shadow-2xl relative overflow-hidden backdrop-blur-2xl space-y-6">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Dr. Sarthi — Clinical AI Assistant</h3>
                    <p className="text-xs text-slate-400 font-mono">INSTANT MEDICAL REPORT EXPLAINER</p>
                  </div>
                </div>
                <button 
                  onClick={() => { setQaOpen(false); setSelectedQa(null); }}
                  className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {selectedQa ? (
                <div className="space-y-4 animate-fadeIn">
                  <button 
                    onClick={() => setSelectedQa(null)}
                    className="text-xs text-cyan-400 font-mono hover:underline flex items-center gap-1"
                  >
                    ← Back to Questions
                  </button>
                  <div className="p-4 rounded-2xl bg-slate-900 border border-cyan-500/30 space-y-3">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-cyan-400" />
                      <span>{selectedQa.q}</span>
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/70 p-3 rounded-xl border border-white/5">
                      {selectedQa.a}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs font-mono uppercase text-slate-400">SELECT A FREQUENT CLINICAL QUESTION:</p>
                  <div className="space-y-2">
                    {CLINICAL_FAQS.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedQa(item)}
                        className="w-full text-left p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-cyan-500/40 text-xs font-medium text-slate-200 hover:text-white hover:bg-cyan-500/10 transition-all flex items-center justify-between group"
                      >
                        <span className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                          <span>{item.q}</span>
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400">
                  <Check className="w-3.5 h-3.5" /> 6TH GRADE PLAIN ENGLISH
                </span>
                <span className="text-slate-500">HIPAA COMPLIANT</span>
              </div>

            </div>
          </div>
        )}
      </>
    );
  }

  // CARD VARIANT (FOR HERO SECTION)
  return (
    <div 
      ref={containerRef}
      className={`liquid-glass-active rounded-3xl p-6 border border-cyan-500/30 shadow-2xl relative overflow-hidden backdrop-blur-2xl transition-transform duration-200 ${className}`}
      style={{
        transform: `perspective(1000px) rotateX(${headTilt.rotateX}deg) rotateY(${headTilt.rotateY}deg)`
      }}
    >
      {/* Background Radial Glow */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Badge */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
        <div className="flex items-center gap-2">
          <Stethoscope className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-white tracking-wide">DR. SARTHI — AI CLINICAL INSPECTOR</span>
        </div>
        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold flex items-center gap-1">
          <Eye className="w-3 h-3 text-cyan-400" />
          <span>SCREEN GAZE INSPECTION ACTIVE</span>
        </span>
      </div>

      {/* Main Avatar + Speech Bubble Container */}
      <div className="flex flex-col sm:flex-row items-center gap-6">
        
        {/* Dynamic Doctor Character Face with Pupil Tracking */}
        <div 
          onClick={() => setQaOpen(true)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative w-32 h-32 flex-shrink-0 rounded-3xl bg-gradient-to-br from-slate-900 via-cyan-950/60 to-blue-950 border-2 border-cyan-500/40 shadow-xl flex items-center justify-center cursor-pointer group hover:border-cyan-400 transition-colors"
          title="Click to ask Dr. Sarthi clinical questions"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full p-2">
            <path d="M 50 15 L 50 85 M 15 50 L 85 50" stroke="rgba(6, 182, 212, 0.1)" strokeWidth="1" />
            <path d="M 15 88 Q 50 68 85 88 L 90 100 L 10 100 Z" fill="#0284c7" />
            <path d="M 32 72 L 50 100 L 68 72 Z" fill="#f0f9ff" />
            <path d="M 45 78 L 50 100 L 55 78 Z" fill="#0284c7" />
            <path d="M 28 76 C 28 94, 72 94, 72 76" stroke="#38bdf8" strokeWidth="4" fill="none" strokeLinecap="round" />
            <circle cx="50" cy="92" r="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="50" cy="44" r="26" fill="#1e293b" stroke="#38bdf8" strokeWidth="2.5" />
            <path d="M 24 40 C 24 20, 76 20, 76 40 Z" fill="#0f172a" />
            <rect x="36" y="18" width="28" height="10" rx="3" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
            <rect x="28" y="36" width="18" height="14" rx="4" fill="rgba(255,255,255,0.05)" stroke="#38bdf8" strokeWidth="2" />
            <rect x="54" y="36" width="18" height="14" rx="4" fill="rgba(255,255,255,0.05)" stroke="#38bdf8" strokeWidth="2" />
            <line x1="46" y1="43" x2="54" y2="43" stroke="#38bdf8" strokeWidth="2" />
            <circle cx="37" cy="43" r="6" fill="#ffffff" />
            <circle cx={37 + leftPupil.x} cy={43 + leftPupil.y} r="3" fill="#0369a1" />
            <circle cx={37 + leftPupil.x + 0.9} cy={43 + leftPupil.y - 0.9} r="1" fill="#ffffff" />
            <circle cx="63" cy="43" r="6" fill="#ffffff" />
            <circle cx={63 + rightPupil.x} cy={43 + rightPupil.y} r="3" fill="#0369a1" />
            <circle cx={63 + rightPupil.x + 0.9} cy={43 + rightPupil.y - 0.9} r="1" fill="#ffffff" />
            <path d="M 50 47 L 48 51 L 52 51 Z" fill="#38bdf8" opacity="0.6" />
            <path d="M 42 57 Q 50 64 58 57" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
          </svg>

          {/* Interactive Tap Pill */}
          <span className="absolute -bottom-2 text-[9px] font-mono px-2 py-0.5 rounded-full bg-cyan-500 text-slate-950 font-extrabold shadow-md group-hover:scale-110 transition-transform">
            ASK CLINICAL QA
          </span>
        </div>

        {/* Dynamic Interactive Speech & Inspection Box */}
        <div className="space-y-3 w-full">
          <div className="relative p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/30 text-xs text-cyan-100 font-sans leading-relaxed shadow-inner space-y-2">
            <p className="font-medium">{speechText}</p>
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span className="flex items-center gap-1 text-cyan-300">
                <Activity className="w-3 h-3 text-cyan-400" />
                <span>Target: <strong>{inspectTarget}</strong></span>
              </span>
              <span className="text-emerald-400 font-bold">REAL-TIME INSPECTOR</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 pt-1">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>PII Redacted</span>
            </div>
            <button 
              onClick={() => setQaOpen(true)}
              className="text-cyan-400 hover:underline font-bold flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Open Medical Q&A Drawer →</span>
            </button>
          </div>
        </div>

      </div>

      {/* CLINICAL QA DRAWER MODAL FOR CARD VARIANT */}
      {qaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="liquid-glass-active rounded-3xl p-6 sm:p-8 w-full max-w-lg border border-cyan-500/40 shadow-2xl relative overflow-hidden backdrop-blur-2xl space-y-6">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Dr. Sarthi — Clinical AI Assistant</h3>
                  <p className="text-xs text-slate-400 font-mono">INSTANT MEDICAL REPORT EXPLAINER</p>
                </div>
              </div>
              <button 
                onClick={() => { setQaOpen(false); setSelectedQa(null); }}
                className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedQa ? (
              <div className="space-y-4 animate-fadeIn">
                <button 
                  onClick={() => setSelectedQa(null)}
                  className="text-xs text-cyan-400 font-mono hover:underline flex items-center gap-1"
                >
                  ← Back to Questions
                </button>
                <div className="p-4 rounded-2xl bg-slate-900 border border-cyan-500/30 space-y-3">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-cyan-400" />
                    <span>{selectedQa.q}</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/70 p-3 rounded-xl border border-white/5">
                    {selectedQa.a}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs font-mono uppercase text-slate-400">SELECT A FREQUENT CLINICAL QUESTION:</p>
                <div className="space-y-2">
                  {CLINICAL_FAQS.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedQa(item)}
                      className="w-full text-left p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-cyan-500/40 text-xs font-medium text-slate-200 hover:text-white hover:bg-cyan-500/10 transition-all flex items-center justify-between group"
                    >
                      <span className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                        <span>{item.q}</span>
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400">
                <Check className="w-3.5 h-3.5" /> 6TH GRADE PLAIN ENGLISH
              </span>
              <span className="text-slate-500">HIPAA COMPLIANT</span>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
