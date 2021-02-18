import { RouteRecordRaw } from 'vue-router'
import { $404 } from '@/pages/404/view/index'

// Internationalization is not currently supported
export const baseRouter: RouteRecordRaw[] = [
  {
    path: '/:pathMatch(.*)', // https://next.router.vuejs.org/guide/migration/#removed-star-or-catch-all-routes
    name: $404.name,
    meta: {
      full: true,
      canBeCollect: false // Can be collected by a custom controller
    },
    component: $404
  },
  {
    path: '/',
    redirect: '/music',
    meta: {
      canBeCollect: false
    }
  }
]
