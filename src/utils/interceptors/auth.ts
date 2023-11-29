import { AxiosInstance, AxiosRequestConfig } from 'axios'
import { syncToAsync, on } from '@/utils/index'
import store from '@/store/index'

interface HttpConfig extends AxiosRequestConfig {
  retry?: boolean
  auths?: boolean
}

export default function (http: AxiosInstance) {
  http.interceptors.response.use(
    response => {
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
}
