import { Router } from 'vue-router'
import { isLogin, showLogin } from '@/helpers'

export function hook(router: Router) {
  router.beforeEach((to, from, next) => {
    if (to.meta.auth && !isLogin()) {
      showLogin()
      next(false)
      return
    }

    next()
  })
}
