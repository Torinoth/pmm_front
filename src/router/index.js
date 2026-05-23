import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import StockListView from '@/views/StockListView.vue'
import StockDetailsView from '@/views/StockDetailsView.vue'
import LoginView from '@/views/LoginView.vue'
import {authApi} from '@/api/index.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {public: true},
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
  ],
})

router.beforeEach(async (to) => {
  if (to.meta.public) return true
  try {
    await authApi.me()
    return true
  } catch {
    return {name: 'login'}
  }
})

export default router
