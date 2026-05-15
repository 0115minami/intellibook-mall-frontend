<template>
  <div class="auth-page">
    <a-card class="auth-card" title="登录">
      <LoginForm @success="handleSuccess" @switch-to-register="handleSwitchToRegister" />
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LoginForm from '@/components/auth/LoginForm.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const handleSuccess = () => {
  // 调试日志
  console.log('Login success, checking user type...')
  console.log('Auth store user:', authStore.user)
  console.log('Is admin:', authStore.isAdmin)
  
  // 判断用户类型，管理员跳转到后台管理，普通用户跳转到首页或重定向地址
  if (authStore.isAdmin) {
    console.log('Redirecting to admin dashboard...')
    router.push('/admin/dashboard')
  } else {
    console.log('Redirecting to home or redirect path...')
    const redirect = (route.query.redirect as string) || '/'
    router.push(redirect)
  }
}

const handleSwitchToRegister = () => {
  router.push('/register')
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 24px;
}

.auth-card {
  width: 100%;
  max-width: 400px;
}

.auth-footer {
  text-align: center;
  color: #666;
}

.auth-footer a {
  color: #1890ff;
  margin-left: 4px;
}
</style>
