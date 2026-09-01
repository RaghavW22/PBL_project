import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Eye, Activity, Heart, Shield, Stethoscope } from 'lucide-react';

interface CursorDoctorProps {
  className?: string;
  variant?: 'card' | 'floating';
}

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
  const [speechText, setSpeechText] = useState("👋 I'm Dr. Sarthi! I'm watching your cursor.");

  const messages = [
    "👀 I follow your cursor wherever you explore!",
    "🩺 Ready to analyze your blood report parameters!",
    "💡 Move your mouse around to guide my attention!",
    "✨ 100% HIPAA compliant clinical AI assistant!"
  ];

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
      const shiftRatio = Math.min(distance / 150, 1);
      const pupilX = Math.cos(angle) * (maxShift * shiftRatio);
      const pupilY = Math.sin(angle) * (maxShift * shiftRatio);

      setLeftPupil({ x: pupilX, y: pupilY });
      setRightPupil({ x: pupilX, y: pupilY });

      // Subtle 3D card tilt
      const rotateY = Math.max(-12, Math.min(12, (deltaX / window.innerWidth) * 25));
      const rotateX = Math.max(-12, Math.min(12, -(deltaY / window.innerHeight) * 25));
      setHeadTilt({ rotateX, rotateY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleCharacterClick = () => {
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    setSpeechText(randomMsg);
  };

  if (variant === 'floating') {
    return (
      <div className="fixed bottom-6 left-6 z-40 hidden md:block animate-fadeIn">
        <div 
          ref={containerRef}
          onClick={handleCharacterClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="liquid-glass-active rounded-3xl p-3 border border-cyan-500/40 shadow-2xl backdrop-blur-2xl flex items-center gap-3 cursor-pointer group hover:scale-105 transition-all"
        >
          {/* Eye Doctor Avatar Container */}
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-slate-900 to-blue-600/30 border border-cyan-400/40 flex items-center justify-center overflow-hidden">
            {/* SVG Doctor Face with Real-time Pupil Movement */}
            <svg viewBox="0 0 100 100" className="w-full h-full p-1">
              {/* Doctor Coat & Collar */}
              <path d="M 20 85 Q 50 65 80 85 L 85 100 L 15 100 Z" fill="#0284c7" opacity="0.8" />
              <path d="M 35 70 L 50 100 L 65 70 Z" fill="#e0f2fe" />
              
              {/* Stethoscope Loop */}
              <path d="M 30 75 C 30 90, 70 90, 70 75" stroke="#06b6d4" strokeWidth="4" fill="none" strokeLinecap="round" />
              <circle cx="50" cy="88" r="4" fill="#38bdf8" />

              {/* Head Circle */}
              <circle cx="50" cy="45" r="28" fill="#fde047" opacity="0.15" />
              <circle cx="50" cy="45" r="24" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />

              {/* Doctor Hair / Cap */}
              <path d="M 26 40 C 26 22, 74 22, 74 40 Z" fill="#0f172a" />
              <path d="M 35 25 Q 50 18 65 25" stroke="#38bdf8" strokeWidth="2" fill="none" />

              {/* Glasses Frame */}
              <rect x="30" y="38" width="16" height="12" rx="3" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
              <rect x="54" y="38" width="16" height="12" rx="3" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
              <line x1="46" y1="44" x2="54" y2="44" stroke="#38bdf8" strokeWidth="1.5" />

              {/* EYE SOCKET 1 (LEFT) */}
              <circle cx="38" cy="44" r="5" fill="#ffffff" />
              {/* PUPIL 1 - Moves towards cursor */}
              <circle 
                cx={38 + leftPupil.x} 
                cy={44 + leftPupil.y} 
                r="2.5" 
                fill="#0284c7" 
              />
              <circle 
                cx={38 + leftPupil.x + 0.8} 
                cy={44 + leftPupil.y - 0.8} 
                r="0.8" 
                fill="#ffffff" 
              />

              {/* EYE SOCKET 2 (RIGHT) */}
              <circle cx="62" cy="44" r="5" fill="#ffffff" />
              {/* PUPIL 2 - Moves towards cursor */}
              <circle 
                cx={62 + rightPupil.x} 
                cy={44 + rightPupil.y} 
                r="2.5" 
                fill="#0284c7" 
              />
              <circle 
                cx={62 + rightPupil.x + 0.8} 
                cy={44 + rightPupil.y - 0.8} 
                r="0.8" 
                fill="#ffffff" 
              />

              {/* Smile */}
              <path d="M 43 56 Q 50 62 57 56" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>

          <div className="flex flex-col pr-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Dr. Sarthi AI</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </span>
            <span className="text-[10px] text-slate-300 font-mono">
              {isHovered ? "Analyzing cursor coordinates..." : "Eyes tracking your cursor"}
            </span>
          </div>
        </div>
      </div>
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
          <span className="text-xs font-bold text-white tracking-wide">DR. SARTHI AI ASSISTANT</span>
        </div>
        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          CURSOR TRACKING ACTIVE
        </span>
      </div>

      {/* Main Avatar + Speech Bubble Container */}
      <div className="flex flex-col sm:flex-row items-center gap-6">
        
        {/* Dynamic Doctor Character Face with Pupil Tracking */}
        <div 
          onClick={handleCharacterClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative w-32 h-32 flex-shrink-0 rounded-3xl bg-gradient-to-br from-slate-900 via-cyan-950/60 to-blue-950 border-2 border-cyan-500/40 shadow-xl flex items-center justify-center cursor-pointer group hover:border-cyan-400 transition-colors"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full p-2">
            {/* Background Medical Cross Grid */}
            <path d="M 50 15 L 50 85 M 15 50 L 85 50" stroke="rgba(6, 182, 212, 0.1)" strokeWidth="1" />

            {/* Doctor Lab Coat */}
            <path d="M 15 88 Q 50 68 85 88 L 90 100 L 10 100 Z" fill="#0284c7" />
            <path d="M 32 72 L 50 100 L 68 72 Z" fill="#f0f9ff" />
            <path d="M 45 78 L 50 100 L 55 78 Z" fill="#0284c7" />

            {/* Stethoscope */}
            <path d="M 28 76 C 28 94, 72 94, 72 76" stroke="#38bdf8" strokeWidth="4" fill="none" strokeLinecap="round" />
            <circle cx="50" cy="92" r="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />

            {/* Head */}
            <circle cx="50" cy="44" r="26" fill="#1e293b" stroke="#38bdf8" strokeWidth="2.5" />

            {/* Hair / Doctor Cap */}
            <path d="M 24 40 C 24 20, 76 20, 76 40 Z" fill="#0f172a" />
            <rect x="36" y="18" width="28" height="10" rx="3" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
            <cross x="50" y="23" className="text-white" />

            {/* Eyeglasses Frame */}
            <rect x="28" y="36" width="18" height="14" rx="4" fill="rgba(255,255,255,0.05)" stroke="#38bdf8" strokeWidth="2" />
            <rect x="54" y="36" width="18" height="14" rx="4" fill="rgba(255,255,255,0.05)" stroke="#38bdf8" strokeWidth="2" />
            <line x1="46" y1="43" x2="54" y2="43" stroke="#38bdf8" strokeWidth="2" />

            {/* EYE SOCKET 1 (LEFT EYE) */}
            <circle cx="37" cy="43" r="6" fill="#ffffff" />
            {/* REAL-TIME CURSOR-TRACKING PUPIL 1 */}
            <circle 
              cx={37 + leftPupil.x} 
              cy={43 + leftPupil.y} 
              r="3" 
              fill="#0369a1" 
            />
            <circle 
              cx={37 + leftPupil.x + 0.9} 
              cy={43 + leftPupil.y - 0.9} 
              r="1" 
              fill="#ffffff" 
            />

            {/* EYE SOCKET 2 (RIGHT EYE) */}
            <circle cx="63" cy="43" r="6" fill="#ffffff" />
            {/* REAL-TIME CURSOR-TRACKING PUPIL 2 */}
            <circle 
              cx={63 + rightPupil.x} 
              cy={43 + rightPupil.y} 
              r="3" 
              fill="#0369a1" 
            />
            <circle 
              cx={63 + rightPupil.x + 0.9} 
              cy={43 + rightPupil.y - 0.9} 
              r="1" 
              fill="#ffffff" 
            />

            {/* Nose & Smile */}
            <path d="M 50 47 L 48 51 L 52 51 Z" fill="#38bdf8" opacity="0.6" />
            <path d="M 42 57 Q 50 64 58 57" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
          </svg>

          {/* Interactive Tap Pill */}
          <span className="absolute -bottom-2 text-[9px] font-mono px-2 py-0.5 rounded-full bg-cyan-500 text-slate-950 font-extrabold shadow-md group-hover:scale-110 transition-transform">
            TAP ME
          </span>
        </div>

        {/* Dynamic Interactive Speech Bubble */}
        <div className="space-y-3 w-full">
          <div className="relative p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/30 text-xs text-cyan-100 font-sans leading-relaxed shadow-inner">
            <p className="font-medium">{speechText}</p>
            <p className="text-[10px] text-slate-400 font-mono mt-2 pt-2 border-t border-white/10 flex items-center justify-between">
              <span>Pupil Coordinates: ({leftPupil.x.toFixed(1)}, {leftPupil.y.toFixed(1)})</span>
              <span className="text-cyan-400 font-bold">LIVE TRACKING</span>
            </p>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono text-slate-300">
            <div className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span>Mouse Gaze Active</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-teal-400" />
              <span>Real-Time OCR Companion</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
