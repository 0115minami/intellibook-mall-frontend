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
import { useAuthModalStore } from '@/stores/authModal'
import LoginForm from './LoginForm.vue'

const authModalStore = useAuthModalStore()

const handleSuccess = () => {
  authModalStore.closeLogin()
}
</script>
