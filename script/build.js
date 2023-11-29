const spawn = require('cross-spawn')
const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const rimraf = require('rimraf')

const root = path.resolve(__dirname, '../')
const serviceRoot = path.join(root, 'public/service')
const serviceCode = path.join(root, 'packages/api')

const handleSpawn = (command, argv) => {
  return new Promise((resolve, reject) => {
    const childProcess = spawn(command, argv, {
      cwd: root,
      stdio: 'inherit'
    })
      .on('exit', code => {
        if (code === 0) {
          resolve(childProcess)
        } else {
          console.log('exit:', chalk.red(code))
        }
      })
      .on('error', e => {
        reject(e, childProcess)
      })
  })
}

const removeDir = dir => {
  return new Promise((resolve, reject) => {
    rimraf(path.join(root, dir), err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

const buildService = () => {
  const apiPkg = require(path.join(serviceCode, 'package.json'))
  const apiVersion = apiPkg.version

  try {
    fs.statSync(serviceRoot)
  } catch (e) {
    fs.mkdirSync(serviceRoot)
  }

  const serviceFilenames = fs.readdirSync(serviceRoot)
  const historyVersion = serviceFilenames.find(name => /^(\d|\.)+$/.test(name))

  console.log(historyVersion, apiVersion)
  if (historyVersion !== apiVersion) {
    return removeDir('public/service').then(() => {
      return handleSpawn('yarn', ['build:api']).then(() => {
        fs.openSync(path.join(serviceRoot, apiVersion), 'w')
      })
    })
  }
}

const buildElectron = () => {
  // const argv = process.argv
  // const platform = argv[2]
  return handleSpawn('yarn', ['pkg'])
}

const run = async () => {
  try {
    await removeDir('dist-electron')
    await buildService()
    await buildElectron()
  } catch (e) {
    console.log(chalk.red(e))
  }
}

run()

module.exports = run
