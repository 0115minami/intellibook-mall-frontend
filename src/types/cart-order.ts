// 购物车 / 订单 / 支付 相关类型

// ── 购物车 ──────────────────────────────────────────────────

export interface CartItem {
  cartId: number
  bookId: number
  bookTitle: string
  author: string
  coverImg: string
  price: number
  categoryId: number
  categoryName: string
  language: string
  status: 0 | 1   // 1=上架, 0=已下架
  createTime: string
}

export interface CartListResult {
  list: CartItem[]
  total: number
}

export interface CartCount {
  count: number
}

// ── 订单 ──────────────────────────────────────────────────

export interface OrderItem {
  itemId: number
  bookId: number
  bookTitle: string
  author: string
  coverImg: string
  price: number
}

export interface OrderDetail {
  orderId: number
  orderNo: string
  totalPrice: number
  payStatus: 0 | 1
  payStatusText: string
  payType?: number
  payTypeText?: string
  orderStatus: 0 | 1 | 2
  orderStatusText: string
  extraInfo?: string
  createTime: string
  payTime?: string
  items: OrderItem[]
}

export interface OrderListItem {
  orderId: number
  orderNo: string
  totalPrice: number
  payStatus: 0 | 1
  payStatusText: string
  orderStatus: 0 | 1 | 2
  orderStatusText: string
  itemCount: number
  createTime: string
  payTime?: string
}

export interface OrderPageData {
  pageNum: number
  pageSize: number
  totalCount: number
  totalPages: number
  list: OrderListItem[]
  hasPrevious: boolean
  hasNext: boolean
}

// 创建订单请求
export interface CreateOrderParam {
  cartIds?: number[]
  bookIds?: number[]
  remark?: string
}

// 创建订单响应
export interface CreateOrderResult {
  orderNo: string
}
