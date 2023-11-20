const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')
const chalk = require('chalk')

const app = express()

const options = {
  target: 'http://localhost:3000',
  pathRewrite: {
    '^/api': ''
  }
}

const apiProxy = createProxyMiddleware('/api', options)

app.use('/api', apiProxy)
app.listen(3001)

console.log(chalk.green('listen 3001'))
