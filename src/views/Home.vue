<template>
  <div class="home">
    <!-- 顶部导航 -->
    <a-layout>
      <a-layout-header class="header">
        <div class="container">
          <div class="logo">📚 IntelliBook Mall</div>
          <a-menu
            v-model:selectedKeys="selectedKeys"
            mode="horizontal"
            :style="{ lineHeight: '64px', flex: 1, minWidth: 0 }"
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
              <a-button type="link" @click="router.push('/cart')">
                <ShoppingCartOutlined />
                购物车
              </a-button>
              <a-dropdown>
                <a-button type="link">
                  <UserOutlined />
                  {{ authStore.user?.nickname }}
                </a-button>
                <template #overlay>
                  <a-menu>
                    <a-menu-item v-if="authStore.isAdmin" @click="router.push('/admin/dashboard')">
                      <DashboardOutlined />
                      管理后台
                    </a-menu-item>
                    <a-menu-divider v-if="authStore.isAdmin" />
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

      <a-layout-content class="content">
        <!-- Hero Section -->
        <div class="hero">
          <div class="container">
            <h1>欢迎来到 IntelliBook Mall</h1>
            <a-space size="large">
              <a-button type="primary" size="large" @click="router.push('/ebooks')">
                浏览电子书
              </a-button>
            </a-space>
          </div>
        </div>

        <!-- 主要内容区域 -->
        <div class="container">
          <!-- 功能展示 -->
          <a-row :gutter="[24, 24]" style="margin-top: 48px">
            <a-col :xs="24" :sm="12" :md="8">
              <a-card hoverable>
                <template #cover>
                  <div class="card-icon">📖</div>
                </template>
                <a-card-meta
                  title="丰富的电子书库"
                  description="海量电子书资源，涵盖各个领域"
                />
              </a-card>
            </a-col>
            <a-col :xs="24" :sm="12" :md="8">
              <a-card hoverable>
                <template #cover>
                  <div class="card-icon">🎯</div>
                </template>
                <a-card-meta
                  title="智能推荐系统"
                  description="基于用户行为的个性化推荐"
                />
              </a-card>
            </a-col>
            <a-col :xs="24" :sm="12" :md="8">
              <a-card hoverable>
                <template #cover>
                  <div class="card-icon">📱</div>
                </template>
                <a-card-meta
                  title="在线阅读"
                  description="支持 PDF、EPUB 等多种格式"
                />
              </a-card>
            </a-col>
          </a-row>

          <!-- 热门推荐区域 -->
          <RecommendSection
            title="🔥 热门推荐"
            :limit="12"
            layout="scroll"
            :show-more="true"
            :use-personalized="false"
          />
        </div>
      </a-layout-content>

      <a-layout-footer class="footer">
        <div class="container">
          IntelliBook Mall ©2024 Created with Vite + Vue 3 + Ant Design Vue
        </div>
      </a-layout-footer>
    </a-layout>

    <!-- 测试对话框 -->
    <a-modal
      v-model:open="showTestModal"
      title="Ant Design Vue 组件测试"
      width="600px"
      @ok="showTestModal = false"
    >
      <a-space direction="vertical" :size="16" style="width: 100%">
        <div>
          <h4>按钮组件</h4>
          <a-space wrap>
            <a-button type="primary">主要按钮</a-button>
            <a-button>默认按钮</a-button>
            <a-button type="dashed">虚线按钮</a-button>
            <a-button type="link">链接按钮</a-button>
            <a-button danger>危险按钮</a-button>
          </a-space>
        </div>

        <div>
          <h4>输入框组件</h4>
          <a-input v-model:value="testInput" placeholder="请输入内容" />
          <p style="margin-top: 8px; color: #666">输入的内容: {{ testInput }}</p>
        </div>

        <div>
          <h4>消息提示</h4>
          <a-space wrap>
            <a-button @click="message.success('成功提示')">成功</a-button>
            <a-button @click="message.error('错误提示')">错误</a-button>
            <a-button @click="message.warning('警告提示')">警告</a-button>
            <a-button @click="message.info('信息提示')">信息</a-button>
          </a-space>
        </div>
      </a-space>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { UserOutlined, ShoppingCartOutlined, DashboardOutlined } from '@ant-design/icons-vue'
import { useAuthStore } from '@/stores/auth'
import { useAuthModalStore } from '@/stores/authModal'
import RecommendSection from '@/components/recommend/RecommendSection.vue'

const router = useRouter()
const authStore = useAuthStore()
const authModalStore = useAuthModalStore()

const selectedKeys = ref(['home'])
const showTestModal = ref(false)
const testInput = ref('')

const handleLogout = async () => {
  await authStore.logout()
  message.success('已退出登录')
  router.push('/')
}
</script>

<style scoped>
.header {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header .container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px 48px;
}

.logo {
  font-size: 20px;
  font-weight: bold;
  margin-right: 48px;
  white-space: nowrap;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

.content {
  min-height: calc(100vh - 64px - 70px);
  background: #f0f2f5;
}

.hero {
  text-align: center;
  padding: 80px 24px;
  background: #fff;
  margin-bottom: 48px;
}

.hero h1 {
  font-size: 48px;
  margin-bottom: 16px;
}

.hero p {
  font-size: 20px;
  color: #666;
  margin-bottom: 32px;
}

.card-icon {
  font-size: 64px;
  text-align: center;
  padding: 40px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.footer {
  text-align: center;
  background: #001529;
  color: rgba(255, 255, 255, 0.65);
}
</style>
