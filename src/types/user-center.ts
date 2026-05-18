// 个人中心相关类型定义

// 通用分页响应
export interface PageData<T> {
  pageNum: number
  pageSize: number
  totalCount: number
  totalPages: number
  list: T[]
  hasPrevious: boolean
  hasNext: boolean
}

// 书架书目
export interface BookshelfItem {
  bookId: number
  bookTitle: string
  author: string
  coverImg: string
  categoryName: string
  price: number
  rating: number
  ratingCount: number
  purchaseTime: string
  orderId: number
  lastReadTime: string | null
  lastReadFormat: string | null
  lastPosition: string | null
  hasReadingProgress: boolean
  availableFormats: string
}

// 收藏书目
export interface FavoriteItem {
  favoriteId: number
  bookId: number
  bookTitle: string
  author: string
  coverImg: string
  price: number
  categoryId: number
  categoryName: string
  rating: number
  language: string
  createTime: string
}

// 我的评论
export interface MyReview {
  reviewId: number
  userId: number
  username: string
  nickname: string
  bookId: number
  bookTitle: string
  rating: number
  content: string
  likeCount: number
  isLiked: boolean
  createTime: string
}

// 更新用户信息请求体
export interface UpdateUserInfoParam {
  nickname: string
  email: string
}

// 阅读权限检查结果
export interface ReadPermission {
  hasPurchased: boolean
  canRead: boolean
  availableFormats: string[]
  lastReadTime: string | null
  lastReadFormat: string | null
  lastPosition: string | null
}

// 收藏状态
export interface FavoriteStatus {
  isFavorite: boolean
}

// 评论状态
export interface ReviewStatus {
  hasReviewed: boolean
}
