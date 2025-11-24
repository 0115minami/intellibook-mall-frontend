import { defineStore } from 'pinia'
import type { User, LoginForm, RegisterForm } from '@/types/user'
import request from '@/utils/request'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '' as string,
    user: null as User | null,
    isLoading: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    userInfo: (state) => state.user,
  },

  actions: {
    setToken(token: string) {
      this.token = token
      localStorage.setItem('auth-token', token)
    },

    setUser(user: User) {
      this.user = user
      localStorage.setItem('auth-user', JSON.stringify(user))
    },

    clearAuth() {
      this.token = ''
      this.user = null
      localStorage.removeItem('auth-token')
      localStorage.removeItem('auth-user')
    },

    async login(form: LoginForm) {
      this.isLoading = true
      try {
        const data = await request.post<any, User>('/api/v1/user/login', form)

        this.setToken(data.token || '')
        this.setUser(data)

        return { success: true }
      } catch (error: any) {
        return { success: false, message: error.message }
      } finally {
        this.isLoading = false
      }
    },

    async register(form: RegisterForm) {
      this.isLoading = true
      try {
        await request.post('/api/v1/user/register', form)
        return { success: true }
      } catch (error: any) {
        return { success: false, message: error.message }
      } finally {
        this.isLoading = false
      }
    },

    async logout() {
      try {
        await request.post('/api/v1/user/logout')
      } catch (error) {
        // 忽略登出错误
      } finally {
        this.clearAuth()
      }
    },

    async fetchUserInfo() {
      if (!this.token) return

      try {
        const user = await request.get<any, User>('/api/v1/user/info')
        this.setUser(user)
      } catch (error) {
        // token 可能已过期
        this.clearAuth()
      }
    },
  },

})

// 手动持久化：从 localStorage 恢复状态
if (typeof window !== 'undefined') {
  const savedToken = localStorage.getItem('auth-token')
  const savedUser = localStorage.getItem('auth-user')
  
  if (savedToken && savedUser) {
    const authStore = useAuthStore()
    authStore.token = savedToken
    authStore.user = JSON.parse(savedUser)
  }
}
