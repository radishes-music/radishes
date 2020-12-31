import { BrowserWindow, DownloadItem, ipcMain, net } from 'electron'
import { getUserOS, join } from '@/electron/utils/index'
import { DownloadIpcType } from '../action-types'
import { writeFile } from 'fs'
import { DownloadData } from '../../preload/ipc'
import throttle from 'lodash/throttle'
import store from '@/electron/store/index'

interface MainDownloadData extends DownloadData {
  win: BrowserWindow
}

const downloadStart = ({
  win,
  name
}: Pick<MainDownloadData, 'win' | 'name'>) => {
  win.webContents.send(DownloadIpcType.DOWNLOAD_START, {
    state: 'start',
    name
  })
}
const downloadProgress = throttle(
  ({
    win,
    receive,
    total,
    name
  }: Pick<MainDownloadData, 'win' | 'receive' | 'total' | 'name'>) => {
    const schedule = receive / total
    win.webContents.send(DownloadIpcType.DOWNLOAD_PROGRESS, {
      state: 'progressing',
      name: name,
      receive: receive,
      total: total,
      schedule
    })
  },
  200
)

const downloadEnd = ({
  win,
  error,
  name,
  state
}: Pick<MainDownloadData, 'win' | 'error' | 'name' | 'state'>) => {
  win.webContents.send(DownloadIpcType.DOWNLOAD_END, {
    state,
    name,
    error
  })
}

export const downloadIntercept = (win: BrowserWindow) => {
  const downloadPath = store.get(
    'downloadPath',
    join(getUserOS().homedir, '/Downloads')
  )

  ipcMain.on(
    DownloadIpcType.DOWNLOAD_TASK,
    async (event, { name, url, suffix }: { [x: string]: string }) => {
      console.log(url, name, suffix)
      const request = await net.request(url)
      request.on('response', response => {
        downloadStart({
          win,
          name
        })
        console.log(`HEADERS: ${JSON.stringify(response.headers)}`)
        const totalBytes = parseInt(
          response.headers['content-length'] as string
        )
        let receivedBytes = 0
        const chunks: Buffer[] = []
        response.on('data', chunk => {
          chunks.push(chunk)
          receivedBytes += chunk.length
          downloadProgress({
            win,
            name,
            receive: receivedBytes,
            total: totalBytes
          })
        })
        response.on('end', () => {
          const buffer = Buffer.concat(chunks)
          const path = join(downloadPath, name + suffix)
          console.log(path)
          writeFile(path, buffer, err => {
            console.log(err)
            if (err) {
              downloadEnd({
                win,
                name,
                error: err,
                state: 'interrupted'
              })
            } else {
              downloadEnd({
                win,
                name,
                error: err,
                state: 'completed'
              })
            }
          })
        })
      })
      request.end()
    }
  )
  win.webContents.session.on('will-download', (event, item: DownloadItem) => {
    const path = join(downloadPath, item.getFilename())
    item.setSavePath(path)
    const name = item.getFilename()
    downloadStart({
      name,
      win
    })
    const total = item.getTotalBytes()
    item.on('updated', (event, state) => {
      if (state === 'progressing') {
        if (win.isDestroyed()) {
          return
        }
        const receive = item.getReceivedBytes()
        const schedule = receive / total
        downloadProgress({
          win,
          receive,
          total,
          name
        })
        if (schedule) {
          win.setProgressBar(schedule)
        }
      } else {
        downloadEnd({
          win,
          name,
          state,
          error: 'Dwonload Error: ' + name + state
        })
        console.warn('Dwonload Error:', item.getFilename(), state)
      }
    })
    item.once('done', (event, state) => {
      downloadEnd({
        win,
        name,
        state
      })
      if (state === 'completed') {
        if (process.platform === 'darwin') {
          //
        }
        win.setProgressBar(-1)

        // Set the song comment after the download is complete
      }
    })
  })
}
