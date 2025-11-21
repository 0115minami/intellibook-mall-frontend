# IntelliBook-Mall 前端项目

基于 Nuxt 4 + Shadcn-vue + Tailwind CSS 4 构建的现代化电子书商城前端应用。

## 技术栈

- **框架**: Nuxt 4.2.0 (Vue 3.5.22)
- **状态管理**: Pinia 3.0.4
- **HTTP 客户端**: Axios 1.13.2
- **UI 组件**: Shadcn-vue 2.3.2
- **样式**: Tailwind CSS 4.1.16
- **工具库**: VueUse 14.0.0
- **类型系统**: TypeScript

## 项目结构

```
app/
├── assets/          # 静态资源
│   ├── css/        # 全局样式
│   ├── fonts/      # 字体文件
│   └── images/     # 图片资源
├── components/      # 组件目录
│   ├── cart/       # 购物车组件
│   ├── common/     # 通用组件
│   ├── ebook/      # 电子书组件
│   ├── order/      # 订单组件
│   ├── reader/     # 阅读器组件
│   ├── recommendation/ # 推荐组件
│   └── user/       # 用户组件
├── composables/     # 组合式函数
├── layouts/         # 布局组件
├── middleware/      # 路由中间件
├── pages/          # 页面组件
│   ├── auth/       # 认证页面
│   ├── categories/ # 分类页面
│   ├── ebooks/     # 电子书页面
│   ├── orders/     # 订单页面
│   ├── reading/    # 阅读页面
│   └── user/       # 用户中心
├── plugins/        # 插件
│   ├── api.client.ts          # API 客户端
│   └── error-handler.client.ts # 错误处理
├── stores/         # Pinia 状态管理
│   └── auth.ts     # 认证状态
├── types/          # TypeScript 类型定义
│   ├── api.ts      # API 类型
│   ├── ebook.ts    # 电子书类型
│   └── user.ts     # 用户类型
├── utils/          # 工具函数
│   └── format.ts   # 格式化工具
└── app.vue         # 根组件
```

## 环境配置

项目使用 `.env` 文件管理环境变量：

```bash
# API 配置
NUXT_PUBLIC_API_BASE=http://localhost:8080
NUXT_PUBLIC_API_TIMEOUT=10000

# 文件服务配置
NUXT_PUBLIC_FILE_BASE=http://localhost:8080/files
NUXT_PUBLIC_COVER_BASE=http://localhost:8080/files/covers
NUXT_PUBLIC_EBOOK_BASE=http://localhost:8080/files/books
```

## 开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器 (http://localhost:3000)
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview

# 生成静态站点
npm run generate
```

## 核心功能

### 1. API 客户端
- 统一的 Axios 实例配置
- 请求/响应拦截器
- 自动 Token 管理
- 统一错误处理

### 2. 状态管理
- Pinia stores
- 持久化支持
- TypeScript 类型安全

### 3. 路由系统
- 文件系统路由
- 路由中间件
- 权限控制

### 4. 类型系统
- 完整的 TypeScript 支持
- API 响应类型定义
- 业务实体类型定义

## 开发规范

### 组件命名
- 使用 PascalCase 命名组件文件
- 组件名称应具有描述性

### 类型定义
- 所有 API 响应都应有类型定义
- 使用 interface 而非 type

### 状态管理
- 使用 Pinia stores 管理全局状态
- 组件内部状态使用 ref/reactive

### API 调用
- 使用 composables 封装 API 调用
- 统一错误处理

## 下一步

1. 完成认证模块前端实现
2. 实现电子书列表和详情页面
3. 开发购物车和订单功能
4. 集成在线阅读器
5. 实现推荐系统前端

## 参考文档

- [Nuxt 4 文档](https://nuxt.com)
- [Pinia 文档](https://pinia.vuejs.org)
- [Shadcn-vue 文档](https://www.shadcn-vue.com)
- [Tailwind CSS 文档](https://tailwindcss.com)
- [VueUse 文档](https://vueuse.org)
