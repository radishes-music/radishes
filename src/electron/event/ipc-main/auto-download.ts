import { BrowserWindow } from 'electron'
import {
  autoUpdater,
  UpdateDownloadedEvent,
  UpdateInfo
} from 'electron-updater'
import { AutoDownload } from '../action-types'
import pgk from '../../../../package.json'
import log from 'electron-log'
import { infoMain, warnMain } from '@/electron/utils/log'

export interface AutoUpdateContent {
  [AutoDownload.VERSION]: UpdateInfo & { url: string }
  [AutoDownload.DOWNLOAD_SUCCESS]: UpdateDownloadedEvent & { url: string }
  [AutoDownload.NOT_VERSION]: UpdateInfo
  [AutoDownload.ERROR]: string
  [AutoDownload.PROGRESS]: number
  [AutoDownload.MESSAGE]: unknown
}

export default (win: BrowserWindow) => {
  autoUpdater.logger = log
  // @ts-ignore
  autoUpdater.logger.transports.file.level = 'info'

  infoMain('App starting...')

  function sendStatusToWindow<T extends keyof AutoUpdateContent>(
    type: T,
    content?: AutoUpdateContent[T]
  ) {
    infoMain('[Updater]:', type, content)
    try {
      win.webContents.send(AutoDownload.MESSAGE, type, content)
    } catch (e) {
      warnMain(e)
    }
  }

  autoUpdater.on('update-available', info => {
    // Inject into subsequent hooks
    info.url = `${pgk.repository.url.replace(/\.git$/, '')}/releases/tag/v${
      info.version
    }`
    sendStatusToWindow(AutoDownload.VERSION, info)
  })
  autoUpdater.on('update-not-available', info => {
    infoMain('[Updater]:', 'update-not-available', info.version)
    sendStatusToWindow(AutoDownload.NOT_VERSION)
  })
  autoUpdater.on('error', err => {
    sendStatusToWindow(AutoDownload.ERROR, 'Error in auto-updater. ' + err)
  })
  autoUpdater.on('download-progress', progressObj => {
    let logMessage = 'Download speed: ' + progressObj.bytesPerSecond
    logMessage = logMessage + ' - Downloaded ' + progressObj.percent + '%'
    logMessage =
      logMessage +
      ' (' +
      progressObj.transferred +
      '/' +
      progressObj.total +
      ')'
    infoMain(logMessage)
    sendStatusToWindow(AutoDownload.PROGRESS, progressObj.percent)
  })
  autoUpdater.on('update-downloaded', info => {
    sendStatusToWindow(AutoDownload.DOWNLOAD_SUCCESS, info)
    // autoUpdater.quitAndInstall()
  })
}
