# IntelliBook-Mall 前端架构文档

## 概述

IntelliBook-Mall 前端采用现代化的 Vue 3 生态系统，使用 Nuxt 4 作为核心框架，结合 Shadcn-vue 组件库和 Tailwind CSS v4 构建高性能、SEO 友好的电子书商城web应用。

> **版本说明**：本文档推荐使用最新稳定版本，但版本号仅供参考。请根据项目实际需求、团队技术栈熟悉度和生产环境稳定性要求选择合适的版本。如需使用更保守的版本（如 Nuxt 3.x + Tailwind CSS 3.x），可参考官方迁移指南进行调整。

### 技术栈

| 技术 | 推荐版本 | 用途 | 备注 |
|------|---------|------|------|
| **Nuxt.js** | 4.x (最新) | SSR 框架、文件路由、自动导入 | 支持新的 app/ 目录结构，更快的 CLI |
| **Vue.js** | 3.5+ | 渐进式 JavaScript 框架 | 随 Nuxt 4 自动安装 |
| **Pinia** | 2.x | 状态管理 | 官方推荐状态管理方案 |
| **Tailwind CSS** | 4.x (最新) | 原子化 CSS 框架 | 使用 @tailwindcss/vite 插件 |
| **Shadcn-vue** | Latest | UI 组件库（基于 Reka UI） | 使用 shadcn-nuxt 模块 |
| **TypeScript** | 5.x | 类型安全 | Nuxt 4 改进了 TS 项目分离 |
| **VueUse** | 12.x+ | Vue 组合式工具集 | 提供丰富的组合式函数 |
| **PDF.js** | 3.11+ | PDF 在线阅读 | Mozilla 官方 PDF 渲染库 |
| **Epub.js** | 0.3+ | EPUB 在线阅读 | 电子书阅读器核心库 |

### 版本选择建议

**推荐配置（最新技术栈）**：
- Nuxt 4.x + Tailwind CSS 4.x + Shadcn-nuxt 2.x
- 优势：最新特性、更好的性能、改进的开发体验
- 适合：新项目、追求最新技术的团队

**稳定配置（保守方案）**：
- Nuxt 3.14+ + Tailwind CSS 3.4+ + Shadcn-nuxt 0.10+
- 优势：生态更成熟、社区资源丰富、问题解决方案多
- 适合：生产环境要求高、团队经验有限的项目

### 核心特性

- ✅ **服务端渲染 (SSR)**：首屏快速加载，SEO 优化
- ✅ **文件路由系统**：基于文件结构自动生成路由
- ✅ **自动导入**：组件、组合式函数、工具函数自动导入
- ✅ **类型安全**：完整的 TypeScript 支持，Nuxt 4 改进了项目级类型分离
- ✅ **响应式设计**：移动端优先，适配多种设备
- ✅ **代码分割**：按需加载，优化性能
- ✅ **PWA 支持**：可安装为桌面应用
- ✅ **零配置内容检测**：Nuxt 4 自动发现模板文件（Tailwind CSS 4）
- ✅ **原生 CSS 层级**：使用 @layer 规则解决样式优先级问题
- ✅ **更快的构建**：Nuxt 4 优化了 CLI 和开发服务器性能

### Nuxt 4 新特性亮点

1. **新的 app/ 目录结构**：将应用代码与配置分离，提升文件监听性能
2. **改进的数据获取**：useAsyncData 和 useFetch 支持自动数据共享和清理
3. **更好的 TypeScript 体验**：为 app、server、shared 创建独立的 TS 项目
4. **更快的 CLI**：使用内部 socket 通信，减少网络开销
5. **向后兼容**：自动检测并支持 Nuxt 3 的目录结构

### Tailwind CSS 4 新特性

1. **统一工具链**：内置 @import、vendor prefixing、nesting 支持
2. **原生 CSS 层级**：使用真实的 @layer 规则
3. **零配置**：自动发现模板文件，无需配置 content 路径
4. **更快的构建**：使用 Rust 重写核心部分，性能提升 10 倍
5. **现代 CSS 特性**：支持 color-mix、@property、容器查询等

## 项目结构

> **注意**：Nuxt 4 引入了新的 `app/` 目录结构，将应用代码与配置文件分离。如果使用 Nuxt 3，可以保持原有的根目录结构。Nuxt 会自动检测并兼容两种结构。

### Nuxt 4 推荐结构（app/ 目录）

```
intellibook-mall-frontend/
├── .nuxt/                      # Nuxt 构建输出（自动生成，不提交）
├── .output/                    # 生产构建输出
├── app/                        # 应用代码目录（Nuxt 4 新增）
│   ├── assets/                # 静态资源
│   │   ├── css/
│   │   │   └── main.css      # Tailwind CSS 入口
│   │   ├── images/           # 图片资源
│   │   └── fonts/            # 字体文件
│   ├── components/            # 组件目录
│   ├── ui/                    # Shadcn-vue 组件（CLI 生成）
│   │   ├── button/
│   │   │   └── Button.vue
│   │   ├── card/
│   │   │   ├── Card.vue
│   │   │   ├── CardHeader.vue
│   │   │   ├── CardContent.vue
│   │   │   └── CardFooter.vue
│   │   ├── input/
│   │   ├── dialog/
│   │   ├── dropdown-menu/
│   │   └── ...                # 其他 UI 组件
│   │   ├── ebook/                 # 电子书相关组件
│   │   │   ├── EBookCard.vue      # 电子书卡片
│   │   │   ├── EBookList.vue      # 电子书列表
│   │   │   ├── EBookDetail.vue    # 电子书详情
│   │   │   ├── EBookSearch.vue    # 搜索组件
│   │   │   └── EBookFilter.vue    # 筛选组件
│   │   ├── reader/                # 阅读器组件
│   │   │   ├── PDFReader.vue      # PDF 阅读器
│   │   │   ├── EPUBReader.vue     # EPUB 阅读器
│   │   │   ├── ReaderToolbar.vue  # 阅读器工具栏
│   │   │   └── ReaderProgress.vue # 阅读进度
│   │   ├── cart/                  # 购物车组件
│   │   │   ├── CartItem.vue       # 购物车项
│   │   │   ├── CartSummary.vue    # 购物车汇总
│   │   │   └── CartDrawer.vue     # 购物车抽屉
│   │   ├── order/                 # 订单组件
│   │   │   ├── OrderCard.vue      # 订单卡片
│   │   │   ├── OrderList.vue      # 订单列表
│   │   │   └── OrderDetail.vue    # 订单详情
│   │   ├── user/                  # 用户相关组件
│   │   │   ├── UserProfile.vue    # 用户资料
│   │   │   ├── UserAvatar.vue     # 用户头像
│   │   │   └── UserMenu.vue       # 用户菜单
│   │   ├── common/                # 通用组件
│   │   │   ├── AppHeader.vue      # 页头
│   │   │   ├── AppFooter.vue      # 页脚
│   │   │   ├── AppNav.vue         # 导航栏
│   │   │   ├── Breadcrumb.vue     # 面包屑
│   │   │   ├── Pagination.vue     # 分页
│   │   │   ├── Loading.vue        # 加载动画
│   │   │   └── Empty.vue          # 空状态
│   │   └── recommendation/        # 推荐组件
│   │       ├── RecommendList.vue  # 推荐列表
│   │       └── HotBooks.vue       # 热门书籍
│   ├── composables/               # 组合式函数
│   │   ├── useAuth.ts            # 认证相关
│   │   ├── useEBook.ts           # 电子书相关
│   │   ├── useCart.ts            # 购物车相关
│   │   ├── useOrder.ts           # 订单相关
│   │   ├── useReading.ts         # 阅读相关
│   │   ├── useRecommendation.ts  # 推荐相关
│   │   ├── useUser.ts            # 用户相关
│   │   ├── useToast.ts           # 提示消息
│   │   └── useApi.ts             # API 请求封装
│   ├── layouts/                   # 布局组件
│   │   ├── default.vue           # 默认布局
│   │   ├── reader.vue            # 阅读器布局（全屏）
│   │   ├── user.vue              # 用户中心布局
│   │   └── auth.vue              # 认证页面布局
│   ├── middleware/                # 路由中间件
│   │   ├── auth.ts               # 认证中间件
│   │   ├── guest.ts              # 访客中间件（已登录跳转）
│   │   └── reading-permission.ts # 阅读权限中间件
│   ├── pages/                     # 页面目录（文件路由）
│   │   ├── index.vue             # 首页
│   │   ├── ebooks/               # 电子书相关页面
│   │   │   ├── index.vue         # 电子书列表
│   │   │   ├── [id].vue          # 电子书详情
│   │   │   └── search.vue        # 搜索结果
│   │   ├── categories/           # 分类页面
│   │   │   └── [id].vue          # 分类详情
│   │   ├── reading/              # 阅读页面
│   │   │   └── [id].vue          # 在线阅读
│   │   ├── cart.vue              # 购物车
│   │   ├── checkout.vue          # 结算页面
│   │   ├── orders/               # 订单页面
│   │   │   ├── index.vue         # 订单列表
│   │   │   └── [id].vue          # 订单详情
│   │   ├── user/                 # 用户中心
│   │   │   ├── index.vue         # 个人中心首页
│   │   │   ├── profile.vue       # 个人资料
│   │   │   ├── library.vue       # 我的书库
│   │   │   ├── favorites.vue     # 我的收藏
│   │   │   └── reading-history.vue # 阅读历史
│   │   ├── auth/                 # 认证页面
│   │   │   ├── login.vue         # 登录
│   │   │   ├── register.vue      # 注册
│   │   │   └── forgot-password.vue # 忘记密码
│   │   └── about.vue             # 关于我们
│   ├── plugins/                   # 插件
│   │   ├── api.ts                # API 插件（Axios 封装）
│   │   ├── pdfjs.client.ts       # PDF.js 初始化（客户端）
│   │   ├── epubjs.client.ts      # Epub.js 初始化（客户端）
│   │   ├── ssr-width.ts          # SSR 宽度插件（Nuxt 4 必需）
│   │   └── toast.ts              # Toast 提示插件
│   ├── utils/                     # 工具函数
│   │   ├── format.ts             # 格式化工具
│   │   ├── validate.ts           # 验证工具
│   │   ├── storage.ts            # 本地存储工具
│   │   └── constants.ts          # 常量定义
│   ├── app.vue                    # 应用根组件
│   └── app.config.ts             # 应用配置（可选）
├── content/                       # Nuxt Content 内容目录（可选）
├── public/                        # 公共静态文件
│   ├── favicon.ico
│   ├── robots.txt
│   └── manifest.json             # PWA 配置
├── server/                        # 服务端目录
│   ├── api/                      # 服务端 API（代理）
│   └── middleware/               # 服务端中间件
├── shared/                        # 共享代码目录（Nuxt 4 新增）
│   └── types/                    # 共享类型定义
├── stores/                        # Pinia 状态管理
│   ├── auth.ts                   # 认证状态
│   ├── cart.ts                   # 购物车状态
│   ├── ebook.ts                  # 电子书状态
│   ├── user.ts                   # 用户状态
│   ├── reading.ts                # 阅读状态
│   └── ui.ts                     # UI 状态（主题、侧边栏等）
├── types/                         # TypeScript 类型定义（应用层）
│   ├── api.ts                    # API 响应类型
│   ├── ebook.ts                  # 电子书类型
│   ├── user.ts                   # 用户类型
│   ├── order.ts                  # 订单类型
│   └── index.ts                  # 导出所有类型
├── .env                           # 环境变量
├── .env.example                  # 环境变量示例
├── .gitignore
├── components.json               # Shadcn-vue 配置
├── nuxt.config.ts                # Nuxt 配置
├── package.json
├── tailwind.config.ts            # Tailwind 配置（可选，v4 可省略）
├── tsconfig.json                 # TypeScript 配置
└── README.md
```


## 核心目录详解

### 1. pages/ - 页面路由

Nuxt 3 使用基于文件的路由系统，`pages/` 目录中的文件会自动生成路由。

#### 路由规则

| 文件路径 | 生成路由 | 说明 |
|---------|---------|------|
| `pages/index.vue` | `/` | 首页 |
| `pages/ebooks/index.vue` | `/ebooks` | 电子书列表 |
| `pages/ebooks/[id].vue` | `/ebooks/:id` | 电子书详情（动态路由） |
| `pages/ebooks/search.vue` | `/ebooks/search` | 搜索页面 |
| `pages/user/profile.vue` | `/user/profile` | 用户资料 |
| `pages/reading/[id].vue` | `/reading/:id` | 在线阅读 |

#### 页面组织原则

1. **按功能模块分组**：相关页面放在同一目录下
2. **使用动态路由**：`[id].vue` 表示动态参数
3. **嵌套路由**：使用文件夹嵌套实现路由嵌套
4. **命名规范**：使用 kebab-case 命名

#### 示例：电子书详情页

```vue
<!-- pages/ebooks/[id].vue -->
<script setup lang="ts">
// 自动导入，无需 import
const route = useRoute()
const { data: ebook, pending } = await useEBook(route.params.id as string)

// SEO 优化
useSeoMeta({
  title: () => ebook.value?.bookTitle || '电子书详情',
  description: () => ebook.value?.bookIntro || '',
  ogImage: () => ebook.value?.coverImg || ''
})

// 定义布局
definePageMeta({
  layout: 'default',
  middleware: [] // 可选的中间件
})
</script>

<template>
  <div class="container mx-auto py-8">
    <Loading v-if="pending" />
    <EBookDetail v-else :ebook="ebook" />
  </div>
</template>
```

### 2. components/ - 组件目录

组件会被自动导入，无需手动 import。

#### 组件组织策略

**1. ui/ - Shadcn-vue 组件**
- 使用 CLI 生成：`npx shadcn-vue@latest add button`
- 可自定义修改
- 保持组件的原子性

**2. 功能模块组件**
- `ebook/` - 电子书相关
- `reader/` - 阅读器相关
- `cart/` - 购物车相关
- `order/` - 订单相关
- `user/` - 用户相关

**3. common/ - 通用组件**
- 跨模块使用的组件
- 布局组件（Header、Footer）
- 工具组件（Loading、Empty）

#### 命名规范

```
组件名使用 PascalCase
文件名使用 PascalCase.vue

示例：
- EBookCard.vue
- UserProfile.vue
- AppHeader.vue
```

#### 示例：电子书卡片组件

```vue
<!-- components/ebook/EBookCard.vue -->
<script setup lang="ts">
import type { EBook } from '~/types/ebook'

interface Props {
  ebook: EBook
  showActions?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showActions: true
})

const { addToCart } = useCart()
const { toggleFavorite, isFavorited } = useUser()

const handleAddToCart = async () => {
  await addToCart(props.ebook.bookId)
}
</script>

<template>
  <Card class="hover:shadow-lg transition-shadow">
    <CardContent class="p-4">
      <NuxtLink :to="`/ebooks/${ebook.bookId}`">
        <img 
          :src="ebook.coverImg" 
          :alt="ebook.bookTitle"
          class="w-full h-48 object-cover rounded-md mb-4"
        />
      </NuxtLink>
      
      <h3 class="font-semibold text-lg mb-2 line-clamp-2">
        {{ ebook.bookTitle }}
      </h3>
      
      <p class="text-sm text-muted-foreground mb-2">
        {{ ebook.author }}
      </p>
      
      <div class="flex items-center justify-between">
        <span class="text-lg font-bold text-primary">
          ¥{{ (ebook.sellingPrice / 100).toFixed(2) }}
        </span>
        
        <div v-if="showActions" class="flex gap-2">
          <Button 
            size="sm" 
            variant="ghost"
            @click="toggleFavorite(ebook.bookId)"
          >
            <Icon 
              :name="isFavorited(ebook.bookId) ? 'mdi:heart' : 'mdi:heart-outline'" 
              class="w-5 h-5"
            />
          </Button>
          
          <Button size="sm" @click="handleAddToCart">
            加入购物车
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
```

### 3. composables/ - 组合式函数

可复用的逻辑封装，自动导入。

#### 组织原则

1. **按功能模块划分**：每个模块一个文件
2. **命名规范**：使用 `use` 前缀
3. **返回值规范**：返回响应式数据和方法
4. **类型安全**：完整的 TypeScript 类型定义

#### 示例：useEBook.ts

```typescript
// composables/useEBook.ts
import type { EBook, EBookSearchParam } from '~/types/ebook'

export const useEBook = () => {
  const config = useRuntimeConfig()
  
  // 获取电子书详情
  const getEBookDetail = async (id: string | number) => {
    return await useFetch<EBook>(`/api/v1/ebooks/${id}`, {
      baseURL: config.public.apiBase
    })
  }
  
  // 搜索电子书
  const searchEBooks = async (params: EBookSearchParam) => {
    return await useFetch<{ list: EBook[], total: number }>('/api/v1/ebooks/search', {
      baseURL: config.public.apiBase,
      params
    })
  }
  
  // 获取推荐电子书
  const getRecommendations = async (limit: number = 10) => {
    return await useFetch<EBook[]>('/api/v1/recommendations/personal', {
      baseURL: config.public.apiBase,
      params: { limit }
    })
  }
  
  return {
    getEBookDetail,
    searchEBooks,
    getRecommendations
  }
}

// 简化版本 - 直接获取单本电子书
export const useEBookDetail = (id: string | number) => {
  const config = useRuntimeConfig()
  
  return useFetch<EBook>(`/api/v1/ebooks/${id}`, {
    baseURL: config.public.apiBase,
    key: `ebook-${id}` // 缓存 key
  })
}
```

#### 示例：useAuth.ts

```typescript
// composables/useAuth.ts
import type { User, LoginForm, RegisterForm } from '~/types/user'

export const useAuth = () => {
  const authStore = useAuthStore()
  const router = useRouter()
  const toast = useToast()
  
  // 登录
  const login = async (form: LoginForm) => {
    try {
      const { data, error } = await useFetch('/api/v1/user/login', {
        method: 'POST',
        body: form
      })
      
      if (error.value) {
        toast.error('登录失败：' + error.value.message)
        return false
      }
      
      // 保存 token 和用户信息
      authStore.setToken(data.value.data.token)
      authStore.setUser(data.value.data.user)
      
      toast.success('登录成功')
      return true
    } catch (err) {
      toast.error('登录失败')
      return false
    }
  }
  
  // 注册
  const register = async (form: RegisterForm) => {
    try {
      const { data, error } = await useFetch('/api/v1/user/register', {
        method: 'POST',
        body: form
      })
      
      if (error.value) {
        toast.error('注册失败：' + error.value.message)
        return false
      }
      
      toast.success('注册成功，请登录')
      router.push('/auth/login')
      return true
    } catch (err) {
      toast.error('注册失败')
      return false
    }
  }
  
  // 登出
  const logout = async () => {
    await useFetch('/api/v1/user/logout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })
    
    authStore.clearAuth()
    router.push('/auth/login')
    toast.success('已退出登录')
  }
  
  // 检查登录状态
  const checkAuth = () => {
    return !!authStore.token && !!authStore.user
  }
  
  return {
    login,
    register,
    logout,
    checkAuth,
    user: computed(() => authStore.user),
    isAuthenticated: computed(() => checkAuth())
  }
}
```

### 4. stores/ - Pinia 状态管理

集中管理应用状态。

#### 组织原则

1. **按功能模块划分**：每个模块一个 store
2. **命名规范**：使用 `use[Name]Store` 格式
3. **状态最小化**：只存储必要的全局状态
4. **持久化**：使用 `pinia-plugin-persistedstate` 持久化关键数据

#### 示例：auth.ts

```typescript
// stores/auth.ts
import { defineStore } from 'pinia'
import type { User } from '~/types/user'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '' as string,
    user: null as User | null,
    loginFailCount: 0,
    lockUntil: null as Date | null
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    isLocked: (state) => {
      if (!state.lockUntil) return false
      return new Date() < new Date(state.lockUntil)
    }
  },
  
  actions: {
    setToken(token: string) {
      this.token = token
    },
    
    setUser(user: User) {
      this.user = user
      this.loginFailCount = 0
      this.lockUntil = null
    },
    
    incrementLoginFail() {
      this.loginFailCount++
      if (this.loginFailCount >= 5) {
        // 锁定 30 分钟
        this.lockUntil = new Date(Date.now() + 30 * 60 * 1000)
      }
    },
    
    clearAuth() {
      this.token = ''
      this.user = null
      this.loginFailCount = 0
      this.lockUntil = null
    }
  },
  
  persist: {
    storage: persistedState.localStorage,
    paths: ['token', 'user'] // 只持久化这些字段
  }
})
```

#### 示例：cart.ts

```typescript
// stores/cart.ts
import { defineStore } from 'pinia'
import type { EBook } from '~/types/ebook'

interface CartItem {
  ebook: EBook
  addedAt: Date
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[]
  }),
  
  getters: {
    itemCount: (state) => state.items.length,
    
    totalPrice: (state) => {
      return state.items.reduce((sum, item) => sum + item.ebook.sellingPrice, 0)
    },
    
    hasItem: (state) => (bookId: number) => {
      return state.items.some(item => item.ebook.bookId === bookId)
    }
  },
  
  actions: {
    async addItem(ebook: EBook) {
      // 检查是否已在购物车
      if (this.hasItem(ebook.bookId)) {
        return { success: false, message: '该电子书已在购物车中' }
      }
      
      // 检查是否已购买
      const { checkIfPurchased } = useOrder()
      const purchased = await checkIfPurchased(ebook.bookId)
      if (purchased) {
        return { success: false, message: '您已购买过该电子书' }
      }
      
      this.items.push({
        ebook,
        addedAt: new Date()
      })
      
      return { success: true, message: '已加入购物车' }
    },
    
    removeItem(bookId: number) {
      const index = this.items.findIndex(item => item.ebook.bookId === bookId)
      if (index > -1) {
        this.items.splice(index, 1)
      }
    },
    
    clearCart() {
      this.items = []
    }
  },
  
  persist: true // 持久化整个 store
})
```


### 5. layouts/ - 布局组件

定义页面的整体布局结构。

#### 布局类型

| 布局文件 | 用途 | 特点 |
|---------|------|------|
| `default.vue` | 默认布局 | 包含 Header、Footer、导航栏 |
| `reader.vue` | 阅读器布局 | 全屏布局，隐藏 Header/Footer |
| `user.vue` | 用户中心布局 | 包含侧边栏导航 |
| `auth.vue` | 认证页面布局 | 简洁布局，居中显示 |

#### 示例：default.vue

```vue
<!-- layouts/default.vue -->
<script setup lang="ts">
const { isAuthenticated } = useAuth()
const cartStore = useCartStore()
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- 页头 -->
    <AppHeader />
    
    <!-- 导航栏 -->
    <AppNav />
    
    <!-- 主内容区 -->
    <main class="flex-1">
      <slot />
    </main>
    
    <!-- 页脚 -->
    <AppFooter />
    
    <!-- 购物车悬浮按钮 -->
    <CartDrawer v-if="isAuthenticated" />
    
    <!-- 回到顶部 -->
    <BackToTop />
  </div>
</template>
```

#### 示例：reader.vue

```vue
<!-- layouts/reader.vue -->
<script setup lang="ts">
// 阅读器全屏布局
const isFullscreen = ref(false)

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    document.exitFullscreen()
    isFullscreen.value = false
  }
}
</script>

<template>
  <div class="h-screen flex flex-col bg-background">
    <!-- 阅读器工具栏 -->
    <ReaderToolbar 
      :is-fullscreen="isFullscreen"
      @toggle-fullscreen="toggleFullscreen"
    />
    
    <!-- 阅读器内容 -->
    <div class="flex-1 overflow-hidden">
      <slot />
    </div>
  </div>
</template>
```

#### 示例：user.vue

```vue
<!-- layouts/user.vue -->
<script setup lang="ts">
const route = useRoute()

const menuItems = [
  { title: '个人中心', path: '/user', icon: 'mdi:home' },
  { title: '我的书库', path: '/user/library', icon: 'mdi:book' },
  { title: '我的收藏', path: '/user/favorites', icon: 'mdi:heart' },
  { title: '阅读历史', path: '/user/reading-history', icon: 'mdi:history' },
  { title: '我的订单', path: '/orders', icon: 'mdi:receipt' },
  { title: '个人资料', path: '/user/profile', icon: 'mdi:account' }
]
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />
    
    <div class="container mx-auto py-8">
      <div class="grid grid-cols-12 gap-6">
        <!-- 侧边栏 -->
        <aside class="col-span-12 md:col-span-3">
          <Card>
            <CardContent class="p-4">
              <nav class="space-y-2">
                <NuxtLink
                  v-for="item in menuItems"
                  :key="item.path"
                  :to="item.path"
                  class="flex items-center gap-3 px-4 py-2 rounded-md transition-colors"
                  :class="route.path === item.path 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-muted'"
                >
                  <Icon :name="item.icon" class="w-5 h-5" />
                  <span>{{ item.title }}</span>
                </NuxtLink>
              </nav>
            </CardContent>
          </Card>
        </aside>
        
        <!-- 主内容区 -->
        <main class="col-span-12 md:col-span-9">
          <slot />
        </main>
      </div>
    </div>
    
    <AppFooter />
  </div>
</template>
```

### 6. middleware/ - 路由中间件

在路由导航前执行的逻辑。

#### 中间件类型

1. **全局中间件**：自动应用到所有路由
2. **命名中间件**：通过 `definePageMeta` 指定使用
3. **内联中间件**：直接在页面中定义

#### 示例：auth.ts

```typescript
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  
  // 检查是否已登录
  if (!authStore.isAuthenticated) {
    // 保存原始目标路径
    return navigateTo({
      path: '/auth/login',
      query: { redirect: to.fullPath }
    })
  }
  
  // 检查账户是否被锁定
  if (authStore.isLocked) {
    return navigateTo('/auth/locked')
  }
})
```

#### 示例：guest.ts

```typescript
// middleware/guest.ts
// 已登录用户访问登录/注册页时重定向
export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  
  if (authStore.isAuthenticated) {
    return navigateTo('/')
  }
})
```

#### 示例：reading-permission.ts

```typescript
// middleware/reading-permission.ts
export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()
  const bookId = to.params.id
  
  // 必须登录
  if (!authStore.isAuthenticated) {
    return navigateTo('/auth/login')
  }
  
  // 检查是否有阅读权限
  const { data } = await useFetch(`/api/v1/reading/${bookId}/permission`, {
    headers: {
      Authorization: `Bearer ${authStore.token}`
    }
  })
  
  if (!data.value?.hasPermission) {
    return navigateTo(`/ebooks/${bookId}`)
  }
})
```

#### 在页面中使用中间件

```vue
<!-- pages/reading/[id].vue -->
<script setup lang="ts">
definePageMeta({
  layout: 'reader',
  middleware: ['auth', 'reading-permission'] // 应用多个中间件
})
</script>
```

### 7. plugins/ - 插件

扩展 Nuxt 应用功能。

#### 插件命名规范

- `.client.ts` - 仅在客户端运行
- `.server.ts` - 仅在服务端运行
- `.ts` - 在客户端和服务端都运行

#### 示例：api.ts

```typescript
// plugins/api.ts
import axios from 'axios'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()
  
  // 创建 axios 实例
  const api = axios.create({
    baseURL: config.public.apiBase,
    timeout: 10000
  })
  
  // 请求拦截器
  api.interceptors.request.use(
    (config) => {
      // 添加 token
      if (authStore.token) {
        config.headers.Authorization = `Bearer ${authStore.token}`
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
      return response.data
    },
    (error) => {
      // 处理错误
      if (error.response?.status === 401) {
        authStore.clearAuth()
        navigateTo('/auth/login')
      }
      return Promise.reject(error)
    }
  )
  
  return {
    provide: {
      api
    }
  }
})
```

#### 示例：pdfjs.client.ts

```typescript
// plugins/pdfjs.client.ts
import * as pdfjsLib from 'pdfjs-dist'

export default defineNuxtPlugin(() => {
  // 设置 PDF.js worker
  if (process.client) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 
      'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js'
  }
  
  return {
    provide: {
      pdfjs: pdfjsLib
    }
  }
})
```

#### 示例：toast.ts

```typescript
// plugins/toast.ts
import { useToast as useToastPrimitive } from '~/components/ui/toast'

export default defineNuxtPlugin(() => {
  const { toast } = useToastPrimitive()
  
  return {
    provide: {
      toast: {
        success: (message: string) => {
          toast({
            title: '成功',
            description: message,
            variant: 'default'
          })
        },
        error: (message: string) => {
          toast({
            title: '错误',
            description: message,
            variant: 'destructive'
          })
        },
        info: (message: string) => {
          toast({
            title: '提示',
            description: message
          })
        }
      }
    }
  }
})
```

### 8. types/ - 类型定义

集中管理 TypeScript 类型。

#### 示例：ebook.ts

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

export interface EBookTag {
  tagId: number
  tagName: string
  useCount: number
}
```

#### 示例：user.ts

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

#### 示例：api.ts

```typescript
// types/api.ts
export interface ApiResponse<T = any> {
  resultCode: number
  message: string
  data: T
}

export interface PageResult<T> {
  list: T[]
  total: number
  pageNumber: number
  pageSize: number
  totalPages: number
}
```


## 配置文件

### nuxt.config.ts

> **版本说明**：以下配置适用于 Nuxt 4 + Tailwind CSS 4。如使用 Nuxt 3，请参考官方文档调整配置。

```typescript
// nuxt.config.ts
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  // Nuxt 4 特性
  future: {
    compatibilityVersion: 4, // 如果从 Nuxt 3 升级，可先设为 3
  },
  
  // 开发工具
  devtools: { enabled: true },
  
  // 兼容性日期
  compatibilityDate: '2024-11-01',
  
  // 模块
  modules: [
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/color-mode',
    '@vueuse/nuxt',
    '@nuxt/icon',
    '@nuxt/image',
    'shadcn-nuxt'
  ],
  
  // Shadcn-nuxt 配置
  shadcn: {
    prefix: '',
    componentDir: './app/components/ui' // Nuxt 4 使用 app/ 目录
  },
  
  // CSS（Tailwind CSS 4 使用 @import 语法）
  css: ['~/assets/css/main.css'],
  
  // 颜色模式
  colorMode: {
    classSuffix: '',
    preference: 'light',
    fallback: 'light'
  },
  
  // 运行时配置
  runtimeConfig: {
    // 服务端可用
    apiSecret: process.env.API_SECRET,
    
    // 客户端和服务端都可用
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8080',
      appName: 'IntelliBook Mall',
      appDescription: '智能电子书商城'
    }
  },
  
  // 应用配置
  app: {
    head: {
      title: 'IntelliBook Mall - 智能电子书商城',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '基于智能推荐的电子书商城' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },
  
  // 路由配置
  router: {
    options: {
      scrollBehaviorType: 'smooth'
    }
  },
  
  // 实验性功能
  experimental: {
    payloadExtraction: false,
    renderJsonPayloads: true,
    typedPages: true
  },
  
  // TypeScript 配置
  typescript: {
    strict: true,
    typeCheck: true
  },
  
  // Nitro 配置（服务端）
  nitro: {
    compressPublicAssets: true
  },
  
  // Vite 配置
  vite: {
    plugins: [
      tailwindcss() // Tailwind CSS 4 使用 Vite 插件
    ],
    optimizeDeps: {
      include: ['pdfjs-dist', 'epubjs']
    }
  }
})
```

### tailwind.config.ts

> **版本说明**：Tailwind CSS 4 可以不需要配置文件，使用 CSS 变量和 @theme 指令配置。如需自定义主题，可保留此文件。

```typescript
// tailwind.config.ts（可选，Tailwind CSS 4 支持零配置）
import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

export default {
  darkMode: ['class'],
  // Tailwind CSS 4 自动检测内容，无需配置 content
  // 如果需要自定义，可以保留以下配置
  content: [
    './app/components/**/*.{js,vue,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/plugins/**/*.{js,ts}',
    './app/app.vue'
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  plugins: [animate]
} satisfies Config
```

### .env.example

```bash
# API 配置
NUXT_PUBLIC_API_BASE=http://localhost:8080

# 应用配置
NUXT_PUBLIC_APP_NAME=IntelliBook Mall
NUXT_PUBLIC_APP_DESCRIPTION=智能电子书商城

# 服务端密钥（不要提交到 Git）
API_SECRET=your-secret-key-here
```

### package.json

> **版本说明**：以下是基于 Nuxt 4 + Tailwind CSS 4 的推荐配置。版本号会随时间更新，请以实际安装为准。

```json
{
  "name": "intellibook-mall-frontend",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "nuxt dev",
    "build": "nuxt build",
    "generate": "nuxt generate",
    "preview": "nuxt preview",
    "postinstall": "nuxt prepare",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "typecheck": "nuxt typecheck"
  },
  "dependencies": {
    "@nuxt/image": "^1.8.1",
    "@pinia/nuxt": "^0.5.5",
    "@pinia-plugin-persistedstate/nuxt": "^1.2.1",
    "@vueuse/core": "^12.8.2",
    "@vueuse/nuxt": "^12.8.2",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "epubjs": "^0.3.93",
    "lucide-vue-next": "^0.482.0",
    "pdfjs-dist": "^3.11.174",
    "pinia": "^2.2.6",
    "reka-ui": "^2.5.1",
    "tailwind-merge": "^2.6.0",
    "tw-animate-css": "^1.4.0",
    "vue-sonner": "^2.0.9"
  },
  "devDependencies": {
    "@nuxt/eslint": "^1.9.0",
    "@nuxt/fonts": "^0.11.4",
    "@nuxt/icon": "^1.15.0",
    "@nuxtjs/color-mode": "^3.5.2",
    "@tailwindcss/vite": "^4.1.14",
    "@types/node": "^22.10.1",
    "eslint": "^9.37.0",
    "nuxt": "^4.1.3",
    "shadcn-nuxt": "^2.3.1",
    "tailwindcss": "^4.1.14",
    "typescript": "^5.9.3",
    "vue": "^3.5.22",
    "vue-router": "^4.5.1",
    "vue-tsc": "^2.2.12"
  }
}
```

### 版本兼容性说明

**如果选择使用 Nuxt 3 + Tailwind CSS 3**，请参考以下配置：

```json
{
  "dependencies": {
    "nuxt": "^3.14.1592",
    "radix-vue": "^1.9.9",
    "tailwindcss-animate": "^1.0.7"
  },
  "devDependencies": {
    "@nuxtjs/tailwindcss": "^6.12.2",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.15"
  }
}
```

主要差异：
- Nuxt 3 使用 `@nuxtjs/tailwindcss` 模块
- Tailwind CSS 3 需要 PostCSS 和 Autoprefixer
- Shadcn-vue 使用 `radix-vue` 而非 `reka-ui`

## 开发工作流

### 1. 项目初始化

#### 方式一：使用 Nuxt 4（推荐）

```bash
# 创建 Nuxt 4 项目
npx nuxi@latest init intellibook-mall-frontend

# 进入项目目录
cd intellibook-mall-frontend

# 安装依赖
npm install

# 安装 Tailwind CSS 4
npm install -D tailwindcss@next @tailwindcss/vite@next

# 安装 Shadcn-nuxt
npm install -D shadcn-nuxt

# 初始化 Shadcn-nuxt（会自动配置）
npx shadcn-vue@latest init

# 添加需要的 UI 组件
npx shadcn-vue@latest add button
npx shadcn-vue@latest add card
npx shadcn-vue@latest add input
npx shadcn-vue@latest add dialog
npx shadcn-vue@latest add dropdown-menu
npx shadcn-vue@latest add toast

# 启动开发服务器
npm run dev
```

#### 方式二：从现有 Nuxt 3 项目升级

```bash
# 更新 Nuxt 到最新版本
npx nuxt upgrade --dedupe

# 或使用自动迁移工具
npx codemod@latest nuxt/4/migration-recipe

# 更新 Tailwind CSS 到 v4
npm install -D tailwindcss@next @tailwindcss/vite@next
npm uninstall @nuxtjs/tailwindcss autoprefixer postcss

# 更新配置文件（参考上面的 nuxt.config.ts）
```

#### 方式三：使用模板快速开始

```bash
# 使用社区模板（Nuxt 4 + Shadcn + Tailwind CSS 4）
npx degit dianprata/nuxt-shadcn-dashboard intellibook-mall-frontend
cd intellibook-mall-frontend
npm install
npm run dev
```

### 2. 开发规范

#### 代码风格

- 使用 TypeScript
- 使用 Composition API
- 使用 `<script setup>` 语法
- 组件使用 PascalCase 命名
- 文件使用 kebab-case 命名（除组件外）

#### Git 提交规范

```bash
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
perf: 性能优化
test: 测试相关
chore: 构建/工具相关
```

### 3. 性能优化

#### 图片优化

```vue
<template>
  <!-- 使用 Nuxt Image 组件 -->
  <NuxtImg
    :src="ebook.coverImg"
    :alt="ebook.bookTitle"
    width="300"
    height="400"
    format="webp"
    loading="lazy"
    placeholder
  />
</template>
```

#### 懒加载

```vue
<script setup lang="ts">
// 懒加载组件
const PDFReader = defineAsyncComponent(() => 
  import('~/components/reader/PDFReader.vue')
)
</script>
```

#### 预加载关键资源

```vue
<script setup lang="ts">
// 预加载关键数据
const { data: categories } = await useFetch('/api/v1/categories', {
  key: 'categories',
  lazy: false // 立即加载
})
</script>
```

### 4. SEO 优化

```vue
<script setup lang="ts">
// 页面级 SEO
useSeoMeta({
  title: '电子书详情',
  description: '查看电子书详细信息',
  ogTitle: '电子书详情',
  ogDescription: '查看电子书详细信息',
  ogImage: '/og-image.jpg',
  twitterCard: 'summary_large_image'
})

// 结构化数据
useSchemaOrg([
  defineProduct({
    name: ebook.value?.bookTitle,
    image: ebook.value?.coverImg,
    description: ebook.value?.bookIntro,
    offers: {
      price: ebook.value?.sellingPrice / 100,
      priceCurrency: 'CNY'
    }
  })
])
</script>
```

## 部署

### 1. 构建生产版本

```bash
# 构建
npm run build

# 预览
npm run preview
```

### 2. 部署到 Vercel

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel
```

### 3. 部署到 Netlify

```bash
# 安装 Netlify CLI
npm i -g netlify-cli

# 部署
netlify deploy --prod
```

### 4. 部署到服务器（Node.js）

```bash
# 构建
npm run build

# 启动
node .output/server/index.mjs
```

## 总结

IntelliBook-Mall 前端架构采用 Nuxt 4 + Shadcn-vue + Tailwind CSS 4 的现代化技术栈，具有以下特点：

### 优势

1. **开发效率高**：自动导入、文件路由、热更新、更快的 CLI
2. **性能优秀**：SSR、代码分割、懒加载、Tailwind CSS 4 构建速度提升 10 倍
3. **SEO 友好**：服务端渲染、元标签优化
4. **类型安全**：完整的 TypeScript 支持，Nuxt 4 改进了项目级类型分离
5. **组件丰富**：Shadcn-vue 提供高质量组件（基于 Reka UI）
6. **易于维护**：清晰的目录结构（app/ 目录）、模块化设计
7. **现代化**：使用最新的 CSS 特性（@layer、@property、容器查询等）
8. **零配置**：Tailwind CSS 4 自动发现模板文件，无需配置 content 路径

### 版本选择建议

**推荐使用最新版本**（Nuxt 4 + Tailwind CSS 4）的场景：
- 新项目启动
- 追求最佳性能和开发体验
- 团队愿意学习新特性
- 不依赖过多第三方模块

**建议使用稳定版本**（Nuxt 3 + Tailwind CSS 3）的场景：
- 生产环境要求极高稳定性
- 依赖较多第三方模块（可能尚未完全兼容 Nuxt 4）
- 团队对新技术接受度较低
- 需要更多社区资源和问题解决方案

### 开发建议

1. **优先使用 Composition API**：更好的逻辑复用
2. **合理使用状态管理**：避免过度使用全局状态
3. **注重性能优化**：懒加载、图片优化、缓存策略
4. **保持代码整洁**：遵循命名规范、及时重构
5. **编写类型定义**：提高代码可维护性
6. **关注用户体验**：加载状态、错误处理、响应式设计

### 后续扩展

1. **PWA 支持**：添加 `@vite-pwa/nuxt` 模块
2. **国际化**：添加 `@nuxtjs/i18n` 模块
3. **分析统计**：集成 Google Analytics
4. **错误监控**：集成 Sentry
5. **性能监控**：集成 Web Vitals
6. **A/B 测试**：集成测试工具

这份架构文档为 IntelliBook-Mall 前端开发提供了完整的指导，确保项目能够高质量、高效率地完成。


## 参考资源与版本选择

### 官方文档

- [Nuxt 4 官方文档](https://nuxt.com/)
- [Nuxt 4 发布公告](https://nuxt.com/blog/v4)
- [Nuxt 4 升级指南](https://nuxt.com/docs/getting-started/upgrade)
- [Tailwind CSS 4 文档](https://tailwindcss.com/)
- [Tailwind CSS 4 Alpha 公告](https://tailwindcss.com/blog/tailwindcss-v4-alpha)
- [Shadcn-vue 文档](https://www.shadcn-vue.com/)
- [Reka UI 文档](https://reka-ui.com/)（Shadcn-vue 底层组件库）
- [VueUse 文档](https://vueuse.org/)

### 社区资源

- [Nuxt 4 + Shadcn Dashboard 模板](https://github.com/dianprata/nuxt-shadcn-dashboard)
- [UI Thing - Nuxt UI 组件库](https://github.com/BayBreezy/ui-thing)
- [Inspira UI - Vue/Nuxt 组件库](https://github.com/unovue/inspira-ui)

### 迁移工具

- [Nuxt 4 自动迁移工具](https://codemod.com/)：`npx codemod@latest nuxt/4/migration-recipe`
- [Nuxt 升级命令](https://nuxt.com/docs/getting-started/upgrade)：`npx nuxt upgrade --dedupe`

### 版本兼容性检查清单

在选择版本前，建议检查以下内容：

1. **模块兼容性**：检查项目依赖的 Nuxt 模块是否支持 Nuxt 4
2. **浏览器支持**：Tailwind CSS 4 使用现代 CSS 特性，确认目标浏览器支持
3. **团队准备度**：评估团队对新技术的学习曲线
4. **生产环境要求**：考虑稳定性和问题排查的难易程度

### 技术选型决策树

```
是否为新项目？
├─ 是 → 推荐使用 Nuxt 4 + Tailwind CSS 4
└─ 否 → 是否有充足的测试时间？
    ├─ 是 → 可以尝试升级到 Nuxt 4
    └─ 否 → 继续使用 Nuxt 3，等待生态成熟

是否需要最新的 CSS 特性？
├─ 是 → 使用 Tailwind CSS 4
└─ 否 → Tailwind CSS 3 已足够

团队是否熟悉 Vue 3 Composition API？
├─ 是 → 可以直接使用 Nuxt 4
└─ 否 → 建议先学习 Vue 3 基础

是否依赖大量第三方 Nuxt 模块？
├─ 是 → 检查模块兼容性，可能需要等待更新
└─ 否 → 可以放心使用 Nuxt 4
```

### 版本更新策略

**激进策略**（适合新项目）：
- 始终使用最新稳定版本
- 及时跟进新特性和改进
- 接受可能的 breaking changes

**保守策略**（适合生产项目）：
- 使用 LTS 或广泛验证的版本
- 等待社区反馈和问题修复
- 在非关键项目中先行测试

**平衡策略**（推荐）：
- 新项目使用最新版本
- 现有项目等待 1-2 个月后升级
- 关注官方发布说明和社区反馈

---

**文档版本**：v1.0.0  
**最后更新**：2025-11-02  
**适用版本**：Nuxt 4.x / Nuxt 3.14+, Tailwind CSS 4.x / 3.4+

> **重要提示**：本文档中的版本号和配置仅供参考，实际开发时请根据项目需求、团队能力和生产环境要求选择合适的技术栈版本。建议在开始项目前查阅最新的官方文档和社区反馈。
