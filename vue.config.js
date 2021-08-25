const webpack = require('webpack')
const pkg = require('./package.json')
const path = require('path')
const merge = require('lodash/merge')

const CI = process.env.CI !== 'action'
const md2vue = path.resolve(__dirname, 'packages/md2vue-loader/index.js')

module.exports = {
  publicPath: '/',
  pages: {
    index: {
      entry: 'src/main.ts',
      template: 'public/index.html'
    },
    lyrics: {
      entry: 'src/electron/pages/index.ts',
      template: 'public/index.html'
    }
  },
  devServer: {
    progress: CI,
    proxy: {
      '/api': {
        target: 'http://localhost:32768',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  configureWebpack: {
    plugins: [
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/),
      new webpack.DefinePlugin({
        VERSION: JSON.stringify(pkg.version),
        GIT_URL: JSON.stringify(pkg.repository.url)
      })
    ]
  },
  chainWebpack: config => {
    config.when(process.env.ANALYZER === 'analyzer', config =>
      config
        .plugin('webpack-bundle-analyzer')
        .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
    )

    // https://github.com/vuejs/vue-cli/issues/1729#issuecomment-402217659
    config.plugin('html-index').tap(args => {
      args[0].title = 'radishes music'
      return args
    })

    config.module
      .rule('images')
      .test(/.png|jpg|gif$/)
      .use('url-loader')

    config.module
      .rule('fonts')
      .test(/.otf|ttf$/)
      .use('url-loader')

    config.module
      .rule('md')
      .test(/\.md$/)
      .use('md2vue-loader')
      .loader(md2vue)
      .tap(options => {
        return merge({}, options, { html: true })
      })

    config.resolve.extensions.add('less').add('css')
    config.resolve.alias.set('root', path.join(__dirname))
    config.target(
      process.env.VUE_APP_PLATFORM === 'electron' ? 'electron-renderer' : 'web'
    )
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      mainProcessFile: 'src/electron/main.ts',
      outputDir: 'dist-electron',
      builderOptions: {
        publish: [
          { provider: 'github', owner: 'Linkontoask', repo: 'radishes' }
        ],
        artifactName: pkg.name + '.Setup.' + '${version}.${ext}',
        extraFiles: [
          {
            from: 'public/service',
            to: 'resources/public/service',
            filter: ['**/*']
          }
        ],
        mac: {
          identity: null
        }
      }
    }
  }
}
