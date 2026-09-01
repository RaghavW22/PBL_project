import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Plus, Minus, Stethoscope, Eye, Sparkles } from 'lucide-react';
import { FAQ_ITEMS } from '../data/mockData';

export const FAQSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('faq-sarthi-1');

  const toggleItem = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-20 relative bg-slate-950/40 scroll-mt-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full liquid-glass border border-cyan-500/30 text-cyan-300 text-xs font-mono">
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>FREQUENTLY ASKED QUESTIONS & DR. SARTHI AI</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Everything You Need to Know
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            Learn how Dr. Sarthi AI Assistant, cursor gaze inspection, clinical NER parsing, and multilingual speech work together to simplify your medical reports.
          </p>
        </div>

        {/* Dr. Sarthi AI Spotlight Card */}
        <div className="liquid-glass-active rounded-3xl p-6 sm:p-8 border border-cyan-500/40 shadow-2xl relative overflow-hidden bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-lg shadow-cyan-500/20 flex-shrink-0">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Dr. Sarthi — AI Clinical Inspector</span>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>CURSOR TRACKING</span>
                  </span>
                </h3>
                <p className="text-xs text-slate-300">
                  Dr. Sarthi follows your mouse cursor in real-time to inspect parameters and explain medical terms in plain 6th-grade English.
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-1 text-xs font-mono px-3 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Real-Time Screen Inspection</span>
            </div>
          </div>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div 
                key={item.id}
                className="liquid-glass rounded-2xl border border-white/10 overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-white text-base hover:text-cyan-300 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    {item.id.includes('sarthi') && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold uppercase flex-shrink-0">
                        Dr. Sarthi AI
                      </span>
                    )}
                    <span>{item.question}</span>
                  </span>
                  <div className="w-8 h-8 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-cyan-400 flex-shrink-0">
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5 pt-4 bg-slate-950/40">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
