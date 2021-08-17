import { App } from 'vue'
import { DownloadIpcType } from '@/electron/event/action-types'
import { suggested, success, error } from '@/hooks/index'
import store, { RootMutations } from '@/store'
import throttle from 'lodash/throttle'

export interface DownloadData {
  state: 'progressing' | 'completed' | 'interrupted' | 'cancelled' | 'start'
  name: string
  receive: number
  total: number
  schedule: number
  error?: NodeJS.ErrnoException | null | string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const registerIPC = (app: App) => {
  import('electron').then(v => {
    v.ipcRenderer.on(DownloadIpcType.DOWNLOAD_START, (event, arg) => {
      store.commit(
        RootMutations.UPDATE_PERECENTAGE,
        Math.floor((Math.random() * 10) / 100)
      )
      suggested($t('src__electron__preload__ipc___23'), {
        key: arg.name
      })
    })

    v.ipcRenderer.on(
      DownloadIpcType.DOWNLOAD_END,
      (event, arg: Pick<DownloadData, 'name' | 'state' | 'error'>) => {
        if (arg.state === 'completed') {
          success($t('src__electron__preload__ipc___32'), {
            key: arg.name
          })
        } else {
          console.error(arg.error)
          error($t('src__electron__preload__ipc___37'), {
            key: arg.name
          })
        }
      }
    )

    v.ipcRenderer.on(
      DownloadIpcType.DOWNLOAD_PROGRESS,
      throttle((event, arg: DownloadData) => {
        if (arg.state === 'progressing') {
          store.commit(RootMutations.UPDATE_PERECENTAGE, arg.schedule)
        }
      }, 200)
    )
  })
}
