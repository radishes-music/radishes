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
import { Platform } from '@/config/build'

const { VUE_APP_PLATFORM } = process.env

export const actions: ActionTree<DownloadState, RootState> = {
  async [DownloadActions.DOWNLOAD_MUSIC]({ commit }, song: SongsDetail) {
    const songBase = await getMusicUrl(song.id)
    song.size = songBase[0].size
    const url = songBase[0].url
    commit(DownloadMutations.SET_DOWNLOAD_MUSIC, song)
    if (VUE_APP_PLATFORM === Platform.BROWSER) {
      // TODO ws protocol to be supported, download progress to be discussed
      download(url, song.name)
    }
    if (VUE_APP_PLATFORM === Platform.ELECTRON) {
      const v = await importIpc()
      v.sendAsyncIpcRendererEvent(DownloadIpcType.DOWNLOAD_TASK, {
        name: song.name,
        suffix: '.mp3',
        url
      })
    }
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
