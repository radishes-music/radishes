import { contextBridge, ipcRenderer } from 'electron'
import remote from '@electron/remote'
import os from 'os'
import path from 'path'
import { SongsDetail } from '@/interface'
import { isElectron } from '@/utils'
import { ICommonTagsResult, parseFile } from 'music-metadata'
import { v4 } from 'uuid'
import fs from 'fs'
// import { infoMain, warnMain, errorMain } from '../utils/log'

export const getMp3Tags = async (
  path: string,
  file: string
): Promise<LocalSongsDetail> => {
  const map: Record<string, string> = {
    album: 'al',
    artist: 'ar',
    title: 'name'
  }
  const stat = fs.statSync(path)
  const tag = await parseFile(path, {
    duration: true
  })
  const duration = tag.format.duration
  const size = stat.size
  const dlt = stat.birthtime.getTime()
  const info = [
    'album',
    'artist',
    'artists',
    'genre',
    'title',
    'year',
    'comment',
    'lyrics',
    'picture'
  ].reduce((result: any, current) => {
    let key = current
    if (map[key]) {
      key = map[key]
    }
    const value = tag.common[current as keyof ICommonTagsResult]
    if (value) {
      result[key] = value
    }
    return result
  }, {})

  if (!info.name) {
    info.name = file.replace(/\.mp3$/, '')
  }
  if (info.comment) {
    info.id = info.comment[0]
  } else {
    info.id = v4()
  }

  return {
    ...info,
    duration,
    size,
    dlt,
    path
  }
}

type LocalSongsDetail = Pick<SongsDetail, 'al' | 'ar' | 'name'>
export const readPathMusic = async (abPath: string[]) => {
  const { join } = path
  if (isElectron) {
    const fls: LocalSongsDetail[] = []
    for (let i = 0; i < abPath.length; i++) {
      const files = fs.readdirSync(abPath[i]).filter(mp3 => /\.mp3$/.test(mp3))
      for (let j = 0; j < files.length; j++) {
        const file = files[j]
        const path = join(abPath[i], file)
        const mp3 = await getMp3Tags(path, file)
        fls.push(mp3)
      }
    }

    return fls
  }
  return null
}

contextBridge.exposeInMainWorld('ipcRenderer', {
  ...ipcRenderer,
  on: ipcRenderer.on,
  once: ipcRenderer.once
})

contextBridge.exposeInMainWorld('shell', {
  ...remote.shell
})

contextBridge.exposeInMainWorld('process', {
  ...JSON.parse(JSON.stringify(process))
})

contextBridge.exposeInMainWorld('electronAPI', {
  isMaximized: (cb: any) => {
    const win = remote.BrowserWindow.getFocusedWindow()
    if (win) {
      cb(win.isMaximized())
    }
  },
  os,
  path,
  readPathMusic
  // log: infoMain,
  // warn: warnMain,
  // error: errorMain,
})

contextBridge.exposeInMainWorld('os', os)

// contextBridge.exposeInMainWorld('__dirname', __dirname)
