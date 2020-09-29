import Axios, { AxiosInstance } from 'axios'
import { HttpGet, HttpPost } from '@/interface'

const http: AxiosInstance = Axios.create()

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
    return response
  },
  error => {
    return Promise.reject(error)
  }
)

export const get = (url: string, params?: any): Promise<HttpGet> =>
  http.get(url, {
    params
  })

export const post = (url: string, data?: any): Promise<HttpPost> =>
  http.post(url, {
    data
  })

export default http
