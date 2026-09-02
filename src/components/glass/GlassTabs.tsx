import { useState, type ReactNode } from 'react'
import { motion } from 'motion/react'
import { clsx } from 'clsx'

interface Tab {
  id: string
  label: string
  icon?: ReactNode
  badge?: string | number
}

interface GlassTabsProps {
  tabs: Tab[]
  defaultTab?: string
  onChange?: (tabId: string) => void
  children?: (activeTab: string) => ReactNode
  className?: string
}

export function GlassTabs({ tabs, defaultTab, onChange, children, className }: GlassTabsProps) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id)

  const handleChange = (id: string) => {
    setActive(id)
    onChange?.(id)
  }

  return (
    <div className={clsx('flex flex-col gap-4', className)}>
      <div className="glass-subtle rounded-xl p-1 flex gap-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleChange(tab.id)}
            className={clsx(
              'relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 whitespace-nowrap flex-shrink-0 cursor-pointer',
              active === tab.id ? 'text-white' : 'text-white/50 hover:text-white/80'
            )}
          >
            {active === tab.id && (
              <motion.div
                layoutId="tab-pill"
                className="absolute inset-0 glass rounded-lg"
                style={{ border: '1px solid rgba(255,215,0,0.25)' }}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
              />
            )}
            <span className="relative flex items-center gap-2">
              {tab.icon}
              {tab.label}
              {tab.badge !== undefined && (
                <span className="bg-[rgba(255,208,0,0.2)] text-[#FFD000] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {tab.badge}
                </span>
              )}
            </span>
          </button>
        ))}
      </div>
      {children && children(active)}
    </div>
  )
}
