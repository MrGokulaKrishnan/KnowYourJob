import { clsx } from 'clsx'
import type { ReactNode } from 'react'

interface GlassMetricProps {
  label: string
  value: string | number
  subtext?: string
  icon?: ReactNode
  trend?: { direction: 'up' | 'down' | 'neutral'; value: string }
  highlight?: boolean
  gradient?: 'gold' | 'cyan' | 'emerald' | 'purple' | 'sunset' | 'silver'
  className?: string
}

export function GlassMetric({ label, value, subtext, icon, trend, highlight, gradient, className }: GlassMetricProps) {
  const gradientClass = gradient
    ? `text-gradient-${gradient}`
    : highlight
      ? 'text-gradient-gold'
      : 'text-gradient-gold';

  return (
    <div
      className={clsx(
        highlight ? 'glass-gold' : 'glass',
        'rounded-2xl p-5 flex flex-col gap-2',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</span>
        {icon && <span className="opacity-60">{icon}</span>}
      </div>
      <div className="flex items-end gap-2">
        <span
          className={clsx(
            'text-3xl font-black leading-none font-mono',
            gradientClass
          )}
        >
          {value}
        </span>
        {trend && (
          <span
            className={clsx(
              'text-sm font-semibold mb-0.5',
              trend.direction === 'up' ? 'text-green-400' :
              trend.direction === 'down' ? 'text-red-400' : 'text-gray-400'
            )}
          >
            {trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : '→'} {trend.value}
          </span>
        )}
      </div>
      {subtext && <span className="text-sm" style={{ color: '#777' }}>{subtext}</span>}
    </div>
  )
}
