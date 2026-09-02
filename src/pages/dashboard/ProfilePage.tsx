import React, { useEffect, useState } from 'react';
import { UserCircle2, Save, Sparkles, Plus, X } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { GlassInput } from '../../components/ui/GlassInput';
import { LiquidButton } from '../../components/ui/LiquidButton';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import { profileService } from '../../services/firebase/profileService';
import { CandidateProfile } from '../../types/profile';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Profile fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [headline, setHeadline] = useState('');
  const [summary, setSummary] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState(0);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const p = await profileService.getProfile(user.uid);
        if (p) {
          setProfile(p);
          setFirstName(p.basicInfo?.firstName || '');
          setLastName(p.basicInfo?.lastName || '');
          setPhone(p.basicInfo?.phone || '');
          setLocation(p.basicInfo?.location || '');
          setHeadline(p.professional?.headline || '');
          setSummary(p.professional?.summary || '');
          setYearsOfExperience(p.professional?.yearsOfExperience || 0);
          setSkills(p.skills || []);
        }
      } catch (err) {
        console.warn('Error loading profile:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    try {
      await profileService.updateProfile(user.uid, {
        basicInfo: {
          firstName,
          lastName,
          phone,
          location,
        },
        professional: {
          headline,
          summary,
          yearsOfExperience: Number(yearsOfExperience),
        },
        skills,
      });
      showToast('Candidate profile successfully updated in Firestore!', 'success', 'Profile Updated');
    } catch {
      showToast('Failed to save profile.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout
      pageTitle="Candidate Profile"
      pageSubtitle="Documented under profiles/{uid} with strict per-user security rules."
    >
      {isLoading ? (
        <LoadingSpinner label="Loading candidate dossier..." />
      ) : (
        <form onSubmit={handleSave} className="flex flex-col gap-6 max-w-4xl">
          {/* Basic Info */}
          <div className="liquid-glass rounded-2xl p-6 border border-white/5 flex flex-col gap-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <UserCircle2 className="w-5 h-5 text-amber-400" />
              <span>Personal Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <GlassInput
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Alex"
              />
              <GlassInput
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Rivera"
              />
              <GlassInput
                label="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 019-2834"
              />
              <GlassInput
                label="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="San Francisco, CA"
              />
            </div>
          </div>

          {/* Professional Overview */}
          <div className="liquid-glass rounded-2xl p-6 border border-white/5 flex flex-col gap-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Professional Summary</span>
            </h3>

            <div className="flex flex-col gap-4">
              <GlassInput
                label="Headline"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Senior Full-Stack AI Engineer"
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium uppercase text-slate-300">
                  Years of Experience: <span className="text-amber-400 font-semibold">{yearsOfExperience} yrs</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="25"
                  value={yearsOfExperience}
                  onChange={(e) => setYearsOfExperience(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium uppercase text-slate-300">Executive Summary</label>
                <textarea
                  rows={4}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Summarize your core competencies and accomplishments..."
                  className="w-full rounded-xl bg-slate-900/60 border border-white/10 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="liquid-glass rounded-2xl p-6 border border-white/5 flex flex-col gap-4">
            <h3 className="text-base font-bold text-white">Skills Matrix</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                placeholder="e.g. Docker, Rust, Kubernetes"
                className="flex-1 rounded-xl bg-slate-900/60 border border-white/10 px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
              <LiquidButton type="button" variant="glass" onClick={handleAddSkill} leftIcon={<Plus className="w-4 h-4" />}>
                Add
              </LiquidButton>
            </div>

            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs font-medium text-amber-300"
                >
                  {skill}
                  <button type="button" onClick={() => handleRemoveSkill(skill)} className="hover:text-amber-100">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <LiquidButton
              type="submit"
              variant="yellow"
              isLoading={isSaving}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save Profile Changes
            </LiquidButton>
          </div>
        </form>
      )}
    </DashboardLayout>
  );
};
