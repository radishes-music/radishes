import { BrowserWindow, globalShortcut } from 'electron'

export const setupDevtool = (win: BrowserWindow) => {
  globalShortcut.register('CommandOrControl+Alt+i', function () {
    if (win.webContents.isDevToolsOpened()) {
      win.webContents.closeDevTools()
    } else {
      win.webContents.openDevTools()
    }
  })
}
