// runtime web

import { Platform } from '@/config/build'
import { DownloadMutations, LocalMusicMutations } from '@/interface'
import { DownloadNameSpaced, LocalMusicNameSpaced } from '@/modules'
import store from '@/store'

const { VUE_APP_PLATFORM } = process.env

const initStorage = async () => {
  if (VUE_APP_PLATFORM === Platform.ELECTRON) {
    const v = await import('@/electron/utils/index')
    const downloadState = store.state.Download
    const localMusicState = store.state.LocalMusic
    const os = v.getUserOS()
    const userMusicPath = v.join(os.homedir + '/Music')

    if (!downloadState.downloadPath) {
      store.commit(
        DownloadNameSpaced + '/' + DownloadMutations.SET_DOWNLOAD_PATH,
        userMusicPath
      )
    }

    if (!localMusicState.normalPath) {
      store.commit(
        LocalMusicNameSpaced + '/' + LocalMusicMutations.SET_NORMAL_PATH,
        userMusicPath
      )
    }

    const songs = await v.readPathMusic(localMusicState.normalPath)

    store.commit(
      LocalMusicNameSpaced + '/' + LocalMusicMutations.SET_LOCAL_MUSIC,
      songs
    )
  }
}

const init = () => {
  initStorage()
}

export default init
