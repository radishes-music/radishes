import { FooterMutations, FooterState, FooterActions } from '@/modules/index'
import { uesModuleStore } from '@/hooks/index'

export const playMusic = () => {
  const store = uesModuleStore<FooterState>('Footer')

  return (id: number | unknown) => {
    store.useMutations(FooterMutations.PAUES_MUSIC)
    store.useActions(FooterActions.SET_MUSIC, id)
  }
}
