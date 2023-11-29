export const asyncIpc = () => {
  return Promise.resolve({
    sendAsyncIpcRendererEvent: ipcRenderer.send,
    sendSyncIpcRendererEvent: ipcRenderer.sendSync
  })
}

export const asyncIpcOrigin = () => {
  return Promise.resolve(ipcRenderer)
}

export const asyncShell = () => {
  return Promise.resolve(shell)
}
