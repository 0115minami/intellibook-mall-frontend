// API 响应类型定义

export interface ApiResponse<T = any> {
  resultCode: number
  message: string
  data: T
}

export interface PageResult<T> {
  list: T[]
  total: number
  pageNum: number
  pageSize: number
}
