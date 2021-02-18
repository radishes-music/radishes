import { IpcRenderer } from '@/electron/event/ipc-renderer'

export const asyncIpc = () => {
  return import('@/electron/event/ipc-renderer').then((v: IpcRenderer) => {
    return {
      sendAsyncIpcRendererEvent: v.sendAsyncIpcRendererEvent,
      sendSyncIpcRendererEvent: v.sendSyncIpcRendererEvent,
      getWindow: v.getWindow
    }
  })
}

export const asyncIpcOrigin = () => {
  return import('electron').then(v => v.ipcRenderer)
}

export const asyncShell = () => {
  return import('electron').then(v => v.shell)
}
