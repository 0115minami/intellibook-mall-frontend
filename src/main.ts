import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const app = createApp(App)

// Pinia 状态管理
const pinia = createPinia()

app.use(pinia)
app.use(router)

app.mount('#app')
