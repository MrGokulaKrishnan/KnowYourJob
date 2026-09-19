import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useDropzone } from 'react-dropzone';
import {
  Upload, CheckCircle2, ChevronRight, Briefcase, MapPin, DollarSign,
  Building, Sparkles, User, Settings, ShieldCheck, FileText, Zap,
  X, Plus, Edit2, AlertCircle, Phone, Mail
} from 'lucide-react';
import clsx from 'clsx';
import { KYJLogo } from '../../components/ui/KYJLogo';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import { profileService } from '../../services/firebase/profileService';
import { updateUserDoc } from '../../services/firebase/userService';
import { resumeService, extractTextFromFile } from '../../services/firebase/resumeService';
import { aiService, type ExtractedCandidateProfile } from '../../lib/services/aiService';
import { serverTimestamp } from 'firebase/firestore';

interface AIProcessingProps {
  file: File;
  onExtracted: (profile: ExtractedCandidateProfile) => void;
  onError: (msg: string) => void;
}

const AIProcessing: React.FC<AIProcessingProps> = ({ file, onExtracted, onError }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progressMsg, setProgressMsg] = useState('');

  const steps = [
    'Reading your resume...',
    'Extracting skills and experience...',
    'Understanding your background...',
    'Building your candidate profile...',
  ];

  useEffect(() => {
    let isCancelled = false;

    async function runExtraction() {
      try {
        // Step 0: Reading resume
        setCurrentStepIndex(0);
        setProgressMsg(`Extracting text from ${file.name} (PDF/DOCX)...`);
        const resumeText = await extractTextFromFile(file);

        if (isCancelled) return;

        // Step 1: Extracting skills & experience with Gemini
        setCurrentStepIndex(1);
        setProgressMsg('Connecting to Gemini 3.6 Flash AI engine...');
        const profile = await aiService.extractCandidateProfileFromResume(resumeText || file.name);

        if (isCancelled) return;

        // Step 2: Understanding background
        setCurrentStepIndex(2);
        setProgressMsg(`Identified ${profile.skills.length} skills & ${profile.experience.length} career positions...`);
        await new Promise((r) => setTimeout(r, 600));

        if (isCancelled) return;

        // Step 3: Building candidate profile
        setCurrentStepIndex(3);
        setProgressMsg('Finalizing candidate profile...');
        await new Promise((r) => setTimeout(r, 600));

        if (!isCancelled) {
          onExtracted(profile);
        }
      } catch (err: any) {
        console.error('[Onboarding AIProcessing] Error:', err);
        if (!isCancelled) {
          onError(err?.message || 'Resume extraction failed.');
        }
      }
    }

    runExtraction();

    return () => {
      isCancelled = true;
    };
  }, [file]);

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center relative overflow-hidden liquid-glass-elevated rounded-3xl border border-amber-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
      <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
        <div className="w-64 h-64 bg-amber-500/50 rounded-full blur-[100px] animate-pulse"></div>
      </div>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
        className="mb-8 relative z-10"
      >
        <Sparkles className="w-16 h-16 text-amber-400 drop-shadow-[0_0_15px_rgba(245,158,11,0.6)]" />
      </motion.div>
      <div className="space-y-4 w-full max-w-md relative z-10">
        {steps.map((step, idx) => {
          const isActive = idx === currentStepIndex;
          const isDone = idx < currentStepIndex;
          return (
            <div
              key={idx}
              className={clsx(
                'flex items-center gap-3 transition-all duration-300',
                isActive ? 'text-white scale-105' : isDone ? 'text-amber-400' : 'text-neutral-500'
              )}
            >
              {isDone ? (
                <CheckCircle2 className="w-5 h-5 shrink-0 text-amber-400" />
              ) : isActive ? (
                <div className="w-5 h-5 shrink-0 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
              ) : (
                <div className="w-5 h-5 shrink-0 rounded-full border-2 border-current opacity-40" />
              )}
              <span className="font-medium text-lg">{step}</span>
            </div>
          );
        })}
      </div>
      {progressMsg && (
        <p className="text-xs text-amber-400/90 font-mono mt-4 relative z-10 animate-pulse">
          {progressMsg}
        </p>
      )}
      <div className="w-full max-w-md h-2 bg-white/10 rounded-full mt-6 overflow-hidden relative z-10 border border-white/5">
        <motion.div
          className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 shadow-[0_0_10px_rgba(245,158,11,0.6)]"
          initial={{ width: '0%' }}
          animate={{ width: `${Math.min(((currentStepIndex + 1) / steps.length) * 100, 100)}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
};

export function OnboardingPage() {
  const navigate = useNavigate();
  const { user, reloadUser } = useAuth();
  const { showToast } = useToast();

  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);

  // Extracted Profile State
  const [extractedProfile, setExtractedProfile] = useState<ExtractedCandidateProfile | null>(null);

  // Editable Profile verification fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);

  // Job Preferences fields
  const [roles, setRoles] = useState<string[]>([]);
  const [newRoleInput, setNewRoleInput] = useState('');
  const [remotePref, setRemotePref] = useState<'remote' | 'hybrid' | 'onsite' | 'any'>('remote');
  const [minSalary, setMinSalary] = useState(1200000);
  const [maxSalary, setMaxSalary] = useState(2500000);

  // Automation Mode
  const [automationMode, setAutomationMode] = useState<'manual' | 'assisted' | 'automated'>('assisted');
  const [isSaving, setIsSaving] = useState(false);

  // Pre-fill email from logged in user if available
  useEffect(() => {
    if (user?.email && !email) {
      setEmail(user.email);
    }
    if (user?.displayName && !fullName) {
      setFullName(user.displayName);
    }
  }, [user]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
  });

  // Handler when Gemini finishes extracting resume data
  const handleExtracted = (data: ExtractedCandidateProfile) => {
    setExtractedProfile(data);
    if (data.fullName) setFullName(data.fullName);
    if (data.email) setEmail(data.email);
    if (data.phone) setPhone(data.phone);
    if (data.location) setLocation(data.location);
    if (data.skills && data.skills.length > 0) {
      setSkills(data.skills);
    }
    if (data.suggestedRoles && data.suggestedRoles.length > 0) {
      setRoles(data.suggestedRoles);
    }
    showToast(`Gemini AI successfully extracted profile for ${data.fullName || 'you'}!`, 'success', 'Profile Built');
    setStep(3);
  };

  const handleExtractionError = (msg: string) => {
    showToast(msg, 'warning', 'Using Standard Profile');
    setStep(3);
  };

  const addSkill = () => {
    const trimmed = newSkillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setNewSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const addRole = () => {
    const trimmed = newRoleInput.trim();
    if (trimmed && !roles.includes(trimmed)) {
      setRoles([...roles, trimmed]);
      setNewRoleInput('');
    }
  };

  const removeRole = (roleToRemove: string) => {
    setRoles(roles.filter((r) => r !== roleToRemove));
  };

  // Complete Onboarding & Save Everything to Firestore
  const handleFinishSetup = async () => {
    setIsSaving(true);
    try {
      if (user?.uid) {
        // 1. Construct and save candidate profile
        const nameParts = (fullName || user.displayName || 'Candidate').trim().split(' ');
        const firstName = nameParts[0] || 'Candidate';
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

        const experienceItems = (extractedProfile?.experience || []).map((exp, idx) => ({
          id: `exp_${idx}`,
          title: exp.title || 'Software Developer',
          company: exp.company || 'TechCorp',
          location: location || 'Remote, India',
          startDate: (exp.period && exp.period.split('-')[0]?.trim()) || '2022',
          endDate: (exp.period && !exp.period.toLowerCase().includes('present')) ? (exp.period.split('-')[1]?.trim() || '') : '',
          isCurrent: exp.period ? exp.period.toLowerCase().includes('present') : false,
          description: exp.description || '',
        }));

        const educationItems = (extractedProfile?.education || []).map((edu, idx) => ({
          id: `edu_${idx}`,
          degree: edu.degree || 'Bachelor of Technology',
          fieldOfStudy: edu.degree || 'Computer Science',
          institution: edu.institution || 'University',
          graduationYear: parseInt((edu.year || '').replace(/\D/g, '')) || 2022,
        }));

        await profileService.saveFullProfile(user.uid, {
          basicInfo: {
            firstName,
            lastName,
            phone: phone || '',
            location: location || 'India',
          },
          professional: {
            headline: extractedProfile?.headline || roles[0] || 'Software Professional',
            summary: extractedProfile?.summary || '',
            yearsOfExperience: experienceItems.length ? experienceItems.length * 2 : 3,
            currentRole: experienceItems[0]?.title || roles[0] || 'Software Developer',
            currentCompany: experienceItems[0]?.company || '',
          },
          skills: skills.length > 0 ? skills : ['React', 'TypeScript', 'Node.js', 'Python'],
          experience: experienceItems,
          education: educationItems,
          projects: [],
          certifications: [],
          preferences: {
            roles: roles.length > 0 ? roles : ['Software Engineer'],
            locations: location ? [location, 'Remote'] : ['Remote, India'],
            remoteType: remotePref,
            minimumSalary: minSalary || 1200000,
            employmentTypes: ['full-time'],
          },
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        // 2. Mark onboarding completed in user document
        await updateUserDoc(user.uid, {
          onboardingCompleted: true,
          displayName: fullName || user.displayName || 'Candidate',
        });

        // 3. Upload resume to storage & collection if file provided
        if (file) {
          resumeService.uploadResume(user.uid, file).catch((e) => {
            console.warn('[Onboarding] Background resume upload note:', e);
          });
        }

        if (reloadUser) {
          try {
            await reloadUser();
          } catch {
            // ignore
          }
        }
      }

      showToast('Profile setup complete! Welcome to KnowYourJob.', 'success', 'Setup Complete');
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      console.error('[Onboarding Finish] Error:', err);
      showToast('Could not save profile, proceeding to dashboard.', 'warning');
      navigate('/dashboard', { replace: true });
    } finally {
      setIsSaving(false);
    }
  };

  const stepsList = [
    { id: 1, label: 'Resume', icon: <FileText className="w-4 h-4" /> },
    { id: 2, label: 'AI', icon: <Sparkles className="w-4 h-4" /> },
    { id: 3, label: 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 4, label: 'Prefs', icon: <Settings className="w-4 h-4" /> },
    { id: 5, label: 'Mode', icon: <Zap className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col items-center py-10 px-4 sm:px-6 relative overflow-x-hidden selection:bg-amber-400 selection:text-black">
      {/* Ambient background glow orbs matching Homepage */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[850px] h-[360px] bg-gradient-to-b from-amber-500/15 via-yellow-500/5 to-transparent blur-[140px] rounded-full pointer-events-none z-0" />
      <div className="fixed top-1/3 right-[-10%] w-96 h-96 bg-amber-600/10 blur-[130px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-10 left-[-10%] w-96 h-96 bg-yellow-500/10 blur-[140px] rounded-full pointer-events-none z-0" />

      <Link to="/" className="mb-8 flex items-center gap-2.5 group relative z-10">
        <KYJLogo size={32} glow className="group-hover:scale-105 transition-transform" />
        <span className="font-bold text-lg tracking-tight text-white">
          KnowYour<span className="text-gradient-gold">Job</span>
        </span>
      </Link>

      <div className="w-full max-w-4xl mb-12 flex items-center justify-between relative z-10">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-white/10 -z-10"></div>
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-amber-500 to-yellow-400 -z-10 transition-all duration-500 shadow-[0_0_12px_rgba(245,158,11,0.6)]"
          style={{ width: `${((step - 1) / 4) * 100}%` }}
        ></div>

        {stepsList.map((s) => (
          <div key={s.id} className="flex flex-col items-center gap-2">
            <div
              className={clsx(
                'w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 backdrop-blur-md',
                step >= s.id
                  ? 'bg-gradient-to-br from-amber-400 to-yellow-400 border-amber-300 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)] font-bold'
                  : 'liquid-glass border-white/10 text-neutral-400'
              )}
            >
              {s.icon}
            </div>
            <span
              className={clsx(
                'text-xs font-semibold uppercase tracking-wider',
                step >= s.id ? 'text-amber-400' : 'text-neutral-500'
              )}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>

      <div className="w-full max-w-4xl relative min-h-[400px] z-10">
        <AnimatePresence mode="wait">
          {/* STEP 1: Upload Resume */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8 text-center"
            >
              <div>
                <h1 className="text-3xl font-bold mb-3 text-gradient-gold">Let's build your AI Profile</h1>
                <p className="text-neutral-400">
                  Upload your resume. Gemini AI will accurately extract your skills, positions, and background.
                </p>
              </div>

              <div
                {...getRootProps()}
                className={clsx(
                  'liquid-glass p-12 rounded-3xl border-2 border-dashed transition-all cursor-pointer',
                  isDragActive
                    ? 'border-amber-400 bg-amber-400/5 shadow-[0_0_30px_rgba(245,158,11,0.25)]'
                    : 'border-amber-400/30 hover:border-amber-400/60 hover:bg-white/5'
                )}
              >
                <input {...getInputProps()} />
                <Upload
                  className={clsx(
                    'w-12 h-12 mx-auto mb-4 transition-colors',
                    isDragActive ? 'text-amber-400' : 'text-neutral-500'
                  )}
                />
                {file ? (
                  <div className="text-amber-400 font-semibold">
                    {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </div>
                ) : (
                  <>
                    <p className="text-lg font-semibold mb-1 text-white">Drop your resume here</p>
                    <p className="text-neutral-400 text-sm">PDF or DOCX, max 10MB</p>
                    <div className="mt-4 inline-block px-4 py-2 rounded-full liquid-glass text-sm text-amber-200 border border-amber-500/20">
                      or click to browse
                    </div>
                  </>
                )}
              </div>

              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={() => setStep(2)}
                  disabled={!file}
                  className="btn-yellow-gradient px-8 py-3.5 rounded-xl w-full max-w-md font-bold text-black disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(245,158,11,0.35)]"
                >
                  Continue with AI <ChevronRight className="w-4 h-4 ml-2 inline text-black" />
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="text-neutral-500 hover:text-white text-sm transition-colors font-medium"
                >
                  Skip for now
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Live AI Processing with Gemini 3.6 Flash */}
          {step === 2 && file && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
            >
              <AIProcessing
                file={file}
                onExtracted={handleExtracted}
                onError={handleExtractionError}
              />
            </motion.div>
          )}

          {/* STEP 3: Profile Verification */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gradient-gold">Profile Verification</h2>
                <p className="text-neutral-400">
                  Here is what Gemini AI extracted from your resume. Review and edit as needed.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Info */}
                <div className="liquid-glass p-6 rounded-3xl border border-white/10 space-y-4 shadow-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <User className="w-4 h-4 text-amber-400" /> Personal Info
                    </h3>
                    <button
                      onClick={() => setIsEditingPersonal(!isEditingPersonal)}
                      className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <Edit2 className="w-3 h-3" />
                      {isEditingPersonal ? 'Done' : 'Edit'}
                    </button>
                  </div>

                  {isEditingPersonal ? (
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-neutral-400">Full Name</label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full glass-input px-3.5 py-2 rounded-xl text-sm text-white outline-none border border-white/10 focus:border-amber-500/50 bg-black/40"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-neutral-400">Email</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full glass-input px-3.5 py-2 rounded-xl text-sm text-white outline-none border border-white/10 focus:border-amber-500/50 bg-black/40"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-neutral-400">Phone</label>
                        <input
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+1 (555) 000-0000"
                          className="w-full glass-input px-3.5 py-2 rounded-xl text-sm text-white outline-none border border-white/10 focus:border-amber-500/50 bg-black/40"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-neutral-400">Location</label>
                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="e.g. San Francisco, CA"
                          className="w-full glass-input px-3.5 py-2 rounded-xl text-sm text-white outline-none border border-white/10 focus:border-amber-500/50 bg-black/40"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <p className="text-xs text-neutral-500 uppercase font-semibold">Name</p>
                        <p className="font-semibold text-white text-base">
                          {fullName || 'Not specified'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500 uppercase font-semibold">Email</p>
                        <p className="font-medium text-neutral-300 text-sm">{email || 'Not specified'}</p>
                      </div>
                      {(phone || location) && (
                        <div className="flex gap-4 text-xs text-neutral-400 pt-2 border-t border-white/10">
                          {phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-amber-400" /> {phone}
                            </span>
                          )}
                          {location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-amber-400" /> {location}
                            </span>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Skills */}
                <div className="liquid-glass p-6 rounded-3xl border border-white/10 space-y-4 shadow-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-400" /> Skills ({skills.length})
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-2 max-h-44 overflow-y-auto pr-1">
                    {skills.map((s) => (
                      <span
                        key={s}
                        className="glossy-badge-gold px-3 py-1 text-xs rounded-full flex items-center gap-1.5 font-medium"
                      >
                        {s}
                        <button
                          onClick={() => removeSkill(s)}
                          className="hover:text-white transition-colors"
                          title="Remove skill"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-white/10">
                    <input
                      type="text"
                      placeholder="Add another skill..."
                      value={newSkillInput}
                      onChange={(e) => setNewSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSkill();
                        }
                      }}
                      className="glass-input px-3.5 py-2 rounded-xl text-xs text-white outline-none flex-1 border border-white/10 focus:border-amber-500/50 bg-black/40"
                    />
                    <button
                      onClick={addSkill}
                      className="btn-glass px-3 py-2 text-xs text-amber-400 hover:text-white rounded-xl"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Experience & Education */}
                <div className="liquid-glass p-6 rounded-3xl border border-white/10 space-y-5 md:col-span-2 shadow-lg">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-3">
                      <Briefcase className="w-4 h-4 text-amber-400" /> Work Experience
                    </h3>
                    {extractedProfile?.experience && extractedProfile.experience.length > 0 ? (
                      <div className="space-y-3">
                        {extractedProfile.experience.map((exp, idx) => (
                          <div key={idx} className="pl-4 border-l-2 border-amber-400">
                            <p className="font-semibold text-white text-sm">{exp.title}</p>
                            <p className="text-xs text-amber-300 font-medium">
                              {exp.company} · {exp.period}
                            </p>
                            {exp.description && (
                              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                                {exp.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-neutral-400">
                        General software engineering experience detected.
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-3">
                      <Building className="w-4 h-4 text-amber-400" /> Education
                    </h3>
                    {extractedProfile?.education && extractedProfile.education.length > 0 ? (
                      <div className="space-y-3">
                        {extractedProfile.education.map((edu, idx) => (
                          <div key={idx} className="pl-4 border-l-2 border-neutral-700">
                            <p className="font-medium text-white text-sm">{edu.degree}</p>
                            <p className="text-xs text-neutral-400">
                              {edu.institution} {edu.year ? `(${edu.year})` : ''}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-neutral-400">Higher education credentials verified.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setStep(4)}
                  className="btn-yellow-gradient px-8 py-3.5 rounded-xl w-full max-w-md font-bold text-black shadow-[0_0_20px_rgba(245,158,11,0.35)]"
                >
                  Looks good! Continue <ChevronRight className="w-4 h-4 ml-2 inline text-black" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Job Preferences */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gradient-gold">Job Preferences</h2>
                <p className="text-neutral-400">
                  Target roles and salary preferences so AI matches relevant opportunities.
                </p>
              </div>

              <div className="liquid-glass p-8 rounded-3xl border border-white/10 space-y-6 shadow-xl">
                <div>
                  <label className="block text-sm font-semibold text-neutral-200 mb-2">
                    Target Roles
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {roles.map((r) => (
                      <span
                        key={r}
                        className="liquid-glass-interactive px-3.5 py-1.5 text-xs rounded-xl flex items-center gap-1.5 text-white border-white/10"
                      >
                        {r}
                        <button
                          onClick={() => removeRole(r)}
                          className="text-neutral-400 hover:text-white"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type a role and press enter..."
                      value={newRoleInput}
                      onChange={(e) => setNewRoleInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addRole();
                        }
                      }}
                      className="w-full glass-input px-4 py-2.5 rounded-xl text-white outline-none border border-white/10 focus:border-amber-500/50 bg-black/40 text-sm"
                    />
                    <button onClick={addRole} className="btn-glass px-5 py-2 text-sm text-amber-400 font-semibold rounded-xl">
                      Add
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-200 mb-2">
                      Work Arrangement
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {(['remote', 'hybrid', 'onsite', 'any'] as const).map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setRemotePref(opt)}
                          className={clsx(
                            'px-4 py-2 rounded-xl text-sm capitalize transition-all font-semibold',
                            remotePref === opt
                              ? 'btn-yellow-gradient text-black shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                              : 'liquid-glass text-neutral-300 border border-white/10 hover:border-white/20'
                          )}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-semibold text-neutral-200">
                        Target Annual Salary (₹ INR / LPA)
                      </label>
                      <span className="text-xs text-amber-300 font-mono font-bold">
                        ₹{(minSalary / 100000).toFixed(1)}L – ₹{(maxSalary / 100000).toFixed(1)}L / yr
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm font-bold">₹</span>
                        <input
                          type="number"
                          step="50000"
                          placeholder="Min (e.g. 1200000)"
                          value={minSalary}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            setMinSalary(val);
                            if (val > maxSalary) setMaxSalary(val);
                          }}
                          className="w-full glass-input pl-7 pr-3 py-2 rounded-xl text-white text-sm outline-none font-mono border border-white/10 focus:border-amber-500/50 bg-black/40"
                        />
                      </div>
                      <span className="text-neutral-500">–</span>
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm font-bold">₹</span>
                        <input
                          type="number"
                          step="50000"
                          placeholder="Max (e.g. 2500000)"
                          value={maxSalary}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            setMaxSalary(val);
                            if (val < minSalary) setMinSalary(val);
                          }}
                          className="w-full glass-input pl-7 pr-3 py-2 rounded-xl text-white text-sm outline-none font-mono border border-white/10 focus:border-amber-500/50 bg-black/40"
                        />
                      </div>
                    </div>

                    {/* Quick INR presets for Indian engineers */}
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {[
                        { label: '6 – 10 LPA', min: 600000, max: 1000000 },
                        { label: '10 – 18 LPA', min: 1000000, max: 1800000 },
                        { label: '18 – 30 LPA', min: 1800000, max: 3000000 },
                        { label: '30 – 50+ LPA', min: 3000000, max: 5000000 },
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => {
                            setMinSalary(preset.min);
                            setMaxSalary(preset.max);
                          }}
                          className={clsx(
                            'px-2.5 py-1 text-xs rounded-lg border font-mono transition-all',
                            minSalary === preset.min && maxSalary === preset.max
                              ? 'liquid-glass-interactive border-amber-500/50 text-amber-300 font-bold shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                              : 'liquid-glass text-neutral-400 border border-white/10 hover:border-white/20'
                          )}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setStep(5)}
                  className="btn-yellow-gradient px-8 py-3.5 rounded-xl w-full max-w-md font-bold text-black shadow-[0_0_20px_rgba(245,158,11,0.35)]"
                >
                  Save & Continue <ChevronRight className="w-4 h-4 ml-2 inline text-black" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 5: Automation Mode & Finish */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gradient-gold mb-2">Choose Automation Mode</h2>
                <p className="text-neutral-400">
                  Choose how KnowYourJob assists your job discovery and application workflow.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Manual */}
                <div
                  onClick={() => setAutomationMode('manual')}
                  className={clsx(
                    'liquid-glass-elevated p-6 rounded-3xl flex flex-col cursor-pointer transition-all border',
                    automationMode === 'manual'
                      ? 'border-amber-400/60 bg-amber-400/5 shadow-[0_0_25px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/30'
                      : 'border-white/10 hover:border-amber-500/30'
                  )}
                >
                  <div className="text-3xl mb-4">📋</div>
                  <h3 className="text-lg font-bold text-white mb-2">Manual Control</h3>
                  <p className="text-sm text-neutral-400 mb-6 flex-grow leading-relaxed">
                    Discover jobs with AI match scoring. Apply and track every application yourself.
                  </p>
                  <div className="mt-auto">
                    <p className="text-xs text-neutral-500 uppercase font-semibold">Best for:</p>
                    <p className="text-sm font-medium text-white">Direct oversight</p>
                  </div>
                </div>

                {/* AI Assisted */}
                <div
                  onClick={() => setAutomationMode('assisted')}
                  className={clsx(
                    'liquid-glass-elevated p-6 rounded-3xl flex flex-col cursor-pointer relative transition-all border',
                    automationMode === 'assisted'
                      ? 'border-amber-400/60 bg-amber-400/5 shadow-[0_0_30px_rgba(245,158,11,0.3)] ring-1 ring-amber-400/30'
                      : 'border-white/10 hover:border-amber-500/30'
                  )}
                >
                  <div className="absolute top-0 right-0 glossy-badge-gold text-black text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl uppercase tracking-wider">
                    RECOMMENDED
                  </div>
                  <div className="text-3xl mb-4">🤖</div>
                  <h3 className="text-lg font-bold text-white mb-2">AI Assisted</h3>
                  <p className="text-sm text-neutral-400 mb-6 flex-grow leading-relaxed">
                    AI tailors resumes and pre-drafts applications. You approve each before submitting.
                  </p>
                  <div className="mt-auto">
                    <p className="text-xs text-neutral-500 uppercase font-semibold">Best for:</p>
                    <p className="text-sm font-bold text-amber-300">High efficiency</p>
                  </div>
                </div>

                {/* Auto Apply */}
                <div
                  onClick={() => setAutomationMode('automated')}
                  className={clsx(
                    'liquid-glass-elevated p-6 rounded-3xl flex flex-col cursor-pointer transition-all border',
                    automationMode === 'automated'
                      ? 'border-amber-400/60 bg-amber-400/5 shadow-[0_0_25px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/30'
                      : 'border-white/10 hover:border-amber-500/30'
                  )}
                >
                  <div className="text-3xl mb-4">⚡</div>
                  <h3 className="text-lg font-bold text-white mb-2">Auto Discovery</h3>
                  <p className="text-sm text-neutral-400 mb-6 flex-grow leading-relaxed">
                    Background agents match high-compatibility roles and queue tailored packages.
                  </p>
                  <div className="mt-auto">
                    <p className="text-xs text-neutral-500 uppercase font-semibold">Best for:</p>
                    <p className="text-sm font-medium text-white">Maximum opportunities</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 justify-center text-sm text-neutral-300 liquid-glass py-3 px-6 rounded-full w-fit mx-auto border border-white/10">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Zero spam guarantee. Security challenges require your explicit approval.</span>
              </div>

              <div className="flex justify-center mt-8">
                <button
                  onClick={handleFinishSetup}
                  disabled={isSaving}
                  className="btn-yellow-gradient px-12 py-4 rounded-2xl text-lg font-extrabold text-black shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:scale-105 transition-transform disabled:opacity-50"
                >
                  {isSaving ? 'Saving Profile...' : 'Finish Setup & Enter Dashboard'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default OnboardingPage;
