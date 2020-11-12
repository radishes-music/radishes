module.exports = {
  pages: {
    index: {
      entry: 'src/main.ts',
      template: 'public/index.html'
    },
    lyrice: {
      entry: 'src/electron/pages/index.ts',
      template: 'public/index.html'
    }
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  chainWebpack: config => {
    // https://github.com/vuejs/vue-cli/issues/1729#issuecomment-402217659
    config.plugin('html-index').tap(args => {
      args[0].title = 'music'
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
    config.resolve.extensions.add('less').add('css')
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      mainProcessFile: 'src/electron/main.ts',
      outputDir: 'dist-electron'
    }
  }
}
