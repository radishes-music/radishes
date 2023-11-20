import { App } from 'vue'
import { DownloadIpcType } from '@/electron/event/action-types'
import { suggested, success, error } from '@/hooks/index'
import store, { RootMutations } from '@/store'
import { throttle } from 'lodash-es'

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
  ipcRenderer.on(DownloadIpcType.DOWNLOAD_START, (event, arg) => {
    store.commit(
      RootMutations.UPDATE_PERECENTAGE,
      Math.floor((Math.random() * 10) / 100)
    )
    suggested('下载中...', {
      key: arg.name
    })
  })

  ipcRenderer.on(
    DownloadIpcType.DOWNLOAD_END,
    (event, arg: Pick<DownloadData, 'name' | 'state' | 'error'>) => {
      if (arg.state === 'completed') {
        success('下载完成', {
          key: arg.name
        })
      } else {
        console.error(arg.error)
        error('下载失败', {
          key: arg.name
        })
      }
    }
  )

  ipcRenderer.on(
    DownloadIpcType.DOWNLOAD_PROGRESS,
    throttle((event, arg: DownloadData) => {
      if (arg.state === 'progressing') {
        store.commit(RootMutations.UPDATE_PERECENTAGE, arg.schedule)
      }
    }, 200)
  )
}
