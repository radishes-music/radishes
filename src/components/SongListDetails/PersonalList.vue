<template>
  <div class="dynamics">

    <div class="dyn_top">
      <img v-bind:src="img">
      <div class="dynR_">
        <strong>歌单</strong><a>{{ name }}</a>
        <span @click="setAll">播放全部</span>
      </div>
    </div>

    <div class="dyn_bottom">
      <p class="dyn_bottom_p_">歌曲列表</p>
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
        <p v-show="nf">您还没有添加任何歌曲哦！</p>
        <ul>
          <li class="dobox" v-for="(item, index) in playlist" @dblclick="setAudio(index)" v-on:mouseup="doBox(index)">
            <a class="l">{{ index + 1 }}</a>
            <p class="la">{{ item.song_name }}</p>
            <p class="RE">{{ item.author_name }}</p>
            <p class="re">{{ item.album_name }}</p>
            <a class="r">{{ '0' + (item.duration / 60).toFixed(2) }}</a>
          </li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script>
import bus from '../../router/eventBus'
import publicFn from '../Data/getData'
import publicBox from '../Data/rightMenu'
import Storage from '../Data/storageIO'

export default {
  data () {
    return {
      img: 'http://singerimg.kugou.com/uploadpic/softhead/400/20170807/20170807145802238.jpg',
      playlist: [0],
      id: null,
      name: null,
      nf: true
    }
  },
  methods: {
    setAudio: function (index) {
      publicFn.play(this.playlist[index].hash, true)
      bus.$emit('songControl', this.playlist[index])
      bus.$emit('AudioSrc', this.playlist[index].src)
    },
    setAll: function () {
      for (var i = 0; i < this.playlist.length; i++) {
        this.__songList.push(this.playlist[i])
      }
      bus.$emit('songlength', this.__songList.length)
    },
    doBox: function (index) {
      let e = e || window.event
      if (e.button === 2) {
        publicBox.banMouseScrool()
        let pos = this.getMousePosition(e)
        try {
          publicBox.hideSelf()
        } catch (e) {
        }
        publicBox.creat(pos.x, pos.y, this.playlist[index], this.__songList)
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
    // 优化从本地获取数据
    getLoacl: function (name) {
      let _a = Storage.getStrong('Loacl')
      for (var i = 0; i < _a.length; i++) {
        if (name === _a[i].name) {
          this.name = _a[i].name
        }
      }
      this.playlist = Storage.getStrong(this.name)
      if (this.playlist.length !== 0) {
        this.img = this.playlist[0].img
        this.nf = false
      } else {
        this.nf = true
      }
    }
  },
  mounted: function () {
    bus.$on('updataPlay', () => {
      try {
        document.querySelector('.dynR_ strong').style.background = global.colors
        document.querySelector('.dyn_bottom_p_').style.background = global.colors
        document.querySelector('.dynR_ span').style.background = global.ImgPlay
      } catch (e) {
        console.log('%c 手动抛错((<页面未加载>/歌单/))', 'color: red')
      }
    })
    this.getLoacl(global.Initialization)
    bus.$on('left_list', (e) => {
      this.getLoacl(e)
    })
  },
  updated: function () {
    document.querySelector('.dynR_ strong').style.background = global.colors
    document.querySelector('.dyn_bottom_p_').style.background = global.colors
    document.querySelector('.dynR_ span').style.background = global.ImgPlay
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

.dynR_ {
  position: relative;
  width: 64%;
}
.dynR_ strong {
  position: absolute;
  left: 0;
  top: 12px;
  width: 46px;
  height: 24px;
  line-height: 24px;
  font-size: 10pt;
  color: white;
  border-radius: 4px;
}
.dynR_ a {
  position: absolute;
  left: 52px;
  top: 14px;
  font-size: 12pt;
  font-weight: bold;
}
.dynR_ span {
  position: absolute;
  left: 0;
  top: 78px;
  width: 146px;
  height: 32px;
  line-height: 32px;
  font-size: 10pt;
  border: 1px solid #D3D3D3;
  border-radius: 6px;
  cursor: pointer;
  background: url('http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/play-4.png') no-repeat 12px 2px / 30px;
}
.dynR_ p {
  position: absolute;
  left: 0;
  top: 138px;
  font-size: 9pt;
  text-align: left;
}

.dyn_bottom {
  width: 100%;
}
.dyn_bottom_p_ {
  width: 96px;
  height: 26px;
  font-size: 10pt;
  color: white;
  line-height: 26px;
  border-radius: 2px;
  margin-left: 78px;
  margin-bottom: 1px;
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
  left: 600px;
  margin: 0;
}

.addBorder li {
  border-bottom: 1px solid #d3d3d3;
}

#addsong {
  position: absolute;
  left: 36px;
  top: 10px;
  z-index: 2;
}
</style>
