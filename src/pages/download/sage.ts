import { ActionTree, MutationTree, ActionContext } from 'vuex'
import {
  SongsDetail,
  DownloadState,
  Downloaded,
  DownloadActions,
  DownloadMutations
} from '@/interface'
import { RootState } from '@/store/index'
import { getMusicUrl } from '@/shared/music-shared'
import { download, isBrowser, isElectron } from '@/utils/index'
import { asyncIpc } from '@/electron/event/ipc-browser'
import { DownloadIpcType } from '@/electron/event/action-types'
import { getSongDetail } from '@/api/index'
import { remove } from 'lodash-es'

type IActions<T = ActionContext<DownloadState, RootState>> = {
  [DownloadActions.DOWNLOAD_MUSIC]: (k: T, payload: SongsDetail) => void
}

export const actions: IActions = {
  async [DownloadActions.DOWNLOAD_MUSIC]({ commit }, song) {
    const songBase = await getMusicUrl(song.id)
    song.size = songBase[0].size
    const url = songBase[0].url
    commit(DownloadMutations.SET_DOWNLOAD_MUSIC, song)
    if (isBrowser) {
      // TODO ws protocol to be supported, download progress to be discussed
      download(url, song.name)
    }
    if (isElectron) {
      const v = await asyncIpc()
      let al, ar, pic, arArr
      try {
        const detail = await getSongDetail(song.id)
        if (detail.length) {
          al = detail[0].al.name
          ar = detail[0].ar.map(r => r.name).join(',')
          arArr = detail[0].ar.map(r => r.name).join(',')
          pic = detail[0].al.picUrl
        }
      } catch (e) {
        console.warn(e)
      }
      v.sendAsyncIpcRendererEvent(DownloadIpcType.DOWNLOAD_TASK, {
        name: song.name,
        al,
        ar,
        pic,
        arArr,
        id: song.id,
        suffix: '.mp3',
        url
      })
    }
  }
}

export const mutations: MutationTree<DownloadState> = {
  [DownloadMutations.SET_DOWNLOAD_MUSIC](state, song: Downloaded) {
    if (state.downloaded.find(s => s.id === song.id)) {
      return
    }
    song.dlt = Date.now()
    song.type = 'download'
    state.downloaded.push(song)
  },
  [DownloadMutations.REMOVE_DOWNLOAD_MUSIC](state, id: number) {
    remove(state.downloaded, s => s.id === id)
  },
  [DownloadMutations.SET_DOWNLOAD_PATH](state, path: string) {
    asyncIpc().then(v => {
      v.sendAsyncIpcRendererEvent(DownloadIpcType.SET_DOWNLOAD_PATH, path)
    })
    state.downloadPath = path
  }
}
