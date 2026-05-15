<template>
  <a-modal
    :open="visible"
    title="图书详情"
    :width="900"
    :footer="null"
    @cancel="handleCancel"
  >
    <a-spin :spinning="loading">
      <div v-if="book" class="book-detail">
        <div class="detail-header">
          <img
            v-if="book.coverUrl"
            :src="book.coverUrl"
            alt="封面"
            class="book-cover"
          />
          <div class="book-info">
            <h2>{{ book.bookTitle }}</h2>
            <p class="author">作者：{{ book.author }}</p>
            <p class="price">¥{{ (book.price / 100).toFixed(2) }}</p>
            <a-tag :color="book.status === 1 ? 'success' : 'default'">
              {{ book.status === 1 ? '上架' : '下架' }}
            </a-tag>
          </div>
        </div>

        <a-divider />

        <a-descriptions :column="2" bordered>
          <a-descriptions-item label="ISBN">
            {{ book.isbn || '-' }}
          </a-descriptions-item>
          <a-descriptions-item label="分类">
            {{ book.categoryName || '-' }}
          </a-descriptions-item>
          <a-descriptions-item label="出版社">
            {{ book.publisher || '-' }}
          </a-descriptions-item>
          <a-descriptions-item label="出版日期">
            {{ book.publishDate || '-' }}
          </a-descriptions-item>
          <a-descriptions-item label="语言">
            {{ book.language === 'zh-CN' ? '中文' : '英文' }}
          </a-descriptions-item>
          <a-descriptions-item label="页数">
            {{ book.pageCount || '-' }}
          </a-descriptions-item>
          <a-descriptions-item label="浏览量">
            {{ book.viewCount }}
          </a-descriptions-item>
          <a-descriptions-item label="下载量">
            {{ book.downloadCount }}
          </a-descriptions-item>
          <a-descriptions-item label="评分">
            {{ book.rating ? book.rating.toFixed(1) : '-' }}
          </a-descriptions-item>
          <a-descriptions-item label="标签">
            <a-space v-if="book.tags">
              <a-tag v-for="tag in book.tags.split(',')" :key="tag">
                {{ tag }}
              </a-tag>
            </a-space>
            <span v-else>-</span>
          </a-descriptions-item>
          <a-descriptions-item label="创建时间" :span="2">
            {{ book.createTime }}
          </a-descriptions-item>
          <a-descriptions-item label="更新时间" :span="2">
            {{ book.updateTime }}
          </a-descriptions-item>
          <a-descriptions-item label="简介" :span="2">
            {{ book.bookIntro || '-' }}
          </a-descriptions-item>
        </a-descriptions>

        <a-divider>电子书文件</a-divider>

        <a-table
          v-if="book.files && book.files.length > 0"
          :columns="fileColumns"
          :data-source="book.files"
          :pagination="false"
          :row-key="(record: any) => record.fileId"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'fileSize'">
              {{ formatFileSize(record.fileSize) }}
            </template>
          </template>
        </a-table>
        <a-empty v-else description="暂无文件" />
      </div>
    </a-spin>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { message } from 'ant-design-vue'
import type { AdminEBookVO } from '@/types/admin'
import { getAdminEBookDetail } from '@/api/admin'
import { getCoverUrl } from '@/utils/image'

interface Props {
  visible: boolean
  bookId: number
}

interface Emits {
  (e: 'update:visible', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const loading = ref(false)
const book = ref<AdminEBookVO | null>(null)

const fileColumns = [
  {
    title: '格式',
    dataIndex: 'fileFormat',
    width: 100,
  },
  {
    title: '文件大小',
    key: 'fileSize',
    width: 120,
  },
  {
    title: '上传时间',
    dataIndex: 'uploadTime',
  },
]

// 监听bookId变化，加载详情
watch(
  () => [props.visible, props.bookId],
  ([visible, bookId]) => {
    if (visible && bookId) {
      loadBookDetail(bookId as number)
    }
  },
  { immediate: true }
)

// 加载图书详情
const loadBookDetail = async (bookId: number) => {
  loading.value = true
  try {
    const data = await getAdminEBookDetail(bookId)
    
    // 处理封面 URL
    data.coverUrl = getCoverUrl((data as any).coverImg || (data as any).cover_img)
    
    book.value = data
  } catch (error) {
    message.error('加载图书详情失败')
  } finally {
    loading.value = false
  }
}

// 格式化文件大小
const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

// 取消
const handleCancel = () => {
  emit('update:visible', false)
}
</script>

<style scoped>
.book-detail {
  padding: 16px 0;
}

.detail-header {
  display: flex;
  gap: 24px;
}

.book-cover {
  width: 150px;
  height: 210px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.book-info h2 {
  margin: 0 0 12px 0;
  font-size: 24px;
}

.book-info .author {
  color: #666;
  margin-bottom: 8px;
}

.book-info .price {
  font-size: 24px;
  color: #ff4d4f;
  font-weight: bold;
  margin-bottom: 12px;
}
</style>
