<template>
  <div class="lycLayout">
    <img v-bind:src="srcImg" class="blurBg">
    <span class="scaleMin" @click="back"><img src="http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/Min.png"></span>
    <div class="songImg" v-bind:class="pause?'aniamtionPlay':'paused'">
      <div>
        <img v-bind:src="songImg">
      </div>
    </div>
    <div class="songInfo">
      <h2>{{ songName }}</h2>
      <p>歌手: <a>{{ songAuthor }}</a></p>
      <div class="lyc">
        <ul>
          <li v-for="(item, index) in lycs" @click="gotoLyc(index)">{{ item }}</li>
          <div class="bbt"></div>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import bus from '../router/eventBus'

export default {
  data () {
    return {
      songImg: 'http://singerimg.kugou.com/uploadpic/softhead/400/20170807/20170807145802238.jpg',
      srcImg: 'http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/bg-4.jpg',
      songAuthor: '陈奕迅',
      songName: '陪你度过漫长岁月',
      time: [],
      lycs: [],
      nowTime: 0,
      isBootm: true,
      pageTimer: {},
      pause: false
    }
  },
  watch: {
    nowTime: {
      handler (curVal, oldVal) {
        // console.log('监听到的数据 : ' + curVal, oldVal)
        try {
          document.querySelectorAll('.lyc li')[oldVal].style.color = '#000'
        } catch (e) {
          console.log('%c 手动抛出异常!', 'color:red')
        }
      },
      deep: true
    },
    lycs: {
      handler (curVal, oldVal) {
        document.querySelector('.lyc').scrollTop = 0
      },
      deep: true
    }
  },
  methods: {
    back: function () {
      let anim = document.querySelector('.lycLayout')
      anim.style.width = '0px'
      anim.style.height = '0px'
      anim.style.opacity = '0'
      // 点击 立马开始动画
      setTimeout(() => {
        bus.$emit('isMax', false)
        bus.$emit('isLyc', true)
      }, 400)
    },
    gotoLyc: function (i) {
      this.nowTime = i
      this.isBootm = false
      let scrollTop = document.querySelector('.lyc')
      let value = scrollTop.scrollTop
      let t = setInterval(() => {
        let val = i * 30 - 5 * 30
        if (value > val) {
          value -= 6
          scrollTop.scrollTop = value
        } else {
          value += 6
          scrollTop.scrollTop = value
        }
        if (value >= val - 6 && value <= val + 6) {
          this.isBootm = true
          clearInterval(t)
        }
      }, 1000 / 60)
      document.querySelector('audio').currentTime = this.time[i]
    },
    // 歌词处理
    lycSegmentation: function (lyc, isWy) {
      if (lyc === null) {
        this.lycs.push(lyc)
        this.time = 0
        return
      }
      // 防止eval报错
      function evil (fn) {
        var Fn = Function
        return new Fn('return ' + fn)()
      }
      // 分割
      function patch (re, s) {
        re = evil('/' + re + '/ig')
        try {
          return s.match(re).length
        } catch (e) {
          return 0
        }
      }
      function extract (array) {
        var nt = []
        for (var i = 0; i < array.length; i++) {
          if (array[i] === '' || array[i] === '\n' || array[i].indexOf('\n') >= 0) {
            continue
          } else {
            nt.push(array[i])
          }
        }
        return nt
      }
      let array = lyc.split(/\[[\s\S]+?\]/)
      let arrayTime = lyc.split(/[A-Za-z].+?\n|[\u4e00-\u9fa5].+?\n/)
      // console.log(arrayTime)
      let newTimems = []
      let eS = []
      for (let i = 0; i < arrayTime.length; i++) {
        if (patch(']', arrayTime[i]) === 0) {
          arrayTime.splice(i, 1)
        } else {
          eS[i] = extract(arrayTime[i].split(/\[([\s\S]+?)\]/))
          for (var j = 0; j < eS[i].length; j++) {
            if (eS[i][j] === ' ') {
              eS[i].splice(j, 1)
            }
          }
        }
      }
      array.splice(0, 1)
      // console.log(eS)
      // console.log(typeof eS[0])
      for (let i = 0; i < eS.length; i++) {
        if (typeof eS[i] === 'undefined') {
          eS[i] = ['0:0:0']
        }
      }
      let ESS = []
      for (let i in eS) {
        ESS.push(eS[i])
      }
      if (isWy) {
        for (var i = array.length - 1; i > 0; i--) {
          if (array[i] === `\n` || array[i] === '\r\n' || array[i] === '') {
            array.splice(i, 1)
          }
        }
        try {
          for (let i = 0; i < ESS.length; i++) {
            let sc = ESS[i][0].split(':')
            let time = parseInt(sc[0]) * 60 + parseInt(sc[1])
            newTimems.push(parseInt(time))
          }
        } catch (e) {
          console.log('出现服务器返回歌词问题')
          newTimems = []
        }
      } else {
        try {
          for (let i = 0; i < eS[0].length; i++) {
            let sc = null
            sc = eS[0][i].split(':')
            let time = parseInt(sc[0]) * 60 + parseInt(sc[1])
            newTimems.push(parseInt(time))
          }
        } catch (e) {
          console.log('出现服务器返回歌词问题')
          newTimems = []
        }
      }
      // 歌词 array
      // 歌词时间 newTimems
      this.lycs = array
      this.time = newTimems
      // console.log(this.lycs)
      // console.log(newTimems)
    }
  },
  mounted: function () {
    this.pause = global.isPlay
    console.log(this.pause)
    bus.$on('isRunning', (e) => {
      this.pause = e
      // console.log(e)
    })
    // 滚动歌词
    bus.$on('Scrolling', (e) => {
      let lycP = document.querySelectorAll('.lyc li')
      let scrollTop = document.querySelector('.lyc')
      for (let i = 0; i < this.time.length; i++) {
        if (this.time[i] === e[0]) {
          if (i !== 0) {
            lycP[i - 1].style.color = '#000'
          }
          // 滚动条
          let value = scrollTop.scrollTop
          if (e[1]) {
            scrollTop.scrollTop = i * 30 - 5 * 30
          } else {
            let t = setInterval(() => {
              if (!this.pause) {
                clearInterval(t)
                return
              }
              let val = i * 30 - 5 * 30
              if (!this.isBootm) {
                clearInterval(t)
                return
              }
              if (value > val + 120) {
                value -= 12
                scrollTop.scrollTop = value
              } else if (value < val - 120) {
                value += 12
                scrollTop.scrollTop = value
              } else if (value > val - 3) {
                value -= 1
                scrollTop.scrollTop = value
              } else {
                value += 1
                scrollTop.scrollTop = value
              }
              if (value >= val - 12 && value <= val + 12) {
                clearInterval(t)
              }
            }, 1000 / 60)
          }
          // scrollTop.scrollTop = i * 30 - 5 * 30
          lycP[i].style.color = 'white'
          this.nowTime = i
        }
      }
    })
    bus.$on('isMax', (e) => {
      if (e) {
        this.pause = true
        let anim = document.querySelector('.lycLayout')
        anim.style.opacity = '1'
        anim.style.width = '1022px'
        anim.style.height = '520px'
        this.__currentTime = parseInt(document.querySelector('audio').currentTime)
      } else {
        this.pause = false
      }
      this.pause = global.isPlay
    })
    bus.$on('songControl', (e) => {
      this.songImg = e.img
      this.songAuthor = e.author_name
      this.songName = e.song_name
      this.lycSegmentation(e.lyc, !!e.isWy)
    })
    bus.$on('updataPlay', (e) => {
      this.srcImg = global.ImgBg
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

@keyframes mymove {
  0% {
    width: 0;
    height: 0;
    opacity: 0;
  }
  100% {
    width: 1022px;
    height: 520px;
    opacity: 1;
  }
}
@keyframes rotat {
  100% {
    transform: rotate(360deg);
  }
}
.lycLayout {
  position: absolute;
  left: 0;
  bottom: 48px;
  width: 1022px;
  height: 520px;
  animation: mymove .4s;
  background-color: rgb(245,245,247);
  transition: all .4s;
}

.blurBg {
/*  filter: blur(80px);
  -webkit-filter: blur(80px);*/
}

.scaleMin {
  display: flex;
  align-items: center;
  justify-content: space-around;
  position: absolute;
  right: 32px;
  top: 32px;
  width: 36px;
  height: 20px;
  border: 1px solid #D3D3D3;
  border-radius: 4px;
  cursor: pointer;
  background-color: rgb(245,245,247);
}
.scaleMin img {
  width: 18px;
  height: 18px;
}

.songImg {
  display: flex;
  align-items: center;
  justify-content: space-around;
  position: absolute;
  left: 80px;
  top: 50px;
  width: 310px;
  height: 310px;
  animation: rotat 16s linear infinite;
  background: url(http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/songImg.png) no-repeat center;
}
.songImg div {
  width: 216px;
  height: 216px;
  border-radius: 50%;
  overflow: hidden;
}
.songImg img {
  width: 216px;
  height: 216px;
}

.paused {
  animation-play-state:paused;
}
.aniamtionPlay {
  animation-play-state: running;
}

.songInfo {
  position: absolute;
  right: 120px;
  top: 42px;
  width: 450px;
  height: 440px;
}
.songInfo h2,p {
  text-align: left;
  margin: 8px;
  text-indent: 2px;
}
.songInfo h2 {
  font-size: 16pt;
}
.songInfo p {
  font-size: 10pt;
  margin-top: 12px;
}

.lyc {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 334px;
  overflow-y: auto;
  overflow: hidden;
}
.lyc ul {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}
.lyc li {
  list-style-type: none;
  width: 100%;
  height: 16px;
  margin-top: 14px;
  font-size: 10pt;
  text-align: center;
  cursor: pointer;
  color: #000;
}

.bbt {
  position: relative;
  width: 100%;
  height: 150px;
}
</style>
