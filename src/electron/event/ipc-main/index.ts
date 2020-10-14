import { ipcMain, IpcMainEvent, BrowserWindow, Rectangle } from 'electron'
import {
  MINIMIZE_WINDOW,
  MAXIMIZE_WINDOW,
  RESTORE_WINDOW
} from '../actionTypes'

export const onIpcMainEvent = (win: BrowserWindow) => {
  let bounds = win.getBounds()
  ipcMain.on(MINIMIZE_WINDOW, (event: IpcMainEvent, arg) => {
    win.minimize()
  })
  ipcMain.on(MAXIMIZE_WINDOW, (event: IpcMainEvent, arg) => {
    bounds = win.getBounds()
    win.maximize()
  })
  ipcMain.on(RESTORE_WINDOW, (event: IpcMainEvent, arg) => {
    win.setBounds(bounds)
    bounds = win.getBounds()
  })
}

ipcMain.on('synchronous-message', (event: IpcMainEvent, arg) => {
  console.log(arg)
  event.returnValue = 'pong'
})
