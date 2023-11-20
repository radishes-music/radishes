import { ActionTree, MutationTree, ActionContext } from 'vuex'
import {
  CloudState,
  CloudActions,
  CloudMutations,
  CloudList
} from '@/interface'
import { RootState } from '@/store/index'
import { getCloud } from './api/cloud'

type IActions<T = ActionContext<CloudState, RootState>> = {
  [CloudActions.CLOUD_LIST_ACTION]: (k: T) => void
}

export const actions: ActionTree<CloudState, RootState> = {
  async [CloudActions.CLOUD_LIST_ACTION]({ commit, state }) {
    const data = await getCloud(state.pagination)
    commit(CloudMutations.SET_CLOUD_LIST, data)
  }
}

export const mutations: MutationTree<CloudState> = {
  [CloudMutations.SET_CLOUD_LIST](state, list: CloudList[]) {
    state.cloudList = list.map(item => {
      return {
        ...item,
        name: item.songName,
        ar: item.artist,
        al: item.album,
        size: item.fileSize,
        id: item.songId
      }
    })
  },
  [CloudMutations.UNSHIFT_CLOUD_LIST](state, song: CloudList) {
    if (state.cloudList.some(item => item?.uid === song?.uid)) {
      return
    }
    state.cloudList.unshift({
      ...song,
      name: song.name?.replace('.mp3', '')
    })
  },
  [CloudMutations.REMOVE_UNSHIFT_CLOUD_LIST](state) {
    state.cloudList.shift()
  }
}
