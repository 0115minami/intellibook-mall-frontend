import { defineStore } from 'pinia'
import type { User, LoginForm, RegisterForm } from '@/types/user'
import request from '@/utils/request'

export const useAuthStore = defineStore('auth', {
  state: () => {
    // 从 localStorage 恢复状态
    const savedToken = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : ''
    const savedUser = typeof window !== 'undefined' ? localStorage.getItem('auth-user') : null
    
    return {
      token: savedToken || '',
      user: savedUser ? JSON.parse(savedUser) : null,
      isLoading: false,
    }
  },

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    userInfo: (state) => state.user,
    isAdmin: (state) => {
      if (!state.user) return false
      // 处理各种可能的值：1, "1", true
      const adminValue = state.user.isAdmin
      return adminValue === 1 || adminValue === '1' || adminValue === true
    },
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
        const data = await request.post<any, any>('/api/v1/user/login', form)

        // 调试日志
        console.log('Login response data:', data)

        // 提取 token
        const token = data.token || ''
        if (!token) {
          throw new Error('登录失败：未获取到token')
        }
        
        this.setToken(token)

        // 登录成功后获取用户信息
        try {
          await this.fetchUserInfo()
        } catch (error) {
          console.error('获取用户信息失败:', error)
          // 如果获取用户信息失败，清除token
          this.clearAuth()
          throw new Error('获取用户信息失败')
        }

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
        console.log('Calling logout API...')
        await request.post('/api/v1/user/logout')
        console.log('Logout API call successful')
      } catch (error) {
        console.error('Logout API error:', error)
        // 忽略登出错误
      } finally {
        console.log('Clearing auth...')
        this.clearAuth()
        console.log('Auth cleared, isAuthenticated:', this.isAuthenticated)
      }
    },

    async fetchUserInfo() {
      if (!this.token) return

      try {
        console.log('Fetching user info with token:', this.token)
        const user = await request.get<any, User>('/api/v1/user/info')
        console.log('User info response:', user)
        this.setUser(user)
        console.log('User set, isAdmin:', this.isAdmin)
      } catch (error) {
        console.error('Fetch user info error:', error)
        // token 可能已过期
        this.clearAuth()
        throw error
      }
    },
  },
})
