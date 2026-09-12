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
    <div className="fixed bottom-4 right-4 sm:right-6 max-w-md z-50 p-5 rounded-2xl liquid-glass-elevated border border-white/15 shadow-2xl backdrop-blur-2xl animate-fade-in text-slate-100">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 flex-shrink-0">
          <Cookie size={20} />
        </div>
        <div className="flex-1">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Cookie & Data Privacy
          </h4>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            We use essential cookies to maintain secure authenticated sessions and improve your AI candidate experience. View our{' '}
            <Link to="/cookies" className="text-amber-400 hover:underline">
              Cookie Policy
            </Link>.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleChoice('all')}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition flex items-center gap-1"
            >
              <Check size={12} /> Accept All
            </button>
            <button
              onClick={() => handleChoice('essential')}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-medium transition"
            >
              Essential Only
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
