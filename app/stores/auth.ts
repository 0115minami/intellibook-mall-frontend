import { defineStore } from 'pinia'
import type { User, LoginForm, RegisterForm } from '~/types/user'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '' as string,
    user: null as User | null,
    isLoading: false
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    userInfo: (state) => state.user
  },
  
  actions: {
    setToken(token: string) {
      this.token = token
      // 同步到 localStorage
      if (process.client) {
        localStorage.setItem('auth-token', token)
      }
    },
    
    setUser(user: User) {
      this.user = user
    },
    
    clearAuth() {
      this.token = ''
      this.user = null
      if (process.client) {
        localStorage.removeItem('auth-token')
      }
    },
    
    async login(form: LoginForm) {
      this.isLoading = true
      try {
        const { $api } = useNuxtApp()
        const response = await $api.post('/api/v1/user/login', form)
        
        this.setToken(response.token)
        this.setUser(response)
        
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
        const { $api } = useNuxtApp()
        await $api.post('/api/v1/user/register', form)
        
        return { success: true }
      } catch (error: any) {
        return { success: false, message: error.message }
      } finally {
        this.isLoading = false
      }
    },
    
    async logout() {
      try {
        const { $api } = useNuxtApp()
        await $api.post('/api/v1/user/logout')
      } catch (error) {
        // 忽略登出错误
      } finally {
        this.clearAuth()
      }
    },
    
    async fetchUserInfo() {
      if (!this.token) return
      
      try {
        const { $api } = useNuxtApp()
        const user = await $api.get('/api/v1/user/info')
        this.setUser(user)
      } catch (error) {
        // token 可能已过期
        this.clearAuth()
      }
    }
  }
})
