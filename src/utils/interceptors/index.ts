import { AxiosInstance } from 'axios'
import auth from './auth'
import format from './format'
import timeout from './timeout'

export function use(http: AxiosInstance) {
  auth(http)
  format(http)
  timeout(http)
}
