import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, SlidersHorizontal, MapPin, Briefcase } from 'lucide-react';
import { jobService } from '@/lib/services/jobService';
import type { NormalizedJob } from '@/types/job';
import { JobCard } from '@/components/jobs/JobCard';

export default function JobsPage() {
  const [jobs, setJobs] = useState<NormalizedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filters state
  const [matchScore, setMatchScore] = useState(0);
  const [remoteType, setRemoteType] = useState<string[]>([]);
  const [employmentType, setEmploymentType] = useState<string[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const res = await jobService.searchJobs({});
        setJobs(res.jobs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleRemoteToggle = (val: string) => {
    setRemoteType(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);
  };

  const filteredJobs = jobs.filter(job => {
    if (searchTerm && !job.title.toLowerCase().includes(searchTerm.toLowerCase()) && !job.company.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    // simple local filtering logic placeholder
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full flex flex-col">
      {/* Search Bar */}
      <div className="glass-strong p-2 rounded-2xl mb-8 flex items-center gap-2 sticky top-4 z-20">
        <div className="flex-1 flex items-center gap-3 px-4">
          <Search className="text-muted" size={20} />
          <input 
            type="text" 
            placeholder="Search jobs, skills or companies..." 
            className="w-full bg-transparent border-none text-white focus:outline-none focus:ring-0 placeholder-muted py-3"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-px h-8 bg-white/10 mx-2"></div>
        <button className="btn-glass p-3 rounded-xl flex items-center gap-2">
          <Filter size={18} />
          <span className="hidden sm:inline">Filters</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 flex-1">
        {/* Filter Sidebar (Desktop) */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full lg:w-72 hidden lg:flex flex-col gap-6"
        >
          <div className="glass p-6 rounded-2xl sticky top-28 space-y-8">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-white">
                <SlidersHorizontal size={18} /> Filters
              </h2>
              <button className="text-xs text-secondary hover:text-primary transition-colors">Clear All</button>
            </div>

            {/* Remote Type */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-white">Remote Type</h3>
              {['Remote', 'Hybrid', 'On-site'].map(type => (
                <label key={type} className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${remoteType.includes(type) ? 'bg-primary border-primary' : 'border-white/20 group-hover:border-primary/50'}`}>
                    {remoteType.includes(type) && <div className="w-2.5 h-2.5 bg-black rounded-sm" />}
                  </div>
                  <span className="text-sm text-secondary group-hover:text-white transition-colors">{type}</span>
                </label>
              ))}
            </div>

            {/* Minimum Match */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-white">Min Match Score</h3>
                <span className="text-xs text-primary font-mono">{matchScore}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={matchScore}
                onChange={(e) => setMatchScore(parseInt(e.target.value))}
                className="w-full accent-primary h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
              />
            </div>

            {/* Employment Type */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-white">Employment Type</h3>
              {['Full-time', 'Contract', 'Part-time'].map(type => (
                <label key={type} className="flex items-center gap-3 cursor-pointer group">
                  <div className="w-5 h-5 rounded border border-white/20 flex items-center justify-center group-hover:border-primary/50 transition-colors">
                  </div>
                  <span className="text-sm text-secondary group-hover:text-white transition-colors">{type}</span>
                </label>
              ))}
            </div>

            {/* Posted Date */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-white">Posted</h3>
              {['Any time', 'Past week', 'Past month'].map((type, i) => (
                <label key={type} className="flex items-center gap-3 cursor-pointer group">
                  <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center group-hover:border-primary/50 transition-colors">
                    {i === 0 && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                  </div>
                  <span className="text-sm text-secondary group-hover:text-white transition-colors">{type}</span>
                </label>
              ))}
            </div>

            <button className="btn-primary w-full py-3 rounded-xl shadow-glow">
              Apply Filters
            </button>
          </div>
        </motion.div>

        {/* Job List */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium text-white">
              {loading ? 'Searching jobs...' : <><span className="font-bold text-primary">{filteredJobs.length}</span> jobs found</>}
            </h2>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted hidden sm:inline">Sort by:</span>
              <select className="glass-input border-none py-1.5 px-3 bg-transparent text-white cursor-pointer">
                <option>Best Match</option>
                <option>Most Recent</option>
                <option>Highest Salary</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="skeleton h-48 rounded-2xl" />
              ))
            ) : filteredJobs.length > 0 ? (
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.1 } }
                }}
                className="space-y-4"
              >
                {filteredJobs.map(job => (
                  <motion.div key={job.id} variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}>
                    <JobCard 
                      job={job} 
                      matchScore={Math.floor(Math.random() * 20) + 75} 
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="glass p-12 text-center rounded-2xl border border-white/5 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full glass-subtle flex items-center justify-center text-muted mb-4">
                  <Search size={28} />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No matching jobs found</h3>
                <p className="text-secondary max-w-md">Try adjusting your filters or search terms to find more opportunities.</p>
                <button className="btn-glass mt-6" onClick={() => setSearchTerm('')}>Clear Search</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
