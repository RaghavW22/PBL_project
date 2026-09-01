import React, { useState } from 'react';
import { X, Mail, Lock, Eye, EyeOff, Shield, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth, getFirebaseErrorMessage } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  initialTab?: 'login' | 'signup';
  onClose: () => void;
  onSuccessLogin: (email: string) => void;
  onShowToast: (msg: string, type?: 'info' | 'success' | 'warning') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialTab = 'login',
  onClose,
  onSuccessLogin,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { loginWithEmail, signUpWithEmail, loginWithGoogle } = useAuth();

  if (!isOpen) return null;

  const handleTabChange = (tab: 'login' | 'signup') => {
    setActiveTab(tab);
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      if (activeTab === 'login') {
        await loginWithEmail(email, password);
        onSuccessLogin(email);
        onClose();
        onShowToast(`Welcome back, ${email.split('@')[0]}! Firebase session authenticated.`, 'success');
      } else {
        const displayName = `${fname} ${lname}`.trim();
        await signUpWithEmail(email, password, displayName);
        onSuccessLogin(email);
        onClose();
        onShowToast(`Firebase account created for ${displayName || email}! Workspace unlocked.`, 'success');
      }
    } catch (err: any) {
      setErrorMsg(getFirebaseErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = async () => {
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
      onSuccessLogin('google-user');
      onClose();
      onShowToast('Google Firebase authentication successful! Workspace unlocked.', 'success');
    } catch (err: any) {
      setErrorMsg(getFirebaseErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="liquid-glass-active rounded-3xl p-6 sm:p-8 w-full max-w-md border border-white/20 shadow-2xl relative overflow-hidden backdrop-blur-2xl"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors disabled:opacity-50"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-4 text-center mb-6">
          <div className="inline-flex items-center gap-2 font-bold text-white text-lg">
            <span className="w-8 h-8 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center font-extrabold text-sm shadow-md">
              RS
            </span>
            <span>Report<span className="text-cyan-400">Sarthi</span></span>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-900 border border-white/10">
            <button
              type="button"
              onClick={() => handleTabChange('login')}
              disabled={isSubmitting}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
                activeTab === 'login' 
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-bold' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('signup')}
              disabled={isSubmitting}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
                activeTab === 'signup' 
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-bold' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign Up Free
            </button>
          </div>
        </div>

        {/* Error Alert if any */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Social Buttons */}
        <div className="space-y-2 mb-4">
          <button 
            type="button"
            onClick={handleSocialLogin}
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900/90 border border-white/10 text-xs font-medium text-white hover:bg-white/10 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.31 24 12 24z"/><path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.2.01 10.04.01 12c0 1.96.46 3.8 1.28 5.42l3.99-3.15z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/></svg>
            <span>Continue with Google</span>
          </button>
        </div>

        <div className="relative text-center my-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
          <span className="relative px-2 bg-slate-950 text-[10px] font-mono text-slate-500 uppercase">OR WITH EMAIL</span>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {activeTab === 'signup' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-300 mb-1">First Name</label>
                <input 
                  type="text"
                  required
                  value={fname}
                  disabled={isSubmitting}
                  onChange={(e) => setFname(e.target.value)}
                  placeholder="Jane"
                  className="w-full bg-slate-900 border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400 disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-300 mb-1">Last Name</label>
                <input 
                  type="text"
                  required
                  value={lname}
                  disabled={isSubmitting}
                  onChange={(e) => setLname(e.target.value)}
                  placeholder="Doe"
                  className="w-full bg-slate-900 border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400 disabled:opacity-50"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-medium text-slate-300 mb-1">Patient Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="email"
                required
                value={email}
                disabled={isSubmitting}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="patient@example.com"
                className="w-full bg-slate-900 border border-white/15 rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-cyan-400 disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={password}
                disabled={isSubmitting}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-white/15 rounded-xl pl-9 pr-10 py-2 text-white focus:outline-none focus:border-cyan-400 disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-slate-950 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>Authenticating with Firebase...</span>
              </>
            ) : (
              <span>{activeTab === 'login' ? 'Sign In & Unlock Dashboard' : 'Create Free Account & Unlock'}</span>
            )}
          </button>
        </form>

        {/* Footer Note */}
        <div className="mt-5 text-center text-[10px] font-mono text-slate-400 flex items-center justify-center gap-1.5 pt-3 border-t border-white/10">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>256-Bit Firebase Authenticated Session</span>
        </div>

      </div>
    </div>
  );
};
