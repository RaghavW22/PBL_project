import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Cloud, 
  Cpu, 
  Key, 
  Check, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  X, 
  Loader2, 
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles
} from 'lucide-react';
import { fetchAiConfig, updateAiConfig, testAiKey, AiConfigData } from '../services/aiConfigService';

interface AiProviderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProviderChanged?: (provider: string) => void;
  onShowToast: (msg: string, type?: 'info' | 'success' | 'warning') => void;
}

export const AiProviderModal: React.FC<AiProviderModalProps> = ({
  isOpen,
  onClose,
  onProviderChanged,
  onShowToast,
}) => {
  const [config, setConfig] = useState<AiConfigData | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<'gemini_cloud' | 'groq_cloud' | 'local_ollama'>('gemini_cloud');
  const [geminiKeyInput, setGeminiKeyInput] = useState('');
  const [groqKeyInput, setGroqKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);
  
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; latencyMs?: number } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadConfig();
    }
  }, [isOpen]);

  const loadConfig = async () => {
    const data = await fetchAiConfig();
    if (data) {
      setConfig(data);
      setSelectedProvider(data.active_provider);
    }
  };

  if (!isOpen) return null;

  const handleTestKey = async () => {
    const keyToTest = selectedProvider === 'gemini_cloud' ? geminiKeyInput : groqKeyInput;
    if (!keyToTest.trim()) {
      onShowToast('Please paste an API key before testing connection.', 'warning');
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    const res = await testAiKey({
      provider: selectedProvider as 'gemini_cloud' | 'groq_cloud',
      api_key: keyToTest.trim(),
    });

    setIsTesting(false);
    setTestResult(res);

    if (res.success) {
      onShowToast(`Verified! Model responded in ${res.latencyMs ? (res.latencyMs / 1000).toFixed(2) : '1'}s`, 'success');
    } else {
      onShowToast(res.message, 'warning');
    }
  };

  const handleSaveAndActivate = async () => {
    setIsSaving(true);
    const payload: {
      provider: 'gemini_cloud' | 'groq_cloud' | 'local_ollama';
      gemini_api_key?: string;
      groq_api_key?: string;
    } = {
      provider: selectedProvider,
    };

    if (geminiKeyInput.trim()) {
      payload.gemini_api_key = geminiKeyInput.trim();
    }
    if (groqKeyInput.trim()) {
      payload.groq_api_key = groqKeyInput.trim();
    }

    const res = await updateAiConfig(payload);
    setIsSaving(false);

    if (res.success) {
      onShowToast(res.message || 'AI Provider updated successfully!', 'success');
      if (onProviderChanged) onProviderChanged(selectedProvider);
      onClose();
    } else {
      onShowToast(res.message || 'Failed to update AI provider', 'warning');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Zap className="w-5 h-5 fill-cyan-400/30" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                AI Inference Engine Selection
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  ULTRA-FAST
                </span>
              </h3>
              <p className="text-xs text-slate-400">Switch between Instant Cloud AI (~1s) and Local On-Device AI</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Provider Option Cards */}
        <div className="space-y-3">
          
          {/* OPTION 1: GOOGLE GEMINI 1.5 FLASH (RECOMMENDED) */}
          <div 
            onClick={() => { setSelectedProvider('gemini_cloud'); setTestResult(null); }}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              selectedProvider === 'gemini_cloud' 
                ? 'bg-cyan-950/40 border-cyan-400/80 shadow-lg shadow-cyan-500/10' 
                : 'bg-slate-950/60 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
                  <Cloud className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">Google Gemini 1.5 Flash</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                      ~1.0s LATENCY
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Official MedGemma foundation model. Free instant API key with no credit card required.
                  </p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                selectedProvider === 'gemini_cloud' ? 'bg-cyan-500 border-cyan-400 text-slate-950' : 'border-white/20'
              }`}>
                {selectedProvider === 'gemini_cloud' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>

            {selectedProvider === 'gemini_cloud' && (
              <div className="mt-4 pt-3 border-t border-cyan-500/20 space-y-3" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between text-xs">
                  <label className="text-slate-300 font-mono flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-cyan-400" />
                    Gemini API Key:
                  </label>
                  <a 
                    href="https://aistudio.google.com/app/apikey" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 text-[11px] underline flex items-center gap-1"
                  >
                    Get Free Gemini Key (10 seconds) <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    placeholder={config?.has_gemini_key ? `Configured (${config.masked_gemini_key}) - paste new to replace` : "AIzaSy..."}
                    value={geminiKeyInput}
                    onChange={(e) => setGeminiKeyInput(e.target.value)}
                    className="w-full bg-slate-900 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 pr-10 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* OPTION 2: GROQ CLOUD (ULTRA-FAST 0.5s LPU) */}
          <div 
            onClick={() => { setSelectedProvider('groq_cloud'); setTestResult(null); }}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              selectedProvider === 'groq_cloud' 
                ? 'bg-orange-950/40 border-orange-400/80 shadow-lg shadow-orange-500/10' 
                : 'bg-slate-950/60 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-400/30 flex items-center justify-center text-orange-400">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">Groq Cloud (Gemma 2 9B LPU)</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/40 font-bold">
                      ~0.5s LIGHTNING
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Runs Gemma 2 on Groq's Language Processing Units at 500+ tokens/sec.
                  </p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                selectedProvider === 'groq_cloud' ? 'bg-orange-500 border-orange-400 text-slate-950' : 'border-white/20'
              }`}>
                {selectedProvider === 'groq_cloud' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>

            {selectedProvider === 'groq_cloud' && (
              <div className="mt-4 pt-3 border-t border-orange-500/20 space-y-3" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between text-xs">
                  <label className="text-slate-300 font-mono flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-orange-400" />
                    Groq API Key:
                  </label>
                  <a 
                    href="https://console.groq.com/keys" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-orange-400 hover:text-orange-300 text-[11px] underline flex items-center gap-1"
                  >
                    Get Free Groq Key <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    placeholder={config?.has_groq_key ? `Configured (${config.masked_groq_key}) - paste new to replace` : "gsk_..."}
                    value={groqKeyInput}
                    onChange={(e) => setGroqKeyInput(e.target.value)}
                    className="w-full bg-slate-900 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-400 pr-10 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* OPTION 3: LOCAL ON-DEVICE OLLAMA */}
          <div 
            onClick={() => { setSelectedProvider('local_ollama'); setTestResult(null); }}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              selectedProvider === 'local_ollama' 
                ? 'bg-purple-950/40 border-purple-400/80 shadow-lg shadow-purple-500/10' 
                : 'bg-slate-950/60 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-400">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">Local On-Device Ollama (Gemma 2 2B)</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                      ON-DEVICE CPU (~20s)
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Zero cloud transmission. Runs 100% locally on your laptop hardware (port 11434).
                  </p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                selectedProvider === 'local_ollama' ? 'bg-purple-500 border-purple-400 text-slate-950' : 'border-white/20'
              }`}>
                {selectedProvider === 'local_ollama' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>
          </div>

        </div>

        {/* Test Result Message */}
        {testResult && (
          <div className={`p-3.5 rounded-xl border text-xs flex items-center gap-2.5 ${
            testResult.success 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}>
            {testResult.success ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
            <span>{testResult.message}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <div>
            {selectedProvider !== 'local_ollama' && (
              <button
                onClick={handleTestKey}
                disabled={isTesting}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/15 text-xs font-mono font-semibold transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isTesting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5 text-cyan-400" />}
                Test API Key
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAndActivate}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold font-mono text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              Save & Activate Provider
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
