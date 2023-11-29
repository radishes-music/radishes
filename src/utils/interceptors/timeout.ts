import { AxiosInstance } from 'axios'
import { message } from 'ant-design-vue'

export default function (http: AxiosInstance) {
  http.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 408 || error.code === 'ECONNABORTED') {
        message.error(`请求超时，请重试。url: ${error.config.url}`, 5)
      }
      return Promise.reject(error)
    }
  )
}
