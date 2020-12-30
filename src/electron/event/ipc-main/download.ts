import { BrowserWindow, DownloadItem } from 'electron'
import { getUserOS, join } from '@/electron/utils/index'
import { DownloadIpcType } from '../action-types'
import store from '@/electron/store/index'

export const downloadIntercept = (win: BrowserWindow) => {
  win.webContents.session.on(
    'will-download',
    (event, item: DownloadItem, content) => {
      const downloadPath = store.get(
        'downloadPath',
        join(getUserOS().homedir, '/Music')
      )
      const path = join(downloadPath, item.getFilename())
      item.setSavePath(path)
      win.webContents.send(DownloadIpcType.DOWNLOAD_START, {
        name: item.getFilename(),
        state: 'start'
      })
      item.on('updated', (event, state) => {
        if (state === 'progressing') {
          if (win.isDestroyed()) {
            return
          }
          const receive = item.getReceivedBytes()
          const total = item.getTotalBytes()
          const schedule = Number((receive / total).toFixed(2))
          win.webContents.send(DownloadIpcType.DOWNLOAD_PROGRESS, {
            state: state,
            name: item.getFilename(),
            receive,
            total,
            schedule
          })
          if (schedule) {
            win.setProgressBar(schedule)
          }
        } else {
          console.warn('Dwonload Error:', item.getFilename(), state)
        }
      })
      item.once('done', (event, state) => {
        win.webContents.send(DownloadIpcType.DOWNLOAD_END, {
          state: state,
          name: item.getFilename(),
          receive: item.getReceivedBytes(),
          total: item.getTotalBytes()
        })
        if (state === 'completed') {
          if (process.platform === 'darwin') {
            //
          }
          win.setProgressBar(-1)

          // Set the song comment after the download is complete
        }
      })
    }
  )
}
