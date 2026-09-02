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
        <div className="liquid-glass rounded-2xl p-4 border border-white/5 flex flex-wrap gap-2 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {statuses.map((s) => (
              <button
                key={s.value}
                onClick={() => setStatusFilter(s.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                  statusFilter === s.value
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-white/5 text-slate-400 hover:text-slate-200 border border-white/5'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-400 font-mono">
            {applications.length} applications tracked
          </div>
        </div>

        {/* Applications table / cards */}
        {isLoading ? (
          <LoadingSpinner label="Querying your private applications collection..." />
        ) : applications.length === 0 ? (
          <div className="liquid-glass rounded-2xl p-12 text-center text-slate-400 flex flex-col items-center gap-3">
            <Clock className="w-8 h-8 text-slate-600" />
            <p className="text-sm">No applications matching this filter.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <div
                key={app.id}
                className="liquid-glass-interactive rounded-2xl p-5 border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-white">{app.jobTitle}</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      Match: {app.matchScore}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5 font-medium">{app.company} {app.location ? `• ${app.location}` : ''}</p>
                  <p className="text-[11px] text-slate-400 font-mono mt-1">Source: {app.source}</p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Status Dropdown */}
                  <select
                    value={app.status}
                    onChange={(e) => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                    className="rounded-xl bg-slate-900 border border-white/10 px-3 py-1.5 text-xs text-amber-300 font-medium focus:outline-none focus:border-amber-400 cursor-pointer"
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
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
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
