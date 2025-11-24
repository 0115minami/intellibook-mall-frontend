<template>
  <a-form
    :model="formState"
    :rules="rules"
    @finish="handleSubmit"
    layout="vertical"
  >
    <a-form-item label="用户名" name="username">
      <a-input
        v-model:value="formState.username"
        placeholder="请输入用户名"
        size="large"
      >
        <template #prefix>
          <UserOutlined />
        </template>
      </a-input>
    </a-form-item>

    <a-form-item label="密码" name="password">
      <a-input-password
        v-model:value="formState.password"
        placeholder="请输入密码"
        size="large"
      >
        <template #prefix>
          <LockOutlined />
        </template>
      </a-input-password>
    </a-form-item>

    <a-form-item>
      <a-button
        type="primary"
        html-type="submit"
        size="large"
        block
        :loading="authStore.isLoading"
      >
        登录
      </a-button>
    </a-form-item>

    <div class="auth-footer">
      还没有账号？
      <a @click="$emit('switchToRegister')">立即注册</a>
    </div>
  </a-form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { message } from 'ant-design-vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { useAuthStore } from '@/stores/auth'
import type { LoginForm } from '@/types/user'
import type { Rule } from 'ant-design-vue/es/form'

const authStore = useAuthStore()

const emit = defineEmits<{
  success: []
  switchToRegister: []
}>()

const formState = reactive<LoginForm>({
  username: '',
  password: '',
})

const rules: Record<string, Rule[]> = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在3-20个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6个字符', trigger: 'blur' },
  ],
}

const handleSubmit = async () => {
  const result = await authStore.login(formState)

  if (result.success) {
    message.success('登录成功！')
    emit('success')
  }
}
</script>

<style scoped>
.auth-footer {
  text-align: center;
  color: #666;
}

.auth-footer a {
  color: #1890ff;
  margin-left: 4px;
  cursor: pointer;
}
</style>
