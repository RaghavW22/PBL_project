import React, { useState } from 'react';
import { 
  FileText, 
  ArrowLeft, 
  LayoutDashboard,
  Eye,
  X,
  Copy,
  Check,
  FileUp,
  Sparkles
} from 'lucide-react';
import { ReportUploader } from './ReportUploader';
import { DigitalDashboard } from './DigitalDashboard';
import { PatientProfile, LabParameter, DietPlan } from '../types';

interface PatientPortalProps {
  userEmail: string;
  patient: PatientProfile;
  parameters: LabParameter[];
  dietPlan?: DietPlan;
  rawExtractedText?: string;
  selectedLang: string;
  onSelectLang: (lang: string) => void;
  onLogout: () => void;
  onReportProcessed: (
    patient: PatientProfile, 
    params: LabParameter[], 
    fileName: string, 
    rawText?: string, 
    dietPlan?: DietPlan
  ) => void;
  onShowToast: (msg: string, type?: 'info' | 'success' | 'warning') => void;
  onReturnToLanding: () => void;
}

export const PatientPortal: React.FC<PatientPortalProps> = ({
  userEmail,
  patient,
  parameters,
  dietPlan,
  rawExtractedText,
  selectedLang,
  onSelectLang,
  onLogout,
  onReportProcessed,
  onShowToast,
  onReturnToLanding,
}) => {
  const [showOcrModal, setShowOcrModal] = useState(false);
  const [copiedOcr, setCopiedOcr] = useState(false);

  const handleCopyOcr = () => {
    if (rawExtractedText) {
      navigator.clipboard.writeText(rawExtractedText);
      setCopiedOcr(true);
      setTimeout(() => setCopiedOcr(false), 2000);
      onShowToast('Extracted OCR text copied to clipboard!', 'success');
    }
  };

  const displayName = userEmail && userEmail !== 'Patient' ? userEmail.split('@')[0] : 'Patient';

  return (
    <div className="relative z-10 space-y-12 pb-16 pt-28">
      {/* Portal Header Welcome Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-white/15 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-2xl">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
              <LayoutDashboard className="w-3.5 h-3.5 text-cyan-400" />
              <span>PATIENT CLINICAL WORKSPACE</span>
              <span className="text-slate-500">•</span>
              <span className="text-emerald-400 font-semibold">LIVE AI ENGINE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome to Your Health Portal, <span className="text-cyan-400">{displayName}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Upload your medical test PDF, image, or capture pages with the live camera. Tesseract 5.5 OCR and MedGemma 1.5 Flash extract all biomarkers, generate plain-English explanations, audio synthesis in 9 Indian regional languages, and custom clinical diet protocols.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            {rawExtractedText && (
              <button
                onClick={() => setShowOcrModal(true)}
                className="px-4 py-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-semibold hover:bg-cyan-500/30 transition-all flex items-center gap-2"
              >
                <Eye className="w-4 h-4 text-cyan-400" />
                <span>Inspect OCR Text</span>
              </button>
            )}

            <button
              onClick={onReturnToLanding}
              className="flex items-center gap-1.5 text-xs font-mono px-4 py-2.5 rounded-xl bg-slate-900/90 border border-white/15 text-slate-300 hover:text-white hover:border-cyan-500/40 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Public Overview</span>
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 1: REPORT UPLOADER DROPZONE & MULTI-PAGE CAMERA */}
      <section id="uploader-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-32">
        <div className="text-center max-w-2xl mx-auto mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs font-mono mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>STEP 1: INGESTION</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center justify-center gap-2">
            <FileUp className="w-5 h-5 text-cyan-400" />
            Upload Medical Lab Report
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Drop your CBC, Lipid Profile, or metabolic panel PDF or photo below to run automated AI extraction.
          </p>
        </div>
        <ReportUploader 
          onReportProcessed={onReportProcessed}
          onShowToast={onShowToast}
        />
      </section>

      {/* SECTION 2: DIGITAL HEALTH DASHBOARD */}
      <DigitalDashboard 
        patient={patient}
        parameters={parameters}
        dietPlan={dietPlan}
        selectedLang={selectedLang}
        onSelectLang={onSelectLang}
        onShowToast={onShowToast}
      />

      {/* RAW EXTRACTED OCR TEXT INSPECTION MODAL */}
      {showOcrModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-3xl liquid-glass-active rounded-3xl border border-cyan-500/40 shadow-2xl p-6 sm:p-8 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <FileText className="w-5 h-5 text-cyan-400" />
                <span>Extracted OCR Report Text</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {rawExtractedText ? `${rawExtractedText.length} characters` : 'No text'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyOcr}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 border border-white/15 text-xs text-slate-300 hover:text-white flex items-center gap-1.5"
                >
                  {copiedOcr ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedOcr ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={() => setShowOcrModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto font-mono text-xs text-slate-300 bg-slate-950/70 p-4 rounded-2xl border border-white/10 leading-relaxed whitespace-pre-wrap selection:bg-cyan-500/30 selection:text-cyan-100">
              {rawExtractedText || 'No extracted text recorded yet. Please upload or photograph a report.'}
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
              <span>Engine: Tesseract 5.5 OCR + pdfplumber + MedGemma 1.5 Flash</span>
              <button
                onClick={() => setShowOcrModal(false)}
                className="px-4 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
