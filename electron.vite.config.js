import path from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import WebViteConfig, { __VITE_RESOLVE__ } from './vite.config'

const { resolve } = path

// electron.vite.config.js
export default defineConfig({
  main: {
    envPrefix: 'VUE_APP_',
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/electron/main.ts')
        }
      }
    },
    resolve: __VITE_RESOLVE__,
    plugins: [externalizeDepsPlugin()]
  },

  preload: {
    envPrefix: 'VUE_APP_',
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/electron/preload/index.ts')
        }
      }
    },
    plugins: [externalizeDepsPlugin()],
    resolve: __VITE_RESOLVE__
  },
  renderer: WebViteConfig
})
