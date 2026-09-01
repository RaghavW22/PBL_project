import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  Lock, 
  Sparkles,
  Loader2,
  Play
} from 'lucide-react';
import { SAMPLE_REPORTS_PRESETS } from '../data/mockData';
import { PatientProfile, LabParameter } from '../types';

interface ReportUploaderProps {
  onReportProcessed: (patient: PatientProfile, params: LabParameter[], fileName: string) => void;
  onShowToast: (msg: string, type?: 'info' | 'success' | 'warning') => void;
}

export const ReportUploader: React.FC<ReportUploaderProps> = ({
  onReportProcessed,
  onShowToast,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Scanning report OCR & extracting lab metrics...');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const simulateProcessing = (fileName: string, presetIndex = 0) => {
    setIsProcessing(true);
    setProgress(0);
    setStatusText(`Uploading "${fileName}" to encrypted memory...`);

    const preset = SAMPLE_REPORTS_PRESETS[presetIndex] || SAMPLE_REPORTS_PRESETS[0];

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 20;
      setProgress(currentProgress);

      if (currentProgress === 40) {
        setStatusText('Calculating Health Risk Index & Diet Protocol...');
      } else if (currentProgress === 80) {
        setStatusText('Synthesizing Multilingual Speech Accents...');
      } else if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsProcessing(false);
          onReportProcessed(preset.patient, preset.params, fileName);
          onShowToast(`Report "${fileName}" processed successfully! Dashboard updated below.`, 'success');
          
          // Scroll to dashboard
          const dash = document.getElementById('dashboard');
          if (dash) dash.scrollIntoView({ behavior: 'smooth' });
        }, 400);
      }
    }, 300);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      simulateProcessing(file.name, 0);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      simulateProcessing(file.name, 0);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-8">
      {/* Dropzone Container */}
      <div 
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleFileDrop}
        className={`liquid-glass rounded-3xl p-8 sm:p-10 border transition-all duration-300 relative overflow-hidden backdrop-blur-2xl ${
          isDragging ? 'liquid-glass-active border-cyan-400 scale-[1.01]' : 'border-white/15 hover:border-white/25'
        }`}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept=".pdf,.png,.jpg,.jpeg"
          className="hidden" 
        />

        {/* Normal Idle State */}
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-xl shadow-cyan-500/20 group hover:scale-110 transition-transform">
            <UploadCloud className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-md">
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Drop your Lab Report here or{' '}
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="text-cyan-400 underline underline-offset-4 hover:text-cyan-300 transition-colors cursor-pointer"
              >
                Browse Files
              </button>
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Supports PDF, PNG, JPG (Blood tests, Urine, Lipid, Thyroid & Metabolic Panels)
            </p>
          </div>

          {/* Feature Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <span className="text-xs font-mono px-3 py-1.5 rounded-full bg-slate-900/80 border border-white/10 text-slate-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              100% Private
            </span>
            <span className="text-xs font-mono px-3 py-1.5 rounded-full bg-slate-900/80 border border-white/10 text-slate-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              Voice Reader
            </span>
            <span className="text-xs font-mono px-3 py-1.5 rounded-full bg-slate-900/80 border border-white/10 text-slate-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
              AI Diet Plan
            </span>
          </div>

          {/* Quick Preset Buttons */}
          <div className="pt-4 border-t border-white/10 w-full flex flex-col sm:flex-row items-center justify-center gap-3">
            <span className="text-xs font-mono text-slate-400">OR TRY DEMO SAMPLE REPORTS:</span>
            {SAMPLE_REPORTS_PRESETS.map((preset, idx) => (
              <button
                key={preset.name}
                onClick={() => simulateProcessing(`${preset.name}.pdf`, idx)}
                className="text-xs font-medium px-3.5 py-1.5 rounded-full bg-slate-900 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 transition-colors flex items-center gap-1.5"
              >
                <Play className="w-3 h-3 fill-cyan-400" />
                <span>{preset.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Processing Animated Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center space-y-4">
            
            {/* Animated Laser Beam */}
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan absolute top-0 left-0"></div>

            <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 animate-spin">
              <Loader2 className="w-6 h-6" />
            </div>

            <div className="space-y-2 max-w-sm">
              <p className="text-sm font-semibold text-white">{statusText}</p>
              
              {/* Progress Bar Track */}
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-white/10">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 h-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-[10px] font-mono text-slate-400">{progress}% COMPLETED</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
