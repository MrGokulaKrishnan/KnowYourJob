import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/ui/Sidebar'
import { Topbar } from '@/components/ui/Topbar'
import { MobileNav } from '@/components/ui/MobileNav'
import { useAppStore } from '@/stores/appStore'
import { clsx } from 'clsx'

export function AppLayout() {
  const sidebarCollapsed = useAppStore((s) => s.sidebarCollapsed)

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#050505' }}>
      {/* Background glow effects */}
      <div
        className="fixed inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 20% 10%, rgba(255,208,0,0.06) 0%, transparent 60%)',
        }}
      />

      {/* Sidebar â€” desktop only */}
      <aside className="hidden lg:flex flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top bar */}
        <Topbar />

        {/* Page content */}
        <main
          className={clsx(
            'flex-1 overflow-y-auto',
            'pb-20 lg:pb-6 px-4 lg:px-6 pt-4',
          )}
        >
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <nav className="lg:hidden">
        <MobileNav />
      </nav>
    </div>
  )
}

export default AppLayout

