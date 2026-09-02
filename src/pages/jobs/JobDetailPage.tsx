import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Building2, MapPin, Clock, DollarSign, ChevronLeft, Sparkles, CheckCircle2, AlertCircle, Share2, Bookmark } from 'lucide-react';
import { jobService } from '@/lib/services/jobService';
import type { NormalizedJob } from '@/types/job';
import { JobCard } from '@/components/jobs/JobCard';
import { FileText, PenTool } from 'lucide-react';

const MatchScoreCircle = ({ score, size = 120 }: { score: number, size?: number }) => {
  const radius = (size - 20) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90 w-full h-full">
        <circle cx={size/2} cy={size/2} r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none" />
        <circle 
          cx={size/2} cy={size/2} r={radius} 
          stroke="url(#gradient)" strokeWidth="8" fill="none" 
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFAA00" />
            <stop offset="100%" stopColor="#FFD000" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-white text-shadow-glow">{score}%</span>
        <span className="text-xs text-primary font-medium">Match</span>
      </div>
    </div>
  );
};

export default function JobDetailPage() {
  const { id } = useParams();
  const [job, setJob] = useState<NormalizedJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        if (id) {
          const fetched = await jobService.getJob(id);
          setJob(fetched);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="skeleton h-64 rounded-2xl mb-8"></div>
        <div className="flex gap-8">
          <div className="skeleton h-96 rounded-2xl flex-1"></div>
          <div className="skeleton h-96 rounded-2xl w-1/3 hidden lg:block"></div>
        </div>
      </div>
    );
  }

  if (!job) {
    return <div className="p-8 text-center text-white">Job not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back link */}
      <Link to="/jobs" className="inline-flex items-center gap-2 text-sm text-secondary hover:text-white transition-colors mb-6">
        <ChevronLeft size={16} /> Back to jobs
      </Link>

      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong p-8 rounded-2xl relative overflow-hidden mb-8 border border-white/10"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 flex items-center justify-center text-2xl font-bold text-white shadow-xl">
              {job.company.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white">{job.title}</h1>
                <span className="badge-demo text-xs px-2 py-0.5 rounded">DEMO</span>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-secondary text-sm">
                <span className="flex items-center gap-1.5 font-medium text-white/80">
                  <Building2 size={16} /> {job.company}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin size={16} /> {job.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={16} /> Posted 2d ago
                </span>
                {job.salary ? (
                  <span className="flex items-center gap-1.5 text-yellow-400 font-medium px-2.5 py-1 bg-yellow-400/10 rounded-lg border border-yellow-400/20">
                    {job.salary.currency === 'INR' ? 'â‚¹' : '$'}
                    {job.salary.currency === 'INR'
                      ? `${Math.round(job.salary.min / 100000)}L â€“ ${Math.round(job.salary.max / 100000)}L / year`
                      : `${Math.round(job.salary.min / 1000)}k â€“ ${Math.round(job.salary.max / 1000)}k / year`}
                  </span>
                ) : job.salaryRange ? (
                  <span className="flex items-center gap-1.5 text-yellow-400 font-medium px-2.5 py-1 bg-yellow-400/10 rounded-lg border border-yellow-400/20">
                    {job.salaryRange.currency === 'INR' ? '₹' : '$'}
                    {job.salaryRange.currency === 'INR'
                      ? `${Math.round(job.salaryRange.min / 100000)}L – ${Math.round(job.salaryRange.max / 100000)}L / year`
                      : `${Math.round(job.salaryRange.min / 1000)}k – ${Math.round(job.salaryRange.max / 1000)}k / year`}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button className="btn-glass p-3 flex-shrink-0" title="Save Job">
              <Bookmark size={20} />
            </button>
            <button className="btn-glass p-3 flex-shrink-0" title="Share">
              <Share2 size={20} />
            </button>
            <button className="btn-primary py-3 px-6 shadow-glow w-full md:w-auto flex items-center justify-center gap-2">
              <Sparkles size={18} /> Apply with AI
            </button>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Tabs */}
          <div className="flex items-center gap-6 border-b border-white/10 pb-4">
            {['Overview', 'Match Analysis', 'Company'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`text-sm font-medium transition-colors relative pb-4 -mb-4 ${
                  activeTab === tab.toLowerCase() ? 'text-primary' : 'text-secondary hover:text-white'
                }`}
              >
                {tab}
                {activeTab === tab.toLowerCase() && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_8px_rgba(255,208,0,0.8)]" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="py-4"
          >
            {activeTab === 'overview' && (
              <div className="space-y-8 text-secondary leading-relaxed">
                <section>
                  <h3 className="text-lg font-semibold text-white mb-4">About the Role</h3>
                  <p className="whitespace-pre-wrap">{job.description || "No description provided."}</p>
                </section>
                
                <section>
                  <h3 className="text-lg font-semibold text-white mb-4">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, i) => (
                      <span key={i} className="px-3 py-1.5 glass-subtle text-white/90 rounded-lg text-sm border border-white/5">
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'match analysis' && (
              <div className="space-y-8">
                <div className="glass p-8 rounded-2xl flex flex-col md:flex-row items-center gap-12 border border-yellow-500/10">
                  <div className="flex-shrink-0">
                    <MatchScoreCircle score={88} size={160} />
                  </div>
                  <div className="flex-1 w-full space-y-4">
                    <h3 className="text-xl font-bold text-white mb-6">Strong Match</h3>
                    {[
                      { label: 'Skills', score: 95 },
                      { label: 'Experience', score: 80 },
                      { label: 'Education', score: 100 },
                      { label: 'Location/Remote', score: 90 },
                    ].map(factor => (
                      <div key={factor.label} className="space-y-1.5">
                        <div className="flex justify-between text-sm">
                          <span className="text-secondary">{factor.label}</span>
                          <span className="text-white font-medium">{factor.score}%</span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${factor.score}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="glass-subtle p-6 rounded-2xl border border-green-500/10">
                    <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                      <CheckCircle2 className="text-green-400" size={18} /> Why it fits you
                    </h4>
                    <ul className="space-y-3 text-sm text-secondary">
                      <li className="flex items-start gap-2">
                        <span className="text-green-400 mt-0.5">Ã¢Å“â€œ</span>
                        React and TypeScript match your core stack
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-400 mt-0.5">Ã¢Å“â€œ</span>
                        Remote work aligns with your preferences
                      </li>
                    </ul>
                  </div>
                  <div className="glass-subtle p-6 rounded-2xl border border-red-500/10">
                    <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                      <AlertCircle className="text-red-400" size={18} /> Potential gaps
                    </h4>
                    <ul className="space-y-3 text-sm text-secondary">
                      <li className="flex items-start gap-2">
                        <span className="text-red-400 mt-0.5">!</span>
                        Requires GraphQL experience
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button className="btn-glass flex-1 flex items-center justify-center gap-2">
                    <FileText size={18} /> Tailor Resume
                  </button>
                  <button className="btn-glass flex-1 flex items-center justify-center gap-2">
                    <PenTool size={18} /> Generate Cover Letter
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'company' && (
              <div className="space-y-6 text-secondary">
                <p>Company information would be displayed here. (Demo content)</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 space-y-6">
          <div className="glass-gold p-6 rounded-2xl border border-yellow-500/20 shadow-card">
            <h3 className="text-lg font-bold text-white mb-2">Ready to apply?</h3>
            <p className="text-sm text-secondary mb-6">Our AI can autofill this application and tailor your resume automatically.</p>
            <button className="btn-primary w-full py-3 shadow-glow flex items-center justify-center gap-2">
              <Sparkles size={18} /> Apply with AI
            </button>
            
            <div className="mt-6 space-y-3 border-t border-white/10 pt-6">
              <div className="flex items-center gap-3 text-sm text-white">
                <CheckCircle2 size={16} className="text-primary" /> AI Field Mapping (Ready)
              </div>
              <div className="flex items-center gap-3 text-sm text-white">
                <CheckCircle2 size={16} className="text-primary" /> Resume Tailoring (Ready)
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Similar Jobs</h3>
            <div className="space-y-4">
              <p className="text-sm text-muted text-center py-4">No similar jobs found.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


