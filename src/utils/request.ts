import axios, { type AxiosInstance } from 'axios'
import { message } from 'ant-design-vue'
import router from '@/router'
import type { ApiResponse } from '@/types/api'

// 创建 axios 实例
const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('auth-token')
    if (token) {
      // 后端期望 token 请求头，而不是 Authorization
      config.headers.token = token
    }

    // 添加请求ID用于调试
    if (window.crypto) {
      config.headers['X-Request-ID'] = crypto.randomUUID()
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const data: ApiResponse = response.data

    // 后端统一响应格式：{ resultCode, message, data }
    if (data.resultCode !== undefined) {
      if (data.resultCode === 200) {
        return data.data // 返回实际数据
      } else {
        // 业务错误
        message.error(data.message || '请求失败')
        return Promise.reject(new Error(data.message || '请求失败'))
      }
    }

    return data
  },
  (error) => {
    // HTTP 错误处理
    if (error.response) {
      const status = error.response.status
      const msg = error.response.data?.message || error.message

      switch (status) {
        case 401:
          message.error('请先登录')
          localStorage.removeItem('auth-token')
          router.push({ name: 'Login' })
          break
        case 403:
          message.error('权限不足')
          break
        case 404:
          message.error('请求的资源不存在')
          break
        case 500:
          message.error('服务器内部错误')
          break
        default:
          message.error(msg || `请求失败 (${status})`)
      }
    } else if (error.request) {
      message.error('网络连接失败，请检查网络设置')
    } else {
      message.error(error.message || '请求失败')
    }

    return Promise.reject(error)
  }
)

export default request
