import log from 'electron-log'
import path from 'path'

const execPath =
  path.dirname(process.execPath) ||
  (process.env.PORTABLE_EXECUTABLE_DIR as string)

export enum LogInfoType {
  MAIN = '[Main]：',
  MAIN_ERROR = '[Main Error]：',
  MAIN_WARN = '[Main Warn]：'
}

log.transports.file.resolvePath = () => path.join(execPath, 'logs/main.log')

export const infoMain = (...args: unknown[]) => {
  log.info(LogInfoType.MAIN, ...args)
}

export const errorMain = (...args: unknown[]) => {
  log.error(LogInfoType.MAIN_ERROR, ...args)
}

export const warnMain = (...args: unknown[]) => {
  log.warn(LogInfoType.MAIN_WARN, ...args)
}

Object.assign(console, log.functions)

export default log
