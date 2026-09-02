import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Send,
  Zap,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Shield,
} from 'lucide-react'
import { clsx } from 'clsx'
import { useAppStore } from '@/stores/appStore'
import { useAuthStore } from '@/stores/authStore'
import { signOut } from '@/services/firebase/auth'
import { toast } from 'react-hot-toast'
import { KYJLogo } from '@/components/ui/KYJLogo'

const navItems = [
  { to: '/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/jobs',         icon: Briefcase,       label: 'Jobs' },
  { to: '/applications', icon: Send,            label: 'Applications' },
  { to: '/resume',       icon: FileText,        label: 'Resume' },
  { to: '/automation',   icon: Zap,             label: 'Automation' },
  { to: '/analytics',    icon: BarChart3,       label: 'Analytics' },
]

const bottomItems = [
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useAppStore()
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/auth/login')
    } catch {
      toast.error('Failed to sign out')
    }
  }

  const width = sidebarCollapsed ? 72 : 240

  return (
    <motion.div
      animate={{ width }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="h-full flex flex-col relative overflow-hidden"
      style={{
        background: 'rgba(11,11,11,0.98)',
        borderRight: '1px solid rgba(255,215,0,0.12)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Logo area */}
      <div className="flex items-center gap-3 px-4 py-5" style={{ minHeight: 72 }}>
        <KYJLogo size={32} />
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col min-w-0"
          >
            <span className="font-black text-[15px] leading-tight text-white truncate">KnowYourJob</span>
            <span className="text-[10px] font-medium tracking-widest uppercase truncate" style={{ color: '#FFD000' }}>
              AI Career OS
            </span>
          </motion.div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        className="absolute top-5 -right-3 z-10 flex items-center justify-center w-6 h-6 rounded-full cursor-pointer transition-all duration-200 hover:scale-110"
        style={{
          background: 'rgba(17,17,17,0.98)',
          border: '1px solid rgba(255,215,0,0.25)',
          color: '#FFD000',
        }}
        aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {sidebarCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* Nav items */}
      <nav className="flex-1 px-2 py-2 flex flex-col gap-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative',
                'text-sm font-medium',
                isActive
                  ? 'text-white'
                  : 'hover:bg-white/5',
                isActive
                  ? ''
                  : 'text-white/50 hover:text-white/80',
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-xl"
                    style={{
                      background: 'rgba(255,208,0,0.10)',
                      border: '1px solid rgba(255,208,0,0.20)',
                    }}
                    transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
                  />
                )}
                <span className={clsx('relative z-10 flex-shrink-0', isActive && 'text-[#FFD000]')}>
                  <item.icon size={18} />
                </span>
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.05 }}
                    className="relative z-10 truncate"
                  >
                    {item.label}
                  </motion.span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Admin link if admin */}
      {user?.role === 'admin' && (
        <div className="px-2 py-1">
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium',
                isActive ? 'text-[#FFD000] bg-[rgba(255,208,0,0.10)]' : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              )
            }
          >
            <Shield size={18} />
            {!sidebarCollapsed && <span className="truncate">Admin</span>}
          </NavLink>
        </div>
      )}

      {/* Bottom items */}
      <div className="px-2 py-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        {bottomItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium mb-0.5',
                isActive ? 'text-[#FFD000] bg-[rgba(255,208,0,0.10)]' : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              )
            }
          >
            <item.icon size={18} />
            {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}

        {/* User info + sign out */}
        <div
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl mt-1"
          style={{ background: 'rgba(255,255,255,0.03)' }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm"
            style={{ background: 'linear-gradient(135deg,#FFE45C,#FFD000)', color: '#050505' }}
          >
            {user?.displayName?.charAt(0)?.toUpperCase() ?? user?.email?.charAt(0)?.toUpperCase() ?? 'U'}
          </div>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 min-w-0"
            >
              <div className="text-sm font-semibold text-white truncate">
                {user?.displayName ?? 'User'}
              </div>
              <div className="text-xs truncate" style={{ color: '#555' }}>
                {user?.email}
              </div>
            </motion.div>
          )}
          {!sidebarCollapsed && (
            <button
              onClick={handleSignOut}
              className="p-1.5 rounded-lg transition-colors hover:bg-white/10 cursor-pointer flex-shrink-0"
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut size={15} className="text-white/40 hover:text-white/80 transition-colors" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

