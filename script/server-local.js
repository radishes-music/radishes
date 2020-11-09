const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')

const app = express()

const options = {
  target: 'http://localhost:3001',
  pathRewrite: {
    '^/api': ''
  }
}

const apiProxy = createProxyMiddleware('/api', options)

app.use('/api', apiProxy)
app.listen(3000)

console.log('listen 3000')
