import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Volume2, 
  Activity, 
  CheckCircle2, 
  Lock,
  LogIn
} from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  isLoggedIn: boolean;
  onNavigate?: (sectionId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onOpenAuth, isLoggedIn, onNavigate }) => {
  return (
    <section id="overview" className="relative pt-36 pb-20 md:pt-44 md:pb-28 overflow-hidden scroll-mt-32">
      {/* Glowing Radial Background Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT COLUMN: Copy & Action Group */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6">
            
            {/* Status Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-wide shadow-lg shadow-cyan-500/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>CLINICAL AI DASHBOARD ENGINE</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300">HIPAA-COMPLIANT DESIGN</span>
            </div>

            {/* Bold Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
              Turn Confusing <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent underline decoration-cyan-500/40 decoration-wavy underline-offset-8">
                Medical Reports
              </span> <br />
              Into An AI Health Dashboard
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
              ReportSarthi decodes complex clinical jargon into plain 6th-grade English. Log in to upload lab test PDFs or photos to instantly generate an executive AI summary, voice audio reader in 9 Indian regional languages, health risk score gauge, and personalized diet plan.
            </p>

            {/* Action Group Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2 w-full sm:w-auto">
              {isLoggedIn ? (
                <button
                  onClick={onExploreClick}
                  className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 text-slate-950 font-bold text-base shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all group"
                >
                  <span>Upload Medical Report</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <button
                  onClick={() => onOpenAuth('login')}
                  className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 text-slate-950 font-bold text-base shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all group"
                >
                  <LogIn className="w-5 h-5 text-slate-950" />
                  <span>Log In to Access Dashboard</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              )}

              <a
                href="#bento"
                onClick={(e) => {
                  if (onNavigate) {
                    e.preventDefault();
                    onNavigate('bento');
                  }
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 rounded-2xl liquid-glass text-white font-medium text-base hover:border-white/30 hover:bg-white/10 transition-all border border-white/15"
              >
                <span>Features & Architecture</span>
              </a>
            </div>

            {/* Feature Pills Footer */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs font-mono text-slate-400 border-t border-white/10 w-full">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>100% Private & Masked</span>
              </div>
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-cyan-400" />
                <span>9 Indian Speech Accents</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" />
                <span>Weighted Health Risk Index</span>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Glassmorphic Preview Container */}
          <div className="lg:col-span-5 relative space-y-6">
            
            {/* Main Interactive Preview Card Mockup */}
            <div className="liquid-glass-active rounded-3xl p-6 border border-white/20 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
              
              {/* Window Controls Top Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-mono text-slate-400">reportsarthi_engine_v2.4</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-mono text-cyan-300 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                  <Lock className="w-3 h-3" />
                  <span>256-BIT ENCRYPTED</span>
                </div>
              </div>

              {/* Mockup Body Content */}
              <div className="space-y-4">
                
                {/* Mock Patient Card */}
                <div className="bg-slate-900/80 rounded-2xl p-4 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 font-extrabold flex items-center justify-center text-sm shadow-md">
                      JM
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white tracking-wider">DOE, JANE M.</h4>
                      <p className="text-[10px] text-slate-400 font-mono">38 YRS • FEMALE • BLOOD PANEL</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    LOW RISK 88/100
                  </span>
                </div>

                {/* Mock Parameter Item */}
                <div className="bg-slate-900/60 rounded-2xl p-3.5 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">Neutrophils (Absolute)</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">HIGH (72%)</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed bg-slate-950/60 p-2 rounded-xl border border-white/5 font-sans">
                    💡 <strong className="text-cyan-300">Plain English AI:</strong> Slightly elevated. Neutrophils act like immune firefighters clearing minor inflammation or routine infection recovery.
                  </p>
                </div>

                {/* Mock Voice Wave Bar */}
                <div className="bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 rounded-2xl p-3 border border-cyan-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                      <Volume2 className="w-4 h-4" />
                    </div>
                    <div className="text-xs">
                      <p className="font-bold text-cyan-300">Voice Synthesis Active</p>
                      <p className="text-[10px] font-mono text-slate-400">Hindi (हिन्दी) 🇮🇳 Locale</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="equalizer-bar" style={{ animationDelay: '0.1s' }}></span>
                    <span className="equalizer-bar" style={{ animationDelay: '0.4s' }}></span>
                    <span className="equalizer-bar" style={{ animationDelay: '0.2s' }}></span>
                    <span className="equalizer-bar" style={{ animationDelay: '0.5s' }}></span>
                    <span className="equalizer-bar" style={{ animationDelay: '0.3s' }}></span>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
