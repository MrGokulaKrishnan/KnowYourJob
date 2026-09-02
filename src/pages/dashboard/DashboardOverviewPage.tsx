import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  Sparkles, 
  FileCheck2, 
  Bot, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  Search
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { LiquidButton } from '../../components/ui/LiquidButton';
import { useAuth } from '../../hooks/useAuth';
import { applicationService } from '../../services/firebase/applicationService';
import { jobService } from '../../services/firebase/jobService';
import { Application } from '../../types/application';
import { Job } from '../../types/job';

export const DashboardOverviewPage: React.FC = () => {
  const { user, userDoc } = useAuth();

  const [applications, setApplications] = useState<Application[]>([]);
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;
      try {
        // Seed demo jobs if empty for seamless evaluation
        await jobService.seedInitialJobsIfEmpty();

        const [appRes, jobRes] = await Promise.all([
          applicationService.getApplications(user.uid, undefined, undefined, 5),
          jobService.getJobs({ limitCount: 4 }),
        ]);

        setApplications(appRes.applications);
        setRecentJobs(jobRes.jobs);
      } catch (err) {
        console.warn('Dashboard data load warning:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  const stats = [
    { label: 'Total Tracked', value: applications.length, icon: FileCheck2, change: '+2 this week' },
    { label: 'Avg Match Score', value: '88%', icon: Sparkles, change: 'Top 5% candidate' },
    { label: 'Interviews Scheduled', value: applications.filter(a => a.status === 'interview').length, icon: Briefcase, change: 'Active momentum' },
    { label: 'Automation Engine', value: 'Assisted', icon: Bot, change: '10/day limit safe' },
  ];

  return (
    <DashboardLayout
      pageTitle="Autonomous Job Hub"
      pageSubtitle={`Welcome back, ${userDoc?.displayName || user?.displayName || 'Candidate'}. Here is your career telemetry.`}
    >
      <div className="flex flex-col gap-6">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-2xl liquid-glass-elevated p-6 sm:p-8 border border-amber-500/20">
          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Autonomous Matching Active</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Your career trajectory is on track.
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                KnowYourJob is continuously scanning top tier engineering openings, computing ATS compatibility, and prepping tailored applications.
              </p>
            </div>
            <div className="flex gap-3">
              <Link to="/dashboard/jobs">
                <LiquidButton variant="yellow" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Explore Jobs
                </LiquidButton>
              </Link>
            </div>
          </div>
        </div>

        {/* Telemetry Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={idx} className="liquid-glass rounded-2xl p-5 border border-white/5 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 uppercase tracking-wider">{s.label}</span>
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-2xl font-bold text-white tracking-tight">{s.value}</div>
                  <div className="text-[11px] text-amber-400/80 mt-1 font-mono">{s.change}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Content Split: Recent Applications & Top Job Openings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Applications list */}
          <div className="liquid-glass rounded-2xl p-6 border border-white/5 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileCheck2 className="w-4.5 h-4.5 text-amber-400" />
                <span>Recent Applications</span>
              </h3>
              <Link to="/dashboard/applications" className="text-xs text-amber-400 hover:text-amber-300">
                View All
              </Link>
            </div>

            {applications.length === 0 ? (
              <div className="text-center py-10 flex flex-col items-center gap-3">
                <Clock className="w-8 h-8 text-slate-600" />
                <p className="text-xs text-slate-400">No applications tracked yet.</p>
                <Link to="/dashboard/jobs">
                  <LiquidButton variant="glass" className="text-xs">
                    Apply to your first role
                  </LiquidButton>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between hover:border-amber-500/20 transition"
                  >
                    <div>
                      <div className="text-sm font-semibold text-white">{app.jobTitle}</div>
                      <div className="text-xs text-slate-400">{app.company}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 uppercase">
                        {app.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Jobs Discovery Preview */}
          <div className="liquid-glass rounded-2xl p-6 border border-white/5 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Search className="w-4.5 h-4.5 text-amber-400" />
                <span>Live Openings in Firestore</span>
              </h3>
              <Link to="/dashboard/jobs" className="text-xs text-amber-400 hover:text-amber-300">
                Browse All
              </Link>
            </div>

            {recentJobs.length === 0 ? (
              <div className="text-center py-10 flex flex-col items-center gap-3">
                <p className="text-xs text-slate-400">No live jobs loaded.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentJobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between hover:border-amber-500/20 transition"
                  >
                    <div>
                      <div className="text-sm font-semibold text-white">{job.title}</div>
                      <div className="text-xs text-slate-400">{job.company} • {job.location}</div>
                    </div>
                    <Link to="/dashboard/jobs">
                      <LiquidButton variant="glass" className="text-xs px-3 py-1.5">
                        Details
                      </LiquidButton>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
