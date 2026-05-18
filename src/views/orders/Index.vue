<template>
  <MainLayout>
    <div class="orders-page">
      <div class="orders-container">
        <h2>我的订单</h2>

        <!-- 标签页 -->
        <a-tabs v-model:activeKey="activeTab" @change="onTabChange">
          <a-tab-pane key="all" tab="全部订单" />
          <a-tab-pane key="0" tab="待支付" />
          <a-tab-pane key="1" tab="已完成" />
          <a-tab-pane key="2" tab="已取消" />
        </a-tabs>

        <!-- 加载中 -->
        <div v-if="loading" class="loading-wrap">
          <a-spin size="large" />
        </div>

        <!-- 空状态 -->
        <a-empty
          v-else-if="displayList.length === 0"
          description="暂无订单"
          style="padding: 60px 0"
        >
          <template #image><span style="font-size: 48px">📋</span></template>
          <template #extra>
            <a-button type="primary" @click="router.push('/ebooks')">去购书</a-button>
          </template>
        </a-empty>

        <!-- 订单列表 -->
        <div v-else class="order-list">
          <div
            v-for="order in displayList"
            :key="order.orderId"
            class="order-card"
          >
            <!-- 订单头 -->
            <div class="order-head">
              <span class="order-no">订单号：{{ order.orderNo }}</span>
              <span class="order-time">{{ formatDate(order.createTime) }}</span>
              <a-tag :color="statusColor(order.orderStatus)">
                {{ order.orderStatusText }}
              </a-tag>
            </div>

            <!-- 商品摘要 -->
            <div class="order-body">
              <span class="item-count">共 {{ order.itemCount }} 件商品</span>
              <span class="order-price">¥{{ (order.totalPrice / 100).toFixed(2) }}</span>
            </div>

            <!-- 操作 -->
            <div class="order-foot">
              <a-button size="small" @click="showDetail(order.orderId)">查看详情</a-button>
              <a-button
                v-if="order.orderStatus === 0"
                size="small"
                danger
                :loading="cancellingId === order.orderId"
                @click="handleCancel(order)"
              >
                取消订单
              </a-button>
              <a-button
                v-if="order.orderStatus === 1"
                size="small"
                type="primary"
                @click="router.push('/user/library')"
              >
                去阅读
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
            @change="loadOrders"
          />
        </div>
      </div>
    </div>

    <!-- 订单详情弹窗 -->
    <OrderDetailModal
      v-model:open="showDetailModal"
      :order-id="detailOrderId"
    />
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import dayjs from 'dayjs'
import MainLayout from '@/components/layout/MainLayout.vue'
import OrderDetailModal from '@/components/checkout/OrderDetailModal.vue'
import { getOrderList, cancelOrder } from '@/api/cart-order'
import type { OrderListItem } from '@/types/cart-order'

const router = useRouter()

const loading = ref(false)
const allOrders = ref<OrderListItem[]>([])
const totalCount = ref(0)
const currentPage = ref(1)
const pageSize = 10
const activeTab = ref('all')
const cancellingId = ref<number | null>(null)
const showDetailModal = ref(false)
const detailOrderId = ref(0)

// 本地按状态过滤
const displayList = computed(() => {
  if (activeTab.value === 'all') return allOrders.value
  const status = Number(activeTab.value)
  return allOrders.value.filter((o) => o.orderStatus === status)
})

const loadOrders = async () => {
  loading.value = true
  try {
    const res = await getOrderList({ page: currentPage.value, pageSize: 100 })
    allOrders.value = res.list
    totalCount.value = res.totalCount
  } catch {
    message.error('加载订单失败')
  } finally {
    loading.value = false
  }
}

const onTabChange = () => {
  currentPage.value = 1
}

const handleCancel = (order: OrderListItem) => {
  Modal.confirm({
    title: '取消订单',
    content: `确定取消订单 ${order.orderNo} 吗？`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: async () => {
      cancellingId.value = order.orderId
      try {
        await cancelOrder(order.orderId)
        message.success('订单已取消')
        await loadOrders()
      } catch {
        message.error('取消失败')
      } finally {
        cancellingId.value = null
      }
    },
  })
}

const showDetail = (orderId: number) => {
  detailOrderId.value = orderId
  showDetailModal.value = true
}

const statusColor = (status: number) => {
  if (status === 0) return 'orange'
  if (status === 1) return 'green'
  return 'default'
}

const formatDate = (d: string) => dayjs(d).format('YYYY/MM/DD HH:mm')

onMounted(loadOrders)
</script>

<style scoped>
.orders-page {
  min-height: calc(100vh - 64px);
  background: #f5f5f5;
  padding: 24px;
}

.orders-container {
  max-width: 860px;
  margin: 0 auto;
  background: #fff;
  border-radius: 8px;
  padding: 24px;
}

.orders-container h2 {
  margin: 0 0 16px;
  font-size: 20px;
  font-weight: 600;
}

.loading-wrap {
  text-align: center;
  padding: 60px 0;
}

/* 订单卡片 */
.order-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
}

.order-card {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.2s;
}

.order-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.order-head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
  flex-wrap: wrap;
}

.order-no {
  font-size: 13px;
  color: #595959;
  flex: 1;
}

.order-time {
  font-size: 12px;
  color: #bfbfbf;
}

.order-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
}

.item-count {
  font-size: 14px;
  color: #595959;
}

.order-price {
  font-size: 18px;
  font-weight: 600;
  color: #ff4d4f;
}

.order-foot {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid #f5f5f5;
}

.pagination {
  margin-top: 24px;
  text-align: center;
}
</style>
