import React, { useEffect, useState } from 'react';
import { 
  FileCheck2, 
  Trash2, 
  Clock, 
  ChevronDown, 
  Sparkles, 
  ExternalLink,
  Plus
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { LiquidButton } from '../../components/ui/LiquidButton';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import { applicationService } from '../../services/firebase/applicationService';
import { Application, ApplicationStatus } from '../../types/application';

export const ApplicationsPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all');

  const loadApplications = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const res = await applicationService.getApplications(
        user.uid,
        statusFilter === 'all' ? undefined : statusFilter
      );
      setApplications(res.applications);
    } catch (err) {
      console.warn('Error loading applications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [user, statusFilter]);

  const handleStatusChange = async (appId: string, newStatus: ApplicationStatus) => {
    try {
      await applicationService.updateApplicationStatus(appId, newStatus);
      setApplications((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
      );
      showToast(`Application status updated to ${newStatus}.`, 'success');
    } catch {
      showToast('Could not update status.', 'error');
    }
  };

  const handleDelete = async (appId: string) => {
    try {
      await applicationService.deleteApplication(appId);
      setApplications((prev) => prev.filter((a) => a.id !== appId));
      showToast('Application deleted.', 'info');
    } catch {
      showToast('Could not delete application.', 'error');
    }
  };

  const statuses: { label: string; value: ApplicationStatus | 'all' }[] = [
    { label: 'All', value: 'all' },
    { label: 'Saved', value: 'saved' },
    { label: 'Applied', value: 'applied' },
    { label: 'Interview', value: 'interview' },
    { label: 'Offer', value: 'offer' },
    { label: 'Rejected', value: 'rejected' },
  ];

  return (
    <DashboardLayout
      pageTitle="Application Tracker"
      pageSubtitle="Strictly scoped to your user ID with real-time Firestore synchronization."
    >
      <div className="flex flex-col gap-6">
        {/* Filter bar */}
        <div className="liquid-glass rounded-2xl p-4 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] flex flex-wrap gap-2 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {statuses.map((s) => (
              <button
                key={s.value}
                onClick={() => setStatusFilter(s.value)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  statusFilter === s.value
                    ? 'bg-gradient-to-r from-amber-500/25 to-yellow-500/15 text-amber-300 border border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/10'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="text-xs text-amber-400/90 font-mono font-medium">
            {applications.length} applications tracked
          </div>
        </div>

        {/* Applications table / cards */}
        {isLoading ? (
          <LoadingSpinner label="Querying your private applications collection..." />
        ) : applications.length === 0 ? (
          <div className="liquid-glass-elevated rounded-2xl p-12 text-center text-slate-400 flex flex-col items-center gap-3 border border-white/10">
            <Clock className="w-10 h-10 text-amber-400/60" />
            <p className="text-sm font-semibold text-white">No applications matching this filter.</p>
            <p className="text-xs text-slate-500">Track a job from the catalog or AI matches to see it live here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <div
                key={app.id}
                className="liquid-glass-interactive rounded-2xl p-5 border border-white/10 hover:border-amber-500/40 hover:shadow-[0_0_25px_rgba(245,158,11,0.15)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-base font-bold text-white tracking-tight">{app.jobTitle}</span>
                    <span className="glossy-badge-gold text-[10px]">
                      Match: {app.matchScore}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 font-medium">{app.company} {app.location ? `• ${app.location}` : ''}</p>
                  <p className="text-[11px] text-slate-400 font-mono mt-1">Source: {app.source}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {/* Status Dropdown */}
                  <select
                    value={app.status}
                    onChange={(e) => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                    className="rounded-xl bg-slate-900/90 border border-white/15 px-3.5 py-2 text-xs text-amber-300 font-semibold focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-500/30 cursor-pointer transition"
                  >
                    <option value="saved">Saved</option>
                    <option value="applied">Applied</option>
                    <option value="interview">Interview</option>
                    <option value="offer">Offer</option>
                    <option value="rejected">Rejected</option>
                    <option value="withdrawn">Withdrawn</option>
                  </select>

                  {/* Delete button */}
                  <button
                    onClick={() => handleDelete(app.id)}
                    className="p-2.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/15 border border-transparent hover:border-rose-500/30 transition cursor-pointer"
                    title="Delete Application"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
