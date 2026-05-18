<template>
  <MainLayout>
    <div class="user-center">
      <!-- 左侧边栏 -->
      <aside class="sidebar">
        <!-- 用户头像和基本信息 -->
        <div class="user-card">
          <div class="avatar">
            <UserOutlined />
          </div>
          <div class="user-name">{{ authStore.user?.nickname || authStore.user?.username }}</div>
          <div class="user-email">{{ authStore.user?.email }}</div>
          <div class="user-id">ID: {{ authStore.user?.userId }}</div>
        </div>

        <!-- 导航菜单 -->
        <a-menu
          v-model:selectedKeys="selectedKeys"
          mode="inline"
          class="side-menu"
          @click="handleMenuClick"
        >
          <a-menu-item key="library">
            <template #icon><ReadOutlined /></template>
            我的书架
          </a-menu-item>
          <a-menu-item key="favorites">
            <template #icon><HeartOutlined /></template>
            我的收藏
          </a-menu-item>
          <a-menu-item key="reviews">
            <template #icon><CommentOutlined /></template>
            我的评论
          </a-menu-item>
          <a-menu-item key="profile">
            <template #icon><SettingOutlined /></template>
            个人资料
          </a-menu-item>
        </a-menu>
      </aside>

      <!-- 右侧内容区 -->
      <main class="content">
        <router-view />
      </main>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  UserOutlined,
  ReadOutlined,
  HeartOutlined,
  CommentOutlined,
  SettingOutlined,
} from '@ant-design/icons-vue'
import MainLayout from '@/components/layout/MainLayout.vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const selectedKeys = ref<string[]>(['profile'])

// 根据路由同步菜单选中状态
watch(
  () => route.path,
  (path) => {
    if (path.includes('/user/library')) selectedKeys.value = ['library']
    else if (path.includes('/user/favorites')) selectedKeys.value = ['favorites']
    else if (path.includes('/user/reviews')) selectedKeys.value = ['reviews']
    else if (path.includes('/user/profile')) selectedKeys.value = ['profile']
  },
  { immediate: true }
)

const handleMenuClick = ({ key }: { key: string }) => {
  router.push(`/user/${key}`)
}
</script>

<style scoped>
.user-center {
  display: flex;
  gap: 24px;
  max-width: 1100px;
  margin: 32px auto;
  padding: 0 24px;
  align-items: flex-start;
}

/* 左侧边栏 */
.sidebar {
  width: 200px;
  flex-shrink: 0;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.user-card {
  padding: 24px 16px;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #e6f4ff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
  font-size: 28px;
  color: #1677ff;
}

.user-name {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 4px;
}

.user-email {
  font-size: 12px;
  color: #8c8c8c;
  margin-bottom: 2px;
  word-break: break-all;
}

.user-id {
  font-size: 12px;
  color: #bfbfbf;
}

.side-menu {
  border-inline-end: none !important;
}

/* 右侧内容 */
.content {
  flex: 1;
  min-width: 0;
  background: #fff;
  border-radius: 8px;
  padding: 32px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  min-height: 500px;
}
</style>
