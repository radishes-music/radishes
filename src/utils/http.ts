import Axios, { AxiosInstance } from 'axios'

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

export function get<T>(url: string, params?: unknown): Promise<T> {
  return http.get(url, {
    params
  })
}

export function post<T>(url: string, data?: unknown): Promise<T> {
  return http.post(url, {
    data
  })
}

export default http
