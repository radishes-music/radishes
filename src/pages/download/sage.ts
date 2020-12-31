import { ActionTree, MutationTree } from 'vuex'
import {
  SongsDetail,
  DownloadState,
  Downloaded,
  DownloadActions,
  DownloadMutations
} from '@/interface'
import { RootState } from '@/store/index'
import { getMusicUrl } from '@/shared/music-shared'
import { download } from '@/utils/index'
import { importIpc } from '@/electron/event/ipc-browser'
import { DownloadIpcType } from '@/electron/event/action-types'

export const actions: ActionTree<DownloadState, RootState> = {
  async [DownloadActions.DOWNLOAD_MUSIC]({ commit }, song: SongsDetail) {
    const url = await getMusicUrl(song.id)
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
  },
  [DownloadMutations.SET_DOWNLOAD_PATH](state, path: string) {
    importIpc().then(v => {
      v.sendAsyncIpcRendererEvent(DownloadIpcType.SET_DOWNLOAD_PATH, path)
    })
    state.downloadPath = path
  }
}
