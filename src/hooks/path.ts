import { useRouter } from '@/hooks/index'
import { isLogin } from '@/helpers/index'
import { useAuthView } from '@/hooks/index'

export const useJumpSongList = () => {
  const router = useRouter()
  const authView = useAuthView()
  return (id: number) => {
    if (String(id) === '-1' && !isLogin()) {
      return authView(true)
    }
    router.push({
      path: '/list/song/' + id
    })
  }
}

export const useJumpAblumList = () => {
  const router = useRouter()

  return (id: number) => {
    router.push({
      path: '/list/album/' + id
    })
  }
}

export const useJumpArtist = () => {
  const router = useRouter()
  return (id: number) => {
    router.push({
      path: '/artist/' + id + '/album'
    })
  }
}

export const useJump = () => {
  const jumpSongList = useJumpSongList()
  const jumpArtist = useJumpArtist()
  const jumpAblum = useJumpAblumList()
  return {
    jumpAblum,
    jumpArtist,
    jumpSongList
  }
}
