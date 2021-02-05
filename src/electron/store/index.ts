import Store from 'electron-store'

export interface DownloadKey {
  downloadPath: string
  upgrade: boolean
}

const store = new Store<DownloadKey>()

export default store
