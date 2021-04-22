import log from 'electron-log'
import path from 'path'

const execPath =
  path.dirname(process.execPath) ||
  (process.env.PORTABLE_EXECUTABLE_DIR as string)

log.transports.file.resolvePath = () => path.join(execPath, 'logs/main.log')

export default log
