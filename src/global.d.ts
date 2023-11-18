/// <reference path="node_modules/electron/electron.d.ts">

import { IpcRenderer, Shell } from 'electron'
import Os from 'node:os'
import Path from 'node:path'

declare global {
  declare const __filenamespace: string
  declare const __APP_VERSION__: string
  declare const __GIT_URL__: string

  declare const ipcRenderer: IpcRenderer
  declare const shell: Shell
  declare const electronAPI: {
    isMaximized: (cb: any) => any
    os: typeof Os
    path: typeof Path
    readPathMusic: any
    error(message?: any, ...optionalParams: any[]): void
    info(message?: any, ...optionalParams: any[]): void
    warn(message?: any, ...optionalParams: any[]): void
  }
  declare const process: promises
}

declare module '*.png'
declare module '*.md'
