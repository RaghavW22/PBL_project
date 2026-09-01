import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { BentoGrid } from './components/BentoGrid';
import { TechArchitecture } from './components/TechArchitecture';
import { ClinicalMetrics } from './components/ClinicalMetrics';
import { FAQSection } from './components/FAQSection';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { PatientPortal } from './components/PatientPortal';
import { GazeMedicalReader } from './components/GazeMedicalReader';

import { AuthProvider, useAuth } from './context/AuthContext';

import { INITIAL_PATIENT, INITIAL_LAB_PARAMETERS } from './data/mockData';
import { PatientProfile, LabParameter } from './types';
import { CheckCircle2, AlertCircle, Info, LayoutDashboard, ArrowRight, Loader2 } from 'lucide-react';

function AppContent() {
  const { user, loading, logout } = useAuth();

  const [selectedLang, setSelectedLang] = useState('en-IN');
  const [patient, setPatient] = useState<PatientProfile>(INITIAL_PATIENT);
  const [parameters, setParameters] = useState<LabParameter[]>(INITIAL_LAB_PARAMETERS);
  
  const [showPortal, setShowPortal] = useState(false);

  // Auth Modal State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  // Toast Notification State
  const [toasts, setToasts] = useState<Array<{ id: number; msg: string; type: 'info' | 'success' | 'warning' }>>([]);

  const isLoggedIn = !!user;
  const userEmail = user?.email || user?.displayName || 'Patient';

  useEffect(() => {
    if (user) {
      setShowPortal(true);
    }
  }, [user]);

  const showToast = (msg: string, type: 'info' | 'success' | 'warning' = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleSuccessLogin = (email: string) => {
    setShowPortal(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setShowPortal(false);
      showToast('You have been logged out securely.', 'info');
    } catch (err: any) {
      showToast('Error logging out from Firebase', 'warning');
    }
  };

  const handleReportProcessed = (newPatient: PatientProfile, newParams: LabParameter[], fileName: string) => {
    setPatient(newPatient);
    setParameters(newParams);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-cyan-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="text-xs font-mono tracking-wider">Connecting to Firebase Session...</span>
      </div>
    );
  }

  // IF LOGGED IN AND IN PORTAL VIEW: Render Dedicated Patient Portal Page
  if (isLoggedIn && showPortal) {
    return (
      <>
        {/* Toast Notification Container */}
        <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4">
          {toasts.map(toast => (
            <div 
              key={toast.id}
              className={`pointer-events-auto liquid-glass-active p-4 rounded-2xl border shadow-2xl backdrop-blur-2xl text-xs flex items-start gap-3 transition-all duration-300 animate-slideUp ${
                toast.type === 'success' ? 'border-emerald-500/40 text-emerald-200' :
                toast.type === 'warning' ? 'border-amber-500/40 text-amber-200' :
                'border-cyan-500/40 text-cyan-200'
              }`}
            >
              {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" /> :
               toast.type === 'warning' ? <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" /> :
               <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />}
              <span className="leading-relaxed font-medium">{toast.msg}</span>
            </div>
          ))}
        </div>

        <PatientPortal 
          userEmail={userEmail}
          patient={patient}
          parameters={parameters}
          selectedLang={selectedLang}
          onSelectLang={(lang) => {
            setSelectedLang(lang);
            showToast(`Speech & summary locale updated`, 'info');
          }}
          onLogout={handleLogout}
          onReportProcessed={handleReportProcessed}
          onShowToast={showToast}
          onReturnToLanding={() => setShowPortal(false)}
        />
      </>
    );
  }

  // PUBLIC MARKETING LANDING PAGE VIEW
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Background Dark Slate Gradient & Glowing Radials */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950/20 via-slate-950 to-slate-950 pointer-events-none z-0"></div>

      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4">
        {toasts.map(toast => (
          <div 
            key={toast.id}
            className={`pointer-events-auto liquid-glass-active p-4 rounded-2xl border shadow-2xl backdrop-blur-2xl text-xs flex items-start gap-3 transition-all duration-300 animate-slideUp ${
              toast.type === 'success' ? 'border-emerald-500/40 text-emerald-200' :
              toast.type === 'warning' ? 'border-amber-500/40 text-amber-200' :
              'border-cyan-500/40 text-cyan-200'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" /> :
             toast.type === 'warning' ? <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" /> :
             <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />}
            <span className="leading-relaxed font-medium">{toast.msg}</span>
          </div>
        ))}
      </div>

      {/* Logged-In Top Portal Banner if user is logged in but viewing public overview */}
      {isLoggedIn && (
        <div className="bg-cyan-950/90 border-b border-cyan-500/30 text-cyan-200 py-2.5 px-4 text-xs font-mono flex items-center justify-between sticky top-0 z-50 backdrop-blur-md">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Firebase Authenticated: <strong>{userEmail}</strong></span>
          </span>
          <button
            onClick={() => setShowPortal(true)}
            className="flex items-center gap-1 text-cyan-300 font-bold hover:underline"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Open Patient Portal Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Glass Navbar */}
      <Navbar 
        selectedLang={selectedLang}
        onSelectLang={(lang) => {
          setSelectedLang(lang);
          showToast(`Locale updated`, 'info');
        }}
        onOpenAuth={handleOpenAuth}
        isLoggedIn={isLoggedIn}
        userEmail={userEmail}
        onLogout={handleLogout}
      />

      {/* Public Landing Page Content */}
      <main className="relative z-10">
        
        {/* Hero Section */}
        <Hero 
          onExploreClick={() => {
            if (isLoggedIn) setShowPortal(true);
            else handleOpenAuth('login');
          }}
          onOpenAuth={handleOpenAuth}
          isLoggedIn={isLoggedIn}
        />

        {/* Features Engine Bento Grid */}
        <BentoGrid />

        {/* Technical Architecture Matrix */}
        <TechArchitecture />

        {/* Clinical Outcomes & Metrics */}
        <ClinicalMetrics />

        {/* FAQ Section */}
        <FAQSection />

      </main>

      {/* Modern Footer */}
      <Footer />

      {/* Floating Gaze-to-Explain Medical Reader Lens */}
      <div className="fixed bottom-6 right-6 z-40 hidden md:block">
        <GazeMedicalReader />
      </div>

      {/* Authentication Modal */}
      <AuthModal 
        isOpen={authModalOpen}
        initialTab={authModalMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccessLogin={handleSuccessLogin}
        onShowToast={showToast}
      />

    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
