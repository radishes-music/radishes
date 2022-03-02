const request = require('request')
const CryptoJS = require('crypto-js')
const json = require('./zh-cn.json')

function truncate(q) {
  const len = q.length
  if (len <= 20) return q
  return q.substring(0, 10) + len + q.substring(len - 10, len)
}

const run = v => {
  const appKey = '4b890a8255b97ae0'
  const key = 'E4426hoRNnOeiRiveXtvNvJJQ6I2gnuC'

  const salt = new Date().getTime()
  const curtime = Math.round(new Date().getTime() / 1000)
  // 多个query可以用\n连接  如 query='apple\norange\nbanana\npear'
  const from = 'zh-CHS'
  const to = 'en'
  const str1 = appKey + truncate(v) + salt + curtime + key
  const sign = CryptoJS.SHA256(str1).toString(CryptoJS.enc.Hex)

  return new Promise(resolve => {
    request.post('http://openapi.youdao.com/api', {
      form: {
        q: v,
        appKey: appKey,
        salt: salt,
        from: from,
        to: to,
        sign: sign,
        signType: 'v3',
        curtime: curtime
      },
      callback: (error, res) => {
        const translation = JSON.parse(res.body).translation
        resolve(translation)
      }
    })
  })
}

const v = Object.values(json)

// eslint-disable-next-line prefer-const
let vJson = [],
  tp = ''
v.forEach(item => {
  tp += item + '\n'
  if (tp.length > 4000) {
    vJson.push(tp.slice(0, -1))
    tp = ''
  }
})
vJson.push(tp.slice(0, -1))
;(async function main() {
  const j = []
  while (vJson.length) {
    const json = vJson.shift()
    const data = await run(json)
    const r = data[0].split('\n')
    const zh = json.split('\n').length
    if (r.length !== zh) {
      console.warn('translation error', r.length)
    } else {
      console.log('youdao', r.length, 'zh-cn', zh)
    }
    j.push(r)
  }
  const r = j.flat()

  const rJson = Object.keys(json).reduce((pre, key, index) => {
    pre[key] = r[index]
    return pre
  }, {})

  console.log('rJson', Object.values(rJson).length)
  const source = require('prettier').format(JSON.stringify(rJson), {
    parser: 'json-stringify'
  })
  require('fs').writeFileSync(
    require('path').join(__dirname, 'en.json'),
    source
  )
})()
