import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, SlidersHorizontal, Sparkles, Check } from 'lucide-react';
import { serverTimestamp } from 'firebase/firestore';
import { jobService } from '@/lib/services/jobService';
import { applicationService } from '@/services/firebase/applicationService';
import type { NormalizedJob } from '@/types/job';
import { JobCard } from '@/components/jobs/JobCard';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/context/ToastContext';

export default function JobsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [jobs, setJobs] = useState<NormalizedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [applyingIds, setApplyingIds] = useState<Record<string, boolean>>({});
  const [appliedIds, setAppliedIds] = useState<Record<string, boolean>>({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<any>(null);

  // Filters state
  const [matchScore, setMatchScore] = useState(0);
  const [remoteType, setRemoteType] = useState<string[]>([]);
  const [portal, setPortal] = useState<'all' | 'LinkedIn' | 'Naukri' | 'Indeed'>('all');
  const [last24HoursOnly, setLast24HoursOnly] = useState(true);

  const fetchJobs = async (force = false) => {
    setLoading(true);
    try {
      if (force) {
        setIsRefreshing(true);
        showToast('Refreshing verified jobs from LinkedIn & Naukri (Apify)…', 'info', 'Apify Sync');
        await jobService.refreshVerifiedCatalog();
      }
      const res = await jobService.searchJobs({
        portal: portal !== 'all' ? portal : undefined,
        last24HoursOnly,
        remoteType: remoteType.length > 0 ? remoteType : undefined,
        minMatchScore: matchScore > 0 ? matchScore : undefined,
      });
      setJobs(res.jobs);
      setSyncStatus(jobService.getSyncStatus());
      if (force) {
        showToast(`Catalog refreshed! ${res.jobs.length} jobs available.`, 'success', '24h Sync Complete');
      }
    } catch (err: any) {
      console.error(err);
      showToast(err?.message || 'Failed to fetch jobs.', 'error');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [portal, last24HoursOnly, remoteType, matchScore]);

  const handleRemoteToggle = (val: string) => {
    setRemoteType(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);
  };

  const handleApply = async (job: NormalizedJob) => {
    if (!user) {
      showToast('Please sign in to apply.', 'warning');
      return;
    }
    if (appliedIds[job.id]) return;

    setApplyingIds(prev => ({ ...prev, [job.id]: true }));
    try {
      await applicationService.createApplication({
        userId: user.uid,
        jobId: job.id,
        company: job.company,
        jobTitle: job.title,
        location: job.location,
        source: job.source,
        sourceUrl: job.sourceUrl,
        matchScore: job.matchScore ?? 80,
        status: 'applied',
        automationMode: 'manual',
        appliedAt: serverTimestamp(),
      });
      setAppliedIds(prev => ({ ...prev, [job.id]: true }));
      showToast(`Application tracked for ${job.title} at ${job.company}!`, 'success', 'Application Recorded');
    } catch (err) {
      console.error(err);
      showToast('Failed to record application. Please try again.', 'error');
    } finally {
      setApplyingIds(prev => ({ ...prev, [job.id]: false }));
    }
  };

  const filteredJobs = jobs.filter(job => {
    if (searchTerm && !job.title.toLowerCase().includes(searchTerm.toLowerCase()) && !job.company.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (remoteType.length > 0 && !remoteType.some(r => r.toLowerCase() === job.remoteType.toLowerCase())) {
      return false;
    }
    if (matchScore > 0 && (job.matchScore ?? 0) < matchScore) {
      return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full flex flex-col gap-6">

      {/* Verified Catalog Status Banner */}
      <div className="glass p-5 rounded-2xl border border-yellow-400/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400 shrink-0">
            <Sparkles size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-bold text-white">Verified Job Catalog</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                24h Auto-Refresh
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0A66C2]/20 text-[#388bfd] border border-[#0A66C2]/40">
                LinkedIn Scraper Active
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              {syncStatus?.lastSyncedAt
                ? `Last synced: ${syncStatus.hoursSinceSync}h ago · Next refresh in ~${syncStatus.hoursUntilNextSync}h`
                : 'Scraped and verified via Apify across LinkedIn & Naukri'}
            </p>
          </div>
        </div>

        <button
          onClick={() => fetchJobs(true)}
          disabled={isRefreshing}
          className="btn-primary text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <span className={isRefreshing ? 'animate-spin' : ''}>↻</span>
          <span>{isRefreshing ? 'Scraping Apify…' : 'Refresh Catalog (24h)'}</span>
        </button>
      </div>

      {/* Portal Selection Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(['all', 'LinkedIn', 'Naukri', 'Indeed'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPortal(p)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${
              portal === p
                ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/40 shadow-[0_0_15px_rgba(255,208,0,0.15)]'
                : 'bg-white/5 text-neutral-400 hover:text-white border border-white/5'
            }`}
          >
            {p === 'all' ? 'All Portals' : p}
          </button>
        ))}

        <div className="w-px h-6 bg-white/10 mx-2" />

        <button
          onClick={() => setLast24HoursOnly(!last24HoursOnly)}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
            last24HoursOnly
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              : 'bg-white/5 text-neutral-400 hover:text-white border border-white/5'
          }`}
        >
          <span>Last 24 Hours {last24HoursOnly ? '✓' : ''}</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="glass-strong p-2 rounded-2xl flex items-center gap-2 sticky top-4 z-20">
        <div className="flex-1 flex items-center gap-3 px-4">
          <Search className="text-muted" size={20} />
          <input 
            type="text" 
            placeholder="Search verified jobs, skills or companies..." 
            className="w-full bg-transparent border-none text-white focus:outline-none focus:ring-0 placeholder-muted py-3 text-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-px h-8 bg-white/10 mx-2"></div>
        <button className="btn-glass p-3 rounded-xl flex items-center gap-2">
          <Filter size={18} />
          <span className="hidden sm:inline text-xs">Filters</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 flex-1">
        {/* Filter Sidebar (Desktop) */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full lg:w-72 hidden lg:flex flex-col gap-6"
        >
          <div className="glass p-6 rounded-2xl sticky top-28 space-y-8">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-white">
                <SlidersHorizontal size={18} /> Filters
              </h2>
              <button
                className="text-xs text-secondary hover:text-primary transition-colors"
                onClick={() => { setRemoteType([]); setMatchScore(0); }}
              >
                Clear All
              </button>
            </div>

            {/* Remote Type */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-white">Remote Type</h3>
              {['remote', 'hybrid', 'onsite'].map(type => (
                <label key={type} className="flex items-center gap-3 cursor-pointer group" onClick={() => handleRemoteToggle(type)}>
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${remoteType.includes(type) ? 'bg-primary border-primary' : 'border-white/20 group-hover:border-primary/50'}`}>
                    {remoteType.includes(type) && <div className="w-2.5 h-2.5 bg-black rounded-sm" />}
                  </div>
                  <span className="text-sm text-secondary group-hover:text-white transition-colors capitalize">{type}</span>
                </label>
              ))}
            </div>

            {/* Minimum Match */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-white">Min Match Score</h3>
                <span className="text-xs text-primary font-mono">{matchScore}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={matchScore}
                onChange={(e) => setMatchScore(parseInt(e.target.value))}
                className="w-full accent-primary h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
              />
            </div>

            <button className="btn-primary w-full py-3 rounded-xl shadow-glow">
              Apply Filters
            </button>
          </div>
        </motion.div>

        {/* Job List */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium text-white">
              {loading ? 'Searching jobs...' : <><span className="font-bold text-primary">{filteredJobs.length}</span> jobs found</>}
            </h2>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted hidden sm:inline">Sort by:</span>
              <select className="glass-input border-none py-1.5 px-3 bg-transparent text-white cursor-pointer">
                <option>Best Match</option>
                <option>Most Recent</option>
                <option>Highest Salary</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="skeleton h-48 rounded-2xl" />
              ))
            ) : filteredJobs.length > 0 ? (
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.1 } }
                }}
                className="space-y-4"
              >
                {filteredJobs.map(job => (
                  <motion.div key={job.id} variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}>
                    <JobCard 
                      job={job} 
                      matchScore={job.matchScore}
                      onApply={() => handleApply(job)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="glass p-12 text-center rounded-2xl border border-white/5 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full glass-subtle flex items-center justify-center text-muted mb-4">
                  <Search size={28} />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No matching jobs found</h3>
                <p className="text-secondary max-w-md">Try adjusting your filters or search terms to find more opportunities.</p>
                <button className="btn-glass mt-6" onClick={() => setSearchTerm('')}>Clear Search</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
