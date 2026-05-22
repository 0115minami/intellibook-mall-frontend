<template>
  <MainLayout>
    <div class="detail-page">

      <!-- 加载状态 -->
      <div v-if="loading" class="loading-wrap">
        <a-skeleton active avatar :paragraph="{ rows: 8 }" />
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="error-wrap">
        <a-result
          status="404"
          title="未找到该电子书"
          sub-title="该电子书可能已下架或链接有误"
        >
          <template #extra>
            <a-button type="primary" @click="router.push('/ebooks')">返回书库</a-button>
          </template>
        </a-result>
      </div>

      <!-- 详情内容 -->
      <template v-else-if="book">

        <!-- ── 主信息区 ── -->
        <div class="main-section">
          <!-- 封面 -->
          <div class="cover-col">
            <img
              :src="coverUrl"
              :alt="book.bookTitle"
              class="cover-img"
              @error="onCoverError"
            />
          </div>

          <!-- 信息 -->
          <div class="info-col">
            <!-- 书名 -->
            <h1 class="book-title">{{ book.bookTitle }}</h1>

            <!-- 作者 -->
            <div class="author">by {{ book.author }}</div>

            <!-- 评分 -->
            <div class="rating-row">
              <a-rate :value="book.rating" allow-half disabled />
              <span class="rating-num">{{ book.rating.toFixed(1) }}</span>
              <span class="rating-count">（{{ book.ratingCount }} 人评分）</span>
            </div>

            <!-- 价格 -->
            <div class="price-row">
              <span class="price">¥{{ (book.price / 100).toFixed(2) }}</span>
            </div>

            <!-- 操作按钮 -->
            <div class="action-row">
              <template v-if="isPurchased">
                <!-- 已购买：显示阅读和下载 -->
                <a-button
                  type="primary"
                  size="large"
                  class="btn-read"
                  @click="handleRead"
                >
                  <ReadOutlined />
                  在线阅读
                </a-button>
                <a-dropdown v-if="book.files && book.files.length > 0">
                  <a-button size="large">
                    ⬇ 下载
                    <DownOutlined />
                  </a-button>
                  <template #overlay>
                    <a-menu>
                      <a-menu-item
                        v-for="file in book.files"
                        :key="file.fileId"
                        @click="handleDownload(file)"
                      >
                        {{ file.fileFormat }}
                        <span class="file-size">（{{ formatFileSize(file.fileSize) }}）</span>
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </template>
              <template v-else>
                <!-- 未购买：显示购物车和立即购买 -->
                <a-button
                  type="primary"
                  size="large"
                  :loading="addingToCart"
                  @click="handleAddToCart"
                >
                  🛒 加入购物车
                </a-button>
                <a-button size="large" @click="handleBuyNow">
                  立即购买
                </a-button>
              </template>

              <!-- 收藏按钮 -->
              <a-button
                :type="isFavorited ? 'default' : 'dashed'"
                size="large"
                :loading="favoriteLoading"
                @click="handleToggleFavorite"
              >
                {{ isFavorited ? '❤ 已收藏' : '🤍 收藏' }}
              </a-button>
            </div>

            <!-- 文件格式标签 -->
            <div v-if="book.files && book.files.length > 0" class="format-row">
              <span class="label">可用格式：</span>
              <a-tag
                v-for="file in book.files"
                :key="file.fileId"
                color="blue"
              >
                {{ file.fileFormat }} · {{ formatFileSize(file.fileSize) }}
              </a-tag>
            </div>

            <!-- 标签 -->
            <div v-if="book.tags" class="tags-row">
              <span class="label">标签：</span>
              <a-tag
                v-for="tag in tagList"
                :key="tag"
                class="tag-item"
                @click="router.push(`/ebooks?keyword=${tag}`)"
              >
                {{ tag }}
              </a-tag>
            </div>
          </div>
        </div>

        <!-- ── 详情标签页 ── -->
        <div class="tabs-section">
          <a-tabs v-model:activeKey="activeTab">
            <!-- About Book -->
            <a-tab-pane key="about" tab="书籍简介">
              <!-- 简介 -->
              <div class="intro-text">{{ book.bookIntro }}</div>

              <!-- 元数据表格 -->
              <a-divider />
              <div class="meta-grid">
                <div class="meta-row" v-if="book.categoryName">
                  <span class="meta-label">分类：</span>
                  <a-space>
                    <a
                      v-if="book.parentCategoryName"
                      class="meta-link"
                      @click="router.push('/ebooks')"
                    >{{ book.parentCategoryName }}</a>
                    <span v-if="book.parentCategoryName">›</span>
                    <a
                      class="meta-link"
                      @click="router.push(`/ebooks?categoryId=${book.categoryId}`)"
                    >{{ book.categoryName }}</a>
                  </a-space>
                </div>
                <div class="meta-row">
                  <span class="meta-label">语言：</span>
                  <span>{{ languageLabel }}</span>
                </div>
                <div class="meta-row" v-if="book.publisher">
                  <span class="meta-label">出版社：</span>
                  <span>{{ book.publisher }}</span>
                </div>
                <div class="meta-row" v-if="book.publishDate">
                  <span class="meta-label">出版日期：</span>
                  <span>{{ book.publishDate }}</span>
                </div>
                <div class="meta-row" v-if="book.pageCount">
                  <span class="meta-label">页数：</span>
                  <span>{{ book.pageCount }} 页</span>
                </div>
                <div class="meta-row" v-if="book.isbn">
                  <span class="meta-label">ISBN：</span>
                  <span>{{ book.isbn }}</span>
                </div>
              </div>
            </a-tab-pane>

            <!-- Comments -->
            <a-tab-pane key="comments" tab="评论">
              <div class="comments-section">
                <!-- 顶栏操作区 -->
                <div class="comments-header">
                  <h3>全部评论 ({{ reviewTotal }})</h3>
                  <a-button
                    type="primary"
                    :disabled="hasReviewed"
                    @click="handleWriteReview"
                  >
                    ✍️ {{ hasReviewed ? '已评价' : '写评价' }}
                  </a-button>
                </div>

                <a-divider />

                <!-- 评论列表 -->
                <a-skeleton :loading="reviewsLoading" active>
                  <template v-if="reviews.length > 0">
                    <div v-for="review in reviews" :key="review.reviewId" class="review-item">
                      <div class="review-meta">
                        <span class="review-author">{{ review.nickname || review.username }}</span>
                        <a-rate :value="review.rating" disabled class="review-rating" />
                      </div>
                      <div class="review-content">{{ review.content }}</div>
                      <div class="review-footer">
                        <span class="review-time">{{ review.createTime }}</span>
                        <a-button
                          type="text"
                          size="small"
                          :class="['btn-like', { liked: review.isLiked }]"
                          :loading="likingIds.has(review.reviewId)"
                          @click="handleLikeReview(review)"
                        >
                          {{ review.isLiked ? '👍' : '👍' }}
                          {{ review.likeCount || 0 }}
                        </a-button>
                      </div>
                      <a-divider style="margin: 16px 0;" />
                    </div>

                    <div class="pagination-wrapper" v-if="reviewTotal > reviews.length">
                      <a-button type="dashed" block @click="loadReviews(true)">加载更多评论...</a-button>
                    </div>
                  </template>
                  
                  <a-empty v-else description="暂无评价，快来抢沙发吧！" />
                </a-skeleton>
              </div>
            </a-tab-pane>
          </a-tabs>
        </div>

        <!-- ── 相关推荐区（开发中，等待后端推荐 API） ──
        <div class="recommend-section">
          <h2 class="section-title">您可能会感兴趣</h2>
          <a-row :gutter="[16, 16]">
            <a-col
              v-for="item in relatedBooks"
              :key="item.bookId"
              :xs="12" :sm="8" :md="6" :lg="4" :xl="3"
            >
              <EBookCard :book="item" />
            </a-col>
          </a-row>
        </div>
        -->

        <!-- 猜你喜欢推荐区域 -->
        <a-divider style="margin: 48px 0" />
        <RecommendSection
          title="💡 猜你喜欢"
          :limit="8"
          layout="grid"
          :use-personalized="true"
        />

      </template>
    </div>

    <!-- 发表评论弹窗 -->
    <a-modal
      :open="showReviewModal"
      title="发表评价"
      :confirm-loading="submittingReview"
      ok-text="提交评价"
      cancel-text="取消"
      @ok="handleSubmitReview"
      @cancel="showReviewModal = false"
    >
      <div class="review-form">
        <div class="review-form-row">
          <span class="review-form-label">评分</span>
          <a-rate v-model:value="reviewForm.rating" allow-half />
        </div>
        <div class="review-form-row">
          <span class="review-form-label">评价内容</span>
          <a-textarea
            v-model:value="reviewForm.content"
            :rows="5"
            placeholder="分享您的阅读感受（选填）"
            :maxlength="500"
            show-count
          />
        </div>
      </div>
    </a-modal>

    <!-- 立即购买弹窗 -->
    <CheckoutModal
      v-if="book"
      v-model:open="showBuyNow"
      source="buy-now"
      :items="[{ bookId: book.bookId, bookTitle: book.bookTitle, author: book.author, coverImg: book.coverImg, price: book.price }]"
      @success="handleBuyNowSuccess"
    />
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { DownOutlined, ReadOutlined } from '@ant-design/icons-vue'
import MainLayout from '@/components/layout/MainLayout.vue'
import RecommendSection from '@/components/recommend/RecommendSection.vue'
import CheckoutModal from '@/components/checkout/CheckoutModal.vue'
import { getEBookDetail } from '@/api/ebook'
import { getBookReviews, createReview, likeReview, unlikeReview } from '@/api/review'
import { checkFavorite, addFavorite, removeFavorite, checkReadPermission, checkReviewed } from '@/api/user-center'
import { addToCart } from '@/api/cart-order'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useAuthModalStore } from '@/stores/authModal'
import type { EBook, EBookFile } from '@/types/ebook'
import type { Review } from '@/types/review'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const authModalStore = useAuthModalStore()
const cartStore = useCartStore()

// ── 状态 ──
const book = ref<EBook | null>(null)
const loading = ref(true)
const error = ref(false)
const activeTab = ref('about')
const addingToCart = ref(false)
const favoriteLoading = ref(false)
const showBuyNow = ref(false)
const isFavorited = ref(false)
const isPurchased = ref(false)

// 检查收藏、购买和评论状态
const checkStatus = async (bookId: number) => {
  if (!authStore.isAuthenticated) return
  try {
    const [favRes, readRes, reviewRes] = await Promise.allSettled([
      checkFavorite(bookId),
      checkReadPermission(bookId),
      checkReviewed(bookId),
    ])
    if (favRes.status === 'fulfilled') isFavorited.value = favRes.value.isFavorite
    if (readRes.status === 'fulfilled') isPurchased.value = readRes.value.hasPurchased
    if (reviewRes.status === 'fulfilled') hasReviewed.value = reviewRes.value.hasReviewed
  } catch {
    // 忽略
  }
}

// ── 评价专属状态 ──
const reviews = ref<Review[]>([])
const reviewsLoading = ref(false)
const reviewTotal = ref(0)
const reviewPage = ref(1)
const REVIEWS_PAGE_SIZE = 5

// 发表评论弹窗
const showReviewModal = ref(false)
const reviewForm = ref({ rating: 5, content: '' })
const submittingReview = ref(false)
const hasReviewed = ref(false)

// 点赞中的评论 ID 集合（防止重复点击）
const likingIds = ref<Set<number>>(new Set())

// ── 计算属性 ──
const coverUrl = computed(() => {
  const coverImg = book.value?.coverImg
  if (!coverImg) return ''
  const baseUrl = import.meta.env.VITE_COVER_BASE || 'http://localhost:8080/files/covers'
  // 已是完整 URL 直接返回
  if (coverImg.startsWith('http')) return coverImg
  // 去掉 covers/ 前缀后拼接，避免双重路径
  return `${baseUrl}/${coverImg.replace(/^covers\//, '')}`
})

const tagList = computed(() => {
  const tags = book.value?.tags
  if (!tags) return []
  // 后端可能返回数组或逗号分隔字符串，统一处理
  if (Array.isArray(tags)) return tags.filter(Boolean)
  return String(tags).split(',').map(t => t.trim()).filter(Boolean)
})

const languageLabel = computed(() => {
  const map: Record<string, string> = {
    'zh-CN': '中文',
    'en-US': '英文',
    'ja-JP': '日文',
    'ko-KR': '韩文',
  }
  return map[book.value?.language ?? ''] ?? book.value?.language ?? '—'
})

// ── 加载详情 ──
const loadDetail = async () => {
  const id = Number(route.params.id)
  if (!id) { error.value = true; loading.value = false; return }
  try {
    book.value = await getEBookDetail(id)
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

// ── 封面加载失败 ──
const onCoverError = (e: Event) => {
  (e.target as HTMLImageElement).src = '/placeholder-cover.png'
}

// ── 文件大小格式化 ──
const formatFileSize = (bytes: number): string => {
  if (!bytes) return '—'
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

// ── 进入阅读器 ──
const handleRead = () => {
  const files = book.value?.files || []
  const hasPdf = files.some(f => f.fileFormat.toLowerCase() === 'pdf')
  const format = hasPdf ? 'pdf' : (files[0]?.fileFormat?.toLowerCase() || 'pdf')
  router.push({
    name: 'Reader',
    params: { bookId: book.value!.bookId },
    query: { format, title: book.value!.bookTitle },
  })
}

// ── 加入购物车 ──
const handleAddToCart = async () => {
  if (!authStore.isAuthenticated) {
    authModalStore.openLogin()
    message.info('请先登录')
    return
  }
  addingToCart.value = true
  try {
    await addToCart(book.value!.bookId)
    cartStore.increment()
    message.success('已加入购物车')
  } catch (e: any) {
    message.error(e.message || '操作失败')
  } finally {
    addingToCart.value = false
  }
}

// ── 立即购买 ──
const handleBuyNow = () => {
  if (!authStore.isAuthenticated) {
    authModalStore.openLogin()
    message.info('请先登录')
    return
  }
  showBuyNow.value = true
}

const handleBuyNowSuccess = () => {
  showBuyNow.value = false
  isPurchased.value = true
  router.push('/orders')
}

// ── 下载 ──
const handleDownload = (file: EBookFile) => {
  // TODO: 调用下载 API 获取临时链接
  message.info(`下载功能开发中（${file.fileFormat}）`)
}

// ── 收藏 ──
const handleToggleFavorite = async () => {
  if (!authStore.isAuthenticated) {
    authModalStore.openLogin()
    message.info('请先登录')
    return
  }
  favoriteLoading.value = true
  try {
    if (isFavorited.value) {
      await removeFavorite(book.value!.bookId)
      isFavorited.value = false
      message.success('已取消收藏')
    } else {
      await addFavorite(book.value!.bookId)
      isFavorited.value = true
      message.success('已收藏')
    }
  } catch {
    message.error('操作失败')
  } finally {
    favoriteLoading.value = false
  }
}

// ── 获取评价列表 ──
const loadReviews = async (loadMore = false) => {
  const id = Number(route.params.id)
  if (!id) return

  if (loadMore) {
    reviewPage.value++
  } else {
    reviewPage.value = 1
    reviews.value = []
  }

  reviewsLoading.value = true
  try {
    const res = await getBookReviews(id, {
      pageNum: reviewPage.value,
      pageSize: REVIEWS_PAGE_SIZE
    })
    if (loadMore) {
      reviews.value.push(...res.list)
    } else {
      reviews.value = res.list
    }
    reviewTotal.value = res.totalCount
  } catch (e: any) {
    // 忽略特定失败，对于尚未开发完成的后端可能报错
  } finally {
    reviewsLoading.value = false
  }
}

// ── 写评价 ──
const handleWriteReview = () => {
  if (!authStore.isAuthenticated) {
    authModalStore.openLogin()
    message.info('请先登录再发表评价')
    return
  }
  if (hasReviewed.value) {
    message.warning('您已评价过这本书，可在「个人中心 → 我的评论」中编辑')
    return
  }
  reviewForm.value = { rating: 5, content: '' }
  showReviewModal.value = true
}

const handleSubmitReview = async () => {
  if (!reviewForm.value.rating) {
    message.warning('请选择评分')
    return
  }
  submittingReview.value = true
  try {
    await createReview({
      bookId: book.value!.bookId,
      rating: reviewForm.value.rating,
      content: reviewForm.value.content,
    })
    message.success('评价发表成功')
    showReviewModal.value = false
    hasReviewed.value = true
    // 重新加载评论列表
    await loadReviews()
  } catch (e: any) {
    message.error(e.message || '发表失败')
  } finally {
    submittingReview.value = false
  }
}

// ── 点赞评价 ──
const handleLikeReview = async (review: Review) => {
  if (!authStore.isAuthenticated) {
    authModalStore.openLogin()
    message.info('请先登录')
    return
  }
  if (likingIds.value.has(review.reviewId)) return

  likingIds.value.add(review.reviewId)
  try {
    if (review.isLiked) {
      await unlikeReview(review.reviewId)
      review.isLiked = false
      review.likeCount = Math.max(0, review.likeCount - 1)
    } else {
      await likeReview(review.reviewId)
      review.isLiked = true
      review.likeCount++
    }
  } catch {
    message.error('操作失败')
  } finally {
    likingIds.value.delete(review.reviewId)
  }
}

onMounted(() => {
  loadDetail().then(() => {
    const id = Number(route.params.id)
    if (id) checkStatus(id)
  })
  loadReviews()
})
</script>

<style scoped>
.detail-page {
  max-width: 1100px;
  margin: 32px auto;
  padding: 0 24px 60px;
}

/* ── 加载 / 错误 ── */
.loading-wrap,
.error-wrap {
  margin: 60px auto;
}

/* ── 主信息区 ── */
.main-section {
  display: flex;
  gap: 48px;
  align-items: flex-start;
}

.cover-col {
  flex-shrink: 0;
}

.cover-img {
  width: 220px;
  height: auto;
  max-height: 320px;
  object-fit: cover;
  border-radius: 6px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.info-col {
  flex: 1;
  min-width: 0;
}

.book-title {
  font-size: 26px;
  font-weight: 700;
  line-height: 1.3;
  margin-bottom: 8px;
  color: #1a1a1a;
}

.author {
  font-size: 15px;
  color: #555;
  margin-bottom: 16px;
}

.rating-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
}

.rating-num {
  font-size: 18px;
  font-weight: 600;
  color: #faad14;
}

.rating-count {
  color: #999;
  font-size: 14px;
}

.price-row {
  margin-bottom: 24px;
}

.price {
  font-size: 32px;
  font-weight: 700;
  color: #e53e3e;
}

.action-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;
}

.btn-read .btn-tip {
  font-size: 12px;
  opacity: 0.7;
  margin-left: 4px;
}

.format-row,
.tags-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.label {
  color: #666;
  font-size: 14px;
  white-space: nowrap;
}

.tag-item {
  cursor: pointer;
}

.tag-item:hover {
  opacity: 0.8;
}

.file-size {
  color: #999;
  font-size: 12px;
}

/* ── 详情标签页 ── */
.tabs-section {
  margin-top: 48px;
}

.intro-text {
  font-size: 15px;
  color: #444;
  line-height: 1.9;
  white-space: pre-wrap;
}

/* 元数据网格 */
.meta-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 32px;
  margin-top: 8px;
}

.meta-row {
  display: flex;
  gap: 8px;
  font-size: 14px;
  align-items: baseline;
}

.meta-label {
  color: #888;
  white-space: nowrap;
  flex-shrink: 0;
}

.meta-link {
  color: #1890ff;
  cursor: pointer;
}

.meta-link:hover {
  text-decoration: underline;
}

/* ── 评论区 ── */
.comments-section {
  padding-top: 16px;
}

.comments-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comments-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.review-item {
  padding: 8px 0;
}

.review-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.review-author {
  font-weight: 600;
  color: #333;
}

.review-rating {
  font-size: 14px;
}

.review-content {
  font-size: 14px;
  line-height: 1.6;
  color: #555;
  margin-bottom: 12px;
  white-space: pre-wrap;
}

.review-footer {
  display: flex;
  align-items: center;
  gap: 16px;
  color: #999;
}

.review-time {
  font-size: 12px;
}

.btn-like {
  color: #888;
}

.btn-like:hover {
  color: #1890ff;
}

.btn-like.liked {
  color: #1890ff;
  font-weight: 500;
}

/* 评论表单 */
.review-form {
  padding: 8px 0;
}

.review-form-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

.review-form-label {
  font-size: 14px;
  font-weight: 500;
  color: #262626;
}

.pagination-wrapper {
  margin-top: 24px;
  text-align: center;
}

/* ── 响应式 ── */
@media (max-width: 640px) {
  .main-section {
    flex-direction: column;
    gap: 24px;
  }

  .cover-img {
    width: 100%;
    max-height: 260px;
  }

  .book-title {
    font-size: 20px;
  }

  .meta-grid {
    grid-template-columns: 1fr;
  }
}
</style>
