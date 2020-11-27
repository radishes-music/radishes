import { get } from '@/utils/http'
import {} from '@/interface/index'
import { State } from '../state'

export const getPlayList = async (id: number): Promise<State['playlist'][]> => {
  const data = await get<{ playlist: State['playlist'][] }>(
    '/api/playlist/detail',
    {
      id
    }
  )
  return data.playlist
}
