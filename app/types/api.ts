// API 响应相关类型定义

export interface ApiResponse<T = any> {
  resultCode: number
  message: string
  data: T
}

export interface PageResult<T> {
  list: T[]
  totalCount: number
  pageNum: number
  pageSize: number
  totalPages: number
}

export interface ApiError {
  message: string
  statusCode?: number
}
