import { actions, mutations } from './sage'
import { state } from './state'
import { uesModuleStore } from '@/hooks/index'
import { SearchActions, SearchMutations, SearchState } from '@/interface'

export const SearchNameSpaced = 'Search'

export const useSearchModule = () => {
  return uesModuleStore<SearchState, {}, SearchActions, SearchMutations>(
    SearchNameSpaced
  )
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
