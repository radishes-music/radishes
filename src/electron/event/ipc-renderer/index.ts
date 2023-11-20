// Accessible while the browser is running

/* 
Usually used in the rendering process to send information to the main process, 
and then process some things that the main process can handle (for example, changing the window, reading notifications)
*/

import { ipcRenderer, remote, BrowserWindow } from 'electron'
import {
  Action,
  MiddlewareView,
  LyricsAction,
  UpdateType,
  DownloadIpcType,
  ReadLocalFile,
  Dialog,
  AutoDownload,
  Service
} from '../action-types'

export const getWindow = () => remote.BrowserWindow.getFocusedWindow()

type Message = unknown
type ActionType =
  | Action
  | DownloadIpcType
  | MiddlewareView
  | LyricsAction
  | UpdateType
  | ReadLocalFile
  | Dialog
  | AutoDownload
  | Service

export function sendAsyncIpcRendererEvent(
  action: ActionType,
  message?: Message
) {
  ipcRenderer.send(action, message)
}

export function sendSyncIpcRendererEvent<T>(
  action: ActionType,
  message?: Message
): T {
  return ipcRenderer.sendSync(action, message)
}

export interface IpcRenderer {
  sendAsyncIpcRendererEvent: (action: ActionType, ...message: Message[]) => void
  sendSyncIpcRendererEvent: <T>(action: ActionType, ...message: Message[]) => T
  getWindow: () => BrowserWindow | null
}
