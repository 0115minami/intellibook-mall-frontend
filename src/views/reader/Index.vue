<template>
  <div class="reader-page">
    <!-- ── 顶部工具栏 ── -->
    <div class="reader-toolbar">
      <!-- 左：关闭 -->
      <div class="toolbar-left">
        <a-button type="text" class="tb-btn" @click="handleClose">
          <CloseOutlined />
          关闭
        </a-button>
      </div>

      <!-- 中：翻页 + 页码 -->
      <div class="toolbar-center">
        <a-button type="text" class="tb-btn" :disabled="currentPage <= 1" @click="prevPage">
          <LeftOutlined /> 上一页
        </a-button>

        <span class="page-info">
          第
          <input
            v-model.number="inputPage"
            class="page-input"
            type="number"
            :min="1"
            :max="totalPages"
            @keydown.enter="jumpToPage"
            @blur="jumpToPage"
          />
          页 / 共 {{ totalPages }} 页
        </span>

        <a-button type="text" class="tb-btn" :disabled="currentPage >= totalPages" @click="nextPage">
          下一页 <RightOutlined />
        </a-button>
      </div>

      <!-- 右：缩放 + 书名 -->
      <div class="toolbar-right">
        <a-button type="text" class="tb-btn icon-btn" :disabled="scale <= 0.5" @click="zoomOut">
          <MinusOutlined />
        </a-button>
        <span class="zoom-label">{{ Math.round(scale * 100) }}%</span>
        <a-button type="text" class="tb-btn icon-btn" :disabled="scale >= 3" @click="zoomIn">
          <PlusOutlined />
        </a-button>

        <span class="divider" />
        <span class="book-title-label" :title="bookTitle">{{ bookTitle }}</span>
      </div>
    </div>

    <!-- ── 内容区 ── -->
    <div class="reader-body">
      <!-- 权限检查中 -->
      <div v-if="initLoading" class="center-wrap">
        <a-spin size="large" tip="正在验证权限..." />
      </div>

      <!-- 无权限 -->
      <div v-else-if="!canRead" class="center-wrap">
        <a-result
          status="403"
          title="无法阅读"
          sub-title="您尚未购买此书，请先购买后再阅读"
        >
          <template #extra>
            <a-button type="primary" @click="router.push(`/ebooks/${bookId}`)">去购买</a-button>
            <a-button @click="router.back()">返回</a-button>
          </template>
        </a-result>
      </div>

      <!-- PDF 渲染区 -->
      <div v-else class="pdf-scroll-area" ref="scrollAreaRef">
        <!-- PDF 加载进度 -->
        <div v-if="pdfLoading" class="center-wrap">
          <a-spin size="large" tip="正在加载 PDF..." />
          <div v-if="loadProgress > 0" class="progress-bar-wrap">
            <a-progress :percent="loadProgress" size="small" style="width: 240px; margin-top: 16px" />
          </div>
        </div>

        <!-- 渲染错误 -->
        <div v-else-if="pdfError" class="center-wrap">
          <a-result status="error" title="PDF 加载失败" :sub-title="pdfError">
            <template #extra>
              <a-button type="primary" @click="loadPdf">重试</a-button>
              <a-button @click="router.back()">返回</a-button>
            </template>
          </a-result>
        </div>

        <!-- Canvas 容器 -->
        <div v-show="!pdfLoading && !pdfError" class="canvas-wrap">
          <canvas ref="canvasRef" class="pdf-canvas" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as pdfjsLib from 'pdfjs-dist'
import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist'
import {
  CloseOutlined,
  LeftOutlined,
  RightOutlined,
  PlusOutlined,
  MinusOutlined,
} from '@ant-design/icons-vue'
import { checkReadPermission, updateReadProgress } from '@/api/user-center'
import request from '@/utils/request'

// ── pdf.js worker ──────────────────────────────────────────
// 使用 CDN worker，避免打包体积过大
pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.9.155/pdf.worker.min.mjs'

// ── 路由 ───────────────────────────────────────────────────
const route = useRoute()
const router = useRouter()

const bookId = ref(Number(route.params.bookId))
const bookTitle = ref((route.query.title as string) || '')

// ── 权限状态 ───────────────────────────────────────────────
const initLoading = ref(true)
const canRead = ref(false)

// ── PDF 状态 ───────────────────────────────────────────────
const pdfLoading = ref(false)
const pdfError = ref('')
const loadProgress = ref(0)

// ── 页面控制 ───────────────────────────────────────────────
const currentPage = ref(1)
const inputPage = ref(1)   // 输入框绑定，避免直接改 currentPage 触发渲染
const totalPages = ref(0)
const scale = ref(1.2)

// ── DOM refs ───────────────────────────────────────────────
const canvasRef = ref<HTMLCanvasElement | null>(null)
const scrollAreaRef = ref<HTMLDivElement | null>(null)

// ── pdf.js 对象 ────────────────────────────────────────────
let pdfDoc: PDFDocumentProxy | null = null
let renderTask: ReturnType<PDFPageProxy['render']> | null = null
let blobUrl = ''

// ── 进度保存定时器 ─────────────────────────────────────────
let progressTimer: ReturnType<typeof setTimeout> | null = null

// ── 1. 权限检查 ────────────────────────────────────────────
const init = async () => {
  initLoading.value = true
  try {
    const perm = await checkReadPermission(bookId.value)
    canRead.value = perm.canRead

    if (perm.canRead) {
      // 恢复上次进度
      if (perm.lastPosition) {
        try {
          const pos = JSON.parse(perm.lastPosition)
          if (pos.page && pos.page > 0) {
            currentPage.value = pos.page
            inputPage.value = pos.page
          }
        } catch { /* ignore */ }
      }
      await nextTick()
      loadPdf()
    }
  } catch {
    canRead.value = false
  } finally {
    initLoading.value = false
  }
}

// ── 2. 获取 PDF Blob（携带 token） ─────────────────────────
const loadPdf = async () => {
  pdfLoading.value = true
  pdfError.value = ''
  loadProgress.value = 0

  // 释放旧 Blob URL
  if (blobUrl) {
    URL.revokeObjectURL(blobUrl)
    blobUrl = ''
  }
  if (pdfDoc) {
    pdfDoc.destroy()
    pdfDoc = null
  }

  try {
    const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:8080'
    const url = `${apiBase}/api/bookshelf/read/${bookId.value}?format=pdf`

    // 用 axios 携带 token 请求，获取 ArrayBuffer
    const response = await request.get(url, {
      responseType: 'arraybuffer',
      onDownloadProgress: (evt) => {
        if (evt.total && evt.total > 0) {
          loadProgress.value = Math.round((evt.loaded / evt.total) * 100)
        }
      },
    })

    // 转成 Uint8Array 传给 pdf.js
    const data = new Uint8Array(response as unknown as ArrayBuffer)

    const loadingTask = pdfjsLib.getDocument({ data })
    pdfDoc = await loadingTask.promise
    totalPages.value = pdfDoc.numPages

    // 确保当前页在合法范围
    if (currentPage.value > totalPages.value) {
      currentPage.value = 1
      inputPage.value = 1
    }

    pdfLoading.value = false
    await nextTick()
    renderPage(currentPage.value)
  } catch (err: any) {
    pdfLoading.value = false
    pdfError.value = err?.message || '加载失败，请检查网络或重试'
    console.error('PDF load error:', err)
  }
}

// ── 3. 渲染指定页 ──────────────────────────────────────────
const renderPage = async (pageNum: number) => {
  if (!pdfDoc || !canvasRef.value) return

  // 取消上一次未完成的渲染
  if (renderTask) {
    renderTask.cancel()
    renderTask = null
  }

  try {
    const page: PDFPageProxy = await pdfDoc.getPage(pageNum)
    const viewport = page.getViewport({ scale: scale.value })

    const canvas = canvasRef.value
    const ctx = canvas.getContext('2d')!
    canvas.width = viewport.width
    canvas.height = viewport.height

    renderTask = page.render({ canvasContext: ctx, viewport })
    await renderTask.promise
    renderTask = null

    // 滚动到顶部
    if (scrollAreaRef.value) scrollAreaRef.value.scrollTop = 0

    // 延迟保存进度（防抖）
    scheduleProgressSave(pageNum)
  } catch (err: any) {
    if (err?.name !== 'RenderingCancelledException') {
      console.error('Render error:', err)
    }
  }
}

// ── 4. 翻页 ────────────────────────────────────────────────
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    inputPage.value = currentPage.value
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    inputPage.value = currentPage.value
  }
}

const jumpToPage = () => {
  const p = Math.max(1, Math.min(totalPages.value, inputPage.value || 1))
  inputPage.value = p
  if (p !== currentPage.value) {
    currentPage.value = p
  } else {
    // 页码未变但手动触发，直接渲染
    renderPage(p)
  }
}

// 监听 currentPage 变化触发渲染
watch(currentPage, (p) => {
  inputPage.value = p
  renderPage(p)
})

// ── 5. 缩放 ────────────────────────────────────────────────
const zoomIn = () => {
  if (scale.value < 3) {
    scale.value = Math.round((scale.value + 0.2) * 10) / 10
    renderPage(currentPage.value)
  }
}

const zoomOut = () => {
  if (scale.value > 0.5) {
    scale.value = Math.round((scale.value - 0.2) * 10) / 10
    renderPage(currentPage.value)
  }
}

// ── 6. 保存阅读进度 ────────────────────────────────────────
const scheduleProgressSave = (page: number) => {
  if (progressTimer) clearTimeout(progressTimer)
  progressTimer = setTimeout(async () => {
    try {
      await updateReadProgress({
        bookId: bookId.value,
        fileFormat: 'pdf',
        lastPosition: JSON.stringify({ page, progress: Math.round((page / totalPages.value) * 100) }),
      })
    } catch { /* 静默失败 */ }
  }, 2000)
}

// ── 7. 关闭 ────────────────────────────────────────────────
const handleClose = () => {
  router.back()
}

// ── 8. 键盘快捷键 ──────────────────────────────────────────
const handleKeydown = (e: KeyboardEvent) => {
  // 输入框聚焦时不响应翻页
  if (document.activeElement?.tagName === 'INPUT') return
  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prevPage()
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nextPage()
  if (e.key === 'Escape') handleClose()
  if (e.key === '+' || e.key === '=') zoomIn()
  if (e.key === '-') zoomOut()
}

// ── 生命周期 ───────────────────────────────────────────────
onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  init()
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  if (progressTimer) clearTimeout(progressTimer)
  if (renderTask) renderTask.cancel()
  if (pdfDoc) pdfDoc.destroy()
  if (blobUrl) URL.revokeObjectURL(blobUrl)
})
</script>

<style scoped>
/* ── 整体布局 ── */
.reader-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #525659;
  overflow: hidden;
}

/* ── 工具栏 ── */
.reader-toolbar {
  display: flex;
  align-items: center;
  height: 48px;
  background: #323639;
  padding: 0 12px;
  flex-shrink: 0;
  gap: 8px;
  user-select: none;
}

.toolbar-left {
  display: flex;
  align-items: center;
  min-width: 100px;
}

.toolbar-center {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 200px;
  justify-content: flex-end;
}

/* 工具栏按钮统一样式 */
.tb-btn {
  color: #ccc !important;
  font-size: 13px;
}
.tb-btn:hover:not(:disabled) {
  color: #fff !important;
  background: rgba(255, 255, 255, 0.1) !important;
}
:deep(.tb-btn.ant-btn-text:disabled) {
  color: #555 !important;
}

.icon-btn {
  padding: 0 8px !important;
}

/* 页码输入框 */
.page-info {
  font-size: 13px;
  color: #ccc;
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}

.page-input {
  width: 52px;
  height: 26px;
  background: #444;
  border: 1px solid #555;
  border-radius: 4px;
  color: #fff;
  text-align: center;
  font-size: 13px;
  outline: none;
  padding: 0 4px;
  /* 隐藏数字输入框的上下箭头 */
  -moz-appearance: textfield;
}
.page-input::-webkit-outer-spin-button,
.page-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
.page-input:focus {
  border-color: #1677ff;
}

.zoom-label {
  font-size: 13px;
  color: #ccc;
  min-width: 44px;
  text-align: center;
}

.divider {
  width: 1px;
  height: 20px;
  background: #555;
  margin: 0 4px;
}

.book-title-label {
  font-size: 13px;
  color: #aaa;
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ── 内容区 ── */
.reader-body {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.center-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: #f0f2f5;
}

.progress-bar-wrap {
  display: flex;
  justify-content: center;
}

/* PDF 滚动区域 */
.pdf-scroll-area {
  height: 100%;
  overflow-y: auto;
  overflow-x: auto;
  background: #525659;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0;
}

/* Canvas */
.canvas-wrap {
  display: flex;
  justify-content: center;
}

.pdf-canvas {
  display: block;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  background: #fff;
}
</style>
