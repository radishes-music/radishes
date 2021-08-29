import { app, protocol, BrowserWindow, screen, globalShortcut } from 'electron'
import { autoUpdater } from 'electron-updater'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension from 'electron-devtools-installer'
import { eventInit } from '@/electron/event/index'
import { downloadIntercept } from './event/ipc-main/download'
import { runService } from './service/index'
import { errorMain, infoMain, warnMain } from './utils/log'
import { ThenArg } from '@/interface'
import store from '@/electron/store/index'
import path from 'path'

// curl -H "Accept: application/json" https://api.github.com/repos/Linkontoask/radishes/contents/package.json
const isDevelopment = process.env.VUE_APP_NODE_ENV !== 'production'

let win: BrowserWindow | null,
  loadingWin: BrowserWindow | null,
  serviceInstance: ThenArg<ReturnType<typeof runService>>

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'app',
    privileges: { secure: true, standard: true }
  }
])

async function createLoadingWindow() {
  loadingWin = new BrowserWindow({
    width: 620,
    height: 320,
    frame: false,
    resizable: false,
    titleBarStyle: 'hidden'
  })
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await loadingWin.loadURL(
      (process.env.WEBPACK_DEV_SERVER_URL as string) + '/loading.html'
    )
  } else {
    loadingWin
      .loadFile('./loading.html')
      .then(() => {
        infoMain('Load loading.html')
      })
      .catch(e => {
        errorMain('Load not loading.html', e.toString())
      })
  }
}

async function createWindow() {
  const { workAreaSize, scaleFactor } = screen.getPrimaryDisplay()
  const { width, height } = workAreaSize
  const [w, h] = [width / 2, height / 1.4]
  infoMain(`Display w: ${w} h: ${h}`)
  // Create the browser window.
  win = new BrowserWindow({
    width: w,
    height: h,
    minWidth: w / 1.4,
    minHeight: h / 1.4,
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
      // https://github.com/electron/electron/issues/23506
      contextIsolation: false,
      // This may bring some security issues, but our resources come from the Internet, and the CORS policy is forbidden to play the corresponding resources
      webSecurity: false,
      // https://github.com/electron/electron/issues/9920
      // preload: __dirname + '/electron/preload/index.js'
      enableRemoteModule: true,
      devTools: isDevelopment
    }
  })

  infoMain('Webpack dev server url ', process.env.WEBPACK_DEV_SERVER_URL)
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    try {
      createProtocol('app')
    } catch (e) {
      warnMain(e)
    }
    // Load the index.html when not in development
    win
      .loadURL('app://./index.html')
      .then(() => {
        infoMain('Load index.html')
      })
      .catch(e => {
        errorMain('Load not index.html', e.toString())
      })
    const upgrade = store.get('upgrade')
    if (upgrade) {
      autoUpdater.checkForUpdatesAndNotify({
        title: 'Radishes 通知',
        body: '发现有新版本，快更新体验吧！'
      })
    }
  }

  win.once('ready-to-show', () => {
    infoMain('Event ready-to-show')
    loadingWin && loadingWin.close()
    win && win.show()
  })

  // https://github.com/electron/electron/issues/26726
  win.on('system-context-menu', e => {
    e.preventDefault()
  })

  win.on('closed', () => {
    infoMain('Event closed')
    win = null
  })

  eventInit(win)
  downloadIntercept(win)
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  infoMain('Event window-all-closed')
  const killed = serviceInstance.service.kill('SIGINT')
  infoMain(`service kill ${killed ? 'success' : 'fail'}`)
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  infoMain('Event activate')
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  } else {
    win.show()
  }
})

app.on('ready', async () => {
  infoMain('Event ready')
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension({
        id: 'ljjemllljcmogpfapbkkighbhhppjdbg', // vue3 devtool id
        electron: '>=1.2.1'
      })
      infoMain('Install extension')
    } catch (e) {
      errorMain('Vue Devtools failed to install:', e.toString())
    }
  }
  if (!isDevelopment) {
    globalShortcut.register('Control+Shift+I', () => {
      infoMain('Disabled Control+Shift+I')
      return false
    })
  }

  createLoadingWindow()

  runService()
    .then(service => {
      serviceInstance = service
      store.set('servicePort', service.port)
      infoMain('Service is running', service.port)
      createWindow()
    })
    .catch(e => {
      errorMain('Service is not running', e.toString())
    })
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
