import { ActionTree } from 'vuex'
import { SongsDetail, SongsBase } from '@/interface'
import { RootState } from '@/store/index'
import { DownloadState } from './state'
import { getSongUrl } from '@/api/index'
import { download } from '@/utils/index'

export const enum DownloadActions {
  DOWNLOAD_MUSIC = 'DOWNLOAD_MUSIC'
}
export const enum DownloadMutations {}

export const actions: ActionTree<DownloadState, RootState> = {
  async [DownloadActions.DOWNLOAD_MUSIC](_, song: SongsDetail) {
    const url = await getSongUrl<SongsBase[]>(song.id)
    download(url[0].url, song.name)
  }
}
export const mutations = {}
