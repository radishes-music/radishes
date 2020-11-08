import { IpcRenderer } from '@/electron/event/ipc-renderer'

export const importIpc = () => {
  return import('@/electron/event/ipc-renderer').then((v: IpcRenderer) => {
    return {
      sendAsyncIpcRendererEvent: v.sendAsyncIpcRendererEvent,
      sendSyncIpcRendererEvent: v.sendSyncIpcRendererEvent
    }
  })
}
