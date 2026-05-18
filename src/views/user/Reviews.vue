<template>
  <div class="reviews-page">
    <div class="page-header">
      <h2>我的评论</h2>
      <p class="subtitle">管理您发表的书评（{{ totalCount }}）</p>
    </div>

    <!-- 筛选栏 -->
    <div class="filter-bar">
      <a-select
        v-model:value="filterBook"
        style="width: 160px"
        placeholder="全部书籍"
        allow-clear
        @change="() => {}"
      >
        <a-select-option
          v-for="title in bookTitles"
          :key="title"
          :value="title"
        >
          {{ title }}
        </a-select-option>
      </a-select>

      <a-select v-model:value="sortOrder" style="width: 120px">
        <a-select-option value="desc">评论时间↓</a-select-option>
        <a-select-option value="asc">评论时间↑</a-select-option>
      </a-select>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-wrap">
      <a-spin size="large" />
    </div>

    <!-- 空状态 -->
    <a-empty
      v-else-if="displayList.length === 0"
      description="暂无评论"
      style="margin: 60px 0"
    >
      <template #image><span style="font-size: 48px">💬</span></template>
      <template #extra>
        <a-button type="primary" @click="router.push('/ebooks')">去看书</a-button>
      </template>
    </a-empty>

    <!-- 评论列表 -->
    <div v-else class="review-list">
      <div v-for="item in displayList" :key="item.reviewId" class="review-card">
        <!-- 书名 -->
        <div class="book-name" @click="router.push(`/ebooks/${item.bookId}`)">
          {{ item.bookTitle }}
        </div>

        <!-- 评分 + 时间 -->
        <div class="review-meta">
          <a-rate :value="item.rating" disabled allow-half style="font-size: 14px" />
          <span class="rating-num">{{ item.rating.toFixed(1) }}</span>
          <span class="review-time">{{ formatDate(item.createTime) }}</span>
        </div>

        <!-- 内容 -->
        <div class="review-content">{{ item.content }}</div>

        <!-- 点赞 + 操作 -->
        <div class="review-footer">
          <span class="like-count">
            <LikeOutlined />
            {{ item.likeCount }}
          </span>
          <div class="actions">
            <a @click="openEdit(item)">编辑</a>
            <a-divider type="vertical" />
            <a class="danger-link" @click="handleDelete(item)">删除</a>
            <a-divider type="vertical" />
            <a @click="router.push(`/ebooks/${item.bookId}`)">查看书籍</a>
          </div>
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
        @change="loadReviews"
      />
    </div>

    <!-- 编辑弹窗 -->
    <a-modal
      :open="showEditModal"
      title="编辑评论"
      :confirm-loading="saving"
      @ok="handleSave"
      @cancel="showEditModal = false"
    >
      <a-form style="margin-top: 16px">
        <a-form-item label="评分">
          <a-rate v-model:value="editForm.rating" allow-half />
        </a-form-item>
        <a-form-item label="内容">
          <a-textarea
            v-model:value="editForm.content"
            :rows="4"
            placeholder="分享您的阅读感受..."
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import { LikeOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import { getMyReviews, updateReview, deleteReview } from '@/api/user-center'
import type { MyReview } from '@/types/user-center'

const router = useRouter()

const loading = ref(false)
const saving = ref(false)
const allList = ref<MyReview[]>([])
const totalCount = ref(0)
const currentPage = ref(1)
const pageSize = 10
const filterBook = ref<string | undefined>(undefined)
const sortOrder = ref<'desc' | 'asc'>('desc')
const showEditModal = ref(false)
const editingReview = ref<MyReview | null>(null)
const editForm = reactive({ rating: 5, content: '' })

// 书名列表（本地过滤用）
const bookTitles = computed(() => {
  const set = new Set(allList.value.map((i) => i.bookTitle).filter(Boolean))
  return Array.from(set)
})

// 本地筛选 + 排序
const displayList = computed(() => {
  let list = [...allList.value]
  if (filterBook.value) {
    list = list.filter((i) => i.bookTitle === filterBook.value)
  }
  list.sort((a, b) => {
    const ta = new Date(a.createTime).getTime()
    const tb = new Date(b.createTime).getTime()
    return sortOrder.value === 'desc' ? tb - ta : ta - tb
  })
  return list
})

const loadReviews = async () => {
  loading.value = true
  try {
    const res = await getMyReviews({ page: 1, pageSize: 100 })
    allList.value = res.list
    totalCount.value = res.totalCount
  } catch {
    message.error('加载评论列表失败')
  } finally {
    loading.value = false
  }
}

const openEdit = (item: MyReview) => {
  editingReview.value = item
  editForm.rating = item.rating
  editForm.content = item.content
  showEditModal.value = true
}

const handleSave = async () => {
  if (!editingReview.value) return
  saving.value = true
  try {
    await updateReview(editingReview.value.reviewId, {
      bookId: editingReview.value.bookId,
      rating: editForm.rating,
      content: editForm.content,
    })
    message.success('更新成功')
    showEditModal.value = false
    await loadReviews()
  } catch {
    message.error('更新失败')
  } finally {
    saving.value = false
  }
}

const handleDelete = (item: MyReview) => {
  Modal.confirm({
    title: '删除评论',
    content: `确定删除对《${item.bookTitle}》的评论吗？`,
    okText: '删除',
    okType: 'danger',
    cancelText: '取消',
    onOk: async () => {
      try {
        await deleteReview(item.reviewId)
        message.success('删除成功')
        allList.value = allList.value.filter((i) => i.reviewId !== item.reviewId)
        totalCount.value = Math.max(0, totalCount.value - 1)
      } catch {
        message.error('删除失败')
      }
    },
  })
}

const formatDate = (dateStr: string) => dayjs(dateStr).format('YYYY/MM/DD')

onMounted(loadReviews)
</script>

<style scoped>
.reviews-page { padding: 0; }

.page-header { margin-bottom: 20px; }
.page-header h2 { font-size: 22px; font-weight: 600; margin: 0 0 4px; }
.subtitle { color: #8c8c8c; margin: 0; font-size: 14px; }

.filter-bar { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }

.loading-wrap { text-align: center; padding: 60px 0; }

/* 评论卡片 */
.review-list { display: flex; flex-direction: column; gap: 16px; }

.review-card {
  padding: 20px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  transition: box-shadow 0.2s;
}
.review-card:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.08); }

.book-name {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  cursor: pointer;
  margin-bottom: 8px;
}
.book-name:hover { color: #1677ff; }

.review-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}
.rating-num { font-size: 13px; color: #faad14; font-weight: 500; }
.review-time { font-size: 12px; color: #bfbfbf; margin-left: auto; }

.review-content {
  font-size: 14px;
  color: #595959;
  line-height: 1.7;
  margin-bottom: 12px;
}

.review-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.like-count {
  font-size: 13px;
  color: #8c8c8c;
  display: flex;
  align-items: center;
  gap: 4px;
}

.actions { display: flex; align-items: center; font-size: 13px; }
.actions a { color: #1677ff; cursor: pointer; }
.danger-link { color: #ff4d4f !important; }

.pagination { margin-top: 24px; text-align: center; }
</style>
