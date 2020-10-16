import { BrowserWindow } from 'electron'
import { onIpcMainEvent } from './ipc-main/index'

export const eventInit = (win: BrowserWindow) => {
  onIpcMainEvent(win)
}
