<template>
  <a-layout-header class="app-header">
    <div class="header-container">
      <div class="logo" @click="router.push('/')">📚 IntelliBook Mall</div>
      <a-menu
        v-model:selectedKeys="selectedKeys"
        mode="horizontal"
        class="nav-menu"
      >
        <a-menu-item key="home">
          <router-link to="/">首页</router-link>
        </a-menu-item>
        <a-menu-item key="ebooks">
          <router-link to="/ebooks">电子书</router-link>
        </a-menu-item>
      </a-menu>
      <div class="user-actions">
        <template v-if="authStore.isAuthenticated">
          <a-badge :count="cartStore.count" :offset="[-2, 4]">
            <a-button type="link" @click="router.push('/cart')">
              <ShoppingCartOutlined />
              购物车
            </a-button>
          </a-badge>
          <a-dropdown>
            <a-button type="link">
              <UserOutlined />
              {{ authStore.user?.nickname }}
            </a-button>
            <template #overlay>
              <a-menu>
                <a-menu-item @click="router.push('/user/profile')">
                  个人中心
                </a-menu-item>
                <a-menu-item @click="router.push('/user/library')">
                  我的书架
                </a-menu-item>
                <a-menu-item @click="router.push('/orders')">
                  我的订单
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item @click="handleLogout">退出登录</a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </template>
        <template v-else>
          <a-button type="link" @click="authModalStore.openLogin()">
            登录
          </a-button>
          <a-button type="primary" @click="authModalStore.openRegister()">
            注册
          </a-button>
        </template>
      </div>
    </div>
  </a-layout-header>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import { UserOutlined, ShoppingCartOutlined } from '@ant-design/icons-vue'
import { useAuthStore } from '@/stores/auth'
import { useAuthModalStore } from '@/stores/authModal'
import { useCartStore } from '@/stores/cart'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const authModalStore = useAuthModalStore()
const cartStore = useCartStore()

const selectedKeys = ref<string[]>(['home'])

// 根据当前路由更新选中的菜单项
watch(
  () => route.path,
  (path) => {
    if (path === '/') {
      selectedKeys.value = ['home']
    } else if (path.startsWith('/ebooks')) {
      selectedKeys.value = ['ebooks']
    }
  },
  { immediate: true }
)

const handleLogout = async () => {
  await authStore.logout()
  cartStore.reset()
  message.success('已退出登录')
  router.push('/')
}

onMounted(() => {
  if (authStore.isAuthenticated) cartStore.fetchCount()
})
</script>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 0;
  height: 64px;
  line-height: 64px;
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
}

.logo {
  font-size: 20px;
  font-weight: bold;
  margin-right: 48px;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
}

.nav-menu {
  flex: 1;
  min-width: 0;
  border-bottom: none;
  line-height: 64px;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

@media (max-width: 768px) {
  .logo {
    font-size: 16px;
    margin-right: 24px;
  }
  
  .header-container {
    padding: 0 16px;
  }
}
</style>
