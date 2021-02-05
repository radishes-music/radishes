import { BrowserWindow } from 'electron'
import { autoUpdater, UpdateDownloadedEvent } from 'electron-updater'
import { AutoDownload } from '../action-types'
import pgk from '../../../../package.json'
import log from 'electron-log'

export interface AutoUpdateContent {
  [AutoDownload.VERSION]: {
    url: string
    version: string
  }
  [AutoDownload.NOT_VERSION]: unknown
  [AutoDownload.DOWNLOAD_SUCCESS]: UpdateDownloadedEvent
  [AutoDownload.ERROR]: string
  [AutoDownload.PROGRESS]: number
  [AutoDownload.MESSAGE]: unknown
}

export default (win: BrowserWindow) => {
  autoUpdater.logger = log
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  autoUpdater.logger.transports.file.level = 'info'
  log.info('App starting...')

  function sendStatusToWindow<T extends keyof AutoUpdateContent>(
    type: T,
    content: AutoUpdateContent[T]
  ) {
    log.info(type, content)
    win.webContents.send(AutoDownload.MESSAGE, type, content)
  }

  autoUpdater.on('update-available', info => {
    info.url = `${pgk.repository.url.replace(/\.git$/, '')}/releases/tag/v${
      info.version
    }`
    sendStatusToWindow(AutoDownload.VERSION, info)
  })
  autoUpdater.on('update-not-available', info => {
    log.info('update-not-available', info)
    sendStatusToWindow(AutoDownload.NOT_VERSION, info)
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
    log.info(logMessage)
    sendStatusToWindow(AutoDownload.PROGRESS, progressObj.percent)
  })
  autoUpdater.on('update-downloaded', info => {
    sendStatusToWindow(AutoDownload.DOWNLOAD_SUCCESS, info)
    // autoUpdater.quitAndInstall()
  })
}
