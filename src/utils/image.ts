/**
 * 图片处理工具函数
 */

// 开发环境走 Vite 代理，生产环境用环境变量
const getBase = () =>
  import.meta.env.PROD ? (import.meta.env.VITE_API_BASE || '') : ''

/**
 * 获取封面图片的完整 URL
 */
export function getCoverUrl(coverImg: string | undefined | null): string | undefined {
  if (!coverImg) return undefined

  // 如果已经是完整URL,直接返回
  if (coverImg.startsWith('http')) return coverImg

  const base = getBase()
  const coverBase = import.meta.env.VITE_COVER_BASE

  if (coverBase && import.meta.env.PROD) {
    // 生产环境用专用封面基础路径
    return `${coverBase}/${coverImg.replace(/^covers\//, '')}`
  }

  // 开发环境：走 /files/covers 代理路径
  return `${base}/files/covers/${coverImg.replace(/^covers\//, '').replace(/^\/files\/covers\//, '')}`
}

/**
 * 获取电子书文件的完整 URL
 */
export function getEBookFileUrl(filePath: string | undefined | null): string | undefined {
  if (!filePath) return undefined
  if (filePath.startsWith('http')) return filePath
  const base = getBase()
  return `${base}/files/books/${filePath.replace(/^books\//, '')}`
}

/**
 * 获取默认封面（SVG占位图）
 */
export function getDefaultCover(): string {
  return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="280"%3E%3Crect width="200" height="280" fill="%23f0f0f0"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%23999"%3E暂无封面%3C/text%3E%3C/svg%3E'
}
