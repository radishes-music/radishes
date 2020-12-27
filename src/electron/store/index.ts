import Store from 'electron-store'

export interface DownloadKey {
  downloadPath: string
}

const store = new Store<DownloadKey>()

export default store
