import { FooterInteface } from '@/pages/index'
import { uesModuleStore } from '@/hooks/index'

export const playMusic = () => {
  const store = uesModuleStore<FooterInteface.FooterState>('Footer')

  return (id: number | unknown) => {
    store.useMutations(FooterInteface.FooterMutations.PAUES_MUSIC)
    store.useActions(FooterInteface.FooterActions.SET_MUSIC, id)
  }
}
