import request from '@/utils/request'
import type {
  AdminEBookSearchParam,
  AdminEBookVO,
  AdminEBookCreateParam,
  AdminEBookUpdateParam,
  BatchOperationResult,
  PageResult,
} from '@/types/admin'

// 查询图书列表
export function getAdminEBooks(params: AdminEBookSearchParam) {
  return request.get<any, PageResult<AdminEBookVO>>('/api/admin/ebooks', { params })
}

// 获取图书详情
export function getAdminEBookDetail(bookId: number) {
  return request.get<any, AdminEBookVO>(`/api/admin/ebooks/${bookId}`)
}

// 创建图书
export function createAdminEBook(data: AdminEBookCreateParam) {
  const formData = new FormData()
  
  // 添加基本字段
  formData.append('bookTitle', data.bookTitle)
  formData.append('author', data.author)
  formData.append('categoryId', String(data.categoryId))
  formData.append('price', String(data.price))
  
  if (data.isbn) formData.append('isbn', data.isbn)
  if (data.publisher) formData.append('publisher', data.publisher)
  if (data.publishDate) formData.append('publishDate', data.publishDate)
  if (data.bookIntro) formData.append('bookIntro', data.bookIntro)
  if (data.language) formData.append('language', data.language)
  if (data.tags) formData.append('tags', data.tags)
  if (data.pageCount) formData.append('pageCount', String(data.pageCount))
  
  // 添加封面图片
  if (data.coverImage) {
    formData.append('coverImage', data.coverImage)
  }
  
  // 添加电子书文件
  if (data.ebookFiles && data.ebookFiles.length > 0) {
    data.ebookFiles.forEach((item, index) => {
      formData.append(`ebookFiles[${index}].fileFormat`, item.fileFormat)
      formData.append(`ebookFiles[${index}].file`, item.file)
    })
  }
  
  return request.post<any, { bookId: number }>('/api/admin/ebooks', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

// 更新图书
export function updateAdminEBook(bookId: number, data: AdminEBookUpdateParam) {
  const formData = new FormData()
  
  // 添加基本字段
  if (data.bookTitle) formData.append('bookTitle', data.bookTitle)
  if (data.author) formData.append('author', data.author)
  if (data.isbn) formData.append('isbn', data.isbn)
  if (data.publisher) formData.append('publisher', data.publisher)
  if (data.publishDate) formData.append('publishDate', data.publishDate)
  if (data.bookIntro) formData.append('bookIntro', data.bookIntro)
  if (data.categoryId) formData.append('categoryId', String(data.categoryId))
  if (data.price !== undefined) formData.append('price', String(data.price))
  if (data.language) formData.append('language', data.language)
  if (data.tags) formData.append('tags', data.tags)
  if (data.pageCount) formData.append('pageCount', String(data.pageCount))
  
  // 添加封面图片
  if (data.coverImage) {
    formData.append('coverImage', data.coverImage)
  }
  
  // 添加新电子书文件
  if (data.newEbookFiles && data.newEbookFiles.length > 0) {
    data.newEbookFiles.forEach((item, index) => {
      formData.append(`newEbookFiles[${index}].fileFormat`, item.fileFormat)
      formData.append(`newEbookFiles[${index}].file`, item.file)
    })
  }
  
  // 添加要删除的文件ID
  if (data.deleteFileIds && data.deleteFileIds.length > 0) {
    data.deleteFileIds.forEach((id) => {
      formData.append('deleteFileIds', String(id))
    })
  }
  
  return request.put(`/api/admin/ebooks/${bookId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

// 更新图书状态
export function updateAdminEBookStatus(bookId: number, status: 0 | 1) {
  return request.patch(`/api/admin/ebooks/${bookId}/status`, { status })
}

// 批量更新状态
export function batchUpdateAdminEBookStatus(bookIds: number[], status: 0 | 1) {
  return request.patch<any, BatchOperationResult>('/api/admin/ebooks/batch/status', {
    bookIds,
    status,
  })
}

// 删除图书
export function deleteAdminEBook(bookId: number) {
  return request.delete(`/api/admin/ebooks/${bookId}`)
}

// 批量删除图书
export function batchDeleteAdminEBooks(bookIds: number[]) {
  return request.delete<any, BatchOperationResult>('/api/admin/ebooks/batch', {
    data: { bookIds },
  })
}

// 删除电子书文件
export function deleteAdminEBookFile(bookId: number, fileId: number) {
  return request.delete(`/api/admin/ebooks/${bookId}/files/${fileId}`)
}

// 添加电子书文件
export function addAdminEBookFile(bookId: number, fileFormat: string, file: File) {
  const formData = new FormData()
  formData.append('fileFormat', fileFormat)
  formData.append('file', file)
  
  return request.post<any, { fileId: number }>(`/api/admin/ebooks/${bookId}/files`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
