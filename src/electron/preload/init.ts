/**
 * runtime: web
 * The electron package cannot be imported directly, it can only be imported dynamically.
 * Because webpack will import the corresponding package when analyzing dependencies,
 * an electron-related error will be prompted in the browser host.
 */

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
    const userDownloadPath = v.join(os.homedir + '/Downloads')
    if (!downloadState.downloadPath) {
      store.commit(
        DownloadNameSpaced + '/' + DownloadMutations.SET_DOWNLOAD_PATH,
        userDownloadPath
      )
    }

    const userMusicPath = v.join(os.homedir + '/Music')
    if (!localMusicState.normalPath) {
      store.commit(
        LocalMusicNameSpaced + '/' + LocalMusicMutations.SET_NORMAL_PATH,
        userMusicPath
      )
    }

    const paths = [
      {
        path: userMusicPath,
        name: '我的音乐',
        check: true
      },
      {
        path: userDownloadPath,
        name: '下载',
        check: true
      }
    ]
    if (!localMusicState.localPath.length) {
      store.commit(
        LocalMusicNameSpaced + '/' + LocalMusicMutations.SET_LOCAL_PATH,
        paths
      )
    }

    const songs = await v.readPathMusic(paths.map(item => item.path))

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
