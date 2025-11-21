// 电子书相关类型定义

export interface EBook {
  bookId: number
  bookTitle: string
  author: string
  isbn?: string
  publisher?: string
  publishDate?: string
  bookIntro: string
  categoryId: number
  categoryName?: string
  coverImg: string
  fileFormat: 'PDF' | 'EPUB' | 'MOBI'
  filePath: string
  fileSize: number
  pageCount: number
  originalPrice: number
  sellingPrice: number
  tags: string
  avgRating: number
  ratingCount: number
  sellStatus: 0 | 1
  createTime: string
  updateTime: string
}

export interface EBookSearchParam {
  keyword?: string
  author?: string
  isbn?: string
  categoryId?: number
  tagIds?: number[]
  minPrice?: number
  maxPrice?: number
  startYear?: number
  endYear?: number
  sortBy?: 'price' | 'rating' | 'date' | 'sales'
  sortOrder?: 'asc' | 'desc'
  pageNumber: number
  pageSize: number
}

export interface EBookCategory {
  categoryId: number
  categoryLevel: number
  parentId: number
  categoryName: string
  categoryRank: number
  children?: EBookCategory[]
}
