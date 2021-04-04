import { app, protocol, BrowserWindow, screen } from 'electron'
import { autoUpdater } from 'electron-updater'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import { eventInit } from '@/electron/event/index'
import { downloadIntercept } from './event/ipc-main/download'
import store from '@/electron/store/index'

import path from 'path'

// curl -H "Accept: application/json" https://api.github.com/repos/Linkontoask/radishes/contents/package.json
const isDevelopment = process.env.NODE_ENV !== 'production'

let win: BrowserWindow | null

export const App = app

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'app',
    privileges: {
      secure: true,
      standard: true,
      corsEnabled: true
    }
  }
])

function createWindow() {
  const { workAreaSize, scaleFactor } = screen.getPrimaryDisplay()
  const { width, height } = workAreaSize
  const [w, h] = [width * scaleFactor, height * scaleFactor]
  // Create the browser window.
  win = new BrowserWindow({
    width: w / 1.7,
    height: h / 1.5,
    minWidth: w / 2,
    minHeight: h / 2,
    useContentSize: true,
    frame: false,
    titleBarStyle: 'hidden',
    show: false,
    resizable: true,
    icon: path.join(
      __dirname,
      process.env.VUE_APP_NODE_ENV === 'development'
        ? '../build/icons/1024x1024.png'
        : 'build/icons/1024x1024.png'
    ),
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: (process.env
        .ELECTRON_NODE_INTEGRATION as unknown) as boolean,
      // https://github.com/electron/electron/issues/9920
      // preload: __dirname + '/electron/preload/index.js'
      enableRemoteModule: true
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
    const upgrade = store.get('upgrade')
    if (upgrade) {
      autoUpdater.checkForUpdatesAndNotify({
        title: 'Radishes 通知',
        body: '发现有新版本，快更新体验吧！'
      })
    }
  }

  win.once('ready-to-show', () => {
    win && win.show()
  })

  // https://github.com/electron/electron/issues/26726
  win.on('system-context-menu', e => {
    e.preventDefault()
  })

  win.on('closed', () => {
    win = null
  })

  eventInit(win)
  downloadIntercept(win)
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
