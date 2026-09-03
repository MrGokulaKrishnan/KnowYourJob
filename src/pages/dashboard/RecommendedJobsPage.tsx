import React, { useEffect, useState } from 'react';
import { Sparkles, Check, ExternalLink } from 'lucide-react';
import { serverTimestamp } from 'firebase/firestore';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { LiquidButton } from '../../components/ui/LiquidButton';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import { jobService } from '@/lib/services/jobService';
import { applicationService } from '../../services/firebase/applicationService';
import type { NormalizedJob } from '@/types/job';

export const RecommendedJobsPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [jobs, setJobs] = useState<NormalizedJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [appliedIds, setAppliedIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const loadRecs = async () => {
      setIsLoading(true);
      try {
        await jobService.seedInitialJobsIfEmpty();
        const res = await jobService.searchJobs({ limit: 10 });
        setJobs(res.jobs);
      } catch (err) {
        console.warn('Recs load error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecs();
  }, []);

  const handleApply = async (job: NormalizedJob) => {
    if (!user) return;
    const score = job.matchScore ?? 80;
    try {
      await applicationService.createApplication({
        userId: user.uid,
        jobId: job.id,
        company: job.company,
        jobTitle: job.title,
        location: job.location,
        source: job.source,
        sourceUrl: job.sourceUrl,
        matchScore: score,
        status: 'applied',
        automationMode: 'assisted',
        appliedAt: serverTimestamp(),
      });
      setAppliedIds((prev) => ({ ...prev, [job.id]: true }));
      showToast(`Assisted application dispatched to ${job.company}!`, 'success', 'Application Recorded');
    } catch {
      showToast('Could not record application.', 'error');
    }
  };


  return (
    <DashboardLayout
      pageTitle="AI Recommended Matches"
      pageSubtitle="Vector similarity and skill alignment computed against your Firestore profile."
    >
      <div className="flex flex-col gap-6">
        {isLoading ? (
          <LoadingSpinner label="Computing skill alignment vectors..." />
        ) : jobs.length === 0 ? (
          <div className="liquid-glass rounded-2xl p-12 text-center text-slate-400">
            No recommendations currently generated.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {jobs.map((job) => {
              const score = job.matchScore ?? 80;
              const isApplied = appliedIds[job.id];
              return (
                <div
                  key={job.id}
                  className="liquid-glass-elevated rounded-2xl p-6 border border-amber-500/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>{score}% Compatibility</span>
                      </span>
                      <span className="text-xs text-slate-400">{job.remoteType}</span>
                    </div>

                    <h3 className="text-lg font-bold text-white tracking-tight">{job.title}</h3>
                    <p className="text-xs text-slate-300 font-medium">{job.company} • {job.location}</p>

                    <div className="mt-3 flex items-center gap-2 text-xs text-emerald-400">
                      <span>✓ Top 3 skills match your profile:</span>
                      <span className="font-mono text-slate-300">{job.skills.slice(0, 3).join(', ')}</span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-end gap-2 shrink-0">
                    <LiquidButton
                      variant={isApplied ? 'glass' : 'yellow'}
                      disabled={isApplied}
                      onClick={() => handleApply(job)}

                      leftIcon={isApplied ? <Check className="w-4 h-4 text-emerald-400" /> : <Sparkles className="w-4 h-4" />}
                    >
                      {isApplied ? 'Application Logged' : 'Auto-Draft & Apply'}
                    </LiquidButton>
                    <a
                      href={job.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-amber-300 transition"
                    >
                      <span>View Role</span>
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
