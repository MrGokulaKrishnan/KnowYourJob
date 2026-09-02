import { clsx } from 'clsx'
import type { ReactNode } from 'react'

interface GlassBadgeProps {
  children: ReactNode
  variant?: 'default' | 'yellow' | 'green' | 'red' | 'blue' | 'amber' | 'demo' | 'ai'
  size?: 'sm' | 'md'
  dot?: boolean
  className?: string
}

export function GlassBadge({ children, variant = 'default', size = 'md', dot, className }: GlassBadgeProps) {
  const variants = {
    default: 'bg-white/8 text-white/60 border-white/10',
    yellow:  'bg-[rgba(255,208,0,0.15)] text-[#FFD000] border-[rgba(255,208,0,0.3)]',
    green:   'bg-green-500/10 text-green-400 border-green-500/20',
    red:     'bg-red-500/10 text-red-400 border-red-500/20',
    blue:    'bg-blue-400/10 text-blue-400 border-blue-400/20',
    amber:   'bg-[rgba(255,170,0,0.15)] text-[#FFAA00] border-[rgba(255,170,0,0.3)]',
    demo:    'badge-demo',
    ai:      'badge-ai',
  }

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-3 py-1',
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full border font-semibold tracking-wide',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {dot && (
        <span className={clsx(
          'w-1.5 h-1.5 rounded-full',
          variant === 'green' ? 'bg-green-400' :
          variant === 'red' ? 'bg-red-400' :
          variant === 'yellow' || variant === 'ai' ? 'bg-[#FFD000]' :
          'bg-current'
        )} />
      )}
      {children}
    </span>
  )
}
