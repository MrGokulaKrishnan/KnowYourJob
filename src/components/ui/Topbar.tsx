import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Search, Menu } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useAppStore } from '@/stores/appStore'
import { KYJLogo } from '@/components/ui/KYJLogo'

export function Topbar() {
  const [searchOpen, setSearchOpen] = useState(false)
  const user = useAuthStore((s) => s.user)
  const unreadCount = useAppStore((s) => s.unreadCount)
  const toggleSidebar = useAppStore((s) => s.toggleSidebar)
  const navigate = useNavigate()

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const firstName = user?.displayName?.split(' ')[0] ?? user?.email?.split('@')[0] ?? 'there'

  return (
    <header
      className="flex items-center gap-4 px-4 lg:px-6 h-16 flex-shrink-0"
      style={{
        background: 'rgba(5,5,5,0.95)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Mobile menu toggle */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden p-2 rounded-lg hover:bg-white/8 transition-colors cursor-pointer"
        aria-label="Toggle menu"
      >
        <Menu size={20} className="text-white/70" />
      </button>

      {/* Mobile logo */}
      <div className="lg:hidden flex items-center gap-2">
        <KYJLogo size={24} />
        <span className="font-black text-sm text-white">KnowYourJob</span>
      </div>

      {/* Greeting â€” desktop */}
      <div className="hidden lg:block flex-1">
        <p className="text-sm font-medium" style={{ color: '#B8B8B8' }}>
          {greeting()}, <span className="text-white font-semibold">{firstName}</span>
        </p>
        <p className="text-xs" style={{ color: '#555' }}>Your AI job search is active.</p>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Search */}
        <button
          onClick={() => navigate('/jobs')}
          className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all duration-200 cursor-pointer"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#555',
          }}
          aria-label="Search jobs"
        >
          <Search size={14} />
          <span>Search jobs...</span>
          <kbd
            className="hidden md:inline-flex px-1.5 py-0.5 text-[10px] rounded"
            style={{ background: 'rgba(255,255,255,0.06)', color: '#444', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            /
          </kbd>
        </button>

        {/* Notifications */}
        <button
          className="relative p-2 rounded-xl hover:bg-white/8 transition-colors cursor-pointer"
          aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
        >
          <Bell size={18} className="text-white/60" />
          {unreadCount > 0 && (
            <span
              className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
              style={{ background: '#FFD000', color: '#050505' }}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Avatar */}
        <button
          onClick={() => navigate('/settings')}
          className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm cursor-pointer flex-shrink-0 hover:opacity-80 transition-opacity"
          style={{ background: 'linear-gradient(135deg,#FFE45C,#FFD000)', color: '#050505' }}
          aria-label="Account settings"
        >
          {user?.displayName?.charAt(0)?.toUpperCase() ?? user?.email?.charAt(0)?.toUpperCase() ?? 'U'}
        </button>
      </div>
    </header>
  )
}

