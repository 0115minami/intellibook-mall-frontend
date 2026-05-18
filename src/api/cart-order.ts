import request from '@/utils/request'
import type {
  CartListResult,
  CartCount,
  CreateOrderParam,
  CreateOrderResult,
  OrderDetail,
  OrderPageData,
} from '@/types/cart-order'

// ── 购物车 ──────────────────────────────────────────────────

export const addToCart = (bookId: number) =>
  request.post(`/api/cart/add/${bookId}`)

export const getCartList = () =>
  request.get<any, CartListResult>('/api/cart/list')

export const getCartCount = () =>
  request.get<any, CartCount>('/api/cart/count')

export const removeCartItem = (cartId: number) =>
  request.delete(`/api/cart/remove/${cartId}`)

export const clearCart = () =>
  request.delete('/api/cart/clear')

// ── 订单 ──────────────────────────────────────────────────

export const createOrder = (data: CreateOrderParam) =>
  request.post<any, CreateOrderResult>('/api/order/create', data)

export const buyNow = (bookId: number) =>
  request.post<any, CreateOrderResult>(`/api/order/buy-now/${bookId}`)

export const getOrderList = (params: { page?: number; pageSize?: number }) =>
  request.get<any, OrderPageData>('/api/order/list', { params })

export const getOrderDetail = (orderId: number) =>
  request.get<any, OrderDetail>(`/api/order/detail/${orderId}`)

export const cancelOrder = (orderId: number) =>
  request.put(`/api/order/cancel/${orderId}`)

// ── 支付 ──────────────────────────────────────────────────

export const payOrder = (orderId: number, payType: 1 | 2 | 3 = 1) =>
  request.put(`/api/order/pay/${orderId}?payType=${payType}`)
