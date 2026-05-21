import request from '@/utils/request'

// ── 仪表盘 ──────────────────────────────────────────────────

export interface DailyStatItem {
  date: string
  orderCount: number
  sales: number
}

export interface DashboardData {
  todayOrderCount: number
  todayPaidCount: number
  todayCancelCount: number
  todaySales: number
  dailyStats: DailyStatItem[]
}

export const getDashboard = () =>
  request.get<any, DashboardData>('/api/admin/orders/dashboard')

// ── 用户管理 ──────────────────────────────────────────────────

export interface AdminUser {
  userId: number
  username: string
  nickname: string
  email: string
  isAdmin: 0 | 1
  lockedFlag: 0 | 1
  createTime: string
}

export interface AdminUserPageData {
  pageNum: number
  pageSize: number
  totalCount: number
  totalPages: number
  list: AdminUser[]
  hasPrevious: boolean
  hasNext: boolean
}

export const getAdminUsers = (params: {
  keyword?: string
  lockedFlag?: number
  pageNum?: number
  pageSize?: number
}) => request.get<any, AdminUserPageData>('/api/admin/users', { params })

export const getAdminUserDetail = (userId: number) =>
  request.get<any, AdminUser>(`/api/admin/users/${userId}`)

export const lockUser = (userId: number) =>
  request.put(`/api/admin/users/${userId}/lock`)

export const unlockUser = (userId: number) =>
  request.put(`/api/admin/users/${userId}/unlock`)

// ── 订单管理 ──────────────────────────────────────────────────

export interface AdminOrderItem {
  itemId: number
  bookId: number
  bookTitle: string
  author: string
  coverImg: string
  price: number
}

export interface AdminOrderListItem {
  orderId: number
  orderNo: string
  username: string | null
  itemCount: number
  totalPrice: number
  payStatus: 0 | 1
  payStatusText: string
  orderStatus: 0 | 1 | 2
  orderStatusText: string
  createTime: string
  payTime: string | null
}

export interface AdminOrderDetail extends AdminOrderListItem {
  userId: number
  nickname: string
  payType: number
  payTypeText: string
  extraInfo: string
  items: AdminOrderItem[]
}

export interface AdminOrderPageData {
  pageNum: number
  pageSize: number
  totalCount: number
  totalPages: number
  list: AdminOrderListItem[]
  hasPrevious: boolean
  hasNext: boolean
}

export const getAdminOrders = (params: {
  keyword?: string
  payStatus?: number
  orderStatus?: number
  startDate?: string
  endDate?: string
  pageNum?: number
  pageSize?: number
}) => request.get<any, AdminOrderPageData>('/api/admin/orders', { params })

export const getAdminOrderDetail = (orderId: number) =>
  request.get<any, AdminOrderDetail>(`/api/admin/orders/${orderId}`)

export const updateAdminOrderStatus = (orderId: number, orderStatus: 0 | 1 | 2) =>
  request.patch(`/api/admin/orders/${orderId}/status`, { orderStatus })

export const deleteAdminOrder = (orderId: number) =>
  request.delete(`/api/admin/orders/${orderId}`)

export const batchDeleteAdminOrders = (orderIds: number[]) =>
  request.delete('/api/admin/orders/batch', { data: { orderIds } })
