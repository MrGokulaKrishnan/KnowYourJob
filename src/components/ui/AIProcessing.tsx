import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Check, Loader2 } from 'lucide-react';
import clsx from 'clsx';

interface AIProcessingProps {
  steps: string[];
  currentStep: number;
  title?: string;
}

export const AIProcessing: React.FC<AIProcessingProps> = ({ steps, currentStep, title = "Analyzing your profile..." }) => {
  const progress = Math.min(100, Math.max(0, (currentStep / Math.max(1, steps.length - 1)) * 100));

  return (
    <div className="glass-gold p-8 rounded-2xl w-full max-w-md mx-auto border border-yellow-500/20 shadow-[0_0_40px_rgba(255,208,0,0.15)] relative overflow-hidden">
      {/* Background glow animation */}
      <motion.div 
        animate={{ 
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-20 -right-20 w-40 h-40 bg-yellow-500/20 rounded-full blur-3xl"
      />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-yellow-500/10 rounded-lg text-primary animate-pulse">
            <Sparkles size={24} />
          </div>
          <h3 className="text-lg font-bold text-white">{title}</h3>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-secondary font-medium">Processing</span>
            <span className="text-primary font-mono">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden border border-white/5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full relative"
            >
              {/* Shimmer effect */}
              <motion.div 
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-1/2 skew-x-12"
              />
            </motion.div>
          </div>
        </div>

        {/* Steps list */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {steps.map((step, index) => {
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;
              const isPending = index > currentStep;

              return (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={clsx(
                    "flex items-center gap-3 text-sm transition-colors duration-300",
                    isCompleted ? "text-secondary" : isCurrent ? "text-white font-medium" : "text-muted"
                  )}
                >
                  <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                    {isCompleted ? (
                      <Check size={16} className="text-green-400" />
                    ) : isCurrent ? (
                      <Loader2 size={16} className="text-primary animate-spin" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-white/20" />
                    )}
                  </div>
                  {step}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
