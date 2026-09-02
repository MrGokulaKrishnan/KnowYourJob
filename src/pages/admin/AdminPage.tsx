import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Users, Briefcase, Send, Bot, AlertTriangle, Activity, CheckCircle2, PauseCircle, PlayCircle, RefreshCw, Filter, ShieldAlert } from 'lucide-react';
import { GlassCard } from '@/components/glass/GlassCard';
import { GlassMetric } from '@/components/glass/GlassMetric';
import { GlassBadge } from '@/components/glass/GlassBadge';
import { GlassButton } from '@/components/glass/GlassButton';

export default function AdminPage() {
  const [automationActive, setAutomationActive] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'ai' | 'errors'>('overview');

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-strong p-6 rounded-3xl border border-[rgba(255,215,0,0.25)]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400/20 to-amber-500/10 border border-yellow-400/40 flex items-center justify-center text-yellow-400 shadow-[0_0_30px_rgba(255,208,0,0.2)]">
              <Shield size={30} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-black text-white">Admin Command Center</h1>
                <GlassBadge variant="yellow" dot>System Admin</GlassBadge>
              </div>
              <p className="text-neutral-400 text-sm mt-1">Platform operations, AI orchestrators, rate limiting, and integrity monitoring.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <GlassButton
              variant={automationActive ? 'danger' : 'primary'}
              size="sm"
              icon={automationActive ? <PauseCircle size={16} /> : <PlayCircle size={16} />}
              onClick={() => setAutomationActive(!automationActive)}
            >
              {automationActive ? 'Kill Switch: Pause Automation' : 'Resume Global Automation'}
            </GlassButton>
          </div>
        </div>

        {/* Global Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <GlassMetric
            label="Total Platform Users"
            value="14,892"
            subtext="+384 this week"
            trend={{ direction: 'up', value: '18%' }}
            icon={<Users size={20} className="text-yellow-400" />}
          />
          <GlassMetric
            label="Active AI Job Matches"
            value="128,450"
            subtext="Across 12 data providers"
            trend={{ direction: 'up', value: '24%' }}
            icon={<Briefcase size={20} className="text-yellow-400" />}
            highlight
          />
          <GlassMetric
            label="Verified Applications"
            value="32,610"
            subtext="Zero CAPTCHA bypasses"
            trend={{ direction: 'up', value: '12%' }}
            icon={<Send size={20} className="text-yellow-400" />}
          />
          <GlassMetric
            label="AI Token Invocations"
            value="1.42M"
            subtext="Gemini 2.0 Flash backend"
            icon={<Bot size={20} className="text-yellow-400" />}
          />
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-2">
          {(['overview', 'jobs', 'ai', 'errors'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/30 shadow-[0_0_15px_rgba(255,208,0,0.15)]'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content based on tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* System Health */}
            <GlassCard variant="strong" className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Activity className="text-yellow-400" size={20} /> System Architecture Status
                </h3>
                <GlassBadge variant="green" dot>All Subsystems Nominal</GlassBadge>
              </div>

              <div className="space-y-4">
                {[
                  { name: 'Firebase Authentication & Session Guard', status: 'Healthy', latency: '42ms', load: '12%' },
                  { name: 'Cloud Functions (Gemini 2.0 Flash Proxy)', status: 'Healthy', latency: '420ms', load: '38%' },
                  { name: 'Firestore Enterprise Cluster (Multi-region)', status: 'Healthy', latency: '18ms', load: '22%' },
                  { name: 'Encrypted Resume Storage Buckets (Private)', status: 'Encrypted', latency: '65ms', load: '8%' },
                  { name: 'Headless Application Queue & State Machine', status: automationActive ? 'Active' : 'Paused', latency: '110ms', load: automationActive ? '45%' : '0%' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
                    <div>
                      <p className="font-semibold text-white text-sm">{item.name}</p>
                      <p className="text-xs text-neutral-400 mt-0.5">Latency: {item.latency} · Cluster Load: {item.load}</p>
                    </div>
                    <GlassBadge variant={item.status === 'Paused' ? 'amber' : 'green'}>{item.status}</GlassBadge>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Security Alerts */}
            <GlassCard variant="gold" className="space-y-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="text-yellow-400" size={20} />
                <h3 className="text-lg font-bold text-white">Security Audits</h3>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Zero security bypass attempts recorded. All automation safely halts when encountering external CAPTCHA challenges or login checkpoints.
              </p>

              <div className="space-y-3 pt-2">
                <div className="p-3 rounded-xl bg-yellow-400/10 border border-yellow-400/20 text-xs text-yellow-300">
                  <strong>Prompt Injection Filter:</strong> 100% active. 14 attempts neutralized in job descriptions.
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-neutral-300">
                  <strong>Private Storage Guard:</strong> Cross-user read operations blocked by Security Rules.
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-neutral-300">
                  <strong>App Check Status:</strong> Enforcing reCAPTCHA Enterprise tokens on Cloud Functions.
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        {activeTab === 'jobs' && (
          <GlassCard variant="default" className="space-y-4">
            <h3 className="text-lg font-bold text-white">Job Provider Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Demo Job Engine</span>
                  <GlassBadge variant="yellow">Active</GlassBadge>
                </div>
                <p className="text-xs text-neutral-400">12 curated AI engineering roles with verified Indian and global salary spectrums.</p>
              </div>
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">RapidAPI Enterprise</span>
                  <GlassBadge variant="default">Standby</GlassBadge>
                </div>
                <p className="text-xs text-neutral-400">Adapter connected. Awaiting production API key injection via environment variables.</p>
              </div>
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Direct ATS Feeds</span>
                  <GlassBadge variant="green">Enabled</GlassBadge>
                </div>
                <p className="text-xs text-neutral-400">Direct webhook ingress enabled for enterprise career partners.</p>
              </div>
            </div>
          </GlassCard>
        )}

        {activeTab === 'ai' && (
          <GlassCard variant="default" className="space-y-4">
            <h3 className="text-lg font-bold text-white">AI Engine & Model Health</h3>
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-yellow-400/20 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white">Gemini 2.0 Flash — Structured Output Pipeline</h4>
                  <p className="text-xs text-neutral-400">Zod schema validation enforced on all candidate profile & ATS responses.</p>
                </div>
                <GlassBadge variant="ai">Zero Hallucination Policy</GlassBadge>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-white/5 rounded-xl">
                  <span className="text-xs text-neutral-400">Avg Parsing Time</span>
                  <p className="text-lg font-black text-yellow-400">1.8s</p>
                </div>
                <div className="p-3 bg-white/5 rounded-xl">
                  <span className="text-xs text-neutral-400">Match Accuracy</span>
                  <p className="text-lg font-black text-yellow-400">97.4%</p>
                </div>
                <div className="p-3 bg-white/5 rounded-xl">
                  <span className="text-xs text-neutral-400">Schema Validation Failures</span>
                  <p className="text-lg font-black text-green-400">0.00%</p>
                </div>
              </div>
            </div>
          </GlassCard>
        )}

        {activeTab === 'errors' && (
          <GlassCard variant="default" className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="text-yellow-400" size={20} /> Logged System Exceptions
            </h3>
            <div className="space-y-2">
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-red-400 uppercase tracking-wider">MFA Security Pause</span>
                  <p className="text-sm text-white mt-1">Application for user_8471 paused: Target portal triggered SMS verification challenge.</p>
                  <p className="text-xs text-neutral-400 mt-1">Status: User notified to complete manually. Automation safely stopped.</p>
                </div>
                <span className="text-xs text-neutral-500">12 min ago</span>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider">Rate Limit Throttled</span>
                  <p className="text-sm text-white mt-1">Daily limit reached for user_9210 (10 applications/day cap respected).</p>
                  <p className="text-xs text-neutral-400 mt-1">Status: Queued for next 24-hour cycle.</p>
                </div>
                <span className="text-xs text-neutral-500">1 hr ago</span>
              </div>
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
