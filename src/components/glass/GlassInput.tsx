import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import { clsx } from 'clsx'

interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(function GlassInput(
  { label, error, hint, leftIcon, rightIcon, className, ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium" style={{ color: '#B8B8B8' }}>
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#555' }}>
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          className={clsx(
            'glass-input',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            error && 'border-red-500/50 focus:border-red-500/80 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.10)]',
            className
          )}
          {...props}
        />
        {rightIcon && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: '#555' }}>
            {rightIcon}
          </span>
        )}
      </div>
      {error && <span className="text-xs" style={{ color: '#EF4444' }}>{error}</span>}
      {hint && !error && <span className="text-xs" style={{ color: '#555' }}>{hint}</span>}
    </div>
  )
})
