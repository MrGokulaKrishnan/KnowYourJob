import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Zap,
  LayoutDashboard,
  Search,
  Sparkles,
  FileCheck2,
  FileText,
  UserCircle2,
  Sliders,
  Bot,
  BarChart3,
  Settings,
  CreditCard,
  LogOut,
  Bell,
  Menu,
  X,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import { KYJLogo } from '../ui/KYJLogo';

import { isAuthorizedJobPoster } from '../../lib/utils/jobPosterAuth';

interface DashboardLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
  pageSubtitle?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  pageTitle,
  pageSubtitle,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userDoc, signOut } = useAuth();
  const { showToast } = useToast();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isRecruiter = isAuthorizedJobPoster(user?.email, (user as any)?.role);

  const navItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Job Search', path: '/dashboard/jobs', icon: Search },
    { label: 'AI Matches', path: '/dashboard/recommended', icon: Sparkles },
    { label: 'Applications', path: '/dashboard/applications', icon: FileCheck2 },
    { label: 'Resume & ATS', path: '/dashboard/resume', icon: FileText },
    { label: 'Profile', path: '/dashboard/profile', icon: UserCircle2 },
    { label: 'Preferences', path: '/dashboard/preferences', icon: Sliders },
    { label: 'Automation', path: '/dashboard/automation', icon: Bot },
    { label: 'Analytics', path: '/dashboard/analytics', icon: BarChart3 },
    { label: 'Settings', path: '/dashboard/settings', icon: Settings },
    { label: 'Billing', path: '/dashboard/billing', icon: CreditCard },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#06080d] text-slate-100 flex flex-col md:flex-row overflow-x-hidden">
      {/* Background ambient orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-amber-500/8 blur-[120px] pointer-events-none rounded-full" />
      <div className="fixed bottom-0 right-10 w-[500px] h-[500px] bg-amber-600/5 blur-[150px] pointer-events-none rounded-full" />

      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-white/8 bg-[#090d14]/85 backdrop-blur-2xl shrink-0 sticky top-0 h-screen z-30 shadow-[inset_-1px_0_0_rgba(255,255,255,0.04)]">
        {/* Brand */}
        <div className="p-6 border-b border-white/8 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <KYJLogo size={34} glow className="group-hover:scale-105 transition-transform" />
            <span className="font-bold tracking-tight text-white flex items-center">
              KnowYour<span className="text-gradient-gold">Job</span>
            </span>
          </Link>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 p-3.5 overflow-y-auto space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent text-amber-300 border border-amber-500/30 shadow-[inset_0_1px_0_0_rgba(253,230,138,0.25),0_0_15px_rgba(245,158,11,0.12)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-white/8 flex flex-col gap-3">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-gradient-to-b from-white/[0.05] to-white/[0.015] border border-white/8 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xs uppercase border border-amber-500/30 shrink-0">
              {userDoc?.displayName?.[0] || user?.email?.[0] || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-semibold text-slate-200 truncate">
                  {userDoc?.displayName || user?.displayName || 'Candidate'}
                </p>
                {isRecruiter && (
                  <span className="badge-ai text-[9px] px-1.5 py-0">Recruiter</span>
                )}
              </div>
              <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-[#090d14]/90 backdrop-blur-lg sticky top-0 z-30">
        <Link to="/dashboard" className="flex items-center gap-2">
          <KYJLogo size={28} />
          <span className="font-bold text-sm text-white">
            KnowYour<span className="text-amber-400">Job</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-white/5 text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-[#07090e]/95 backdrop-blur-2xl p-6 flex flex-col justify-between pt-20">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-rose-300 bg-rose-500/10 border border-rose-500/20"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 z-10">
        {/* Top bar with Breadcrumbs & Actions */}
        <div className="hidden md:flex items-center justify-between px-8 py-4 border-b border-white/8 bg-[#090d14]/70 backdrop-blur-xl shadow-[inset_0_-1px_0_0_rgba(255,255,255,0.03)] sticky top-0 z-20">
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">{pageTitle}</h1>
            {pageSubtitle && <p className="text-xs text-slate-400 mt-0.5">{pageSubtitle}</p>}
          </div>

          <div className="flex items-center gap-3">
            {/* Live Firestore Connection Status */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[11px] text-emerald-400 font-mono shadow-[inset_0_1px_0_rgba(52,211,153,0.15)]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Firebase Cloud Live</span>
            </div>

            {/* Recruiter Indicator if authorized */}
            {isRecruiter && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 font-mono shadow-[inset_0_1px_0_rgba(253,230,138,0.2)]">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Recruiter Privileges Active</span>
              </div>
            )}

            {/* Notifications quick button */}
            <button
              onClick={() => showToast('All notifications are up to date.', 'info')}
              className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-amber-400 transition cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Page Content Body */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
