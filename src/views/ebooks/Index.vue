<template>
  <div class="page">
    <a-result
      status="info"
      title="电子书列表"
      sub-title="此页面待实现"
    >
      <template #extra>
        <a-button type="primary" @click="$router.push('/')">
          返回首页
        </a-button>
      </template>
    </a-result>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
