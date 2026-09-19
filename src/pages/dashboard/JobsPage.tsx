import React, { useEffect, useState } from 'react';
import { ShieldCheck, RefreshCw, Clock, ExternalLink, Sparkles, Check, Search, Filter, Plus, Building2, Briefcase, Lock } from 'lucide-react';
import { serverTimestamp } from 'firebase/firestore';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { LiquidButton } from '../../components/ui/LiquidButton';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import { jobService } from '@/lib/services/jobService';
import { applicationService } from '@/services/firebase/applicationService';
import type { NormalizedJob } from '@/types/normalizedJob';
import { getOfficialJobPortalUrl, getPortalDisplayName } from '@/lib/utils/jobPortalUrl';
import { PostJobModal } from '@/components/jobs/PostJobModal';
import { isAuthorizedJobPoster } from '@/lib/utils/jobPosterAuth';

export const JobsPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [jobs, setJobs] = useState<NormalizedJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [remoteFilter, setRemoteFilter] = useState('All');
  const [portalFilter, setPortalFilter] = useState<'all' | 'LinkedIn' | 'Naukri' | 'Indeed' | 'Direct Employer' | 'My Posts'>('all');
  const [last24HoursOnly, setLast24HoursOnly] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [appliedJobIds, setAppliedJobIds] = useState<Record<string, boolean>>({});
  const [syncStatus, setSyncStatus] = useState<any>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  const loadJobs = async (forceRefresh = false) => {
    setIsLoading(true);
    try {
      if (forceRefresh) {
        setIsRefreshing(true);
        showToast('Refreshing verified jobs from multi-channel providers (Last 24 Hours)…', 'info', 'Catalog Refresh');
        await jobService.refreshVerifiedCatalog();
      } else {
        await jobService.seedInitialJobsIfEmpty();
      }

      const res = await jobService.searchJobs({
        remoteType: remoteFilter !== 'All' ? remoteFilter : undefined,
        portal: portalFilter !== 'all' && portalFilter !== 'My Posts' ? portalFilter : undefined,
        myPostedJobs: portalFilter === 'My Posts',
        userId: user?.uid,
        last24HoursOnly: last24HoursOnly,
        limit: 50,
      });

      setJobs(res.jobs);
      setSyncStatus(jobService.getSyncStatus());
      if (forceRefresh) {
        showToast(`Catalog refreshed! ${res.jobs.length} verified jobs available.`, 'success', '24h Sync Complete');
      }
    } catch (err: any) {
      console.warn('Jobs fetch error:', err);
      showToast(err?.message || 'Could not refresh jobs.', 'error');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [remoteFilter, portalFilter, last24HoursOnly]);

  const handleApply = async (job: NormalizedJob) => {
    if (!user) return;
    try {
      await applicationService.createApplication({
        userId: user.uid,
        jobId: job.id,
        company: job.company,
        jobTitle: job.title,
        location: job.location,
        source: job.source,
        sourceUrl: job.sourceUrl,
        matchScore: job.matchScore ?? 85,
        status: 'applied',
        automationMode: 'manual',
        appliedAt: serverTimestamp(),
      });
      setAppliedJobIds((prev) => ({ ...prev, [job.id]: true }));
      showToast(`Tracked application to ${job.company} (${job.title})!`, 'success', 'Application Recorded');
    } catch {
      showToast('Failed to record application in Firestore.', 'error');
    }
  };

  const filteredJobs = jobs.filter((j) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      j.title.toLowerCase().includes(term) ||
      j.company.toLowerCase().includes(term) ||
      (j.location && j.location.toLowerCase().includes(term)) ||
      j.skills.some((s) => s.toLowerCase().includes(term))
    );
  });

  return (
    <DashboardLayout
      pageTitle="Verified Job Catalog"
      pageSubtitle="Real-time verified listings aggregated across LinkedIn, Naukri, Indeed & Direct Platforms. Auto-refreshed every 24 hours."
    >
      <div className="flex flex-col gap-6">
        {/* Verified Catalog Status Banner */}
        <div className="liquid-glass-elevated rounded-2xl p-5 border border-amber-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-amber-500/5 via-transparent to-yellow-400/5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold text-white">Multi-Source Verified Job Engine</h2>
                <span className="inline-flex items-center gap-1 text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> 24h Cycle Active
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 font-semibold">
                  Multi-Channel Verified
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {syncStatus?.lastSyncedAt
                    ? `Last synced: ${syncStatus.hoursSinceSync}h ago · Auto-refreshes in ~${syncStatus.hoursUntilNextSync}h`
                    : 'Auto-refreshed every 24 hours across multi-source providers'}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
            <button
              onClick={() => setIsPostModalOpen(true)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg transition active:scale-95 shrink-0 ${
                isAuthorizedJobPoster(user?.email, (user as any)?.role)
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-black hover:from-amber-300 hover:to-yellow-300 shadow-amber-500/20'
                  : 'bg-white/10 text-amber-300 hover:bg-white/15 border border-amber-500/30'
              }`}
              title={isAuthorizedJobPoster(user?.email, (user as any)?.role) ? "Post a verified job opening" : "Official recruiter mail ID required"}
            >
              {isAuthorizedJobPoster(user?.email, (user as any)?.role) ? (
                <Plus className="w-4 h-4 stroke-[3]" />
              ) : (
                <Lock className="w-3.5 h-3.5" />
              )}
              <span>{isAuthorizedJobPoster(user?.email, (user as any)?.role) ? 'Post a Job' : 'Post a Job (Official Recruiter Only)'}</span>
            </button>

            <button
              onClick={() => loadJobs(true)}
              disabled={isRefreshing}
              className="btn-glass px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer disabled:opacity-50 transition border border-white/10 hover:border-amber-400/40 text-slate-200 shrink-0"
              title="Trigger provider sync to refresh catalog"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
              <span>{isRefreshing ? 'Refreshing…' : 'Refresh Catalog (24h)'}</span>
            </button>
          </div>
        </div>

        {/* Portal Filter Tabs & Time Window */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
          {/* Portal Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {(['all', 'LinkedIn', 'Naukri', 'Indeed', 'Direct Employer', 'My Posts'] as const).map((portal) => (
              <button
                key={portal}
                onClick={() => setPortalFilter(portal)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${
                  portalFilter === portal
                    ? 'bg-gradient-to-r from-amber-500/25 to-yellow-500/15 text-amber-300 border border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/10'
                }`}
              >
                {portal === 'all' ? 'All Portals' : portal}
              </button>
            ))}
          </div>

          {/* Last 24 Hours Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setLast24HoursOnly(!last24HoursOnly)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                last24HoursOnly
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Last 24 Hours {last24HoursOnly ? '✓' : ''}</span>
            </button>
          </div>
        </div>

        {/* Search & Work Type Filters */}
        <div className="liquid-glass rounded-2xl p-4 sm:p-5 border border-white/8 flex flex-col gap-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search verified jobs, skills, or companies (e.g. AI Engineer, Python, React)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl bg-slate-900/70 border border-white/10 pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400/80 focus:shadow-[0_0_0_3px_rgba(245,158,11,0.15)] transition"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex gap-2 shrink-0 overflow-x-auto">
              {['All', 'Remote', 'Hybrid', 'Onsite'].map((type) => (
                <button
                  key={type}
                  onClick={() => setRemoteFilter(type)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                    remoteFilter === type
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[inset_0_1px_0_rgba(253,230,138,0.2)]'
                      : 'bg-white/5 text-slate-400 hover:text-slate-200 border border-white/5'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Search Chips & Beginner Guide */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pt-2 border-t border-white/5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-slate-400 font-medium mr-1">Popular:</span>
              {[
                { label: 'Generative AI', term: 'Generative AI' },
                { label: 'LLMs & RAG', term: 'LLM' },
                { label: 'Python', term: 'Python' },
                { label: 'Bengaluru', term: 'Bangalore' },
                { label: 'Remote', term: 'Remote' },
              ].map((chip) => (
                <button
                  key={chip.label}
                  onClick={() => setSearchTerm(searchTerm === chip.term ? '' : chip.term)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    searchTerm === chip.term
                      ? 'bg-amber-500/25 text-amber-300 border border-amber-500/40'
                      : 'bg-white/[0.04] text-slate-400 hover:text-slate-200 hover:bg-white/[0.08] border border-white/5'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            <div className="text-[11px] text-amber-400/80 flex items-center gap-1">
              <Sparkles size={12} className="text-amber-400" />
              <span>Official portal redirection guaranteed</span>
            </div>
          </div>
        </div>

        {/* Jobs List */}
        {isLoading ? (
          <LoadingSpinner label="Aggregating verified jobs from multi-channel providers & Cloud Firestore..." />
        ) : filteredJobs.length === 0 ? (
          <div className="liquid-glass rounded-2xl p-12 text-center text-slate-400 space-y-3">
            <Briefcase className="w-8 h-8 text-amber-400 mx-auto opacity-60" />
            <p className="font-semibold text-white">No jobs match your current filter.</p>
            <p className="text-xs text-slate-500">
              Try switching portal tabs, disabling the 24h filter, or click "Refresh Catalog (24h)".
            </p>
            <button
              onClick={() => {
                setPortalFilter('all');
                setLast24HoursOnly(false);
                setSearchTerm('');
              }}
              className="btn-glass px-4 py-1.5 rounded-xl text-xs text-amber-400 font-medium mt-2"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredJobs.map((job) => {
              const isApplied = appliedJobIds[job.id];
              return (
                <div
                  key={job.id}
                  className="liquid-glass-interactive rounded-2xl p-6 border border-white/10 hover:border-amber-500/40 hover:shadow-[0_0_30px_rgba(245,158,11,0.18)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)]"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {/* Match Score Badge */}
                      <span className="badge-ai text-[10px]">
                        {job.matchScore ?? 92}% Match
                      </span>

                      {/* Verified Badge */}
                      {job.isVerified && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          <Check className="w-3 h-3" /> Verified Catalog
                        </span>
                      )}

                      {/* Portal Badge */}
                      {job.portal === 'LinkedIn' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0A66C2]/20 text-[#388bfd] border border-[#0A66C2]/40">
                          LinkedIn
                        </span>
                      ) : job.portal === 'Naukri' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
                          Naukri
                        </span>
                      ) : job.portal === 'Indeed' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                          Indeed
                        </span>
                      ) : job.postedBy || job.portal === 'Direct Employer' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          <Building2 className="w-2.5 h-2.5" /> Direct Employer
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-slate-400">
                          {job.source}
                        </span>
                      )}

                      {/* Freshness Badge */}
                      {job.postedAt && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20">
                          <Clock className="w-3 h-3 text-amber-400" />
                          {(() => {
                            const diffMs = Date.now() - new Date(job.postedAt).getTime();
                            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                            if (diffHours < 1) return 'Scraped just now';
                            if (diffHours < 24) return `${diffHours}h ago`;
                            return `${Math.floor(diffHours / 24)}d ago`;
                          })()}
                        </span>
                      )}

                      {/* Remote Type */}
                      <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-white/5 text-slate-300 capitalize">
                        {job.remoteType}
                      </span>

                      {/* Salary */}
                      {job.salary && (
                        <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {job.salary.currency === 'INR'
                            ? `₹${Math.round(job.salary.min / 100000)}L – ₹${Math.round(job.salary.max / 100000)}L / yr`
                            : `$${Math.round(job.salary.min / 1000)}k – $${Math.round(job.salary.max / 1000)}k / yr`}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-white tracking-tight">{job.title}</h3>
                    <p className="text-sm text-slate-300 mt-0.5 font-medium">{job.company} • {job.location}</p>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 max-w-2xl">{job.description}</p>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {job.skills.map((skill) => (
                        <span key={skill} className="px-2.5 py-0.5 rounded-lg bg-amber-500/10 text-amber-300/90 border border-amber-500/20 text-[11px] font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-end gap-2 shrink-0">
                    <LiquidButton
                      variant={isApplied ? 'glass' : 'yellow'}
                      disabled={isApplied}
                      onClick={() => handleApply(job)}
                      leftIcon={isApplied ? <Check className="w-4 h-4 text-emerald-400" /> : <Sparkles className="w-4 h-4" />}
                    >
                      {isApplied ? 'Applied' : 'Track Application'}
                    </LiquidButton>

                    <a
                      href={getOfficialJobPortalUrl(job)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition font-medium bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 hover:border-amber-400/40"
                    >
                      <span>Apply on {getPortalDisplayName(job)}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Job Posting Modal */}
        <PostJobModal
          isOpen={isPostModalOpen}
          onClose={() => setIsPostModalOpen(false)}
          onJobPosted={(newJob) => {
            setJobs((prev) => [newJob, ...prev]);
          }}
        />
      </div>
    </DashboardLayout>
  );
};
