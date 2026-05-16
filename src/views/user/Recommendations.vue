<template>
  <div class="recommendations-page">
    <div class="page-header">
      <h1>
        <HeartOutlined />
        为您推荐
      </h1>
      <p class="subtitle">基于您的兴趣和行为，为您精选的图书</p>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-wrap">
      <a-row :gutter="[16, 16]">
        <a-col v-for="i in 20" :key="i" :xs="12" :sm="8" :md="6" :lg="4">
          <a-skeleton-image style="width: 100%; height: 240px" />
          <a-skeleton :paragraph="{ rows: 2 }" style="margin-top: 8px" />
        </a-col>
      </a-row>
    </div>

    <!-- 空状态 -->
    <a-empty
      v-else-if="books.length === 0"
      description="暂无推荐，快去浏览和收藏图书吧"
      style="margin: 80px 0"
    >
      <template #image>
        <span style="font-size: 64px">📚</span>
      </template>
      <template #extra>
        <a-button type="primary" @click="router.push('/ebooks')">
          去浏览图书
        </a-button>
      </template>
    </a-empty>

    <!-- 推荐列表 -->
    <div v-else>
      <a-row :gutter="[16, 16]">
        <a-col
          v-for="book in books"
          :key="book.bookId"
          :xs="12"
          :sm="8"
          :md="6"
          :lg="4"
        >
          <div class="book-card" @click="handleBookClick(book)">
            <div class="book-cover">
              <img
                :src="getCoverUrl(book.coverImg)"
                :alt="book.bookTitle"
                @error="handleImageError"
              />
            </div>
            <div class="book-info">
              <h3 class="book-title">{{ book.bookTitle }}</h3>
              <p class="book-author">{{ book.author }}</p>
              <div class="book-rating">
                <StarFilled class="star-icon" />
                <span>{{ book.rating }}</span>
                <span class="rating-count">({{ book.ratingCount }})</span>
              </div>
              <div class="book-price">¥{{ (book.price / 100).toFixed(2) }}</div>
            </div>
          </div>
        </a-col>
      </a-row>

      <!-- 加载更多 -->
      <div v-if="hasMore" class="load-more">
        <a-button
          type="primary"
          size="large"
          :loading="loadingMore"
          @click="loadMore"
        >
          {{ loadingMore ? '加载中...' : '加载更多' }}
        </a-button>
      </div>

      <!-- 全部加载完成 -->
      <div v-else class="load-complete">
        <a-divider>已加载全部推荐</a-divider>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { HeartOutlined, StarFilled } from '@ant-design/icons-vue'
import type { EBook } from '@/types/ebook'
import { getPersonalizedRecommendations } from '@/api/recommend'
import { getCoverUrl, getDefaultCover } from '@/utils/image'

const router = useRouter()

const books = ref<EBook[]>([])
const loading = ref(false)
const loadingMore = ref(false)
const hasMore = ref(true)
const currentLimit = ref(20)

// 加载推荐
const loadRecommendations = async (append = false) => {
  if (append) {
    loadingMore.value = true
  } else {
    loading.value = true
  }

  try {
    const newBooks = await getPersonalizedRecommendations(currentLimit.value)

    if (append) {
      books.value = [...books.value, ...newBooks]
    } else {
      books.value = newBooks
    }

    // 如果返回的数量少于请求的数量，说明没有更多了
    if (newBooks.length < currentLimit.value) {
      hasMore.value = false
    }
  } catch (error: any) {
    console.error('加载推荐失败:', error)
    message.error('加载推荐失败')
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

// 加载更多
const loadMore = () => {
  currentLimit.value += 20
  loadRecommendations(true)
}

// 图片加载失败处理
const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.src = getDefaultCover()
}

// 点击图书
const handleBookClick = (book: EBook) => {
  router.push(`/ebooks/${book.bookId}`)
}

onMounted(() => {
  loadRecommendations()
})
</script>

<style scoped>
.recommendations-page {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 32px;
}

.page-header h1 {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 0 8px 0;
  font-size: 32px;
  font-weight: 600;
}

.subtitle {
  color: #666;
  font-size: 16px;
  margin: 0;
}

.book-card {
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
}

.book-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.book-cover {
  position: relative;
  width: 100%;
  padding-top: 140%;
  background: #f5f5f5;
  overflow: hidden;
}

.book-cover img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.book-info {
  padding: 12px;
}

.book-title {
  font-size: 14px;
  font-weight: 500;
  margin: 0 0 4px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.4;
  min-height: 40px;
}

.book-author {
  font-size: 12px;
  color: #666;
  margin: 0 0 8px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.book-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  margin-bottom: 8px;
}

.star-icon {
  color: #faad14;
}

.rating-count {
  color: #999;
}

.book-price {
  font-size: 18px;
  font-weight: 600;
  color: #ff4d4f;
}

.load-more {
  text-align: center;
  margin: 48px 0 24px;
}

.load-complete {
  margin: 48px 0 24px;
  text-align: center;
  color: #999;
}

.loading-wrap {
  margin-top: 24px;
}
</style>
