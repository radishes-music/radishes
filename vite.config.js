import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vitePluginMd2Vue from 'vite-plugin-md2vue'
import usePluginImport from 'vite-plugin-importer'
import { antdDayjs } from 'antd-dayjs-vite-plugin'

import pkg from './package.json'

const resolvePath = (depPath) => path.resolve(__dirname, depPath)

export const __VITE_RESOLVE__ = {
  alias: {
    '@': resolvePath('./src'),
    '@/pages': resolvePath('./src/pages'),
    '@/utils': resolvePath('./src/utils'),
    '@/theme': resolvePath('./src/theme'),
    '@/interface': resolvePath('./src/interface'),
    '@/components-global': resolvePath('./src/components-global'),
    '@/components': resolvePath('./src/components'),
    '@/electron': resolvePath('./src/electron'),
    '@/hooks': resolvePath('./src/hooks'),
    '@/layout': resolvePath('./src/layout'),
    '@/store': resolvePath('./src/store'),
    '@/helpers': resolvePath('./src/helpers'),
    '@/modules': resolvePath('./src/modules'),
    root: resolvePath('./src/../'),
    '~@': resolvePath('./src'),
    '~@vant': resolvePath('./node_modules/@vant'),
  },
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VUE_APP')

  const isWeb = env.VUE_APP_PLATFORM === 'browser'

  return {
    root: '.',
    envPrefix: 'VUE_APP_',
    define: {
      __APP_VERSION__: `'${pkg.version}'`,
      __GIT_URL__: `'${pkg.repository.url}'`,
    },
    esbuild: {
      jsxFactory: 'h',
      jsxFragment: 'Fragment',
      jsxInject: `import {h} from 'vue'`,
      include: 'vue',
    },
    build: {
      rollupOptions: {
        input: 'index.html',
      },
    },
    server: {
      open: isWeb,
      host: true,
      port: 3000,
      proxy: {
        '/api': {
          target: 'http://localhost:32768',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
    },
    plugins: [
      vue(),
      vitePluginMd2Vue(),
      vueJsx(),
      usePluginImport({
        libraryName: 'ant-design-vue',
        libraryDirectory: 'es',
        style: 'css',
      }),
      usePluginImport({
        libraryName: 'vant',
        libraryDirectory: 'es',
        style: (name) => `${name}/style/less`,
      }),
      antdDayjs(),
    ],
    resolve: __VITE_RESOLVE__,
  }
})
