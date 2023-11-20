import { FooterMutations, FooterActions, SongsBase } from '@/interface'
import { useFooterModule } from '@/modules'
import { getSongUrl } from '@/api/index'
import { toArrayBuffer } from '@/utils/index'
import store from '@/store/index'

const mapURL = new Map()

export const playMusic = async (
  payload:
    | number
    | {
        buffer?: Buffer
        path?: string
        url: string
        id: string | number
      },
  isStartOver = true
) => {
  const store = useFooterModule()
  if (typeof payload === 'object' && payload.buffer) {
    if (mapURL.has(payload.path)) {
      payload.url = mapURL.get(payload.path)
    } else {
      const blob = new Blob([toArrayBuffer(payload.buffer)], {
        type: 'audio/mpeg'
      })
      payload.url = window.URL.createObjectURL(blob)
      mapURL.set(payload.path, payload.url)
    }
    delete payload.buffer
  }
  store.useMutations(FooterMutations.PAUES_MUSIC)
  if (isStartOver) {
    store.useMutations(FooterMutations.UPDATE_CURRENT_TIME, 0)
  }

  await store.useActions(FooterActions.SET_MUSIC, payload)
  store.useMutations(FooterMutations.PLAY_MUSIC)
}

export const clearLocalMusicUrl = () => {
  Array.from(mapURL.values()).forEach((url: string) => {
    window.URL.revokeObjectURL(url)
  })
}

export const getMusicUrl = (id: number | number[]) => {
  const source = store.state.Setting.source
  const br = store.state.Setting.bitRate
  return getSongUrl<SongsBase[]>(id, source, br)
}
