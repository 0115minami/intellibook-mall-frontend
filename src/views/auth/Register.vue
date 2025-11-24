<template>
  <div class="auth-page">
    <a-card class="auth-card" title="注册">
      <RegisterForm @success="handleSuccess" @switch-to-login="handleSwitchToLogin" />
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import RegisterForm from '@/components/auth/RegisterForm.vue'

const router = useRouter()

const handleSuccess = () => {
  router.push('/login')
}

const handleSwitchToLogin = () => {
  router.push('/login')
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
