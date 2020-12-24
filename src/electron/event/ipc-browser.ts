import { IpcRenderer } from '@/electron/event/ipc-renderer'

export const importIpc = () => {
  return import('@/electron/event/ipc-renderer').then((v: IpcRenderer) => {
    return {
      sendAsyncIpcRendererEvent: v.sendAsyncIpcRendererEvent,
      sendSyncIpcRendererEvent: v.sendSyncIpcRendererEvent,
      getWindow: v.getWindow
    }
  })
}

export const importIpcOrigin = () => {
  return import('electron').then(v => {
    return v.ipcRenderer
  })
}
