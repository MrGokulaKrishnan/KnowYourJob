import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Building2, MapPin, Clock, ChevronLeft, Sparkles, CheckCircle2,
  AlertCircle, Share2, Bookmark, FileText, PenTool, Loader2, ExternalLink,
  Search, ChevronRight
} from 'lucide-react';
import { serverTimestamp } from 'firebase/firestore';
import { jobService } from '@/lib/services/jobService';
import { aiService, getUserCandidateProfile, type MatchScoreResult } from '@/lib/services/aiService';
import { applicationService } from '@/services/firebase/applicationService';
import type { NormalizedJob } from '@/types/normalizedJob';
import { JobCard } from '@/components/jobs/JobCard';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/context/ToastContext';
import { getOfficialJobPortalUrl, getPortalDisplayName } from '@/lib/utils/jobPortalUrl';
import { KYJLogo } from '@/components/ui/KYJLogo';

// ── Match Score Circle ────────────────────────────────────────────────────────

const MatchScoreCircle = ({ score, size = 120 }: { score: number; size?: number }) => {
  const radius = (size - 20) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90 w-full h-full">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke="url(#scoreGradient)" strokeWidth="8" fill="none"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFAA00" />
            <stop offset="100%" stopColor="#FFD000" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-white">{score}%</span>
        <span className="text-xs text-primary font-medium">Match</span>
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [job, setJob] = useState<NormalizedJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Apply with AI state
  const [applyingWithAI, setApplyingWithAI] = useState(false);
  const [applied, setApplied] = useState(false);

  // Match analysis state (lazy-loaded when tab is opened)
  const [matchData, setMatchData] = useState<MatchScoreResult | null>(null);
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchError, setMatchError] = useState<string | null>(null);

  // Similar jobs state
  const [similarJobs, setSimilarJobs] = useState<NormalizedJob[]>([]);

  // ── Load Job ──────────────────────────────────────────────────────────────

  useEffect(() => {
    const fetchJob = async () => {
      try {
        if (id) {
          const fetched = await jobService.getJob(id);
          setJob(fetched);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  // ── Load Similar Jobs when job is ready ──────────────────────────────────

  useEffect(() => {
    if (!job) return;
    document.title = `${job.title} at ${job.company} — KnowYourJob`;
    jobService.getSimilarJobs(job.id, job.skills, 3).then(setSimilarJobs).catch(() => setSimilarJobs([]));
  }, [job]);

  const jobPostingSchema = job ? {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    identifier: {
      '@type': 'PropertyValue',
      name: job.company,
      value: job.id,
    },
    datePosted: job.postedAt,
    validThrough: job.expiresAt || new Date(new Date(job.postedAt).getTime() + 60 * 24 * 3600 * 1000).toISOString(),
    employmentType: (job.employmentType || 'full-time').toUpperCase().replace('-', '_'),
    hiringOrganization: {
      '@type': 'Organization',
      name: job.company,
      sameAs: job.sourceUrl || 'https://knowyourjob.web.app',
      logo: job.companyLogo || 'https://knowyourjob.web.app/kyj-logo.jpg',
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location || 'India',
        addressCountry: 'IN',
      },
    },
    ...(job.remoteType === 'remote' ? {
      jobLocationType: 'TELECOMMUTE',
      applicantLocationRequirements: {
        '@type': 'Country',
        name: 'India',
      },
    } : {}),
    ...(job.salary?.min ? {
      baseSalary: {
        '@type': 'MonetaryAmount',
        currency: job.salary.currency || 'INR',
        value: {
          '@type': 'QuantitativeValue',
          minValue: job.salary.min,
          maxValue: job.salary.max || job.salary.min,
          unitText: (job.salary.period || 'year').toUpperCase(),
        },
      },
    } : {}),
    directApply: true,
  } : null;

  // ── Load Match Analysis (lazy, on tab click) ──────────────────────────────

  const loadMatchAnalysis = useCallback(async () => {
    if (!job || matchData || matchLoading) return;
    if (!user) {
      setMatchError('Sign in to see your AI match score.');
      return;
    }

    setMatchLoading(true);
    setMatchError(null);
    try {
      const profile = await getUserCandidateProfile(user.uid);
      const result = await aiService.calculateMatch({
        candidateSkills: profile.skills,
        candidateExperience: profile.experience,
        jobTitle: job.title,
        jobRequirements: job.requirements,
        jobSkills: job.skills,
      });
      setMatchData(result);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'AI match analysis failed.';
      setMatchError(message);
      console.error('[calculateMatch]', err);
    } finally {
      setMatchLoading(false);
    }
  }, [job, user, matchData, matchLoading]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'match analysis') {
      loadMatchAnalysis();
    }
  };

  // ── Apply with AI ─────────────────────────────────────────────────────────

  const handleApplyWithAI = async () => {
    if (!user) {
      showToast('Please sign in to apply.', 'warning', 'Sign In Required');
      return;
    }
    if (!job || applied) return;

    setApplyingWithAI(true);
    try {
      showToast('AI is calculating your match score...', 'info', 'Analysing');

      const profile = await getUserCandidateProfile(user.uid);
      let computedScore = job.matchScore ?? 80;

      try {
        const match = await aiService.calculateMatch({
          candidateSkills: profile.skills,
          candidateExperience: profile.experience,
          jobTitle: job.title,
          jobRequirements: job.requirements,
          jobSkills: job.skills,
        });
        computedScore = match.overall;
        // Store the result for the Match Analysis tab
        setMatchData(match);
      } catch {
        // Non-fatal: fall back to pre-set matchScore
      }

      await applicationService.createApplication({
        userId: user.uid,
        jobId: job.id,
        company: job.company,
        jobTitle: job.title,
        location: job.location,
        source: job.source,
        sourceUrl: job.sourceUrl,
        matchScore: computedScore,
        status: 'applied',
        automationMode: 'assisted',
        appliedAt: serverTimestamp(),
      });

      setApplied(true);
      showToast(
        `Application recorded for ${job.title} at ${job.company} (${computedScore}% match)!`,
        'success',
        'Applied with AI ✨'
      );
    } catch (err) {
      console.error('[applyWithAI]', err);
      showToast('Something went wrong. Please try again.', 'error');
    } finally {
      setApplyingWithAI(false);
    }
  };

  // ── Helpers ───────────────────────────────────────────────────────────────

  const formatSalary = (job: NormalizedJob) => {
    const s = job.salary || job.salaryRange;
    if (!s) return null;
    const isINR = s.currency === 'INR';
    const symbol = isINR ? '₹' : '$';
    const fmt = (n: number) => isINR ? `${Math.round(n / 100000)}L` : `${Math.round(n / 1000)}k`;
    return `${symbol}${fmt(s.min)} – ${symbol}${fmt(s.max)} / year`;
  };

  // ── Render ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-[#000000] text-white relative overflow-x-hidden flex items-center justify-center">
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[850px] h-[360px] bg-gradient-to-b from-amber-500/15 via-yellow-500/5 to-transparent blur-[140px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 py-8 w-full relative z-10">
          <div className="liquid-glass h-64 rounded-3xl mb-8 animate-pulse border border-white/10" />
          <div className="flex gap-8">
            <div className="liquid-glass h-96 rounded-3xl flex-1 animate-pulse border border-white/10" />
            <div className="liquid-glass h-96 rounded-3xl w-1/3 hidden lg:block animate-pulse border border-white/10" />
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-[#000000] text-white flex flex-col items-center justify-center p-8 relative">
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[850px] h-[360px] bg-gradient-to-b from-amber-500/15 via-yellow-500/5 to-transparent blur-[140px] rounded-full pointer-events-none" />
        <div className="liquid-glass p-8 rounded-3xl border border-white/10 text-center relative z-10 max-w-md">
          <p className="text-white text-lg font-semibold mb-4">Job not found</p>
          <Link to="/jobs" className="btn-glass px-5 py-2.5 rounded-xl text-sm font-medium">Back to jobs</Link>
        </div>
      </div>
    );
  }

  const salaryDisplay = formatSalary(job);

  return (
    <div className="min-h-screen bg-[#000000] text-white relative overflow-x-hidden selection:bg-amber-400 selection:text-black">
      {/* Ambient background glow orbs matching Homepage */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[850px] h-[360px] bg-gradient-to-b from-amber-500/15 via-yellow-500/5 to-transparent blur-[140px] rounded-full pointer-events-none z-0" />
      <div className="fixed top-1/3 right-[-10%] w-96 h-96 bg-amber-600/10 blur-[130px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-10 left-[-10%] w-96 h-96 bg-yellow-500/10 blur-[140px] rounded-full pointer-events-none z-0" />

      {/* Navigation Header */}
      <header className="border-b border-white/10 bg-[#000000]/80 backdrop-blur-xl sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <KYJLogo size={32} glow />
            <span className="text-lg font-bold text-white">
              KnowYour<span className="text-gradient-gold">Job</span>
            </span>
          </Link>

          <div className="flex items-center gap-2.5">
            <Link
              to="/jobs"
              className="btn-glass px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-white/15 hover:border-amber-400/40 hover:text-amber-300 transition-all hover:scale-105 active:scale-95 shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Search size={13} className="text-amber-400" />
              <span>All Jobs</span>
            </Link>
            {user ? (
              <Link
                to="/dashboard"
                className="btn-yellow-gradient px-4 py-1.5 rounded-xl text-black text-xs font-bold shadow-[0_0_20px_rgba(245,158,11,0.35)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  className="btn-glass px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-white/15 hover:border-amber-400/40 hover:text-amber-300 transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth/register"
                  className="btn-yellow-gradient px-4 py-1.5 rounded-xl text-black text-xs font-bold shadow-[0_0_20px_rgba(245,158,11,0.35)] hover:scale-105 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>Get Started</span>
                  <ChevronRight size={13} className="stroke-[3]" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Schema.org JobPosting Structured Data */}
        {jobPostingSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingSchema) }}
          />
        )}

        {/* Back link */}
        <Link to="/jobs" className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-amber-300 transition-colors mb-6 font-medium">
          <ChevronLeft size={16} /> Back to jobs
        </Link>

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="liquid-glass-elevated p-8 rounded-3xl relative overflow-hidden mb-8 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-amber-500/20 via-yellow-500/10 to-transparent rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500/20 via-neutral-900 to-black border border-amber-500/30 flex items-center justify-center text-3xl font-bold text-gradient-gold shadow-[0_0_25px_rgba(245,158,11,0.25)] flex-shrink-0">
                {job.company.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h1 className="text-3xl font-bold text-white tracking-tight">{job.title}</h1>
                  {job.isDemo && <span className="glossy-badge-gold text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wider font-semibold">DEMO</span>}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-neutral-400 text-sm">
                  <span className="flex items-center gap-1.5 font-medium text-white/90">
                    <Building2 size={16} className="text-amber-400" /> {job.company}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={16} className="text-neutral-400" /> {job.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={16} className="text-neutral-400" /> {new Date(job.postedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  {salaryDisplay && (
                    <span className="flex items-center gap-1.5 glossy-badge-emerald font-bold px-3 py-1 rounded-full text-xs">
                      <span className="text-gradient-emerald">{salaryDisplay}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <button className="btn-glass p-3 rounded-xl flex-shrink-0 hover:border-amber-400/40 hover:text-amber-300 transition" title="Save Job">
                <Bookmark size={20} />
              </button>
              <button className="btn-glass p-3 rounded-xl flex-shrink-0 hover:border-amber-400/40 hover:text-amber-300 transition" title="Share">
                <Share2 size={20} />
              </button>

              <a
                href={getOfficialJobPortalUrl(job)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-glass py-3 px-5 rounded-xl flex items-center justify-center gap-2 text-white hover:text-amber-300 border border-white/10 hover:border-amber-400/40 transition shrink-0 font-medium text-sm"
                title={`Open official job listing on ${getPortalDisplayName(job)}`}
              >
                <span>Apply on {getPortalDisplayName(job)}</span>
                <ExternalLink size={16} />
              </a>

              <button
                onClick={handleApplyWithAI}
                disabled={applyingWithAI || applied}
                className="btn-yellow-gradient py-3 px-6 rounded-xl shadow-[0_0_25px_rgba(245,158,11,0.35)] w-full md:w-auto flex items-center justify-center gap-2 font-bold text-black disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {applyingWithAI ? (
                  <><Loader2 size={18} className="animate-spin text-black" /> Applying…</>
                ) : applied ? (
                  <><CheckCircle2 size={18} className="text-black" /> Applied</>
                ) : (
                  <><Sparkles size={18} className="text-black" /> Apply with AI</>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Tabs */}
            <div className="flex items-center gap-2 border-b border-white/10 pb-4">
              {['Overview', 'Match Analysis', 'Company'].map(tab => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab.toLowerCase())}
                  className={`text-sm font-semibold transition-all px-4 py-2 rounded-xl relative ${
                    activeTab === tab.toLowerCase()
                      ? 'liquid-glass-interactive text-amber-300 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="py-2"
            >
              {/* ── Overview Tab ── */}
              {activeTab === 'overview' && (
                <div className="space-y-6 text-neutral-300 leading-relaxed">
                  <section className="liquid-glass p-6 rounded-2xl border border-white/10">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                      About the <span className="text-gradient-gold">Role</span>
                    </h3>
                    <p className="whitespace-pre-wrap text-neutral-300 text-sm leading-relaxed">{job.description || 'No description provided.'}</p>
                  </section>

                  {job.responsibilities && job.responsibilities.length > 0 && (
                    <section className="liquid-glass p-6 rounded-2xl border border-white/10">
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                        Key <span className="text-gradient-cyan">Responsibilities</span>
                      </h3>
                      <ul className="space-y-2.5 text-sm">
                        {job.responsibilities.map((r, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <span className="text-amber-400 mt-1 font-bold">•</span>
                            <span className="text-neutral-300">{r}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  <section className="liquid-glass p-6 rounded-2xl border border-white/10">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                      Candidate <span className="text-gradient-emerald">Requirements</span>
                    </h3>
                    <ul className="space-y-2.5 text-sm">
                      {job.requirements.map((r, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="text-amber-400 mt-0.5">✓</span>
                          <span className="text-neutral-300">{r}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section className="liquid-glass p-6 rounded-2xl border border-white/10">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                      Technical <span className="text-gradient-gold">Skill Stack</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, i) => (
                        <span key={i} className="px-3 py-1.5 liquid-glass text-amber-200/90 rounded-lg text-xs font-semibold border border-amber-500/20 hover:border-amber-400/40 transition">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </section>
                </div>
              )}

              {/* ── Match Analysis Tab ── */}
              {activeTab === 'match analysis' && (
                <div className="space-y-6">
                  {matchLoading ? (
                    <div className="liquid-glass p-12 rounded-2xl flex flex-col items-center justify-center gap-4 border border-amber-500/20">
                      <Loader2 size={36} className="animate-spin text-amber-400" />
                      <p className="text-neutral-300 text-sm">AI is analysing your match…</p>
                    </div>
                  ) : matchError ? (
                    <div className="liquid-glass p-8 rounded-2xl flex flex-col items-center gap-3 border border-rose-500/30">
                      <AlertCircle className="text-rose-400" size={28} />
                      <p className="text-neutral-300 text-sm text-center">{matchError}</p>
                      {!user && (
                        <button className="btn-yellow-gradient px-6 py-2 mt-2 rounded-xl text-black font-bold text-sm" onClick={() => navigate('/auth/login')}>
                          Sign In
                        </button>
                      )}
                      {user && (
                        <button className="btn-glass px-6 py-2 mt-2 rounded-xl text-sm" onClick={loadMatchAnalysis}>
                          Retry
                        </button>
                      )}
                    </div>
                  ) : matchData ? (
                    <>
                      <div className="liquid-glass-elevated p-8 rounded-3xl flex flex-col md:flex-row items-center gap-12 border border-amber-500/30 shadow-[0_10px_35px_rgba(0,0,0,0.6)]">
                        <div className="flex-shrink-0">
                          <MatchScoreCircle score={matchData.overall} size={160} />
                        </div>
                        <div className="flex-1 w-full space-y-4">
                          <h3 className="text-xl font-bold text-white mb-4">
                            {matchData.overall >= 85 ? 'Strong Match 🎯' : matchData.overall >= 70 ? 'Good Match 👍' : 'Partial Match'}
                          </h3>
                          {[
                            { label: 'Skills', score: matchData.skillsScore },
                            { label: 'Experience', score: matchData.experienceScore },
                            { label: 'Education', score: matchData.educationScore },
                            { label: 'Location / Remote', score: matchData.locationScore },
                          ].map(factor => (
                            <div key={factor.label} className="space-y-1.5">
                              <div className="flex justify-between text-sm">
                                <span className="text-neutral-400">{factor.label}</span>
                                <span className="text-amber-300 font-bold">{factor.score}%</span>
                              </div>
                              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${factor.score}%` }}
                                  transition={{ duration: 1, delay: 0.2 }}
                                  className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-300 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="liquid-glass p-6 rounded-2xl border border-emerald-500/20">
                          <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                            <CheckCircle2 className="text-emerald-400" size={18} /> Matched Skills
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {matchData.matchedSkills.length > 0 ? matchData.matchedSkills.map((s, i) => (
                              <span key={i} className="glossy-badge-emerald px-2.5 py-1 rounded-full text-xs font-medium">{s}</span>
                            )) : <p className="text-neutral-400 text-sm">No matched skills found.</p>}
                          </div>
                          {matchData.reasons.length > 0 && (
                            <ul className="mt-4 space-y-2 text-sm text-neutral-300">
                              {matchData.reasons.slice(0, 2).map((r, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-emerald-400 mt-0.5">✓</span>{r}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <div className="liquid-glass p-6 rounded-2xl border border-rose-500/20">
                          <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                            <AlertCircle className="text-rose-400" size={18} /> Skills to Develop
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {matchData.missingSkills.length > 0 ? matchData.missingSkills.map((s, i) => (
                              <span key={i} className="glossy-badge-rose px-2.5 py-1 rounded-full text-xs font-medium">{s}</span>
                            )) : <p className="text-neutral-400 text-sm">No missing skills — great fit!</p>}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <button
                          className="btn-glass flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold hover:border-amber-400/40 hover:text-amber-300 transition"
                          onClick={() => navigate('/dashboard/resume/analyze')}
                        >
                          <FileText size={18} /> Tailor Resume
                        </button>
                        <button
                          className="btn-yellow-gradient flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold text-black disabled:opacity-60"
                          onClick={handleApplyWithAI}
                          disabled={applied}
                        >
                          <PenTool size={18} /> {applied ? 'Applied ✓' : 'Apply with AI'}
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="liquid-glass p-12 rounded-2xl flex flex-col items-center gap-4 border border-amber-500/20">
                      <Loader2 size={32} className="animate-spin text-amber-400" />
                      <p className="text-neutral-300 text-sm">Loading match analysis…</p>
                    </div>
                  )}
                </div>
              )}

              {/* ── Company Tab ── */}
              {activeTab === 'company' && (
                <div className="space-y-6 text-neutral-300">
                  <div className="liquid-glass p-6 rounded-2xl border border-white/10">
                    <h3 className="text-lg font-bold text-white mb-2">{job.company}</h3>
                    <p className="text-sm text-neutral-400">Company information and culture details coming soon.</p>
                    <a
                      href={getOfficialJobPortalUrl(job)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-4 text-amber-400 text-sm hover:underline font-semibold"
                    >
                      View official listing on {getPortalDisplayName(job)} →
                    </a>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 space-y-6">
            {/* Apply CTA */}
            <div className="liquid-glass-elevated p-6 rounded-3xl border border-amber-500/30 shadow-[0_10px_30px_rgba(245,158,11,0.15)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
              <h3 className="text-lg font-bold text-white mb-2 relative z-10">Ready to apply?</h3>
              <p className="text-sm text-neutral-400 mb-6 relative z-10 leading-relaxed">
                Our AI calculates your match score, tailors your resume, and tracks the application automatically.
              </p>
              <button
                onClick={handleApplyWithAI}
                disabled={applyingWithAI || applied}
                className="btn-yellow-gradient w-full py-3 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.35)] flex items-center justify-center gap-2 font-bold text-black disabled:opacity-60 disabled:cursor-not-allowed relative z-10"
              >
                {applyingWithAI ? (
                  <><Loader2 size={18} className="animate-spin text-black" /> Applying…</>
                ) : applied ? (
                  <><CheckCircle2 size={18} className="text-black" /> Applied</>
                ) : (
                  <><Sparkles size={18} className="text-black" /> Apply with AI</>
                )}
              </button>

              <a
                href={getOfficialJobPortalUrl(job)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-glass w-full py-2.5 mt-3 rounded-xl flex items-center justify-center gap-2 text-white hover:text-amber-300 border border-white/10 hover:border-amber-400/40 transition text-xs font-semibold relative z-10"
              >
                <span>Apply on {getPortalDisplayName(job)}</span>
                <ExternalLink size={14} />
              </a>

              <div className="mt-6 space-y-3 border-t border-white/10 pt-6 relative z-10">
                <div className="flex items-center gap-3 text-sm text-white/90">
                  <CheckCircle2 size={16} className="text-amber-400 flex-shrink-0" /> AI Match Scoring
                </div>
                <div className="flex items-center gap-3 text-sm text-white/90">
                  <CheckCircle2 size={16} className="text-amber-400 flex-shrink-0" /> Application Tracking
                </div>
                <div className="flex items-center gap-3 text-sm text-white/90">
                  <CheckCircle2 size={16} className="text-amber-400 flex-shrink-0" /> Resume Tailoring
                </div>
              </div>
            </div>

            {/* Similar Jobs */}
            <div className="liquid-glass p-6 rounded-3xl border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">Similar Jobs</h3>
              {similarJobs.length > 0 ? (
                <div className="space-y-3">
                  {similarJobs.map(similar => (
                    <JobCard key={similar.id} job={similar} matchScore={similar.matchScore} compact />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-neutral-500 text-center py-4">Loading similar roles…</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
