import { create } from 'zustand'
import type { AppNotification, AutomationSettings, JobPreferences } from '@/types'

// Convenient re-export alias: callers can import `Notification` from this module
export type { AppNotification as Notification }

interface AppState {
  // ── Sidebar ────────────────────────────────────────────────────────────────
  sidebarCollapsed: boolean
  toggleSidebar: () => void

  // ── Notifications ──────────────────────────────────────────────────────────
  notifications: AppNotification[]
  unreadCount: number
  setNotifications: (n: AppNotification[]) => void
  markAsRead: (id: string) => void

  // ── Job Preferences ────────────────────────────────────────────────────────
  preferences: JobPreferences | null
  setPreferences: (p: JobPreferences) => void

  // ── Automation Settings ────────────────────────────────────────────────────
  automationSettings: AutomationSettings | null
  setAutomationSettings: (s: AutomationSettings) => void

  // ── Onboarding ─────────────────────────────────────────────────────────────
  onboardingStep: number
  setOnboardingStep: (step: number) => void
}

export const useAppStore = create<AppState>()((set) => ({
  // Sidebar
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  // Notifications
  notifications: [],
  unreadCount: 0,
  setNotifications: (notifications) =>
    set({ notifications, unreadCount: notifications.filter((n) => !n.read).length }),
  markAsRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, s.unreadCount - 1),
    })),

  // Job Preferences
  preferences: null,
  setPreferences: (preferences) => set({ preferences }),

  // Automation Settings
  automationSettings: null,
  setAutomationSettings: (automationSettings) => set({ automationSettings }),

  // Onboarding
  onboardingStep: 1,
  setOnboardingStep: (onboardingStep) => set({ onboardingStep }),
}))
