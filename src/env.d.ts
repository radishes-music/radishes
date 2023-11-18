/// <reference types="vite/client" />
/// <reference types="electron-vite/node" />

interface ImportMetaEnv {
  readonly VUE_APP_PLATFORM: 'browser' | 'electron'
  readonly VUE_APP_BUILD_BASE_URL: string
  readonly VUE_APP_NODE_ENV: 'production' | 'development'
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
