import portscanner from 'portscanner'
import childProcess from 'child_process'
import path from 'path'
import { errorMain, warnMain } from '../utils/log'

const PORT = [1 << 15, (1 << 16) - 1]

export const findPort = () => {
  const [min, max] = PORT
  return portscanner.findAPortNotInUse(min, max, '127.0.0.1')
}

export const runService = () => {
  return findPort().then(n => {
    const filename =
      process.platform === 'win32' ? 'netease-api.exe' : 'netease-api'
    const port = String(n)
    const cwd = path.resolve(__dirname, '../../public/service')
    const service = childProcess.exec(filename, {
      cwd: cwd,
      env: {
        PORT: port
      }
    })
    service.on('error', err => {
      errorMain('cwd', cwd, '\nservice err:', err.toString())
    })
    service.on('exit', (code, signal) => {
      warnMain('service exit', code, signal)
    })
    return {
      service,
      port
    }
  })
}
