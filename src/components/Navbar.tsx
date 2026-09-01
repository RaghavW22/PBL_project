import React, { useState } from 'react';
import { 
  FileText, 
  Globe, 
  User, 
  Github, 
  Menu, 
  X,
  ChevronDown,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { INDIAN_VOICE_LOCALES } from '../data/mockData';

interface NavbarProps {
  selectedLang: string;
  onSelectLang: (code: string) => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  isLoggedIn: boolean;
  userEmail: string;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedLang,
  onSelectLang,
  onOpenAuth,
  isLoggedIn,
  userEmail,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const activeLocale = INDIAN_VOICE_LOCALES.find(l => l.code === selectedLang) || INDIAN_VOICE_LOCALES[0];

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4 max-w-7xl mx-auto">
      <div className="liquid-glass rounded-full px-5 py-3 flex items-center justify-between transition-all duration-300 border border-white/10 shadow-2xl backdrop-blur-xl">
        {/* Brand Logo & Title */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 p-[1px] flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950/80 rounded-full flex items-center justify-center backdrop-blur-sm">
              <FileText className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              Report<span className="text-cyan-400">Sarthi</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">CLINICAL AI</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono tracking-wider">HEALTH DASHBOARD</span>
          </div>
        </a>

        {/* Desktop Quick Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          <a href="#overview" className="hover:text-cyan-400 transition-colors">Overview</a>
          <a href="#bento" className="hover:text-cyan-400 transition-colors">Features Engine</a>
          <a href="#architecture" className="hover:text-cyan-400 transition-colors">Architecture</a>
          {isLoggedIn && <a href="#uploader-section" className="hover:text-cyan-400 transition-colors">Upload Report</a>}
          {isLoggedIn && <a href="#dashboard" className="hover:text-cyan-400 transition-colors">Live Dashboard</a>}
        </nav>

        {/* Right Action Group */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Indian Language Selector - Only visible when logged in */}
          {isLoggedIn && (
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
          )}

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
          <nav className="flex flex-col gap-3 font-medium text-slate-200 text-sm">
            <a href="#overview" onClick={() => setMobileMenuOpen(false)}>Overview</a>
            <a href="#bento" onClick={() => setMobileMenuOpen(false)}>Features Engine</a>
            <a href="#architecture" onClick={() => setMobileMenuOpen(false)}>Architecture</a>
            {isLoggedIn && <a href="#uploader-section" onClick={() => setMobileMenuOpen(false)}>Upload Report</a>}
            {isLoggedIn && <a href="#dashboard" onClick={() => setMobileMenuOpen(false)}>Live Dashboard</a>}
          </nav>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-3">
            {isLoggedIn && (
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
            )}

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
