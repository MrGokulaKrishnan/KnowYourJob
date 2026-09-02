import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  Sparkles, 
  ArrowRight, 
  Bot, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  Search,
  Lock,
  ChevronRight
} from 'lucide-react';
import { LiquidButton } from '../components/ui/LiquidButton';
import { useAuth } from '../hooks/useAuth';

export const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col overflow-x-hidden selection:bg-amber-500/30 selection:text-amber-200">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-amber-500/15 via-yellow-500/5 to-transparent blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-amber-600/10 blur-[130px] pointer-events-none rounded-full" />

      {/* Navigation Header */}
      <header className="relative z-20 border-b border-white/5 bg-[#090d14]/60 backdrop-blur-xl sticky top-0 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Zap className="w-5 h-5 text-slate-950 fill-current" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white flex items-center">
              KnowYour<span className="text-gradient-gold">Job</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <LiquidButton variant="yellow" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Go to Dashboard
                </LiquidButton>
              </Link>
            ) : (
              <>
                <Link to="/auth/login">
                  <LiquidButton variant="glass">
                    Sign In
                  </LiquidButton>
                </Link>
                <Link to="/auth/register" className="hidden sm:inline-block">
                  <LiquidButton variant="yellow" rightIcon={<ChevronRight className="w-4 h-4" />}>
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
          <span>PRODUCTION-READY FIREBASE BACKEND FOUNDATION</span>
        </div>

        {/* Hero title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.1]">
          Find Smarter. <br />
          <span className="text-gradient-gold">Apply Faster.</span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
          The next-generation AI career discovery platform. Automated role alignment, ATS-optimized resumes, and vetted applications powered by enterprise Firebase Authentication & Firestore.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link to="/auth/register" className="w-full sm:w-auto">
            <LiquidButton variant="yellow" className="w-full sm:w-auto text-base px-8 py-3.5" rightIcon={<ArrowRight className="w-5 h-5" />}>
              Create Free Account
            </LiquidButton>
          </Link>
          <Link to="/auth/login" className="w-full sm:w-auto">
            <LiquidButton variant="glass" className="w-full sm:w-auto text-base px-8 py-3.5">
              Sign In with Google or Email
            </LiquidButton>
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Strict Firestore Security Rules</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-amber-400" />
            <span>Passwordless Magic Link & Google Auth</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            <span>Encrypted Resume Cloud Storage</span>
          </div>
        </div>
      </section>

      {/* Feature Architecture Matrix */}
      <section className="relative z-10 px-6 py-16 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Engineered for Security & Speed
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            A real full-stack architecture connecting React 19 to Firebase services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="liquid-glass-elevated rounded-2xl p-7 border border-white/5 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Three Auth Channels</h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                Standard Email & Password with automatic verification, zero-password magic email links, and official Google Sign-In with idempotent profile sync.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 text-xs text-amber-400 font-mono">
              Firebase Auth v12 Ready
            </div>
          </div>

          {/* Card 2 */}
          <div className="liquid-glass-elevated rounded-2xl p-7 border border-white/5 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-5">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Cloud Firestore Database</h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                Production Firestore rules ensure users can only ever access their own applications, resumes, and automation preferences. Zero cross-tenant data leakage.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 text-xs text-amber-400 font-mono">
              Role Isolation & Compound Indexes
            </div>
          </div>

          {/* Card 3 */}
          <div className="liquid-glass-elevated rounded-2xl p-7 border border-white/5 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-5">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Safe Autonomous Controls</h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                Configurable daily application caps, match thresholds, and immutable audit logs ensure users remain in full control of their job hunt.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 text-xs text-amber-400 font-mono">
              Default-Disabled Safety Boundary
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 mt-auto py-8 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-slate-300 font-semibold">KnowYourJob</span>
            <span>— AI Autonomous Career Platform</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <Link to="/auth/login" className="hover:text-amber-400 transition">Sign In</Link>
            <Link to="/auth/register" className="hover:text-amber-400 transition">Register</Link>
            <Link to="/auth/email-link-sent" className="hover:text-amber-400 transition">Email Link</Link>
            <Link to="/auth/forgot-password" className="hover:text-amber-400 transition">Password Reset</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
