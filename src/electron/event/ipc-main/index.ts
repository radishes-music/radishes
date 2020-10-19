import { ipcMain, IpcMainEvent, BrowserWindow } from 'electron'
import { Action } from '../action-types'

export const onIpcMainEvent = (win: BrowserWindow) => {
  let bounds = win.getBounds()
  ipcMain.on(Action.MINIMIZE_WINDOW, (event: IpcMainEvent, arg) => {
    win.minimize()
  })
  ipcMain.on(Action.MAXIMIZE_WINDOW, (event: IpcMainEvent, arg) => {
    bounds = win.getBounds()
    win.maximize()
  })
  ipcMain.on(Action.RESTORE_WINDOW, (event: IpcMainEvent, arg) => {
    win.setBounds(bounds, true)
    bounds = win.getBounds()
  })
  ipcMain.on(Action.CLOSE_WINDOW, (event: IpcMainEvent, arg) => {
    win.close()
  })
}
