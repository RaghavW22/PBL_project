import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Globe, 
  User, 
  Menu, 
  X,
  ChevronDown,
  LogOut,
  LayoutDashboard
} from 'lucide-react';
import { INDIAN_VOICE_LOCALES } from '../data/mockData';

export const NAV_LINKS = [
  { id: 'overview', label: 'Overview', href: '#overview', targetView: 'landing' },
  { id: 'bento', label: 'Features Engine', href: '#bento', targetView: 'landing' },
  { id: 'architecture', label: 'Architecture', href: '#architecture', targetView: 'landing' },
  { id: 'uploader-section', label: 'Upload Report', href: '#uploader-section', targetView: 'portal' },
  { id: 'dashboard', label: 'Live Dashboard', href: '#dashboard', targetView: 'portal' },
] as const;

interface NavbarProps {
  selectedLang: string;
  onSelectLang: (code: string) => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  isLoggedIn: boolean;
  userEmail: string;
  onLogout: () => void;
  currentView?: 'landing' | 'portal';
  onNavigate?: (sectionId: string) => void;
  activeTab?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedLang,
  onSelectLang,
  onOpenAuth,
  isLoggedIn,
  userEmail,
  onLogout,
  currentView = 'landing',
  onNavigate,
  activeTab = 'overview',
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<string>(activeTab);

  // Sync internal selectedTab with activeTab prop
  useEffect(() => {
    if (activeTab) {
      setSelectedTab(activeTab);
    }
  }, [activeTab]);

  const activeLocale = INDIAN_VOICE_LOCALES.find(l => l.code === selectedLang) || INDIAN_VOICE_LOCALES[0];

  // Only show "Upload Report" when user is logged in
  const visibleNavLinks = NAV_LINKS.filter((link) => {
    if (link.id === 'uploader-section') {
      return isLoggedIn;
    }
    return true;
  });

  const handleNavClick = (e: React.MouseEvent, linkId: string) => {
    e.preventDefault();
    setSelectedTab(linkId); // Immediately set active tab & underline clicked tab
    if (onNavigate) {
      onNavigate(linkId);
    } else {
      window.location.hash = `#${linkId}`;
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4 max-w-7xl mx-auto">
      <div className="liquid-glass rounded-full px-5 py-3 flex items-center justify-between transition-all duration-300 border border-white/10 shadow-2xl backdrop-blur-xl">
        {/* Brand Logo & Title */}
        <a 
          href="#overview" 
          onClick={(e) => handleNavClick(e, 'overview')}
          className="flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 p-[1px] flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950/80 rounded-full flex items-center justify-center backdrop-blur-sm">
              <FileText className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              Report<span className="text-cyan-400">Sarthi</span>
              {currentView === 'portal' ? (
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                  PATIENT PORTAL
                </span>
              ) : (
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  CLINICAL AI
                </span>
              )}
            </span>
            <span className="text-[10px] text-slate-400 font-mono tracking-wider">
              {currentView === 'portal' ? 'AUTHENTICATED WORKSPACE' : 'HEALTH DASHBOARD'}
            </span>
          </div>
        </a>

        {/* Desktop Quick Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          {visibleNavLinks.map((link) => {
            const isActive = selectedTab === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.id)}
                className={`transition-all py-1 relative ${
                  isActive 
                    ? 'text-cyan-400 font-semibold drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]' 
                    : 'text-slate-300 hover:text-cyan-300'
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.6)] animate-fadeIn" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Right Action Group */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Indian Language Selector */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-full bg-slate-900/60 border border-white/10 text-slate-200 hover:border-cyan-500/40 transition-colors"
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

          {/* Auth State Actions */}
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span>{userEmail ? userEmail.split('@')[0] : 'Patient'}</span>
              </span>
              <button
                onClick={onLogout}
                className="p-2 rounded-full hover:bg-rose-500/20 text-rose-300 transition-colors"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="text-xs font-medium px-3.5 py-1.5 text-slate-300 hover:text-white transition-colors"
              >
                Log In
              </button>
              <button
                onClick={() => onOpenAuth('signup')}
                className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 transition-all border border-cyan-400/30"
              >
                <span>Get Started</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-full hover:bg-white/10 text-slate-300"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 liquid-glass-active rounded-3xl p-5 border border-white/20 shadow-2xl flex flex-col gap-4">
          <nav className="flex flex-col gap-2 font-medium text-slate-200 text-sm">
            {visibleNavLinks.map((link) => {
              const isActive = selectedTab === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.id)}
                  className={`py-2 px-3 rounded-xl flex items-center justify-between transition-colors ${
                    isActive 
                      ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30' 
                      : 'hover:bg-white/5 text-slate-200'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.targetView === 'portal' && (
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Portal
                    </span>
                  )}
                </a>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
              <span>Locale Accent:</span>
              <select
                value={selectedLang}
                onChange={(e) => onSelectLang(e.target.value)}
                className="bg-slate-900 border border-white/20 rounded px-2 py-1 text-slate-200"
              >
                {INDIAN_VOICE_LOCALES.map((loc) => (
                  <option key={loc.code} value={loc.code}>
                    {loc.flag} {loc.name}
                  </option>
                ))}
              </select>
            </div>

            {isLoggedIn ? (
              <button
                onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                className="w-full py-2 text-center text-xs font-semibold rounded-full border border-rose-500/30 text-rose-300"
              >
                Log Out ({userEmail})
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { onOpenAuth('login'); setMobileMenuOpen(false); }}
                  className="flex-1 py-2 text-center text-xs font-semibold rounded-full border border-white/20 text-slate-200"
                >
                  Log In
                </button>
                <button
                  onClick={() => { onOpenAuth('signup'); setMobileMenuOpen(false); }}
                  className="flex-1 py-2 text-center text-xs font-semibold rounded-full bg-cyan-500 text-slate-950 font-bold"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
