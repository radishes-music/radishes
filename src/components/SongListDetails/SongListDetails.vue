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
          <li v-for="(item,index) in playlist" @dblclick="setAudioSrc(playlist.indexOf(item))">
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
      src: []
    }
  },
  watch: {
    playlist: function () {
    },
    index: function () {
    },
    deep: true
  },
  methods: {
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
      this.$set(this.img, i, 'http://www.linkorg.club/onWeb/public/External/testImg/addSong_1.png')
    },
    levae: function (i) {
      this.$set(this.img, i, 'http://www.linkorg.club/onWeb/public/External/testImg/addSong_2.png')
    },
    setAudioSrc: function (i) {
      bus.$emit('songControl', this.playlist[i])
      bus.$emit('AudioSrc', this.src[i])
    }
  },
  mounted: function () {
    for (let i = 0; i < 30; i++) {
      this.img.push('http://www.linkorg.club/onWeb/public/External/testImg/addSong_2.png')
    }
    bus.$on('index', (d) => {
      this.count = d
      for (var ii = this.src.length - 1; ii >= 0; ii--) {
        this.src.splice(ii, 1)
      }
      console.log(this.src)
      for (let i = this.playlist.length - 1; i >= 0; i--) {
        this.playlist.splice(i, 1)
      }
      publicFn.setSingLists(d, this.src, this.playlist)
    })
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

.dynamics {
  position: relative;
  float: right;
  width: 820px;
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
  background-color: rgb(59,168,125);
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
  background: url(../../assets/right/play.png) no-repeat;
  background-position: 12px 2px;
}
.dynR p {
  position: absolute;
  left: 0;
  top: 138px;
  font-size: 9pt;
  text-align: left;
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
  background-color: rgb(59,168,125);
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
