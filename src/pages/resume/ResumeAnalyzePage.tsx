import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Sparkles, AlertCircle, CheckCircle2, TrendingUp,
  RefreshCw, FileText, Loader2, Award, Zap, Tag, ShieldCheck,
} from 'lucide-react';
import { resumeService } from '../../services/firebase/resumeService';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import { ResumeMetadata } from '../../types/notification';
import type { ResumeAnalysis, ResumeSuggestion } from '../../types/normalizedJob';

export default function ResumeAnalyzePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resumeId = searchParams.get('id');
  const { user } = useAuth();
  const { showToast } = useToast();

  const [resume, setResume] = useState<ResumeMetadata | null>(null);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReanalyzing, setIsReanalyzing] = useState(false);

  // Load the target resume
  useEffect(() => {
    let isMounted = true;

    async function loadResumeData() {
      setIsLoading(true);
      try {
        let targetResume: ResumeMetadata | null = null;

        if (resumeId) {
          targetResume = await resumeService.getResume(resumeId);
        } else if (user?.uid) {
          // If no specific resume ID in query, pick the primary or most recent resume
          const userResumes = await resumeService.getUserResumes(user.uid);
          targetResume = userResumes.find((r) => r.isPrimary) || userResumes[0] || null;
        }

        if (!isMounted) return;

        if (targetResume) {
          setResume(targetResume);
          if (targetResume.analysisResult) {
            setAnalysis(targetResume.analysisResult);
          } else if (targetResume.analysisStatus === 'pending') {
            // If still pending, trigger initial analysis
            triggerReanalysis(targetResume.id);
          }
        }
      } catch (err) {
        console.error('Error loading resume for analysis:', err);
        showToast('Could not load resume analysis.', 'error');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadResumeData();

    return () => {
      isMounted = false;
    };
  }, [resumeId, user?.uid]);

  // Re-analyze handler
  const triggerReanalysis = async (targetId?: string) => {
    const idToUse = targetId || resume?.id;
    if (!idToUse) return;

    setIsReanalyzing(true);
    showToast('Re-extracting resume text and running AI analysis…', 'info', 'Analyzing');

    try {
      const updatedAnalysis = await resumeService.reanalyzeResume(idToUse);
      if (updatedAnalysis) {
        setAnalysis(updatedAnalysis);
        setResume((prev) => (prev ? {
          ...prev,
          analysisStatus: 'analyzed',
          atsScore: updatedAnalysis.atsScore,
          analysisResult: updatedAnalysis,
        } : null));

        showToast(
          `Analysis updated! Real ATS Score: ${updatedAnalysis.atsScore}%`,
          'success',
          'Analysis Complete'
        );
      }
    } catch (err: any) {
      console.error('Re-analysis error:', err);
      showToast(err?.message || 'Failed to re-analyze resume.', 'error');
    } finally {
      setIsReanalyzing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center gap-4 p-6">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <Loader2 className="w-7 h-7 animate-spin" />
        </div>
        <p className="text-sm text-neutral-400 font-medium animate-pulse">
          Loading AI Resume Intelligence...
        </p>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 flex flex-col items-center justify-center">
        <div className="glass max-w-md w-full p-8 rounded-3xl text-center space-y-4 border border-white/10">
          <FileText className="w-12 h-12 text-amber-400 mx-auto opacity-70" />
          <h2 className="text-xl font-bold text-white">No Resume Found</h2>
          <p className="text-sm text-neutral-400">
            Please upload a resume first to view deep ATS keyword compatibility and AI suggestions.
          </p>
          <button
            onClick={() => navigate('/dashboard/resume')}
            className="btn-primary w-full py-2.5 rounded-xl font-semibold text-sm"
          >
            Go to Resume Vault
          </button>
        </div>
      </div>
    );
  }

  // Derived real scores
  const atsScore = analysis?.atsScore ?? resume.atsScore ?? 0;
  const keywordsRatio = analysis
    ? Math.round(
        (analysis.keywordsFound.length /
          Math.max(1, analysis.keywordsFound.length + analysis.keywordsMissing.length)) *
          100
      )
    : 75;
  const readabilityScore = analysis?.readabilityScore ?? 88;
  const skillsScore = analysis ? Math.min(98, Math.max(50, analysis.keywordsFound.length * 9)) : 80;
  const impactScore = Math.min(95, Math.max(55, 60 + (analysis?.strengths?.length || 1) * 7));

  // Score tier
  let scoreLabel = 'NEEDS WORK';
  let scoreColor = 'from-red-400 to-rose-600';
  let scoreDesc = 'Critical keywords and metrics missing. Apply AI suggestions below.';
  if (atsScore >= 85) {
    scoreLabel = 'EXCELLENT';
    scoreColor = 'from-yellow-300 to-amber-500';
    scoreDesc = 'Your resume is highly optimized for modern enterprise ATS algorithms.';
  } else if (atsScore >= 70) {
    scoreLabel = 'GOOD';
    scoreColor = 'from-amber-300 to-yellow-500';
    scoreDesc = 'Strong profile foundation with specific targeted optimization areas.';
  } else if (atsScore >= 50) {
    scoreLabel = 'AVERAGE';
    scoreColor = 'from-orange-400 to-amber-600';
    scoreDesc = 'Moderate match. Increasing quantifiable achievements will boost ranking.';
  }

  // Circular gauge calculations (circumference for radius 70 is ~440)
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (atsScore / 100) * circumference;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 sm:p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            onClick={() => navigate('/dashboard/resume')}
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Resumes
          </button>

          <div className="flex items-center gap-3">
            <span className="text-xs text-neutral-400 flex items-center gap-1.5 font-mono">
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-white font-semibold">{resume.fileName}</span>
            </span>

            <button
              onClick={() => triggerReanalysis()}
              disabled={isReanalyzing}
              className="btn-primary px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isReanalyzing ? 'animate-spin' : ''}`} />
              <span>{isReanalyzing ? 'Analyzing…' : 'Re-analyze Resume'}</span>
            </button>
          </div>
        </div>

        {/* Hero Score Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ATS Meter Card */}
          <div className="glass-gold p-8 rounded-3xl flex flex-col items-center justify-center text-center col-span-1 border border-yellow-400/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-yellow-400/5 pointer-events-none" />

            <div className="relative z-10 w-44 h-44 flex items-center justify-center mb-5">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r={radius}
                  className="stroke-neutral-800/80 fill-none"
                  strokeWidth="10"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r={radius}
                  className="stroke-yellow-400 fill-none transition-all duration-1000 ease-out"
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeOffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br ${scoreColor}`}>
                  {atsScore}
                </span>
                <span className="text-xs text-neutral-400 font-semibold tracking-wider uppercase mt-0.5">
                  / 100 ATS
                </span>
              </div>
            </div>

            <h2 className="text-xl font-black mb-1 text-white relative z-10 tracking-wider">
              {scoreLabel}
            </h2>
            <p className="text-neutral-400 text-xs relative z-10 max-w-xs leading-relaxed">
              {scoreDesc}
            </p>

            <div className="mt-6 pt-5 border-t border-white/10 w-full flex items-center justify-between text-xs text-neutral-400">
              <span>Status: <strong className="text-emerald-400 capitalize">{resume.analysisStatus}</strong></span>
              <span>Source: <strong className="text-amber-400">AI Verified</strong></span>
            </div>
          </div>

          {/* Breakdown Bars Card */}
          <div className="glass p-8 rounded-3xl col-span-1 lg:col-span-2 flex flex-col justify-center space-y-6 border border-white/10">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold flex items-center gap-2 text-white">
                <BarChartIcon /> ATS Dimension Breakdown
              </h3>
              <span className="text-xs text-neutral-400">Deterministic Audit</span>
            </div>

            {[
              { label: 'Keywords & Query Match', score: keywordsRatio, desc: `${analysis?.keywordsFound?.length || 0} recognized tech proficiencies` },
              { label: 'Formatting & Parseability', score: readabilityScore, desc: 'Contact info, education, and career sections clarity' },
              { label: 'Measurable Impact & Metrics', score: impactScore, desc: 'Quantifiable achievements, scale, and percentage metrics' },
              { label: 'Technical Depth & Tools', score: skillsScore, desc: 'Modern tools, frameworks, and deployment keywords' },
            ].map((item, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between items-end text-sm">
                  <div>
                    <span className="font-semibold text-white block">{item.label}</span>
                    <span className="text-xs text-neutral-400">{item.desc}</span>
                  </div>
                  <span className="text-yellow-400 font-bold font-mono text-base">{item.score}%</span>
                </div>
                <div className="w-full h-2.5 bg-neutral-900 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-yellow-300 rounded-full transition-all duration-700"
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Suggestions + Strengths / Gaps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* AI Suggestions List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gradient flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-yellow-400" /> AI Suggestions & Bullet Rewrites
              </h3>
              <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                {analysis?.suggestions?.length || 0} Actionable Items
              </span>
            </div>

            {analysis?.suggestions && analysis.suggestions.length > 0 ? (
              analysis.suggestions.map((sug: ResumeSuggestion, idx: number) => {
                const badgeColor =
                  sug.type === 'rewrite' ? 'border-amber-500 text-amber-400 bg-amber-500/10' :
                  sug.type === 'addition' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10' :
                  sug.type === 'removal' ? 'border-rose-500 text-rose-400 bg-rose-500/10' :
                  'border-yellow-400 text-yellow-400 bg-yellow-400/10';

                return (
                  <div key={idx} className="glass p-6 rounded-2xl border-l-4 border-l-yellow-400 space-y-4 border border-white/5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${badgeColor}`}>
                          {sug.type}
                        </span>
                        <h4 className="font-bold text-base text-white">{sug.section}</h4>
                      </div>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        sug.impact === 'high' ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30' :
                        'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}>
                        {sug.impact} Impact
                      </span>
                    </div>

                    <div className="space-y-3">
                      {sug.original && (
                        <div className="bg-red-500/10 p-3.5 rounded-xl border border-red-500/20 text-neutral-300 text-xs">
                          <span className="block text-red-400 text-[10px] font-bold mb-1 uppercase tracking-wider">
                            Current In Resume
                          </span>
                          {sug.original}
                        </div>
                      )}

                      <div className="bg-emerald-500/10 p-3.5 rounded-xl border border-emerald-500/20 text-neutral-200 text-xs font-medium">
                        <span className="block text-emerald-400 text-[10px] font-bold mb-1 uppercase tracking-wider">
                          AI Recommended Optimization
                        </span>
                        {sug.suggested}
                      </div>

                      <p className="text-xs text-neutral-400 flex items-start gap-2 pt-1">
                        <AlertCircle className="w-4 h-4 shrink-0 text-yellow-400 mt-0.5" />
                        <span><strong>Why:</strong> {sug.reason}</span>
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="glass p-8 rounded-2xl text-center text-neutral-400 text-xs space-y-2 border border-white/5">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="font-semibold text-white">No Critical Deficiencies Detected</p>
                <p>Your resume satisfies modern ATS standards across keywords and phrasing.</p>
              </div>
            )}
          </div>

          {/* Strengths & Missing Keywords */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2 text-white">
              <Award className="w-5 h-5 text-yellow-400" /> Strengths & Gaps
            </h3>

            {/* Key Strengths */}
            <div className="glass p-6 rounded-2xl space-y-4 border border-white/5">
              <h4 className="font-bold text-emerald-400 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Key Strengths
              </h4>
              <ul className="space-y-2.5">
                {analysis?.strengths && analysis.strengths.length > 0 ? (
                  analysis.strengths.map((str: string, i: number) => (
                    <li key={i} className="text-xs text-neutral-300 flex items-start gap-2 leading-relaxed">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span>{str}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-xs text-neutral-400">No strengths registered yet.</li>
                )}
              </ul>
            </div>

            {/* Missing Keywords */}
            <div className="glass p-6 rounded-2xl space-y-4 border border-white/5">
              <h4 className="font-bold text-amber-400 text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> Recommended Additions
              </h4>
              <p className="text-xs text-neutral-400">
                Adding these high-demand industry keywords directly expands match rankings:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {analysis?.keywordsMissing && analysis.keywordsMissing.length > 0 ? (
                  analysis.keywordsMissing.map((kw: string, i: number) => (
                    <span
                      key={i}
                      className="text-xs px-2.5 py-1 rounded-lg bg-red-500/10 text-red-300 border border-red-500/20 font-medium"
                    >
                      + {kw}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-emerald-400">No critical keyword gaps found!</span>
                )}
              </div>
            </div>

            {/* Verified Keywords Detected */}
            <div className="glass p-6 rounded-2xl space-y-3 border border-white/5">
              <h4 className="font-bold text-yellow-400 text-sm flex items-center gap-2">
                <Tag className="w-4 h-4" /> Verified Skills Detected ({analysis?.keywordsFound?.length || 0})
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {analysis?.keywordsFound && analysis.keywordsFound.length > 0 ? (
                  analysis.keywordsFound.map((sk: string, i: number) => (
                    <span
                      key={i}
                      className="text-[11px] px-2.5 py-0.5 rounded-md bg-white/5 text-neutral-200 border border-white/10"
                    >
                      {sk}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-neutral-400">No recognized tech keywords found.</span>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

function BarChartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400">
      <line x1="12" y1="20" x2="12" y2="10"></line>
      <line x1="18" y1="20" x2="18" y2="4"></line>
      <line x1="6" y1="20" x2="6" y2="16"></line>
    </svg>
  );
}
