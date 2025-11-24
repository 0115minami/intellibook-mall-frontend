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
        placeholder="请输入用户名（3-20个字符）"
        size="large"
      >
        <template #prefix>
          <UserOutlined />
        </template>
      </a-input>
    </a-form-item>

    <a-form-item label="昵称" name="nickname">
      <a-input
        v-model:value="formState.nickname"
        placeholder="请输入昵称（2-20个字符）"
        size="large"
      >
        <template #prefix>
          <SmileOutlined />
        </template>
      </a-input>
    </a-form-item>

    <a-form-item label="邮箱" name="email">
      <a-input
        v-model:value="formState.email"
        placeholder="请输入邮箱地址"
        size="large"
      >
        <template #prefix>
          <MailOutlined />
        </template>
      </a-input>
    </a-form-item>

    <a-form-item label="密码" name="password">
      <a-input-password
        v-model:value="formState.password"
        placeholder="请输入密码（至少6个字符）"
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
        注册
      </a-button>
    </a-form-item>

    <div class="auth-footer">
      已有账号？
      <a @click="$emit('switchToLogin')">立即登录</a>
    </div>
  </a-form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { message } from 'ant-design-vue'
import { MailOutlined, UserOutlined, LockOutlined, SmileOutlined } from '@ant-design/icons-vue'
import { useAuthStore } from '@/stores/auth'
import type { RegisterForm } from '@/types/user'
import type { Rule } from 'ant-design-vue/es/form'

const authStore = useAuthStore()

const emit = defineEmits<{
  success: []
  switchToLogin: []
}>()

const formState = reactive<RegisterForm>({
  username: '',
  nickname: '',
  email: '',
  password: '',
})

const rules: Record<string, Rule[]> = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在3-20个字符', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线', trigger: 'blur' },
  ],
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '昵称长度在2-20个字符', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6个字符', trigger: 'blur' },
  ],
}

const handleSubmit = async () => {
  const result = await authStore.register(formState)

  if (result.success) {
    message.success('注册成功！')
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
