import { useRouter } from '@/hooks/index'
import { isLogin } from '@/helpers/index'
import { useAuthView } from '@/hooks/index'
import { Router } from 'vue-router'

export class Jump {
  router: Router
  viewLogin: (flag: boolean) => void

  constructor() {
    this.router = useRouter()
    this.viewLogin = useAuthView()
  }

  public songList(id: number) {
    if (String(id) === '-1' && !isLogin()) {
      return this.viewLogin(true)
    }
    this.router.push({
      path: '/list/song/' + id
    })
  }

  public albumList(id: number) {
    this.router.push({
      path: '/list/album/' + id
    })
  }

  public artist(id: number) {
    this.router.push({
      path: '/artist/' + id + '/album'
    })
  }
}
