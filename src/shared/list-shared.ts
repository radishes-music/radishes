import { useRouter } from '@/hooks/index'
import { isLogin } from '@/helpers/index'
import { useAuthView } from '@/hooks/index'

export const jumpSongList = () => {
  const router = useRouter()
  const viewLogin = useAuthView()

  return (id: number) => {
    if (String(id) === '-1' && !isLogin()) {
      return viewLogin(true)
    }
    router.push({
      path: '/list/song/' + id
    })
  }
}
