<template>
  <div class="dynamics">

    <div class="dynAbc">
      <span>{{ new Date().getDate() }}</span>
      <p>每日歌曲推荐</p>
      <p>根据您的音乐口味生成,每天6:00点更新</p>
    </div>

    <div class="dyn_bottom">
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
          <li v-for="(item, index) in (daySongs)" @dblclick="setAudioSrc(index)" v-on:mouseup="doBox(index)" class="dobox">
            <a class="l">{{ index + 1 }}</a>
            <p class="la">{{ item.name }}</p>
            <p class="RE">{{ item.artists[0].name }}</p>
            <p class="re">{{ item.album.name }}</p>
            <a class="r">{{ (item.duration / 1000 / 60 ).toFixed(2) + '分' }}</a>
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
      daySongs: [],
      lycSrc: []
    }
  },
  watch: {
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
        GetMvData.SongLyc(this.daySongs[index].id, this.lycSrc)
        let t = setInterval(() => {
          if (this.lycSrc.length !== 0) {
            clearInterval(t)
            publicBox.creat(pos.x, pos.y, {
              'img': this.daySongs[index].album.picUrl,
              'author_name': this.daySongs[index].album.artists[0].name,
              'song_name': this.daySongs[index].name,
              'lyc': this.lycSrc[0],
              'duration': this.daySongs[index].duration / 1000,
              'url': 'http://music.163.com/song/media/outer/url?id=' + this.daySongs[index].id + '.mp3',
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
    setAudioSrc: function (index) {
      console.log(this.daySongs[index].id)
      this.lycSrc.splice(0, this.lycSrc.length)
      GetMvData.SongLyc(this.daySongs[index].id, this.lycSrc)
      setTimeout(() => {
        bus.$emit('songControl', {
          'img': this.daySongs[index].album.picUrl,
          'author_name': this.daySongs[index].album.artists[0].name,
          'song_name': this.daySongs[index].name,
          'lyc': this.lycSrc[0],
          'isWy': true
        })
        bus.$emit('AudioSrc', 'http://music.163.com/song/media/outer/url?id=' + this.daySongs[index].id + '.mp3')
      }, 500)
    }
  },
  mounted: function () {
    // 获取每日推荐歌曲
    bus.$on('goDay', (e) => {
      for (let i = this.daySongs.length - 1; i >= 0; i--) {
        this.daySongs.splice(i, 1)
      }
      GetMvData.dayRecommendSong(this.daySongs)
    })
    bus.$on('updataPlay', () => {
      try {
        document.querySelectorAll('.dyn_bottom_p')[2].style.backgroundColor = global.colors
        document.querySelector('.dynAbc span').style.color = global.colors
      } catch (e) {
        console.log('%c 手动抛错((<页面未加载>/歌单/))', 'color: red')
      }
    })
  },
  updated: function () {
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
  width: 798px;
  opacity: 0;
  animation: init 1s;
  animation-fill-mode: forwards;
}

.dynAbc {
  position: relative;
  width: 450px;
  height: 140px;
}
.dynAbc span {
  float: left;
  width: 98px;
  height: 98px;
  line-height: 98px;
  color: rgb(59,186,125);
  font-size: 38pt;
  margin-top: 36px;
  font-weight: bold;
  text-align: center;
  border: 1px solid rgb(230,230,230);
}
.dynAbc p {
  position: absolute;
  text-align: left;
  top: 20px;
  left: 124px;
  color: #000;
  font-size: 16pt;
  font-weight: bold;
}
.dynAbc p:nth-child(3) {
  top: 78px;
  font-size: 10pt;
  color: rgb(102,102,102);
  font-weight: normal;
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
  border: 1px solid rgb(236,236,236);
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
  left: 710px;
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
  width: 152px;
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
  width: 412px;
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

.dynTab {
  position: absolute;
  left: 0;
  top: 136px;
  width: 100%;
  height: 24px;
  line-height: 24px;
  text-align: left;
  margin: 0;
}
.dynTab i {
  position: absolute;
  left: 42px;
  top: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 120px;
  height: 24px;
  font-style: normal;
  font-weight: bold;
  font-size: 10pt;
}
.dynTab a {
  color: rgb(12,115,194);
}


.dynAb {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 432px;
  height: 54px;
  overflow: hidden;
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
