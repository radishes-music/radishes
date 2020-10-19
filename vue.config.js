module.exports = {
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
    config.plugin('html').tap(args => {
      args[0].title = 'music'
      return args
    })
    config.module
      .rule('images')
      .test(/.otf|ttf|png|jpg|gif$/)
      .use('url-loader')
    config.resolve.extensions.add('less').add('css')
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {}
    }
  }
}
