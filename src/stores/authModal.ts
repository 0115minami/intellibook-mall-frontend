import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthModalStore = defineStore('authModal', () => {
    const isLoginOpen = ref(false)
    const isRegisterOpen = ref(false)

    const openLogin = () => {
        isLoginOpen.value = true
        isRegisterOpen.value = false
    }

    const openRegister = () => {
        isRegisterOpen.value = true
        isLoginOpen.value = false
    }

    const closeLogin = () => {
        isLoginOpen.value = false
    }

    const closeRegister = () => {
        isRegisterOpen.value = false
    }

    const closeAll = () => {
        isLoginOpen.value = false
        isRegisterOpen.value = false
    }

    const switchToRegister = () => {
        isLoginOpen.value = false
        isRegisterOpen.value = true
    }

    const switchToLogin = () => {
        isRegisterOpen.value = false
        isLoginOpen.value = true
    }

    return {
        isLoginOpen,
        isRegisterOpen,
        openLogin,
        openRegister,
        closeLogin,
        closeRegister,
        closeAll,
        switchToRegister,
        switchToLogin,
    }
})
