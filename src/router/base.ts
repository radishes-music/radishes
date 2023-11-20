import { $404 } from '@/pages/404/view/index'
import { CustomizeRouteRecordRaw } from '@/interface'

// Internationalization is not currently supported
export const baseRouter: CustomizeRouteRecordRaw[] = [
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
