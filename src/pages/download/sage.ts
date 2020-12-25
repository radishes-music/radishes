import { ActionTree, MutationTree } from 'vuex'
import {
  SongsDetail,
  SongsBase,
  DownloadState,
  Downloaded,
  DownloadActions,
  DownloadMutations
} from '@/interface'
import { RootState } from '@/store/index'
import { getSongUrl } from '@/api/index'
import { download } from '@/utils/index'

export const actions: ActionTree<DownloadState, RootState> = {
  async [DownloadActions.DOWNLOAD_MUSIC]({ commit }, song: SongsDetail) {
    const url = await getSongUrl<SongsBase[]>(song.id)
    song.size = url[0].size
    commit(DownloadMutations.SET_DOWNLOAD_MUSIC, song)
    // TODO ws protocol to be supported, download progress to be discussed
    download(url[0].url, song.name)
  }
}

export const mutations: MutationTree<DownloadState> = {
  [DownloadMutations.SET_DOWNLOAD_MUSIC](state, song: Downloaded) {
    song.dlt = Date.now()
    state.downloaded.push(song)
  }
}
