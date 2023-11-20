import log from 'electron-log'
import path from 'path'

const execPath =
  path.dirname(process.execPath) ||
  (import.meta.env.VUE_APP_PORTABLE_EXECUTABLE_DIR as string)

export enum LogInfoType {
  MAIN = '[Main]',
  MAIN_ERROR = '[Main Error]',
  MAIN_WARN = '[Main Warn]'
}

log.transports.file.resolvePath = () => path.join(execPath, 'logs/main.log')

const format = (arg: unknown) => JSON.stringify(arg)

export const infoMain = (...args: unknown[]) => {
  log.info(...args.map(format))
}

export const errorMain = (...args: unknown[]) => {
  log.error(...args.map(format))
}

export const warnMain = (...args: unknown[]) => {
  log.warn(...args.map(format))
}

Object.assign(console, log.functions)

export default log
