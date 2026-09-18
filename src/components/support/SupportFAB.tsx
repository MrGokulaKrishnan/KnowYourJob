import React from 'react';
import { MessageSquareWarning } from 'lucide-react';

interface SupportFABProps {
  onClick: () => void;
}

export const SupportFAB: React.FC<SupportFABProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:scale-105 hover:shadow-[0_0_25px_rgba(244,63,94,0.5)] transition-all cursor-pointer group flex items-center justify-center"
      aria-label="Report a Bug"
    >
      <MessageSquareWarning className="w-6 h-6" />
      {/* Tooltip */}
      <span className="absolute right-full mr-4 whitespace-nowrap bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10">
        Report a Bug
      </span>
    </button>
  );
};
