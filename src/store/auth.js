import { defineStore } from 'pinia'
import api from '@/services/http'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: null
  }),
  getters: {
    isAuthenticated: (s) => !!s.token,
    role: (s) => s.user?.roles?.length ? s.user.roles[0] : null,
    isAdmin: (s) => s.user?.roles?.includes('ROLE_ADMIN') ?? false
  },
  actions: {
    async login(email, password) {
      const { data } = await api.post('/api/login', { email, password })
      this.token = data.token
      localStorage.setItem('token', data.token)
      await this.fetchMe()
    },
    async fetchMe() {
      const { data } = await api.get('/api/me')
      // data should contain id,name,email,roles,active,createdAt,photo
      this.user = data
    },
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
  }
})
