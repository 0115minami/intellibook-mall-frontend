export interface Review {
  reviewId: number
  userId: number
  username: string
  nickname: string
  bookId: number
  bookTitle?: string
  rating: number
  content: string
  likeCount: number
  isLiked?: boolean
  createTime: string
}

export interface CreateReviewParam {
  bookId: number
  rating: number
  content?: string
}
