import { FooterMutations, FooterActions } from '@/interface'
import { useFooterModule } from '@/modules'

export const playMusic = () => {
  const store = useFooterModule()

  return async (id: number | unknown) => {
    store.useMutations(FooterMutations.PAUES_MUSIC)
    await store.useActions(FooterActions.SET_MUSIC, id)
    store.useMutations(FooterMutations.PLAY_MUSIC)
  }
}
