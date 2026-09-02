import { motion } from 'motion/react'
import { clsx } from 'clsx'
import type { ReactNode, HTMLAttributes } from 'react'

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  variant?: 'default' | 'strong' | 'subtle' | 'gold' | 'highlight'
  hover?: boolean
  glow?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  animate?: boolean
  delay?: number
}

export function GlassCard({
  children,
  variant = 'default',
  hover = false,
  glow = false,
  padding = 'md',
  animate = true,
  delay = 0,
  className,
  ...props
}: GlassCardProps) {
  const variantClasses = {
    default: 'glass',
    strong: 'glass-strong',
    subtle: 'glass-subtle',
    gold: 'glass-gold',
    highlight: 'glass',
  }

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  const content = (
    <div
      className={clsx(
        variantClasses[variant],
        paddingClasses[padding],
        'rounded-2xl',
        hover && 'transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(0,0,0,0.8)]',
        glow && 'shadow-[0_0_40px_rgba(255,208,0,0.15)]',
        variant === 'highlight' && 'border-[rgba(255,208,0,0.35)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )

  if (!animate) return content

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.4, 0, 0.2, 1] }}
    >
      {content}
    </motion.div>
  )
}

export default GlassCard
