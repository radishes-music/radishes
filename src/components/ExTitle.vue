<template>
  <div class="title">
    <div class="logo">萝卜云音乐</div>
    <div class="serch">
      <div class="back_next">
        <span></span>
        <span></span>
      </div>
      <input type="text" id="input" placeholder="搜索音乐，歌手，歌词，用户" v-model="key" ref="key" @blur="blur" @focus="focus">

      <div class="popResults" id="popResults">
        <ul>
          <li v-for="(item, index) in result" @dblclick="setAudio(index)">
            <img v-bind:src="img[index]" id="addsong" v-on:mouseenter="enter(index)" v-on:mouseleave="levae(index)" title="添加到播放队列" @click="addSongList(index)">
            {{ item.songname }}
            <a>{{ item.name }}</a>
          </li>
        </ul>
      </div>

    </div>
    <div class="skin"></div>
    <div class="control">
      <li></li>
      <li></li>
      <li></li>
    </div>
  </div>
</template>

<script>
import publicFn from './Data/getData'
// import bus from '../router/eventBus'

export default {
  data () {
    return {
      img: [],
      src: null,
      key: null,
      pop: null,
      result: []
    }
  },
  watch: {
    key: {
      handler: function (val, oldval) {
        this.cleanResult() // 清除result数据
        publicFn.serch(this.$refs.key.value, 20, this.result) // 搜索
        this.$refs.key.value === '' ? this.pop.style.display = 'none' : this.pop.style.display = 'block'
        for (let i = 0; i < 20; i++) {
          // 添加列表图片初始化
          this.img.push('http://www.linkorg.club/onWeb/public/External/testImg/addSong_2.png')
        }
      },
      deep: true
    }
  },
  methods: {
    addSongList: function (i) {
      publicFn.play(this.result[i].hash, false, this.result[i].duration, this.__songList)
    },
    enter: function (i) {
      this.$set(this.img, i, 'http://www.linkorg.club/onWeb/public/External/testImg/addSong_1.png')
    },
    levae: function (i) {
      this.$set(this.img, i, 'http://www.linkorg.club/onWeb/public/External/testImg/addSong_2.png')
    },
    cleanResult: function () {
      for (let i = this.result.length - 1; i >= 0; i--) {
        this.result.splice(i, 1)
      }
    },
    blur: function () {
      if (this.$refs.key.value === '') {
        this.pop.style.display = 'none'
      }
    },
    focus: function () {
      if (this.$refs.key.value !== '') {
        this.pop.style.display = 'block'
      }
    },
    setAudio: function (i) {
      publicFn.play(this.result[i].hash, true)
    }
  },
  mounted: function () {
    this.pop = document.getElementById('popResults')
    this.input = document.getElementById('input')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
::scrollbar{width:6px;height:4px}
::-webkit-scrollbar{width:6px;height:4px}
::-webkit-scrollbar-track{background-color: rgb(250,250,250)}
::-webkit-scrollbar-thumb{background-color: rgb(240,240,240);}
::-moz-scrollbar{width:6px;height:4px}
::-moz-scrollbar-track{background-color: rgb(250,250,250)}
::-moz-scrollbar-thumb{background-color: rgb(240,240,240)}

@font-face {
  font-family: black_;
  src: url('../font/LinkBack.ttf');
  font-weight: lighter;
}
input::-webkit-input-placeholder{
    color: #fff;opacity:1;
}

.title {
  position: relative;
  width: 1022px;
  height: 52px;
  background: url(../assets/titleInfo.png) no-repeat center;
  z-index: 1;
}

.logo {
  float: left;
  width: 154px;
  height: 30px;
  padding-top: 11px;
  line-height: 30px;
  text-indent: 32px;
  letter-spacing: 2px;
  cursor: pointer;
  color: #fff;
  font-size: 18px;
  font-family: black_;
  background: url(../assets/musicLogo.png) no-repeat;
  background-position: 4px 10px;
}

.serch {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-top: 11px;
  padding-left: 60px;
  width: 284px;
  height: 30px;
}
.serch input {
  width: 220px;
  height: 22px;
  margin-left: 24px;
  color: white;
  font-size: 3pt;
  text-indent: 8px;
  border-style: none;
  outline: none;
  border-radius: 12px;
  background: #409A6A url(../assets/magnifying lens.png) no-repeat;
  background-size: 10%;
  background-position: 184px 3px;
  opacity: .8;
}
.back_next {
  width: 56px;
  height: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.back_next span {
  display: block;
  width: 50%;
  height: 24px;
  opacity: .4;
  border-radius: 4px 0 0 4px;
  border: 0.5px solid #333232;
  background: url(../assets/back.png) no-repeat center;
  background-size: 70%;
}
.back_next span:last-child {
  border-left: none;
  border-radius: 0 4px 4px 0;
  background: url(../assets/next.png) no-repeat center;
  background-size: 70%;
}
.popResults {
  display: none;
  position: absolute;
  z-index: 1;
  animation: pop .6s;
  animation-fill-mode: forwards;
  box-shadow: -14px 10px 20px 0px #ccc;
}
.popResults ul {
  list-style-type: none;
  overflow-y: scroll;
  height: 226px;
  background-color: rgb(250,250,250);
  margin: 0;
  padding-left: 0;
}
.popResults ul li {
  position: relative;
  width: 100%;
  height: 28px;
  line-height: 28px;
  font-size: 10pt;
  font-family: black_;
  cursor: pointer;
  text-align: left;
  text-indent: 4px;
  color: rgb(12,115,194);
  border-top: 1px solid #D3D3D3;
  overflow: hidden;
}
.popResults ul li:hover {
  background-color: rgb(235,235,235);
}
.popResults a {
  position: absolute;
  right: 4px;
  top: 0;
  color: #262424;
}
.popResults img{
  position: absolute;
  left: 130px;
  top: 6px;
  z-index: 4;
}

@keyframes pop {
  0%{
    width: 0;
    height: 0;
    left: 380px;
    top: 160px;
  }
  100%{
    width: 208px;
    height: 226px;
    left: 290px;
    top: 46px;
  }
}

.skin {
  float: right;
  margin-right: 140px;
  margin-top: -26px;
  width: 24px;
  height: 24px;
  z-index: -1;
  background: url(../assets/skin.png) no-repeat center;
}

.control {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 934px;
  margin-top: -26px;
  width: 86px;
  height: 24px;
  z-index: 1;
}
.control li {
  list-style-type: none;
  width: 33%;
  height: 24px;
  cursor: pointer;
  background: url(../assets/shrink.png) no-repeat center;
}
.control li:nth-child(2) {
  background: url(../assets/magnify.png) no-repeat center;
}
.control li:nth-child(3) {
  background: url(../assets/shutdown.png) no-repeat center;
}
</style>
