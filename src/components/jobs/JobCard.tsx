import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, DollarSign, Sparkles, ChevronRight } from 'lucide-react';
import type { NormalizedJob } from '@/types/job';
import clsx from 'clsx';

interface JobCardProps {
  job: NormalizedJob;
  matchScore?: number;
  onView?: () => void;
  onApply?: () => void;
  compact?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({ job, matchScore, onView, onApply, compact }) => {
  // Simple hash to generate a consistent color for the company initials
  const hash = job.company.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colors = [
    'from-blue-600 to-indigo-600',
    'from-emerald-600 to-teal-600',
    'from-orange-600 to-red-600',
    'from-purple-600 to-pink-600',
    'from-cyan-600 to-blue-600'
  ];
  const colorClass = colors[hash % colors.length];

  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className={clsx(
        "glass rounded-xl border border-white/5 hover:border-white/10 transition-all duration-300 relative overflow-hidden group",
        compact ? "p-4" : "p-6"
      )}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-2xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="flex flex-col sm:flex-row gap-4 relative z-10">
        <div className="flex-shrink-0 flex justify-between items-start">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center text-lg font-bold text-white shadow-lg`}>
            {job.company.charAt(0)}
          </div>
          {matchScore && (
            <div className="sm:hidden flex items-center gap-1 bg-yellow-500/10 text-primary px-2.5 py-1 rounded-full border border-yellow-500/20 text-xs font-bold">
              <Sparkles size={12} /> {matchScore}%
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <Link to={`/jobs/${job.id}`} className="block group-hover:text-primary transition-colors">
              <h3 className="text-lg font-bold text-white truncate">{job.title}</h3>
            </Link>
            
            {matchScore && (
              <div className="hidden sm:flex items-center gap-1 bg-yellow-500/10 text-primary px-2.5 py-1 rounded-full border border-yellow-500/20 text-xs font-bold ml-4 flex-shrink-0 shadow-[0_0_10px_rgba(255,208,0,0.1)]">
                <Sparkles size={12} /> {matchScore}% Match
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-secondary mb-3">
            <span className="flex items-center gap-1">
              <Building2 size={14} /> {job.company}
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={14} /> {job.location}
            </span>
            {job.salary ? (
              <span className="flex items-center gap-1 text-yellow-400 font-medium">
                {job.salary.currency === 'INR' ? 'â‚¹' : '$'}
                {job.salary.currency === 'INR'
                  ? `${Math.round(job.salary.min / 100000)}L â€“ ${Math.round(job.salary.max / 100000)}L`
                  : `${Math.round(job.salary.min / 1000)}k â€“ ${Math.round(job.salary.max / 1000)}k`}
              </span>
            ) : job.salaryRange ? (
              <span className="flex items-center gap-1 text-yellow-400 font-medium">
                {job.salaryRange.currency === 'INR' ? 'â‚¹' : '$'}
                {job.salaryRange.currency === 'INR'
                  ? `${Math.round(job.salaryRange.min / 100000)}L â€“ ${Math.round(job.salaryRange.max / 100000)}L`
                  : `${Math.round(job.salaryRange.min / 1000)}k â€“ ${Math.round(job.salaryRange.max / 1000)}k`}
              </span>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            {job.skills.slice(0, 4).map((skill, i) => (
              <span key={i} className="px-2 py-1 glass-subtle text-white/80 text-xs rounded border border-white/5">
                {skill}
              </span>
            ))}
            {job.skills.length > 4 && (
              <span className="px-2 py-1 text-muted text-xs">
                +{job.skills.length - 4} more
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 mt-auto pt-2 border-t border-white/5">
            <div className="flex items-center gap-1.5 flex-wrap">
              {job.isVerified && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  ✓ Verified
                </span>
              )}

              {job.portal === 'LinkedIn' ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0A66C2]/20 text-[#388bfd] border border-[#0A66C2]/40">
                  LinkedIn
                </span>
              ) : job.portal === 'Naukri' ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
                  Naukri
                </span>
              ) : job.portal === 'Indeed' ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                  Indeed
                </span>
              ) : !job.isVerified ? (
                <span className="badge-demo text-[10px] px-1.5 py-0.5 rounded opacity-70">DEMO</span>
              ) : null}

              {job.postedAt && (
                <span className="text-[10px] text-neutral-400">
                  {(() => {
                    const diffMs = Date.now() - new Date(job.postedAt).getTime();
                    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                    if (diffHours < 1) return 'Just now';
                    if (diffHours < 24) return `${diffHours}h ago`;
                    return `${Math.floor(diffHours / 24)}d ago`;
                  })()}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Link to={`/jobs/${job.id}`} className="btn-glass text-xs py-1.5 px-3">
                View Details
              </Link>
              <button onClick={onApply} className="btn-primary text-xs py-1.5 px-3 shadow-glow cursor-pointer">
                Quick Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};


