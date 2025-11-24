<template>
  <div class="auth-page">
    <a-card class="auth-card" title="登录">
      <LoginForm @success="handleSuccess" @switch-to-register="handleSwitchToRegister" />
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import LoginForm from '@/components/auth/LoginForm.vue'

const router = useRouter()
const route = useRoute()

const handleSuccess = () => {
  const redirect = (route.query.redirect as string) || '/'
  router.push(redirect)
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
