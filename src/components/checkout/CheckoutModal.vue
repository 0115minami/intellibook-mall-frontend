<template>
  <a-modal
    :open="open"
    title="确认订单信息"
    :width="600"
    :footer="null"
    :mask-closable="false"
    @cancel="handleCancel"
  >
    <div class="checkout-body">
      <!-- 商品列表 -->
      <div class="order-items">
        <div
          v-for="item in items"
          :key="item.bookId ?? item.cartId"
          class="order-item"
        >
          <img
            :src="getCoverUrl(item.coverImg)"
            :alt="item.bookTitle"
            class="item-cover"
            @error="onImgError"
          />
          <div class="item-info">
            <div class="item-title">{{ item.bookTitle }}</div>
            <div class="item-author">作者: {{ item.author }}</div>
          </div>
          <div class="item-price">¥{{ (item.price / 100).toFixed(2) }}</div>
        </div>
      </div>

      <a-divider style="margin: 16px 0" />

      <!-- 金额汇总 -->
      <div class="price-summary">
        <div class="price-row">
          <span>商品金额:</span>
          <span>¥{{ totalPrice }}</span>
        </div>
        <div class="price-row total">
          <span>应付总额:</span>
          <span class="total-amount">¥{{ totalPrice }}</span>
        </div>
      </div>

      <a-divider style="margin: 16px 0" />

      <!-- 支付方式 -->
      <div class="pay-section">
        <div class="pay-title">选择支付方式</div>
        <div class="pay-options">
          <div
            v-for="opt in payOptions"
            :key="opt.value"
            class="pay-option"
            :class="{ selected: payType === opt.value }"
            @click="payType = opt.value"
          >
            <a-radio :checked="payType === opt.value" />
            <span class="pay-icon">{{ opt.icon }}</span>
            <span class="pay-name">{{ opt.label }}</span>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="action-row">
        <a-button @click="handleCancel">取 消</a-button>
        <a-button
          type="primary"
          size="large"
          :loading="submitting"
          @click="handleSubmit"
        >
          提交订单并支付
        </a-button>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { message } from 'ant-design-vue'
import { createOrder, buyNow, getOrderList, payOrder } from '@/api/cart-order'
import { getCoverUrl, getDefaultCover } from '@/utils/image'

interface CheckoutItem {
  bookId?: number
  cartId?: number
  bookTitle: string
  author: string
  coverImg: string
  price: number
}

interface Props {
  open: boolean
  // 来源：'cart'=购物车结算, 'buy-now'=立即购买
  source: 'cart' | 'buy-now'
  items: CheckoutItem[]
}

interface Emits {
  (e: 'update:open', val: boolean): void
  (e: 'success'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const submitting = ref(false)
const payType = ref<1 | 2 | 3>(1)

const payOptions = [
  { value: 1 as const, label: '支付宝', icon: '🔵' },
  { value: 2 as const, label: '微信支付', icon: '🟢' },
  { value: 3 as const, label: '余额支付', icon: '🟡' },
]

const totalPrice = computed(() => {
  const sum = props.items.reduce((acc, i) => acc + i.price, 0)
  return (sum / 100).toFixed(2)
})

const handleCancel = () => {
  if (!submitting.value) emit('update:open', false)
}

const handleSubmit = async () => {
  if (props.items.length === 0) {
    message.warning('请选择商品')
    return
  }

  submitting.value = true
  try {
    let orderNo = ''

    if (props.source === 'cart') {
      // 购物车结算
      const cartIds = props.items.map((i) => i.cartId!)
      const res = await createOrder({ cartIds })
      orderNo = res.orderNo
    } else {
      // 立即购买（单本）
      const bookId = props.items[0].bookId!
      const res = await buyNow(bookId)
      orderNo = res.orderNo
    }

    // 通过 orderNo 查询 orderId
    const listRes = await getOrderList({ page: 1, pageSize: 5 })
    const order = listRes.list.find((o) => o.orderNo === orderNo)

    if (!order) {
      message.error('订单创建成功，但获取订单信息失败，请前往订单列表查看')
      emit('success')
      return
    }

    // 支付
    await payOrder(order.orderId, payType.value)
    message.success('支付成功！书籍已加入书架')
    emit('success')
  } catch (err: any) {
    message.error(err?.message || '操作失败，请重试')
  } finally {
    submitting.value = false
  }
}

const onImgError = (e: Event) => {
  (e.target as HTMLImageElement).src = getDefaultCover()
}
</script>

<style scoped>
.checkout-body {
  padding: 8px 0;
}

/* 商品列表 */
.order-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  background: #fafafa;
  border-radius: 8px;
}

.item-cover {
  width: 56px;
  height: 78px;
  object-fit: cover;
  border-radius: 4px;
  flex-shrink: 0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-title {
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-author {
  font-size: 13px;
  color: #8c8c8c;
}

.item-price {
  font-size: 16px;
  font-weight: 600;
  color: #ff4d4f;
  flex-shrink: 0;
}

/* 金额汇总 */
.price-summary {
  padding: 0 4px;
}

.price-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #595959;
  margin-bottom: 8px;
}

.price-row.total {
  font-size: 15px;
  font-weight: 500;
  color: #262626;
}

.total-amount {
  font-size: 22px;
  font-weight: 700;
  color: #ff4d4f;
}

/* 支付方式 */
.pay-section {
  padding: 0 4px;
}

.pay-title {
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 12px;
}

.pay-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.pay-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border: 1.5px solid #e8e8e8;
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}

.pay-option:hover {
  border-color: #1677ff;
  background: #f0f7ff;
}

.pay-option.selected {
  border-color: #1677ff;
  background: #f0f7ff;
}

.pay-icon {
  font-size: 20px;
}

.pay-name {
  font-size: 15px;
  font-weight: 500;
}

/* 操作按钮 */
.action-row {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}
</style>
