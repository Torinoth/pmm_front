import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import StockListView from '@/views/StockListView.vue'
import StockDetailsView from '@/views/StockDetailsView.vue'
import LoginView from '@/views/LoginView.vue'
import MasterView from '@/views/MasterView.vue'
import RegisterView from '@/views/RegisterView.vue'
import AdminUsersView from '@/views/AdminUsersView.vue'
import {useAuthStore} from '@/stores/auth.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
    },
    {
      path: '/stock-list',
      name: 'stock_list',
      component: StockListView,
    },
    {
      path: '/stock-details/:id',
      name: 'stock_details',
      component: StockDetailsView,
      props: true,
    },
    {
      path: '/master',
      name: 'master',
      component: MasterView,
      meta: {requiresAuth: true},
    },
    {
      path: '/admin/users',
      name: 'admin_users',
      component: AdminUsersView,
      meta: {requiresAuth: true, requiresStaff: true},
    },
  ],
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  await auth.fetchMe()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return {name: 'login'}
  }
  if (to.meta.requiresStaff && !auth.isStaff) {
    return {name: 'home'}
  }
  return true
})

export default router
