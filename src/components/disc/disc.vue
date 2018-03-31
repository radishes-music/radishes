<template>
  <div class="musicDisc">
    <div class="musciDiscBanner">
      <h3>我的音乐云盘</h3>
      <span class="discCapacity">
        <div>
          <p>云盘容量</p>
          <span>
            <a id="discB"></a>
          </span>
          <p>{{ userCa.length !== 0 ? width + 'G/' + userCa[0].maxSize / 1024 / 1024 / 1024 + 'G' : null }}</p>
        </div>
      </span>
      <h6>歌曲永久保存,随时随地多端畅听</h6>
    </div>

    <div class="musciDiscPlay">
      <span @click="playAll()">播放全部</span>
    </div>

    <div class="musciDiscList">
      <h1 v-if="discList.length === 0 ? true : false">请登录客户端上传歌曲(或点击上方未登录按钮)</h1>
      <ol v-if="discList.length === 0 ? false : true">
        <li></li>
        <li>音乐标题</li>
        <li>歌手</li>
        <li>专辑</li>
        <li>格式</li>
        <li>大小</li>
        <li>上传时间</li>
      </ol>
      <ul v-for="(item, index) in discList" @dblclick="play(index)" v-if="discList.length === 0 ? false : true">
        <li>{{ index < 10 ? '0' + (index + 1) : (index + 1)}}</li>
        <li>{{ item.songName }}</li>
        <li>{{ item.artist }}</li>
        <li>{{ item.album }}</li>
        <li>{{ item.fileName }}</li>
        <li>{{ (item.fileSize / 1024 / 1024).toFixed(2) + 'MB' }}</li>
        <li>{{ 1900 + new Date(item.addTime).getYear() + '.' + new Date(item.addTime).getMonth() + '.' + new Date(item.addTime).getDate()}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import bus from '../../router/eventBus'
import GetMvData from '../Data/WyGetData'

export default {
  name: 'musicDisc',
  data () {
    return {
      discList: [],
      userCa: [],
      width: 0,
      lycSrc: []
    }
  },
  methods: {
    play: function (index) {
      console.log(this.discList[index].songId)
      GetMvData.SongLyc(this.discList[index].id, this.lycSrc)
      let t = setInterval(() => {
        if (this.lycSrc.length !== 0) {
          bus.$emit('songControl', {
            'img': this.discList[index].img,
            'author_name': this.discList[index].artist,
            'song_name': this.discList[index].songName,
            'lyc': this.lycSrc[0],
            'id': this.discList[index].id,
            'isWy': true
          })
          bus.$emit('AudioSrc', 'http://music.163.com/song/media/outer/url?id=' + this.discList[index].id + '.mp3')
          clearInterval(t)
        }
      }, 200)
    },
    playAll: function () {
      let l = this.discList.length
      for (let i = 0; i < l; i++) {
        let lyc = []
        GetMvData.SongLyc(this.discList[i].id, lyc)
        let t = setInterval(() => {
          if (lyc.length !== 0) {
            this.__songList.push({
              'img': this.discList[i].img,
              'song_name': this.discList[i].songName,
              'author_name': this.discList[i].artist,
              'duration': this.discList[i].duration / 1000,
              'lyc': lyc[0],
              'url': 'http://music.163.com/song/media/outer/url?id=' + this.discList[i].id + '.mp3',
              'isWy': this.discList[i].isWy
            })
            bus.$emit('songlength', this.__songList.length)
            clearInterval(t)
          }
        }, 100)
      }
      // 先添加队列 再 播放歌曲
      this.lycSrc.splice(0, this.lycSrc.length)
      GetMvData.SongLyc(this.discList[0].id, this.lycSrc)
      let t = setInterval(() => {
        if (this.lycSrc.length !== 0) {
          bus.$emit('songControl', {
            'img': this.discList[0].img,
            'author_name': this.discList[0].artist,
            'song_name': this.discList[0].songName,
            'lyc': this.lycSrc[0],
            'id': this.discList[0].id,
            'isWy': this.discList[0].isWy
          })
          bus.$emit('AudioSrc', 'http://music.163.com/song/media/outer/url?id=' + this.discList[0].id + '.mp3')
          // 设置播放顺序
          bus.$emit('loopControl', 1)
          clearInterval(t)
        }
      }, 100)
    }
  },
  mounted: function () {
    let t = setInterval(() => {
      if (global.isLong) {
        GetMvData.yunRec(this.discList, this.userCa)
        let j = setInterval(() => {
          if (this.userCa.length !== 0) {
            this.width = this.userCa[0].size / this.userCa[0].maxSize
            this.width < 0.5 ? this.width = 0.5 : null
            document.querySelector('#discB').style.width = (this.width < 1 ? 1 : this.width) + '%'
            clearInterval(j)
          }
        })
        clearInterval(t)
      }
    }, 200)
    if (!global.isLong) document.querySelector('.userWindow').style.display = 'block'
  },
  beforeDestroy: function () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
* {
  margin: 0;
  padding: 0;
}
.musicDisc {
  position: relative;
  width: 100%;
}

.musciDiscBanner {
  width: 100%;
  height: 42px;
  margin-top: 24px;
}
.musciDiscBanner h3, h6 {
  color: rgb(51,51,51);
  height: 100%;
  line-height: 42px;
  margin-left: 34px;
  float: left;
}
.musciDiscBanner h6 {
  color: rgb(102,102,102);
}

.discCapacity {
  display: block;
  float: left;
  width: 230px;
  height: 42px;
  font-size: .8rem;
  margin-left: 26px;
}

.discCapacity div {
  display: flex;
  height: 100%;
  justify-content: space-between;
  align-items: center;
}
.discCapacity p {
  float: left;
}

.discCapacity span {
  display: block;
  float: left;
  width: 86px;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  background-color: rgb(227,227,227);
}
.discCapacity span a {
  display: block;
  height: 100%;
  background-color: rgb(12,115,192);
}

.musciDiscPlay {
  width: 100%;
  height: 58px;
  border-top: 1px solid rgb(225,225,225);
  border-bottom: 1px solid rgb(225,225,225);
}
.musciDiscPlay span {
  float: left;
  margin-left: 26px;
  margin-top: 16px;
  width: 120px;
  height: 26px;
  line-height: 26px;
  color: rgb(205,41,41);
  border: 0.5px solid rgb(205,41,41);
  border-radius: 6px;
  cursor: pointer;
}

.musciDiscList {
  width: 100%;
  height: 394px;
  overflow: auto;
}

.musciDiscList ol {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: .9rem;
  color: rgb(102,102,102);
  border-bottom: 1px solid rgb(225,225,225);
}
.musciDiscList ol li {
  list-style-type: none;
  height: 30px;
  line-height: 30px;
  text-align: left;
  text-indent: 14px;
  border-left: 1px solid rgb(225,225,225);
}
.musciDiscList ol li:nth-child(2) {
  width: 30%;
}

.musciDiscList ol li:last-child {
  width: 12%;
}

.musciDiscList ul {
  width: 100%;
  height: 30px;
  font-size: .9rem;
  border-bottom: 1px solid rgb(225,225,225);
  overflow: hidden;
  cursor: pointer;
}
.musciDiscList ul:hover {
  background-color: rgb(235,235,235);
}
.musciDiscList ul li {
  list-style-type: none;
  float: left;
  text-indent: 14px;
  text-align: left;
  width: 93px;
  height: 100%;
  line-height: 30px;
  color: rgb(102,102,102);
  font-weight: 500;
}
.musciDiscList ul li:nth-child(1) {
  color: rgb(102,102,102);
  font-size: .9rem;
  width: 50px;
}
.musciDiscList ul li:nth-child(2) {
  width: 298px;
  color: rgb(51,51,51);
  font-size: .9rem;
  font-weight: 600;
}
</style>
