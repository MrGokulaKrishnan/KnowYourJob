import React, { useEffect, useState } from 'react';
import { Search, Sparkles, Check, ExternalLink } from 'lucide-react';
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
  const [remoteFilter, setRemoteFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [appliedJobIds, setAppliedJobIds] = useState<Record<string, boolean>>({});

  const loadJobs = async () => {
    setIsLoading(true);
    try {
      await jobService.seedInitialJobsIfEmpty();
      const res = await jobService.searchJobs({
        remoteType: remoteFilter !== 'All' ? remoteFilter : undefined,
        limit: 20,
      });
      setJobs(res.jobs);
    } catch (err) {
      console.warn('Jobs fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [remoteFilter]);

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
        matchScore: job.matchScore ?? 80,
        status: 'applied',
        automationMode: 'manual',
        appliedAt: serverTimestamp(),
      });
      setAppliedJobIds((prev) => ({ ...prev, [job.id]: true }));
      showToast(`Tracked application to ${job.company} (${job.title})!`, 'success', 'Application Recorded');
    } catch (err) {
      showToast('Failed to record application in Firestore.', 'error');
    }
  };

  const filteredJobs = jobs.filter((j) => {
    if (!searchTerm) return true;
    return (
      j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });


  return (
    <DashboardLayout
      pageTitle="Verified Job Catalog"
      pageSubtitle="Targeted roles queried directly from Cloud Firestore with server-side indexes."
    >
      <div className="flex flex-col gap-6">
        {/* Search & Filters */}
        <div className="liquid-glass rounded-2xl p-4 border border-white/5 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, company, or skills (e.g. React, TypeScript)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl bg-slate-900/60 border border-white/10 pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex gap-2">
            {['All', 'Remote', 'Hybrid', 'Onsite'].map((type) => (
              <button
                key={type}
                onClick={() => setRemoteFilter(type)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition ${
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
          <LoadingSpinner label="Fetching jobs from Cloud Firestore..." />
        ) : filteredJobs.length === 0 ? (
          <div className="liquid-glass rounded-2xl p-12 text-center text-slate-400">
            No matching jobs found. Try adjusting your search or filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredJobs.map((job) => {
              const isApplied = appliedJobIds[job.id];
              return (
                <div
                  key={job.id}
                  className="liquid-glass-interactive rounded-2xl p-6 border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        {job.remoteType}
                      </span>
                      <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-white/5 text-slate-400">
                        {job.employmentType}
                      </span>
                      <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400">
                        {job.salary.currency === 'INR'
                          ? `₹${Math.round(job.salary.min / 100000)}L – ₹${Math.round(job.salary.max / 100000)}L / yr`
                          : `$${Math.round(job.salary.min / 1000)}k – $${Math.round(job.salary.max / 1000)}k / yr`}
                      </span>
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
                      className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-amber-300 transition"
                    >
                      <span>External Post</span>
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
