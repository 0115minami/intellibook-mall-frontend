<template>
  <div class="admin-users">
    <div class="page-header">
      <h2>用户管理</h2>
    </div>

    <!-- 搜索栏 -->
    <div class="search-bar">
      <a-input
        v-model:value="keyword"
        placeholder="搜索用户名、邮箱或昵称"
        style="width: 220px"
        allow-clear
        @press-enter="handleSearch"
      >
        <template #suffix><SearchOutlined /></template>
      </a-input>
      <a-select v-model:value="lockedFlag" style="width: 130px" @change="handleSearch">
        <a-select-option :value="-1">全部状态</a-select-option>
        <a-select-option :value="0">已激活</a-select-option>
        <a-select-option :value="1">已锁定</a-select-option>
      </a-select>
      <a-button @click="handleReset">重置</a-button>
    </div>

    <!-- 表格 -->
    <a-table
      :columns="columns"
      :data-source="list"
      :loading="loading"
      :pagination="pagination"
      :row-key="(r: AdminUser) => r.userId"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'userId'">
          <a @click="showDetail(record)">{{ record.userId }}</a>
        </template>
        <template v-else-if="column.key === 'username'">
          <a @click="showDetail(record)">{{ record.username }}</a>
        </template>
        <template v-else-if="column.key === 'lockedFlag'">
          <a-tag :color="record.lockedFlag === 0 ? 'green' : 'red'">
            {{ record.lockedFlag === 0 ? '已激活' : '已锁定' }}
          </a-tag>
        </template>
        <template v-else-if="column.key === 'createTime'">
          {{ formatDate(record.createTime) }}
        </template>
        <template v-else-if="column.key === 'action'">
          <a-space>
            <a @click="showDetail(record)">详情</a>
            <a
              v-if="record.lockedFlag === 0 && !record.isAdmin"
              class="danger-link"
              @click="handleLock(record)"
            >锁定</a>
            <a
              v-if="record.lockedFlag === 1"
              @click="handleUnlock(record)"
            >解锁</a>
          </a-space>
        </template>
      </template>
    </a-table>

    <!-- 用户详情弹窗 -->
    <a-modal
      :open="showDetailModal"
      title="用户详情"
      :footer="null"
      @cancel="showDetailModal = false"
    >
      <a-descriptions v-if="currentUser" :column="1" bordered size="small">
        <a-descriptions-item label="用户ID">{{ currentUser.userId }}</a-descriptions-item>
        <a-descriptions-item label="用户名">{{ currentUser.username }}</a-descriptions-item>
        <a-descriptions-item label="昵称">{{ currentUser.nickname }}</a-descriptions-item>
        <a-descriptions-item label="邮箱">{{ currentUser.email }}</a-descriptions-item>
        <a-descriptions-item label="用户类型">
          <a-tag :color="currentUser.isAdmin ? 'gold' : 'blue'">
            {{ currentUser.isAdmin ? '管理员' : '普通用户' }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="状态">
          <a-tag :color="currentUser.lockedFlag === 0 ? 'green' : 'red'">
            {{ currentUser.lockedFlag === 0 ? '已激活' : '已锁定' }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="注册时间">{{ formatDate(currentUser.createTime) }}</a-descriptions-item>
      </a-descriptions>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { SearchOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import { getAdminUsers, lockUser, unlockUser } from '@/api/admin-manage'
import type { AdminUser } from '@/api/admin-manage'
import type { TablePaginationConfig } from 'ant-design-vue'

const loading = ref(false)
const list = ref<AdminUser[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const keyword = ref('')
const lockedFlag = ref(-1)
const showDetailModal = ref(false)
const currentUser = ref<AdminUser | null>(null)

const columns = [
  { title: '用户ID', key: 'userId', width: 80 },
  { title: '用户名', key: 'username', width: 130 },
  { title: '昵称', dataIndex: 'nickname', width: 120 },
  { title: '邮箱', dataIndex: 'email' },
  { title: '状态', key: 'lockedFlag', width: 90 },
  { title: '注册时间', key: 'createTime', width: 160 },
  { title: '操作', key: 'action', width: 120, fixed: 'right' as const },
]

const pagination = computed<TablePaginationConfig>(() => ({
  current: currentPage.value,
  pageSize: pageSize.value,
  total: total.value,
  showSizeChanger: true,
  showTotal: (t: number) => `共 ${t} 条`,
}))

const loadUsers = async () => {
  loading.value = true
  try {
    const res = await getAdminUsers({
      keyword: keyword.value || undefined,
      lockedFlag: lockedFlag.value,
      pageNum: currentPage.value,
      pageSize: pageSize.value,
    })
    list.value = res.list
    total.value = res.totalCount
  } catch {
    message.error('加载用户列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  loadUsers()
}

const handleReset = () => {
  keyword.value = ''
  lockedFlag.value = -1
  currentPage.value = 1
  loadUsers()
}

const handleTableChange = (pag: TablePaginationConfig) => {
  currentPage.value = pag.current ?? 1
  pageSize.value = pag.pageSize ?? 10
  loadUsers()
}

const showDetail = (user: AdminUser) => {
  currentUser.value = user
  showDetailModal.value = true
}

const handleLock = (user: AdminUser) => {
  Modal.confirm({
    title: '锁定用户',
    content: `确定锁定用户「${user.username}」吗？锁定后该用户将无法登录。`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: async () => {
      try {
        await lockUser(user.userId)
        message.success('锁定成功')
        loadUsers()
      } catch {
        message.error('操作失败')
      }
    },
  })
}

const handleUnlock = (user: AdminUser) => {
  Modal.confirm({
    title: '解锁用户',
    content: `确定解锁用户「${user.username}」吗？`,
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      try {
        await unlockUser(user.userId)
        message.success('解锁成功')
        loadUsers()
      } catch {
        message.error('操作失败')
      }
    },
  })
}

const formatDate = (d: string) => d ? dayjs(d).format('YYYY-MM-DD') : '-'

onMounted(loadUsers)
</script>

<style scoped>
.admin-users { padding: 0; }

.page-header { margin-bottom: 20px; }
.page-header h2 { font-size: 22px; font-weight: 600; margin: 0; }

.search-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.danger-link { color: #ff4d4f; }
</style>
