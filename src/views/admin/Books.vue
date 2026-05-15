<template>
  <div class="admin-books">
    <div class="page-header">
      <h2>图书管理</h2>
      <a-button type="primary" @click="showCreateModal">
        <PlusOutlined />
        添加图书
      </a-button>
    </div>

    <!-- 搜索栏 -->
    <div class="search-bar">
      <a-form layout="inline" :model="searchForm">
        <a-form-item label="关键词">
          <a-input
            v-model:value="searchForm.keyword"
            placeholder="书名/作者/ISBN/出版社"
            style="width: 200px"
            allow-clear
          />
        </a-form-item>
        <a-form-item label="分类">
          <a-select
            v-model:value="searchForm.categoryId"
            placeholder="全部分类"
            style="width: 150px"
            allow-clear
          >
            <a-select-option :value="1">编程技术</a-select-option>
            <a-select-option :value="2">人工智能</a-select-option>
            <a-select-option :value="3">数据科学</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="状态">
          <a-select
            v-model:value="searchForm.status"
            placeholder="全部状态"
            style="width: 120px"
          >
            <a-select-option :value="-1">全部</a-select-option>
            <a-select-option :value="1">上架</a-select-option>
            <a-select-option :value="0">下架</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="排序">
          <a-select
            v-model:value="searchForm.sortBy"
            style="width: 150px"
          >
            <a-select-option value="create_time_desc">创建时间↓</a-select-option>
            <a-select-option value="create_time_asc">创建时间↑</a-select-option>
            <a-select-option value="price_desc">价格↓</a-select-option>
            <a-select-option value="price_asc">价格↑</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleSearch">
            <SearchOutlined />
            搜索
          </a-button>
        </a-form-item>
        <a-form-item>
          <a-button @click="handleReset">重置</a-button>
        </a-form-item>
      </a-form>
    </div>

    <!-- 批量操作 -->
    <div v-if="selectedRowKeys.length > 0" class="batch-actions">
      <a-space>
        <span>已选择 {{ selectedRowKeys.length }} 项</span>
        <a-button @click="handleBatchOnline">批量上架</a-button>
        <a-button @click="handleBatchOffline">批量下架</a-button>
        <a-button danger @click="handleBatchDelete">批量删除</a-button>
      </a-space>
    </div>

    <!-- 图书列表 -->
    <a-table
      :columns="columns"
      :data-source="bookList"
      :loading="loading"
      :pagination="pagination"
      :row-selection="rowSelection"
      :row-key="(record: AdminEBookVO) => record.bookId"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'cover'">
          <img
            v-if="record.coverUrl"
            :src="record.coverUrl"
            alt="封面"
            class="book-cover"
          />
          <span v-else>-</span>
        </template>
        <template v-else-if="column.key === 'bookTitle'">
          <div class="book-title-cell">
            <div class="title">{{ record.bookTitle }}</div>
            <div class="subtitle">{{ record.author }}</div>
          </div>
        </template>
        <template v-else-if="column.key === 'price'">
          ¥{{ (record.price / 100).toFixed(2) }}
        </template>
        <template v-else-if="column.key === 'status'">
          <a-tag :color="record.status === 1 ? 'success' : 'default'">
            {{ record.status === 1 ? '上架' : '下架' }}
          </a-tag>
        </template>
        <template v-else-if="column.key === 'formats'">
          <a-space>
            <a-tag
              v-for="format in record.availableFormats"
              :key="format"
              color="blue"
            >
              {{ format }}
            </a-tag>
          </a-space>
        </template>
        <template v-else-if="column.key === 'action'">
          <a-space>
            <a @click="handleView(record)">查看</a>
            <a @click="handleEdit(record)">编辑</a>
            <a-dropdown>
              <a>
                更多
                <DownOutlined />
              </a>
              <template #overlay>
                <a-menu>
                  <a-menu-item
                    v-if="record.status === 0"
                    @click="handleStatusChange(record, 1)"
                  >
                    上架
                  </a-menu-item>
                  <a-menu-item
                    v-else
                    @click="handleStatusChange(record, 0)"
                  >
                    下架
                  </a-menu-item>
                  <a-menu-divider />
                  <a-menu-item danger @click="handleDelete(record)">
                    删除
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </a-space>
        </template>
      </template>
    </a-table>

    <!-- 创建/编辑图书弹窗 -->
    <BookFormModal
      v-model:visible="formModalVisible"
      :book="currentBook"
      :mode="formMode"
      @success="handleFormSuccess"
    />

    <!-- 查看图书详情弹窗 -->
    <BookDetailModal
      v-model:visible="detailModalVisible"
      :book-id="currentBookId"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { message, Modal } from 'ant-design-vue'
import {
  PlusOutlined,
  SearchOutlined,
  DownOutlined,
} from '@ant-design/icons-vue'
import type { TableProps, TablePaginationConfig } from 'ant-design-vue'
import type { AdminEBookSearchParam, AdminEBookVO } from '@/types/admin'
import {
  getAdminEBooks,
  updateAdminEBookStatus,
  deleteAdminEBook,
  batchUpdateAdminEBookStatus,
  batchDeleteAdminEBooks,
} from '@/api/admin'
import { getCoverUrl } from '@/utils/image'
import BookFormModal from './components/BookFormModal.vue'
import BookDetailModal from './components/BookDetailModal.vue'

// 搜索表单
const searchForm = reactive<AdminEBookSearchParam>({
  keyword: '',
  categoryId: undefined,
  status: -1,
  sortBy: 'create_time_desc',
  pageNum: 1,
  pageSize: 20, // 默认每页显示20条
})

// 图书列表
const bookList = ref<AdminEBookVO[]>([])
const loading = ref(false)
const total = ref(0)

// 选中的行
const selectedRowKeys = ref<number[]>([])

// 表格列定义
const columns = [
  {
    title: '封面',
    key: 'cover',
    width: 80,
  },
  {
    title: '图书信息',
    key: 'bookTitle',
    width: 250,
  },
  {
    title: 'ISBN',
    dataIndex: 'isbn',
    width: 150,
  },
  {
    title: '分类',
    dataIndex: 'categoryName',
    width: 100,
  },
  {
    title: '价格',
    key: 'price',
    width: 100,
  },
  {
    title: '状态',
    key: 'status',
    width: 80,
  },
  {
    title: '格式',
    key: 'formats',
    width: 150,
  },
  {
    title: '浏览/下载',
    width: 120,
    customRender: ({ record }: { record: AdminEBookVO }) =>
      `${record.viewCount} / ${record.downloadCount}`,
  },
  {
    title: '操作',
    key: 'action',
    width: 180,
    fixed: 'right',
  },
]

// 分页配置
const pagination = computed<TablePaginationConfig>(() => ({
  current: searchForm.pageNum,
  pageSize: searchForm.pageSize,
  total: total.value,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条`,
}))

// 行选择配置
const rowSelection = computed<TableProps['rowSelection']>(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: any[]) => {
    selectedRowKeys.value = keys
  },
}))

// 表单弹窗
const formModalVisible = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const currentBook = ref<AdminEBookVO | null>(null)

// 详情弹窗
const detailModalVisible = ref(false)
const currentBookId = ref<number>(0)

// 加载图书列表
const loadBooks = async () => {
  loading.value = true
  try {
    const result = await getAdminEBooks(searchForm)
    // 处理封面 URL 和字段映射
    bookList.value = result.list.map((book: any) => ({
      ...book,
      coverUrl: getCoverUrl(book.coverImg || book.cover_img)
    }))
    total.value = result.total
  } catch (error) {
    message.error('加载图书列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  searchForm.pageNum = 1
  loadBooks()
}

// 重置
const handleReset = () => {
  searchForm.keyword = ''
  searchForm.categoryId = undefined
  searchForm.status = -1
  searchForm.sortBy = 'create_time_desc'
  searchForm.pageNum = 1
  loadBooks()
}

// 表格变化
const handleTableChange = (pag: TablePaginationConfig) => {
  searchForm.pageNum = pag.current || 1
  searchForm.pageSize = pag.pageSize || 10
  loadBooks()
}

// 显示创建弹窗
const showCreateModal = () => {
  formMode.value = 'create'
  currentBook.value = null
  formModalVisible.value = true
}

// 查看详情
const handleView = (book: AdminEBookVO) => {
  currentBookId.value = book.bookId
  detailModalVisible.value = true
}

// 编辑
const handleEdit = (book: AdminEBookVO) => {
  formMode.value = 'edit'
  currentBook.value = book
  formModalVisible.value = true
}

// 状态变更
const handleStatusChange = async (book: AdminEBookVO, status: 0 | 1) => {
  try {
    await updateAdminEBookStatus(book.bookId, status)
    message.success(status === 1 ? '上架成功' : '下架成功')
    loadBooks()
  } catch (error) {
    message.error('操作失败')
  }
}

// 删除
const handleDelete = (book: AdminEBookVO) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除图书《${book.bookTitle}》吗？`,
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      try {
        await deleteAdminEBook(book.bookId)
        message.success('删除成功')
        loadBooks()
      } catch (error) {
        message.error('删除失败')
      }
    },
  })
}

// 批量上架
const handleBatchOnline = async () => {
  try {
    const result = await batchUpdateAdminEBookStatus(selectedRowKeys.value, 1)
    message.success(`成功上架 ${result.successCount} 本图书`)
    selectedRowKeys.value = []
    loadBooks()
  } catch (error) {
    message.error('批量上架失败')
  }
}

// 批量下架
const handleBatchOffline = async () => {
  try {
    const result = await batchUpdateAdminEBookStatus(selectedRowKeys.value, 0)
    message.success(`成功下架 ${result.successCount} 本图书`)
    selectedRowKeys.value = []
    loadBooks()
  } catch (error) {
    message.error('批量下架失败')
  }
}

// 批量删除
const handleBatchDelete = () => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除选中的 ${selectedRowKeys.value.length} 本图书吗？`,
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      try {
        const result = await batchDeleteAdminEBooks(selectedRowKeys.value)
        message.success(`成功删除 ${result.successCount} 本图书`)
        selectedRowKeys.value = []
        loadBooks()
      } catch (error) {
        message.error('批量删除失败')
      }
    },
  })
}

// 表单提交成功
const handleFormSuccess = () => {
  formModalVisible.value = false
  currentBook.value = null // 清空当前图书
  loadBooks()
}

onMounted(() => {
  loadBooks()
})
</script>

<style scoped>
.admin-books {
  padding: 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.search-bar {
  background: #fafafa;
  padding: 16px;
  border-radius: 4px;
  margin-bottom: 16px;
}

.batch-actions {
  margin-bottom: 16px;
  padding: 12px;
  background: #e6f7ff;
  border: 1px solid #91d5ff;
  border-radius: 4px;
}

.book-cover {
  width: 50px;
  height: 70px;
  object-fit: cover;
  border-radius: 4px;
}

.book-title-cell .title {
  font-weight: 500;
  margin-bottom: 4px;
}

.book-title-cell .subtitle {
  font-size: 12px;
  color: #999;
}
</style>
