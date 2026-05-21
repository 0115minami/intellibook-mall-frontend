<template>
  <div class="admin-orders">
    <div class="page-header">
      <h2>订单管理</h2>
    </div>

    <!-- 搜索栏 -->
    <div class="search-bar">
      <a-input
        v-model:value="searchForm.keyword"
        placeholder="搜索订单号或用户名"
        style="width: 200px"
        allow-clear
      />
      <a-select v-model:value="searchForm.payStatus" style="width: 120px">
        <a-select-option :value="-1">支付状态</a-select-option>
        <a-select-option :value="0">未支付</a-select-option>
        <a-select-option :value="1">已支付</a-select-option>
      </a-select>
      <a-select v-model:value="searchForm.orderStatus" style="width: 120px">
        <a-select-option :value="-1">订单状态</a-select-option>
        <a-select-option :value="0">待支付</a-select-option>
        <a-select-option :value="1">已完成</a-select-option>
        <a-select-option :value="2">已取消</a-select-option>
      </a-select>
      <a-range-picker
        v-model:value="dateRange"
        style="width: 220px"
        :placeholder="['开始日期', '结束日期']"
      />
      <a-button type="primary" @click="handleSearch">
        <SearchOutlined /> 查询
      </a-button>
      <a-button @click="handleReset">重置</a-button>
      <a-button
        v-if="selectedIds.length > 0"
        danger
        @click="handleBatchDelete"
      >
        批量删除（{{ selectedIds.length }}）
      </a-button>
    </div>

    <!-- 表格 -->
    <a-table
      :columns="columns"
      :data-source="list"
      :loading="loading"
      :pagination="pagination"
      :row-selection="rowSelection"
      :row-key="(r: AdminOrderListItem) => r.orderId"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'orderNo'">
          <a @click="showDetail(record.orderId)">{{ record.orderNo }}</a>
        </template>
        <template v-else-if="column.key === 'username'">
          {{ record.username ?? '-' }}
        </template>
        <template v-else-if="column.key === 'totalPrice'">
          <span class="price-text">¥{{ (record.totalPrice / 100).toFixed(2) }}</span>
        </template>
        <template v-else-if="column.key === 'payStatus'">
          <a-tag :color="record.payStatus === 1 ? 'green' : 'orange'">
            {{ record.payStatusText }}
          </a-tag>
        </template>
        <template v-else-if="column.key === 'orderStatus'">
          <a-tag :color="orderStatusColor(record.orderStatus)">
            {{ record.orderStatusText }}
          </a-tag>
        </template>
        <template v-else-if="column.key === 'createTime'">
          {{ formatDate(record.createTime) }}
        </template>
        <template v-else-if="column.key === 'payTime'">
          {{ record.payTime ? formatDate(record.payTime) : '-' }}
        </template>
        <template v-else-if="column.key === 'action'">
          <a-space>
            <a @click="showDetail(record.orderId)">详情</a>
            <a-dropdown>
              <a>更多 <DownOutlined /></a>
              <template #overlay>
                <a-menu>
                  <a-menu-item @click="handleStatusChange(record, 0)">设为待支付</a-menu-item>
                  <a-menu-item @click="handleStatusChange(record, 1)">设为已完成</a-menu-item>
                  <a-menu-item @click="handleStatusChange(record, 2)">设为已取消</a-menu-item>
                  <a-menu-divider />
                  <a-menu-item danger @click="handleDelete(record)">删除</a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </a-space>
        </template>
      </template>
    </a-table>

    <!-- 订单详情弹窗 -->
    <a-modal
      :open="showDetailModal"
      title="订单详情"
      :width="600"
      :footer="null"
      @cancel="showDetailModal = false"
    >
      <a-spin :spinning="detailLoading">
        <div v-if="currentOrder">
          <a-descriptions :column="2" bordered size="small" style="margin-bottom: 16px">
            <a-descriptions-item label="订单号" :span="2">{{ currentOrder.orderNo }}</a-descriptions-item>
            <a-descriptions-item label="用户名">{{ currentOrder.username ?? '-' }}</a-descriptions-item>
            <a-descriptions-item label="昵称">{{ currentOrder.nickname }}</a-descriptions-item>
            <a-descriptions-item label="支付状态">
              <a-tag :color="currentOrder.payStatus === 1 ? 'green' : 'orange'">
                {{ currentOrder.payStatusText }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="订单状态">
              <a-tag :color="orderStatusColor(currentOrder.orderStatus)">
                {{ currentOrder.orderStatusText }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="支付方式">{{ currentOrder.payTypeText || '-' }}</a-descriptions-item>
            <a-descriptions-item label="总价">
              <span class="price-text">¥{{ (currentOrder.totalPrice / 100).toFixed(2) }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="创建时间">{{ formatDate(currentOrder.createTime) }}</a-descriptions-item>
            <a-descriptions-item label="支付时间">{{ currentOrder.payTime ? formatDate(currentOrder.payTime) : '-' }}</a-descriptions-item>
          </a-descriptions>

          <div class="detail-items-title">商品明细</div>
          <div class="detail-items">
            <div v-for="item in currentOrder.items" :key="item.itemId" class="detail-item">
              <img
                :src="`${apiBase}${item.coverImg}`"
                :alt="item.bookTitle"
                class="item-cover"
                @error="onImgError"
              />
              <div class="item-info">
                <div class="item-title">{{ item.bookTitle }}</div>
                <div class="item-author">{{ item.author }}</div>
              </div>
              <div class="item-price">¥{{ (item.price / 100).toFixed(2) }}</div>
            </div>
          </div>
        </div>
      </a-spin>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { SearchOutlined, DownOutlined } from '@ant-design/icons-vue'
import type { TablePaginationConfig, TableProps } from 'ant-design-vue'
import dayjs from 'dayjs'
import {
  getAdminOrders,
  getAdminOrderDetail,
  updateAdminOrderStatus,
  deleteAdminOrder,
  batchDeleteAdminOrders,
} from '@/api/admin-manage'
import type { AdminOrderListItem, AdminOrderDetail } from '@/api/admin-manage'
import { getDefaultCover } from '@/utils/image'

const apiBase = import.meta.env.PROD
  ? (import.meta.env.VITE_API_BASE || '')
  : ''

const loading = ref(false)
const list = ref<AdminOrderListItem[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSizeVal = ref(10)
const selectedIds = ref<number[]>([])

const searchForm = reactive({
  keyword: '',
  payStatus: -1,
  orderStatus: -1,
})
const dateRange = ref<any[]>([])

// 详情
const showDetailModal = ref(false)
const detailLoading = ref(false)
const currentOrder = ref<AdminOrderDetail | null>(null)

const columns = [
  { title: '订单号', key: 'orderNo', width: 200 },
  { title: '用户名', key: 'username', width: 100 },
  { title: '商品数量', dataIndex: 'itemCount', width: 80 },
  { title: '总金额', key: 'totalPrice', width: 100 },
  { title: '支付状态', key: 'payStatus', width: 90 },
  { title: '订单状态', key: 'orderStatus', width: 90 },
  { title: '创建时间', key: 'createTime', width: 150 },
  { title: '支付时间', key: 'payTime', width: 150 },
  { title: '操作', key: 'action', width: 120, fixed: 'right' as const },
]

const pagination = computed<TablePaginationConfig>(() => ({
  current: currentPage.value,
  pageSize: pageSizeVal.value,
  total: total.value,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (t: number) => `共 ${t} 条`,
}))

const rowSelection = computed<TableProps['rowSelection']>(() => ({
  selectedRowKeys: selectedIds.value,
  onChange: (keys: any[]) => { selectedIds.value = keys },
}))

const loadOrders = async () => {
  loading.value = true
  try {
    const params: any = {
      pageNum: currentPage.value,
      pageSize: pageSizeVal.value,
    }
    if (searchForm.keyword) params.keyword = searchForm.keyword
    if (searchForm.payStatus !== -1) params.payStatus = searchForm.payStatus
    if (searchForm.orderStatus !== -1) params.orderStatus = searchForm.orderStatus
    if (dateRange.value?.length === 2) {
      params.startDate = dayjs(dateRange.value[0]).format('YYYY-MM-DD')
      params.endDate = dayjs(dateRange.value[1]).format('YYYY-MM-DD')
    }
    const res = await getAdminOrders(params)
    list.value = res.list
    total.value = res.totalCount
  } catch {
    message.error('加载订单列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  loadOrders()
}

const handleReset = () => {
  searchForm.keyword = ''
  searchForm.payStatus = -1
  searchForm.orderStatus = -1
  dateRange.value = []
  currentPage.value = 1
  loadOrders()
}

const handleTableChange = (pag: TablePaginationConfig) => {
  currentPage.value = pag.current ?? 1
  pageSizeVal.value = pag.pageSize ?? 10
  loadOrders()
}

const showDetail = async (orderId: number) => {
  showDetailModal.value = true
  detailLoading.value = true
  try {
    currentOrder.value = await getAdminOrderDetail(orderId)
  } catch {
    message.error('加载订单详情失败')
  } finally {
    detailLoading.value = false
  }
}

const handleStatusChange = (order: AdminOrderListItem, status: 0 | 1 | 2) => {
  const labels = { 0: '待支付', 1: '已完成', 2: '已取消' }
  Modal.confirm({
    title: '修改订单状态',
    content: `确定将订单 ${order.orderNo} 状态改为「${labels[status]}」吗？`,
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      try {
        await updateAdminOrderStatus(order.orderId, status)
        message.success('状态更新成功')
        loadOrders()
      } catch {
        message.error('操作失败')
      }
    },
  })
}

const handleDelete = (order: AdminOrderListItem) => {
  Modal.confirm({
    title: '删除订单',
    content: `确定删除订单 ${order.orderNo} 吗？`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: async () => {
      try {
        await deleteAdminOrder(order.orderId)
        message.success('删除成功')
        loadOrders()
      } catch {
        message.error('删除失败')
      }
    },
  })
}

const handleBatchDelete = () => {
  Modal.confirm({
    title: '批量删除',
    content: `确定删除选中的 ${selectedIds.value.length} 条订单吗？`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: async () => {
      try {
        await batchDeleteAdminOrders(selectedIds.value)
        message.success('批量删除成功')
        selectedIds.value = []
        loadOrders()
      } catch {
        message.error('批量删除失败')
      }
    },
  })
}

const orderStatusColor = (s: number) => {
  if (s === 0) return 'blue'
  if (s === 1) return 'green'
  return 'red'
}

const formatDate = (d: string) => dayjs(d).format('YYYY-MM-DD HH:mm')

const onImgError = (e: Event) => {
  (e.target as HTMLImageElement).src = getDefaultCover()
}

onMounted(loadOrders)
</script>

<style scoped>
.admin-orders { padding: 0; }

.page-header { margin-bottom: 20px; }
.page-header h2 { font-size: 22px; font-weight: 600; margin: 0; }

.search-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.price-text { color: #ff4d4f; font-weight: 500; }

/* 详情弹窗 */
.detail-items-title { font-size: 14px; font-weight: 500; margin-bottom: 10px; }

.detail-items { display: flex; flex-direction: column; gap: 10px; }

.detail-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  background: #fafafa;
  border-radius: 6px;
}

.item-cover {
  width: 48px;
  height: 67px;
  object-fit: cover;
  border-radius: 3px;
  flex-shrink: 0;
}

.item-info { flex: 1; min-width: 0; }
.item-title { font-size: 14px; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.item-author { font-size: 12px; color: #8c8c8c; margin-top: 2px; }
.item-price { font-size: 15px; font-weight: 600; color: #ff4d4f; flex-shrink: 0; }
</style>
