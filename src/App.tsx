import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { BentoGrid } from './components/BentoGrid';
import { TechArchitecture } from './components/TechArchitecture';
import { ClinicalMetrics } from './components/ClinicalMetrics';
import { FAQSection } from './components/FAQSection';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { PatientPortal } from './components/PatientPortal';

import { AuthProvider, useAuth } from './context/AuthContext';

import { INITIAL_PATIENT, INITIAL_LAB_PARAMETERS, INITIAL_DIET_PLAN } from './data/mockData';
import { PatientProfile, LabParameter, DietPlan } from './types';
import { CheckCircle2, AlertCircle, Info, LayoutDashboard, ArrowRight, Loader2 } from 'lucide-react';

function AppContent() {
  const { user, loading, logout } = useAuth();

  const [selectedLang, setSelectedLang] = useState('en-IN');
  const [patient, setPatient] = useState<PatientProfile>(INITIAL_PATIENT);
  const [parameters, setParameters] = useState<LabParameter[]>(INITIAL_LAB_PARAMETERS);
  const [dietPlan, setDietPlan] = useState<DietPlan>(INITIAL_DIET_PLAN);
  const [rawExtractedText, setRawExtractedText] = useState<string>('');
  
  const [showPortal, setShowPortal] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('overview');

  const isNavigatingRef = useRef(false);
  const navigationTimerRef = useRef<any>(null);

  // Auth Modal State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  // Toast Notification State
  const [toasts, setToasts] = useState<Array<{ id: number; msg: string; type: 'info' | 'success' | 'warning' }>>([]);

  const isLoggedIn = !!user;
  const userEmail = user?.email || user?.displayName || 'Patient';

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
    handleNavigate('uploader-section');
  };

  const handleLogout = async () => {
    try {
      await logout();
      setShowPortal(false);
      setActiveTab('overview');
      showToast('You have been logged out securely.', 'info');
    } catch (err: any) {
      showToast('Error logging out from Firebase', 'warning');
    }
  };

  const handleReportProcessed = (
    newPatient: PatientProfile, 
    newParams: LabParameter[], 
    fileName: string,
    rawText?: string,
    newDietPlan?: DietPlan
  ) => {
    setPatient(newPatient);
    setParameters(newParams);
    if (rawText) setRawExtractedText(rawText);
    if (newDietPlan) setDietPlan(newDietPlan);
  };

  // Centralized Smart Navigation Handler
  const handleNavigate = (targetId: string) => {
    const cleanId = targetId.replace('#', '');
    setActiveTab(cleanId);
    
    // Temporarily lock scroll spy while smooth scroll is animating
    isNavigatingRef.current = true;
    if (navigationTimerRef.current) {
      clearTimeout(navigationTimerRef.current);
    }
    navigationTimerRef.current = setTimeout(() => {
      isNavigatingRef.current = false;
    }, 900);

    const portalTargets = ['uploader-section', 'dashboard', 'portal'];
    const isPortalTarget = portalTargets.includes(cleanId);

    // Update browser URL hash cleanly
    if (window.location.hash !== `#${cleanId}`) {
      window.history.pushState(null, '', `#${cleanId}`);
    }

    const scrollToElement = () => {
      if (cleanId === 'overview') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const el = document.getElementById(cleanId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    if (isPortalTarget) {
      if (!showPortal) {
        setShowPortal(true);
        setTimeout(scrollToElement, 150);
      } else {
        scrollToElement();
      }
    } else {
      if (showPortal) {
        setShowPortal(false);
        setTimeout(scrollToElement, 150);
      } else {
        scrollToElement();
      }
    }
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (navigationTimerRef.current) clearTimeout(navigationTimerRef.current);
    };
  }, []);

  // Handle URL hash changes & deep links
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setActiveTab(hash);
        handleNavigate(hash);
      }
    };

    // If initial load has a hash, trigger navigation
    if (window.location.hash) {
      handleHashChange();
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [showPortal]);

  // Scroll spy on landing page sections
  useEffect(() => {
    if (showPortal) return;

    const sections = ['overview', 'bento', 'architecture'];
    const handleScroll = () => {
      if (isNavigatingRef.current) return;
      const scrollPos = window.scrollY + 220;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveTab(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showPortal]);

  // If user logs in, show portal workspace by default if no landing hash was specified
  useEffect(() => {
    if (user) {
      const hash = window.location.hash;
      if (!hash || hash === '#uploader-section' || hash === '#dashboard') {
        setShowPortal(true);
      }
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-cyan-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="text-xs font-mono tracking-wider">Connecting to Firebase Session...</span>
      </div>
    );
  }

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
      {isLoggedIn && !showPortal && (
        <div className="bg-cyan-950/90 border-b border-cyan-500/30 text-cyan-200 py-2.5 px-4 text-xs font-mono flex items-center justify-between sticky top-0 z-50 backdrop-blur-md">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Firebase Authenticated: <strong>{userEmail}</strong></span>
          </span>
          <button
            onClick={() => handleNavigate('uploader-section')}
            className="flex items-center gap-1 text-cyan-300 font-bold hover:underline"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Open Patient Portal Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Glass Navbar with activeTab state & dynamic underline */}
      <Navbar 
        currentView={showPortal ? 'portal' : 'landing'}
        activeTab={activeTab}
        onNavigate={handleNavigate}
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

      {/* VIEW CONTENT: PATIENT PORTAL OR PUBLIC LANDING PAGE */}
      {showPortal ? (
        <PatientPortal 
          userEmail={userEmail}
          patient={patient}
          parameters={parameters}
          dietPlan={dietPlan}
          rawExtractedText={rawExtractedText}
          selectedLang={selectedLang}
          onSelectLang={(lang) => {
            setSelectedLang(lang);
            showToast(`Speech & summary locale updated`, 'info');
          }}
          onLogout={handleLogout}
          onReportProcessed={handleReportProcessed}
          onShowToast={showToast}
          onReturnToLanding={() => handleNavigate('overview')}
        />
      ) : (
        <main className="relative z-10">
          <Hero 
            onExploreClick={() => handleNavigate('uploader-section')}
            onOpenAuth={handleOpenAuth}
            isLoggedIn={isLoggedIn}
            onNavigate={handleNavigate}
          />
          <BentoGrid />
          <TechArchitecture />
          <ClinicalMetrics />
          <FAQSection />
        </main>
      )}

      {/* Modern Footer */}
      <Footer />

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
