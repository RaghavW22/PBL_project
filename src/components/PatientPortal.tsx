import React, { useState } from 'react';
import { 
  FileText, 
  Globe, 
  LogOut, 
  User, 
  Download, 
  ArrowLeft, 
  ShieldCheck, 
  Sparkles,
  ChevronDown,
  FileUp,
  LayoutDashboard
} from 'lucide-react';
import { ReportUploader } from './ReportUploader';
import { DigitalDashboard } from './DigitalDashboard';
import { Footer } from './Footer';
import { GazeMedicalReader } from './GazeMedicalReader';
import { PatientProfile, LabParameter } from '../types';
import { INDIAN_VOICE_LOCALES } from '../data/mockData';

interface PatientPortalProps {
  userEmail: string;
  patient: PatientProfile;
  parameters: LabParameter[];
  selectedLang: string;
  onSelectLang: (lang: string) => void;
  onLogout: () => void;
  onReportProcessed: (patient: PatientProfile, params: LabParameter[], fileName: string) => void;
  onShowToast: (msg: string, type?: 'info' | 'success' | 'warning') => void;
  onReturnToLanding: () => void;
}

export const PatientPortal: React.FC<PatientPortalProps> = ({
  userEmail,
  patient,
  parameters,
  selectedLang,
  onSelectLang,
  onLogout,
  onReportProcessed,
  onShowToast,
  onReturnToLanding,
}) => {
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const activeLocale = INDIAN_VOICE_LOCALES.find(l => l.code === selectedLang) || INDIAN_VOICE_LOCALES[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Background Dark Slate Gradient */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950/30 via-slate-950 to-slate-950 pointer-events-none z-0"></div>

      {/* PORTAL TOP NAVBAR */}
      <header className="sticky top-4 left-0 right-0 z-50 px-4 max-w-7xl mx-auto mb-8">
        <div className="liquid-glass-active rounded-full px-5 py-3 flex items-center justify-between border border-cyan-500/30 shadow-2xl backdrop-blur-2xl">
          
          {/* Left Brand Logo & Portal Tag */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 p-[1px] flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950/80 rounded-full flex items-center justify-center backdrop-blur-sm">
                <FileText className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                Report<span className="text-cyan-400">Sarthi</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                  PATIENT PORTAL
                </span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono tracking-wider">AUTHENTICATED WORKSPACE</span>
            </div>
          </div>

          {/* Right Action Group */}
          <div className="flex items-center gap-3">
            
            {/* Indian Language Selector */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-full bg-slate-900/80 border border-white/15 text-slate-200 hover:border-cyan-500/40 transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>{activeLocale.flag} {activeLocale.name}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 py-2 liquid-glass-active rounded-2xl border border-white/20 shadow-2xl z-50 backdrop-blur-2xl">
                  <div className="px-3 py-1 text-[10px] font-mono uppercase text-slate-400 border-b border-white/10 mb-1">
                    Select Speech & Summary Locale
                  </div>
                  {INDIAN_VOICE_LOCALES.map((locale) => (
                    <button
                      key={locale.code}
                      onClick={() => {
                        onSelectLang(locale.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-cyan-500/20 transition-colors ${
                        selectedLang === locale.code ? 'text-cyan-300 font-semibold bg-cyan-500/10' : 'text-slate-300'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{locale.flag}</span>
                        <span>{locale.name}</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{locale.nativeName}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Back to Landing Page Overview */}
            <button
              onClick={onReturnToLanding}
              className="hidden md:flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-full bg-slate-900 border border-white/15 text-slate-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Public Overview</span>
            </button>

            {/* Logged in User Profile Pill */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline font-bold">{userEmail ? userEmail.split('@')[0] : 'Patient'}</span>
            </div>

            {/* Log Out Button */}
            <button
              onClick={onLogout}
              className="p-2 rounded-full hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>

          </div>

        </div>
      </header>

      {/* PORTAL MAIN CONTENT WORKSPACE */}
      <main className="relative z-10 space-y-12 pb-16">
        
        {/* Portal Header Welcome Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-white/15 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-2xl">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
                <LayoutDashboard className="w-3.5 h-3.5 text-cyan-400" />
                <span>PATIENT CLINICAL WORKSPACE</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Welcome to Your Health Portal, <span className="text-cyan-400">{userEmail ? userEmail.split('@')[0] : 'Patient'}</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Upload your lab test PDF or image below to decode clinical parameters, generate plain-English summaries, listen to speech in 9 Indian regional languages, and view tailored diet plans.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onReturnToLanding}
                className="md:hidden text-xs font-mono px-4 py-2 rounded-xl bg-slate-900 border border-white/15 text-slate-300"
              >
                View Public Overview
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 1: REPORT UPLOADER DROPZONE */}
        <section id="uploader-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center justify-center gap-2">
              <FileUp className="w-5 h-5 text-cyan-400" />
              Upload Medical Lab Report
            </h2>
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
          selectedLang={selectedLang}
          onShowToast={onShowToast}
        />

      </main>

      {/* PORTAL FOOTER (DISCLAIMER ONLY) */}
      <Footer />

      {/* Floating Gaze-to-Explain Medical Reader Lens */}
      <div className="fixed bottom-6 right-6 z-40 hidden md:block">
        <GazeMedicalReader />
      </div>

    </div>
  );
};
