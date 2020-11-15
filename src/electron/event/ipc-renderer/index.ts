// Accessible while the browser is running

/* 
Usually used in the rendering process to send information to the main process, 
and then process some things that the main process can handle (for example, changing the window, reading notifications)
*/

import { ipcRenderer } from 'electron'
import { Action, LyriceAction, UpdateType } from '../action-types'

type Message = unknown
type ActionType = Action | LyriceAction | UpdateType

export function sendAsyncIpcRendererEvent(
  action: ActionType,
  message?: Message
) {
  ipcRenderer.send(action, message)
}

export function sendSyncIpcRendererEvent(
  action: ActionType,
  message?: Message
) {
  return ipcRenderer.sendSync(action, message)
}

export interface IpcRenderer {
  sendAsyncIpcRendererEvent: (action: ActionType, ...message: Message[]) => void
  sendSyncIpcRendererEvent: <T>(action: ActionType, ...message: Message[]) => T
}
