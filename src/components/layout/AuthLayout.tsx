import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-8 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-tr from-amber-500/15 via-yellow-400/10 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-600/10 blur-[100px] pointer-events-none rounded-full" />

      {/* Brand Header */}
      <div className="mb-6 text-center z-10 flex flex-col items-center">
        <Link to="/" className="inline-flex flex-col items-center gap-3 group focus:outline-none">
          <div className="relative group-hover:scale-105 transition-transform duration-300">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-2xl blur-md opacity-30 group-hover:opacity-60 transition duration-300" />
            <img
              src="/kyj-logo.jpg"
              alt="KnowYourJob Logo"
              className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-contain shadow-2xl border border-amber-500/30 bg-black"
            />
          </div>
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-1">
            KnowYour<span className="text-gradient-gold">Job</span>
          </span>
        </Link>
        <p className="text-xs tracking-widest text-amber-400/80 font-mono mt-1 uppercase">
          AI Autonomous Career Platform
        </p>
      </div>

      {/* Liquid Glass Main Panel */}
      <div className="relative w-full max-w-md z-10">
        <div className="liquid-glass-elevated rounded-2xl p-6 sm:p-8 backdrop-blur-2xl">
          <div className="mb-6 text-center">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{title}</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">{subtitle}</p>
          </div>

          {children}

          {/* Security badge footer */}
          <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400/80" />
            <span>End-to-End Firebase Protected Authentication</span>
          </div>
        </div>
      </div>
    </div>
  );
};
