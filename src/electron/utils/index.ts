// runtime electron
/* eslint-disable @typescript-eslint/no-explicit-any */
import { userInfo } from 'os'
import { shell } from 'electron'
import { statSync, readFile } from 'fs'
import { syncToAsync } from '@/utils/index'
import { ShortcutTags } from 'jsmediatags/types/index'
import mediatags from '@/mp3/jsmediatags'
import mp3Duration from 'mp3-duration'
export { readdirSync } from 'fs'
export { normalize, join } from 'path'

export const isElectron = () => {
  if (
    typeof window !== 'undefined' &&
    typeof window.process === 'object' &&
    window.process.type === 'renderer'
  ) {
    return true
  }

  // Main process
  if (
    typeof process !== 'undefined' &&
    typeof process.versions === 'object' &&
    !!process.versions.electron
  ) {
    return true
  }

  // Detect the user agent when the `nodeIntegration` option is set to true
  if (
    typeof navigator === 'object' &&
    typeof navigator.userAgent === 'string' &&
    navigator.userAgent.indexOf('Electron') >= 0
  ) {
    return true
  }

  return false
}

export const getAppPath = () => {
  return __dirname || process.env.PORTABLE_EXECUTABLE_DIR
}

export const getUserOS = () => {
  return userInfo()
}

export const openExplorer = (path: string) => {
  shell.openExternal(path)
}

export const getDuration = (path: string): Promise<number> => {
  return syncToAsync<number>(resolve => {
    mp3Duration(path, (error: unknown, duration: number) => {
      resolve(duration)
    })
  })
}

export const getMp3Tags = (
  path: string
): Promise<ShortcutTags & { size: number }> => {
  return syncToAsync<ShortcutTags & { size: number }>(async resolve => {
    const stat = statSync(path)
    const duration = await getDuration(path)
    readFile(path, async (err, buffer) => {
      new mediatags.Reader(buffer).read({
        onSuccess(tag) {
          const info = [
            'album',
            'artist',
            'genre',
            'title',
            'year',
            'comment',
            'lyrics',
            'track',
            'picture',
            'lyrics'
          ].reduce((a: any, b) => {
            if (tag.tags[b]) {
              a[b] = tag.tags[b]
            }
            return a
          }, {})
          resolve({
            ...info,
            id: info.comment.text,
            size: stat.size,
            duration: duration,
            dlt: stat.birthtime.getTime()
          })
        }
      })
    })
  })
}
