import { app } from 'electron'
import { join } from 'path'

export const resolveFile = (filePath: string) =>
  join(app.getAppPath(), 'dist-electron', filePath)

export const resolveFileUrl = (filePath: string) =>
  `file://${resolveFile(filePath)}`

export const PreloadPath = resolveFile('preload/index.js')
export const LyricsPathUrl = resolveFileUrl('/renderer/lyrics.html')
export const AppPath = resolveFileUrl('/renderer/index.html')

export const isDevelopment = process.env.NODE_ENV_ELECTRON_VITE !== 'production'
