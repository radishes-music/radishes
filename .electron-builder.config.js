/**
 * TODO: Rewrite this config to ESM
 * But currently electron-builder doesn't support ESM configs
 * @see https://github.com/develar/read-config-file/issues/10
 */

/**
 * @type {() => import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */

const pkg = require('./package.json')

module.exports = async function () {
  return {
    productName: pkg.name,
    directories: {
      output: 'dist-electron',
      buildResources: 'buildResources'
    },
    files: [
      'build/icons',
      'dist-electron/preload',
      'dist-electron/main',
      'dist-electron/renderer',
      'package.json'
    ],
    publish: [
      { provider: 'github', owner: 'radishes-music', repo: 'radishes' }
    ],
    extraFiles: [
      {
        from: 'public/service',
        to: 'resources/app/public/service',
        filter: ['**/*']
      }
    ],
    asar: false,
    artifactName: pkg.name + '.Setup.' + '${version}.${ext}',
    mac: {
      identity: null,
      icon: './build/icons/1024x1024.png',
      darkModeSupport: true
    },
    // Specify linux target just for disabling snap compilation
    linux: {
      target: 'deb',
      maintainer: 'radishes@gitub.com',
      vendor: 'radishes@gitub.com'
    }
  }
}
