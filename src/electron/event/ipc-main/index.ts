import { ipcMain, IpcMainEvent, BrowserWindow } from 'electron'
import { App } from '@/background'
import { Action } from '../actionTypes'

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
    win.setBounds(bounds)
    bounds = win.getBounds()
  })
  ipcMain.on(Action.CLOSE_WINDOW, (event: IpcMainEvent, arg) => {
    win.close()
  })
}

ipcMain.on('synchronous-message', (event: IpcMainEvent, arg) => {
  console.log(arg)
  event.returnValue = 'pong'
})
