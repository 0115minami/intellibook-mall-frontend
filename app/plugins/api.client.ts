import axios, { type AxiosInstance } from 'axios'

declare module '#app' {
  interface NuxtApp {
    $api: AxiosInstance
  }
}

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  // 创建 axios 实例
  const api = axios.create({
    baseURL: config.public.apiBase as string,
    timeout: config.public.apiTimeout as number,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  // 请求拦截器
  api.interceptors.request.use(
    (config) => {
      // 从 localStorage 获取 token（后续会通过 Pinia store 管理）
      if (import.meta.client) {
        const token = localStorage.getItem('auth-token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        
        // 添加请求ID用于调试
        if (typeof window !== 'undefined' && window.crypto) {
          config.headers['X-Request-ID'] = crypto.randomUUID()
        }
      }
      
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // 响应拦截器
  api.interceptors.response.use(
    (response) => {
      // 统一处理响应格式
      const data = response.data
      
      // 后端统一响应格式：{ resultCode, message, data }
      if (data.resultCode !== undefined) {
        if (data.resultCode === 200) {
          return data.data // 返回实际数据
        } else {
          // 业务错误
          throw new Error(data.message || '请求失败')
        }
      }
      
      return data
    },
    (error) => {
      // HTTP 错误处理
      if (error.response) {
        const status = error.response.status
        const message = error.response.data?.message || error.message
        
        switch (status) {
          case 401:
            // 未授权，清除token并跳转登录
            if (import.meta.client) {
              localStorage.removeItem('auth-token')
              navigateTo('/auth/login')
            }
            throw new Error('请先登录')
          case 403:
            throw new Error('权限不足')
          case 404:
            throw new Error('请求的资源不存在')
          case 500:
            throw new Error('服务器内部错误')
          default:
            throw new Error(message || `请求失败 (${status})`)
        }
      } else if (error.request) {
        // 网络错误
        throw new Error('网络连接失败，请检查网络设置')
      } else {
        throw new Error(error.message || '请求失败')
      }
    }
  )

  return {
    provide: {
      api
    }
  }
})
