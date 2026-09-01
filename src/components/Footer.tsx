import React from 'react';
import { ShieldAlert } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-white/10 py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Medical Disclaimer Banner ONLY */}
        <div className="liquid-glass rounded-2xl p-6 border border-amber-500/30 text-xs sm:text-sm text-amber-200/90 flex items-start gap-4 bg-amber-950/20 shadow-2xl">
          <ShieldAlert className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1.5">
            <strong className="text-amber-300 uppercase font-mono text-xs tracking-wider block">Medical Disclaimer:</strong>
            <p className="leading-relaxed">
              ReportSarthi provides automated AI-generated explanations of medical terminology for educational and informational purposes only. It is not a medical device, nor does it render medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition or lab result.
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
};
