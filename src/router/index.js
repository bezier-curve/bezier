import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index.vue'
import bezier from '@/components/bezier/aaaa'
Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'bezier',
    component: bezier
  },
  {
    path: '/input',
    name: 'input',
    component: Index
  },
  {
    path: '/*',
    name: '404',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import( /* webpackChunkName: "about" */ '../views/404.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
