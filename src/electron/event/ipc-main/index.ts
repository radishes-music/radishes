import { ipcMain, IpcMainEvent, BrowserWindow, screen } from 'electron'
import { Action, LyriceAction, UpdateType } from '../action-types'

export const onIpcMainEvent = (win: BrowserWindow) => {
  let bounds = win.getBounds()
  let syrice: null | BrowserWindow
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
    syrice && syrice.close()
  })
  ipcMain.on(Action.CREATE_WINDOW, (event: IpcMainEvent, arg) => {
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
        webPreferences: {
          nodeIntegration: true
        }
      })
      if (process.env.WEBPACK_DEV_SERVER_URL) {
        syrice.loadURL(process.env.WEBPACK_DEV_SERVER_URL + 'lyrice')
      }
      syrice.once('ready-to-show', () => {
        syrice && syrice.show()
      })
      syrice.once('closed', () => {
        syrice = null
      })
    }
  })
  ipcMain.on(
    LyriceAction.LYRICE_UPDATE,
    (
      event: IpcMainEvent,
      arg: {
        type: UpdateType
        payload: any
      }
    ) => {
      syrice && syrice.webContents.send(LyriceAction.LYRICE_UPDATE_RENDER, arg)
    }
  )
}
