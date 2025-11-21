# IntelliBook-Mall 前端项目

基于 Nuxt 4 + Shadcn-vue + Tailwind CSS 4 构建的现代化电子书商城前端应用。

## 📁 项目结构说明

本项目采用 **Nuxt 4 的 app/ 目录模式**，所有源代码都在 `app/` 目录下：

```
intellibook-mall-frontend/
├── .kiro/                    # Kiro IDE 配置
├── .nuxt/                    # Nuxt 自动生成的文件（不要修改）
├── app/                      # 📦 应用源代码目录（主要工作区）
│   ├── assets/              # 静态资源
│   │   ├── css/            # 全局样式
│   │   ├── fonts/          # 字体文件
│   │   └── images/         # 图片资源
│   ├── components/          # Vue 组件
│   │   ├── cart/           # 购物车组件
│   │   ├── common/         # 通用组件
│   │   ├── ebook/          # 电子书组件
│   │   ├── order/          # 订单组件
│   │   ├── reader/         # 阅读器组件
│   │   ├── recommendation/ # 推荐组件
│   │   ├── user/           # 用户组件
│   │   └── ui/             # Shadcn-vue UI 组件
│   ├── composables/         # 组合式函数（自动导入）
│   ├── layouts/             # 布局组件
│   ├── middleware/          # 路由中间件
│   ├── pages/              # 页面组件（文件系统路由）
│   │   ├── auth/           # 认证页面
│   │   ├── categories/     # 分类页面
│   │   ├── ebooks/         # 电子书页面
│   │   ├── orders/         # 订单页面
│   │   ├── reading/        # 阅读页面
│   │   ├── user/           # 用户中心
│   │   └── index.vue       # 首页
│   ├── plugins/            # Nuxt 插件
│   │   ├── api.client.ts   # API 客户端
│   │   └── error-handler.client.ts # 错误处理
│   ├── stores/             # Pinia 状态管理
│   │   └── auth.ts         # 认证状态
│   ├── types/              # TypeScript 类型定义
│   │   ├── api.ts          # API 类型
│   │   ├── ebook.ts        # 电子书类型
│   │   └── user.ts         # 用户类型
│   ├── utils/              # 工具函数（自动导入）
│   │   └── format.ts       # 格式化工具
│   ├── app.vue             # 根组件
│   └── README.md           # App 目录说明
├── node_modules/            # 依赖包（不要提交）
├── public/                  # 公共静态文件
│   ├── favicon.ico
│   └── robots.txt
├── server/                  # 服务端 API（可选）
│   ├── api/                # API 路由
│   └── middleware/         # 服务端中间件
├── .env                     # 环境变量（不要提交）
├── .gitignore              # Git 忽略配置
├── nuxt.config.ts          # Nuxt 配置文件
├── package.json            # 项目依赖配置
├── tsconfig.json           # TypeScript 配置
└── README.md               # 项目说明（本文件）
```

## 🎯 目录说明

### 核心目录（在 app/ 下）

- **components/**: Vue 组件，自动导入，无需手动 import
- **composables/**: 组合式函数，自动导入，用于封装可复用逻辑
- **pages/**: 页面组件，自动生成路由
- **layouts/**: 布局组件，用于页面布局
- **middleware/**: 路由中间件，用于权限控制等
- **plugins/**: Nuxt 插件，用于扩展功能
- **stores/**: Pinia 状态管理
- **types/**: TypeScript 类型定义
- **utils/**: 工具函数，自动导入

### 根目录

- **server/**: 服务端 API（如果需要 Nuxt 提供后端接口）
- **public/**: 公共静态文件，直接通过 URL 访问
- **.nuxt/**: Nuxt 自动生成，不要手动修改
- **node_modules/**: 依赖包，不要提交到 Git

## 🚀 技术栈

- **框架**: Nuxt 4.2.0 (Vue 3.5.22)
- **状态管理**: Pinia 3.0.4
- **HTTP 客户端**: Axios 1.13.2
- **UI 组件**: Shadcn-vue 2.3.2
- **样式**: Tailwind CSS 4.1.16
- **工具库**: VueUse 14.0.0
- **类型系统**: TypeScript

## 📝 开发命令

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

## 🔧 环境配置

项目使用 `.env` 文件管理环境变量：

```bash
# API 配置
NUXT_PUBLIC_API_BASE=http://localhost:8080
NUXT_PUBLIC_API_TIMEOUT=10000

# 文件服务配置
NUXT_PUBLIC_FILE_BASE=http://localhost:8080/files
NUXT_PUBLIC_COVER_BASE=http://localhost:8080/files/covers
NUXT_PUBLIC_EBOOK_BASE=http://localhost:8080/files/books

# 应用配置
NUXT_PUBLIC_APP_NAME=IntelliBook Mall
NUXT_PUBLIC_APP_DESCRIPTION=智能电子书商城

# 开发配置
NUXT_PUBLIC_DEBUG=true
```

## 📚 开发规范

### 文件命名
- 组件文件：`PascalCase.vue` (如 `EBookCard.vue`)
- 组合式函数：`camelCase.ts` (如 `useAuth.ts`)
- 工具函数：`camelCase.ts` (如 `format.ts`)
- 类型文件：`camelCase.ts` (如 `user.ts`)

### 代码规范
- 使用 TypeScript
- 使用 Composition API
- 组件使用 `<script setup>`
- 优先使用 Composables 封装逻辑

### 导入规范
- `app/` 目录下的文件使用 `~/` 别名
- 类型导入使用 `import type`
- 组件、Composables、Utils 自动导入，无需手动 import

## 🎨 UI 组件

项目使用 Shadcn-vue 组件库，组件位于 `app/components/ui/`。

添加新组件：
```bash
npx shadcn-vue@latest add button
npx shadcn-vue@latest add card
npx shadcn-vue@latest add form
```

## 📖 相关文档

- [Nuxt 4 文档](https://nuxt.com)
- [Pinia 文档](https://pinia.vuejs.org)
- [Shadcn-vue 文档](https://www.shadcn-vue.com)
- [Tailwind CSS 文档](https://tailwindcss.com)
- [VueUse 文档](https://vueuse.org)

## 🤝 开发流程

1. 在 `app/pages/` 创建页面
2. 在 `app/components/` 创建组件
3. 在 `app/composables/` 创建可复用逻辑
4. 在 `app/stores/` 管理全局状态
5. 在 `app/types/` 定义类型

## ⚠️ 注意事项

1. **不要在根目录创建 `pages/`、`components/` 等目录**，所有源代码都应在 `app/` 目录下
2. **不要修改 `.nuxt/` 目录**，这是 Nuxt 自动生成的
3. **不要提交 `.env` 文件**，敏感信息不要上传到 Git
4. **使用 `~/` 别名**引用 `app/` 目录下的文件

## 📞 联系方式

如有问题，请查看项目文档或联系开发团队。
