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
  // 管理员路由
  {
    path: '/admin',
    component: () => import('@/views/admin/Layout.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: '',
        redirect: '/admin/dashboard',
      },
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/Dashboard.vue'),
      },
      {
        path: 'books',
        name: 'AdminBooks',
        component: () => import('@/views/admin/Books.vue'),
      },
      {
        path: 'orders',
        name: 'AdminOrders',
        component: () => import('@/views/admin/Orders.vue'),
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: () => import('@/views/admin/Users.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 路由守卫
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()

  // 需要登录
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }

  // 需要管理员权限
  if (to.meta.requiresAdmin) {
    if (!authStore.isAuthenticated) {
      next({ name: 'Login', query: { redirect: to.fullPath } })
      return
    }
    if (!authStore.isAdmin) {
      next({ name: 'Home' })
      return
    }
  }

  // 已登录用户访问登录/注册页
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next({ name: 'Home' })
    return
  }

  next()
})

export default router
