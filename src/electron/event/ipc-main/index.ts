/* eslint-disable @typescript-eslint/no-unused-vars */
import { ipcMain, IpcMainEvent, BrowserWindow, screen } from 'electron'
import {
  Action,
  MiddlewareView,
  LyriceAction,
  UpdateType
} from '../action-types'

export const onIpcMainEvent = (win: BrowserWindow) => {
  let syrice: null | BrowserWindow
  ipcMain.on(Action.MINIMIZE_WINDOW, (event: IpcMainEvent, arg) => {
    win.minimize()
  })
  ipcMain.on(Action.MAXIMIZE_WINDOW, (event: IpcMainEvent, arg) => {
    win.maximize()
  })
  ipcMain.on(Action.RESTORE_WINDOW, (event: IpcMainEvent, arg) => {
    win.restore()
  })
  ipcMain.on(Action.CLOSE_WINDOW, (event: IpcMainEvent, arg) => {
    win.close()
    syrice && syrice.close()
  })
  ipcMain.on(MiddlewareView.CREATE_WINDOW, (event: IpcMainEvent, arg) => {
    if (syrice) {
      if (syrice.isVisible()) {
        syrice.hide()
      } else {
        syrice.show()
      }
    } else {
      const { width, height } = screen.getPrimaryDisplay().workAreaSize
      syrice = new BrowserWindow({
        width: 724,
        height: 100,
        x: width / 2 - 724 / 2,
        y: height - 100,
        show: false,
        frame: false,
        titleBarStyle: 'hidden',
        transparent: true,
        resizable: false,
        alwaysOnTop: true,
        acceptFirstMouse: true,
        webPreferences: {
          nodeIntegration: true
        }
      })
      if (process.env.WEBPACK_DEV_SERVER_URL) {
        syrice.loadURL(process.env.WEBPACK_DEV_SERVER_URL + 'lyrice')
      } else {
        syrice.loadURL('app://./lyrice.html')
      }
      syrice.once('ready-to-show', () => {
        if (syrice) {
          syrice.show()
          syrice.webContents.send(LyriceAction.LYRICE_UPDATE_RENDER, {
            type: UpdateType.UPDATE_LYRICE,
            payload: arg
          })
        }
      })
      syrice.on('closed', () => {
        syrice = null
      })
    }
  })
  ipcMain.on(MiddlewareView.UPDATE_THEME_COLOR, (event, arg) => {
    syrice && syrice.webContents.send(MiddlewareView.UPDATE_THEME_COLOR, arg)
  })
  ipcMain.on(
    LyriceAction.LYRICE_UPDATE,
    (
      event: IpcMainEvent,
      arg: {
        type: UpdateType
        payload: unknown
      }
    ) => {
      syrice && syrice.webContents.send(LyriceAction.LYRICE_UPDATE_RENDER, arg)
    }
  )
}
