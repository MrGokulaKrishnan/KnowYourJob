import React from 'react';
import { ArrowLeft, Sparkles, AlertCircle, CheckCircle2, TrendingUp, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ResumeAnalyzePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Resumes
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="glass-gold p-8 rounded-3xl flex flex-col items-center justify-center text-center col-span-1 border border-yellow-400/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-yellow-400/5" />
            <div className="relative z-10 w-48 h-48 rounded-full border-[8px] border-neutral-800 flex items-center justify-center shadow-[0_0_40px_rgba(255,208,0,0.2)] mb-6">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="50%" cy="50%" r="46%" className="stroke-yellow-400 fill-none" strokeWidth="8" strokeDasharray="300" strokeDashoffset="27" strokeLinecap="round" />
              </svg>
              <div className="flex flex-col items-center">
                <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 to-amber-500">91</span>
                <span className="text-sm text-neutral-400 font-medium">/ 100</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-1 text-white relative z-10">EXCELLENT</h2>
            <p className="text-neutral-400 text-sm relative z-10">Your resume is highly optimized for ATS.</p>
            
            <button className="mt-8 btn-primary w-full flex items-center justify-center gap-2 relative z-10">
              <RefreshCw className="w-4 h-4" /> Re-analyze
            </button>
          </div>

          <div className="glass p-8 rounded-3xl col-span-1 md:col-span-2 flex flex-col justify-center space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2"><BarChartIcon /> Score Breakdown</h3>
            
            {[
              { label: 'Keywords & Match', score: 88 },
              { label: 'Formatting & Structure', score: 95 },
              { label: 'Measurable Impact', score: 84 },
              { label: 'Skills Representation', score: 92 },
            ].map((item, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{item.label}</span>
                  <span className="text-yellow-400 font-bold">{item.score}%</span>
                </div>
                <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full" style={{ width: `${item.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-2xl font-bold text-gradient flex items-center gap-2"><Sparkles className="w-6 h-6 text-yellow-400" /> AI Suggestions</h3>
            
            <div className="glass p-6 rounded-2xl border-l-4 border-l-yellow-400">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-yellow-400/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">Improve</span>
                <h4 className="font-bold text-lg">Professional Summary</h4>
              </div>
              <div className="space-y-4">
                <div className="bg-red-500/10 p-4 rounded-xl border border-red-500/20 text-neutral-300 text-sm">
                  <span className="block text-red-400 text-xs font-bold mb-1 uppercase">Current</span>
                  "Worked on AI projects at TechCorp."
                </div>
                <div className="bg-green-500/10 p-4 rounded-xl border border-green-500/20 text-neutral-200 text-sm font-medium">
                  <span className="block text-green-400 text-xs font-bold mb-1 uppercase">Suggested</span>
                  "Developed AI-powered document analysis pipeline using Python, LLM APIs and RAG architecture, processing 10K+ documents daily."
                </div>
                <p className="text-sm text-neutral-400 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-yellow-400 mt-0.5" />
                  Why: Add measurable impact and technical specifics for ATS parsing engines.
                </p>
              </div>
            </div>

            <div className="glass p-6 rounded-2xl border-l-4 border-l-amber-500">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-amber-500/20 text-amber-500 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">Format</span>
                <h4 className="font-bold text-lg">Action Verbs</h4>
              </div>
              <div className="space-y-4">
                <p className="text-sm text-neutral-300">
                  Replace passive verbs with strong action verbs in your recent experience section.
                </p>
                <div className="flex gap-4">
                  <div className="line-through text-neutral-500 text-sm">Responsible for...</div>
                  <div className="text-green-400 text-sm font-medium">Spearheaded...</div>
                </div>
              </div>
            </div>

          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2">Strengths & Gaps</h3>
            
            <div className="glass p-6 rounded-2xl space-y-4">
              <h4 className="font-bold text-green-400 flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> Key Strengths</h4>
              <ul className="space-y-3">
                <li className="text-sm text-neutral-300 flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 shrink-0" />
                  Strong alignment with Senior AI Developer roles
                </li>
                <li className="text-sm text-neutral-300 flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 shrink-0" />
                  Excellent usage of modern tech stack keywords
                </li>
                <li className="text-sm text-neutral-300 flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 shrink-0" />
                  Clean, easily parsable formatting
                </li>
              </ul>
            </div>

            <div className="glass p-6 rounded-2xl space-y-4">
              <h4 className="font-bold text-red-400 flex items-center gap-2"><TrendingUp className="w-5 h-5" /> Missing Keywords</h4>
              <ul className="space-y-3">
                <li className="text-sm text-neutral-300 flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                  Cloud deployment (AWS/GCP) not explicitly mentioned
                </li>
                <li className="text-sm text-neutral-300 flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                  Missing CI/CD pipelines
                </li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function BarChartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400">
      <line x1="12" y1="20" x2="12" y2="10"></line>
      <line x1="18" y1="20" x2="18" y2="4"></line>
      <line x1="6" y1="20" x2="6" y2="16"></line>
    </svg>
  );
}

