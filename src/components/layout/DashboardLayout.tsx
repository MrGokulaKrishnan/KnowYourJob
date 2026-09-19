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
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import { KYJLogo } from '../ui/KYJLogo';
import { UserAvatar } from '../ui/UserAvatar';

import { isAuthorizedJobPoster } from '../../lib/utils/jobPosterAuth';
import { SupportFAB } from '../support/SupportFAB';
import { ReportBugModal } from '../support/ReportBugModal';
import { Bug } from 'lucide-react';

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
  const [isBugModalOpen, setIsBugModalOpen] = useState(false);
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
    <div className="min-h-screen bg-[#000000] text-slate-100 flex flex-col md:flex-row overflow-x-hidden relative selection:bg-amber-500/30 selection:text-amber-200">
      {/* Background Ambient Glows (Identical to Homepage) */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-amber-500/15 via-yellow-500/5 to-transparent blur-[140px] pointer-events-none rounded-full z-0" />
      <div className="fixed top-1/3 right-10 w-[500px] h-[500px] bg-amber-600/10 blur-[150px] pointer-events-none rounded-full z-0" />
      <div className="fixed bottom-10 left-10 w-[450px] h-[450px] bg-yellow-500/8 blur-[130px] pointer-events-none rounded-full z-0" />

      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-white/10 bg-[#030304]/90 backdrop-blur-2xl shrink-0 sticky top-0 h-screen z-30 shadow-[inset_-1px_0_0_rgba(255,255,255,0.05),0_0_40px_rgba(0,0,0,0.8)]">
        {/* Brand */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <KYJLogo size={36} glow className="group-hover:scale-105 transition-transform" />
            <span className="font-bold tracking-tight text-white flex items-center text-lg">
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
                    ? 'bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent text-amber-300 border border-amber-500/35 shadow-[inset_0_1px_0_0_rgba(253,230,138,0.3),0_0_20px_rgba(245,158,11,0.15)] font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.9)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Card & Logout or Auth CTA */}
        {user ? (
          <div className="p-4 border-t border-white/10 flex flex-col gap-3">
            <Link
              to="/dashboard/profile"
              className="flex items-center gap-3 p-2.5 rounded-xl liquid-glass border border-white/10 hover:border-amber-400/40 transition shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] group cursor-pointer"
              title="View candidate profile"
            >
              <UserAvatar
                user={user}
                userDoc={userDoc}
                size="sm"
                roundedClassName="rounded-lg"
                showGoogleBadge={true}
                border={true}
                className="shrink-0 group-hover:scale-105 transition-transform"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-semibold text-slate-200 group-hover:text-amber-300 transition-colors truncate">
                    {userDoc?.displayName || user?.displayName || 'Candidate'}
                  </p>
                  {isRecruiter && (
                    <span className="badge-ai text-[9px] px-1.5 py-0">Recruiter</span>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
              </div>
            </Link>

            <button
              onClick={() => setIsBugModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition cursor-pointer"
            >
              <Bug className="w-3.5 h-3.5" />
              <span>Report a Bug</span>
            </button>
            
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          <div className="p-4 border-t border-white/10 flex flex-col gap-2.5">
            <Link
              to="/auth/login"
              className="w-full btn-glass py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 text-white border border-white/15 hover:border-amber-400/40 hover:text-amber-300 transition shadow-md cursor-pointer"
            >
              Sign In
            </Link>
            <Link
              to="/auth/register"
              className="w-full btn-yellow-gradient py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:scale-[1.02] transition cursor-pointer"
            >
              <span>Get Started</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </Link>
          </div>
        )}
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-[#040404]/95 backdrop-blur-lg sticky top-0 z-30">
        <Link to="/" className="flex items-center gap-2">
          <KYJLogo size={28} />
          <span className="font-bold text-sm text-white">
            KnowYour<span className="text-amber-400">Job</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          {!user ? (
            <div className="flex items-center gap-1.5">
              <Link to="/auth/login" className="btn-glass px-2.5 py-1 rounded-lg text-xs font-semibold">
                Sign In
              </Link>
              <Link to="/auth/register" className="btn-yellow-gradient px-3 py-1 rounded-lg text-xs font-bold text-black shadow-sm">
                Get Started
              </Link>
            </div>
          ) : (
            <Link to="/dashboard/profile" title="Candidate Profile">
              <UserAvatar
                user={user}
                userDoc={userDoc}
                size="sm"
                roundedClassName="rounded-lg"
                showGoogleBadge={true}
              />
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-white/5 text-slate-300 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-[#000000]/98 backdrop-blur-2xl p-6 flex flex-col justify-between pt-20">
          <div>
            {/* User Profile Card in Mobile Drawer */}
            <Link
              to="/dashboard/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/10 mb-4"
            >
              <UserAvatar
                user={user}
                userDoc={userDoc}
                size="md"
                roundedClassName="rounded-xl"
                showGoogleBadge={true}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {userDoc?.displayName || user?.displayName || 'Candidate'}
                </p>
                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
              </div>
            </Link>

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
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsBugModalOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-amber-300 bg-amber-500/10 border border-amber-500/20"
            >
              <Bug className="w-4 h-4" />
              <span>Report a Bug</span>
            </button>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-rose-300 bg-rose-500/10 border border-rose-500/20"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 z-10">
        {/* Top bar with Breadcrumbs & Actions */}
        <div className="hidden md:flex items-center justify-between px-8 py-4 border-b border-white/10 bg-[#020202]/85 backdrop-blur-2xl shadow-[inset_0_-1px_0_0_rgba(255,255,255,0.06),0_10px_30px_rgba(0,0,0,0.6)] sticky top-0 z-20">
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>{pageTitle}</span>
            </h1>
            {pageSubtitle && <p className="text-xs text-slate-400 mt-0.5">{pageSubtitle}</p>}
          </div>

          <div className="flex items-center gap-3">
            {!user ? (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/jobs"
                  className="btn-glass px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-white/15 hover:border-amber-400/40 hover:text-amber-300 transition-all hover:scale-105 active:scale-95 shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Search size={13} className="text-amber-400" />
                  <span>All Jobs</span>
                </Link>
                <Link
                  to="/auth/login"
                  className="btn-glass px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-white/15 hover:border-amber-400/40 hover:text-amber-300 transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth/register"
                  className="btn-yellow-gradient px-4 py-1.5 rounded-xl text-black text-xs font-bold shadow-[0_0_20px_rgba(245,158,11,0.35)] hover:scale-105 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>Get Started</span>
                  <ChevronRight size={13} className="stroke-[3]" />
                </Link>
              </div>
            ) : (
              <>
                {/* Live Firestore Connection Status */}
                <div className="glossy-badge-emerald shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Firebase Cloud Live</span>
                </div>

                {/* Recruiter Indicator if authorized */}
                {isRecruiter && (
                  <div className="glossy-badge-gold shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>Recruiter Privileges Active</span>
                  </div>
                )}

                {/* Notifications quick button */}
                <button
                  onClick={() => showToast('All notifications are up to date.', 'info')}
                  className="p-2.5 rounded-xl liquid-glass border border-white/10 text-slate-300 hover:text-amber-400 hover:border-amber-400/40 transition cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                </button>

                {/* Candidate Profile Avatar Link */}
                <Link
                  to="/dashboard/profile"
                  className="p-1 rounded-xl liquid-glass border border-white/10 hover:border-amber-400/40 transition shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] flex items-center justify-center cursor-pointer group"
                  title="Candidate Profile"
                >
                  <UserAvatar
                    user={user}
                    userDoc={userDoc}
                    size="sm"
                    roundedClassName="rounded-lg"
                    showGoogleBadge={true}
                    border={false}
                    className="group-hover:scale-105 transition-transform"
                  />
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Page Content Body */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </div>
      </main>

      <SupportFAB onClick={() => setIsBugModalOpen(true)} />
      <ReportBugModal isOpen={isBugModalOpen} onClose={() => setIsBugModalOpen(false)} />
    </div>
  );
};
