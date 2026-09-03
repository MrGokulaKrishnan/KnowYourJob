import React, { useEffect, useState } from 'react';
import { Search, Sparkles, Check, ExternalLink, RefreshCw, ShieldCheck, Clock, Globe, Briefcase, Filter } from 'lucide-react';
import { serverTimestamp } from 'firebase/firestore';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { LiquidButton } from '../../components/ui/LiquidButton';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import { jobService } from '@/lib/services/jobService';
import { applicationService } from '../../services/firebase/applicationService';
import type { NormalizedJob } from '@/types/job';

export const JobsPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [jobs, setJobs] = useState<NormalizedJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [remoteFilter, setRemoteFilter] = useState('All');
  const [portalFilter, setPortalFilter] = useState<'all' | 'LinkedIn' | 'Naukri' | 'Indeed'>('all');
  const [last24HoursOnly, setLast24HoursOnly] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [appliedJobIds, setAppliedJobIds] = useState<Record<string, boolean>>({});
  const [syncStatus, setSyncStatus] = useState<any>(null);

  const loadJobs = async (forceRefresh = false) => {
    setIsLoading(true);
    try {
      if (forceRefresh) {
        setIsRefreshing(true);
        showToast('Running Apify scraper for LinkedIn & Naukri (Last 24 Hours)…', 'info', 'Apify Sync');
        await jobService.refreshVerifiedCatalog();
      } else {
        await jobService.seedInitialJobsIfEmpty();
      }

      const res = await jobService.searchJobs({
        remoteType: remoteFilter !== 'All' ? remoteFilter : undefined,
        portal: portalFilter !== 'all' ? portalFilter : undefined,
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
      showToast(err?.message || 'Could not refresh jobs from Apify.', 'error');
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
      pageSubtitle="Real-time verified listings extracted from LinkedIn, Naukri & Indeed via Apify scrapers. Auto-refreshed every 24 hours."
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
                <h2 className="text-base font-bold text-white">Apify Verified Scraper Engine</h2>
                <span className="inline-flex items-center gap-1 text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> 24h Cycle Active
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 font-semibold">
                  LinkedIn & Naukri
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {syncStatus?.lastSyncedAt
                    ? `Last synced: ${syncStatus.hoursSinceSync}h ago · Auto-refreshes in ~${syncStatus.hoursUntilNextSync}h`
                    : 'Auto-refreshes every 24 hours via Apify'}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              onClick={() => loadJobs(true)}
              disabled={isRefreshing}
              className="btn-yellow-gradient px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer disabled:opacity-50 transition shadow-lg shadow-amber-500/20"
              title="Trigger Apify scraper to refresh catalog"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Scraping Apify…' : 'Refresh Catalog (24h)'}</span>
            </button>
          </div>
        </div>

        {/* Portal Filter Tabs & Time Window */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
          {/* Portal Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            {(['all', 'LinkedIn', 'Naukri', 'Indeed'] as const).map((portal) => (
              <button
                key={portal}
                onClick={() => setPortalFilter(portal)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${
                  portalFilter === portal
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_15px_rgba(255,208,0,0.15)]'
                    : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
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
        <div className="liquid-glass rounded-2xl p-4 border border-white/5 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search verified jobs, skills, or companies (e.g. AI Engineer, Python, React)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl bg-slate-900/60 border border-white/10 pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex gap-2 shrink-0 overflow-x-auto">
            {['All', 'Remote', 'Hybrid', 'Onsite'].map((type) => (
              <button
                key={type}
                onClick={() => setRemoteFilter(type)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                  remoteFilter === type
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-white/5 text-slate-400 hover:text-slate-200 border border-white/5'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Jobs List */}
        {isLoading ? (
          <LoadingSpinner label="Extracting verified jobs from Apify & Cloud Firestore..." />
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
                  className="liquid-glass-interactive rounded-2xl p-6 border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition hover:border-amber-500/30"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
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
                        <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400">
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
                        <span key={skill} className="px-2 py-0.5 rounded bg-white/5 text-[11px] text-slate-300">
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
                      href={job.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 transition"
                    >
                      <span>View on {job.portal || 'Portal'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
