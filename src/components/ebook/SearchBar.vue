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
        placeholder="按书名、作者、出版社等搜索..."
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
      <a-row :gutter="[16, 16]">
        <!-- 第一行：关键词和文件格式 -->
        <a-col :span="12">
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
            <a-select-option value="AZW3">AZW3</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="6">
          <a-select
            v-model:value="advancedParams.language"
            placeholder="语言"
            size="large"
            style="width: 100%"
            allowClear
          >
            <a-select-option value="">全部语言</a-select-option>
            <a-select-option value="zh-CN">中文</a-select-option>
            <a-select-option value="en-US">英文</a-select-option>
          </a-select>
        </a-col>

        <!-- 第二行：一级分类、子分类和搜索按钮 -->
        <a-col :span="8">
          <a-select
            v-model:value="advancedParams.parentCategoryId"
            placeholder="一级分类"
            size="large"
            style="width: 100%"
            allowClear
            @change="handleParentCategoryChange"
          >
            <a-select-option value="">全部分类</a-select-option>
            <a-select-option
              v-for="category in topCategories"
              :key="category.categoryId"
              :value="category.categoryId"
            >
              {{ category.categoryName }}
            </a-select-option>
          </a-select>
        </a-col>
        <a-col :span="8">
          <a-select
            v-model:value="advancedParams.categoryId"
            placeholder="子分类"
            size="large"
            style="width: 100%"
            allowClear
            :disabled="!advancedParams.parentCategoryId"
          >
            <a-select-option value="">全部子分类</a-select-option>
            <a-select-option
              v-for="category in subCategories"
              :key="category.categoryId"
              :value="category.categoryId"
            >
              {{ category.categoryName }}
            </a-select-option>
          </a-select>
        </a-col>
        <a-col :span="8">
          <a-button type="primary" size="large" block @click="handleAdvancedSearch">
            搜索
          </a-button>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { EBookCategory, EBookSearchParam } from '@/types/ebook'
import { getTopCategories, getSubCategories } from '@/api/ebook'

const emit = defineEmits<{
  search: [params: Partial<EBookSearchParam>]
}>()

const activeTab = ref('general')
const searchKeyword = ref('')
const topCategories = ref<EBookCategory[]>([])
const allSubCategories = ref<EBookCategory[]>([])

const advancedParams = ref({
  keyword: '',
  fileFormat: '',
  language: '',
  parentCategoryId: undefined as number | undefined,
  categoryId: undefined as number | undefined,
})

// 根据选择的一级分类过滤子分类
const subCategories = computed(() => {
  if (!advancedParams.value.parentCategoryId) {
    return []
  }
  return allSubCategories.value.filter(
    cat => cat.parentId === advancedParams.value.parentCategoryId
  )
})

// 加载一级分类列表
const loadTopCategories = async () => {
  try {
    topCategories.value = await getTopCategories()
  } catch (error) {
    console.error('加载一级分类失败:', error)
  }
}

// 加载所有子分类
const loadAllSubCategories = async () => {
  try {
    // 为每个一级分类加载子分类
    const promises = topCategories.value.map(cat => 
      getSubCategories(cat.categoryId).catch(() => [])
    )
    const results = await Promise.all(promises)
    allSubCategories.value = results.flat()
  } catch (error) {
    console.error('加载子分类失败:', error)
  }
}

// 一级分类改变时的处理
const handleParentCategoryChange = () => {
  // 清空子分类选择
  advancedParams.value.categoryId = undefined
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
  // 确定最终使用的分类ID
  // 如果选择了子分类，使用子分类ID
  // 如果只选择了一级分类，使用一级分类ID（后端会自动包含子分类）
  const categoryId = advancedParams.value.categoryId || advancedParams.value.parentCategoryId

  emit('search', {
    keyword: advancedParams.value.keyword || undefined,
    fileFormat: advancedParams.value.fileFormat || undefined,
    language: advancedParams.value.language || undefined,
    categoryId: categoryId || undefined,
    pageNum: 1,
    pageSize: 20,
  })
}

onMounted(async () => {
  await loadTopCategories()
  await loadAllSubCategories()
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
