import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useDropzone } from 'react-dropzone';
import { Upload, CheckCircle2, ChevronRight, Briefcase, MapPin, DollarSign, Building, Sparkles, User, Settings, ShieldCheck, FileText, Zap } from 'lucide-react';
import clsx from 'clsx';

const AIProcessing = ({ steps, onComplete }: { steps: string[], onComplete: () => void }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (currentStepIndex < steps.length) {
      const timer = setTimeout(() => {
        setCurrentStepIndex((prev) => prev + 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        onComplete();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentStepIndex, steps, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center relative overflow-hidden glass-strong rounded-3xl">
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
        <div className="w-64 h-64 bg-amber-500/50 rounded-full blur-[100px] animate-pulse"></div>
      </div>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
        className="mb-8 relative z-10"
      >
        <Sparkles className="w-16 h-16 text-yellow-400" />
      </motion.div>
      <div className="space-y-4 w-full max-w-md relative z-10">
        {steps.map((step, idx) => {
          const isActive = idx === currentStepIndex;
          const isDone = idx < currentStepIndex;
          return (
            <div key={idx} className={clsx(
              "flex items-center gap-3 transition-all duration-300",
              isActive ? "text-white scale-105" : isDone ? "text-yellow-400" : "text-neutral-500"
            )}>
              {isDone ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <div className="w-5 h-5 shrink-0 rounded-full border-2 border-current opacity-50" />}
              <span className="font-medium text-lg">{step}</span>
            </div>
          );
        })}
      </div>
      <div className="w-full max-w-md h-2 bg-neutral-800 rounded-full mt-8 overflow-hidden relative z-10">
        <motion.div
          className="h-full bg-gradient-to-r from-amber-500 to-yellow-300"
          initial={{ width: '0%' }}
          animate={{ width: `${Math.min(((currentStepIndex + 1) / steps.length) * 100, 100)}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
};

function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);

  const [skills, setSkills] = useState(['Python', 'JavaScript', 'React', 'Node.js', 'SQL']);
  const [roles, setRoles] = useState(['Software Engineer', 'Full Stack Developer']);
  const [locations, setLocations] = useState(['San Francisco', 'Remote']);
  const [remotePref, setRemotePref] = useState('Remote');
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] },
    maxSize: 10 * 1024 * 1024,
    multiple: false
  });

  const stepsList = [
    { id: 1, label: 'Resume', icon: <FileText className="w-4 h-4" /> },
    { id: 2, label: 'AI', icon: <Sparkles className="w-4 h-4" /> },
    { id: 3, label: 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 4, label: 'Prefs', icon: <Settings className="w-4 h-4" /> },
    { id: 5, label: 'Mode', icon: <Zap className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-4xl mb-12 flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-neutral-800 -z-10"></div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-yellow-400 -z-10 transition-all duration-500" style={{ width: `${((step - 1) / 4) * 100}%` }}></div>
        
        {stepsList.map((s) => (
          <div key={s.id} className="flex flex-col items-center gap-2">
            <div className={clsx(
              "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 backdrop-blur-md",
              step >= s.id ? "bg-yellow-400 border-yellow-400 text-black shadow-[0_0_15px_rgba(255,208,0,0.4)]" : "bg-neutral-900 border-neutral-700 text-neutral-400"
            )}>
              {s.icon}
            </div>
            <span className={clsx("text-xs font-medium uppercase tracking-wider", step >= s.id ? "text-yellow-400" : "text-neutral-500")}>{s.label}</span>
          </div>
        ))}
      </div>

      <div className="w-full max-w-4xl relative min-h-[400px]">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8 text-center">
              <div>
                <h1 className="text-3xl font-bold mb-3 text-gradient">Let's build your AI Profile</h1>
                <p className="text-neutral-400">Upload your resume to instantly generate your profile and preferences.</p>
              </div>
              
              <div {...getRootProps()} className={clsx(
                "glass p-12 rounded-3xl border-2 border-dashed transition-all cursor-pointer",
                isDragActive ? "border-yellow-400 bg-yellow-400/5" : "border-yellow-400/20 hover:border-yellow-400/50 hover:bg-white/5"
              )}>
                <input {...getInputProps()} />
                <Upload className={clsx("w-12 h-12 mx-auto mb-4 transition-colors", isDragActive ? "text-yellow-400" : "text-neutral-500")} />
                {file ? (
                  <div className="text-yellow-400 font-medium">
                    {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </div>
                ) : (
                  <>
                    <p className="text-lg font-medium mb-1">Drop your resume here</p>
                    <p className="text-neutral-500 text-sm">PDF or DOCX, max 10MB</p>
                    <div className="mt-4 inline-block px-4 py-2 rounded-full glass-subtle text-sm text-neutral-300">or click to browse</div>
                  </>
                )}
              </div>
              
              <div className="flex flex-col items-center gap-4">
                <button 
                  onClick={() => setStep(2)}
                  disabled={!file}
                  className="btn-primary px-8 py-3 w-full max-w-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue <ChevronRight className="w-4 h-4 ml-2 inline" />
                </button>
                <button onClick={() => setStep(3)} className="text-neutral-500 hover:text-white text-sm transition-colors">
                  Skip for now
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }}>
              <AIProcessing 
                steps={["Reading your resume...", "Extracting skills and experience...", "Understanding your background...", "Building your candidate profile..."]}
                onComplete={() => setStep(3)}
              />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gradient">Profile Verification</h2>
                <p className="text-neutral-400">Here's what our AI extracted. Review and edit if needed.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass p-6 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-medium flex items-center gap-2"><User className="w-4 h-4 text-yellow-400"/> Personal Info</h3>
                    <button className="text-xs text-yellow-400 hover:underline">Edit</button>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Name</p>
                    <p className="font-medium">Demo User</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Email</p>
                    <p className="font-medium">demo@example.com</p>
                  </div>
                </div>

                <div className="glass p-6 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-medium flex items-center gap-2"><Zap className="w-4 h-4 text-yellow-400"/> Skills</h3>
                    <button className="text-xs text-yellow-400 hover:underline">Edit</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.map(s => <span key={s} className="px-3 py-1 text-sm bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 rounded-full">{s}</span>)}
                  </div>
                </div>

                <div className="glass p-6 rounded-2xl space-y-4 md:col-span-2">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-medium flex items-center gap-2"><Briefcase className="w-4 h-4 text-yellow-400"/> Experience & Education</h3>
                    <button className="text-xs text-yellow-400 hover:underline">Edit</button>
                  </div>
                  <div className="space-y-4">
                    <div className="pl-4 border-l-2 border-yellow-400/30">
                      <p className="font-medium">Software Developer</p>
                      <p className="text-sm text-neutral-400">TechCorp (2022-present)</p>
                    </div>
                    <div className="pl-4 border-l-2 border-neutral-700">
                      <p className="font-medium">B.Tech Computer Science</p>
                      <p className="text-sm text-neutral-400">Graduated 2022</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-8">
                <button onClick={() => setStep(4)} className="btn-primary px-8 py-3 w-full max-w-md">
                  Looks good! Continue
                </button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gradient">Job Preferences</h2>
                <p className="text-neutral-400">Tell us what you're looking for so AI can match you better.</p>
              </div>

              <div className="glass p-6 rounded-2xl space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Desired Roles</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {roles.map(r => (
                      <span key={r} className="px-3 py-1 text-sm bg-neutral-800 rounded-md flex items-center gap-1">
                        {r} <button onClick={() => setRoles(roles.filter(x => x !== r))} className="text-neutral-500 hover:text-white">&times;</button>
                      </span>
                    ))}
                  </div>
                  <input type="text" placeholder="Type and press enter..." className="w-full glass-input px-4 py-2 rounded-lg text-white outline-none" onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value) {
                      setRoles([...roles, e.currentTarget.value]);
                      e.currentTarget.value = '';
                    }
                  }} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">Remote Preference</label>
                    <div className="flex flex-wrap gap-2">
                      {['Remote', 'Hybrid', 'On-site', 'Flexible'].map(opt => (
                        <button key={opt} onClick={() => setRemotePref(opt)} className={clsx(
                          "px-4 py-2 rounded-lg text-sm transition-colors",
                          remotePref === opt ? "bg-yellow-400 text-black font-medium" : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                        )}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">Salary Range (USD)</label>
                    <div className="flex items-center gap-2">
                      <input type="number" placeholder="Min" className="w-full glass-input px-4 py-2 rounded-lg text-white outline-none" defaultValue={100000} />
                      <span className="text-neutral-500">-</span>
                      <input type="number" placeholder="Max" className="w-full glass-input px-4 py-2 rounded-lg text-white outline-none" defaultValue={150000} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-8">
                <button onClick={() => setStep(5)} className="btn-primary px-8 py-3 w-full max-w-md">
                  Save & Continue
                </button>
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gradient mb-2">Choose Automation Mode</h2>
                <p className="text-neutral-400">How much should AI do for you?</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass p-6 rounded-2xl flex flex-col cursor-pointer border border-transparent hover:border-white/10 transition-colors">
                  <div className="text-3xl mb-4">ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã¢â‚¬â€œ</div>
                  <h3 className="text-lg font-bold mb-2">Manual</h3>
                  <p className="text-sm text-neutral-400 mb-6 flex-grow">Review every application yourself.</p>
                  <div className="mt-auto">
                    <p className="text-xs text-neutral-500 uppercase font-semibold">Best for:</p>
                    <p className="text-sm font-medium">Full control</p>
                  </div>
                </div>

                <div className="glass p-6 rounded-2xl flex flex-col cursor-pointer border-2 border-yellow-400 bg-yellow-400/5 relative shadow-[0_0_30px_rgba(255,208,0,0.15)]">
                  <div className="absolute top-0 right-0 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">RECOMMENDED</div>
                  <div className="text-3xl mb-4">ÃƒÂ°Ã…Â¸Ã‚Â¤Ã¢â‚¬â€œ</div>
                  <h3 className="text-lg font-bold mb-2">AI Assisted</h3>
                  <p className="text-sm text-neutral-400 mb-6 flex-grow">AI drafts, you approve each one.</p>
                  <div className="mt-auto">
                    <p className="text-xs text-neutral-500 uppercase font-semibold">Best for:</p>
                    <p className="text-sm font-medium text-yellow-400">Efficiency</p>
                  </div>
                </div>

                <div className="glass p-6 rounded-2xl flex flex-col cursor-pointer border border-transparent hover:border-white/10 transition-colors">
                  <div className="text-3xl mb-4">ÃƒÂ¢Ã…Â¡Ã‚Â¡</div>
                  <h3 className="text-lg font-bold mb-2">Auto Apply</h3>
                  <p className="text-sm text-neutral-400 mb-6 flex-grow">AI finds and applies for you within your rules.</p>
                  <div className="mt-auto">
                    <p className="text-xs text-neutral-500 uppercase font-semibold">Best for:</p>
                    <p className="text-sm font-medium">Maximum reach</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 justify-center text-sm text-neutral-400 glass-subtle py-3 px-6 rounded-full w-fit mx-auto">
                <ShieldCheck className="w-4 h-4 text-green-400" />
                <span>Auto Apply never bypasses CAPTCHA or MFA. You stay in control.</span>
              </div>

              <div className="flex justify-center mt-8">
                <button onClick={() => navigate('/dashboard')} className="btn-primary px-12 py-4 rounded-xl text-lg font-bold shadow-[0_0_20px_rgba(255,208,0,0.3)] hover:scale-105 transition-transform">
                  Finish Setup
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
export { OnboardingPage };

