<template>
  <MainLayout>
    <div class="ebooks-page">
      <!-- 搜索栏 -->
      <SearchBar @search="handleSearch" />

      <!-- 书籍列表 -->
      <div class="books-container">
        <!-- 加载状态 -->
        <div v-if="loading && books.length === 0" class="loading-skeleton">
          <a-row :gutter="[24, 24]">
            <a-col v-for="i in 20" :key="i" :xs="12" :sm="8" :md="6" :lg="4">
              <a-skeleton-image style="width: 100%; height: 280px" />
            </a-col>
          </a-row>
        </div>

        <!-- 书籍网格 -->
        <a-row v-else-if="books.length > 0" :gutter="[24, 24]">
          <a-col
            v-for="book in books"
            :key="book.bookId"
            :xs="12"
            :sm="8"
            :md="6"
            :lg="4"
          >
            <EBookCard :book="book" />
          </a-col>
        </a-row>

        <!-- 空状态 -->
        <a-empty
          v-else
          description="暂无电子书"
          style="margin: 80px 0"
        >
          <template #image>
            <span style="font-size: 64px">📚</span>
          </template>
        </a-empty>

        <!-- 加载更多按钮 -->
        <div v-if="books.length > 0 && hasMore" class="load-more">
          <a-button
            type="primary"
            size="large"
            :loading="loading"
            @click="loadMore"
          >
            {{ loading ? '加载中...' : `加载更多 (剩余 ${remainingCount} 本)` }}
          </a-button>
        </div>

        <!-- 全部加载完成 -->
        <div v-if="books.length > 0 && !hasMore" class="load-complete">
          <a-divider>已加载全部 {{ totalCount }} 本电子书</a-divider>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import MainLayout from '@/components/layout/MainLayout.vue'
import SearchBar from '@/components/ebook/SearchBar.vue'
import EBookCard from '@/components/ebook/EBookCard.vue'
import { searchEBooks } from '@/api/ebook'
import type { EBook, EBookSearchParam } from '@/types/ebook'

const books = ref<EBook[]>([])
const loading = ref(false)
const totalCount = ref(0)
const currentPage = ref(1)
const pageSize = 20
const searchParams = ref<Partial<EBookSearchParam>>({})

// 是否还有更多数据
const hasMore = computed(() => {
  return books.value.length < totalCount.value
})

// 剩余数量
const remainingCount = computed(() => {
  return Math.max(0, totalCount.value - books.value.length)
})

// 加载电子书列表
const loadBooks = async (append = false) => {
  try {
    loading.value = true
    const params: EBookSearchParam = {
      ...searchParams.value,
      pageNum: currentPage.value,
      pageSize,
    }

    const result = await searchEBooks(params)

    if (append) {
      books.value = [...books.value, ...result.list]
    } else {
      books.value = result.list
    }

    totalCount.value = result.totalCount
  } catch (error: any) {
    message.error(error.message || '加载失败')
  } finally {
    loading.value = false
  }
}

// 搜索处理
const handleSearch = (params: Partial<EBookSearchParam>) => {
  searchParams.value = params
  currentPage.value = 1
  loadBooks(false)
}

// 加载更多
const loadMore = () => {
  if (loading.value || !hasMore.value) return
  currentPage.value++
  loadBooks(true)
}

// 初始加载
onMounted(() => {
  loadBooks()
})
</script>

<style scoped>
.ebooks-page {
  padding: 24px;
}

.books-container {
  max-width: 1400px;
  margin: 24px auto 0;
}

.loading-skeleton {
  margin-top: 24px;
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
</style>
