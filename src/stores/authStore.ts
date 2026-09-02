import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import type { AppUser } from '@/types'

interface AuthState {
  user: AppUser | null
  loading: boolean
  initialized: boolean
  setUser: (user: AppUser | null) => void
  setLoading: (loading: boolean) => void
  setInitialized: (initialized: boolean) => void
  clear: () => void
}

export const useAuthStore = create<AuthState>()(
  subscribeWithSelector((set) => ({
    user: null,
    loading: true,
    initialized: false,
    setUser: (user) => set({ user }),
    setLoading: (loading) => set({ loading }),
    setInitialized: (initialized) => set({ initialized }),
    clear: () => set({ user: null, loading: false }),
  }))
)
