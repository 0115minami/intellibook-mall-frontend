import { defineStore } from 'pinia'
import { getCartCount } from '@/api/cart-order'

export const useCartStore = defineStore('cart', {
  state: () => ({
    count: 0,
  }),
  actions: {
    async fetchCount() {
      try {
        const res = await getCartCount()
        this.count = res.count
      } catch {
        // 静默失败
      }
    },
    increment() {
      this.count++
    },
    decrement() {
      if (this.count > 0) this.count--
    },
    reset() {
      this.count = 0
    },
  },
})
