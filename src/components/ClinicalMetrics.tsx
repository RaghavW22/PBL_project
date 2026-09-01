import React from 'react';
import { 
  Trophy, 
  BarChart3, 
  Zap,
  Globe2
} from 'lucide-react';

export const ClinicalMetrics: React.FC = () => {
  return (
    <section className="py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full liquid-glass border border-emerald-500/30 text-emerald-300 text-xs font-mono">
            <Trophy className="w-3.5 h-3.5 text-emerald-400" />
            <span>PROJECT EVALUATION & BENCHMARKS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Key Clinical Engineering Outcomes
          </h2>
        </div>

        {/* 3-Column Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Performance */}
          <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden flex flex-col justify-between group hover:border-cyan-500/40 transition-colors">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Zap className="w-6 h-6" />
              </div>
              <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">BENCHMARK PERFORMANCE</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">98.4%</span>
                <span className="text-xs font-semibold text-cyan-400">Entity Precision</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Evaluated against 500+ standard lab panels with less than 50ms average microservice response latency.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>LATENCY: &lt; 50ms</span>
              <span className="text-cyan-400 font-bold">LOINC STANDARD</span>
            </div>
          </div>

          {/* Card 2: Validation */}
          <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden flex flex-col justify-between group hover:border-teal-500/40 transition-colors">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <BarChart3 className="w-6 h-6" />
              </div>
              <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">VALIDATION & COVERAGE</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">94.2%</span>
                <span className="text-xs font-semibold text-teal-400">Test Coverage</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Comprehensive automated test suite validating blood, urine, lipid, thyroid, and metabolic parameters.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>TEST SUITE: 142 TESTS</span>
              <span className="text-teal-400 font-bold">PASSED 100%</span>
            </div>
          </div>

          {/* Card 3: Regional Milestones */}
          <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden flex flex-col justify-between group hover:border-blue-500/40 transition-colors">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Globe2 className="w-6 h-6" />
              </div>
              <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">LOCAL ACCESSIBILITY</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">9</span>
                <span className="text-xs font-semibold text-blue-400">Indian Locales</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Integrated Web Speech API synthesis for Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, and Indian English.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>PII ANONYMIZATION</span>
              <span className="text-blue-400 font-bold">CLIENT-SIDE MASK</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
