import { AxiosInstance } from 'axios'
import { getNodeEnv, isElectron } from '@/utils/index'

const isDevelopment = getNodeEnv() === 'development'

export default function (http: AxiosInstance) {
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

  http.interceptors.request.use(config => {
    config.params.timestampAxios = Date.now()
    if (!isDevelopment && isElectron) {
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
  })
  http.interceptors.response.use(response => {
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
  })
}
