// 搜索建议
// 增加QQ音乐搜索结果，网易云版权太少了
const { search } = require('@radishes/unblock/src/provider/qq')

module.exports = (query, request) => {
  const data = {
    s: query.keywords || '',
  }
  let type = query.type == 'mobile' ? 'keyword' : 'web'
  return request(
    'POST',
    `https://music.163.com/weapi/search/suggest/` + type,
    data,
    {
      crypto: 'weapi',
      cookie: query.cookie,
      proxy: query.proxy,
      realIP: query.realIP,
    },
  ).then(async (v) => {
    const url = await search(
      {
        keyword: query.keywords,
      },
      true,
    ).catch(() => {})
    v.body.qq = url
    return v
  })
}
