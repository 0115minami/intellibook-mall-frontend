import request from '@/utils/request'
import type { EBook, EBookSearchParam, EBookCategory, PageResult } from '@/types/ebook'

/**
 * 获取电子书列表
 */
export const getEBooks = (params: Partial<EBookSearchParam>) => {
    return request.get<any, PageResult<EBook>>('/api/ebooks/list', { params })
}

/**
 * 搜索电子书
 */
export const searchEBooks = (params: EBookSearchParam) => {
    return request.get<any, PageResult<EBook>>('/api/ebooks/search', { params })
}

/**
 * 获取电子书详情
 */
export const getEBookDetail = (id: number) => {
    return request.get<any, EBook>(`/api/ebooks/${id}`)
}

/**
 * 获取分类列表
 */
export const getCategories = () => {
    return request.get<any, EBookCategory[]>('/api/categories')
}

/**
 * 获取分类下的电子书
 */
export const getEBooksByCategory = (categoryId: number, params: Partial<EBookSearchParam>) => {
    return request.get<any, PageResult<EBook>>(`/api/categories/${categoryId}/ebooks`, { params })
}
