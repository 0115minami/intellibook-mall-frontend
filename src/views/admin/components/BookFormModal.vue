<template>
  <a-modal
    :open="visible"
    :title="mode === 'create' ? '添加图书' : '编辑图书'"
    :width="800"
    :confirm-loading="loading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 20 }"
    >
      <a-form-item label="书名" name="bookTitle">
        <a-input v-model:value="formData.bookTitle" placeholder="请输入书名" />
      </a-form-item>

      <a-form-item label="作者" name="author">
        <a-input v-model:value="formData.author" placeholder="请输入作者" />
      </a-form-item>

      <a-form-item label="ISBN" name="isbn">
        <a-input v-model:value="formData.isbn" placeholder="请输入ISBN" />
      </a-form-item>

      <a-form-item label="出版社" name="publisher">
        <a-input v-model:value="formData.publisher" placeholder="请输入出版社" />
      </a-form-item>

      <a-form-item label="出版日期" name="publishDate">
        <a-date-picker
          v-model:value="formData.publishDate"
          style="width: 100%"
          placeholder="请选择出版日期"
        />
      </a-form-item>

      <a-form-item label="分类" name="categoryId">
        <a-select v-model:value="formData.categoryId" placeholder="请选择分类">
          <a-select-option :value="1">编程技术</a-select-option>
          <a-select-option :value="2">人工智能</a-select-option>
          <a-select-option :value="3">数据科学</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="价格" name="price">
        <a-input-number
          v-model:value="formData.price"
          :min="0"
          :step="0.01"
          :precision="2"
          style="width: 100%"
          placeholder="请输入价格（元）"
        />
      </a-form-item>

      <a-form-item label="语言" name="language">
        <a-select v-model:value="formData.language" placeholder="请选择语言">
          <a-select-option value="zh-CN">中文</a-select-option>
          <a-select-option value="en-US">英文</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="页数" name="pageCount">
        <a-input-number
          v-model:value="formData.pageCount"
          :min="1"
          style="width: 100%"
          placeholder="请输入页数"
        />
      </a-form-item>

      <a-form-item label="标签" name="tags">
        <a-input
          v-model:value="formData.tags"
          placeholder="多个标签用逗号分隔"
        />
      </a-form-item>

      <a-form-item label="简介" name="bookIntro">
        <a-textarea
          v-model:value="formData.bookIntro"
          :rows="4"
          placeholder="请输入图书简介"
        />
      </a-form-item>

      <a-form-item label="封面图片">
        <a-upload
          v-model:file-list="coverFileList"
          :before-upload="beforeCoverUpload"
          :max-count="1"
          list-type="picture-card"
          accept="image/jpeg,image/png"
        >
          <div v-if="coverFileList.length < 1">
            <PlusOutlined />
            <div style="margin-top: 8px">上传封面</div>
          </div>
        </a-upload>
        <div class="upload-tip">支持JPG、PNG格式，最大5MB</div>
      </a-form-item>

      <a-form-item label="电子书文件">
        <div v-for="(item, index) in ebookFileList" :key="index" class="ebook-file-item">
          <a-form-item-rest>
            <a-select
              v-model:value="item.fileFormat"
              style="width: 100px; margin-right: 8px"
              placeholder="格式"
            >
              <a-select-option value="PDF">PDF</a-select-option>
              <a-select-option value="EPUB">EPUB</a-select-option>
              <a-select-option value="MOBI">MOBI</a-select-option>
            </a-select>
            <a-upload
              v-model:file-list="item.fileList"
              :before-upload="(file: any) => beforeEbookUpload(file, index)"
              :max-count="1"
              accept=".pdf,.epub,.mobi"
            >
              <a-button>
                <UploadOutlined />
                选择文件
              </a-button>
            </a-upload>
            <a-button
              v-if="ebookFileList.length > 1"
              type="text"
              danger
              @click="removeEbookFile(index)"
            >
              <DeleteOutlined />
            </a-button>
          </a-form-item-rest>
        </div>
        <a-button type="dashed" block @click="addEbookFile">
          <PlusOutlined />
          添加文件
        </a-button>
        <div class="upload-tip">支持PDF、EPUB、MOBI格式，最大100MB</div>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { message } from 'ant-design-vue'
import type { FormInstance, UploadProps } from 'ant-design-vue'
import dayjs from 'dayjs'
import {
  PlusOutlined,
  UploadOutlined,
  DeleteOutlined,
} from '@ant-design/icons-vue'
import type { AdminEBookVO } from '@/types/admin'
import { createAdminEBook, updateAdminEBook } from '@/api/admin'

interface Props {
  visible: boolean
  book: AdminEBookVO | null
  mode: 'create' | 'edit'
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'success'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const formRef = ref<FormInstance>()
const loading = ref(false)

// 表单数据
const formData = reactive<any>({
  bookTitle: '',
  author: '',
  isbn: '',
  publisher: '',
  publishDate: null,
  categoryId: undefined,
  price: undefined,
  language: 'zh-CN',
  pageCount: undefined,
  tags: '',
  bookIntro: '',
})

// 封面文件
const coverFileList = ref<any[]>([])
const coverFile = ref<File | null>(null)

// 电子书文件
interface EbookFileItem {
  fileFormat: string
  fileList: any[]
  file: File | null
}

const ebookFileList = ref<EbookFileItem[]>([
  { fileFormat: 'PDF', fileList: [], file: null },
])

// 表单验证规则
const rules = {
  bookTitle: [{ required: true, message: '请输入书名', trigger: 'blur' }],
  author: [{ required: true, message: '请输入作者', trigger: 'blur' }],
  categoryId: [{ required: true, message: '请选择分类', trigger: 'change' }],
  price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
}

// 监听book变化，填充表单
watch(
  () => props.book,
  (book) => {
    if (book && props.mode === 'edit') {
      formData.bookTitle = book.bookTitle
      formData.author = book.author
      formData.isbn = book.isbn || ''
      formData.publisher = book.publisher || ''
      formData.publishDate = book.publishDate ? dayjs(book.publishDate) : null
      formData.categoryId = book.categoryId
      formData.price = book.price / 100
      formData.language = book.language || 'zh-CN'
      formData.pageCount = book.pageCount
      formData.tags = book.tags || ''
      formData.bookIntro = book.bookIntro || ''

      // 显示现有封面
      if (book.coverUrl) {
        coverFileList.value = [
          {
            uid: '-1',
            name: 'cover.jpg',
            status: 'done',
            url: book.coverUrl,
          },
        ]
      } else {
        coverFileList.value = []
      }
    } else if (!book) {
      // 只在 book 为 null 时重置
      resetForm()
    }
  }
)

// 重置表单
const resetForm = () => {
  // 重置表单数据
  Object.assign(formData, {
    bookTitle: '',
    author: '',
    isbn: '',
    publisher: '',
    publishDate: null,
    categoryId: undefined,
    price: undefined,
    language: 'zh-CN',
    pageCount: undefined,
    tags: '',
    bookIntro: '',
  })
  
  // 清空文件列表
  coverFileList.value = []
  coverFile.value = null
  ebookFileList.value = [{ fileFormat: 'PDF', fileList: [], file: null }]
  
  // 清空表单验证状态
  if (formRef.value) {
    formRef.value.clearValidate()
  }
}

// 封面上传前处理
const beforeCoverUpload: UploadProps['beforeUpload'] = (file) => {
  const isImage = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isImage) {
    message.error('只能上传JPG/PNG格式的图片')
    return false
  }
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isLt5M) {
    message.error('图片大小不能超过5MB')
    return false
  }
  coverFile.value = file
  return false
}

// 电子书文件上传前处理
const beforeEbookUpload = (file: File, index: number) => {
  const isValidFormat =
    file.name.endsWith('.pdf') ||
    file.name.endsWith('.epub') ||
    file.name.endsWith('.mobi')
  if (!isValidFormat) {
    message.error('只能上传PDF/EPUB/MOBI格式的文件')
    return false
  }
  const isLt100M = file.size / 1024 / 1024 < 100
  if (!isLt100M) {
    message.error('文件大小不能超过100MB')
    return false
  }
  ebookFileList.value[index].file = file
  return false
}

// 添加电子书文件
const addEbookFile = () => {
  ebookFileList.value.push({
    fileFormat: 'PDF',
    fileList: [],
    file: null,
  })
}

// 移除电子书文件
const removeEbookFile = (index: number) => {
  ebookFileList.value.splice(index, 1)
}

// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value?.validate()

    loading.value = true

    // 准备提交数据
    const submitData: any = {
      bookTitle: formData.bookTitle,
      author: formData.author,
      isbn: formData.isbn,
      publisher: formData.publisher,
      categoryId: formData.categoryId,
      price: Math.round(formData.price * 100), // 转换为分
      language: formData.language,
      pageCount: formData.pageCount,
      tags: formData.tags,
      bookIntro: formData.bookIntro,
    }

    // publishDate 只在有值时才发送，格式为 yyyy/MM/dd（Spring @DateTimeFormat 默认格式）
    if (formData.publishDate) {
      submitData.publishDate = formData.publishDate.format('YYYY/MM/DD')
    }
    // 添加封面
    if (coverFile.value) {
      submitData.coverImage = coverFile.value
    }

    // 添加电子书文件
    const validEbookFiles = ebookFileList.value.filter((item) => item.file)
    if (validEbookFiles.length > 0) {
      if (props.mode === 'create') {
        submitData.ebookFiles = validEbookFiles.map((item) => ({
          fileFormat: item.fileFormat,
          file: item.file!,
        }))
      } else {
        submitData.newEbookFiles = validEbookFiles.map((item) => ({
          fileFormat: item.fileFormat,
          file: item.file!,
        }))
      }
    }

    // 调用API
    if (props.mode === 'create') {
      await createAdminEBook(submitData)
      message.success('添加成功')
    } else {
      await updateAdminEBook(props.book!.bookId, submitData)
      message.success('更新成功')
    }

    emit('success')
  } catch (error: any) {
    if (error.errorFields) {
      // 表单验证错误
      return
    }
    message.error(error.message || '操作失败')
  } finally {
    loading.value = false
  }
}

// 取消
const handleCancel = () => {
  emit('update:visible', false)
  resetForm()
}
</script>

<style scoped>
.upload-tip {
  margin-top: 8px;
  color: #999;
  font-size: 12px;
}

.ebook-file-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}
</style>
