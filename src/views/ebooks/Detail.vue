<template>
  <div class="ebook-detail-page">
    <a-card>
      <a-result
        status="info"
        title="电子书详情页"
        sub-title="此页面待实现"
      >
        <template #icon>
          <span style="font-size: 72px">📖</span>
        </template>
        <template #extra>
          <a-space>
            <a-button type="primary" @click="$router.back()">
              返回
            </a-button>
            <a-button @click="$router.push('/ebooks')">
              浏览更多电子书
            </a-button>
          </a-space>
        </template>
        <div class="detail-info">
          <p>书籍 ID: {{ bookId }}</p>
        </div>
      </a-result>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const bookId = route.params.id
</script>

<style scoped>
.ebook-detail-page {
  min-height: 100vh;
  background: #f0f2f5;
  padding: 24px;
}

.detail-info {
  margin-top: 24px;
  color: #666;
}
</style>
