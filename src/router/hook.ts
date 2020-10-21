import { Router } from 'vue-router'

export function hook(router: Router) {
  router.beforeEach((to, from, next) => {
    next()
  })
}
