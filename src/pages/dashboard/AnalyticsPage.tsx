import React from 'react';
import { BarChart3, TrendingUp, Users, CheckCircle2, Clock } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

export const AnalyticsPage: React.FC = () => {
  return (
    <DashboardLayout
      pageTitle="Career Intelligence & Analytics"
      pageSubtitle="Telemetry on applications, interview callbacks, and market positioning."
    >
      <div className="flex flex-col gap-6">
        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="liquid-glass-interactive rounded-2xl p-6 border border-white/10 hover:border-amber-500/40 hover:shadow-[0_0_25px_rgba(245,158,11,0.18)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)]">
            <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">Interview Callback Rate</div>
            <div className="text-3xl font-extrabold text-gradient-gold mt-2 font-mono">18.4%</div>
            <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+4.2% above software engineering benchmark</span>
            </div>
          </div>

          <div className="liquid-glass-interactive rounded-2xl p-6 border border-white/10 hover:border-amber-500/40 hover:shadow-[0_0_25px_rgba(245,158,11,0.18)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)]">
            <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">Average Match Accuracy</div>
            <div className="text-3xl font-extrabold text-white mt-2 font-mono">89.2%</div>
            <div className="text-[11px] text-amber-400/90 mt-1 font-mono">
              Based on top 35 scraped job specifications
            </div>
          </div>

          <div className="liquid-glass-interactive rounded-2xl p-6 border border-white/10 hover:border-amber-500/40 hover:shadow-[0_0_25px_rgba(245,158,11,0.18)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)]">
            <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">Response Latency</div>
            <div className="text-3xl font-extrabold text-white mt-2 font-mono">3.8 Days</div>
            <div className="text-[11px] text-emerald-400 mt-1 font-medium">
              Recruiters contact fastest on remote roles
            </div>
          </div>
        </div>

        {/* Funnel Overview */}
        <div className="liquid-glass-elevated rounded-2xl p-7 border border-amber-500/25 shadow-[0_0_35px_rgba(245,158,11,0.12),inset_0_1px_1px_rgba(255,255,255,0.18)]">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-amber-400" />
              <span>Application Pipeline Funnel</span>
            </h3>
            <span className="glossy-badge-gold">Live Telemetry</span>
          </div>

          <div className="space-y-4">
            {[
              { stage: 'Discovered & Scored', count: 42, percentage: 100, color: 'bg-gradient-to-r from-amber-400 to-yellow-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' },
              { stage: 'Vetted & Applied', count: 28, percentage: 66, color: 'bg-gradient-to-r from-amber-500 to-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.4)]' },
              { stage: 'Recruiter Screening / Viewed', count: 14, percentage: 33, color: 'bg-gradient-to-r from-yellow-500 to-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.4)]' },
              { stage: 'Technical Interviews', count: 5, percentage: 12, color: 'bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.4)]' },
              { stage: 'Offers Extended', count: 2, percentage: 5, color: 'bg-gradient-to-r from-emerald-400 to-teal-300 shadow-[0_0_10px_rgba(52,211,153,0.5)]' },
            ].map((f, idx) => (
              <div key={idx} className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-200">{f.stage}</span>
                  <span className="font-mono text-amber-300 font-bold">{f.count} ({f.percentage}%)</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-white/5 overflow-hidden border border-white/10">
                  <div className={`h-full ${f.color} rounded-full transition-all duration-700`} style={{ width: `${f.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
