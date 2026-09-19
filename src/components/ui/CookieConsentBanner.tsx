import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, Check, X } from 'lucide-react';

const COOKIE_CONSENT_KEY = 'kyj_cookie_consent_choice';

export const CookieConsentBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!saved) {
      // Delay display slightly for smooth page entry
      const timer = setTimeout(() => setShowBanner(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleChoice = (choice: 'all' | 'essential') => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({ choice, timestamp: Date.now() }));
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 right-4 sm:right-6 max-w-md z-50 p-5 rounded-2xl liquid-glass-elevated border border-amber-500/30 shadow-2xl backdrop-blur-2xl animate-fade-in text-slate-100">
      <div className="flex items-start gap-3.5">
        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex-shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
          <Cookie size={20} />
        </div>
        <div className="flex-1">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
            <span>Cookie & Data Privacy</span>
          </h4>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            We use essential cookies to maintain secure authenticated sessions and improve your AI candidate experience. View our{' '}
            <Link to="/cookies" className="text-amber-400 hover:underline font-medium">
              Cookie Policy
            </Link>.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => handleChoice('all')}
              className="btn-yellow-gradient px-4 py-2 rounded-xl text-black text-xs font-bold shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Check size={13} className="stroke-[3]" />
              <span>Accept All</span>
            </button>
            <button
              onClick={() => handleChoice('essential')}
              className="btn-glass px-4 py-2 rounded-xl text-xs font-semibold text-slate-200 border border-white/15 hover:border-amber-500/40 hover:text-amber-300 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md"
            >
              Essential Only
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
