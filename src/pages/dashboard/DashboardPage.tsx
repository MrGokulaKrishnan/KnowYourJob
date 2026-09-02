import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Link } from 'react-router-dom';
import { Briefcase, FileText, CheckCircle, Award, Sparkles, Zap, ChevronRight, Activity } from 'lucide-react';
import { jobService } from '@/lib/services/jobService';
import type { NormalizedJob } from '@/types/job';
import { JobCard } from '@/components/jobs/JobCard';
import clsx from 'clsx';

// Assuming GlassMetric exists, otherwise implementing inline for dashboard
const GlassMetric = ({ title, value, icon: Icon, trend }: any) => (
  <div className="glass p-6 rounded-xl relative overflow-hidden group">
    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full -mr-16 -mt-16 blur-2xl transition-all duration-500 group-hover:bg-yellow-500/10" />
    <div className="flex items-start justify-between relative z-10">
      <div>
        <p className="text-secondary text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-white">{value}</h3>
      </div>
      <div className="p-3 glass-subtle rounded-lg text-primary">
        <Icon size={24} />
      </div>
    </div>
    {trend && (
      <div className="mt-4 flex items-center text-sm relative z-10">
        <span className={clsx("font-medium", trend > 0 ? "text-green-400" : "text-red-400")}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
        <span className="text-muted ml-2">vs last month</span>
      </div>
    )}
  </div>
);

export default function DashboardPage() {
  const [recommendedJobs, setRecommendedJobs] = useState<NormalizedJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const result = await jobService.searchJobs({ limit: 3 });
        setRecommendedJobs(result.jobs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const chartData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => ({
    day: d,
    applications: [2, 4, 1, 3, 5, 2, 4][i]
  }));

  const matchData = [
    { name: 'Excellent (90%+)', count: 12 },
    { name: 'Good (75-89%)', count: 24 },
    { name: 'Fair (<75%)', count: 5 }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div 
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Good evening, Alex</h1>
          <p className="text-secondary flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Your job search is active.
          </p>
        </div>
        <div className="glass-strong p-4 rounded-xl flex items-center gap-6 border border-yellow-500/20">
          <div>
            <p className="text-xs text-muted uppercase tracking-wider mb-1">AI Match Health</p>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-primary text-shadow-glow">92%</span>
              <span className="text-sm text-green-400 font-medium mb-1">Excellent</span>
            </div>
          </div>
          <Activity size={32} className="text-primary opacity-50" />
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassMetric title="Recommended Jobs" value={recommendedJobs.length ? "24+" : "0"} icon={Briefcase} trend={12} />
        <GlassMetric title="Applications" value="0" icon={FileText} trend={0} />
        <GlassMetric title="Interviews" value="0" icon={CheckCircle} />
        <GlassMetric title="Offers" value="0" icon={Award} />
      </motion.div>

      {/* Charts Section */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area Chart */}
        <div className="lg:col-span-2 glass p-6 rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Application Activity</h3>
            <select className="glass-input text-sm py-1 px-3 border-none bg-transparent">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFD000" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#FFD000" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="day" stroke="#777777" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#777777" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', borderColor: 'rgba(255,208,0,0.2)', borderRadius: '8px' }}
                  itemStyle={{ color: '#FFD000' }}
                />
                <Area type="monotone" dataKey="applications" stroke="#FFD000" strokeWidth={3} fillOpacity={1} fill="url(#colorApps)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart / Match Distribution */}
        <div className="glass p-6 rounded-xl flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-6">Match Distribution</h3>
          <div className="flex-1 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={matchData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={110} stroke="#B8B8B8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.02)'}}
                  contentStyle={{ backgroundColor: '#111', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                />
                <Bar dataKey="count" fill="#FFD000" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Bottom Section */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Matches */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="text-primary" size={20} />
              Top Matches For You
            </h3>
            <Link to="/jobs" className="text-sm text-primary hover:text-white transition-colors flex items-center gap-1">
              View All Jobs <ChevronRight size={16} />
            </Link>
          </div>
          
          <div className="space-y-4">
            {loading ? (
              [1, 2, 3].map(i => <div key={i} className="skeleton h-32 rounded-xl" />)
            ) : recommendedJobs.length > 0 ? (
              recommendedJobs.slice(0, 3).map(job => (
                <JobCard key={job.id} job={job} compact matchScore={Math.floor(Math.random() * 15) + 80} />
              ))
            ) : (
              <div className="glass p-8 text-center rounded-xl">
                <p className="text-secondary">No recommendations available yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - AI Insights & Automation */}
        <div className="space-y-6">
          {/* AI Insights Card */}
          <div className="glass-gold p-6 rounded-xl border border-yellow-500/30 shadow-[0_0_30px_rgba(255,208,0,0.1)]">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Zap className="text-primary" size={20} />
              AI Career Insights
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-black/40 rounded-lg border border-white/5">
                <p className="text-sm text-white leading-relaxed">
                  Your profile matches best for <span className="text-primary font-medium">Generative AI Engineer</span> roles (94% avg match).
                </p>
              </div>
              <div className="p-4 bg-black/40 rounded-lg border border-white/5">
                <p className="text-sm text-secondary mb-2">3 trending skills you're missing:</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-red-500/10 text-red-400 text-xs rounded border border-red-500/20">Kubernetes</span>
                  <span className="px-2 py-1 bg-red-500/10 text-red-400 text-xs rounded border border-red-500/20">Terraform</span>
                  <span className="px-2 py-1 bg-red-500/10 text-red-400 text-xs rounded border border-red-500/20">MLflow</span>
                </div>
              </div>
            </div>
          </div>

          {/* Automation Status */}
          <div className="glass p-6 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Automation Mode</h3>
            <p className="text-sm text-secondary mb-6">Actively matching and tailoring</p>
            
            <div className="space-y-3">
              <button className="w-full btn-glass text-left flex justify-between items-center group">
                <span className="text-sm font-medium">Auto-apply Settings</span>
                <ChevronRight size={16} className="text-muted group-hover:text-primary transition-colors" />
              </button>
              <button className="w-full btn-glass text-left flex justify-between items-center group">
                <span className="text-sm font-medium">Resume Tailoring</span>
                <ChevronRight size={16} className="text-muted group-hover:text-primary transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

