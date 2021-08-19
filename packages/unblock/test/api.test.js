const match = require('../src/provider/match')

test('match id', () => {
  return match(1391673624)
    .then(data => {
      const url = data.url
      expect(url.includes('http')).toBe(true)
    })
    .catch(e => {
      expect(e).toBe('未获取到任何播放源')
    })
})
