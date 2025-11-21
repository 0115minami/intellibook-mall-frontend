<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="container mx-auto px-4 py-16">
      <!-- 头部 -->
      <header class="text-center mb-16">
        <h1 class="text-5xl font-bold text-gray-900 mb-4">
          📚 IntelliBook Mall
        </h1>
        <p class="text-xl text-gray-600">
          智能电子书商城 - 基于 Nuxt 4 + Shadcn-vue 构建
        </p>
      </header>

      <!-- 功能卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <!-- 项目状态 -->
        <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div class="text-4xl mb-4">✅</div>
          <h3 class="text-xl font-semibold mb-2">项目初始化完成</h3>
          <p class="text-gray-600">
            Nuxt 4 项目已成功配置，包含 Pinia、Axios、Tailwind CSS 等核心依赖
          </p>
        </div>

        <!-- 技术栈 -->
        <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div class="text-4xl mb-4">🚀</div>
          <h3 class="text-xl font-semibold mb-2">现代化技术栈</h3>
          <ul class="text-gray-600 space-y-1">
            <li>• Nuxt 4.2.0</li>
            <li>• Vue 3.5.22</li>
            <li>• Pinia 3.0.4</li>
            <li>• Tailwind CSS 4</li>
            <li>• Shadcn-vue</li>
          </ul>
        </div>

        <!-- 下一步 -->
        <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div class="text-4xl mb-4">📝</div>
          <h3 class="text-xl font-semibold mb-2">开始开发</h3>
          <p class="text-gray-600">
            现在可以开始实现认证模块、电子书列表、购物车等功能
          </p>
        </div>
      </div>

      <!-- 快速链接 -->
      <div class="mt-16 text-center">
        <h2 class="text-2xl font-semibold mb-6">快速链接</h2>
        <div class="flex flex-wrap justify-center gap-4">
          <a 
            href="/auth/login" 
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            登录页面
          </a>
          <a 
            href="/ebooks" 
            class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            电子书列表
          </a>
          <a 
            href="/user/profile" 
            class="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            个人中心
          </a>
        </div>
      </div>

      <!-- 项目信息 -->
      <footer class="mt-16 text-center text-gray-600">
        <p class="mb-2">
          🎯 任务 21.1 已完成 - Nuxt 4 项目初始化成功
        </p>
        <p class="text-sm">
          查看 <code class="bg-gray-200 px-2 py-1 rounded">README.md</code> 了解更多信息
        </p>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
// 页面元数据
useHead({
  title: 'IntelliBook Mall - 智能电子书商城',
  meta: [
    { name: 'description', content: '基于 Nuxt 4 构建的现代化电子书商城' }
  ]
})
</script>
