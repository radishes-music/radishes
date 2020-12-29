// runtime web

import { Platform } from '@/config/build'
import { DownloadMutations, LocalMusicMutations, SongsDetail } from '@/interface'
import { DownloadNameSpaced, LocalMusicNameSpaced } from '@/modules'
import { syncToAsync } from '@/utils/index'
import store from '@/store'

const { VUE_APP_PLATFORM } = process.env
type LocalSongsDetail = Pick<SongsDetail, 'al' | 'ar' | 'name'>

const readPathMusic = async (abPath: string) => {
  const v = await import('@/electron/utils/index')

  const files = v.readdirSync(abPath)
    .filter(mp3 => /\.mp3$/.test(mp3))

  const renderSongs = async (resolve: (v: LocalSongsDetail[]) => void) => {
    const fls: LocalSongsDetail[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const path = v.join(abPath, file)
      const mp3 = await v.getMp3Tags(path)
      const map: Record<string, string> = {
        album: 'al',
        artist: 'ar',
        title: 'name'
      }
      const songs: Record<string, string> = {}
      for (const [key, value] of Object.entries(mp3)) {
        // eslint-disable-next-line prettier/prettier
        songs[map[key] ??= key] = value
      }

      if (!songs.name) {
        songs.name = file.replace(/\.mp3/, '')
      }
      songs.path = path

      fls.push(songs as unknown as LocalSongsDetail)
    }
    resolve(fls)
  }
  const songs = await syncToAsync<LocalSongsDetail[]>(renderSongs)

  return songs
}

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

    const songs = await readPathMusic(localMusicState.normalPath)

    console.log(songs)

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
