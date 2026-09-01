import React from 'react';
import { 
  Users, 
  Github, 
  Linkedin, 
  Code, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { TEAM_MEMBERS } from '../data/mockData';

export const TeamSection: React.FC = () => {
  return (
    <section id="team" className="py-20 relative scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full liquid-glass border border-cyan-500/30 text-cyan-300 text-xs font-mono">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>PBL CAPSTONE CONTRIBUTORS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Engineering & Project Team
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Collaborative team structure behind the ReportSarthi AI medical decoder & speech dashboard prototype.
          </p>
        </div>

        {/* Minimalist Horizontal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TEAM_MEMBERS.map((member) => (
            <div 
              key={member.name}
              className="liquid-glass-hover liquid-glass rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 font-black text-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                    {member.avatar}
                  </div>
                  <div className="flex items-center gap-2">
                    <a 
                      href={member.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
                      aria-label="GitHub Profile"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                    <a 
                      href={member.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
                      aria-label="LinkedIn Profile"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white">{member.name}</h3>
                  <span className="inline-block text-xs font-mono px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 mt-1">
                    {member.role}
                  </span>
                </div>
              </div>

              {/* Contribution Tags */}
              <div className="pt-4 border-t border-white/10 space-y-2">
                <p className="text-[10px] font-mono uppercase text-slate-400">KEY CONTRIBUTIONS:</p>
                <div className="flex flex-wrap gap-1.5">
                  {member.contributions.map((tag) => (
                    <span 
                      key={tag}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-white/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
