import { actions, mutations } from './sage'
import { state } from './state'
import { uesModuleStore } from '@/hooks/index'
import { SettingActions, SettingMutations, SettingState } from '@/interface'

export const SettingNameSpaced = 'Setting'

export const useSettingModule = () => {
  return uesModuleStore<SettingState, {}, SettingActions, SettingMutations>(
    SettingNameSpaced
  )
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
