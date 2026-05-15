/**
 * 图片处理工具函数
 */

/**
 * 获取封面图片的完整 URL
 * @param coverImg 封面图片路径（可能是相对路径或完整URL）
 * @returns 完整的图片 URL
 */
export function getCoverUrl(coverImg: string | undefined | null): string | undefined {
  if (!coverImg) return undefined

  const baseUrl = import.meta.env.VITE_COVER_BASE || 'http://localhost:8080/files/covers'

  // 如果已经是完整URL,直接返回
  if (coverImg.startsWith('http')) {
    return coverImg
  }

  // 移除路径开头的 covers/，因为 baseUrl 已经包含了
  return `${baseUrl}/${coverImg.replace(/^covers\//, '')}`
}

/**
 * 获取电子书文件的完整 URL
 * @param filePath 文件路径
 * @returns 完整的文件 URL
 */
export function getEBookFileUrl(filePath: string | undefined | null): string | undefined {
  if (!filePath) return undefined

  const baseUrl = import.meta.env.VITE_EBOOK_BASE || 'http://localhost:8080/files/books'

  // 如果已经是完整URL,直接返回
  if (filePath.startsWith('http')) {
    return filePath
  }

  // 移除路径开头的 books/，因为 baseUrl 已经包含了
  return `${baseUrl}/${filePath.replace(/^books\//, '')}`
}

/**
 * 获取默认封面（SVG占位图）
 * @returns SVG 数据 URL
 */
export function getDefaultCover(): string {
  return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="280"%3E%3Crect width="200" height="280" fill="%23f0f0f0"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%23999"%3E暂无封面%3C/text%3E%3C/svg%3E'
}
