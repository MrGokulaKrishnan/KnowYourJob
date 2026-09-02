import React, { useEffect, useState } from 'react';
import { Bot, Shield, Sliders, AlertTriangle, CheckCircle2, Clock, History } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { LiquidButton } from '../../components/ui/LiquidButton';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import { automationService } from '../../services/firebase/automationService';
import { AutomationSettings, AutomationLog } from '../../types/automation';

export const AutomationPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [settings, setSettings] = useState<AutomationSettings | null>(null);
  const [logs, setLogs] = useState<AutomationLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Editable settings
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<'manual' | 'assisted' | 'automated'>('assisted');
  const [dailyLimit, setDailyLimit] = useState(10);
  const [minimumMatchScore, setMinimumMatchScore] = useState(85);

  useEffect(() => {
    const fetchAutomation = async () => {
      if (!user) return;
      try {
        const [s, l] = await Promise.all([
          automationService.getSettings(user.uid),
          automationService.getLogs(user.uid),
        ]);
        setSettings(s);
        setEnabled(s.enabled);
        setMode(s.mode);
        setDailyLimit(s.dailyLimit);
        setMinimumMatchScore(s.minimumMatchScore);
        setLogs(l);
      } catch (err) {
        console.warn('Error loading automation settings:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAutomation();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await automationService.updateSettings(user.uid, {
        enabled,
        mode,
        dailyLimit,
        minimumMatchScore,
      });
      showToast('Autonomous agent rules updated in Firestore!', 'success', 'Settings Saved');
    } catch {
      showToast('Failed to save automation parameters.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout
      pageTitle="Autonomous Application Runner"
      pageSubtitle="Configure background candidate matching, auto-tailoring, and rate limits."
    >
      {isLoading ? (
        <LoadingSpinner label="Loading automation telemetry..." />
      ) : (
        <div className="flex flex-col gap-6 max-w-4xl">
          {/* Main Toggle Banner */}
          <div className="liquid-glass-elevated rounded-2xl p-6 border border-amber-500/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${enabled ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Autonomous Engine: <span className={enabled ? 'text-amber-400' : 'text-slate-400'}>{enabled ? 'ACTIVE' : 'DISABLED'}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {enabled
                    ? 'Engine scans every 15 minutes and submits vetted applications within your limits.'
                    : 'Engine is idle. Turn on to enable background job submissions.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setEnabled(!enabled)}
              className={`px-5 py-2.5 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all shadow-lg ${
                enabled
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                  : 'btn-yellow-gradient text-slate-950'
              }`}
            >
              {enabled ? 'Disable Automation' : 'Enable Autonomous Mode'}
            </button>
          </div>

          {/* Mode & Rate Limits */}
          <div className="liquid-glass rounded-2xl p-6 border border-white/5 flex flex-col gap-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-amber-400" />
              <span>Safety Controls & Execution Mode</span>
            </h3>

            {/* Mode selection */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'manual', title: 'Manual Only', desc: 'Prepares drafts; you click send.' },
                { id: 'assisted', title: 'Assisted Mode', desc: 'Auto-applies with high confidence verification.' },
                { id: 'automated', title: 'Full Autonomous', desc: 'Continuous discovery and submission.' },
              ].map((m) => (
                <div
                  key={m.id}
                  onClick={() => setMode(m.id as any)}
                  className={`p-4 rounded-xl cursor-pointer border transition-all ${
                    mode === m.id
                      ? 'bg-amber-500/15 border-amber-400/80 text-amber-300'
                      : 'bg-white/[0.02] border-white/5 text-slate-400 hover:border-white/15'
                  }`}
                >
                  <div className="font-semibold text-sm text-white">{m.title}</div>
                  <div className="text-xs text-slate-400 mt-1 leading-snug">{m.desc}</div>
                </div>
              ))}
            </div>

            {/* Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-white/5">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs font-medium uppercase text-slate-300">
                  <span>Daily Cap Limit</span>
                  <span className="text-amber-400 font-bold">{dailyLimit} apps / day</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={dailyLimit}
                  onChange={(e) => setDailyLimit(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <span className="text-[11px] text-slate-400">Hard limit enforced by backend security rules.</span>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs font-medium uppercase text-slate-300">
                  <span>Minimum Match Threshold</span>
                  <span className="text-amber-400 font-bold">{minimumMatchScore}% match</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="98"
                  value={minimumMatchScore}
                  onChange={(e) => setMinimumMatchScore(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <span className="text-[11px] text-slate-400">Never applies to roles falling below this ATS score.</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <LiquidButton variant="yellow" onClick={handleSave} isLoading={isSaving}>
                Save Automation Settings
              </LiquidButton>
            </div>
          </div>

          {/* Audit Logs */}
          <div className="liquid-glass rounded-2xl p-6 border border-white/5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <History className="w-5 h-5 text-amber-400" />
                <span>Execution Activity Logs</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">Immutable audit trail</span>
            </div>

            {logs.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
                <Clock className="w-6 h-6 text-slate-600" />
                <span>No automation events recorded yet. Once triggered, executions appear here.</span>
              </div>
            ) : (
              <div className="space-y-2">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-slate-200">{log.message}</span>
                    </div>
                    <span className="text-slate-500 font-mono text-[10px]">
                      {log.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};
