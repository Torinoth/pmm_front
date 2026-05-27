import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authApi } from '@/api/index.js'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = ref(false)
  const isStaff = ref(false)

  async function fetchMe() {
    try {
      const res = await authApi.me()
      if (res.data.isAuthenticated) {
        user.value = { username: res.data.username }
        isAuthenticated.value = true
        isStaff.value = res.data.isStaff ?? false
      } else {
        user.value = null
        isAuthenticated.value = false
        isStaff.value = false
      }
    } catch {
      user.value = null
      isAuthenticated.value = false
      isStaff.value = false
    }
  }

  function reset() {
    user.value = null
    isAuthenticated.value = false
    isStaff.value = false
  }

  return { user, isAuthenticated, isStaff, fetchMe, reset }
})
