import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Building2, MapPin, Clock, ChevronLeft, Sparkles, CheckCircle2,
  AlertCircle, Share2, Bookmark, FileText, PenTool, Loader2,
} from 'lucide-react';
import { serverTimestamp } from 'firebase/firestore';
import { jobService } from '@/lib/services/jobService';
import { aiService, getUserCandidateProfile, type MatchScoreResult } from '@/lib/services/aiService';
import { applicationService } from '@/services/firebase/applicationService';
import type { NormalizedJob } from '@/types/job';
import { JobCard } from '@/components/jobs/JobCard';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/context/ToastContext';

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
    jobService.getSimilarJobs(job.id, job.skills, 3).then(setSimilarJobs).catch(() => setSimilarJobs([]));
  }, [job]);

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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="skeleton h-64 rounded-2xl mb-8"></div>
        <div className="flex gap-8">
          <div className="skeleton h-96 rounded-2xl flex-1"></div>
          <div className="skeleton h-96 rounded-2xl w-1/3 hidden lg:block"></div>
        </div>
      </div>
    );
  }

  if (!job) {
    return <div className="p-8 text-center text-white">Job not found</div>;
  }

  const salaryDisplay = formatSalary(job);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back link */}
      <Link to="/jobs" className="inline-flex items-center gap-2 text-sm text-secondary hover:text-white transition-colors mb-6">
        <ChevronLeft size={16} /> Back to jobs
      </Link>

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong p-8 rounded-2xl relative overflow-hidden mb-8 border border-white/10"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 flex items-center justify-center text-2xl font-bold text-white shadow-xl">
              {job.company.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white">{job.title}</h1>
                {job.isDemo && <span className="badge-demo text-xs px-2 py-0.5 rounded">DEMO</span>}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-secondary text-sm">
                <span className="flex items-center gap-1.5 font-medium text-white/80">
                  <Building2 size={16} /> {job.company}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin size={16} /> {job.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={16} /> {new Date(job.postedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                {salaryDisplay && (
                  <span className="flex items-center gap-1.5 text-yellow-400 font-medium px-2.5 py-1 bg-yellow-400/10 rounded-lg border border-yellow-400/20">
                    {salaryDisplay}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button className="btn-glass p-3 flex-shrink-0" title="Save Job">
              <Bookmark size={20} />
            </button>
            <button className="btn-glass p-3 flex-shrink-0" title="Share">
              <Share2 size={20} />
            </button>
            <button
              onClick={handleApplyWithAI}
              disabled={applyingWithAI || applied}
              className="btn-primary py-3 px-6 shadow-glow w-full md:w-auto flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {applyingWithAI ? (
                <><Loader2 size={18} className="animate-spin" /> Applying…</>
              ) : applied ? (
                <><CheckCircle2 size={18} className="text-green-300" /> Applied</>
              ) : (
                <><Sparkles size={18} /> Apply with AI</>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Tabs */}
          <div className="flex items-center gap-6 border-b border-white/10 pb-4">
            {['Overview', 'Match Analysis', 'Company'].map(tab => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab.toLowerCase())}
                className={`text-sm font-medium transition-colors relative pb-4 -mb-4 ${
                  activeTab === tab.toLowerCase() ? 'text-primary' : 'text-secondary hover:text-white'
                }`}
              >
                {tab}
                {activeTab === tab.toLowerCase() && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_8px_rgba(255,208,0,0.8)]" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="py-4"
          >
            {/* ── Overview Tab ── */}
            {activeTab === 'overview' && (
              <div className="space-y-8 text-secondary leading-relaxed">
                <section>
                  <h3 className="text-lg font-semibold text-white mb-4">About the Role</h3>
                  <p className="whitespace-pre-wrap">{job.description || 'No description provided.'}</p>
                </section>

                {job.responsibilities && job.responsibilities.length > 0 && (
                  <section>
                    <h3 className="text-lg font-semibold text-white mb-4">Responsibilities</h3>
                    <ul className="space-y-2">
                      {job.responsibilities.map((r, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                <section>
                  <h3 className="text-lg font-semibold text-white mb-4">Requirements</h3>
                  <ul className="space-y-2">
                    {job.requirements.map((r, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-yellow-400 mt-1">✓</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-white mb-4">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, i) => (
                      <span key={i} className="px-3 py-1.5 glass-subtle text-white/90 rounded-lg text-sm border border-white/5">
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* ── Match Analysis Tab ── */}
            {activeTab === 'match analysis' && (
              <div className="space-y-8">
                {matchLoading ? (
                  <div className="glass p-12 rounded-2xl flex flex-col items-center justify-center gap-4 border border-yellow-500/10">
                    <Loader2 size={36} className="animate-spin text-primary" />
                    <p className="text-secondary text-sm">AI is analysing your match…</p>
                  </div>
                ) : matchError ? (
                  <div className="glass p-8 rounded-2xl flex flex-col items-center gap-3 border border-red-500/20">
                    <AlertCircle className="text-red-400" size={28} />
                    <p className="text-secondary text-sm text-center">{matchError}</p>
                    {!user && (
                      <button className="btn-primary px-6 py-2 mt-2" onClick={() => navigate('/auth/login')}>
                        Sign In
                      </button>
                    )}
                    {user && (
                      <button className="btn-glass px-6 py-2 mt-2" onClick={loadMatchAnalysis}>
                        Retry
                      </button>
                    )}
                  </div>
                ) : matchData ? (
                  <>
                    <div className="glass p-8 rounded-2xl flex flex-col md:flex-row items-center gap-12 border border-yellow-500/10">
                      <div className="flex-shrink-0">
                        <MatchScoreCircle score={matchData.overall} size={160} />
                      </div>
                      <div className="flex-1 w-full space-y-4">
                        <h3 className="text-xl font-bold text-white mb-6">
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
                              <span className="text-secondary">{factor.label}</span>
                              <span className="text-white font-medium">{factor.score}%</span>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${factor.score}%` }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="glass-subtle p-6 rounded-2xl border border-green-500/10">
                        <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                          <CheckCircle2 className="text-green-400" size={18} /> Matched Skills
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {matchData.matchedSkills.length > 0 ? matchData.matchedSkills.map((s, i) => (
                            <span key={i} className="px-2 py-0.5 bg-green-500/10 text-green-300 rounded text-xs border border-green-500/20">{s}</span>
                          )) : <p className="text-secondary text-sm">No matched skills found.</p>}
                        </div>
                        {matchData.reasons.length > 0 && (
                          <ul className="mt-4 space-y-2 text-sm text-secondary">
                            {matchData.reasons.slice(0, 2).map((r, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-green-400 mt-0.5">✓</span>{r}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <div className="glass-subtle p-6 rounded-2xl border border-red-500/10">
                        <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                          <AlertCircle className="text-red-400" size={18} /> Skills to Develop
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {matchData.missingSkills.length > 0 ? matchData.missingSkills.map((s, i) => (
                            <span key={i} className="px-2 py-0.5 bg-red-500/10 text-red-300 rounded text-xs border border-red-500/20">{s}</span>
                          )) : <p className="text-secondary text-sm">No missing skills — great fit!</p>}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        className="btn-glass flex-1 flex items-center justify-center gap-2"
                        onClick={() => navigate('/dashboard/resume/analyze')}
                      >
                        <FileText size={18} /> Tailor Resume
                      </button>
                      <button
                        className="btn-glass flex-1 flex items-center justify-center gap-2"
                        onClick={handleApplyWithAI}
                        disabled={applied}
                      >
                        <PenTool size={18} /> {applied ? 'Applied ✓' : 'Apply with AI'}
                      </button>
                    </div>
                  </>
                ) : (
                  // Shown briefly before loadMatchAnalysis fires
                  <div className="glass p-12 rounded-2xl flex flex-col items-center gap-4 border border-yellow-500/10">
                    <Loader2 size={32} className="animate-spin text-primary" />
                    <p className="text-secondary text-sm">Loading match analysis…</p>
                  </div>
                )}
              </div>
            )}

            {/* ── Company Tab ── */}
            {activeTab === 'company' && (
              <div className="space-y-6 text-secondary">
                <div className="glass p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-white mb-2">{job.company}</h3>
                  <p className="text-sm">Company information and culture details coming soon.</p>
                  <a
                    href={job.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-4 text-primary text-sm hover:underline"
                  >
                    View original job post →
                  </a>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 space-y-6">
          {/* Apply CTA */}
          <div className="glass-gold p-6 rounded-2xl border border-yellow-500/20 shadow-card">
            <h3 className="text-lg font-bold text-white mb-2">Ready to apply?</h3>
            <p className="text-sm text-secondary mb-6">
              Our AI calculates your match score, tailors your resume, and tracks the application automatically.
            </p>
            <button
              onClick={handleApplyWithAI}
              disabled={applyingWithAI || applied}
              className="btn-primary w-full py-3 shadow-glow flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {applyingWithAI ? (
                <><Loader2 size={18} className="animate-spin" /> Applying…</>
              ) : applied ? (
                <><CheckCircle2 size={18} className="text-green-300" /> Applied</>
              ) : (
                <><Sparkles size={18} /> Apply with AI</>
              )}
            </button>

            <div className="mt-6 space-y-3 border-t border-white/10 pt-6">
              <div className="flex items-center gap-3 text-sm text-white">
                <CheckCircle2 size={16} className="text-primary" /> AI Match Scoring
              </div>
              <div className="flex items-center gap-3 text-sm text-white">
                <CheckCircle2 size={16} className="text-primary" /> Application Tracking
              </div>
              <div className="flex items-center gap-3 text-sm text-white">
                <CheckCircle2 size={16} className="text-primary" /> Resume Tailoring
              </div>
            </div>
          </div>

          {/* Similar Jobs */}
          <div className="glass p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Similar Jobs</h3>
            {similarJobs.length > 0 ? (
              <div className="space-y-3">
                {similarJobs.map(similar => (
                  <JobCard key={similar.id} job={similar} matchScore={similar.matchScore} compact />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted text-center py-4">Loading similar roles…</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
