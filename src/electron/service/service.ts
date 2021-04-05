import { app } from 'electron'
import portscanner from 'portscanner'
import childProcess from 'child_process'
import path from 'path'
import log from 'electron-log'

const execPath =
  path.dirname(process.execPath) ||
  (process.env.PORTABLE_EXECUTABLE_DIR as string)
const PORT = [1 << 15, (1 << 16) - 1]

log.transports.file.resolvePath = () => path.join(execPath, 'logs/main.log')

export const findPort = () => {
  const [min, max] = PORT
  return portscanner.findAPortNotInUse(min, max, '127.0.0.1')
}

export const runService = () => {
  return findPort().then(n => {
    let filename = 'api-macos'
    const port = String(n)
    if (process.platform === 'win32') {
      filename = 'api-win.exe'
    }
    if (process.platform === 'linux') {
      filename = 'api-linux'
    }
    const cwd = path.resolve(__dirname, '../public/service')
    const service = childProcess.execFile(filename, {
      cwd: cwd,
      env: {
        PORT: port
      }
    })
    service.on('error', err => {
      log.info('cwd', cwd)
      log.error('service err:', err)
    })
    service.on('exit', (code, signal) => {
      log.warn('service exit', code, signal)
    })
    return {
      service,
      port
    }
  })
}
