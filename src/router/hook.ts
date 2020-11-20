import { Router } from 'vue-router'
import store from '@/store'

export function hook(router: Router) {
  router.beforeEach((to, from, next) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    if (to.meta.auth && !store.state.Auth.user) {
      store.commit('Auth/SHOW_VIEW')
      next(false)
      return
    }

    next()
  })
}
