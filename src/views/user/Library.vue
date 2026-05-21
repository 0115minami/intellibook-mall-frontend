<template>
  <div class="library-page">
    <div class="page-header">
      <h2>我的书架</h2>
      <p class="subtitle">管理您购买的电子书（{{ totalCount }}）</p>
    </div>

    <!-- 排序栏 -->
    <div class="filter-bar">
      <a-select v-model:value="sortBy" style="width: 140px" @change="loadLibrary">
        <a-select-option value="recent">最近阅读</a-select-option>
        <a-select-option value="purchase">购买时间</a-select-option>
        <a-select-option value="title">书名</a-select-option>
      </a-select>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-wrap">
      <a-row :gutter="[16, 20]">
        <a-col v-for="i in 6" :key="i" :xs="24" :sm="12">
          <a-skeleton active :avatar="{ size: 80, shape: 'square' }" :paragraph="{ rows: 3 }" />
        </a-col>
      </a-row>
    </div>

    <!-- 空状态 -->
    <a-empty
      v-else-if="list.length === 0"
      description="书架空空如也，快去购买喜欢的书吧"
      style="margin: 60px 0"
    >
      <template #image><span style="font-size: 48px">📚</span></template>
      <template #extra>
        <a-button type="primary" @click="router.push('/ebooks')">去书城</a-button>
      </template>
    </a-empty>

    <!-- 书架列表 -->
    <div v-else class="book-list">
      <div v-for="item in list" :key="item.bookId" class="book-item">
        <!-- 封面 -->
        <img
          :src="getCoverUrl(item.coverImg)"
          :alt="item.bookTitle"
          class="book-cover"
          @error="onImgError"
          @click="router.push(`/ebooks/${item.bookId}`)"
        />

        <!-- 信息 -->
        <div class="book-info">
          <div class="book-title" @click="router.push(`/ebooks/${item.bookId}`)">
            {{ item.bookTitle }}
          </div>
          <div class="book-author">{{ item.author }}</div>

          <!-- 评分 -->
          <div class="book-rating">
            <a-rate :value="item.rating" disabled allow-half style="font-size: 13px" />
            <span class="rating-num">{{ item.rating }}</span>
          </div>

          <!-- 格式标签 -->
          <div class="format-tags">
            <a-tag
              v-for="fmt in (item.availableFormats || '').split(',').filter(Boolean)"
              :key="fmt"
              color="blue"
              style="font-size: 11px"
            >
              {{ fmt.toUpperCase() }}
            </a-tag>
          </div>

          <!-- 阅读进度 -->
          <div v-if="item.hasReadingProgress" class="read-progress">
            <ReadOutlined />
            上次阅读：{{ formatDate(item.lastReadTime!) }}
            <span v-if="item.lastReadFormat">（{{ item.lastReadFormat.toUpperCase() }}）</span>
          </div>
          <div v-else class="read-progress unread">
            <BookOutlined />
            尚未阅读
          </div>

          <!-- 购买时间 -->
          <div class="purchase-time">购买于 {{ formatDate(item.purchaseTime) }}</div>
        </div>

        <!-- 操作按钮 -->
        <div class="book-actions">
          <!-- 阅读按钮：优先 PDF，否则选第一个格式 -->
          <a-button
            type="primary"
            @click="handleRead(item)"
          >
            <ReadOutlined />
            {{ item.hasReadingProgress ? '继续阅读' : '开始阅读' }}
          </a-button>

          <a-button @click="router.push(`/ebooks/${item.bookId}`)">
            查看详情
          </a-button>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div v-if="totalCount > pageSize" class="pagination">
      <a-pagination
        v-model:current="currentPage"
        :total="totalCount"
        :page-size="pageSize"
        show-quick-jumper
        @change="loadLibrary"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onActivated } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { ReadOutlined, BookOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import { getBookshelfList } from '@/api/user-center'
import { getCoverUrl, getDefaultCover } from '@/utils/image'
import type { BookshelfItem } from '@/types/user-center'

const router = useRouter()

const loading = ref(false)
const list = ref<BookshelfItem[]>([])
const totalCount = ref(0)
const currentPage = ref(1)
const pageSize = 10
const sortBy = ref<'recent' | 'purchase' | 'title'>('recent')

const loadLibrary = async () => {
  loading.value = true
  try {
    const res = await getBookshelfList({
      page: currentPage.value,
      pageSize,
      sortBy: sortBy.value,
    })
    list.value = res.list
    totalCount.value = res.totalCount
  } catch {
    message.error('加载书架失败')
  } finally {
    loading.value = false
  }
}

// 进入阅读器
const handleRead = (item: BookshelfItem) => {
  // 优先选 PDF，否则选第一个可用格式
  const formats = (item.availableFormats || '').split(',').filter(Boolean)
  const preferFormat = formats.includes('pdf') ? 'pdf' : (formats[0] || 'pdf')
  router.push({
    name: 'Reader',
    params: { bookId: item.bookId },
    query: { format: preferFormat, title: item.bookTitle },
  })
}

const onImgError = (e: Event) => {
  (e.target as HTMLImageElement).src = getDefaultCover()
}

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return '—'
  return dayjs(dateStr).format('YYYY/MM/DD')
}

onMounted(loadLibrary)
// 从阅读器返回时（如果组件被 keep-alive 缓存），也重新加载
onActivated(loadLibrary)
</script>

<style scoped>
.library-page { padding: 0; }

.page-header { margin-bottom: 20px; }
.page-header h2 { font-size: 22px; font-weight: 600; margin: 0 0 4px; }
.subtitle { color: #8c8c8c; margin: 0; font-size: 14px; }

.filter-bar { margin-bottom: 20px; }

.loading-wrap { padding: 20px 0; }

/* 书架列表 */
.book-list { display: flex; flex-direction: column; gap: 16px; }

.book-item {
  display: flex;
  gap: 20px;
  padding: 20px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  align-items: flex-start;
  transition: box-shadow 0.2s;
}
.book-item:hover { box-shadow: 0 2px 10px rgba(0,0,0,0.08); }

.book-cover {
  width: 80px;
  height: 112px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(0,0,0,0.12);
}

.book-info { flex: 1; min-width: 0; }

.book-title {
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.book-title:hover { color: #1677ff; }

.book-author { font-size: 13px; color: #8c8c8c; margin-bottom: 8px; }

.book-rating {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}
.rating-num { font-size: 13px; color: #faad14; }

.format-tags { margin-bottom: 8px; }

.read-progress {
  font-size: 12px;
  color: #1677ff;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 4px;
}
.read-progress.unread { color: #8c8c8c; }

.purchase-time { font-size: 12px; color: #bfbfbf; }

.book-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
  align-self: center;
}

.pagination { margin-top: 24px; text-align: center; }
</style>
