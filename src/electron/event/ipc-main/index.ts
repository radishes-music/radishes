import { ipcMain, IpcMainEvent, BrowserWindow, screen } from 'electron'
import { Action, Lyrice } from '../action-types'

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
  ipcMain.on(Action.CREATE_WINDOW, (event: IpcMainEvent, arg) => {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize
    const syrice = new BrowserWindow({
      width: 724,
      height: 100,
      x: width / 2 - 724 / 2,
      y: height - 100 * 2,
      show: false,
      // frame: false,
      titleBarStyle: 'hidden',
      webPreferences: {
        nodeIntegration: true
      }
    })
    if (process.env.WEBPACK_DEV_SERVER_URL) {
      console.log(process.env.WEBPACK_DEV_SERVER_URL)
      syrice.loadURL(
        process.env.WEBPACK_DEV_SERVER_URL + 'electron-lyrice-flash'
      )
    }
    syrice.once('ready-to-show', () => {
      syrice && syrice.show()
    })
  })
  // ipcMain.on(Lyrice.LYRICE_UPDATE, (event: IpcMainEvent, arg) => {
  //   console.log('主窗口接受到数据')
  //   console.log('主窗口发送数据到子窗口')
  //   event.reply(Lyrice.LYRICE_UPDATE_RENDER, arg)
  // })
}
