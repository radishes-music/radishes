import Store from 'electron-store'

export interface DownloadKey {
  downloadPath: string
  upgrade: boolean
  servicePort: string
  [k: string]: unknown
}

const initStore: DownloadKey = {
  downloadPath: '',
  upgrade: true,
  servicePort: ''
}

const store = new Store<DownloadKey>()

for (const k in initStore) {
  store.set(k, initStore[k])
}

export default store
