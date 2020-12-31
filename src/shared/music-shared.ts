import { FooterMutations, FooterActions, SongsBase } from '@/interface'
import { useFooterModule } from '@/modules'
import { getSongUrl } from '@/api/index'
import store from '@/store/index'

export const playMusic = () => {
  const store = useFooterModule()

  return async (
    id:
      | number
      | {
          url: string
          id: string | number
        },
    isStartOver = true
  ) => {
    store.useMutations(FooterMutations.PAUES_MUSIC)
    if (isStartOver) {
      store.useMutations(FooterMutations.UPDATE_CURRENT_TIME, 0)
    }
    await store.useActions(FooterActions.SET_MUSIC, id)
    store.useMutations(FooterMutations.PLAY_MUSIC)
  }
}

export const getMusicUrl = (id: number | number[]) => {
  const source = store.state.Setting.source
  return getSongUrl<SongsBase[]>(id, source)
}
