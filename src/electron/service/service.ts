import portscanner from 'portscanner'
import childProcess from 'child_process'
import path from 'path'
import { errorMain, infoMain, warnMain } from '../utils/log'

const PORT = [1 << 15, (1 << 16) - 1]

export const findPort = () => {
  const [min, max] = PORT
  return portscanner.findAPortNotInUse(min, max, '127.0.0.1')
}

export const runService = () => {
  return findPort().then((n) => {
    let filename = 'api-macos'
    const port = String(n)
    if (process.platform === 'win32') {
      filename = 'api-win.exe'
    }
    if (process.platform === 'linux') {
      filename = 'api-linux'
    }
    const cwd = path.resolve(__dirname, '../../public/service')
    const service = childProcess.exec(filename, {
      cwd: cwd,
      env: {
        PORT: port,
      },
    })
    service.on('error', (err) => {
      errorMain('cwd', cwd, '\nservice err:', err.toString())
    })
    service.on('exit', (code, signal) => {
      warnMain('service exit', code, signal)
    })
    return {
      service,
      port,
    }
  })
}
