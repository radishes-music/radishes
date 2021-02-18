import { BrowserWindow } from 'electron'
import { onIpcMainEvent } from './ipc-main/index'
import autoDownload from './ipc-main/auto-download'

export const eventInit = (win: BrowserWindow) => {
  onIpcMainEvent(win)
  autoDownload(win)
}
