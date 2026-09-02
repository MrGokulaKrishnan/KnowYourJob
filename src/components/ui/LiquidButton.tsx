import React, { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface LiquidButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'yellow' | 'glass' | 'danger' | 'subtle';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const LiquidButton: React.FC<LiquidButtonProps> = ({
  children,
  variant = 'yellow',
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  ...props
}) => {
  const baseClasses =
    'relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#07090e] focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    yellow:
      'btn-yellow-gradient font-semibold tracking-wide active:scale-[0.99]',
    glass:
      'btn-glass-secondary active:scale-[0.99]',
    danger:
      'bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25 hover:border-rose-500/50 hover:text-rose-200',
    subtle:
      'text-slate-400 hover:text-slate-100 hover:bg-white/5',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={twMerge(clsx(baseClasses, variants[variant], className))}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-current" />
          <span>Please wait...</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};
