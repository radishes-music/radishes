import { useRouter } from '@/hooks/index'

export const jumpSongList = () => {
  const router = useRouter()

  return (id: number) => {
    router.push({
      path: '/list/song/' + id
    })
  }
}
