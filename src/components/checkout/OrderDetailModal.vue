<template>
  <a-modal
    :open="open"
    title="订单详情"
    :width="560"
    :footer="null"
    @cancel="emit('update:open', false)"
  >
    <a-spin :spinning="loading">
      <div v-if="order" class="detail-body">
        <!-- 基本信息 -->
        <a-descriptions :column="1" size="small" bordered>
          <a-descriptions-item label="订单号">{{ order.orderNo }}</a-descriptions-item>
          <a-descriptions-item label="订单状态">
            <a-tag :color="statusColor(order.orderStatus)">{{ order.orderStatusText }}</a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="支付状态">{{ order.payStatusText }}</a-descriptions-item>
          <a-descriptions-item v-if="order.payTypeText" label="支付方式">{{ order.payTypeText }}</a-descriptions-item>
          <a-descriptions-item label="创建时间">{{ formatDate(order.createTime) }}</a-descriptions-item>
          <a-descriptions-item v-if="order.payTime" label="支付时间">{{ formatDate(order.payTime) }}</a-descriptions-item>
        </a-descriptions>

        <a-divider style="margin: 16px 0" />

        <!-- 商品列表 -->
        <div class="items-title">商品明细</div>
        <div class="order-items">
          <div v-for="item in order.items" :key="item.itemId" class="order-item">
            <img
              :src="getCoverUrl(item.coverImg)"
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

        <a-divider style="margin: 16px 0" />

        <!-- 总价 -->
        <div class="total-row">
          <span>应付总额</span>
          <span class="total-price">¥{{ (order.totalPrice / 100).toFixed(2) }}</span>
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { getOrderDetail } from '@/api/cart-order'
import { getCoverUrl, getDefaultCover } from '@/utils/image'
import type { OrderDetail } from '@/types/cart-order'

interface Props {
  open: boolean
  orderId: number
}

interface Emits {
  (e: 'update:open', val: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const loading = ref(false)
const order = ref<OrderDetail | null>(null)

watch(
  () => [props.open, props.orderId],
  ([open, id]) => {
    if (open && id) loadDetail(id as number)
  }
)

const loadDetail = async (id: number) => {
  loading.value = true
  try {
    order.value = await getOrderDetail(id)
  } catch {
    message.error('加载订单详情失败')
  } finally {
    loading.value = false
  }
}

const statusColor = (s: number) => s === 0 ? 'orange' : s === 1 ? 'green' : 'default'
const formatDate = (d: string) => dayjs(d).format('YYYY/MM/DD HH:mm:ss')
const onImgError = (e: Event) => { (e.target as HTMLImageElement).src = getDefaultCover() }
</script>

<style scoped>
.detail-body { padding: 4px 0; }

.items-title { font-size: 14px; font-weight: 500; margin-bottom: 12px; }

.order-items { display: flex; flex-direction: column; gap: 10px; }

.order-item {
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

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 15px;
  font-weight: 500;
}

.total-price { font-size: 22px; font-weight: 700; color: #ff4d4f; }
</style>
