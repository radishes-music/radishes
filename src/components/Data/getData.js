import Vue from 'vue'
import bus from '../../router/eventBus'
export default {
  // 获取歌词
  getlyc: function (songId) {
    let lyc = []
    return lyc
  },
  // 获取歌手
  getSinger: function (singer, classId) {
    Vue.http.get('/api/singer/class', {
      params: {
        'json': true
      }
    }).then((res) => {
      for (let i = 0; i < res.data.list.length; i++) {
        var temp = {
          'imgurl': res.data.list[i].imgurl,
          'classname': res.data.list[i].classname
        }
        singer.push(temp)  // 歌手数据处理
        classId[i] = res.data.list[i].classid  // 保存歌手ID
      }
    })
  },
  // 获取歌单
  getPlaylist: function (recommend, playlistId, c) {
    Vue.http.get('/api/plist/index', {
      params: {
        'json': true
      }
    }).then(function (res) {
      if (c) {
        for (let i = res.data.plist.list.info.length - 1, j = 0; i >= 20; i--, j++) {
          // 歌单数据压入
          recommend.push({
            'user_avatar': res.data.plist.list.info[i].user_avatar,
            'specialname': res.data.plist.list.info[i].specialname,
            'intro': res.data.plist.list.info[i].intro
          })
          // 歌单ID
          playlistId[j] = res.data.plist.list.info[i].specialid
        }
      } else {
        for (let i = 0; i < res.data.plist.list.info.length; i++) {
          // 歌单数据压入
          recommend.push({
            'user_avatar': res.data.plist.list.info[i].user_avatar,
            'specialname': res.data.plist.list.info[i].specialname,
            'intro': res.data.plist.list.info[i].intro
          })
          // 歌单ID
          playlistId[i] = res.data.plist.list.info[i].specialid
        }
      }
    })
  },
  // 获取音乐排行榜
  getLatest: function (leaderboardTxt) {
    Vue.http.get('/api/rank/list', {
      params: {
        'json': true
      }
    }).then((res) => {
      let d = res.data.rank.list
      for (let i = 0; i < d.length; i++) {
        this.getLatestInfo(d[i].rankid, d[i].bannerurl.replace(/\{size\}\//, ''), leaderboardTxt)
      }
    })
  },
  // 排行版分类歌曲列表
  getLatestInfo: function (id, src, leaderboardTxt) {
    Vue.http.get('/api/rank/info', {
      params: {
        'rankid': id,
        'page': 1,
        'json': true
      }
    }).then((res) => {
      let d = res.data.songs.list
      let names = []
      let duration = []
      for (var i = 0, len = d.length; i < len; i++) {
        names[i] = [d[i].filename, d[i].hash]
        duration[i] = d[i].duration
      }
      let temp = {
        'src': src,
        'id': id,
        'name': names,
        'duration': duration
      }
      leaderboardTxt.push(temp)
    })
  },
  // 音乐搜索
  serch: function (key, list, result) {
    Vue.http.get('/title', {
      params: {
        'format': 'json',
        'keyword': key,
        'page': 1,
        'pagesize': list,
        'showtype': 1
      }
    }).then((res) => {
      let d = res.data.data.info
      for (let i = 0, len = d.length; i < len; i++) {
        result.push({
          'name': res.data.data.info[i].singername,
          'songname': res.data.data.info[i].songname,
          'duration': res.data.data.info[i].duration,
          'hash': res.data.data.info[i].hash
        })
      }
    })
  },
  // 播放
  play: function (hash, c, d, __songList) {
    console.log(hash)
    let r = 'play/getdata'
    Vue.http.get('/search/yy/index.php', {
      params: {
        'r': r,
        'hash': hash
      }
    }).then(function (res) {
      if (c) { // 控制不同组件是否添加歌曲队列
        bus.$emit('AudioSrc', res.data.data.play_url)
      } else {
        __songList.push({
          'url': res.data.data.play_url,
          'duration': d,
          'song_name': res.data.data.song_name,
          'author_name': res.data.data.author_name
        })
        bus.$emit('songlength', __songList.length)
      }
    })
  },
  getImg: function (h, imgs, control, src, singer, img, array) {
    let r = 'play/getdata'
    Vue.http.get('/search/yy/index.php', {
      params: {
        'r': r,
        'hash': h
      }
    }).then((res) => {
      if (control) {
        imgs.push({
          'name': res.data.data.author_name,
          'src': res.data.data.img
        })
      } else {
        src.push(res.data.data.play_url)
        // 解决插入对象属性不渲染问题
        let temp = {
          'name': array[0],
          'remark': array[1],
          'timeOut': array[2],
          'src': res.data.data.img
        }
        singer.push(temp)
        for (let i = 0; i < singer.length - 1; i++) {
          img.push('http://www.linkorg.club/onWeb/public/External/testImg/addSong_2.png')
        }
      }
    })
  },
  // 获取歌手分类下面的歌手列表
  getSingList: function (id, classId, singer, indexs, imgs, singerLists) {
    Vue.http.get('/api/singer/list/' + id, {
      params: {
        'json': true
      }
    }).then((res) => {
      let dA = res.data.singers.list.info
      for (var i = 0; i < dA.length; i++) {
        dA[i].imgurl = dA[i].imgurl.replace(/\{size\}\//, '')
        this.getSingerInfo(dA[i].singerid, true, indexs, imgs, singerLists)
        classId.push(dA[i].singerid)
      }
      singer.push(dA)
    })
  },
  // 获取歌手信息
  getSingerInfo: function (singerId, c, indexs, imgs, singerLists) {
    Vue.http.get('/link/onWeb/public/External/userAgent/user-agent.php', {
      params: {
        'id': singerId
      }
    }).then((res) => {
      let d = res.data.songs.list
      if (c) {
        try {
          this.getImg(d[0].hash, imgs, true)
        } catch (e) {
          console.log('错误处理' + e)
        }
      } else {
        for (let i = singerLists.length - 1; i >= 0; i--) {
          singerLists.splice(i, 1)
        }
        for (let i = 0; i < d.length; i++) {
          let temp = {
            'name': d[i].filename,
            'duration': d[i].duration,
            'hash': d[i].hash
          }
          singerLists.push(temp)
        }
        bus.$emit('singerAudio', [singerLists, [imgs[indexs].name, imgs[indexs].src]])
      }
    })
  },
  // 获取最新音乐
  getLatestMusic: function (src, singer, img) {
    Vue.http.get('/api', {
      params: {
        'json': true
      }
    }).then((res) => {
      for (let i = 0; i < res.data.data.length; i++) {
        let f = res.data.data[i].filename
        let e = res.data.data[i].remark
        let d = res.data.data[i].duration
        // ------------------
        this.getImg(res.data.data[i].hash, 0, false, src, singer, img, [f, e, d])
      }
      // ------------------
    })
  },
  // 待处理
  setSingLists: function (d, src, playlist) {
    Vue.http.get('/api/plist/list/' + d[0], {
      params: {
        'json': true
      }
    }).then((res) => {
      // console.log(res.data.list.list.info)
      let dA = res.data.list.list.info
      for (let i = 0; i < dA.length; i++) {
        this.fuck(src, playlist, dA[i].duration, dA[i].hash)
      }
    })
  },
  // fuck
  fuck: function (src, playlist, d, h) {
    Vue.http.get('/search/yy/index.php?r=play/getdata', {
      params: {
        'hash': h
      }
    }).then((res) => {
      src.push(res.data.data.play_url)
      playlist.push({
        'song_name': res.data.data.song_name,
        'author_name': res.data.data.author_name,
        'album_name': res.data.data.album_name,
        'duration': d,
        'url': res.data.data.play_url
      })
    })
  }
}
