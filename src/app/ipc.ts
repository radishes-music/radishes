import { App } from 'vue'
import { DownloadIpcType } from '@/electron/event/action-types'
import { DownloadMutations } from '@/interface'
import { DownloadNameSpaced } from '@/modules'
import { suggested, success, error } from '@/hooks/index'
import store, { RootMutations } from '@/store'

interface Process {
  state: 'progressing' | 'completed' | 'interrupted' | 'cancelled'
  name: string
  receive: number
  total: number
  schedule: number
}

export const registerIPC = (app: App) => {
  const state = store.state.Download
  if (!state.downloadPath) {
    import('@/electron/utils/index').then(v => {
      const os = v.getUserOS()
      store.commit(
        DownloadNameSpaced + '/' + DownloadMutations.SET_DOWNLOAD_PATH,
        v.join(os.homedir + '/Music')
      )
    })
  }
  import('electron').then(v => {
    v.ipcRenderer.on(DownloadIpcType.DOWNLOAD_START, (event, arg) => {
      store.commit(
        RootMutations.UPDATE_PERECENTAGE,
        Math.floor(Math.random() * 10)
      )
      suggested('下载中...', {
        key: arg.name
      })
    })

    v.ipcRenderer.on(
      DownloadIpcType.DOWNLOAD_END,
      (event, arg: Pick<Process, 'name' | 'state'>) => {
        if (arg.state === 'completed') {
          success('下载完成', {
            key: arg.name
          })
        } else {
          error('下载失败', {
            key: arg.name
          })
        }
      }
    )

    v.ipcRenderer.on(
      DownloadIpcType.DOWNLOAD_PROGRESS,
      (event, arg: Process) => {
        if (arg.state === 'progressing') {
          store.commit(RootMutations.UPDATE_PERECENTAGE, arg.schedule)
        }
      }
    )
  })
}
