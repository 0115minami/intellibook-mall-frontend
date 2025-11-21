import tailwind from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  // 模块配置
  modules: [
    'shadcn-nuxt',
    '@pinia/nuxt',
    '@vueuse/nuxt'
  ],
  
  // 全局样式
  css: ['~/assets/css/main.css'],
  
  // Shadcn-vue 配置
  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },
  
  // 运行时配置
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8080',
      apiTimeout: parseInt(process.env.NUXT_PUBLIC_API_TIMEOUT || '10000'),
      fileBase: process.env.NUXT_PUBLIC_FILE_BASE || 'http://localhost:8080/files',
      coverBase: process.env.NUXT_PUBLIC_COVER_BASE || 'http://localhost:8080/files/covers',
      ebookBase: process.env.NUXT_PUBLIC_EBOOK_BASE || 'http://localhost:8080/files/books',
      appName: process.env.NUXT_PUBLIC_APP_NAME || 'IntelliBook Mall',
      appDescription: process.env.NUXT_PUBLIC_APP_DESCRIPTION || '智能电子书商城',
      debug: process.env.NUXT_PUBLIC_DEBUG === 'true'
    }
  },
  
  // Vite 配置
  vite: {
    plugins: [
      tailwind()
    ]
  },
  
  // 开发服务器配置
  devServer: {
    port: 3000
  },
  
  // Nitro 配置（开发环境代理）
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
