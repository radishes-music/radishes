import Axios, { AxiosInstance } from 'axios'
import { HttpGet, HttpPost } from '@/interface'

const http: AxiosInstance = Axios.create({
  timeout: 5000
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

export const get = (url: string, params?: unknown): Promise<HttpGet> =>
  http.get(url, {
    params
  })

export const post = (url: string, data?: unknown): Promise<HttpPost> =>
  http.post(url, {
    data
  })

export default http
