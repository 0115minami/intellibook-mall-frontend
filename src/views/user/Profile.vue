<template>
  <div class="profile-page">
    <div class="page-header">
      <h2>个人资料</h2>
      <p class="subtitle">管理您的个人信息</p>
    </div>

    <a-spin :spinning="loading">
      <div class="info-card">
        <div class="card-title">基本信息</div>

        <div class="info-row">
          <span class="label">用户名</span>
          <span class="value">{{ userInfo?.username }}</span>
          <span class="hint">不可修改</span>
        </div>
        <a-divider style="margin: 0" />

        <div class="info-row">
          <span class="label">昵称</span>
          <span class="value">{{ userInfo?.nickname }}</span>
        </div>
        <a-divider style="margin: 0" />

        <div class="info-row">
          <span class="label">邮箱</span>
          <span class="value">{{ userInfo?.email }}</span>
        </div>
        <a-divider style="margin: 0" />

        <div class="info-row">
          <span class="label">用户ID</span>
          <span class="value">{{ userInfo?.userId }}</span>
          <span class="hint">系统生成</span>
        </div>
        <a-divider style="margin: 0" />

        <div class="info-row">
          <span class="label">用户类型</span>
          <a-tag :color="userInfo?.isAdmin ? 'gold' : 'blue'">
            {{ userInfo?.isAdmin ? '管理员' : '普通用户' }}
          </a-tag>
        </div>
      </div>

      <div class="action-row">
        <a-button type="primary" @click="showEditModal = true">
          <EditOutlined />
          编辑资料
        </a-button>
        <a-button danger @click="handleLogout">
          <LogoutOutlined />
          退出登录
        </a-button>
      </div>
    </a-spin>

    <!-- 编辑弹窗 -->
    <a-modal
      :open="showEditModal"
      title="编辑资料"
      :confirm-loading="saving"
      @ok="handleSave"
      @cancel="showEditModal = false"
    >
      <a-form :model="editForm" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }" style="margin-top: 16px">
        <a-form-item label="昵称">
          <a-input v-model:value="editForm.nickname" placeholder="请输入昵称" />
        </a-form-item>
        <a-form-item label="邮箱">
          <a-input v-model:value="editForm.email" placeholder="请输入邮箱" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { EditOutlined, LogoutOutlined } from '@ant-design/icons-vue'
import { useAuthStore } from '@/stores/auth'
import { getUserInfo, updateUserInfo } from '@/api/user-center'
import type { User } from '@/types/user'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
const saving = ref(false)
const showEditModal = ref(false)
const userInfo = ref<User | null>(null)

const editForm = reactive({ nickname: '', email: '' })

const loadUserInfo = async () => {
  loading.value = true
  try {
    userInfo.value = await getUserInfo()
    // 同步到 store
    if (userInfo.value) authStore.setUser(userInfo.value)
  } catch {
    message.error('获取用户信息失败')
  } finally {
    loading.value = false
  }
}

const handleSave = async () => {
  if (!editForm.nickname.trim()) {
    message.warning('昵称不能为空')
    return
  }
  saving.value = true
  try {
    await updateUserInfo({ nickname: editForm.nickname, email: editForm.email })
    message.success('更新成功')
    showEditModal.value = false
    await loadUserInfo()
  } catch {
    message.error('更新失败')
  } finally {
    saving.value = false
  }
}

const handleLogout = async () => {
  await authStore.logout()
  message.success('已退出登录')
  router.replace('/')
}

// 监听弹窗打开
import { watch } from 'vue'
watch(showEditModal, (val) => {
  if (val) {
    editForm.nickname = userInfo.value?.nickname || ''
    editForm.email = userInfo.value?.email || ''
  }
})

onMounted(loadUserInfo)
</script>

<style scoped>
.profile-page {
  padding: 0;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h2 {
  font-size: 22px;
  font-weight: 600;
  margin: 0 0 4px;
}

.subtitle {
  color: #8c8c8c;
  margin: 0;
  font-size: 14px;
}

.info-card {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 24px;
}

.card-title {
  padding: 14px 20px;
  font-weight: 600;
  font-size: 15px;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
}

.info-row {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  gap: 16px;
}

.label {
  width: 80px;
  color: #8c8c8c;
  font-size: 14px;
  flex-shrink: 0;
}

.value {
  flex: 1;
  font-size: 14px;
  color: #262626;
}

.hint {
  font-size: 12px;
  color: #bfbfbf;
}

.action-row {
  display: flex;
  gap: 12px;
}
</style>
