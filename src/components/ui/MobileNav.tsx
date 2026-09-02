import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Briefcase, Send, Zap, BarChart3 } from 'lucide-react'
import { clsx } from 'clsx'

const items = [
  { to: '/dashboard',    icon: LayoutDashboard, label: 'Home' },
  { to: '/jobs',         icon: Briefcase,       label: 'Jobs' },
  { to: '/applications', icon: Send,            label: 'Apply' },
  { to: '/automation',   icon: Zap,             label: 'Auto' },
  { to: '/analytics',    icon: BarChart3,       label: 'Stats' },
]

export function MobileNav() {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 px-2 py-2 safe-area-bottom"
      style={{
        background: 'rgba(11,11,11,0.98)',
        borderTop: '1px solid rgba(255,215,0,0.12)',
        backdropFilter: 'blur(24px)',
      }}
    >
      <div className="flex items-center justify-around max-w-sm mx-auto">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              clsx(
                'flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-[52px]',
                isActive
                  ? 'text-[#FFD000]'
                  : 'text-white/40 hover:text-white/70'
              )
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={clsx(
                    'p-1.5 rounded-lg transition-colors',
                    isActive && 'bg-[rgba(255,208,0,0.12)]'
                  )}
                >
                  <item.icon size={20} />
                </div>
                <span className="text-[10px] font-semibold">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  )
}

