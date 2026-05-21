<template>
  <div class="dashboard">
    <div class="page-header">
      <h2>仪表盘</h2>
      <p class="subtitle">系统运营数据概览</p>
    </div>

    <a-spin :spinning="loading">
      <!-- 统计卡片 -->
      <a-row :gutter="[16, 16]" style="margin-bottom: 24px">
        <a-col :xs="24" :sm="12" :lg="6">
          <div class="stat-card">
            <div class="stat-label">今日订单总数</div>
            <div class="stat-value">
              <FileTextOutlined class="stat-icon blue" />
              {{ data?.todayOrderCount ?? 0 }}
            </div>
          </div>
        </a-col>
        <a-col :xs="24" :sm="12" :lg="6">
          <div class="stat-card">
            <div class="stat-label">已支付订单</div>
            <div class="stat-value">
              <CheckCircleOutlined class="stat-icon green" />
              {{ data?.todayPaidCount ?? 0 }}
            </div>
          </div>
        </a-col>
        <a-col :xs="24" :sm="12" :lg="6">
          <div class="stat-card">
            <div class="stat-label">已取消订单</div>
            <div class="stat-value">
              <CloseCircleOutlined class="stat-icon red" />
              {{ data?.todayCancelCount ?? 0 }}
            </div>
          </div>
        </a-col>
        <a-col :xs="24" :sm="12" :lg="6">
          <div class="stat-card">
            <div class="stat-label">今日销售额</div>
            <div class="stat-value sales">
              <DollarCircleOutlined class="stat-icon gold" />
              ¥{{ ((data?.todaySales ?? 0) / 100).toFixed(0) }}元
            </div>
          </div>
        </a-col>
      </a-row>

      <!-- 折线图 -->
      <a-row :gutter="[16, 16]" style="margin-bottom: 24px">
        <a-col :xs="24" :lg="12">
          <div class="chart-card">
            <div class="chart-title">最近7天订单数量趋势</div>
            <div ref="orderChartRef" class="chart-container" />
          </div>
        </a-col>
        <a-col :xs="24" :lg="12">
          <div class="chart-card">
            <div class="chart-title">最近7天销售额趋势</div>
            <div ref="salesChartRef" class="chart-container" />
          </div>
        </a-col>
      </a-row>

      <!-- 每日数据表格 -->
      <div class="table-card">
        <div class="chart-title">最近7天每日数据</div>
        <a-table
          :columns="tableColumns"
          :data-source="filledStats"
          :pagination="false"
          :row-key="(r: any) => r.date"
          size="small"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'orderCount'">
              <a-tag color="blue">{{ record.orderCount }}</a-tag>
            </template>
            <template v-else-if="column.key === 'sales'">
              <span class="sales-text">¥{{ (record.sales / 100).toFixed(0) }}</span>
            </template>
          </template>
        </a-table>
      </div>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { message } from 'ant-design-vue'
import * as echarts from 'echarts'
import {
  FileTextOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DollarCircleOutlined,
} from '@ant-design/icons-vue'
import { getDashboard } from '@/api/admin-manage'
import type { DashboardData, DailyStatItem } from '@/api/admin-manage'
import dayjs from 'dayjs'

const loading = ref(false)
const data = ref<DashboardData | null>(null)

const orderChartRef = ref<HTMLDivElement | null>(null)
const salesChartRef = ref<HTMLDivElement | null>(null)
let orderChart: echarts.ECharts | null = null
let salesChart: echarts.ECharts | null = null

// 补全近7天缺失日期
const filledStats = computed<DailyStatItem[]>(() => {
  const map: Record<string, DailyStatItem> = {}
  for (let i = 6; i >= 0; i--) {
    const d = dayjs().subtract(i, 'day').format('YYYY-MM-DD')
    map[d] = { date: d, orderCount: 0, sales: 0 }
  }
  ;(data.value?.dailyStats ?? []).forEach((item) => {
    if (map[item.date]) map[item.date] = item
  })
  return Object.values(map)
})

const tableColumns = [
  { title: '日期', dataIndex: 'date', key: 'date' },
  { title: '订单数', key: 'orderCount' },
  { title: '销售额', key: 'sales' },
]

const initCharts = () => {
  if (!orderChartRef.value || !salesChartRef.value) return

  const dates = filledStats.value.map((d) => d.date.slice(5)) // MM-DD
  const orders = filledStats.value.map((d) => d.orderCount)
  const sales = filledStats.value.map((d) => +(d.sales / 100).toFixed(2))

  // 订单折线图
  orderChart = echarts.init(orderChartRef.value)
  orderChart.setOption({
    tooltip: { trigger: 'axis' },
    grid: { left: 40, right: 20, top: 20, bottom: 30 },
    xAxis: { type: 'category', data: dates, axisLabel: { fontSize: 11 } },
    yAxis: { type: 'value', minInterval: 1 },
    series: [{
      data: orders,
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: { color: '#1677ff', width: 2 },
      itemStyle: { color: '#1677ff' },
      areaStyle: { color: 'rgba(22,119,255,0.08)' },
    }],
  })

  // 销售额折线图
  salesChart = echarts.init(salesChartRef.value)
  salesChart.setOption({
    tooltip: { trigger: 'axis', formatter: (p: any) => `${p[0].name}<br/>¥${p[0].value}` },
    grid: { left: 60, right: 20, top: 20, bottom: 30 },
    xAxis: { type: 'category', data: dates, axisLabel: { fontSize: 11 } },
    yAxis: { type: 'value', axisLabel: { formatter: (v: number) => `¥${v}` } },
    series: [{
      data: sales,
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: { color: '#52c41a', width: 2 },
      itemStyle: { color: '#52c41a' },
      areaStyle: { color: 'rgba(82,196,26,0.08)' },
    }],
  })
}

const handleResize = () => {
  orderChart?.resize()
  salesChart?.resize()
}

const loadData = async () => {
  loading.value = true
  try {
    data.value = await getDashboard()
    await nextTick()
    initCharts()
  } catch {
    message.error('加载仪表盘数据失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  orderChart?.dispose()
  salesChart?.dispose()
})
</script>

<style scoped>
.dashboard { padding: 0; }

.page-header { margin-bottom: 24px; }
.page-header h2 { font-size: 22px; font-weight: 600; margin: 0 0 4px; }
.subtitle { color: #8c8c8c; margin: 0; font-size: 14px; }

/* 统计卡片 */
.stat-card {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 20px 24px;
}

.stat-label {
  font-size: 13px;
  color: #8c8c8c;
  margin-bottom: 12px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #262626;
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-value.sales { font-size: 22px; }

.stat-icon { font-size: 24px; }
.stat-icon.blue { color: #1677ff; }
.stat-icon.green { color: #52c41a; }
.stat-icon.red { color: #ff4d4f; }
.stat-icon.gold { color: #faad14; }

/* 图表卡片 */
.chart-card {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 20px;
}

.chart-title {
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 16px;
  color: #262626;
}

.chart-container {
  height: 220px;
}

/* 表格卡片 */
.table-card {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 20px;
}

.sales-text {
  color: #52c41a;
  font-weight: 500;
}
</style>
