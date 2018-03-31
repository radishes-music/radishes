import Vue from 'vue'
import bus from '../../router/eventBus'
export default {
  longIn: function (user, pass, data, dataDetail) {
    // 登录
    try {
      Vue.http.get('/Node/login/cellphone', {
        params: {
          'phone': user,
          'password': pass
        },
        xhrFields: {
          withCredentials: true
        }
        // -------------------------
      }).then((res) => {
        data.push(res.data)
        // global.userData.splice(0, global.userData.length - 1)
        global.userData.push(res.data)
        this.userDetail(res.data.profile.userId, dataDetail)
        global.isLong = true
        // console.log(res)
      })
    } catch (e) {
      console.log(e)
    }
  },
  userDetail: function (uid, dataDetail) {
    // 用户详情
    Vue.http.get('/Node/user/detail', {
      params: {
        'uid': uid
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      // console.log(res.data)
      // global.dataDetail.splice(0, global.userData.length - 1)
      dataDetail.push(res.data)
      global.userDataDetail.push(res.data)
    })
  },
  getUserInfos: function (uid, p) {
    // 获取用户信息 , 歌单，收藏，mv, dj 数量
    Vue.http.get('/Node/user/playlist', {
      params: {
        'uid': uid
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      // console.log(res)
      for (let i = 0; i < res.data.playlist.length; i++) {
        if (i === 0) {
          p.push({
            'src': 'http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/heart.png',
            'name': res.data.playlist[i].name,
            'id': res.data.playlist[i].id,
            'isWy': true
          })
        } else {
          p.push({
            'src': 'http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/singlist.png',
            'name': res.data.playlist[i].name,
            'id': res.data.playlist[i].id,
            'isWy': true
          })
        }
      }
    })
  },
  updateLongIn: function () {
    // 刷新登录
    Vue.http.get('/Node/login/refresh', {
      params: {
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      // console.log(res)
    })
  },
  getPersonalFm: function (data) {
    // 获取个人FM
    Vue.http.get('/Node/personal_fm', {
      params: {
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      for (let i = 0; i < res.data.data.length; i++) {
        data.push({
          'author_name': res.data.data[i].artists[0].name,
          'song_name': res.data.data[i].name,
          'id': res.data.data[i].id,
          'src': 'http://music.163.com/song/media/outer/url?id=' + res.data.data[i].id + '.mp3',
          'isWy': true,
          'img': res.data.data[i].album.picUrl
        })
      }
      // console.log(res)
    })
  },
  getSearch: function (key, type, limit, result) {
    // 获取搜索结果
    Vue.http.get('/Node/search', {
      params: {
        'keywords': key,
        'type': type,
        'limit': limit
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      if (key === '') return
      if (type === 1) {
        for (let i = 0; i < res.data.result.songs.length; i++) {
          result.push({
            'id': res.data.result.songs[i].id,
            'name': res.data.result.songs[i].name,
            'auname': res.data.result.songs[i].artists[0].name,
            'duration': res.data.result.songs[i].duration,
            'auId': res.data.result.songs[i].artists[0].id
          })
        }
        // console.log(res)
      } else if (type === 1000) {
        for (let i = 0; i < res.data.result.playlists.length; i++) {
          result.push({
            'id': res.data.result.playlists[i].id,
            'name': res.data.result.playlists[i].name
          })
        }
      } else if (type === 1004) {
        for (let i = 0; i < res.data.result.mvs.length; i++) {
          result.push({
            'name': res.data.result.mvs[i].name,
            'auname': res.data.result.mvs[i].artistName,
            'id': res.data.result.mvs[i].id
          })
        }
      } else if (type === 100) {
        result.push({
          'name': res.data.result.artists[0].name,
          'id': res.data.result.artists[0].id
        })
        // console.log(res)
      } else if (type === 1006) {
        for (let i = 0; i < res.data.result.songs.length; i++) {
          result.push({
            'name': res.data.result.songs[i].name,
            'auname': res.data.result.songs[i].artists[0].name,
            'auId': res.data.result.songs[i].artists[0].id,
            'duration': res.data.result.songs[i].duration,
            'id': res.data.result.songs[i].id
          })
        }
      }
    })
  },
  dayRecommendList: function () {
    // 获取每日推荐歌单
    Vue.http.get('/Node/recommend/resource', {
      params: {
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      // console.log(res)
    })
  },
  dayRecommendSong: function (p) {
    // 获取每日推荐歌曲
    Vue.http.get('/Node/recommend/songs', {
      params: {
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      // console.log(res)
      for (let i = 0; i < res.data.recommend.length; i++) {
        p.push(res.data.recommend[i])
      }
    })
  },
  reCommendListSong: function (p) {
    // 获取用户推荐歌单 (需登录)
    Vue.http.get('/Node/personalized', {
      params: {
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      // console.log(res.data.result)
      for (let i = 0; i < 14; i++) {
        p.push(res.data.result[i])
      }
    })
  },
  SongsDetail: function (id) {
    // 获取歌曲详情
    Vue.http.get('/Node/song/detail', {
      params: {
        'ids': id
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      // console.log(res)
      // this.artDetail(res.data.songs[0].ar[0].id)
    })
  },
  Getartists: function (id, img) {
    // 获取歌手单曲
    Vue.http.get('/Node/artists', {
      params: {
        'id': id
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      // console.log(res)
      img.push(res.data.artist.img1v1Url)
    })
  },
  SongSrcDetail: function (id, p) {
    // 获取歌曲播放链接
    Vue.http.get('/Node/music/url', {
      params: {
        'id': id
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      // console.log(res)
      // p.push(res.data.data[0].url)
    })
  },
  SongLyc: function (id, p) {
    // 获取歌曲歌词
    Vue.http.get('/Node/lyric', {
      params: {
        'id': id
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      // console.log(res)
      p.push(res.data.lrc.lyric)
    })
  },
  ListSongDetail: function (id, p, d) {
    // 获取歌单详情
    Vue.http.get('/Node/playlist/detail', {
      params: {
        'id': id
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      console.log(res.data.playlist)
      d.push({
        'img': res.data.playlist.coverImgUrl,
        'userImg': res.data.playlist.creator.avatarUrl,
        'description': res.data.playlist.description,
        'userName': res.data.playlist.name,
        'tags': res.data.playlist.tags,
        'name': res.data.playlist.creator.nickname,
        'createTime': res.data.playlist.createTime
      })
      for (let i = 0; i < res.data.playlist.tracks.length; i++) {
        p.push(res.data.playlist.tracks[i])
      }
    })
  },
  getHomePageImg: function (d) {
    // 获取banner图
    Vue.http.get('/Node/banner', {
      params: {
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      // d.push(res.data.banners)
      for (let i = 0; i < res.data.banners.length; i++) {
        d.push(res.data.banners[i].pic)
      }
      // console.log(res)
    })
  },
  friend: function (d) {
    // 获取朋友圈动态
    Vue.http.get('/Node/event', {
      params: {
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      // console.log(res.data.event)
      for (let i = 0; i < res.data.event.length; i++) {
        if (res.data.event[i].type === 18) {
          d.push(res.data.event[i])
        }
      }
    })
  },
  getMv: function (i, count, mvList) {
    // 获取最新MV
    Vue.http.get('/Node/mv/first', {
      params: {
        'limit': count + i
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      // console.log(res.data.data)
      for (; i < res.data.data.length; i++) {
        mvList.push(res.data.data[i])
      }
      // this.playMv(res.data.data[0].id)
    })
  },
  recommenMv: function (count, mvPList) {
    // mv排行榜
    Vue.http.get('/Node/top/mv', {
      params: {
        'limit': count
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      // console.log(res.data.data)
      for (let i = 0; i < res.data.data.length; i++) {
        mvPList.push(res.data.data[i])
      }
    })
  },
  resemble: function (mvid, reLevant) {
    // mv相似
    Vue.http.get('/Node/simi/mv', {
      params: {
        'mvid': mvid
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      // console.log(res.data.mvs)
      for (let i = 0; i < res.data.mvs.length; i++) {
        reLevant.push(res.data.mvs[i])
      }
    })
  },
  commentMv: function (mvid, count, comment, hotComment) {
    // mv评论
    Vue.http.get('/Node/comment/mv', {
      params: {
        'limit': count,
        'id': mvid
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      // console.log(res.data)
      for (let i = 0; i < res.data.comments.length; i++) {
        comment.push(res.data.comments[i])
      }
      for (let i = 0; i < res.data.hotComments.length; i++) {
        hotComment.push(res.data.hotComments[i])
      }
    })
  },
  goodComment: function (id, cid, t, tpye) {
    // 评论点赞
    Vue.http.get('/Node/comment/like', {
      params: {
        'id': id,
        'cid': cid,
        't': t,
        'tpye': tpye
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      // console.log(res)
    })
  },
  playMv: function (id) {
    // 播放MV
    Vue.http.get('/Node/mv', {
      params: {
        'mvid': id
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      bus.$emit('setMv', res.data.data)
      // console.log(res.data.data)
    })
  },
  yunRec: function (data, p) {
    // 我的音乐云盘
    Vue.http.get('/Node/user/cloud', {
      params: {
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      p.push({
        'size': parseInt(res.data.size),
        'maxSize': parseInt(res.data.maxSize)
      })
      // console.log(p)
      for (let i = 0; i < res.data.data.length; i++) {
        data.push({
          'songName': res.data.data[i].songName,
          'artist': res.data.data[i].artist,
          'album': res.data.data[i].album,
          'songId': res.data.data[i].songId,
          'fileName': res.data.data[i].fileName.replace(/.+\./, ''),
          'fileSize': res.data.data[i].fileSize,
          'img': res.data.data[i].simpleSong.al.picUrl,
          'id': res.data.data[i].simpleSong.privilege.id,
          'addTime': res.data.data[i].addTime,
          'duration': res.data.data[i].simpleSong.dt,
          'isWy': true
        })
      }
      // console.log(res)
    })
  },
  myFm: function (data) {
    // 用户电台
    Vue.http.get('/Node/dj/recommend', {
      params: {
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      // console.log(res)
      for (let i = 0; i < res.data.djRadios.length; i++) {
        data.push({
          'name': res.data.djRadios[i].name,
          'id': res.data.djRadios[i].id,
          'picUrl': res.data.djRadios[i].picUrl,
          'auname': res.data.djRadios[i].dj.nickname,
          'createTime': res.data.djRadios[i].createTime
        })
      }
    })
  },
  myFmProgram: function (rid, data, offset) {
    // 电台节目
    Vue.http.get('/Node/dj/program', {
      params: {
        'rid': rid,
        'limit': 50,
        'offset': offset
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      for (let i = 0; i < res.data.programs.length; i++) {
        data.push({
          'serialNum': res.data.programs[i].serialNum,
          'img': res.data.programs[i].coverUrl,
          'name': res.data.programs[i].name,
          'listenerCount': res.data.programs[i].listenerCount,
          'likedCount': res.data.programs[i].likedCount,
          'id': res.data.programs[i].mainSong.id,
          'createTime': res.data.programs[i].createTime,
          'dt': res.data.programs[i].duration
        })
      }
      console.log(res.data)
    })
  },
  myFmDetails: function (rid, data) {
    // 电台详情
    Vue.http.get('/Node/dj/detail', {
      params: {
        'rid': rid
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      data.push({
        'img': res.data.djRadio.picUrl,
        'name': res.data.djRadio.name,
        'auname': res.data.djRadio.dj.nickname,
        'auimg': res.data.djRadio.dj.avatarUrl,
        'desc': res.data.djRadio.desc,
        'category': res.data.djRadio.category
      })
      console.log(res)
    })
  },
  getSingerAublm: function (id, limit, data, hot) {
    // 获取歌手专辑
    Vue.http.get('/Node/artist/album', {
      params: {
        'id': id,
        'limit': limit
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      data.push({
        'name': res.data.artist.name,
        'alias': res.data.artist.alias[0],
        'musicSize': res.data.artist.musicSize,
        'albumSize': res.data.artist.albumSize,
        'picUrl': res.data.artist.picUrl
      })
      for (let i = 0; i < res.data.hotAlbums.length; i++) {
        hot.push({
          'id': res.data.hotAlbums[i].id,
          'picUrl': res.data.hotAlbums[i].picUrl,
          'name': res.data.hotAlbums[i].name,
          'dt': res.data.hotAlbums[i].publishTime
        })
      }
      // console.log(res)
    })
  },
  getAublmContent: function (id, data, p) {
    // 专辑内容
    Vue.http.get('/Node/album', {
      params: {
        'id': id
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      p.push({
        'picUrl': res.data.album.picUrl,
        'name': res.data.album.name,
        'auname': res.data.album.artist.name,
        'publishTime': res.data.album.publishTime
      })
      for (let i = 0; i < res.data.songs.length; i++) {
        data.push({
          'name': res.data.songs[i].name,
          'auname': res.data.songs[i].ar[0].name,
          'aubumName': res.data.songs[i].al.name,
          'dt': res.data.songs[i].dt,
          'id': res.data.songs[i].id
        })
      }
      console.log(res)
    })
  },
  getSingerMv: function (id, data) {
    // 获取歌手MV
    Vue.http.get('/Node/artist/mv', {
      params: {
        'id': id,
        'limit': 32
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      for (let i = 0; i < res.data.mvs.length; i++) {
        data.push({
          'imgurl': res.data.mvs[i].imgurl,
          'name': res.data.mvs[i].name,
          'duration': res.data.mvs[i].duration / 1000,
          'playCount': res.data.mvs[i].playCount,
          'id': res.data.mvs[i].id
        })
      }
      console.log(res)
    })
  },
  getSingerDetils: function (id, data) {
    // 获取歌手具体详情
    Vue.http.get('/Node/artist/desc', {
      params: {
        'id': id
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      data.push({
        'briefDesc': res.data.briefDesc,
        'introduction': res.data.introduction
      })
      console.log(res)
    })
  },
  getSingerSimi: function (id, data) {
    // 获取相似歌手
    Vue.http.get('/Node/simi/artist', {
      params: {
        'id': id,
        'limit': 30
      },
      xhrFields: {
        withCredentials: true
      }
    }).then((res) => {
      for (let i = 0; i < res.data.artists.length; i++) {
        data.push({
          'picUrl': res.data.artists[i].picUrl,
          'name': res.data.artists[i].name,
          'id': res.data.artists[i].id
        })
      }
      console.log(res)
    })
  }
}
