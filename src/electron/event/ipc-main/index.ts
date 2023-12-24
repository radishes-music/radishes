/* eslint-disable @typescript-eslint/no-unused-vars */
import { ipcMain, IpcMainEvent, BrowserWindow, screen, dialog } from 'electron'
import {
  Action,
  MiddlewareView,
  LyricsAction,
  UpdateType,
  DownloadIpcType,
  ReadLocalFile,
  Dialog,
  AutoDownload,
  Service
} from '../action-types'
import { readFileSync } from 'fs'
import { autoUpdater } from 'electron-updater'
import normalizeUrl from 'normalize-url'
import log from 'electron-log'
import store from '@/electron/store/index'
import path from 'path'
import { LyricsPathUrl, PreloadPath } from '@/electron/constants'

export const onIpcMainEvent = (win: BrowserWindow) => {
  let lyrics: null | BrowserWindow
  ipcMain.on(DownloadIpcType.SET_DOWNLOAD_PATH, (event, arg) => {
    store.set('downloadPath', arg)
  })
  ipcMain.on(Action.MINIMIZE_WINDOW, (event: IpcMainEvent) => {
    win.minimize()
  })
  ipcMain.on(Action.MAXIMIZE_WINDOW, (event: IpcMainEvent) => {
    win.maximize()
  })
  ipcMain.on(Action.RESTORE_WINDOW, (event: IpcMainEvent) => {
    win.restore()
  })
  ipcMain.on(Action.CLOSE_WINDOW, (event: IpcMainEvent) => {
    lyrics && lyrics.close()
    win.close()
  })
  ipcMain.on(UpdateType.UPDATE_WIDTH, (event: IpcMainEvent, width: number) => {
    if (lyrics) {
      const screenWidth = screen.getPrimaryDisplay().workAreaSize.width
      lyrics.setSize(Math.min(width + 40, screenWidth), 100)
    }
  })
  ipcMain.on(MiddlewareView.CREATE_WINDOW, (event: IpcMainEvent, arg) => {
    if (lyrics) {
      if (lyrics.isVisible()) {
        lyrics.hide()
      } else {
        lyrics.show()
      }
    } else {
      const { width, height } = screen.getPrimaryDisplay().workAreaSize
      lyrics = new BrowserWindow({
        width: width,
        height: 100,
        x: 0,
        y: height - 100,
        show: false,
        frame: false,
        titleBarStyle: 'hidden',
        transparent: true,
        resizable: false,
        alwaysOnTop: true,
        acceptFirstMouse: true,
        skipTaskbar: false,
        useContentSize: true,
        center: true,
        webPreferences: {
          sandbox: false,
          nodeIntegration: false,
          // enableRemoteModule: true,
          preload: PreloadPath
        }
      })
      require('@electron/remote/main').enable(lyrics.webContents)
      if (process.env.ELECTRON_RENDERER_URL) {
        lyrics.loadURL(
          normalizeUrl(process.env.ELECTRON_RENDERER_URL + '/lyrics.html')
        )
      } else {
        lyrics.loadURL(LyricsPathUrl)
      }
      lyrics.once('ready-to-show', () => {
        if (lyrics) {
          lyrics.show()
          lyrics.webContents.send(LyricsAction.LYRICS_UPDATE_RENDER, {
            type: UpdateType.UPDATE_LYRICS,
            payload: arg
          })
        }
      })
      lyrics.on('close', () => {
        win.webContents.send(LyricsAction.LYRICS_WIN_CLOSE)
      })
      lyrics.on('closed', () => {
        lyrics = null
      })
    }
  })
  ipcMain.on(MiddlewareView.UPDATE_THEME_COLOR, (event, arg) => {
    lyrics && lyrics.webContents.send(MiddlewareView.UPDATE_THEME_COLOR, arg)
  })
  ipcMain.on(
    LyricsAction.LYRICS_UPDATE,
    (
      event: IpcMainEvent,
      arg: {
        type: UpdateType
        payload: unknown
      }
    ) => {
      lyrics && lyrics.webContents.send(LyricsAction.LYRICS_UPDATE_RENDER, arg)
    }
  )
  ipcMain.on(ReadLocalFile.READ_MP3_FROM_PATH, (event, arg: string) => {
    const buffer = readFileSync(arg)
    event.returnValue = buffer
  })
  ipcMain.on(Dialog.SHOW_DIALOG, (event, arg) => {
    dialog
      .showOpenDialog(win, {
        title: '添加文件夹',
        properties: ['openDirectory', 'multiSelections']
      })
      .then(v => {
        event.returnValue = v
      })
  })
  ipcMain.on(AutoDownload.IS_UPGRADE, (e, upgrade) => {
    store.set('upgrade', upgrade)
  })
  ipcMain.on(AutoDownload.CHECK_UPGRADE, e => {
    autoUpdater.checkForUpdates().then((result: any) => {
      win.webContents.send(AutoDownload.CHECK_UPGRADE, {
        version: result.updateInfo.version,
        path: result.updateInfo.path
      })
      log.debug('checkForUpdates', result)
    })
  })
  ipcMain.on(AutoDownload.UPGRADE_NOW, (e, upgrade) => {
    autoUpdater.quitAndInstall()
  })
  ipcMain.on(Service.GET_PORT, e => {
    e.returnValue = store.get('servicePort')
  })
}
