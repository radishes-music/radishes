// 歌单详情

module.exports = (query, request) => {
  const data = {
    id: query.id,
    n: 100000,
    s: query.s || 8,
  }
  return request('POST', `https://music.163.com/api/v6/playlist/detail`, data, {
    crypto: 'linuxapi',
    cookie: query.cookie,
    proxy: query.proxy,
    realIP: query.realIP,
  }).then(async (v) => {
    const { body } = v
    const { tracks, trackIds } = body.playlist
    if (trackIds && tracks && trackIds.length > tracks.length) {
      const ids = trackIds.slice(tracks.length).map((item) => item.id)
      const data = {
        c: '[' + ids.map((id) => '{"id":' + id + '}').join(',') + ']',
        ids: '[' + ids.join(',') + ']',
      }
      const { body } = await request(
        'POST',
        `https://music.163.com/weapi/v3/song/detail`,
        data,
        {
          crypto: 'weapi',
          cookie: query.cookie,
          proxy: query.proxy,
          realIP: query.realIP,
        },
      )
      v.body.playlist.tracks = v.body.playlist.tracks.concat(body.songs)
    }
    return v
  })
}
