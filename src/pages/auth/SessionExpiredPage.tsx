import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { KYJLogo } from '@/components/ui/KYJLogo';

export const SessionExpiredPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Session Expired — KnowYourJob';
  }, []);

  return (
    <div className="min-h-screen bg-[#000000] text-slate-100 flex flex-col justify-center items-center px-6 text-center selection:bg-amber-500/30 selection:text-amber-200">
      <div className="max-w-md w-full">
        <Link to="/" className="inline-flex items-center gap-2 mb-6">
          <KYJLogo size={40} glow />
          <span className="text-xl font-bold text-white">KnowYourJob</span>
        </Link>

        <div className="liquid-glass-elevated p-8 sm:p-10 rounded-3xl border border-white/10 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-6">
            <Clock size={32} />
          </div>

          <span className="text-xs font-mono text-amber-400 tracking-widest uppercase block mb-1">
            Security Inactivity Timeout
          </span>
          <h1 className="text-3xl font-extrabold text-white">
            Session Expired
          </h1>
          <p className="text-xs text-slate-400 mt-3 leading-relaxed">
            Your authenticated session has ended for your security. Please sign in again to resume your job searches, ATS scores, and automation pipeline.
          </p>

          <div className="mt-8 flex justify-center">
            <Link
              to="/auth/login"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-xl transition"
            >
              Sign In Again <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionExpiredPage;
