import Axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { getNodeEnv, syncToAsync, on, isElectron } from '@/utils/index'
import { asyncIpc } from '@/electron/event/ipc-browser'
import { Service } from '@/electron/event/action-types'
import { message } from 'ant-design-vue'
import { use } from './interceptors/index'

interface HttpConfig extends AxiosRequestConfig {
  retry?: boolean
  auths?: boolean
}

// https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/guide.html#serve-command
// The electron build process is in development mode
const { VUE_APP_BUILD_BASE_URL, VUE_APP_CI_BASE_URL } = import.meta.env

const isDevelopment = getNodeEnv() === 'development'

const baseURL = isDevelopment
  ? ''
  : VUE_APP_CI_BASE_URL || VUE_APP_BUILD_BASE_URL

const http: AxiosInstance = Axios.create({
  withCredentials: true,
  baseURL: baseURL,
  timeout: 30000
})

if (!isDevelopment && isElectron) {
  asyncIpc().then(v => {
    const port = v.sendSyncIpcRendererEvent(Service.GET_PORT)
    if (!port) {
      message.warning('发生错误，请联系 linkorgs@163.com ')
    } else {
      http.defaults.baseURL = 'http://localhost:' + port
    }
  })
}

http.defaults.params = {}

use(http)

export function get<T>(
  url: string,
  params?: unknown,
  options?: HttpConfig
): Promise<T> {
  return http.get(url, {
    params,
    ...options
  })
  // .catch(e => {
  //   console.error(e)
  //   return e
  // })
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
  // .catch(e => {
  //   console.error(e)
  //   return e
  // })
}

export default http
