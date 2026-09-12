import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ServerCrash, RefreshCcw, Home } from 'lucide-react';
import { KYJLogo } from '@/components/ui/KYJLogo';

export const ServerErrorPage: React.FC = () => {
  useEffect(() => {
    document.title = '500 Server Error — KnowYourJob';
  }, []);

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col justify-center items-center px-6 text-center selection:bg-amber-500/30 selection:text-amber-200">
      <div className="max-w-md w-full">
        <Link to="/" className="inline-flex items-center gap-2 mb-6">
          <KYJLogo size={40} glow />
          <span className="text-xl font-bold text-white">KnowYourJob</span>
        </Link>

        <div className="liquid-glass-elevated p-8 sm:p-10 rounded-3xl border border-white/10 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-6">
            <ServerCrash size={32} />
          </div>

          <span className="text-xs font-mono text-amber-400 tracking-widest uppercase block mb-1">
            System Error
          </span>
          <h1 className="text-3xl font-extrabold text-white">
            500 Internal Error
          </h1>
          <p className="text-xs text-slate-400 mt-3 leading-relaxed">
            Our cloud application encountered an unexpected runtime fault. Our telemetry has logged the event and our engineers have been alerted.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-xl transition"
            >
              <RefreshCcw size={14} /> Reload Application
            </button>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white text-xs font-medium rounded-xl transition"
            >
              <Home size={14} /> Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServerErrorPage;
