# IntelliBook-Mall 前后端对接参考文档

## 概述

本文档基于已完成的后端API和前端架构设计，提供完整的前后端对接指南。

- **后端**：Spring Boot + MyBatis + SQLite
- **前端**：Nuxt 4 + Shadcn-vue + Tailwind CSS 4
- **认证**：JWT Token
- **API风格**：RESTful

## 目录

1. [API基础配置](#api基础配置)
2. [认证与授权](#认证与授权)
3. [模块对接指南](#模块对接指南)
4. [类型定义](#类型定义)
5. [错误处理](#错误处理)
6. [开发工具配置](#开发工具配置)

---

## API基础配置

### 1. 环境配置

#### .env 文件配置

```bash
# .env
# API 基础配置
NUXT_PUBLIC_API_BASE=http://localhost:8080
NUXT_PUBLIC_API_TIMEOUT=10000

# 应用配置
NUXT_PUBLIC_APP_NAME=IntelliBook Mall
NUXT_PUBLIC_APP_DESCRIPTION=智能电子书商城

# 文件服务配置
NUXT_PUBLIC_FILE_BASE=http://localhost:8080/files
NUXT_PUBLIC_COVER_BASE=http://localhost:8080/files/covers
NUXT_PUBLIC_EBOOK_BASE=http://localhost:8080/files/books

# 开发配置
NUXT_PUBLIC_DEBUG=true
```

#### Nuxt 配置

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8080',
      apiTimeout: parseInt(process.env.NUXT_PUBLIC_API_TIMEOUT || '10000'),
      fileBase: process.env.NUXT_PUBLIC_FILE_BASE || 'http://localhost:8080/files',
      coverBase: process.env.NUXT_PUBLIC_COVER_BASE || 'http://localhost:8080/files/covers',
      ebookBase: process.env.NUXT_PUBLIC_EBOOK_BASE || 'http://localhost:8080/files/books',
      debug: process.env.NUXT_PUBLIC_DEBUG === 'true'
    }
  }
})
```

### 2. API 客户端配置

#### 创建 API 插件

```typescript
// plugins/api.client.ts
import axios, { type AxiosInstance } from 'axios'

declare module '#app' {
  interface NuxtApp {
    $api: AxiosInstance
  }
}

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  // 创建 axios 实例
  const api = axios.create({
    baseURL: config.public.apiBase,
    timeout: config.public.apiTimeout,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  // 请求拦截器
  api.interceptors.request.use(
    (config) => {
      // 添加 JWT token
      if (authStore.token) {
        config.headers.Authorization = `Bearer ${authStore.token}`
      }
      
      // 添加请求ID用于调试
      if (process.client && window.crypto) {
        config.headers['X-Request-ID'] = crypto.randomUUID()
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
            authStore.clearAuth()
            navigateTo('/auth/login')
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
```

---

## 认证与授权

### 1. 认证状态管理

```typescript
// stores/auth.ts
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
    },
    
    setUser(user: User) {
      this.user = user
    },
    
    clearAuth() {
      this.token = ''
      this.user = null
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
  },
  
  persist: {
    storage: persistedState.localStorage,
    paths: ['token', 'user']
  }
})
```

### 2. 认证组合式函数

```typescript
// composables/useAuth.ts
export const useAuth = () => {
  const authStore = useAuthStore()
  const router = useRouter()
  const toast = useToast()

  const login = async (form: LoginForm) => {
    const result = await authStore.login(form)
    
    if (result.success) {
      toast.success('登录成功')
      
      // 获取重定向路径
      const route = useRoute()
      const redirect = route.query.redirect as string || '/'
      await router.push(redirect)
    } else {
      toast.error(result.message || '登录失败')
    }
    
    return result
  }

  const register = async (form: RegisterForm) => {
    const result = await authStore.register(form)
    
    if (result.success) {
      toast.success('注册成功，请登录')
      await router.push('/auth/login')
    } else {
      toast.error(result.message || '注册失败')
    }
    
    return result
  }

  const logout = async () => {
    await authStore.logout()
    toast.success('已退出登录')
    await router.push('/auth/login')
  }

  return {
    // 状态
    user: computed(() => authStore.user),
    isAuthenticated: computed(() => authStore.isAuthenticated),
    isLoading: computed(() => authStore.isLoading),
    
    // 方法
    login,
    register,
    logout
  }
}
```

### 3. 路由中间件

```typescript
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  
  if (!authStore.isAuthenticated) {
    return navigateTo({
      path: '/auth/login',
      query: { redirect: to.fullPath }
    })
  }
})
```

---

## 模块对接指南

### 1. 用户模块

#### 类型定义

```typescript
// types/user.ts
export interface User {
  userId: number
  loginName: string
  nickName: string
  email: string
  introduceSign?: string
  lockedFlag: 0 | 1
  createTime: string
  token?: string
}

export interface LoginForm {
  loginName: string
  password: string
}

export interface RegisterForm {
  loginName: string
  nickName: string
  email: string
  password: string
  confirmPassword: string
}

export interface UserProfile {
  nickName: string
  email: string
  introduceSign?: string
}
```

#### API 组合式函数

```typescript
// composables/useUserApi.ts
export const useUserApi = () => {
  const { $api } = useNuxtApp()
  
  return {
    // 获取用户信息
    getUserInfo: () => $api.get('/api/v1/user/info'),
    
    // 更新用户信息
    updateProfile: (profile: UserProfile) => 
      $api.put('/api/v1/user/info', profile),
    
    // 修改密码
    changePassword: (data: { oldPassword: string; newPassword: string }) =>
      $api.put('/api/v1/user/password', data)
  }
}
```

### 2. 电子书模块

#### 类型定义

```typescript
// types/ebook.ts
export interface EBook {
  bookId: number
  bookTitle: string
  author: string
  isbn?: string
  publisher?: string
  publishDate?: string
  bookIntro: string
  categoryId: number
  categoryName?: string
  coverImg: string
  fileFormat: 'PDF' | 'EPUB' | 'MOBI'
  filePath: string
  fileSize: number
  pageCount: number
  originalPrice: number
  sellingPrice: number
  tags: string
  avgRating: number
  ratingCount: number
  sellStatus: 0 | 1
  createTime: string
  updateTime: string
}

export interface EBookSearchParam {
  keyword?: string
  author?: string
  isbn?: string
  categoryId?: number
  tagIds?: number[]
  minPrice?: number
  maxPrice?: number
  startYear?: number
  endYear?: number
  sortBy?: 'price' | 'rating' | 'date' | 'sales'
  sortOrder?: 'asc' | 'desc'
  pageNumber: number
  pageSize: number
}

export interface EBookCategory {
  categoryId: number
  categoryLevel: number
  parentId: number
  categoryName: string
  categoryRank: number
  children?: EBookCategory[]
}

export interface PageResult<T> {
  list: T[]
  totalCount: number
  pageNum: number
  pageSize: number
  totalPages: number
}
```

#### API 组合式函数

```typescript
// composables/useEBookApi.ts
export const useEBookApi = () => {
  const { $api } = useNuxtApp()
  
  return {
    // 获取电子书列表
    getEBooks: (params: Partial<EBookSearchParam>) =>
      $api.get('/api/ebooks/list', { params }),
    
    // 搜索电子书
    searchEBooks: (params: EBookSearchParam) =>
      $api.get('/api/ebooks/search', { params }),
    
    // 获取电子书详情
    getEBookDetail: (id: number) =>
      $api.get(`/api/ebooks/${id}`),
    
    // 获取分类列表
    getCategories: () =>
      $api.get('/api/categories'),
    
    // 获取分类下的电子书
    getEBooksByCategory: (categoryId: number, params: any) =>
      $api.get(`/api/categories/${categoryId}/ebooks`, { params }),
    
    // 获取推荐电子书
    getRecommendations: (params: any) =>
      $api.get('/api/ebooks/recommendations', { params })
  }
}
```

### 3. 购物车模块

#### 类型定义

```typescript
// types/cart.ts
export interface CartItem {
  bookId: number
  bookTitle: string
  author: string
  coverImg: string
  sellingPrice: number
  addedAt: string
}
```

#### API 组合式函数

```typescript
// composables/useCartApi.ts
export const useCartApi = () => {
  const { $api } = useNuxtApp()
  
  return {
    // 获取购物车列表
    getCartItems: () =>
      $api.get('/api/cart/list'),
    
    // 添加到购物车
    addToCart: (bookId: number) =>
      $api.post('/api/cart/add', { bookId }),
    
    // 从购物车移除
    removeFromCart: (bookId: number) =>
      $api.delete(`/api/cart/remove/${bookId}`),
    
    // 清空购物车
    clearCart: () =>
      $api.delete('/api/cart/clear')
  }
}
```

### 4. 订单模块

#### 类型定义

```typescript
// types/order.ts
export interface Order {
  orderId: number
  orderNo: string
  userId: number
  totalPrice: number
  payStatus: number
  payType: number
  payTime?: string
  orderStatus: number
  extraInfo?: string
  createTime: string
  updateTime: string
  orderItems: OrderItem[]
}

export interface OrderItem {
  orderItemId: number
  orderId: number
  bookId: number
  bookTitle: string
  author: string
  coverImg: string
  sellingPrice: number
}

export interface CreateOrderParam {
  bookIds: number[]
}
```

#### API 组合式函数

```typescript
// composables/useOrderApi.ts
export const useOrderApi = () => {
  const { $api } = useNuxtApp()
  
  return {
    // 创建订单
    createOrder: (params: CreateOrderParam) =>
      $api.post('/api/order/create', params),
    
    // 立即购买
    buyNow: (bookId: number) =>
      $api.post(`/api/order/buy-now/${bookId}`),
    
    // 获取订单列表
    getOrders: (params: any) =>
      $api.get('/api/order/list', { params }),
    
    // 获取订单详情
    getOrderDetail: (orderId: number) =>
      $api.get(`/api/order/detail/${orderId}`),
    
    // 支付订单
    payOrder: (orderId: number, payType: number) =>
      $api.put(`/api/order/pay/${orderId}`, { payType }),
    
    // 取消订单
    cancelOrder: (orderId: number) =>
      $api.put(`/api/order/cancel/${orderId}`)
  }
}
```

### 5. 收藏模块

```typescript
// composables/useFavoriteApi.ts
export const useFavoriteApi = () => {
  const { $api } = useNuxtApp()
  
  return {
    // 获取收藏列表
    getFavorites: (params: any) =>
      $api.get('/api/favorite/list', { params }),
    
    // 添加收藏
    addFavorite: (bookId: number) =>
      $api.post('/api/favorite/add', { bookId }),
    
    // 取消收藏
    removeFavorite: (bookId: number) =>
      $api.delete(`/api/favorite/remove/${bookId}`),
    
    // 检查是否已收藏
    checkFavorite: (bookId: number) =>
      $api.get(`/api/favorite/check/${bookId}`)
  }
}
```

### 6. 评价模块

#### 类型定义

```typescript
// types/review.ts
export interface Review {
  reviewId: number
  userId: number
  username: string
  nickname: string
  bookId: number
  bookTitle: string
  rating: number
  content: string
  likeCount: number
  isLiked: boolean
  createTime: string
}

export interface CreateReviewParam {
  bookId: number
  rating: number
  content?: string
}
```

#### API 组合式函数

```typescript
// composables/useReviewApi.ts
export const useReviewApi = () => {
  const { $api } = useNuxtApp()
  
  return {
    // 创建评价
    createReview: (params: CreateReviewParam) =>
      $api.post('/api/review/create', params),
    
    // 获取书籍评价列表
    getBookReviews: (bookId: number, params: any) =>
      $api.get(`/api/review/book/${bookId}`, { params }),
    
    // 获取我的评价列表
    getMyReviews: (params: any) =>
      $api.get('/api/review/my', { params }),
    
    // 更新评价
    updateReview: (reviewId: number, params: CreateReviewParam) =>
      $api.put(`/api/review/update/${reviewId}`, params),
    
    // 删除评价
    deleteReview: (reviewId: number) =>
      $api.delete(`/api/review/delete/${reviewId}`),
    
    // 点赞评价
    likeReview: (reviewId: number) =>
      $api.post(`/api/review/like/${reviewId}`),
    
    // 取消点赞
    unlikeReview: (reviewId: number) =>
      $api.delete(`/api/review/unlike/${reviewId}`),
    
    // 检查是否已评价
    checkReviewed: (bookId: number) =>
      $api.get(`/api/review/check/${bookId}`)
  }
}
```

---

## 错误处理

### 全局错误处理

```typescript
// plugins/error-handler.client.ts
export default defineNuxtPlugin(() => {
  const toast = useToast()

  // 处理未捕获的错误
  window.addEventListener('unhandledrejection', (event) => {
    console.error('未处理的Promise拒绝:', event.reason)
    
    if (event.reason?.message) {
      toast.error(event.reason.message)
    } else {
      toast.error('发生未知错误')
    }
  })

  // 处理Vue错误
  const vueApp = useNuxtApp().vueApp
  vueApp.config.errorHandler = (error, instance, info) => {
    console.error('Vue错误:', error, info)
    toast.error('页面发生错误，请刷新重试')
  }
})
```

---

## 开发工具配置

### 开发环境代理配置

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  // 开发服务器配置
  devServer: {
    port: 3000
  },
  
  // Nitro配置（用于代理）
  nitro: {
    devProxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        prependPath: true
      },
      '/files': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        prependPath: true
      }
    }
  }
})
```

---

## 总结

这份前后端对接文档提供了：

1. **完整的API配置** - 环境变量、axios配置、错误处理
2. **认证授权方案** - JWT token管理、路由守卫
3. **模块化对接** - 每个业务模块的类型定义和API封装
4. **状态管理** - Pinia store的最佳实践
5. **错误处理** - 统一的错误处理机制
6. **开发工具** - 调试工具、代理配置

### 建议开发顺序

1. 用户认证模块
2. 电子书展示模块
3. 购物车和订单模块
4. 收藏和评价模块
5. 个人中心模块

每个模块都可以独立开发和测试，最后整合成完整的应用。
