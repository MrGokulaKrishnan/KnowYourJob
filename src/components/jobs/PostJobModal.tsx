import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Briefcase, Building2, MapPin, DollarSign, Plus, Check, Sparkles, Globe, Link2 } from 'lucide-react';
import { jobService, type PostJobInput } from '@/lib/services/jobService';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/context/ToastContext';
import type { NormalizedJob } from '@/types/normalizedJob';

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobPosted: (newJob: NormalizedJob) => void;
}

export const PostJobModal: React.FC<PostJobModalProps> = ({ isOpen, onClose, onJobPosted }) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('Bangalore · Remote');
  const [remoteType, setRemoteType] = useState<'remote' | 'hybrid' | 'onsite'>('hybrid');
  const [employmentType, setEmploymentType] = useState<'full-time' | 'part-time' | 'contract' | 'internship'>('full-time');
  const [salaryMin, setSalaryMin] = useState('1800000');
  const [salaryMax, setSalaryMax] = useState('3200000');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>(['React', 'TypeScript', 'Node.js', 'AI']);
  const [sourceUrl, setSourceUrl] = useState('');
  const [description, setDescription] = useState('');
  const [requirementsInput, setRequirementsInput] = useState('');

  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleKeyDownSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast('Please sign in to post a verified job opportunity.', 'warning');
      return;
    }

    if (!title.trim() || !company.trim()) {
      showToast('Job Title and Company Name are required.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const requirements = requirementsInput
        .split('\n')
        .map(r => r.trim().replace(/^[-*•]\s*/, ''))
        .filter(Boolean);

      const jobData: PostJobInput = {
        title: title.trim(),
        company: company.trim(),
        location: location.trim(),
        remoteType,
        employmentType,
        salary: {
          min: Number(salaryMin) || 1200000,
          max: Number(salaryMax) || 2500000,
          currency,
          period: 'year',
        },
        skills: skills.length ? skills : ['Software Development'],
        description: description.trim() || `Exciting opportunity for a ${title} at ${company}. We are seeking talented engineers to build mission-critical products and drive scalable solutions.`,
        requirements: requirements.length ? requirements : [
          `Demonstrated proficiency in ${skills.slice(0, 3).join(', ')}.`,
          'Solid understanding of distributed systems and clean code architecture.',
          'Strong communication skills and collaborative problem-solving approach.'
        ],
        sourceUrl: sourceUrl.trim() || undefined,
        portal: 'Direct Employer',
      };

      const createdJob = await jobService.postJob(jobData, user.uid);
      showToast(`Job "${title}" successfully posted!`, 'success', 'Job Published');
      onJobPosted(createdJob);
      onClose();

      // Reset form
      setTitle('');
      setCompany('');
      setDescription('');
      setRequirementsInput('');
      setSourceUrl('');
    } catch (err: any) {
      console.error('Post job error:', err);
      showToast(err?.message || 'Failed to post job listing.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Dialog Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto liquid-glass-elevated rounded-2xl border border-amber-500/30 p-6 sm:p-8 bg-[#0a0d14] shadow-2xl z-10 text-slate-100"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    Post a Verified Job Opportunity
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      Direct Employer
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400">Publish your role directly to candidates with AI matching and official application routing.</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              {/* Job Title & Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Job Title <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Senior Full-Stack AI Engineer"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full rounded-xl bg-slate-900/80 border border-white/10 pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Company Name <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Anthropic, Google, Stripe"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full rounded-xl bg-slate-900/80 border border-white/10 pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              {/* Location & Remote Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Location</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. Bengaluru, India / Remote"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full rounded-xl bg-slate-900/80 border border-white/10 pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Workplace Policy</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['remote', 'hybrid', 'onsite'] as const).map((r) => (
                      <button
                        type="button"
                        key={r}
                        onClick={() => setRemoteType(r)}
                        className={`py-2 px-2 text-xs font-medium rounded-xl capitalize transition cursor-pointer ${
                          remoteType === r
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                            : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Employment Type & Salary Range */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Employment Type</label>
                  <select
                    value={employmentType}
                    onChange={(e: any) => setEmploymentType(e.target.value)}
                    className="w-full rounded-xl bg-slate-900/80 border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Min Salary (Annual)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-amber-400 font-mono">
                      {currency === 'INR' ? '₹' : '$'}
                    </span>
                    <input
                      type="number"
                      placeholder="e.g. 1800000"
                      value={salaryMin}
                      onChange={(e) => setSalaryMin(e.target.value)}
                      className="w-full rounded-xl bg-slate-900/80 border border-white/10 pl-7 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Max Salary (Annual)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-amber-400 font-mono">
                      {currency === 'INR' ? '₹' : '$'}
                    </span>
                    <input
                      type="number"
                      placeholder="e.g. 3200000"
                      value={salaryMax}
                      onChange={(e) => setSalaryMax(e.target.value)}
                      className="w-full rounded-xl bg-slate-900/80 border border-white/10 pl-7 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              {/* Skills Tags Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Required Competencies & Skills <span className="text-slate-500 font-normal">(press Enter to add)</span>
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Type skill (e.g. Python, LLMs, Docker, Next.js) and press Enter"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleKeyDownSkill}
                    className="flex-1 rounded-xl bg-slate-900/80 border border-white/10 px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="btn-glass px-3 py-2 rounded-xl text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>

                {/* Skill Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-medium"
                    >
                      {s}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(s)}
                        className="hover:text-red-400 text-slate-400 ml-1 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Official Application / Portal Link */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Official Application or Career Page URL
                  <span className="text-slate-500 font-normal ml-1">(Where candidates will apply)</span>
                </label>
                <div className="relative">
                  <Link2 className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    placeholder="e.g. https://company.com/careers/apply or https://linkedin.com/jobs/view/..."
                    value={sourceUrl}
                    onChange={(e) => setSourceUrl(e.target.value)}
                    className="w-full rounded-xl bg-slate-900/80 border border-white/10 pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Candidates clicking "Apply on Official Portal" will be directed to this link. If left blank, it automatically directs to the official LinkedIn Jobs listing for this title.
                </p>
              </div>

              {/* Job Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Job Overview & Impact</label>
                <textarea
                  rows={3}
                  placeholder="Outline the core mission, day-to-day responsibilities, and team context..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl bg-slate-900/80 border border-white/10 p-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-xs"
                />
              </div>

              {/* Requirements */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Key Requirements <span className="text-slate-500 font-normal">(One per line)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="• 3+ years experience with modern React & TypeScript&#10;• Experience with vector embeddings and LLM APIs&#10;• B.Tech or equivalent portfolio"
                  value={requirementsInput}
                  onChange={(e) => setRequirementsInput(e.target.value)}
                  className="w-full rounded-xl bg-slate-900/80 border border-white/10 p-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-xs font-mono"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-glass px-4 py-2.5 rounded-xl text-xs text-slate-300 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-yellow-gradient px-6 py-2.5 rounded-xl text-xs font-bold text-black flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-lg shadow-amber-500/20"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Publishing…</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Publish Job to Catalog</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
