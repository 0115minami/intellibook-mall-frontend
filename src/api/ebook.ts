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
 * 获取所有一级分类
 */
export const getTopCategories = () => {
    return request.get<any, EBookCategory[]>('/api/categories/top')
}

/**
 * 获取指定父分类下的子分类
 */
export const getSubCategories = (parentId: number) => {
    return request.get<any, EBookCategory[]>(`/api/categories/parent/${parentId}`)
}

/**
 * 获取分类下的电子书
 */
export const getEBooksByCategory = (categoryId: number, params: Partial<EBookSearchParam>) => {
    return request.get<any, PageResult<EBook>>(`/api/ebooks/category/${categoryId}`, { params })
}
