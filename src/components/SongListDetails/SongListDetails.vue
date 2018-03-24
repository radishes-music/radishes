<template>
  <div class="dynamics">

    <div class="dyn_top">
      <img v-bind:src="count[1]">
      <div class="dynR">
        <strong>歌单</strong><a>{{ count[2] }}</a>
        <span @click="addSongAll">播放全部</span>
        <p>简介: {{ count[3] }}</p>
      </div>
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
          <li v-for="(item,index) in playlist" @dblclick="setAudioSrc(playlist.indexOf(item))" v-on:mouseup="doBox(index)" class="dobox">
            <img v-bind:src="img[index]" id="addsong" v-on:mouseenter="enter(index)" v-on:mouseleave="levae(index)" title="添加到播放队列" @click="addSongList(index)">
            <a class="l">{{ index+1 }}</a>
            <p class="la">{{ item.song_name }}</p>
            <p class="RE">{{ item.author_name }}</p>
            <p class="re">{{ item.album_name }}</p>
            <a class="r">{{ (item.duration/60).toFixed(2)+'分' }}</a>
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

export default {
  data () {
    return {
      img: [],
      index: 0,
      count: [],
      playlist: [],
      P: [],
      a: true,
      isShow: true,
      src: [],
      color: 'rgb(59,186,125)',
      listenr: 0
    }
  },
  watch: {
    listenr: {
      handler: function (newvalue, old) {
        document.querySelectorAll('.dobox')[old].style.background = 'rgb(250,250,250)'
        document.querySelectorAll('.dobox')[newvalue].style.background = 'rgb(240,240,240)'
      },
      deep: false
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
    addSongAll: function () {
      let l = this.playlist.length
      for (let i = 0; i < l; i++) {
        this.__songList.push(this.playlist[i])
      }
      bus.$emit('songlength', this.__songList.length)
    },
    addSongList: function (i) {
      // console.log(this.playlist[i])
      this.__songList.push(this.playlist[i])
      bus.$emit('songlength', this.__songList.length)
    },
    enter: function (i) {
      this.$set(this.img, i, 'http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/addSong_1.png')
    },
    levae: function (i) {
      this.$set(this.img, i, 'http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/addSong_2.png')
    },
    setAudioSrc: function (i) {
      bus.$emit('songControl', this.playlist[i])
      bus.$emit('AudioSrc', this.src[i])
    }
  },
  mounted: function () {
    for (let i = 0; i < 30; i++) {
      this.img.push('http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/addSong_2.png')
    }
    bus.$on('index', (d) => {
      this.count = d
      for (var ii = this.src.length - 1; ii >= 0; ii--) {
        this.src.splice(ii, 1)
      }
      // console.log(this.src)
      for (let i = this.playlist.length - 1; i >= 0; i--) {
        this.playlist.splice(i, 1)
      }
      publicFn.setSingLists(d, this.src, this.playlist)
    })
    bus.$on('updataPlay', () => {
      try {
        document.querySelector('.dynR strong').style.background = global.colors
        document.querySelector('.dyn_bottom_p').style.background = global.colors
        document.querySelector('.dynR span').style.background = global.ImgPlay
      } catch (e) {
        console.log('%c 手动抛错((<页面未加载>/歌单/))', 'color: red')
      }
    })
  },
  updated: function () {
    document.querySelector('.dynR strong').style.background = global.colors
    document.querySelector('.dyn_bottom_p').style.background = global.colors
    document.querySelector('.dynR span').style.background = global.ImgPlay
  },
  destroy: function () {
    console.log('销毁')
    for (var ii = this.src.length - 1; ii >= 0; ii--) {
      this.src.splice(ii, 1)
    }
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
  top: 12px;
  width: 46px;
  height: 24px;
  line-height: 24px;
  font-size: 10pt;
  color: white;
  border-radius: 4px;
}
.dynR a {
  position: absolute;
  left: 52px;
  top: 14px;
  font-size: 12pt;
  font-weight: bold;
}
.dynR span {
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
  background: url('http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/play-4.png') no-repeat 12px 4px / 24px;
}
.dynR p {
  position: absolute;
  left: 0;
  width: 100%;
  height: 28px;
  line-height: 28px;
  top: 138px;
  font-size: 9pt;
  text-align: left;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
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
