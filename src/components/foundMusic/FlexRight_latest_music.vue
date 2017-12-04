<template>
  <div class="right_latest">

    <p class="latest_title">最新音乐<a>开发者:Link</a></p>
    
    <div class="latest_music">
      <p class="main" @click="addAllSong">播放全部</p>
      <ul>
        <li class="latest_li" v-for="(item,index) in singer" @dblclick="setAudioSrc(singer.indexOf(item))">
          <img class="latest_li_img_on" v-bind:src="img[index]" id="addsong" v-on:mouseenter="enter(index)" v-on:mouseleave="levae(index)" title="添加到播放队列" @click="addSongList(index)">
          <a class="l">{{ index+1 }}</a>
          <img class="latest_li_img" v-bind:src="item.src">
          <p class="la">{{ item.name }}</p>
          <p class="re">{{ item.remark }}</p>
          <a class="r">{{ (item.timeOut/60).toFixed(2)+'分' }}</a>
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
import bus from '../../router/eventBus'
import publicFn from '../Data/getData'

export default {
  data () {
    return {
      // 添加歌曲队列图片
      img: [],
      // 最新音乐数据
      singer: [],
      // 初始值
      mUrl: 'http://icon.kugou.com//stdmusic/%7Bsize%7D/20170927/20170927144111409433.jpg?redirect=1',
      // 添加队列歌曲数据
      src: []
    }
  },
  methods: {
    addSongList: function (i) {
      let temp = []
      temp.push({
        'song_name': this.singer[i].name,
        'author_name': this.singer[i].author_name,
        'duration': this.singer[i].timeOut,
        'url': this.src[i],
        'lyc': this.singer[i].lyc,
        'img': this.singer[i].img
      })
      this.__songList.push(temp[0])
      bus.$emit('songlength', this.__songList.length)
    },
    enter: function (i) {
      this.$set(this.img, i, 'http://www.linkorg.club/onWeb/public/External/testImg/addSong_1.png')
    },
    levae: function (i) {
      this.$set(this.img, i, 'http://www.linkorg.club/onWeb/public/External/testImg/addSong_2.png')
    },
    // 双击播放
    setAudioSrc: function (i) {
      bus.$emit('AudioSrc', this.src[i])
      bus.$emit('songControl', {
        'img': this.singer[i].img,
        'author_name': this.singer[i].author_name,
        'song_name': this.singer[i].song_name,
        'lyc': this.singer[i].lyc
      })
    },
    // 添加所有到播放队列
    addAllSong: function () {
      for (let i = 0; i < this.singer.length; i++) {
        this.__songList.push({
          'song_name': this.singer[i].name,
          'author_name': this.singer[i].author_name,
          'duration': this.singer[i].timeOut,
          'url': this.src[i],
          'lyc': this.singer[i].lyc,
          'img': this.singer[i].img
        })
      }
      bus.$emit('songlength', this.__songList.length)
    }
  },
  mounted: function () {
    this.$http.options.emulateJSON = true
    this.$http.options.emulateHTTP = true
    // 获取最新音乐
    publicFn.getLatestMusic(this.src, this.singer, this.img)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.right_latest {
  width: 96%;
  margin: 0 auto 0;
}

.latest_title {
  position: relative;
  text-align: left;
  font-size: 12pt;
  padding-bottom: 12px;
  border-bottom: .5px solid #D3D3D3;
}
.latest_title a {
  position: absolute;
  right: 26px;
  top: 2px;
  font-size: 12pt;
  color: #4BCB6D;
  cursor: pointer;
}

.latest_music {
  width: 100%;
}
.main {
  position: relative;
  width: 28%;
  height: 36px;
  line-height: 36px;
  text-indent: 36px;
  text-align: left;
  font-size: 10pt;
  background-color: rgb(250,250,250);
  background: url(../../assets/right/play.png) no-repeat;
  background-position: 4px 4px;
  border-bottom: 2px solid #D3D3D3;
  cursor: pointer;
}

.latest_music ul {
  padding: 0;
}

.latest_li {
  position: relative;
  width: 100%;
  height: 48px;
  line-height: 48px;
  cursor: pointer;
  font-size: 10pt;
  list-style-type: none;
  cursor: pointer;
}
.latest_li a {
  position: absolute;
  top: 2px;
  font-size: 8pt;
}
.l {
  left: 6px;
}
.r {
  right: 6px;
}
.la {
  display: inline;
  position: absolute;
  left: 126px;
  margin: 0;
}
.re {
  display: inline;
  position: absolute;
  right: 64px;
  margin: 0;
}
.latest_li_img {
  position: absolute;
  left: 56px;
  top: 2px;
  width: 44px;
  height: 44px;
}
.latest_li:hover {
  background-color: rgb(245,245,245);
}

.latest_li_img_on {
  position: absolute;
  left: -12px;
  top: 16px;
}
</style>
