import Axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { getNodeEnv, syncToAsync, on, isElectron } from '@/utils/index'
import { asyncIpc } from '@/electron/event/ipc-browser'
import { Service } from '@/electron/event/action-types'
import { message } from 'ant-design-vue'
import store from '@/store/index'

interface HttpConfig extends AxiosRequestConfig {
  retry?: boolean
  auths?: boolean
}

// https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/guide.html#serve-command
// The electron build process is in development mode
const { VUE_APP_BUILD_BASE_URL, VUE_APP_CI_BASE_URL } = process.env

const isDevelopment = getNodeEnv() === 'development'

const baseURL = isDevelopment
  ? ''
  : VUE_APP_CI_BASE_URL || VUE_APP_BUILD_BASE_URL

const http: AxiosInstance = Axios.create({
  withCredentials: true,
  baseURL: baseURL,
  timeout: 20000
})

if (!isDevelopment && isElectron()) {
  asyncIpc().then(v => {
    const port = v.sendSyncIpcRendererEvent(Service.GET_PORT)
    if (!port) {
      message.warning('发生错误，请联系 linkorgs@163.com ')
    } else {
      http.defaults.baseURL = 'http://localhost:' + port
    }
  })
}

const watchPort = (): Promise<string> => {
  return new Promise(resolve => {
    const cb = () => {
      if (http.defaults.baseURL?.includes('http://localhost:')) {
        resolve(http.defaults.baseURL)
      } else {
        requestAnimationFrame(cb)
      }
    }
    cb()
  })
}

http.defaults.params = {}
http.interceptors.request.use(
  config => {
    config.params.timestampAxios = Date.now()
    if (!isDevelopment && isElectron()) {
      if (config.url) {
        config.url = config.url.replace(/^\/api/, '')
      }
      if (!config.baseURL?.includes('http://localhost:')) {
        return watchPort().then(url => {
          config.baseURL = url
          return config
        })
      }
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

http.interceptors.response.use(
  response => {
    if (response.status === 200) {
      if (response.data.code) {
        if (response.data.code !== 200) {
          throw new Error(`HttpErrorCode:${response.data.code}`)
        } else {
          delete response.data.code
        }
      }
      return response.data
    }
    return response
  },
  error => {
    const config = error.response?.config as HttpConfig
    if (error.response) {
      if (error.response.status === 301 && config?.auths) {
        if (store.getters[`Auth/isLogin`]) {
          store.commit('Auth/LOGOUT')
        }
        store.commit('Auth/SHOW_VIEW')
        return syncToAsync(resolve => {
          on(
            window,
            'popstate',
            () => {
              http.request(config).then(resolve)
            },
            { once: true }
          )
        })
      }
    }

    return Promise.reject(error)
  }
)

export function get<T>(
  url: string,
  params?: unknown,
  options?: HttpConfig
): Promise<T> {
  return http.get(url, {
    params,
    ...options
  })
}

export function post<T>(
  url: string,
  data?: unknown,
  options?: HttpConfig
): Promise<T> {
  return http.post(url, {
    data,
    ...options
  })
}

export default http
