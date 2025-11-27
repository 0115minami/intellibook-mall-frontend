<template>
  <div class="search-bar">
    <!-- 标签页 -->
    <a-tabs v-model:activeKey="activeTab" class="search-tabs">
      <a-tab-pane key="general" tab="通用搜索" />
      <a-tab-pane key="advanced" tab="高级筛选" />
    </a-tabs>

    <!-- 通用搜索 -->
    <div v-if="activeTab === 'general'" class="search-content">
      <a-input
        v-model:value="searchKeyword"
        size="large"
        placeholder="按书名、作者、ISBN、DOI、出版社、MD5等搜索..."
        @pressEnter="handleSearch"
      >
        <template #suffix>
          <a-button type="primary" @click="handleSearch">
            搜索
          </a-button>
        </template>
      </a-input>
    </div>

    <!-- 高级筛选 -->
    <div v-else class="search-content advanced">
      <a-row :gutter="16">
        <a-col :span="8">
          <a-input
            v-model:value="advancedParams.keyword"
            placeholder="关键词"
            size="large"
          />
        </a-col>
        <a-col :span="6">
          <a-select
            v-model:value="advancedParams.fileFormat"
            placeholder="文件格式"
            size="large"
            style="width: 100%"
            allowClear
          >
            <a-select-option value="">全部格式</a-select-option>
            <a-select-option value="PDF">PDF</a-select-option>
            <a-select-option value="EPUB">EPUB</a-select-option>
            <a-select-option value="MOBI">MOBI</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="6">
          <a-select
            v-model:value="advancedParams.categoryId"
            placeholder="分类"
            size="large"
            style="width: 100%"
            allowClear
          >
            <a-select-option value="">全部分类</a-select-option>
            <a-select-option
              v-for="category in categories"
              :key="category.categoryId"
              :value="category.categoryId"
            >
              {{ category.categoryName }}
            </a-select-option>
          </a-select>
        </a-col>
        <a-col :span="4">
          <a-button type="primary" size="large" block @click="handleAdvancedSearch">
            搜索
          </a-button>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { EBookCategory, EBookSearchParam } from '@/types/ebook'
import { getCategories } from '@/api/ebook'

const emit = defineEmits<{
  search: [params: Partial<EBookSearchParam>]
}>()

const activeTab = ref('general')
const searchKeyword = ref('')
const categories = ref<EBookCategory[]>([])

const advancedParams = ref({
  keyword: '',
  fileFormat: '',
  categoryId: undefined as number | undefined,
})

// 加载分类列表
const loadCategories = async () => {
  try {
    categories.value = await getCategories()
  } catch (error) {
    console.error('加载分类失败:', error)
  }
}

// 通用搜索
const handleSearch = () => {
  emit('search', {
    keyword: searchKeyword.value,
    pageNum: 1,
    pageSize: 20,
  })
}

// 高级搜索
const handleAdvancedSearch = () => {
  emit('search', {
    keyword: advancedParams.value.keyword || undefined,
    fileFormat: advancedParams.value.fileFormat || undefined,
    categoryId: advancedParams.value.categoryId || undefined,
    pageNum: 1,
    pageSize: 20,
  })
}

onMounted(() => {
  loadCategories()
})
</script>

<style scoped>
.search-bar {
  background: #fff;
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.search-tabs :deep(.ant-tabs-nav) {
  margin-bottom: 16px;
}

.search-content {
  margin-top: 8px;
}

.search-content.advanced {
  padding: 8px 0;
}

.search-bar :deep(.ant-input-affix-wrapper) {
  border-radius: 4px;
}

.search-bar :deep(.ant-input-suffix) {
  margin-left: 8px;
}

.search-bar :deep(.ant-input-suffix .ant-btn) {
  border-radius: 0 4px 4px 0;
  margin-right: -11px;
}
</style>
