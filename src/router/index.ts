import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: {
      breadcrumb: 'Main',
      showPageNav: false
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/Login.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/auth/Register.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/ebooks',
    component: () => import('@/views/ebooks/Layout.vue'),
    meta: { breadcrumb: '电子书' },
    children: [
      {
        path: '',
        name: 'EBooks',
        component: () => import('@/views/ebooks/Index.vue'),
        meta: { showPageNav: true }
      },
      {
        path: ':id',
        name: 'EBookDetail',
        component: () => import('@/views/ebooks/Detail.vue'),
        meta: {
          breadcrumb: '详情',
          showPageNav: true
        }
      }
    ]
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('@/views/cart/Index.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/orders',
    name: 'Orders',
    component: () => import('@/views/orders/Index.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/user',
    name: 'User',
    component: () => import('@/views/user/Index.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'profile',
        name: 'UserProfile',
        component: () => import('@/views/user/Profile.vue'),
      },
      {
        path: 'library',
        name: 'UserLibrary',
        component: () => import('@/views/user/Library.vue'),
      },
      {
        path: 'favorites',
        name: 'UserFavorites',
        component: () => import('@/views/user/Favorites.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next({ name: 'Home' })
  } else {
    next()
  }
})

export default router
