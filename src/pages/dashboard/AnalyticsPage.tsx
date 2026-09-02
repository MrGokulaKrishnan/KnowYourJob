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
          <div className="liquid-glass rounded-2xl p-5 border border-white/5">
            <div className="text-xs text-slate-400 uppercase tracking-wider">Interview Callback Rate</div>
            <div className="text-3xl font-bold text-amber-400 mt-2 font-mono">18.4%</div>
            <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>+4.2% above software engineering benchmark</span>
            </div>
          </div>

          <div className="liquid-glass rounded-2xl p-5 border border-white/5">
            <div className="text-xs text-slate-400 uppercase tracking-wider">Average Match Accuracy</div>
            <div className="text-3xl font-bold text-white mt-2 font-mono">89.2%</div>
            <div className="text-[11px] text-slate-400 mt-1">
              Based on top 35 scraped job specifications
            </div>
          </div>

          <div className="liquid-glass rounded-2xl p-5 border border-white/5">
            <div className="text-xs text-slate-400 uppercase tracking-wider">Response Latency</div>
            <div className="text-3xl font-bold text-white mt-2 font-mono">3.8 Days</div>
            <div className="text-[11px] text-amber-400 mt-1">
              Recruiters contact fastest on remote roles
            </div>
          </div>
        </div>

        {/* Funnel Overview */}
        <div className="liquid-glass-elevated rounded-2xl p-6 border border-white/5">
          <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-amber-400" />
            <span>Application Pipeline Funnel</span>
          </h3>

          <div className="space-y-4">
            {[
              { stage: 'Discovered & Scored', count: 42, percentage: 100, color: 'bg-amber-500' },
              { stage: 'Vetted & Applied', count: 28, percentage: 66, color: 'bg-amber-400' },
              { stage: 'Recruiter Screening / Viewed', count: 14, percentage: 33, color: 'bg-yellow-400' },
              { stage: 'Technical Interviews', count: 5, percentage: 12, color: 'bg-emerald-400' },
              { stage: 'Offers Extended', count: 2, percentage: 5, color: 'bg-emerald-300' },
            ].map((f, idx) => (
              <div key={idx} className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-200">{f.stage}</span>
                  <span className="font-mono text-amber-300">{f.count} ({f.percentage}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <div className={`h-full ${f.color} rounded-full`} style={{ width: `${f.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
