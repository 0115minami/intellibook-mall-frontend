export default defineNuxtPlugin((nuxtApp) => {
  // 处理未捕获的 Promise 拒绝
  if (import.meta.client) {
    window.addEventListener('unhandledrejection', (event) => {
      console.error('未处理的Promise拒绝:', event.reason)
      
      // 这里可以集成 toast 提示
      // 暂时使用 console.error
      if (event.reason?.message) {
        console.error('错误:', event.reason.message)
      }
    })
  }

  // 处理 Vue 错误
  nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
    console.error('Vue错误:', error, info)
    
    // 这里可以集成错误上报服务
    // 暂时使用 console.error
  }

  // 处理 Nuxt 错误
  nuxtApp.hook('vue:error', (error, instance, info) => {
    console.error('Nuxt错误:', error, info)
  })
})
