<template>
  <div class="main-layout">
    <AppHeader />
    <PageNav />
    <a-layout-content class="layout-content">
      <slot />
    </a-layout-content>
  </div>
</template>

<script setup lang="ts">
import AppHeader from './AppHeader.vue'
import PageNav from './PageNav.vue'
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
  background: #f0f2f5;
}

.layout-content {
  min-height: calc(100vh - 64px);
}
</style>
