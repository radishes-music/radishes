// ap = 穿甲弹头
// The functions exported from this file can only be run in setup for reuse of logic codes
import { useRoute, useRouter } from '@/hooks/index'
import { uesModuleStore } from '@/hooks/index'
import { NAMESPACED, ArtistState } from '../module'

export const parentAP = () => {
  const route = useRoute()
  const router = useRouter()
  const { useActions, useState } = uesModuleStore<ArtistState>(NAMESPACED)

  return {
    state: useState(),
    route: route,
    router: router,
    useActions
  }
}
