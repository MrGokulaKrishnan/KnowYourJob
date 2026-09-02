import { clsx } from 'clsx'
import type { ReactNode } from 'react'

interface ProgressBarProps {
  value: number          // 0–100
  label?: string
  sublabel?: string
  size?: 'sm' | 'md'
  showValue?: boolean
  className?: string
}

export function ProgressBar({ value, label, sublabel, size = 'md', showValue = true, className }: ProgressBarProps) {
  const clampedValue = Math.max(0, Math.min(100, value))

  return (
    <div className={clsx('flex flex-col gap-1.5', className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && <span className="text-sm font-medium text-white">{label}</span>}
          {sublabel && <span className="text-xs" style={{ color: '#777' }}>{sublabel}</span>}
          {showValue && (
            <span className="text-sm font-bold" style={{ color: '#FFD000' }}>
              {clampedValue}%
            </span>
          )}
        </div>
      )}
      <div
        className="w-full rounded-full overflow-hidden"
        style={{
          height: size === 'sm' ? '3px' : '5px',
          background: 'rgba(255,255,255,0.06)',
        }}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${clampedValue}%`,
            background: 'linear-gradient(90deg, #FFE45C, #FFD000, #FF9D00)',
          }}
        />
      </div>
    </div>
  )
}

// ── Circular match score ────────────────────────────────────────────────────

interface MatchScoreCircleProps {
  score: number
  size?: number
  showLabel?: boolean
  className?: string
}

export function MatchScoreCircle({ score, size = 96, showLabel = true, className }: MatchScoreCircleProps) {
  const radius = (size - 12) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  const label = score >= 90 ? 'Excellent' : score >= 75 ? 'Good' : score >= 60 ? 'Fair' : 'Low'
  const color = score >= 90 ? '#FFD000' : score >= 75 ? '#FFAA00' : score >= 60 ? '#B8B8B8' : '#555'

  return (
    <div className={clsx('flex flex-col items-center gap-1', className)}>
      <div style={{ width: size, height: size, position: 'relative' }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: 'rotate(-90deg)' }}
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="6"
          />
          {/* Progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="url(#match-grad)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)' }}
          />
          <defs>
            <linearGradient id="match-grad" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFE45C" />
              <stop offset="100%" stopColor="#FF9D00" />
            </linearGradient>
          </defs>
        </svg>
        {/* Center text */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ fontSize: size * 0.22, fontWeight: 800, color }}
        >
          <span>{score}%</span>
        </div>
      </div>
      {showLabel && (
        <span className="text-xs font-semibold" style={{ color }}>{label}</span>
      )}
    </div>
  )
}
