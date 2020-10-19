import { Router } from 'vue-router'
import { mapMutations } from 'vuex'
import { Mutations } from '@/store/index'

export function hook(router: Router) {
  router.beforeEach((to, from, next) => {
    next()
  })
}
