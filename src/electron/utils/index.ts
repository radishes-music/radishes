// runtime electron

import { userInfo } from 'os'
export { normalize, join } from 'path'
export * from 'fs'
export { homedir } from 'os'

export const getAppPath = () => {
  return __dirname || import.meta.env.PORTABLE_EXECUTABLE_DIR
}

export const getUserOS = () => {
  return userInfo()
}
