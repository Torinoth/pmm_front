import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from "@/views/AboutView.vue"
import StockListView from "@/views/StockListView.vue";
import StockDetailsView from "@/views/StockDetailsView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/about',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: AboutView
        },
        {
            path: '/stock-list',
            name: 'stock_list',
            component: StockListView
        },
        {
            path: '/stock-details/:id',
            name: 'stock_details',
            component: StockDetailsView,
            props: true,
        },
    ]
})

export default router
