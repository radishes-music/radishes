/* eslint-disable @typescript-eslint/no-unused-vars */
import { BrowserWindow, DownloadItem, ipcMain, net } from 'electron'
import { getUserOS, join, homedir } from '@/electron/utils/index'
import { DownloadIpcType } from '../action-types'
import { writeFile } from 'fs'
import { DownloadData } from '../../preload/ipc'
import { writeBufferID3 } from '@/tag/ID3Writer'

import store from '@/electron/store/index'
import { errorMain, infoMain } from '@/electron/utils/log'

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
  infoMain('Download start.', name)
}

const downloadProgress = ({
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
  win.setProgressBar(schedule)
}

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
  infoMain('Download end', name)
  win.setProgressBar(-1)
}

const renderCover = (url: string): Promise<Buffer> => {
  return new Promise(resolve => {
    const request = net.request(url)
    request.on('response', response => {
      const chunks: Buffer[] = []
      response.on('data', chunk => {
        chunks.push(chunk)
      })
      response.on('end', () => {
        const buffer = Buffer.concat(chunks)
        resolve(buffer)
      })
    })
    request.end()
  })
}

const nodeDownload = async (
  downloadPath: string,
  win: BrowserWindow,
  { name, url, suffix, al, ar, pic, arArr, id }: { [x: string]: string }
) => {
  const request = net.request(url)
  request.on('response', response => {
    downloadStart({
      win,
      name
    })
    const totalBytes = parseInt(response.headers['content-length'] as string)
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
    response.on('end', async () => {
      const buffer = Buffer.concat(chunks)

      let suffixName = ''
      // eslint-disable-next-line no-useless-escape
      const match_result = url.match(/\.[^\.]+$/)
      if (match_result) {
        const suffixStr = match_result[0]
        if (['.mp3', '.flac'].includes(suffixStr)) {
          suffixName = suffixStr
        } else {
          suffixName = suffix
        }
      }

      const path = join(downloadPath, name + suffixName)
      const comm = Buffer.from(String(id)).toString('base64')
      const { renderBuffer, addTag } = writeBufferID3(buffer)
      addTag('TIT2', name)
      addTag('TALB', al)
      addTag('TPE2', ar)
      addTag('TPE1', arArr.split(';'))
      addTag('COMM', {
        description: '',
        text: comm,
        language: 'eng'
      })
      // The cover image is too large, which will cause the application to start slowly, so the display of the cover page when offline is temporarily not supported.
      // addTag('APIC', {
      //   type: 3,
      //   data: await renderCover(pic),
      //   description: 'Cover (front)',
      //   useUnicodeEncoding: false
      // })
      const newBuf = Buffer.from(renderBuffer())
      writeFile(path, newBuf, err => {
        if (err) {
          errorMain('Download Error:', err)
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

const electronDownload = (
  downloadPath: string,
  win: BrowserWindow,
  item: DownloadItem
) => {
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
}

export const downloadIntercept = (win: BrowserWindow) => {
  const home = getUserOS().homedir
  const defaultPath = join(home, '/Downloads')
  ipcMain.on(DownloadIpcType.DOWNLOAD_TASK, async (event, arg) => {
    const downloadPath = store.get('downloadPath') || defaultPath
    infoMain('Home dir:', home)
    infoMain('Download Default Path:', defaultPath)
    infoMain('Download Real Path:', downloadPath)
    nodeDownload(downloadPath, win, arg)
  })

  win.webContents.session.on('will-download', (event, item: DownloadItem) => {
    const downloadPath = store.get('downloadPath') || defaultPath
    electronDownload(downloadPath, win, item)
  })
}
