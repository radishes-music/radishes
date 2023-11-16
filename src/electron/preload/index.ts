import { ipcRenderer } from 'electron'

// @ts-expect-error
window.ipcRenderer = ipcRenderer
