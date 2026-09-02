import React from 'react';
import { Sparkles } from 'lucide-react';

interface LoadingSpinnerProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  label = 'Loading KnowYourJob...', 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className="relative flex items-center justify-center">
        {/* Glowing pulse aura */}
        <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-xl animate-pulse" />
        <div className={`relative ${sizeClasses[size]} rounded-full border-2 border-amber-500/20 border-t-amber-400 animate-spin`} />
        <Sparkles className="absolute w-4 h-4 text-amber-400 animate-pulse" />
      </div>
      {label && <p className="text-xs font-medium tracking-wider uppercase text-amber-400/80">{label}</p>}
    </div>
  );
};
