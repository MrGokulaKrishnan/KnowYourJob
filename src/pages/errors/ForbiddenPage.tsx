import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowRight, Lock } from 'lucide-react';
import { KYJLogo } from '@/components/ui/KYJLogo';

export const ForbiddenPage: React.FC = () => {
  useEffect(() => {
    document.title = '403 Access Denied — KnowYourJob';
  }, []);

  return (
    <div className="min-h-screen bg-[#000000] text-slate-100 flex flex-col justify-center items-center px-6 text-center relative overflow-x-hidden selection:bg-amber-400 selection:text-black">
      {/* Ambient background glow orbs matching Homepage */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[850px] h-[360px] bg-gradient-to-b from-amber-500/15 via-yellow-500/5 to-transparent blur-[140px] rounded-full pointer-events-none z-0" />
      <div className="fixed top-1/3 right-[-10%] w-96 h-96 bg-amber-600/10 blur-[130px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-10 left-[-10%] w-96 h-96 bg-yellow-500/10 blur-[140px] rounded-full pointer-events-none z-0" />

      <div className="max-w-md w-full relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
          <KYJLogo size={40} glow className="group-hover:scale-105 transition-transform" />
          <span className="text-xl font-bold text-white">KnowYour<span className="text-gradient-gold">Job</span></span>
        </Link>

        <div className="liquid-glass-elevated p-8 sm:p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(244,63,94,0.2)]">
            <ShieldAlert size={32} />
          </div>

          <span className="text-xs font-mono text-gradient-rose tracking-widest uppercase block mb-1 font-bold">
            Access Denied
          </span>
          <h1 className="text-3xl font-extrabold text-white">
            403 <span className="text-gradient-rose">Forbidden</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-3 leading-relaxed">
            You do not possess the required administrator privileges or role permissions to access this protected area.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 btn-yellow-gradient text-black text-xs font-bold rounded-xl transition shadow-[0_0_20px_rgba(245,158,11,0.35)]"
            >
              Back to Dashboard <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForbiddenPage;
