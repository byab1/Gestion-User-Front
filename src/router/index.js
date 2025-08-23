import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import DashboardView from './../views/DashboardView.vue'
import { useAuthStore } from './../store/auth'

const routes = [
  { path: '/login', component: LoginView, meta: { guest: true } },
  { path: '/', component: DashboardView, meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()
  // if token exists in localStorage but store not hydrated, hydrate
  if (!auth.user && localStorage.getItem('token')) {
    auth.token = localStorage.getItem('token')
    try {
      await auth.fetchMe()
    } catch (err) {
      auth.logout()
      return next('/login')
    }
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return next('/login')
  }
  if (to.meta.guest && auth.isAuthenticated) {
    return next('/')
  }
  return next()
})

export default router
