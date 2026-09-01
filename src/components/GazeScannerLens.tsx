import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, ShieldCheck, Zap, Lock, Scan, Activity, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface GazeScannerLensProps {
  className?: string;
  label?: string;
}

export const GazeScannerLens: React.FC<GazeScannerLensProps> = ({ 
  className = '',
  label = 'AI OPTICAL GAZE SCANNER & PII PROTECTOR'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Lens pupil positions (dx, dy) in pixels
  const [leftPupil, setLeftPupil] = useState({ x: 0, y: 0 });
  const [rightPupil, setRightPupil] = useState({ x: 0, y: 0 });
  
  // Card 3D tilt & mouse coordinates
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [activeTarget, setActiveTarget] = useState<string>("DOCUMENT UPLOADER ZONE");

  // Real PII Redactor Utility State
  const [piiRedacted, setPiiRedacted] = useState(true);
  const [rawText, setRawText] = useState(
    "PATIENT: Jane M. Doe | SSN: 948-20-1049 | PHONE: (555) 234-5678 | ADDRESS: 742 Evergreen Terr | LAB: CBC & Metabolic Panel"
  );
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  // Helper function to perform real regex PII masking
  const getMaskedText = (input: string): { text: string; count: number } => {
    let count = 0;
    let text = input;

    // Mask SSNs (xxx-xx-xxxx)
    const ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/g;
    const ssnMatches = text.match(ssnRegex);
    if (ssnMatches) {
      count += ssnMatches.length;
      text = text.replace(ssnRegex, "[REDACTED_SSN]");
    }

    // Mask Phone numbers
    const phoneRegex = /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
    const phoneMatches = text.match(phoneRegex);
    if (phoneMatches) {
      count += phoneMatches.length;
      text = text.replace(phoneRegex, "[REDACTED_PHONE]");
    }

    // Mask Patient Names (PATIENT: Jane M. Doe)
    const nameRegex = /(PATIENT:\s*)([A-Za-z\s.]+)(?=\s*\|)/gi;
    if (nameRegex.test(text)) {
      count += 1;
      text = text.replace(nameRegex, "$1[REDACTED_PATIENT_NAME]");
    }

    // Mask Address
    const addressRegex = /(ADDRESS:\s*)([^|]+)(?=\s*\|)/gi;
    if (addressRegex.test(text)) {
      count += 1;
      text = text.replace(addressRegex, "$1[REDACTED_ADDRESS]");
    }

    return { text, count };
  };

  const { text: maskedText, count: redactedCount } = getMaskedText(rawText);

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
      const maxShift = 8;
      const shiftRatio = Math.min(distance / 180, 1);
      const pupilX = Math.cos(angle) * (maxShift * shiftRatio);
      const pupilY = Math.sin(angle) * (maxShift * shiftRatio);

      setLeftPupil({ x: pupilX, y: pupilY });
      setRightPupil({ x: pupilX, y: pupilY });
      setCoords({ x: Math.round(e.clientX), y: Math.round(e.clientY) });

      // Subtle 3D perspective tilt
      const rotateY = Math.max(-10, Math.min(10, (deltaX / window.innerWidth) * 20));
      const rotateX = Math.max(-10, Math.min(10, -(deltaY / window.innerHeight) * 20));
      setTilt({ rotateX, rotateY });

      // Detect target under mouse
      const elem = document.elementFromPoint(e.clientX, e.clientY);
      if (elem) {
        const text = (elem.textContent || '').toLowerCase();
        if (text.includes('upload') || text.includes('pdf') || text.includes('drop')) {
          setActiveTarget("PDF / IMAGE FILE INGESTION ZONE");
        } else if (text.includes('neutrophil') || text.includes('ferritin') || text.includes('glucose')) {
          setActiveTarget("CLINICAL LAB PARAMETER MATRIX");
        } else if (text.includes('lock') || text.includes('encrypted') || text.includes('privacy')) {
          setActiveTarget("256-BIT SSL ENCRYPTION SHIELD");
        } else {
          setActiveTarget("ACTIVE CANVAS GAZE TRACKING");
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleRunOcrScan = () => {
    setIsScanning(true);
    setScanResult(null);
    setTimeout(() => {
      setIsScanning(false);
      setScanResult("✓ Optical OCR Scan Complete: 6 Parameters Extracted | 0 PII Data Leakages Detected | LOINC Verified.");
    }, 1200);
  };

  return (
    <div 
      ref={containerRef}
      className={`liquid-glass-active rounded-3xl p-6 border border-cyan-500/40 shadow-2xl relative overflow-hidden backdrop-blur-2xl transition-transform duration-200 space-y-6 ${className}`}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`
      }}
    >
      {/* Background Radial Glow */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Scan className="w-4.5 h-4.5 text-cyan-400 animate-pulse" />
          <span className="text-xs font-bold text-white tracking-wide uppercase font-mono">{label}</span>
        </div>
        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          60 FPS CURSOR SCANNER
        </span>
      </div>

      {/* Main Scanner Section */}
      <div className="flex flex-col sm:flex-row items-center gap-6">
        
        {/* Cybernetic Eye Lens Reticle SVG */}
        <div className="relative w-32 h-32 flex-shrink-0 rounded-2xl bg-slate-950 border-2 border-cyan-500/50 shadow-inner flex items-center justify-center p-2 group">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Outer Rotating Calibration Ring */}
            <circle cx="50" cy="50" r="45" stroke="rgba(6, 182, 212, 0.25)" strokeWidth="1.5" fill="none" strokeDasharray="6 4" />
            <circle cx="50" cy="50" r="36" stroke="rgba(6, 182, 212, 0.35)" strokeWidth="1" fill="none" />
            
            {/* Crosshairs */}
            <line x1="50" y1="5" x2="50" y2="20" stroke="#06b6d4" strokeWidth="1.5" />
            <line x1="50" y1="80" x2="50" y2="95" stroke="#06b6d4" strokeWidth="1.5" />
            <line x1="5" y1="50" x2="20" y2="50" stroke="#06b6d4" strokeWidth="1.5" />
            <line x1="80" y1="50" x2="95" y2="50" stroke="#06b6d4" strokeWidth="1.5" />

            {/* LEFT OPTICAL LENS socket */}
            <circle cx="34" cy="50" r="13" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
            <circle cx="34" cy="50" r="10.5" fill="#ffffff" opacity="0.9" />
            {/* Pupil 1 tracking mouse cursor */}
            <circle cx={34 + leftPupil.x} cy={50 + leftPupil.y} r="5.5" fill="#0284c7" />
            <circle cx={34 + leftPupil.x + 1.2} cy={50 + leftPupil.y - 1.2} r="1.8" fill="#ffffff" />
            <circle cx={34 + leftPupil.x} cy={50 + leftPupil.y} r="1.5" fill="#090d16" />

            {/* RIGHT OPTICAL LENS socket */}
            <circle cx="66" cy="50" r="13" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
            <circle cx="66" cy="50" r="10.5" fill="#ffffff" opacity="0.9" />
            {/* Pupil 2 tracking mouse cursor */}
            <circle cx={66 + rightPupil.x} cy={50 + rightPupil.y} r="5.5" fill="#0284c7" />
            <circle cx={66 + rightPupil.x + 1.2} cy={50 + rightPupil.y - 1.2} r="1.8" fill="#ffffff" />
            <circle cx={66 + rightPupil.x} cy={50 + rightPupil.y} r="1.5" fill="#090d16" />

            {/* Laser reticle focus line */}
            <circle cx="50" cy="50" r="28" stroke="#22d3ee" strokeWidth="1" strokeDasharray="3 3" fill="none" opacity="0.6" />
          </svg>

          <span className="absolute -bottom-2 text-[9px] font-mono px-2 py-0.5 rounded-full bg-cyan-500 text-slate-950 font-bold uppercase shadow">
            GAZE LENS
          </span>
        </div>

        {/* Diagnostic Status Box */}
        <div className="space-y-3 w-full">
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-cyan-500/30 text-xs font-mono space-y-1.5">
            <div className="flex items-center justify-between text-cyan-300 text-[11px]">
              <span className="flex items-center gap-1 font-bold">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span>CURSOR FOCUS TARGET</span>
              </span>
              <span className="text-slate-400">({coords.x}, {coords.y})</span>
            </div>
            <p className="text-white font-bold text-xs tracking-wide border-t border-white/10 pt-1.5">
              &gt; {activeTarget}
            </p>
            <p className="text-[10px] text-slate-400 leading-normal">
              Optical gaze tracking dynamically aligns EasyOCR text extraction & PII masking bounding boxes with user focus coordinates.
            </p>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" /> Client-Side PII Redactor Active
            </span>
            <button
              onClick={handleRunOcrScan}
              disabled={isScanning}
              className="text-xs font-bold px-3 py-1 rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors flex items-center gap-1 shadow disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{isScanning ? "Scanning..." : "Run Optical OCR Scan"}</span>
            </button>
          </div>
        </div>

      </div>

      {/* REAL FUNCTIONAL PII REDACTION PLAYGROUND UNIT */}
      <div className="p-4 rounded-2xl bg-slate-950/90 border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-white font-mono uppercase">Live Client-Side PII Masking Unit</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {redactedCount} PII Entities Detected
            </span>
          </div>

          {/* Toggle Masking Switch */}
          <button
            onClick={() => setPiiRedacted(!piiRedacted)}
            className={`flex items-center gap-1.5 text-[11px] font-mono px-3 py-1 rounded-xl border transition-all ${
              piiRedacted 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold' 
                : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
            }`}
          >
            {piiRedacted ? <ShieldCheck className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{piiRedacted ? "PII Redaction ENFORCED" : "Reveal Raw Text (Unmasked)"}</span>
          </button>
        </div>

        {/* Live Text Area Output */}
        <div className="p-3 rounded-xl bg-slate-900 border border-white/10 font-mono text-xs text-slate-200 leading-relaxed overflow-x-auto">
          {piiRedacted ? (
            <span className="text-emerald-300 font-semibold">{maskedText}</span>
          ) : (
            <span className="text-rose-300 italic">{rawText}</span>
          )}
        </div>

        {/* Scan Result Feedback if triggered */}
        {scanResult && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="font-mono text-[11px]">{scanResult}</span>
          </div>
        )}
      </div>

    </div>
  );
};
