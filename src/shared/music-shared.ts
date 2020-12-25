import { FooterMutations, FooterActions } from '@/interface'
import { useFooterModule } from '@/modules'

export const playMusic = () => {
  const store = useFooterModule()

  return (id: number | unknown) => {
    store.useMutations(FooterMutations.PAUES_MUSIC)
    store.useActions(FooterActions.SET_MUSIC, id)
  }
}
