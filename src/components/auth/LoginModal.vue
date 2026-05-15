<template>
  <a-modal
    :open="authModalStore.isLoginOpen"
    title="登录"
    :footer="null"
    @cancel="authModalStore.closeLogin"
    width="400px"
  >
    <LoginForm
      @success="handleSuccess"
      @switch-to-register="authModalStore.switchToRegister"
    />
  </a-modal>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAuthModalStore } from '@/stores/authModal'
import LoginForm from './LoginForm.vue'

const router = useRouter()
const authStore = useAuthStore()
const authModalStore = useAuthModalStore()

const handleSuccess = () => {
  authModalStore.closeLogin()
  
  // 判断用户类型，管理员跳转到后台管理
  if (authStore.isAdmin) {
    router.push('/admin/dashboard')
  }
}
</script>
