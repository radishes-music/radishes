// 歌曲链接

// 从 packages/unblock 中解析网易云音乐ID的播放链接，突破灰色歌曲限制
const match = require('@radishes/unblock')
const crypto = require('crypto')

const find = (id, source) => {
  const playSource =
    typeof source === 'string'
      ? source.split(',')
      : ['qq', 'baidu', 'kugou', 'kuwo']
  return match(id, playSource)
    .then((url) => {
      return url.url
    })
    .catch((e) => {
      console.warn(e)
      return ''
    })
}

module.exports = (query, request) => {
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
    if (Buffer.isBuffer(body)) {
      v.body = JSON.parse(body.toString())
    }

    try {
      let i = 0
      while (i < v.body.data.length) {
        if (!v.body.data[i].url || v.body.data[i].freeTrialInfo) {
          const url = await find(v.body.data[i].id, query.source)
          v.body.data[i].url = url
        }
        i++
      }
    } catch (e) {
      console.log(e)
    }

    return v
  })
}
