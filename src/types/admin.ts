// 管理员相关类型定义

// 图书搜索参数
export interface AdminEBookSearchParam {
  keyword?: string
  categoryId?: number
  status?: -1 | 0 | 1 // -1:全部, 0:下架, 1:上架
  sortBy?: 'create_time_desc' | 'create_time_asc' | 'price_desc' | 'price_asc' | 'rating_desc' | 'rating_asc' | 'view_count_desc' | 'download_count_desc'
  pageNum?: number
  pageSize?: number
}

// 图书文件
export interface EBookFile {
  fileId: number
  bookId: number
  fileFormat: 'PDF' | 'EPUB' | 'MOBI'
  filePath: string
  fileSize: number
  uploadTime: string
}

// 管理员图书视图对象
export interface AdminEBookVO {
  bookId: number
  bookTitle: string
  author: string
  isbn?: string
  publisher?: string
  publishDate?: string
  bookIntro?: string
  coverUrl?: string
  categoryId: number
  categoryName?: string
  price: number
  status: 0 | 1
  language?: string
  tags?: string
  pageCount?: number
  viewCount: number
  downloadCount: number
  rating?: number
  createTime: string
  updateTime: string
  availableFormats?: string[] // ['PDF', 'EPUB', 'MOBI']
  files?: EBookFile[]
}

// 图书创建参数
export interface AdminEBookCreateParam {
  bookTitle: string
  author: string
  isbn?: string
  publisher?: string
  publishDate?: string
  bookIntro?: string
  categoryId: number
  price: number
  language?: string
  tags?: string
  pageCount?: number
  coverImage?: File
  ebookFiles?: Array<{
    fileFormat: 'PDF' | 'EPUB' | 'MOBI'
    file: File
  }>
}

// 图书更新参数
export interface AdminEBookUpdateParam {
  bookTitle?: string
  author?: string
  isbn?: string
  publisher?: string
  publishDate?: string
  bookIntro?: string
  categoryId?: number
  price?: number
  language?: string
  tags?: string
  pageCount?: number
  coverImage?: File
  newEbookFiles?: Array<{
    fileFormat: 'PDF' | 'EPUB' | 'MOBI'
    file: File
  }>
  deleteFileIds?: number[]
}

// 批量操作结果
export interface BatchOperationResult {
  successCount: number
  failureCount: number
}

// 分页结果
export interface PageResult<T> {
  list: T[]
  total: number
  pageNum: number
  pageSize: number
  pages: number
}
