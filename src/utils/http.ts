import Axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { Platform } from '@/config/build'

// https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/guide.html#serve-command
// The electron build process is in development mode
const {
  VUE_APP_PLATFORM,
  VUE_APP_BUILD_BASE_URL,
  VUE_APP_NODE_ENV
} = process.env

const isDevelopment = VUE_APP_NODE_ENV === 'development'

const baseURL =
  VUE_APP_PLATFORM === Platform.ELECTRON
    ? isDevelopment
      ? ''
      : VUE_APP_BUILD_BASE_URL
    : ''

const http: AxiosInstance = Axios.create({
  baseURL: baseURL,
  timeout: 20000
})

http.interceptors.request.use(
  config => {
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
    return Promise.reject(error)
  }
)

export function get<T>(
  url: string,
  params?: unknown,
  options?: AxiosRequestConfig
): Promise<T> {
  return http.get(url, {
    params,
    ...options
  })
}

export function post<T>(url: string, data?: unknown): Promise<T> {
  return http.post(url, {
    data
  })
}

export default http
