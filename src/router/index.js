import Vue from 'vue'
import VueRouter from 'vue-router'
import Teaser from '../views/Teaser.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Teaser',
    component: Teaser
  },
  {
    path: '/info',
    name: 'Info',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "info" */ '../views/Info.vue')
  },
  {
    path: '/:family',
    name: 'detail',
    component: () => import(/* webpackChunkName: "detail" */ '../views/Detail.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
