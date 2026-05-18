<template>
  <div class="favorites-page">
    <div class="page-header">
      <h2>我的收藏</h2>
      <p class="subtitle">管理您收藏的电子书（{{ totalCount }}）</p>
    </div>

    <!-- 筛选栏 -->
    <div class="filter-bar">
      <a-select
        v-model:value="filterCategory"
        style="width: 140px"
        placeholder="全部分类"
        allow-clear
        @change="applyFilter"
      >
        <a-select-option
          v-for="cat in categories"
          :key="cat"
          :value="cat"
        >
          {{ cat }}
        </a-select-option>
      </a-select>

      <a-select v-model:value="sortOrder" style="width: 120px" @change="applyFilter">
        <a-select-option value="desc">收藏时间↓</a-select-option>
        <a-select-option value="asc">收藏时间↑</a-select-option>
      </a-select>

      <!-- 视图切换 -->
      <div class="view-toggle">
        <a-button
          :type="viewMode === 'grid' ? 'primary' : 'default'"
          size="small"
          @click="viewMode = 'grid'"
        >
          <AppstoreOutlined />
        </a-button>
        <a-button
          :type="viewMode === 'list' ? 'primary' : 'default'"
          size="small"
          @click="viewMode = 'list'"
        >
          <UnorderedListOutlined />
        </a-button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-wrap">
      <a-spin size="large" />
    </div>

    <!-- 空状态 -->
    <a-empty
      v-else-if="displayList.length === 0"
      description="暂无收藏"
      style="margin: 60px 0"
    >
      <template #image><span style="font-size: 48px">💔</span></template>
      <template #extra>
        <a-button type="primary" @click="router.push('/ebooks')">去逛逛</a-button>
      </template>
    </a-empty>

    <!-- 网格视图 -->
    <a-row v-else-if="viewMode === 'grid'" :gutter="[16, 20]">
      <a-col
        v-for="item in displayList"
        :key="item.favoriteId"
        :xs="12" :sm="8" :md="6"
      >
        <div class="book-card">
          <div class="cover-wrap" @click="router.push(`/ebooks/${item.bookId}`)">
            <img
              :src="getCoverUrl(item.coverImg)"
              :alt="item.bookTitle"
              @error="onImgError"
            />
          </div>
          <div class="card-body">
            <div
              class="book-title"
              :title="item.bookTitle"
              @click="router.push(`/ebooks/${item.bookId}`)"
            >
              {{ item.bookTitle }}
            </div>
            <div class="book-author">{{ item.author }}</div>
            <div class="book-meta">
              <span class="price">¥{{ (item.price / 100).toFixed(2) }}</span>
              <span class="rating">
                <StarFilled />
                {{ item.rating }}
              </span>
            </div>
            <div class="card-actions">
              <a-button size="small" danger @click="handleRemove(item)">取消收藏</a-button>
              <a-button size="small" @click="router.push(`/ebooks/${item.bookId}`)">查看详情</a-button>
            </div>
          </div>
        </div>
      </a-col>
    </a-row>

    <!-- 列表视图 -->
    <div v-else class="list-view">
      <div
        v-for="item in displayList"
        :key="item.favoriteId"
        class="list-item"
      >
        <img
          :src="getCoverUrl(item.coverImg)"
          :alt="item.bookTitle"
          class="list-cover"
          @error="onImgError"
          @click="router.push(`/ebooks/${item.bookId}`)"
        />
        <div class="list-info">
          <div class="book-title" @click="router.push(`/ebooks/${item.bookId}`)">
            {{ item.bookTitle }}
          </div>
          <div class="book-author">{{ item.author }}</div>
          <div class="book-meta">
            <span class="price">¥{{ (item.price / 100).toFixed(2) }}</span>
            <span class="rating"><StarFilled /> {{ item.rating }}</span>
            <a-tag>{{ item.categoryName }}</a-tag>
          </div>
          <div class="collect-time">收藏于 {{ formatDate(item.createTime) }}</div>
        </div>
        <div class="list-actions">
          <a-button size="small" danger @click="handleRemove(item)">取消收藏</a-button>
          <a-button size="small" @click="router.push(`/ebooks/${item.bookId}`)">查看详情</a-button>
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
        @change="loadFavorites"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import {
  StarFilled,
  AppstoreOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import { getFavoriteList, removeFavorite } from '@/api/user-center'
import { getCoverUrl, getDefaultCover } from '@/utils/image'
import type { FavoriteItem } from '@/types/user-center'

const router = useRouter()

const loading = ref(false)
const allList = ref<FavoriteItem[]>([])
const totalCount = ref(0)
const currentPage = ref(1)
const pageSize = 12
const viewMode = ref<'grid' | 'list'>('grid')
const filterCategory = ref<string | undefined>(undefined)
const sortOrder = ref<'desc' | 'asc'>('desc')

// 从已加载数据中提取分类列表
const categories = computed(() => {
  const set = new Set(allList.value.map((i) => i.categoryName).filter(Boolean))
  return Array.from(set)
})

// 前端本地筛选 + 排序
const displayList = computed(() => {
  let list = [...allList.value]
  if (filterCategory.value) {
    list = list.filter((i) => i.categoryName === filterCategory.value)
  }
  list.sort((a, b) => {
    const ta = new Date(a.createTime).getTime()
    const tb = new Date(b.createTime).getTime()
    return sortOrder.value === 'desc' ? tb - ta : ta - tb
  })
  return list
})

const loadFavorites = async () => {
  loading.value = true
  try {
    // 一次性加载全部（后端不支持分类筛选，前端本地过滤）
    const res = await getFavoriteList({ page: 1, pageSize: 100 })
    allList.value = res.list
    totalCount.value = res.totalCount
  } catch {
    message.error('加载收藏列表失败')
  } finally {
    loading.value = false
  }
}

const applyFilter = () => {
  // 本地筛选，无需重新请求
}

const handleRemove = (item: FavoriteItem) => {
  Modal.confirm({
    title: '取消收藏',
    content: `确定取消收藏《${item.bookTitle}》吗？`,
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      try {
        await removeFavorite(item.bookId)
        message.success('已取消收藏')
        allList.value = allList.value.filter((i) => i.favoriteId !== item.favoriteId)
        totalCount.value = Math.max(0, totalCount.value - 1)
      } catch {
        message.error('操作失败')
      }
    },
  })
}

const onImgError = (e: Event) => {
  (e.target as HTMLImageElement).src = getDefaultCover()
}

const formatDate = (dateStr: string) => dayjs(dateStr).format('YYYY/MM/DD')

onMounted(loadFavorites)
</script>

<style scoped>
.favorites-page { padding: 0; }

.page-header { margin-bottom: 20px; }
.page-header h2 { font-size: 22px; font-weight: 600; margin: 0 0 4px; }
.subtitle { color: #8c8c8c; margin: 0; font-size: 14px; }

.filter-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.view-toggle { display: flex; gap: 4px; margin-left: auto; }

.loading-wrap { text-align: center; padding: 60px 0; }

/* 网格卡片 */
.book-card {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.2s;
}
.book-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }

.cover-wrap {
  position: relative;
  padding-top: 140%;
  background: #f5f5f5;
  cursor: pointer;
  overflow: hidden;
}
.cover-wrap img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-body { padding: 10px 12px; }

.book-title {
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.4;
  min-height: 36px;
  margin-bottom: 4px;
}
.book-title:hover { color: #1677ff; }

.book-author { font-size: 12px; color: #8c8c8c; margin-bottom: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.book-meta { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.price { color: #ff4d4f; font-weight: 600; font-size: 14px; }
.rating { font-size: 12px; color: #faad14; display: flex; align-items: center; gap: 2px; }

.card-actions { display: flex; gap: 6px; }

/* 列表视图 */
.list-view { display: flex; flex-direction: column; gap: 12px; }

.list-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  align-items: center;
  transition: box-shadow 0.2s;
}
.list-item:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.08); }

.list-cover {
  width: 64px;
  height: 90px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  flex-shrink: 0;
}

.list-info { flex: 1; min-width: 0; }
.list-info .book-title { font-size: 15px; font-weight: 500; cursor: pointer; margin-bottom: 4px; }
.list-info .book-title:hover { color: #1677ff; }
.list-info .book-author { font-size: 13px; color: #8c8c8c; margin-bottom: 6px; }
.list-info .book-meta { display: flex; align-items: center; gap: 10px; margin-bottom: 4px; }
.collect-time { font-size: 12px; color: #bfbfbf; }

.list-actions { display: flex; flex-direction: column; gap: 6px; flex-shrink: 0; }

.pagination { margin-top: 24px; text-align: center; }
</style>
