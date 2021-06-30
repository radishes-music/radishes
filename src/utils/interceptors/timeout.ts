import { AxiosInstance } from 'axios'
import { message } from 'ant-design-vue'

export default function(http: AxiosInstance) {
  http.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 408 || error.code === 'ECONNABORTED') {
        message.error(
          j18n.load('src__utils__interceptors__timeout___8', error.config.url),
          5
        )
      }
      return Promise.reject(error)
    }
  )
}
