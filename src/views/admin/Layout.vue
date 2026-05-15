<template>
  <a-layout class="admin-layout">
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
      <div class="logo">
        <span v-if="!collapsed">管理后台</span>
        <span v-else>后台</span>
      </div>
      <a-menu
        v-model:selectedKeys="selectedKeys"
        theme="dark"
        mode="inline"
        @click="handleMenuClick"
      >
        <a-menu-item key="dashboard">
          <DashboardOutlined />
          <span>仪表盘</span>
        </a-menu-item>
        <a-menu-item key="books">
          <BookOutlined />
          <span>图书管理</span>
        </a-menu-item>
        <a-menu-item key="orders">
          <ShoppingOutlined />
          <span>订单管理</span>
        </a-menu-item>
        <a-menu-item key="users">
          <UserOutlined />
          <span>用户管理</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="admin-header">
        <MenuUnfoldOutlined
          v-if="collapsed"
          class="trigger"
          @click="() => (collapsed = !collapsed)"
        />
        <MenuFoldOutlined
          v-else
          class="trigger"
          @click="() => (collapsed = !collapsed)"
        />
        <div class="header-right">
          <a-dropdown>
            <a class="ant-dropdown-link" @click.prevent>
              <UserOutlined />
              <span class="username">{{ authStore.user?.nickname || '管理员' }}</span>
              <DownOutlined />
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item key="logout" @click="handleLogout">
                  <LogoutOutlined />
                  退出登录
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>
      <a-layout-content class="admin-content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import { useAuthStore } from '@/stores/auth'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DashboardOutlined,
  BookOutlined,
  ShoppingOutlined,
  UserOutlined,
  DownOutlined,
  LogoutOutlined,
} from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const collapsed = ref(false)
const selectedKeys = ref<string[]>(['dashboard'])

// 根据当前路由设置选中的菜单项
watch(
  () => route.path,
  (path) => {
    if (path.includes('/admin/books')) {
      selectedKeys.value = ['books']
    } else if (path.includes('/admin/orders')) {
      selectedKeys.value = ['orders']
    } else if (path.includes('/admin/users')) {
      selectedKeys.value = ['users']
    } else {
      selectedKeys.value = ['dashboard']
    }
  },
  { immediate: true }
)

const handleMenuClick = ({ key }: { key: string }) => {
  router.push(`/admin/${key}`)
}

const handleLogout = async () => {
  try {
    console.log('Logging out...')
    await authStore.logout()
    console.log('Logout complete, isAuthenticated:', authStore.isAuthenticated)
    message.success('已退出登录')
    console.log('Redirecting to home...')
    // 使用 replace 而不是 push，避免历史记录问题
    await router.replace('/')
    console.log('Redirected to home')
  } catch (error) {
    console.error('Logout error:', error)
    message.error('退出登录失败')
    // 即使出错也要跳转到首页
    router.replace('/')
  }
}
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
}

.logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  background: rgba(255, 255, 255, 0.1);
}

.admin-header {
  background: #fff;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.trigger {
  font-size: 18px;
  cursor: pointer;
  transition: color 0.3s;
}

.trigger:hover {
  color: #1890ff;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.username {
  margin: 0 8px;
}

.admin-content {
  margin: 24px;
  padding: 24px;
  background: #fff;
  min-height: 280px;
}
</style>
