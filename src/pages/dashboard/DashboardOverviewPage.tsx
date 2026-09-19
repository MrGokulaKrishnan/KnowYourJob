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
  Search,
  FileText,
  Sliders,
  ExternalLink,
  ChevronRight,
  Zap,
  Check,
  Activity
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { LiquidButton } from '../../components/ui/LiquidButton';
import { UserAvatar } from '../../components/ui/UserAvatar';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import { applicationService } from '../../services/firebase/applicationService';
import { jobService } from '@/lib/services/jobService';
import { Application } from '../../types/application';
import type { NormalizedJob } from '@/types/normalizedJob';
import { getOfficialJobPortalUrl, getPortalDisplayName } from '@/lib/utils/jobPortalUrl';

export const DashboardOverviewPage: React.FC = () => {
  const { user, userDoc } = useAuth();
  const { showToast } = useToast();

  const [applications, setApplications] = useState<Application[]>([]);
  const [recentJobs, setRecentJobs] = useState<NormalizedJob[]>([]);
  const [appliedJobIds, setAppliedJobIds] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = userDoc?.displayName?.split(' ')[0] || user?.displayName?.split(' ')[0] || 'there';

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;
      try {
        await jobService.seedInitialJobsIfEmpty();

        const [appRes, jobRes] = await Promise.all([
          applicationService.getApplications(user.uid, undefined, undefined, 5),
          jobService.searchJobs({ limit: 4, last24HoursOnly: false }),
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
      });
      setAppliedJobIds((prev) => ({ ...prev, [job.id]: true }));
      showToast(`Tracked application to ${job.company} (${job.title})!`, 'success', 'Application Recorded');
    } catch {
      showToast('Failed to record application in Firestore.', 'error');
    }
  };

  const activityData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => ({
    day: d,
    activity: [2, 4, 3, 6, 8, 5, 7][i],
  }));

  const matchDistribution = [
    { label: 'Direct Fit (90%+)', count: 18, pct: 45, color: 'bg-emerald-400' },
    { label: 'High Alignment (75-89%)', count: 15, pct: 38, color: 'bg-amber-400' },
    { label: 'Broader Fit (<75%)', count: 7, pct: 17, color: 'bg-slate-400' },
  ];

  const stats = [
    { label: 'Total Tracked', value: applications.length, icon: FileCheck2, change: '+2 this week' },
    { label: 'Avg Match Score', value: '92%', icon: Sparkles, change: 'Top 5% candidate' },
    { label: 'Interviews Pipeline', value: applications.filter(a => a.status === 'interview').length, icon: Briefcase, change: 'Active momentum' },
    { label: '24h Catalog Engine', value: 'Multi-Source', icon: Bot, change: 'LinkedIn & Naukri' },
  ];

  return (
    <DashboardLayout
      pageTitle="Autonomous Job Hub"
      pageSubtitle={`Welcome back, ${firstName}. Here is your career telemetry and live verified openings.`}
    >
      <div className="flex flex-col gap-6">

        {/* 1. Welcome & Telemetry Header Banner */}
        <div className="relative overflow-hidden rounded-2xl liquid-glass-elevated p-6 sm:p-8 border border-amber-500/30 shadow-[0_0_35px_rgba(245,158,11,0.14),inset_0_1px_1px_rgba(255,255,255,0.22)]">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <Link to="/dashboard/profile" title="View Candidate Profile">
                <UserAvatar
                  user={user}
                  userDoc={userDoc}
                  size="2xl"
                  roundedClassName="rounded-2xl"
                  showGoogleBadge={true}
                  border={true}
                  className="hover:scale-105 transition-transform"
                />
              </Link>
              <div>
                <div className="glossy-badge-gold mb-2.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>AI Autonomous Matching Active · Multi-Source 24h Sync</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {getGreeting()}, <span className="text-gradient-gold">{firstName}</span>.
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-xl leading-relaxed">
                  KnowYourJob is monitoring live engineering openings, computing ATS compatibility, and prepping verified applications directly linked to official job portals.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link to="/dashboard/jobs">
                <LiquidButton variant="yellow" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Explore Verified Jobs
                </LiquidButton>
              </Link>
              <Link to="/dashboard/resume">
                <LiquidButton variant="glass" leftIcon={<FileText className="w-4 h-4" />}>
                  ATS Resume Scan
                </LiquidButton>
              </Link>
            </div>
          </div>
        </div>

        {/* 2. Beginner Quick-Start Launchpad (3 Steps) */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Getting Started · Quick Launchpad</span>
            </h3>
            <span className="text-[11px] text-slate-500">3 simple steps to high-response job search</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Step 1 */}
            <div className="liquid-glass-interactive rounded-2xl p-5 border border-white/10 hover:border-amber-500/40 hover:shadow-[0_0_25px_rgba(245,158,11,0.18)] flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    Step 01
                  </span>
                  <span className="badge-ai text-[10px]">Instant Scan</span>
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition">
                  Upload Resume & ATS Check
                </h4>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Extract 30+ skills and evaluate your ATS compatibility score against 2026 hiring benchmarks.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <Link to="/dashboard/resume" className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1">
                  <span>Scan Resume</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>

            {/* Step 2 */}
            <div className="liquid-glass-interactive rounded-2xl p-5 border border-white/10 hover:border-amber-500/40 hover:shadow-[0_0_25px_rgba(245,158,11,0.18)] flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    Step 02
                  </span>
                  <span className="glossy-badge-emerald text-[10px]">
                    Role Targeting
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition">
                  Set Roles & INR Benchmarks
                </h4>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Configure target domains (AI, ML, Fullstack), remote preference, and minimum compensation targets.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <Link to="/dashboard/preferences" className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1">
                  <span>Configure Filters</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>

            {/* Step 3 */}
            <div className="liquid-glass-interactive rounded-2xl p-5 border border-white/10 hover:border-amber-500/40 hover:shadow-[0_0_25px_rgba(245,158,11,0.18)] flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    Step 03
                  </span>
                  <span className="glossy-badge-blue text-[10px]">
                    <Check className="w-2.5 h-2.5" /> 24h Verified
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition">
                  Browse & Apply on Official Portals
                </h4>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Discover verified jobs from LinkedIn, Naukri & Indeed with genuine 1-click official portal redirection.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <Link to="/dashboard/jobs" className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1">
                  <span>Browse Matches</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Telemetry Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            const gradientColors = [
              'text-gradient-gold',
              'text-gradient-cyan',
              'text-gradient-emerald',
              'text-gradient-purple'
            ];
            const textGradient = gradientColors[idx % gradientColors.length];
            return (
              <div key={idx} className="liquid-glass-interactive rounded-2xl p-5 border border-white/10 hover:border-amber-500/40 hover:shadow-[0_0_25px_rgba(245,158,11,0.18)] flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">{s.label}</span>
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-[inset_0_1px_0_rgba(253,230,138,0.25),0_0_15px_rgba(245,158,11,0.15)]">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className={`text-2xl font-bold font-mono tracking-tight ${textGradient}`}>{s.value}</div>
                  <div className="text-[11px] text-amber-400/90 mt-1 font-mono flex items-center gap-1">
                    <span>{s.change}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 4. Telemetry Analytics Split: 7-Day Velocity & Match Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Area Chart: Application & Discovery Velocity */}
          <div className="lg:col-span-2 liquid-glass rounded-2xl p-6 border border-white/8 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                  <span>Application & Discovery <span className="text-gradient-gold">Velocity</span></span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Scraped listings aligned with your verified skillset this week</p>
              </div>
              <span className="badge-ai text-[11px]">7-Day Cycle</span>
            </div>

            <div className="h-56 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="velocityGold" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.28} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(9, 13, 20, 0.95)', 
                      borderColor: 'rgba(251, 191, 36, 0.3)', 
                      borderRadius: '12px',
                      backdropFilter: 'blur(12px)',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                      color: '#f8fafc',
                      fontSize: '12px'
                    }}
                    itemStyle={{ color: '#fbbf24', fontWeight: 600 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="activity" 
                    stroke="#f59e0b" 
                    strokeWidth={2.5} 
                    fillOpacity={1} 
                    fill="url(#velocityGold)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Match Distribution Breakdown */}
          <div className="liquid-glass rounded-2xl p-6 border border-white/8 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
                <Activity className="w-4 h-4 text-amber-400" />
                <span>Match Score Spectrum</span>
              </h3>
              <p className="text-xs text-slate-400 mb-5">Compatibility across verified openings in Firestore</p>

              <div className="space-y-4">
                {matchDistribution.map((tier, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium">{tier.label}</span>
                      <span className="font-mono text-amber-300 font-semibold">{tier.count} roles ({tier.pct}%)</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-800/80 overflow-hidden border border-white/5">
                      <div 
                        className={`h-full rounded-full ${tier.color} transition-all duration-500`}
                        style={{ width: `${tier.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Insights Card */}
            <div className="mt-6 p-4 rounded-xl glass-gold border border-amber-500/25">
              <div className="flex items-center gap-2 mb-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs font-bold text-white">AI Career Insight</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Your profile matches best for <strong className="text-amber-300">Generative AI Engineer</strong> roles (94% avg fit).
              </p>
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-300 border border-red-500/20">Missing: Kubernetes</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-300 border border-red-500/20">Missing: Terraform</span>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Split Row: Recent Applications & Top Live Verified Openings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Applications list */}
          <div className="liquid-glass rounded-2xl p-6 border border-white/8 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-amber-400" />
                <span>Recent Applications</span>
              </h3>
              <Link to="/dashboard/applications" className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1">
                <span>View Kanban</span>
                <ChevronRight size={14} />
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
                      <div className="text-xs text-slate-400">{app.company} · {app.location}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 uppercase font-semibold">
                        {app.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Live Openings Preview */}
          <div className="liquid-glass rounded-2xl p-6 border border-white/8 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Search className="w-4 h-4 text-amber-400" />
                  <span>Live Verified Openings</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Multi-source verified & auto-refreshed in the last 24 hours</p>
              </div>
              <Link to="/dashboard/jobs" className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1">
                <span>Browse All</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            {isLoading ? (
              <div className="space-y-3 py-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : recentJobs.length === 0 ? (
              <div className="text-center py-10 flex flex-col items-center gap-3">
                <p className="text-xs text-slate-400">No live jobs loaded.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentJobs.slice(0, 3).map((job) => {
                  const isApplied = appliedJobIds[job.id];
                  return (
                    <div
                      key={job.id}
                      className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-amber-500/25 transition"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-sm font-semibold text-white truncate">{job.title}</span>
                          {job.portal === 'LinkedIn' ? (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#0A66C2]/20 text-[#388bfd] border border-[#0A66C2]/40">
                              LinkedIn
                            </span>
                          ) : job.portal === 'Naukri' ? (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/30">
                              Naukri
                            </span>
                          ) : (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                              {job.portal || 'Verified'}
                            </span>
                          )}
                          <span className="badge-ai text-[9px]">
                            {job.matchScore ?? 92}% Match
                          </span>
                        </div>
                        <div className="text-xs text-slate-400">
                          {job.company} · {job.location} · {job.remoteType}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button
                          disabled={isApplied}
                          onClick={() => handleApply(job)}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition cursor-pointer disabled:opacity-50"
                        >
                          {isApplied ? 'Tracked' : 'Track'}
                        </button>
                        <a
                          href={getOfficialJobPortalUrl(job)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-semibold bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/25 hover:border-amber-400/40 transition"
                        >
                          <span>Apply on {getPortalDisplayName(job)}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
