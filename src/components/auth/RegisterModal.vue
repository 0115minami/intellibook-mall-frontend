<template>
  <a-modal
    :open="authModalStore.isRegisterOpen"
    title="注册"
    :footer="null"
    @cancel="authModalStore.closeRegister"
    width="400px"
  >
    <RegisterForm
      @success="handleSuccess"
      @switch-to-login="authModalStore.switchToLogin"
    />
  </a-modal>
</template>

<script setup lang="ts">
import { useAuthModalStore } from '@/stores/authModal'
import RegisterForm from './RegisterForm.vue'

const authModalStore = useAuthModalStore()

const handleSuccess = () => {
  // 注册成功后切换到登录
  authModalStore.switchToLogin()
}
</script>
