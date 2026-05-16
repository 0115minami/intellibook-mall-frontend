import request from '@/utils/request'
import type { EBook } from '@/types/ebook'

/**
 * 推荐系统 API
 */

/**
 * 获取个性化推荐（需要登录）
 * @param limit 推荐数量，默认10，最大100
 * @returns 推荐图书列表
 */
export function getPersonalizedRecommendations(limit: number = 10) {
  return request.get<any, EBook[]>('/api/recommend', {
    params: { limit }
  })
}

/**
 * 获取热门推荐（无需登录）
 * @param limit 推荐数量，默认10，最大100
 * @returns 热门图书列表
 */
export function getHotRecommendations(limit: number = 10) {
  return request.get<any, EBook[]>('/api/recommend/hot', {
    params: { limit }
  })
}

/**
 * 获取推荐（智能选择）
 * 如果用户已登录，返回个性化推荐；否则返回热门推荐
 * @param limit 推荐数量
 * @param isAuthenticated 是否已登录
 * @returns 推荐图书列表
 */
export async function getRecommendations(limit: number = 10, isAuthenticated: boolean = false) {
  try {
    if (isAuthenticated) {
      return await getPersonalizedRecommendations(limit)
    } else {
      return await getHotRecommendations(limit)
    }
  } catch (error) {
    // 如果个性化推荐失败，降级到热门推荐
    console.warn('个性化推荐失败，使用热门推荐:', error)
    return await getHotRecommendations(limit)
  }
}
