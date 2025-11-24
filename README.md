# IntelliBook Mall - 智能电子书商城

基于 **Vite + Vue 3 + TypeScript + Ant Design Vue** 构建的现代化电子书商城前端项目。

## �  技术栈

- **框架**: Vue 3.5 (Composition API)
- **构建工具**: Vite 6.0
- **语言**: TypeScript 5.7
- **UI 组件库**: Ant Design Vue 4.3
- **路由**: Vue Router 4.5
- **状态管理**: Pinia 2.3 + 持久化插件
- **HTTP 客户端**: Axios 1.7
- **图标**: @ant-design/icons-vue

## ✨ 特性

- ⚡️ **极速开发** - Vite HMR 热更新
- 🎨 **企业级 UI** - Ant Design Vue 组件库
- 📦 **自动导入** - 组件和 API 自动导入
- 🔐 **认证系统** - 完整的登录注册流程
- 🛒 **电商功能** - 购物车、订单管理
- 📚 **电子书管理** - 浏览、搜索、收藏
- 💾 **状态持久化** - Pinia 状态自动持久化
- 🌐 **API 代理** - 开发环境自动代理后端接口

## 📁 项目结构

```
intellibook-mall-frontend/
├── .kiro/                  # Kiro 配置和规范文档
│   └── specs/             # 项目规范和设计文档
├── public/                # 静态资源
├── src/
│   ├── router/           # 路由配置
│   ├── stores/           # Pinia 状态管理
│   ├── types/            # TypeScript 类型定义
│   ├── utils/            # 工具函数
│   ├── views/            # 页面组件
│   │   ├── auth/        # 认证页面
│   │   ├── ebooks/      # 电子书页面
│   │   ├── cart/        # 购物车页面
│   │   ├── orders/      # 订单页面
│   │   └── user/        # 用户中心页面
│   ├── App.vue          # 根组件
│   └── main.ts          # 入口文件
├── index.html           # HTML 模板
├── vite.config.ts       # Vite 配置
├── tsconfig.json        # TypeScript 配置
└── package.json         # 项目依赖
```

## 🛠️ 开发指南

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 🔧 配置说明

### 环境变量

在 `.env` 文件中配置：

```env
VITE_API_BASE=http://localhost:8080
VITE_FILE_BASE=http://localhost:8080/files
```

### API 代理

开发环境下，`/api` 和 `/files` 请求会自动代理到后端服务器（默认 `http://localhost:8080`）。

配置位置：`vite.config.ts` 中的 `server.proxy`

## 📝 开发规范

### 组件自动导入

Ant Design Vue 组件会自动导入，无需手动引入：

```vue
<template>
  <a-button type="primary">按钮</a-button>
</template>
```

### API 自动导入

Vue API 会自动导入，无需手动引入：

```vue
<script setup lang="ts">
// ref, computed, watch 等自动导入
const count = ref(0)
const double = computed(() => count.value * 2)
</script>
```

### 路径别名

使用 `@` 作为 `src` 目录的别名：

```typescript
import { useAuthStore } from '@/stores/auth'
import type { User } from '@/types/user'
```

## 🎯 核心功能

### 认证系统

- ✅ 用户登录（用户名 + 密码）
- ✅ 用户注册（用户名、昵称、邮箱、密码）
- ✅ JWT Token 管理
- ✅ 路由守卫
- ✅ 状态持久化
- ✅ 自动登出（Token 过期）
- ✅ 表单验证（实时验证）

### 待实现功能

- [ ] 电子书列表和详情
- [ ] 购物车管理
- [ ] 订单管理
- [ ] 用户中心
- [ ] 在线阅读
- [ ] 智能推荐

## 📚 相关文档

- [Vue 3 文档](https://cn.vuejs.org/)
- [Vite 文档](https://cn.vitejs.dev/)
- [Ant Design Vue 文档](https://antdv.com/)
- [Vue Router 文档](https://router.vuejs.org/zh/)
- [Pinia 文档](https://pinia.vuejs.org/zh/)

## 📄 License

MIT

## 👥 贡献

欢迎提交 Issue 和 Pull Request！
