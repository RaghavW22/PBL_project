import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Apple, 
  Activity, 
  Download, 
  HelpCircle, 
  Search,
  Check,
  Stethoscope,
  Info
} from 'lucide-react';
import { PatientProfile, LabParameter, DietPlan } from '../types';
import { INDIAN_VOICE_LOCALES, INITIAL_DIET_PLAN, MULTILINGUAL_TRANSLATIONS } from '../data/mockData';

interface DigitalDashboardProps {
  patient: PatientProfile;
  parameters: LabParameter[];
  selectedLang: string;
  onShowToast: (msg: string, type?: 'info' | 'success' | 'warning') => void;
}

export const DigitalDashboard: React.FC<DigitalDashboardProps> = ({
  patient,
  parameters,
  selectedLang,
  onShowToast,
}) => {
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [checkedQuestions, setCheckedQuestions] = useState<Record<number, boolean>>({});

  const activeLocale = INDIAN_VOICE_LOCALES.find(l => l.code === selectedLang) || INDIAN_VOICE_LOCALES[0];
  const translation = MULTILINGUAL_TRANSLATIONS[selectedLang] || MULTILINGUAL_TRANSLATIONS['en-IN'];

  // Speech Synthesis Handler
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleVoiceToggle = () => {
    if (!('speechSynthesis' in window)) {
      onShowToast('Web Speech API is not supported in this browser.', 'warning');
      return;
    }

    const synth = window.speechSynthesis;

    if (isPlayingVoice) {
      synth.cancel();
      setIsPlayingVoice(false);
    } else {
      synth.cancel();

      // Speak actual translated text for the selected language!
      const textToSpeak = translation.transcript;

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = selectedLang; // hi-IN, ta-IN, te-IN, bn-IN, mr-IN, gu-IN, kn-IN, ml-IN, en-IN
      utterance.rate = 0.90;

      utterance.onstart = () => {
        setIsPlayingVoice(true);
      };

      utterance.onend = () => {
        setIsPlayingVoice(false);
      };

      utterance.onerror = () => {
        setIsPlayingVoice(false);
        onShowToast(`Speech playback completed or fallback requested.`, 'info');
      };

      synth.speak(utterance);
    }
  };

  const filteredParameters = parameters.filter(param => 
    param.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    param.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    param.explanation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleQuestion = (idx: number) => {
    setCheckedQuestions(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div id="dashboard" className="w-full max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-28">
      
      {/* DASHBOARD TOP HEADER BAR */}
      <div className="liquid-glass-active rounded-3xl p-6 border border-white/20 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-2xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 font-black text-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
            {patient.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide">{patient.name}</h2>
            <p className="text-xs font-mono text-slate-400">
              {patient.age} YRS • {patient.gender} • SAMPLE DATE: {patient.sampleDate}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onShowToast('Generating encrypted AI summary PDF... Download ready shortly!', 'success')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl liquid-glass text-xs font-mono text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/10 transition-colors shadow-lg"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export Summary PDF</span>
          </button>
        </div>
      </div>

      {/* DASHBOARD GRID ROW 1: HEALTH RISK SCORE & VOICE READER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* WIDGET 1: HEALTH RISK SCORE GAUGE (lg:col-span-6) */}
        <div className="lg:col-span-6 liquid-glass rounded-3xl p-6 sm:p-8 border border-white/15 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              AI Health Risk Score
            </h3>
            <span className={`text-xs font-mono px-3 py-1 rounded-full font-bold border ${
              patient.riskLevel === 'LOW RISK' 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
            }`}>
              {patient.riskLevel}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-8 my-4">
            
            {/* SVG Arc Gauge */}
            <div className="relative w-36 h-36 flex items-center justify-center flex-shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" stroke="rgba(255,255,255,0.1)" strokeWidth="10" fill="none" />
                <circle 
                  cx="60" 
                  cy="60" 
                  r="50" 
                  stroke={patient.riskScore >= 80 ? '#10b981' : '#f59e0b'} 
                  strokeWidth="10" 
                  fill="none" 
                  strokeDasharray="314"
                  strokeDashoffset={314 - (314 * patient.riskScore) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-white">{patient.riskScore}</span>
                <span className="text-[10px] text-slate-400 font-mono">/ 100</span>
              </div>
            </div>

            {/* Gauge Info */}
            <div className="space-y-3">
              <h4 className="text-base font-bold text-white">{translation.riskTitle || patient.riskTitle}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{translation.riskDesc || patient.riskDescription}</p>

              <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Normal Markers ({patient.normalCount})</span>
                  <span className="text-emerald-400 font-bold">Optimal</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-white/10">
                  <div className="bg-emerald-500 h-full" style={{ width: `${(patient.normalCount / (patient.normalCount + patient.varianceCount)) * 100}%` }}></div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* WIDGET 2: VOICE SUMMARY READER (lg:col-span-6) */}
        <div className="lg:col-span-6 liquid-glass rounded-3xl p-6 sm:p-8 border border-white/15 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-cyan-400" />
              Voice Summary Reader
            </h3>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              Voice: {activeLocale.flag} {activeLocale.name}
            </span>
          </div>

          {/* Voice Player Controller */}
          <div className="bg-slate-950/80 rounded-2xl p-4 border border-white/10 flex items-center gap-4 my-2">
            <button
              onClick={handleVoiceToggle}
              className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/30 hover:scale-105 transition-transform flex-shrink-0"
              aria-label="Play Voice Summary"
            >
              {isPlayingVoice ? <Pause className="w-6 h-6 fill-slate-950" /> : <Play className="w-6 h-6 fill-slate-950 ml-0.5" />}
            </button>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">{isPlayingVoice ? `Speaking in ${activeLocale.name}...` : 'Click Play to Listen Speech'}</span>
                <span className="text-slate-400 font-mono">0:45 Sec Audio</span>
              </div>
              <div className="flex items-center gap-1 h-6">
                {[...Array(12)].map((_, i) => (
                  <span 
                    key={i} 
                    className={`flex-1 rounded-full transition-all ${
                      isPlayingVoice ? 'equalizer-bar' : 'bg-slate-800 h-1.5'
                    }`}
                    style={{ animationDelay: `${(i % 5) * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Transcript Box - Translated dynamically */}
          <div className="bg-slate-900/60 rounded-2xl p-4 border border-white/10 text-xs space-y-1">
            <div className="flex items-center justify-between font-mono text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
              <span>AUDIO TRANSCRIPT ({activeLocale.name})</span>
              <span>MULTILINGUAL ACTIVE</span>
            </div>
            <p className="text-slate-200 italic leading-relaxed">
              "{translation.transcript}"
            </p>
          </div>
        </div>

      </div>

      {/* DASHBOARD WIDGET 3: AI EXECUTIVE REPORT SUMMARIZER */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-white/15 space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            AI Executive Report Summarizer
          </h3>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-900 text-cyan-300 border border-cyan-500/30 font-semibold">
            {activeLocale.flag} {activeLocale.name} Summary
          </span>
        </div>

        <p className="text-slate-100 text-sm sm:text-base leading-relaxed bg-slate-950/70 p-4.5 rounded-2xl border border-white/10 font-sans">
          {translation.summary}
        </p>

        {/* Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-rose-950/20 rounded-2xl p-5 border border-rose-500/30 space-y-3">
            <h4 className="text-sm font-bold text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Attention Required
            </h4>
            <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
              <li>Neutrophils elevated (72%) — signs of minor immune reaction or recovery.</li>
              <li>Slightly low Ferritin stored iron reserve.</li>
            </ul>
          </div>

          <div className="bg-emerald-950/20 rounded-2xl p-5 border border-emerald-500/30 space-y-3">
            <h4 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Optimal Markers
            </h4>
            <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
              <li>Hemoglobin & Red Blood Cell counts are optimal.</li>
              <li>Platelet count is normal — healthy blood clotting capacity.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* DASHBOARD WIDGET 4: PERSONALIZED DIET & NUTRITION PLAN */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-white/15 space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Apple className="w-5 h-5 text-teal-400" />
            Personalized AI Diet & Nutrition Protocol
          </h3>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20">
            TAILORED TO LAB METRICS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Foods to Include */}
          <div className="bg-slate-900/60 rounded-2xl p-5 border border-white/10 space-y-3">
            <h4 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
              <span>🥗</span> Foods to Include
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              {INITIAL_DIET_PLAN.include.map(item => (
                <li key={item.title}>
                  <strong className="text-white">{item.title}:</strong> {item.desc}
                </li>
              ))}
            </ul>
          </div>

          {/* Foods to Avoid */}
          <div className="bg-slate-900/60 rounded-2xl p-5 border border-white/10 space-y-3">
            <h4 className="text-sm font-bold text-rose-300 flex items-center gap-2">
              <span>🚫</span> Foods to Limit
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              {INITIAL_DIET_PLAN.avoid.map(item => (
                <li key={item.title}>
                  <strong className="text-white">{item.title}:</strong> {item.desc}
                </li>
              ))}
            </ul>
          </div>

          {/* Lifestyle Protocol */}
          <div className="bg-slate-900/60 rounded-2xl p-5 border border-white/10 space-y-3">
            <h4 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
              <span>💡</span> Daily Protocol
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              {INITIAL_DIET_PLAN.tips.map(item => (
                <li key={item.title}>
                  <strong className="text-white">{item.title}:</strong> {item.desc}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* DASHBOARD WIDGET 5: DETAILED LAB PARAMETERS MATRIX TABLE */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-white/15 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            Detailed Lab Test Parameters Matrix
          </h3>

          {/* Search Filter */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search parameter..."
              className="w-full bg-slate-900/90 border border-white/15 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-mono uppercase text-[10px]">
                <th className="py-3 px-4">Parameter Name</th>
                <th className="py-3 px-4">Observed Value</th>
                <th className="py-3 px-4">Standard Range</th>
                <th className="py-3 px-4">Status Flag</th>
                <th className="py-3 px-4">Plain-English AI Explanation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredParameters.map(param => (
                <tr key={param.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4">
                    <div className="font-bold text-white text-sm">{param.name}</div>
                    <div className="text-[11px] text-slate-400">{param.subText}</div>
                  </td>
                  <td className="py-4 px-4 font-mono font-bold text-cyan-300">{param.observedValue}</td>
                  <td className="py-4 px-4 font-mono text-slate-400">{param.standardRange}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${
                      param.status === 'NORMAL' 
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                        : param.status === 'HIGH'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                    }`}>
                      {param.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-300 leading-relaxed max-w-sm">
                    {param.explanation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DASHBOARD WIDGET 6: DOCTOR DISCUSSION CHECKLIST */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-white/15 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-cyan-400" />
          Suggested Questions for Your Doctor's Visit
        </h3>
        
        <div className="space-y-3">
          {[
            'Does the mild elevation in Neutrophils warrant a follow-up blood re-check in 4 weeks?',
            'Would you recommend checking my Ferritin iron storage levels given my current dietary routine?',
            'Are there any specific vitamins I should take alongside my current regimen?'
          ].map((question, idx) => (
            <div 
              key={idx}
              onClick={() => toggleQuestion(idx)}
              className="bg-slate-900/60 p-4 rounded-2xl border border-white/10 flex items-center gap-3 cursor-pointer hover:bg-slate-900 transition-colors"
            >
              <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                checkedQuestions[idx] ? 'bg-cyan-500 border-cyan-400 text-slate-950' : 'border-white/20'
              }`}>
                {checkedQuestions[idx] && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
              <span className={`text-xs sm:text-sm font-medium ${
                checkedQuestions[idx] ? 'text-slate-400 line-through' : 'text-slate-200'
              }`}>
                {question}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
