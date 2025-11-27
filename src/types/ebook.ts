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
    pageCount: number
    price: number
    language: string
    tags: string
    rating: number
    ratingCount: number
    status: 0 | 1
    createTime?: string
    updateTime?: string
    availableFormats?: string[]
}

export interface EBookSearchParam {
    keyword?: string
    author?: string
    isbn?: string
    categoryId?: number
    fileFormat?: string
    minPrice?: number
    maxPrice?: number
    language?: string
    sortBy?: 'price' | 'rating' | 'date'
    sortOrder?: 'asc' | 'desc'
    pageNum: number
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

export interface PageResult<T> {
    list: T[]
    totalCount: number
    pageNum: number
    pageSize: number
    totalPages: number
}
