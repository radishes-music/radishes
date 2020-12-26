import { get } from '@/utils/http'
import { SongsDetail } from '@/interface/index'
export { getSongDetail, getSongUrl } from '@/api/index'

export const getLyric = async (id: number): Promise<string> => {
  const data = await get<SongsDetail>('/api/lyric', {
    id
  })
  return data.lrc.lyric
}
