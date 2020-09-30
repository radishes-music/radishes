import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { TestFull } from '@/pages/test/view/index'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/test',
    component: TestFull,
    meta: {
      full: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
