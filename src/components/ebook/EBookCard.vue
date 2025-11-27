<template>
  <div class="ebook-card" @click="handleClick">
    <div class="book-cover">
      <img
        :src="getCoverUrl(book.coverImg)"
        :alt="book.bookTitle"
        @error="handleImageError"
      />
      <!-- 鼠标悬停显示书名 -->
      <div class="book-title-overlay">
        <div class="book-title">{{ book.bookTitle }}</div>
        <div class="book-author">{{ book.author }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { EBook } from '@/types/ebook'

interface Props {
  book: EBook
}

const props = defineProps<Props>()
const router = useRouter()

// 获取封面图片URL
const getCoverUrl = (coverImg: string) => {
  const baseUrl = import.meta.env.VITE_COVER_BASE || 'http://localhost:8080/files/covers'
  // 如果已经是完整URL,直接返回
  if (coverImg.startsWith('http')) {
    return coverImg
  }
  // 否则拼接基础URL
  return `${baseUrl}/${coverImg.replace(/^covers\//, '')}`
}

// 图片加载失败处理
const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="280"%3E%3Crect width="200" height="280" fill="%23f0f0f0"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%23999"%3E暂无封面%3C/text%3E%3C/svg%3E'
}

// 点击跳转详情页
const handleClick = () => {
  router.push(`/ebooks/${props.book.bookId}`)
}
</script>

<style scoped>
.ebook-card {
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 8px;
  overflow: hidden;
}

.ebook-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.book-cover {
  position: relative;
  width: 100%;
  padding-top: 140%; /* 宽高比 5:7 */
  background: #f5f5f5;
  overflow: hidden;
}

.book-cover img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.book-title-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  padding: 32px 12px 12px;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: #fff;
}

.ebook-card:hover .book-title-overlay {
  opacity: 1;
}

.book-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.4;
}

.book-author {
  font-size: 12px;
  opacity: 0.9;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
