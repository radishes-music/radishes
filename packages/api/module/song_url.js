// 歌曲链接

// 从 packages/unblock 中解析网易云音乐ID的播放链接，突破灰色歌曲限制
const match = require('@radishes/unblock')
const crypto = require('crypto')
const { cookieToJson } = require('../util/index')

const find = (id) => {
  return match(id)
    .then((url) => {
      return url.url
    })
    .catch((e) => {
      return ''
    })
}

module.exports = (query, request) => {
  if (typeof query.cookie === 'string') {
    query.cookie = cookieToJson(query.cookie)
  }
  if (!('MUSIC_U' in query.cookie))
    query.cookie._ntes_nuid = crypto.randomBytes(16).toString('hex')
  query.cookie.os = 'pc'
  const data = {
    ids: '[' + query.id + ']',
    br: parseInt(query.br || 999000),
  }
  return request(
    'POST',
    `https://interface3.music.163.com/eapi/song/enhance/player/url`,
    data,
    {
      crypto: 'eapi',
      cookie: query.cookie,
      proxy: query.proxy,
      realIP: query.realIP,
      url: '/api/song/enhance/player/url',
    },
  ).then(async (v) => {
    const { body } = v
    let i = 0
    while (i < body.data.length) {
      if (!body.data[i].url) {
        const url = await find(body.data[i].id)
        v.body.data[i].url = url
      }
      i++
    }
    return v
  })
}
