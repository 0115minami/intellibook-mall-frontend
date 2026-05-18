import request from '@/utils/request'
import type {
  PageData,
  BookshelfItem,
  FavoriteItem,
  MyReview,
  UpdateUserInfoParam,
  ReadPermission,
  FavoriteStatus,
  ReviewStatus,
} from '@/types/user-center'
import type { User } from '@/types/user'

// ── 个人资料 ──────────────────────────────────────────────

export const getUserInfo = () =>
  request.get<any, User>('/api/v1/user/info')

export const updateUserInfo = (data: UpdateUserInfoParam) =>
  request.put('/api/v1/user/info', data)

// ── 我的书架 ──────────────────────────────────────────────

export const getBookshelfList = (params: {
  page?: number
  pageSize?: number
  sortBy?: 'recent' | 'purchase' | 'title'
}) => request.get<any, PageData<BookshelfItem>>('/api/bookshelf/list', { params })

export const checkReadPermission = (bookId: number) =>
  request.get<any, ReadPermission>(`/api/bookshelf/check/${bookId}`)

export const updateReadProgress = (data: {
  bookId: number
  fileFormat: string
  lastPosition?: string
}) => request.post('/api/bookshelf/progress', data)

// ── 我的收藏 ──────────────────────────────────────────────

export const getFavoriteList = (params: { page?: number; pageSize?: number }) =>
  request.get<any, PageData<FavoriteItem>>('/api/favorite/list', { params })

export const addFavorite = (bookId: number) =>
  request.post(`/api/favorite/add/${bookId}`)

export const removeFavorite = (bookId: number) =>
  request.delete(`/api/favorite/remove/${bookId}`)

export const checkFavorite = (bookId: number) =>
  request.get<any, FavoriteStatus>(`/api/favorite/check/${bookId}`)

// ── 我的评论 ──────────────────────────────────────────────

export const getMyReviews = (params: { page?: number; pageSize?: number }) =>
  request.get<any, PageData<MyReview>>('/api/review/my', { params })

export const createReview = (data: { bookId: number; rating: number; content?: string }) =>
  request.post('/api/review/create', data)

export const updateReview = (
  reviewId: number,
  data: { bookId: number; rating: number; content?: string }
) => request.put(`/api/review/update/${reviewId}`, data)

export const deleteReview = (reviewId: number) =>
  request.delete(`/api/review/delete/${reviewId}`)

export const likeReview = (reviewId: number) =>
  request.post(`/api/review/like/${reviewId}`)

export const unlikeReview = (reviewId: number) =>
  request.delete(`/api/review/unlike/${reviewId}`)

export const checkReviewed = (bookId: number) =>
  request.get<any, ReviewStatus>(`/api/review/check/${bookId}`)
