import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import DashboardView from './../views/DashboardView.vue'
import { useAuthStore } from './../store/auth'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import UsersPage from '@/views/UsersPage.vue'
import NotFound from '@/views/errors/NotFound.vue'
import ServerError from '@/views/errors/ServerError.vue'
import Forbidden from '@/views/errors/Forbidden.vue'
import LogsPage from '@/views/LogsPage.vue'

// const routes = [
//   { path: '/login', component: LoginView, meta: { guest: true } },
//   { path: '/', component: DashboardView, meta: { requiresAuth: true } },
//   { path: '/:pathMatch(.*)*', redirect: '/' }
// ]

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { guest: true }
  },
  {
    path: '/',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: DashboardView,
        meta: { title: 'Tableau de bord' } // Permet d'avoir un titre dynamique
      },
      {
        path: 'users',
        name: 'Users',
        component: UsersPage,
        meta: { title: 'Gestion des utilisateurs' }
      },
      {
        path: 'logs',
        name: 'Logs',
        component: LogsPage,
        meta: { requiresAuth: true, adminOnly: true,  title: 'Logs des activités' }
      }
    ]
  },
  {
    path: '/403',
    name: 'Forbidden',
    component: Forbidden
  },
  {
    path: '/500',
    name: 'ServerError',
    component: ServerError
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
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
    return next('/dashboard')
  }
  return next()
})

export default router
