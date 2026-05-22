import request from '@/utils/request'
import type { PageResult } from '@/types/ebook'
import type { Review, CreateReviewParam } from '@/types/review'

/**
 * 获取书籍评价列表
 */
export const getBookReviews = (bookId: number, params: { pageNum: number; pageSize: number }) => {
    return request.get<any, PageResult<Review>>(`/api/review/book/${bookId}`, { params })
}

/**
 * 创建评价
 */
export const createReview = (params: CreateReviewParam) => {
    return request.post<any, any>('/api/review/create', params)
}

/**
 * 点赞评价
 */
export const likeReview = (reviewId: number) => {
    return request.post<any, any>(`/api/review/like/${reviewId}`)
}

/**
 * 取消点赞
 */
export const unlikeReview = (reviewId: number) => {
    return request.delete<any, any>(`/api/review/unlike/${reviewId}`)
}
