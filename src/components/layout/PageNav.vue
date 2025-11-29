<template>
  <div v-if="showNav" class="page-nav">
    <div class="back-button" @click="handleBack">
      <LeftOutlined />
      <span></span>
    </div>
    <div class="breadcrumb">
      <template v-for="(item, index) in breadcrumbItems" :key="index">
        <a
          v-if="index < breadcrumbItems.length - 1"
          class="breadcrumb-link"
          @click="handleNavigate(item.path)"
        >
          {{ item.name }}
        </a>
        <span v-else class="breadcrumb-current">{{ item.name }}</span>
        <span v-if="index < breadcrumbItems.length - 1" class="breadcrumb-separator"> / </span>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { LeftOutlined } from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()

// 是否显示页面导航栏
const showNav = computed(() => {
  return route.meta.showPageNav !== false && route.path !== '/'
})

// 生成面包屑项
const breadcrumbItems = computed(() => {
  const items: Array<{ name: string; path: string }> = [
    { name: 'Main', path: '/' }
  ]

  const matched = route.matched.filter(record => record.meta.breadcrumb)
  
  matched.forEach(record => {
    items.push({
      name: record.meta.breadcrumb as string,
      path: record.path
    })
  })

  return items
})

// 返回上一页
const handleBack = () => {
  router.back()
}

// 导航到指定路径
const handleNavigate = (path: string) => {
  router.push(path)
}
</script>

<style scoped>
.page-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  background: #f5f5f5;
  border-bottom: 1px solid #e8e8e8;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #999;
  cursor: pointer;
  font-size: 14px;
  user-select: none;
  transition: color 0.3s;
}

.back-button:hover {
  color: #666;
}

.breadcrumb {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #1890ff;
}

.breadcrumb-link {
  color: #1890ff;
  cursor: pointer;
  text-decoration: none;
  transition: text-decoration 0.3s;
}

.breadcrumb-link:hover {
  text-decoration: underline;
}

.breadcrumb-current {
  color: #1890ff;
}

.breadcrumb-separator {
  color: #1890ff;
  margin: 0 8px;
}

@media (max-width: 768px) {
  .page-nav {
    padding: 8px 16px;
  }
  
  .breadcrumb {
    font-size: 12px;
  }
  
  .breadcrumb-separator {
    margin: 0 4px;
  }
}
</style>
