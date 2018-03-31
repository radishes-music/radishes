<template>
  <div class="dynamics">

    <img src="http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/Loading.gif" v-show="!isLoad && !isTimed">

    <h1 v-if="isTimed">获取超时</h1>

    <div class="dyn_top" v-show="isShow & isLoad">
      <img v-bind:src="data.length!==0?data[0].picUrl:null">
      <div class="dynR">
        <strong>专辑</strong><a class="dynTit">{{ data.length!==0?data[0].name:null }}</a>
        <span @click="addSongAll">播放全部</span>
        <p class="dynTab">歌手: <i>{{ data.length!==0?data[0].auname:null }}</i></p>
        <p class="dynTabs">时间: <i>{{ data.length!==0?(1990+new Date(data[0].publishTime).getYear()+'-'+(new Date(data[0].publishTime).getMonth()+1)+'-'+new Date(data[0].publishTime).getDate()):null }}</i></p>
      </div>
    </div>

    <div class="dyn_bottom" v-show="isLoad">
      <p class="dyn_bottom_p">歌曲列表</p>
      <div class="dyn_b_list">
        <ul class="addBorder">
          <li>
            <a class="l">序列</a>
            <p class="la">音乐标题</p>
            <p class="RE">歌手</p>
            <p class="re">专辑</p>
            <a class="r">时长</a>
          </li>
        </ul>
        <ul>
          <li v-for="(item, index) in playlist" @dblclick="setAudioSrc(index)" v-on:mouseup="doBox(index)" class="dobox">
            <a class="l">{{ index + 1 }}</a>
            <p class="la">{{ item.name }}</p>
            <p class="RE">{{ item.auname }}</p>
            <p class="re">{{ item.aubumName }}</p>
            <a class="r">{{ (item.dt / 1000 / 60 ).toFixed(2) + '分' }}</a>
          </li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script>
import bus from '../../router/eventBus'
import publicBox from '../Data/rightMenu'
import GetMvData from '../Data/WyGetData'

export default {
  data () {
    return {
      playlist: [],
      data: [],
      lycSrc: [],
      isTimed: false,
      isShow: false,
      isLoad: false
    }
  },
  watch: {
    listenr: {
      handler: function (newvalue, old) {
        document.querySelectorAll('.dobox')[old].style.background = 'rgb(250,250,250)'
        document.querySelectorAll('.dobox')[newvalue].style.background = 'rgb(240,240,240)'
      },
      deep: false
    },
    data: {
      handler: function (newV, old) {
        if (this.data.length !== 0) {
          this.isShow = true
        }
      },
      deep: true
    },
    playlist: {
      handler: function (newV, old) {
        if (newV.length !== 0) {
          this.isLoad = true
        } else {
          this.isLoad = false
        }
      },
      deep: true
    }
  },
  methods: {
    doBox: function (index) {
      let e = e || window.event
      if (e.button === 2) {
        this.listenr = index
        publicBox.banMouseScrool()
        let pos = this.getMousePosition(e)
        try {
          publicBox.hideSelf()
        } catch (e) {
        }
        this.lycSrc.splice(0, this.lycSrc.length)
        GetMvData.SongLyc(this.playlist[index].id, this.lycSrc)
        let t = setInterval(() => {
          if (this.lycSrc.length !== 0) {
            clearInterval(t)
            publicBox.creat(pos.x, pos.y, {
              'img': this.data[0].picUrl,
              'author_name': this.playlist[index].auname,
              'song_name': this.playlist[index].name,
              'lyc': this.lycSrc[0],
              'duration': this.playlist[index].dt / 1000,
              'url': 'http://music.163.com/song/media/outer/url?id=' + this.playlist[index].id + '.mp3',
              'isWy': true
            }, this.__songList)
          }
        }, 200)
      }
    },
    // 获取鼠标位置
    getMousePosition: function (ev) {
      if (ev.pageX || ev.pageY) {
        return {x: ev.pageX, y: ev.pageY}
      }
      return {
        x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
        y: ev.clientY + document.body.scrollTop - document.body.clientTop
      }
    },
    addSongAll: function () {
      let l = this.playlist.length
      for (let i = 0; i < l; i++) {
        let lyc = []
        GetMvData.SongLyc(this.playlist[i].id, lyc)
        let t = setInterval(() => {
          if (lyc.length !== 0) {
            this.__songList.push({
              'img': this.playlist[i].al.picUrl,
              'song_name': this.playlist[i].name,
              'author_name': this.playlist[i].ar[0].name,
              'duration': this.playlist[i].dt / 1000,
              'lyc': lyc[0],
              'url': 'http://music.163.com/song/media/outer/url?id=' + this.playlist[i].id + '.mp3',
              'isWy': true
            })
            bus.$emit('songlength', this.__songList.length)
            clearInterval(t)
          }
        }, 100)
      }
      // 先添加队列 再 播放歌曲
      this.lycSrc.splice(0, this.lycSrc.length)
      GetMvData.SongLyc(this.playlist[0].id, this.lycSrc)
      let t = setInterval(() => {
        if (this.lycSrc.length !== 0) {
          bus.$emit('songControl', {
            'img': this.playlist[0].al.picUrl,
            'author_name': this.playlist[0].ar[0].name,
            'song_name': this.playlist[0].al.name,
            'duration': this.playlist[0].dt / 1000,
            'id': this.playlist[0].id,
            'lyc': this.lycSrc[0],
            'isWy': true
          })
          bus.$emit('AudioSrc', 'http://music.163.com/song/media/outer/url?id=' + this.playlist[0].id + '.mp3')
          // 设置播放顺序
          bus.$emit('loopControl', 1)
          clearInterval(t)
        }
      }, 100)
    },
    addSongList: function (i) {
    },
    setAudioSrc: function (index) {
      // console.log(this.playlist[index])
      this.lycSrc.splice(0, this.lycSrc.length)
      GetMvData.SongLyc(this.playlist[index].id, this.lycSrc)
      let t = setInterval(() => {
        if (this.lycSrc.length !== 0) {
          bus.$emit('songControl', {
            'img': this.data[0].picUrl,
            'author_name': this.playlist[index].auname,
            'song_name': this.playlist[index].name,
            'duration': this.playlist[index].dt / 1000,
            'id': this.playlist[index].id,
            'lyc': this.lycSrc[0],
            'isWy': true
          })
          bus.$emit('AudioSrc', 'http://music.163.com/song/media/outer/url?id=' + this.playlist[index].id + '.mp3')
          clearInterval(t)
        }
      }, 200)
    },
    updateColor: function () {
      document.querySelectorAll('.dynR strong')[1].style.backgroundColor = global.colors
      document.querySelectorAll('.dyn_bottom_p')[1].style.backgroundColor = global.colors
      document.querySelectorAll('.dynR span')[1].style.background = global.ImgPlay
    }
  },
  mounted: function () {
    bus.$on('AlbumList', (id) => {
      this.isTimed = false
      this.isLoad = false
      setTimeout(() => {
        if (this.playlist.length === 0 && this.data.length === 0) {
          this.isTimed = true
        } else {
          this.isLoad = true
        }
      }, 2000)
      for (let i = this.playlist.length - 1; i >= 0; i--) {
        this.playlist.splice(i, 1)
      }
      this.data.splice(0, 1)
      GetMvData.getAublmContent(id, this.playlist, this.data)
    })
    bus.$on('updataPlay', () => {
      try {
        this.updateColor()
      } catch (e) {
        console.log('%c 手动抛错((<页面未加载>/歌单/))', 'color: red')
      }
    })
  },
  updated: function () {
    this.updateColor()
  },
  destroy: function () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@keyframes init {
  100% {
    opacity: 1
  }
}
.dynamics {
  position: relative;
  float: right;
  width: 820px;
  opacity: 0;
  animation: init 1s;
  animation-fill-mode: forwards;
}

.dyn_top {
  display: flex;
  justify-content: space-around;
  align-items: top;
  position: relative;
  width: 86%;
  height: 220px;
  margin: 16px auto 0;
}
.dyn_top img{
  width: 174px;
  height: 174px;
  border: 1px solid #D3D3D3;
}

.dynR {
  position: relative;
  width: 64%;
}
.dynR strong {
  position: absolute;
  left: 0;
  top: 2px;
  width: 46px;
  height: 24px;
  line-height: 24px;
  font-size: 10pt;
  color: white;
  border-radius: 4px;
  background-color: rgb(59,186,125);
}
.dynR .dynTit {
  position: absolute;
  left: 52px;
  top: 4px;
  font-size: 14pt;
  font-weight: bold;
}
.dynR span {
  position: absolute;
  left: 0;
  top: 42px;
  width: 146px;
  height: 32px;
  line-height: 32px;
  font-size: 10pt;
  border: 1px solid #D3D3D3;
  border-radius: 6px;
  cursor: pointer;
  background: url('http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/play-4.png') no-repeat 12px 4px / 24px;
}

.dyn_bottom {
  width: 100%;
}
.dyn_bottom_p {
  width: 96px;
  height: 26px;
  font-size: 10pt;
  color: white;
  line-height: 26px;
  border-radius: 2px;
  margin-left: 78px;
  margin-bottom: 1px;
  background-color: rgb(59,186,125);
}
.dyn_b_list {
  position: relative;
  width: 100%;
  border-top: 1px solid rgb(59,168,125);
}
.dyn_b_list ul {
  padding: 0;
  margin: 0;
}
.dyn_b_list ul li {
  position: relative;
  width: 94%;
  height: 38px;
  margin-left: 26px;
  line-height: 38px;
  cursor: pointer;
  font-size: 10pt;
  list-style-type: none;
  cursor: pointer;
}
.dyn_b_list ul li:hover {
  background-color: rgb(245,245,245);
}
.dyn_b_list a {
  position: absolute;
  top: 0;
  font-size: 8pt;
}
.l {
  left: 6px;
}
.r {
  left: 730px;
}
.la {
  display: inline;
  position: absolute;
  left: 86px;
  margin: 0;
  width: 262px;
  font-weight: bold;
  text-align: left;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}
.RE {
  display: inline;
  position: absolute;
  left: 360px;
  margin: 0;
}
.re {
  display: inline;
  position: absolute;
  left: 554PX;
  margin: 0;
  width: 160px;
  text-align: left;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}

.addBorder li {
  border-bottom: 1px solid #d3d3d3;
}

.dynUs {
  position: absolute;
  left: 0;
  top: 42px;
  width: 504px;
  height: 34px;
  line-height: 34px;
  margin: 0;
}
.dynUs img {
  float: left;
  width: 34px;
  height: 34px;
  border-radius: 50%;
}
.dynUs a {
  float: left;
  margin-left: 12px;
}
.dynUs a:nth-child(3) {
  color: rgb(136,136,136);
  font-size: 10pt;
}

.dynTab{
  position: absolute;
  left: 0;
  top: 106px;
  width: 100%;
  height: 24px;
  line-height: 24px;
  text-align: left;
  margin: 0;
  font-size: .8rem;
  font-weight: bold;
}
.dynTabs {
  position: absolute;
  left: 0;
  top: 118px;
  font-size: .8rem;
  font-weight: bold;
}
.dynTabs i {
  font-weight: normal;
  font-style: normal;
  color: rgb(102,102,102);
}
.dynTab i {
  position: absolute;
  left: 42px;
  top: 0;
  font-weight: normal;
  font-style: normal;
  color: rgb(102,102,102);
}
.dynTab a {
  color: rgb(12,115,194);
}


.dynAb {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 432px;
  height: 48px;
  font-size: .9rem;
  margin: 0;
  text-align: left;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
#addsong {
  position: absolute;
  left: 36px;
  top: 10px;
  z-index: 2;
}
</style>
