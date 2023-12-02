// runtime electron

import { userInfo } from 'os'
import { normalize, join } from 'path'
export * from 'fs'
export { homedir } from 'os'
import { app } from 'electron'

export { normalize, join }

export const getAppPath = () => {
  return __dirname || import.meta.env.PORTABLE_EXECUTABLE_DIR
}

export const getUserOS = () => {
  return userInfo()
}
