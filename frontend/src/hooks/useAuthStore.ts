import { create } from 'zustand'
import { authApi } from '@/utils/api'

interface User {
  id: string
  email: string
  username: string
  full_name: string
  role: string
  is_verified: boolean
}

interface AuthState {
  user: User | null
  accessToken: string | null
  isLoading: boolean
  error: string | null

  login: (identifier: string, password: string) => Promise<void>
  register: (email: string, username: string, password: string, fullName?: string) => Promise<void>
  logout: () => void
  clearError: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: localStorage.getItem('access_token'),
  isLoading: false,
  error: null,

  login: async (identifier, password) => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await authApi.login({ identifier, password })
      localStorage.setItem('access_token', data.access_token)
      localStorage.setItem('refresh_token', data.refresh_token)
      set({ user: data.user, accessToken: data.access_token, isLoading: false })
    } catch (err: any) {
      set({
        error: err.response?.data?.error || 'Login failed',
        isLoading: false
      })
    }
  },

  register: async (email, username, password, fullName) => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await authApi.register({ email, username, password, fullName })
      localStorage.setItem('access_token', data.access_token)
      localStorage.setItem('refresh_token', data.refresh_token)
      set({ user: data.user, accessToken: data.access_token, isLoading: false })
    } catch (err: any) {
      set({
        error: err.response?.data?.error || 'Registration failed',
        isLoading: false
      })
    }
  },

  logout: () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    set({ user: null, accessToken: null })
  },

  clearError: () => set({ error: null }),
}))
