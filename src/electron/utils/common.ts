import { SongsDetail } from '@/interface'
import { shell } from 'electron'
import { join } from 'path'
import { v4 } from 'uuid'
import { parseFile } from 'music-metadata'
import { ICommonTagsResult } from 'music-metadata/lib/type.d'

export { join }

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

export const openExplorer = (path: string) => {
  shell.openExternal(path)
}

type LocalSongsDetail = Pick<SongsDetail, 'al' | 'ar' | 'name'>

export const getMp3Tags = async (
  path: string,
  file: string
): Promise<LocalSongsDetail> => {
  const map: Record<string, string> = {
    album: 'al',
    artist: 'ar',
    title: 'name'
  }
  const stat = (await import('fs')).statSync(path)
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

export const readPathMusic = async (abPath: string[]) => {
  if (isElectron()) {
    const fls: LocalSongsDetail[] = []
    for (let i = 0; i < abPath.length; i++) {
      const files = (await import('fs'))
        .readdirSync(abPath[i])
        .filter(mp3 => /\.mp3$/.test(mp3))
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
