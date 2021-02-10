import Axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { getNodeEnv, syncToAsync, on } from '@/utils/index'
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

http.defaults.params = {}

http.interceptors.request.use(
  config => {
    config.params.timestampAxios = Date.now()
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

http.interceptors.response.use(
  response => {
    if (response.status === 200) {
      return response.data
    }
    return response
  },
  error => {
    const config = error.response?.config as HttpConfig
    if (error.response) {
      if (error.response.status === 301 && config?.auths) {
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
