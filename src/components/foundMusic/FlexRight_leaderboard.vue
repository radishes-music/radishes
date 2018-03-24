<template>
  <div class="right_leaderboard">

    <p class="right_leaderboard_title">官方榜</p>

    <div class="official_list">
      <li v-for="(item,index) in leaderboard_txt">
        <img class="official_list_img" v-bind:src="item.src">
        <div class="list">
          <p class="leaderboard_album_title" v-for="(i,dev) in item.name" v-on:mouseup="down([index, dev], true)">
            {{ i[0] }}
            <!-- <img v-bind:src="img[dev]" v-on:mouseenter="enter(dev)" v-on:mouseleave="levae(dev)" title="添加到播放队列" @click="addSong([index, dev])"> -->
          </p>
        </div>
      </li>
    </div>
  </div>
</template>

<script>
import bus from '../../router/eventBus'
import publicFn from '../Data/getData'
// import publicBox from '../Data/rightMenu'

export default {
  data () {
    return {
      // 添加队列图片
      img: [],
      // 排行榜数据
      leaderboard_txt: []
    }
  },
  methods: {
    enter: function (i) {
      this.$set(this.img, i, 'http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/addSong_1.png')
    },
    levae: function (i) {
      this.$set(this.img, i, 'http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/addSong_2.png')
    },
    down: function (pos, c) {
      let e = e || window.event
      if (e.button === 0) {
        this.setAudioSrc(pos, true)
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
    // 添加到播放队列
    addSong: function (i) {
      this.setAudioSrc(i, false)
    },
    setAudioSrc: function (pos, c) {
      // console.log(pos)
      for (let i = 0; i < this.leaderboard_txt.length; i++) {
        if (pos[0] === i) {
          for (let j = 0; j < this.leaderboard_txt[i].name.length; j++) {
            if (pos[1] === j) {
              // 播放歌曲并完成设置队列
              publicFn.play(this.leaderboard_txt[i].name[j][1], c, this.leaderboard_txt[i].duration[j], this.__songList)
            }
          }
        }
      }
    },
    colors: function () {
      let temp = document.querySelectorAll('.leaderboard_album_title')
      if (temp.length !== 0) {
        for (var i = 0; i < temp.length; i++) {
          temp[i].style.background = global.ImgPointer
        }
      }
    }
  },
  mounted: function () {
    // 获取排行榜数据
    publicFn.getLatest(this.leaderboard_txt)
    // 初始化添加歌曲图片
    for (let i = 0; i < 30; i++) {
      this.img.push('http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/addSong_2.png')
    }
    bus.$on('updataPlay', () => {
      try {
        this.colors()
      } catch (e) {
        console.log('手动抛错')
      }
    })
    try {
      this.colors()
    } catch (e) {
      console.log('%c 手动抛错((<页面未加载>/官方榜/))', 'color: red')
    }
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

@keyframes init {
  0% {
    left: 1022px;
  }
  100% {
    opacity: 1;
    left: 24px;
  }
}
.right_leaderboard {
  position: absolute;
  width: 96%;
  height: 1300px;
  margin: 0 auto 0;
  opacity: 0;
  animation: init 1s;
  animation-fill-mode: forwards;
}
.right_leaderboard_title {
  text-align: left;
  font-size: 12pt;
  padding-bottom: 12px;
  border-bottom: .5px solid #D3D3D3;
}
/*244 372*/

.official_list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 780px;
}
.leaderboard_album_title{
  position: relative;
  width: 98%;
  height: 22px;
  line-height: 22px;
  margin-top: 2px;
  margin-bottom: 0;
  font-size: 10pt;
  text-align: left;
  text-indent: 16px;
  background: url('http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/pointer-4.png') no-repeat 4px 2px;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
  cursor: pointer;
}
.leaderboard_album_title:hover {
  background-color: rgb(235,235,235);
}
.leaderboard_album_title img {
  position: absolute;
  right: 4px;
  top: 0;
  width: 18px;
  height: 18px;
  cursor: pointer;
  z-index: 1;
}

.leaderboard_artist_name {
  text-align: right;
}
.official_list li {
  position: relative;
  width: 238px;
  height: 386px;
  list-style-type: none;
  background-color: rgb(245,245,245);
  border: .5px solid #D3D3D3;
  margin-top: 12px;
}
/*244 92*/
.official_list_img {
  width: 240px;
  height: 90px;
}
.list {
  width: 100%;
  height: 288px;
  overflow-y: scroll;
}
.list p {
  display: inline-block;
}
.namerR {
  float: right;
  margin-right: 2px;
}

.on {
  background-color: rgb(250,250,250);
}
.off {
  background-color: rgb(250,250,250);
}
</style>
