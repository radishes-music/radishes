import { FooterMutations, FooterActions } from '@/interface'
import { useFooterModule } from '@/modules'

export const playMusic = () => {
  const store = useFooterModule()

  return async (id: number | unknown, isStartOver = true) => {
    store.useMutations(FooterMutations.PAUES_MUSIC)
    if (isStartOver) {
      store.useMutations(FooterMutations.UPDATE_CURRENT_TIME, 0)
    }
    await store.useActions(FooterActions.SET_MUSIC, id)
    store.useMutations(FooterMutations.PLAY_MUSIC)
  }
}
