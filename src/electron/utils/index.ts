// runtime electron

import { userInfo } from 'os'
import { normalize, join } from 'path'
export * from 'fs'
export { homedir } from 'os'
import { app } from 'electron'

export { normalize, join }

export const getAppPath = () => {
  return __dirname || import.meta.env.PORTABLE_EXECUTABLE_DIR
}

export const getUserOS = () => {
  return userInfo()
}

export const resolveFile = (filePath: string) =>
  join(app.getAppPath(), 'dist-electron', filePath)

export const resolveFileUrl = (filePath: string) =>
  `file://${resolveFile(filePath)}`

export const PreloadPath = resolveFile('preload/index.js')
export const LyricsPathUrl = resolveFileUrl('/renderer/lyrics.html')
export const AppPath = resolveFileUrl('/renderer/index.html')
