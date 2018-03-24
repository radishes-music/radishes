<template>
  <div class="fm">
    <div class="fmImg">
      <span><img v-bind:src="playList.length === 0 ? null : playList[index].img"></span>
      <div class="fmImgControl">
        <a><img src="../../assets/fm/prev.png" @click="Prev" title="上一首"></a>
        <a><img src="../../assets/fm/love.png" @click="" title="收藏"></a>
        <a><img src="../../assets/fm/next.png" @click="Next" title="下一首"></a>
      </div>
    </div>
    <div class="fmLyc">
      <h1>{{ songName }}</h1>
      <h2>歌手:<a href="#" @click="info" id="songAuName">{{ songAuName }}</a></h2>
      <div class="FMlyc">
        <li v-for="(item, index) in lyc">{{ item }}</li>
      </div>
    </div>
  </div>
</template>

<script>
import bus from '../../router/eventBus'
import publicFn from '../Data/getData'
// import WyData from '../Data/WyGetData'

export default {
  data () {
    return {
      songSrc: [],
      songName: '',
      songAuName: '',
      lyc: [],
      time: 0,
      index: 0,
      nowTime: 0,
      isGetData: true,
      playList: []
    }
  },
  watch: {
    index: {
      handler (curVal, oldVal) {
        this.songName = this.playList[curVal].song_name
        this.songAuName = this.playList[curVal].author_name
        this.lycSegmentation(this.playList[curVal].lyc)
      },
      deep: true
    },
    nowTime: {
      handler (curVal, oldVal) {
        try {
          document.querySelectorAll('.FMlyc li')[oldVal].style.color = '#000'
        } catch (e) {
          console.log('%c 手动抛出异常!', 'color:red')
        }
      },
      deep: true
    }
  },
  methods: {
    info: function () {
      let call = confirm('即将从酷狗音乐搜索作者:' + document.querySelector('#songAuName').innerHTML)
      call ? window.open('http://www.kugou.com/yy/html/search.html#searchType=song&searchKeyWord=' + document.querySelector('#songAuName').innerHTML) : null
    },
    Next: function () {
      if (this.index >= this.playList.length - 2) {
        this.index = this.playList.length - 2
      } else {
        let Node = document.querySelector('.fmImg span')
        Node.style.left = '-300px'
        Node.style.opacity = '0'
        setTimeout(() => {
          Node.style.transition = 'normal'
          Node.style.left = '380px'
          this.index ++
          this.setAudioSrc()
        }, 200)
        setTimeout(() => {
          Node.style.transition = 'all .5s'
          Node.style.left = '80px'
          Node.style.opacity = '1'
        }, 400)
      }
    },
    Prev: function () {
      if (this.index === 0) {
        this.index = 0
      } else {
        let Node = document.querySelector('.fmImg span')
        Node.style.left = '380px'
        Node.style.opacity = '0'
        setTimeout(() => {
          Node.style.transition = 'normal'
          Node.style.left = '-300px'
          this.index --
          this.setAudioSrc()
        }, 200)
        setTimeout(() => {
          Node.style.transition = 'all .5s'
          Node.style.left = '80px'
          Node.style.opacity = '1'
        }, 400)
      }
    },
    // 歌词处理
    lycSegmentation: function (lyc) {
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
      try {
        for (let i = 0; i < eS[0].length; i++) {
          let sc = eS[0][i].split(':')
          let time = parseInt(sc[0]) * 60 + parseInt(sc[1])
          newTimems.push(parseInt(time))
        }
      } catch (e) {
        console.log('出现服务器返回歌词问题')
        newTimems = []
      }
      // 歌词 array
      // 歌词时间 newTimems
      this.lyc = array
      this.time = newTimems
    },
    setAudioSrc: function () {
      bus.$emit('songControl', this.playList[this.index])
      bus.$emit('AudioSrc', this.songSrc[this.index])
    },
    scolling: function () {
      let isScoll = true
      bus.$on('left_list', (e) => {
        if (e !== 1) isScoll = false; else isScoll = true
      })
      bus.$on('Scrolling', (e) => {
        if (!isScoll) return false
        let lycP = document.querySelectorAll('.FMlyc li')
        let scrollTop = document.querySelector('.FMlyc')
        if (typeof lycP === 'undefined' || typeof scrollTop === 'undefined') return false
        for (let i = 0; i < this.time.length; i++) {
          if (this.time[i] === e[0]) {
            for (let j = 0; j < lycP.length; j++) {
              lycP[j].style.color = '#000'
              lycP[j].style.opacity = '0.1'
              lycP[j].addEventListener('mouseenter', () => {
                lycP[j].style.opacity = '1'
              })
            }
            try {
              if (i < 10) {
                for (let j = i; j > 0; j--) {
                  lycP[j].style.opacity = j / 10
                }
              } else {
                lycP[i - 1].style.opacity = '0.9'
                lycP[i - 2].style.opacity = '0.8'
                lycP[i - 3].style.opacity = '0.7'
                lycP[i - 4].style.opacity = '0.6'
                lycP[i - 5].style.opacity = '0.5'
                lycP[i - 6].style.opacity = '0.4'
                lycP[i - 7].style.opacity = '0.3'
                lycP[i - 8].style.opacity = '0.2'
                lycP[i - 9].style.opacity = '0.1'
              }
              lycP[i].style.opacity = '1'
              lycP[i + 1].style.opacity = '0.9'
              lycP[i + 2].style.opacity = '0.8'
              lycP[i + 3].style.opacity = '0.7'
              lycP[i + 4].style.opacity = '0.6'
              lycP[i + 5].style.opacity = '0.5'
              lycP[i + 6].style.opacity = '0.4'
              lycP[i + 7].style.opacity = '0.3'
              lycP[i + 8].style.opacity = '0.2'
              lycP[i + 9].style.opacity = '0.1'
            } catch (e) {
              // console.log(e)
            }
            // 滚动条
            if (scrollTop === null) return false
            let value = scrollTop.scrollTop
            if (e[1]) {
              scrollTop.scrollTop = i * 30 - 5 * 30
            } else {
              let t = setInterval(() => {
                let val = i * 30 - 6 * 30
                if (value >= val) {
                  value -= 1
                  scrollTop.scrollTop = value
                } else {
                  value += 1
                  scrollTop.scrollTop = value
                }
                if (value === val) {
                  clearInterval(t)
                }
              }, 1000 / 120)
            }
            lycP[i].style.color = global.colors
            this.nowTime = i
          }
        }
      })
    }
  },
  mounted: function () {
    // WyData.getPersonalFm()
    // console.log(global.fmId)
    console.log('go on')
    if (!this.isGetData) return false
    for (let i = global.fmId.length - 1; i > 0; i--) {
      publicFn.setSingLists([global.fmId[i]], this.songSrc, this.playList)
    }
    setTimeout(() => {
      this.songName = this.playList[0].song_name
      this.songAuName = this.playList[0].author_name
      this.lycSegmentation(this.playList[0].lyc)
      this.setAudioSrc()
      this.scolling()
      this.isGetData = false
    }, 1000)
  },
  beforeMount: function () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.fm {
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: relative;
  margin-top: 36px;
  width: 100%;
  height: 80%;
}
.fmImg {
  position: relative;
  width: 50%;
  height: 100%;
}
.fmImg span {
  position: absolute;
  transition: all .2s;
}
.fmImg span:nth-child(1) {
  left: 80px;
  top: 48px;
  width: 300px;
  height: 300px;
}
.fmImg img {
  width: 100%;
}
.fmLyc {
  width: 50%;
  height: 100%;
}
.fmLyc h1 {
  font-size: 16pt;
  text-align: left;
  text-indent: 24px;
}
.fmLyc h2 {
  font-size: 10pt;
  text-align: left;
  text-indent: 24px;
  color: #555;
}
.fmLyc a {
  text-decoration: none;
}
.FMlyc {
  position: relative;
  margin-left: 24px;
  margin-top: 24px;
  width: 80%;
  height: 320px;
  overflow: auto;
}
.FMlyc li {
  transition: all 1s;
  list-style-type: none;
  width: 100%;
  height: 22px;
  margin-top: 4px;
  margin-bottom: 4px;
  font-size: 10pt;
  text-align: left;
  cursor: pointer;
}

.fmImgControl {
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: absolute;
  bottom: 0;
  left: 64px;
  width: 80%;
  height: 36px;
}
.fmImgControl a {
  width: 36px;
  height: 36px;
  border-radius: 50%;
}
.fmImgControl a:hover {
  cursor: pointer;
  background-color: #E0E0E0;
}
</style>
