/**
 * runtime: web
 * The electron package cannot be imported directly, it can only be imported dynamically.
 * Because webpack will import the corresponding package when analyzing dependencies,
 * an electron-related error will be prompted in the browser host.
 */

import { DownloadMutations, LocalMusicMutations } from '@/interface'
import { useDownloadModule, useLocalMusicModule } from '@/modules'
import store from '@/store'
import { isElectron } from '@/utils'

const initStorage = async () => {
  if (isElectron) {
    const downloadModule = useDownloadModule()
    const localMusicModule = useLocalMusicModule()
    const downloadState = store.state.Download
    const localMusicState = store.state.LocalMusic

    const os = electronAPI.os.userInfo()
    const userDownloadPath = electronAPI.path.join(os.homedir + '/Downloads')
    if (!downloadState.downloadPath) {
      downloadModule.useMutations(
        DownloadMutations.SET_DOWNLOAD_PATH,
        userDownloadPath
      )
    }

    const userMusicPath = electronAPI.path.join(os.homedir + '/Music')
    if (!localMusicState.normalPath) {
      localMusicModule.useMutations(
        LocalMusicMutations.SET_NORMAL_PATH,
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
      localMusicModule.useMutations(LocalMusicMutations.SET_LOCAL_PATH, paths)
    }

    const songs = await electronAPI.readPathMusic(paths.map(item => item.path))

    localMusicModule.useMutations(LocalMusicMutations.SET_LOCAL_MUSIC, songs)
  }
}

const init = () => {
  initStorage()
}

export default init
