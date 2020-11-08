// Accessible while the browser is running

/* 
Usually used in the rendering process to send information to the main process, 
and then process some things that the main process can handle (for example, changing the window, reading notifications)
*/

import { ipcRenderer } from 'electron'
import { Action, Lyrice } from '../action-types'

type Message = any

export function sendAsyncIpcRendererEvent(
  action: Action | Lyrice,
  message?: Message
) {
  ipcRenderer.send(action, message)
}

export function sendSyncIpcRendererEvent(
  action: Action | Lyrice,
  message?: Message
) {
  return ipcRenderer.sendSync(action, message)
}

export interface IpcRenderer {
  sendAsyncIpcRendererEvent: (
    action: Action | Lyrice,
    message?: Message
  ) => void
  sendSyncIpcRendererEvent: <T>(action: Action | Lyrice, message?: Message) => T
}
