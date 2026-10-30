import React, { useState } from 'react';
import { 
  FileCheck2, 
  Cpu, 
  Server, 
  Monitor, 
  ArrowRight, 
  Sparkles,
  Layers,
  Code2
} from 'lucide-react';
import { TECH_NODES } from '../data/mockData';

export const TechArchitecture: React.FC = () => {
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);

  // Map individual tech names to category IDs
  const techToCategoryMap: Record<string, string> = {
    'Browser File API': 'input',
    'Canvas API': 'input',
    'Web Workers': 'input',
    'EasyOCR / Tesseract': 'processing',
    'MedGemma 1.5 Flash': 'processing',
    'Spacy Medical': 'processing',
    'Python 3.11': 'backend',
    'FastAPI': 'backend',
    'Pydantic Validator': 'backend',
    'React 18': 'client',
    'Tailwind CSS': 'client',
    'Web Speech API': 'client',
    'TypeScript': 'client',
  };

  const getActiveCategory = () => {
    if (!hoveredTech) return null;
    return techToCategoryMap[hoveredTech] || null;
  };

  const activeCategory = getActiveCategory();

  return (
    <section id="architecture" className="py-20 relative bg-slate-950/60 border-y border-white/10 scroll-mt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full liquid-glass border border-blue-500/30 text-blue-300 text-xs font-mono">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>FULL STACK PIPELINE MATRIX</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Technical Architecture & Data Flow
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Hover over any tech stack pill below to highlight its corresponding architectural execution layer in real-time.
          </p>
        </div>

        {/* Horizontal Data Flow Pipeline Nodes */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          
          {/* Node 1: Input */}
          <div 
            className={`liquid-glass rounded-3xl p-6 border transition-all duration-300 relative ${
              activeCategory === 'input' 
                ? 'liquid-glass-active border-cyan-400/80 ring-2 ring-cyan-500/30 scale-105' 
                : 'border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-white/10">LAYER 01</span>
              <FileCheck2 className="w-5 h-5 text-cyan-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Input Layer</h3>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Client-side document ingestion, format validation, and immediate PII sanitization.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/10">
              {['Browser File API', 'Canvas API', 'Web Workers'].map(tech => (
                <span 
                  key={tech}
                  onMouseEnter={() => setHoveredTech(tech)}
                  onMouseLeave={() => setHoveredTech(null)}
                  className={`text-[10px] font-mono px-2 py-1 rounded-md cursor-pointer transition-colors ${
                    hoveredTech === tech ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-300 border border-white/10'
                  }`}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Node 2: Processing */}
          <div 
            className={`liquid-glass rounded-3xl p-6 border transition-all duration-300 relative ${
              activeCategory === 'processing' 
                ? 'liquid-glass-active border-teal-400/80 ring-2 ring-teal-500/30 scale-105' 
                : 'border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-white/10">LAYER 02</span>
              <Cpu className="w-5 h-5 text-teal-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">AI OCR & NER Engine</h3>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Text extraction, table parsing, and clinical named-entity recognition.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/10">
              {['EasyOCR / Tesseract', 'MedGemma 1.5 Flash', 'Spacy Medical'].map(tech => (
                <span 
                  key={tech}
                  onMouseEnter={() => setHoveredTech(tech)}
                  onMouseLeave={() => setHoveredTech(null)}
                  className={`text-[10px] font-mono px-2 py-1 rounded-md cursor-pointer transition-colors ${
                    hoveredTech === tech ? 'bg-teal-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-300 border border-white/10'
                  }`}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Node 3: Backend */}
          <div 
            className={`liquid-glass rounded-3xl p-6 border transition-all duration-300 relative ${
              activeCategory === 'backend' 
                ? 'liquid-glass-active border-blue-400/80 ring-2 ring-blue-500/30 scale-105' 
                : 'border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-white/10">LAYER 03</span>
              <Server className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Backend / API</h3>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              High-performance async FastAPI service calculating risk index & diet mapping.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/10">
              {['Python 3.11', 'FastAPI', 'Pydantic Validator'].map(tech => (
                <span 
                  key={tech}
                  onMouseEnter={() => setHoveredTech(tech)}
                  onMouseLeave={() => setHoveredTech(null)}
                  className={`text-[10px] font-mono px-2 py-1 rounded-md cursor-pointer transition-colors ${
                    hoveredTech === tech ? 'bg-blue-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-300 border border-white/10'
                  }`}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Node 4: Client */}
          <div 
            className={`liquid-glass rounded-3xl p-6 border transition-all duration-300 relative ${
              activeCategory === 'client' 
                ? 'liquid-glass-active border-purple-400/80 ring-2 ring-purple-500/30 scale-105' 
                : 'border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-white/10">LAYER 04</span>
              <Monitor className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Client Interface</h3>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              React 18 liquid glass canvas UI with multilingual Web Speech API audio synthesis.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/10">
              {['React 18', 'Tailwind CSS', 'Web Speech API', 'TypeScript'].map(tech => (
                <span 
                  key={tech}
                  onMouseEnter={() => setHoveredTech(tech)}
                  onMouseLeave={() => setHoveredTech(null)}
                  className={`text-[10px] font-mono px-2 py-1 rounded-md cursor-pointer transition-colors ${
                    hoveredTech === tech ? 'bg-purple-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-300 border border-white/10'
                  }`}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
