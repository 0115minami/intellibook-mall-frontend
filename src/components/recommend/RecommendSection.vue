<template>
  <div class="recommend-section">
    <div class="section-header">
      <h2>
        <component :is="icon" v-if="icon" class="section-icon" />
        {{ title }}
      </h2>
      <a-button v-if="showMore" type="link" @click="handleMore">
        查看更多 <RightOutlined />
      </a-button>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-skeleton">
      <a-row :gutter="[16, 16]">
        <a-col v-for="i in limit" :key="i" :xs="12" :sm="8" :md="6" :lg="layout === 'grid' ? 4 : 3">
          <a-skeleton-image style="width: 100%; height: 240px" />
          <a-skeleton :paragraph="{ rows: 2 }" style="margin-top: 8px" />
        </a-col>
      </a-row>
    </div>

    <!-- 空状态 -->
    <a-empty v-else-if="books.length === 0" description="暂无推荐" style="margin: 40px 0">
      <template #image>
        <span style="font-size: 48px">📚</span>
      </template>
    </a-empty>

    <!-- 图书列表 -->
    <div v-else>
      <!-- 横向滚动布局 -->
      <div v-if="layout === 'scroll'" class="scroll-container">
        <div class="scroll-wrapper">
          <div
            v-for="book in books"
            :key="book.bookId"
            class="book-card-scroll"
            @click="handleBookClick(book)"
          >
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
        </div>
      </div>

      <!-- 网格布局 -->
      <a-row v-else :gutter="[16, 16]">
        <a-col
          v-for="book in books"
          :key="book.bookId"
          :xs="12"
          :sm="8"
          :md="6"
          :lg="layout === 'grid' ? 5 : 3"
        >
          <div class="book-card-grid" @click="handleBookClick(book)">
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
              </div>
              <div class="book-price">¥{{ (book.price / 100).toFixed(2) }}</div>
            </div>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { StarFilled, RightOutlined } from '@ant-design/icons-vue'
import type { EBook } from '@/types/ebook'
import { getRecommendations } from '@/api/recommend'
import { getCoverUrl, getDefaultCover } from '@/utils/image'
import { useAuthStore } from '@/stores/auth'

interface Props {
  title?: string
  icon?: any
  limit?: number
  layout?: 'scroll' | 'grid'
  showMore?: boolean
  usePersonalized?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '推荐图书',
  limit: 10,
  layout: 'scroll',
  showMore: false,
  usePersonalized: true,
})

const router = useRouter()
const authStore = useAuthStore()

const books = ref<EBook[]>([])
const loading = ref(false)

// 加载推荐
const loadRecommendations = async () => {
  loading.value = true
  try {
    const isAuthenticated = props.usePersonalized && authStore.isAuthenticated
    books.value = await getRecommendations(props.limit, isAuthenticated)
  } catch (error: any) {
    console.error('加载推荐失败:', error)
    message.error('加载推荐失败')
  } finally {
    loading.value = false
  }
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

// 查看更多
const handleMore = () => {
  router.push('/ebooks')
}

onMounted(() => {
  loadRecommendations()
})
</script>

<style scoped>
.recommend-section {
  margin: 48px 0;
  padding: 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 0;
}

.section-header h2 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.section-icon {
  font-size: 28px;
}

/* 横向滚动布局 */
.scroll-container {
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  margin: 0 -24px;
  padding: 0 24px;
}

.scroll-container::-webkit-scrollbar {
  height: 6px;
}

.scroll-container::-webkit-scrollbar-thumb {
  background: #d9d9d9;
  border-radius: 3px;
}

.scroll-wrapper {
  display: flex;
  gap: 16px;
  padding-bottom: 8px;
}

.book-card-scroll {
  flex: 0 0 180px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.book-card-scroll:hover {
  transform: translateY(-4px);
}

/* 网格布局 */
.book-card-grid {
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  height: 100%;
}

.book-card-grid:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

/* 封面 */
.book-cover {
  position: relative;
  width: 100%;
  padding-top: 140%;
  background: #f5f5f5;
  overflow: hidden;
  border-radius: 8px 8px 0 0;
}

.book-cover img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 图书信息 */
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

.loading-skeleton {
  margin-top: 16px;
}
</style>
