import { ActionTree } from 'vuex'
import {
  SongsDetail,
  SongsBase,
  DownloadState,
  DownloadActions
} from '@/interface'
import { RootState } from '@/store/index'
import { getSongUrl } from '@/api/index'
import { download } from '@/utils/index'

export const actions: ActionTree<DownloadState, RootState> = {
  async [DownloadActions.DOWNLOAD_MUSIC](_, song: SongsDetail) {
    const url = await getSongUrl<SongsBase[]>(song.id)
    download(url[0].url, song.name)
  }
}
export const mutations = {}
