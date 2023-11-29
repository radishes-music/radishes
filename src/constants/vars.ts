export const enum Platform {
  BROWSER = 'browser',
  ELECTRON = 'electron'
}

export const isBrowser = import.meta.env.VUE_APP_PLATFORM === Platform.BROWSER

export const isElectron = import.meta.env.VUE_APP_PLATFORM === Platform.ELECTRON
