import { useRouter } from '@/hooks/index'
import { Handle } from '@/components/song-list/index'
import { Song } from '@/interface/index'

export function toPlaylist(type: Handle, payload: Song) {
  const router = useRouter()
  if (type === 'click') {
    router.push({
      path: '/song-list/' + payload.id
    })
  }
}
