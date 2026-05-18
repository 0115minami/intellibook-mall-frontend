<template>
  <MainLayout>
    <div class="cart-page">
      <div class="cart-container">
        <!-- 标题栏 -->
        <div class="cart-header">
          <h2>购物车（{{ cartList.length }}）</h2>
          <a-button
            v-if="cartList.length > 0"
            danger
            ghost
            size="small"
            :loading="clearing"
            @click="handleClearCart"
          >
            清空购物车
          </a-button>
        </div>

        <!-- 加载中 -->
        <div v-if="loading" class="loading-wrap">
          <a-spin size="large" />
        </div>

        <!-- 空购物车 -->
        <a-empty
          v-else-if="cartList.length === 0"
          description="购物车空空如也"
          style="padding: 80px 0"
        >
          <template #image><span style="font-size: 64px">🛒</span></template>
          <template #extra>
            <a-button type="primary" @click="router.push('/ebooks')">去逛逛</a-button>
          </template>
        </a-empty>

        <!-- 购物车列表 -->
        <template v-else>
          <!-- 全选行 -->
          <div class="select-all-row">
            <a-checkbox
              :checked="isAllSelected"
              :indeterminate="isIndeterminate"
              @change="toggleSelectAll"
            >
              全选
            </a-checkbox>
            <span class="selected-hint">已选择 {{ selectedItems.length }} 件商品</span>
          </div>

          <!-- 商品列表 -->
          <div class="item-list">
            <div
              v-for="item in cartList"
              :key="item.cartId"
              class="cart-item"
              :class="{ disabled: item.status === 0 }"
            >
              <!-- 勾选框 -->
              <a-checkbox
                :checked="selectedIds.has(item.cartId)"
                :disabled="item.status === 0"
                @change="toggleItem(item)"
              />

              <!-- 封面 -->
              <img
                :src="getCoverUrl(item.coverImg)"
                :alt="item.bookTitle"
                class="item-cover"
                @error="onImgError"
                @click="router.push(`/ebooks/${item.bookId}`)"
              />

              <!-- 信息 -->
              <div class="item-info">
                <div
                  class="item-title"
                  @click="router.push(`/ebooks/${item.bookId}`)"
                >
                  {{ item.bookTitle }}
                </div>
                <div class="item-meta">作者: {{ item.author }}</div>
                <div class="item-meta">分类: {{ item.categoryName }}</div>
                <div class="item-meta">语言: {{ item.language }}</div>
                <a-tag v-if="item.status === 0" color="default" style="margin-top: 4px">
                  商品已下架
                </a-tag>
              </div>

              <!-- 价格 -->
              <div class="item-price">¥{{ (item.price / 100).toFixed(2) }}</div>

              <!-- 删除 -->
              <a-button
                type="link"
                danger
                size="small"
                :loading="removingIds.has(item.cartId)"
                @click="handleRemove(item)"
              >
                删除
              </a-button>
            </div>
          </div>

          <!-- 底部结算栏 -->
          <div class="cart-footer">
            <div class="footer-left">
              <a-checkbox
                :checked="isAllSelected"
                :indeterminate="isIndeterminate"
                @change="toggleSelectAll"
              >
                全选
              </a-checkbox>
              <span class="selected-hint">已选择 {{ selectedItems.length }} 件商品</span>
            </div>
            <div class="footer-right">
              <span class="total-label">
                总计：<span class="total-price">¥{{ totalPrice }}</span>
              </span>
              <a-button
                type="primary"
                size="large"
                :disabled="selectedItems.length === 0"
                @click="handleCheckout"
              >
                去结算
              </a-button>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- 确认订单弹窗 -->
    <CheckoutModal
      v-model:open="showCheckout"
      :items="selectedItems"
      :source="'cart'"
      @success="handlePaySuccess"
    />
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import MainLayout from '@/components/layout/MainLayout.vue'
import CheckoutModal from '@/components/checkout/CheckoutModal.vue'
import { getCartList, removeCartItem, clearCart } from '@/api/cart-order'
import { getCoverUrl, getDefaultCover } from '@/utils/image'
import { useCartStore } from '@/stores/cart'
import type { CartItem } from '@/types/cart-order'

const router = useRouter()
const cartStore = useCartStore()

const loading = ref(false)
const clearing = ref(false)
const cartList = ref<CartItem[]>([])
const selectedIds = ref<Set<number>>(new Set())
const removingIds = ref<Set<number>>(new Set())
const showCheckout = ref(false)

// 已选中的有效商品
const selectedItems = computed(() =>
  cartList.value.filter((i) => selectedIds.value.has(i.cartId) && i.status === 1)
)

// 总价
const totalPrice = computed(() => {
  const sum = selectedItems.value.reduce((acc, i) => acc + i.price, 0)
  return (sum / 100).toFixed(2)
})

// 全选状态
const validItems = computed(() => cartList.value.filter((i) => i.status === 1))
const isAllSelected = computed(
  () => validItems.value.length > 0 && validItems.value.every((i) => selectedIds.value.has(i.cartId))
)
const isIndeterminate = computed(
  () => !isAllSelected.value && validItems.value.some((i) => selectedIds.value.has(i.cartId))
)

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedIds.value = new Set()
  } else {
    selectedIds.value = new Set(validItems.value.map((i) => i.cartId))
  }
}

const toggleItem = (item: CartItem) => {
  const next = new Set(selectedIds.value)
  if (next.has(item.cartId)) next.delete(item.cartId)
  else next.add(item.cartId)
  selectedIds.value = next
}

// 加载购物车
const loadCart = async () => {
  loading.value = true
  try {
    const res = await getCartList()
    cartList.value = res.list
    // 默认全选有效商品
    selectedIds.value = new Set(res.list.filter((i) => i.status === 1).map((i) => i.cartId))
  } catch {
    message.error('加载购物车失败')
  } finally {
    loading.value = false
  }
}

// 删除单项
const handleRemove = (item: CartItem) => {
  Modal.confirm({
    title: '删除商品',
    content: `确定从购物车移除《${item.bookTitle}》吗？`,
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      removingIds.value.add(item.cartId)
      try {
        await removeCartItem(item.cartId)
        cartList.value = cartList.value.filter((i) => i.cartId !== item.cartId)
        selectedIds.value.delete(item.cartId)
        cartStore.decrement()
        message.success('已移除')
      } catch {
        message.error('操作失败')
      } finally {
        removingIds.value.delete(item.cartId)
      }
    },
  })
}

// 清空购物车
const handleClearCart = () => {
  Modal.confirm({
    title: '清空购物车',
    content: '确定清空购物车中的所有商品吗？',
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: async () => {
      clearing.value = true
      try {
        await clearCart()
        cartList.value = []
        selectedIds.value = new Set()
        cartStore.reset()
        message.success('购物车已清空')
      } catch {
        message.error('操作失败')
      } finally {
        clearing.value = false
      }
    },
  })
}

// 去结算
const handleCheckout = () => {
  if (selectedItems.value.length === 0) {
    message.warning('请选择要购买的商品')
    return
  }
  showCheckout.value = true
}

// 支付成功
const handlePaySuccess = () => {
  showCheckout.value = false
  // 从购物车移除已购买的商品
  const paidIds = new Set(selectedItems.value.map((i) => i.cartId))
  cartList.value = cartList.value.filter((i) => !paidIds.has(i.cartId))
  selectedIds.value = new Set()
  cartStore.fetchCount()
  router.push('/orders')
}

const onImgError = (e: Event) => {
  (e.target as HTMLImageElement).src = getDefaultCover()
}

onMounted(() => {
  loadCart()
  cartStore.fetchCount()
})
</script>

<style scoped>
.cart-page {
  min-height: calc(100vh - 64px);
  background: #f5f5f5;
  padding: 24px;
}

.cart-container {
  max-width: 900px;
  margin: 0 auto;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.cart-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.loading-wrap {
  text-align: center;
  padding: 80px 0;
}

/* 全选行 */
.select-all-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #fff;
  border-radius: 8px 8px 0 0;
  border-bottom: 1px solid #f0f0f0;
}

.selected-hint {
  font-size: 13px;
  color: #8c8c8c;
}

/* 商品列表 */
.item-list {
  background: #fff;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-bottom: 1px solid #f5f5f5;
  transition: background 0.15s;
}

.cart-item:hover {
  background: #fafafa;
}

.cart-item.disabled {
  opacity: 0.5;
}

.item-cover {
  width: 72px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
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
  cursor: pointer;
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-title:hover {
  color: #1677ff;
}

.item-meta {
  font-size: 12px;
  color: #8c8c8c;
  line-height: 1.8;
}

.item-price {
  font-size: 16px;
  font-weight: 600;
  color: #ff4d4f;
  min-width: 80px;
  text-align: right;
  flex-shrink: 0;
}

/* 底部结算栏 */
.cart-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: #fff;
  border-radius: 0 0 8px 8px;
  border-top: 1px solid #f0f0f0;
  position: sticky;
  bottom: 0;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.footer-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.total-label {
  font-size: 14px;
  color: #595959;
}

.total-price {
  font-size: 22px;
  font-weight: 700;
  color: #ff4d4f;
}
</style>
