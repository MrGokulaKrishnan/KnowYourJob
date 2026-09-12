import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Bot, 
  ShieldCheck, 
  CheckCircle2, 
  Search,
  Lock,
  ChevronRight,
  TrendingUp,
  Cpu,
  Layers,
  Briefcase
} from 'lucide-react';
import { LiquidButton } from '../components/ui/LiquidButton';
import { useAuth } from '../hooks/useAuth';
import { KYJLogo } from '../components/ui/KYJLogo';

export const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const aiCategories = [
    { title: 'Generative AI Engineer', slug: 'generative-ai', count: '140+ Roles', salary: '₹24L – ₹50L' },
    { title: 'LLM & Foundation Models', slug: 'llm', count: '95+ Roles', salary: '₹25L – ₹55L' },
    { title: 'Machine Learning Engineer', slug: 'machine-learning', count: '210+ Roles', salary: '₹18L – ₹38L' },
    { title: 'Remote AI Jobs', slug: 'remote-ai', count: '180+ Roles', salary: '₹20L – ₹55L' },
    { title: 'India AI Hubs (BLR/HYD/PUN)', slug: 'india-ai', count: '320+ Roles', salary: '₹15L – ₹45L' },
    { title: 'MLOps & AI Infrastructure', slug: 'mlops', count: '85+ Roles', salary: '₹22L – ₹45L' }
  ];

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col overflow-x-hidden selection:bg-amber-500/30 selection:text-amber-200">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-amber-500/15 via-yellow-500/5 to-transparent blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-amber-600/10 blur-[130px] pointer-events-none rounded-full" />

      {/* Navigation Header */}
      <header className="relative z-20 border-b border-white/5 bg-[#090d14]/60 backdrop-blur-xl sticky top-0 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <KYJLogo size={36} glow className="group-hover:scale-105 transition-transform" />
            <span className="text-xl font-bold tracking-tight text-white flex items-center">
              KnowYour<span className="text-gradient-gold">Job</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs text-slate-300">
            <Link to="/jobs" className="hover:text-amber-400 transition flex items-center gap-1">
              <Search size={14} className="text-amber-400" />
              <span>Explore AI Jobs</span>
            </Link>
            <Link to="/jobs/generative-ai" className="hover:text-amber-400 transition">
              Generative AI
            </Link>
            <Link to="/jobs/remote-ai" className="hover:text-amber-400 transition">
              Remote Roles
            </Link>
            <Link to="/support" className="hover:text-amber-400 transition">
              Help Center
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <LiquidButton variant="yellow" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Go to Dashboard
                </LiquidButton>
              </Link>
            ) : (
              <>
                <Link to="/jobs" className="hidden sm:inline-block">
                  <LiquidButton variant="glass" className="text-xs py-2 px-3.5">
                    Browse Jobs
                  </LiquidButton>
                </Link>
                <Link to="/auth/login">
                  <LiquidButton variant="glass" className="text-xs py-2 px-3.5">
                    Sign In
                  </LiquidButton>
                </Link>
                <Link to="/auth/register" className="hidden sm:inline-block">
                  <LiquidButton variant="yellow" className="text-xs py-2 px-3.5" rightIcon={<ChevronRight className="w-4 h-4" />}>
                    Get Started
                  </LiquidButton>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-6 pt-20 pb-16 sm:pt-28 sm:pb-24 max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Release tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono mb-6 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI-POWERED AUTONOMOUS CAREER PLATFORM</span>
        </div>

        {/* Hero title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.1]">
          Find Smarter. <br />
          <span className="text-gradient-gold">Apply Faster.</span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
          The premier AI career discovery portal. Automated role alignment, ATS-optimized resumes in INR benchmarks, and tailored applications designed to help you land top engineering roles.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link to="/jobs" className="w-full sm:w-auto">
            <LiquidButton variant="yellow" className="w-full sm:w-auto text-base px-8 py-3.5" rightIcon={<Search className="w-5 h-5" />}>
              Search AI Jobs
            </LiquidButton>
          </Link>
          <Link to="/auth/register" className="w-full sm:w-auto">
            <LiquidButton variant="glass" className="w-full sm:w-auto text-base px-8 py-3.5" rightIcon={<ArrowRight className="w-5 h-5" />}>
              Create Free Account
            </LiquidButton>
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Enterprise Data Security</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-amber-400" />
            <span>1-Click Google & Magic Link Sign-In</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            <span>Private Resume Cloud Vault</span>
          </div>
        </div>
      </section>

      {/* Featured AI Job Categories Grid (SEO Internal Linking) */}
      <section className="relative z-10 px-6 py-12 max-w-7xl mx-auto w-full border-t border-white/5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-mono mb-1">
              <TrendingUp size={14} />
              <span>MARKET DEMAND IN 2026</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Top AI Specializations & Salary Benchmarks
            </h2>
          </div>
          <Link to="/jobs" className="text-xs text-amber-400 hover:underline flex items-center gap-1">
            Browse All 850+ Openings <ArrowRight size={12} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {aiCategories.map((cat, i) => (
            <Link
              key={i}
              to={`/jobs/${cat.slug}`}
              className="liquid-glass-elevated p-6 rounded-2xl border border-white/5 hover:border-amber-500/30 hover:scale-[1.01] transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {cat.count}
                  </span>
                  <span className="text-xs font-mono text-emerald-400">
                    {cat.salary}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition">
                  {cat.title}
                </h3>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400 group-hover:text-white transition">
                <span>View verified openings</span>
                <ChevronRight size={14} className="text-amber-400" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Feature Architecture Matrix */}
      <section className="relative z-10 px-6 py-16 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Engineered to Accelerate Your Career
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            AI precision matching, real-time ATS optimization, and autonomous application workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="liquid-glass-elevated rounded-2xl p-7 border border-white/5 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-5">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Instant AI Profile Extraction</h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                Upload your resume in PDF or DOCX format. Gemini AI extracts your verified experience, technical skills, and career timeline in seconds.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 text-xs text-amber-400 font-mono">
              Gemini 3.6 Flash Powered
            </div>
          </div>

          {/* Card 2 */}
          <div className="liquid-glass-elevated rounded-2xl p-7 border border-white/5 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-5">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Precision ATS Match Engine</h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                Compare your background against verified engineering openings. Identify skill gaps, calculate compatibility scores, and discover high-probability roles.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 text-xs text-amber-400 font-mono">
              Semantic Match Scoring
            </div>
          </div>

          {/* Card 3 */}
          <div className="liquid-glass-elevated rounded-2xl p-7 border border-white/5 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-5">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Autonomous Application Suite</h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                Tailor applications, generate customized cover letters, and track your pipeline across every stage with complete user oversight and safety.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 text-xs text-amber-400 font-mono">
              User-Controlled Automation
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive 4-Column Footer */}
      <footer className="relative z-10 border-t border-white/5 mt-auto pt-12 pb-8 px-6 bg-[#05070a]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-10 text-xs">
          {/* Col 1 */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <KYJLogo size={24} />
              <span className="text-white font-bold text-sm">KnowYourJob</span>
            </div>
            <p className="text-slate-400 leading-relaxed mb-4">
              AI-powered career operating system. Autonomous role alignment, ATS scoring, and career intelligence.
            </p>
            <div className="text-[11px] text-slate-500 font-mono">
              Hosted in Mumbai (BOM) CDN · TLS 1.3
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-white font-semibold uppercase tracking-wider font-mono mb-3">
              AI Job Portals
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link to="/jobs" className="hover:text-amber-400 transition">All Engineering Jobs</Link></li>
              <li><Link to="/jobs/generative-ai" className="hover:text-amber-400 transition">Generative AI Engineer</Link></li>
              <li><Link to="/jobs/llm" className="hover:text-amber-400 transition">LLM Engineers</Link></li>
              <li><Link to="/jobs/machine-learning" className="hover:text-amber-400 transition">Machine Learning</Link></li>
              <li><Link to="/jobs/remote-ai" className="hover:text-amber-400 transition">Remote AI Jobs</Link></li>
              <li><Link to="/jobs/india-ai" className="hover:text-amber-400 transition">India AI Roles (INR)</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-white font-semibold uppercase tracking-wider font-mono mb-3">
              Governance & Legal
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link to="/privacy" className="hover:text-amber-400 transition">Privacy Policy (DPDP/GDPR)</Link></li>
              <li><Link to="/terms" className="hover:text-amber-400 transition">Terms of Service</Link></li>
              <li><Link to="/cookies" className="hover:text-amber-400 transition">Cookie Preferences</Link></li>
              <li><Link to="/security-policy" className="hover:text-amber-400 transition">Security Policy</Link></li>
              <li><Link to="/refund-policy" className="hover:text-amber-400 transition">Refund Policy (7-Day)</Link></li>
              <li><Link to="/accessibility" className="hover:text-amber-400 transition">Accessibility (WCAG)</Link></li>
              <li><Link to="/disclaimer" className="hover:text-amber-400 transition">Legal Disclaimer</Link></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-white font-semibold uppercase tracking-wider font-mono mb-3">
              Support & Lifecycle
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link to="/support" className="hover:text-amber-400 transition">Help Center</Link></li>
              <li><Link to="/auth/login" className="hover:text-amber-400 transition">Candidate Sign In</Link></li>
              <li><Link to="/auth/register" className="hover:text-amber-400 transition">Create Account</Link></li>
              <li><Link to="/auth/forgot-password" className="hover:text-amber-400 transition">Password Recovery</Link></li>
              <li><Link to="/responsible-disclosure" className="hover:text-amber-400 transition">Responsible Disclosure</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} KnowYourJob. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Built with React 19 & Tailwind CSS</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
