<template>
  <div class="play">

    <div class="left" id="nextPrev">
      <img src="../../assets/play/prive.png" @click="prev">
      <img v-bind:src="playSrc" @click="plays">
      <img src="../../assets/play/next.png" @click="next">
      <span id="playImg"></span>
    </div>

    <div class="audio">
      <audio v-bind:src="src" id="audio" autoplay="autoplay"></audio>
      <p class="timeStart" id="timeStart" v-html="allTime"></p>
      <div class="time">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <p class="timeDuation" v-html="timeDuation"></p>
    </div>

    <div class="sound">
      <img src="../../assets/play/sound.png">
      <div class="sounds" id="sounds">
        <span></span>
        <span></span>
        <span></span>
        <span v-html="volumes"></span>
      </div>
    </div>

    <div class="singControls">
      <span></span>
      <span></span>
      <span>{{ songlength }}</span>
    </div>

    <div class="songList">
      <div class="playList">
        <div>播放列表</div>
        <span></span>
      </div>
      <div class="songList_control">
        <a>总共 {{ songlength }} 首</a>
        <p>清空</p>
      </div>
      <div class="songlength_info">
        {{ songlength === 0 ? '列表中还没有歌曲哦!赶快去添加几首吧' : '' }}
        <ul>
          <li v-for="item in datas" v-bind:class="datas.indexOf(item) === index ? 'state' : 'none'" @click="playLists(datas.indexOf(item))">
            <p>{{ item.song_name }}</p>
            <p>{{ item.author_name }}</p>
            <p>{{ '0'+(item.duration/60).toFixed(2) }}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import bus from '../../router/eventBus'

export default {
  name: 'play',
  data () {
    return {
      temp: 0,
      datas: [],
      songlength: 0,
      isPlay: true, // 判断是否播放
      isMove: true,
      src: null, // mp3地址
      audios: null, // 获取audio控件
      sounds: null,
      singControls: null,
      soundsControl: null,
      soundsinfo: null,
      volumes: 100,
      allTime: '00:00', // 初始化已播放时间
      timeDuation: '00:00', // 记录歌曲时长
      currTime: 0, // 记录当前已播放歌曲时长
      t: null, // 定时器控制控件移动
      moveCon: false, // 当歌曲已经加载才可以拖动控件
      volume: 0.5,
      index: -1,
      playSrc: 'http://www.linkorg.club/onWeb/public/External/testImg/play.png' // 默认为播放图片
    }
  },
  watch: {
  },
  methods: {
    playLists: function (i) {
      // console.log(i)
      this.src = this.__songList[i].url
      this.index = i
      this.currTime = 0
      this.time(this.audios, this.currTime)
      this.enend()
    },
    next: function () {
      this.currTime = 0
      if (this.index === this.__songList.length - 1) {
        this.index = 0
      } else {
        this.index ++
      }
      if (this.__songList.length !== 0) {
        this.src = this.__songList[this.index].url
        this.audios.addEventListener('loadeddata', () => {
          this.time(this.audios, this.currTime)
          this.moveCon = true
        }, false)
        console.log(this.index)
        // console.log(this.src)
      } else {
        console.log('Please add the song to the list')
        this.index = 0
      }
      // console.log(this.src)
    },
    prev: function () {
      this.currTime = 0
      if (this.index <= 0) {
        this.index = this.__songList.length - 1
      } else {
        this.index --
      }
      if (this.__songList.length !== 0) {
        this.src = this.__songList[this.index].url
        this.audios.addEventListener('loadeddata', () => {
          this.time(this.audios, this.currTime)
          this.moveCon = true
        }, false)
        // console.log(this.src)
      } else {
        console.log('Please add the song to the list')
        this.index = 0
      }
      // console.log(this.src)
    },
    plays: function () {
      // this.currTime = this.audios.currentTime
      if (this.isPlay) {
        this.isPlay = false
        this.playSrc = 'http://www.linkorg.club/onWeb/public/External/testImg/pause.png'
        this.audios.play()
      } else {
        this.isPlay = true
        this.playSrc = 'http://www.linkorg.club/onWeb/public/External/testImg/play.png'
        this.audios.pause()
      }
    },
    timeChange: function (time, c) {
      var minute = time / 60
      var minutes = parseInt(minute)
      if (minutes < 10) {
        minutes = '0' + minutes
      }
      var second = time % 60
      let seconds = parseInt(second)
      if (seconds < 10) {
        seconds = '0' + seconds
      }
      c ? (this.timeDuation = ('' + minutes + '' + ':' + '' + seconds + '')) : (this.allTime = ('' + minutes + '' + ':' + '' + seconds + ''))
    },
    time: function (audio, curr) {
      if (typeof (curr) !== 'undefined') {
        audio.currentTime = curr
      }
      let timeStart = document.querySelectorAll('.time span')
      let duration = parseInt(audio.duration)
      this.timeChange(duration, true)
      this.t = setInterval(() => {
        if (this.audios.play && this.isMove) {
          duration = parseInt(audio.duration)
          var currentTime = parseInt(audio.currentTime)
          timeStart[1].style.width = (428 * currentTime / duration) + 'px'
          timeStart[2].style.left = (428 * currentTime / duration) + 40 + 'px'
          this.timeChange(currentTime, false)
        }
      }, 1000)
    },
    moveControl: function (ev) {
      let timeStart = document.querySelectorAll('.time span')
      timeStart[2].addEventListener('mousedown', (ev) => {
        this.isMove = false
        this.isPlay = false
        this.playSrc = 'http://www.linkorg.club/onWeb/public/External/testImg/play.png'
        document.addEventListener('mousemove', this.mouseMove)
      })
      document.addEventListener('mouseup', (ev) => {
        this.currTime = this.temp
        if (!this.isMove) {
          this.audios.play()
          this.time(this.audios, this.currTime)
        }
        this.isMove = true
        this.playSrc = 'http://www.linkorg.club/onWeb/public/External/testImg/pause.png'
        document.removeEventListener('mousemove', this.mouseMove)
      })
      this.soundsControl.addEventListener('mousedown', (ev) => {
        document.addEventListener('mousemove', this.volumeMove)
      })
      document.addEventListener('mouseup', (ev) => {
        document.removeEventListener('mousemove', this.volumeMove)
      })
      let au = document.getElementById('sounds')
      au.addEventListener('mouseover', () => {
        this.soundsControl.style.display = 'block'
      })
      au.addEventListener('mouseout', () => {
        this.soundsControl.style.display = 'none'
      })
    },
    mousePosition: function (ev) {
      if (ev.pageX || ev.pageY) {
        return {x: ev.pageX, y: ev.pageY}
      }
      return {
        x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
        y: ev.clientY + document.body.scrollTop - document.body.clientTop
      }
    },
    volumeMove: function (ev) {
      let left = document.querySelector('.hello')
      let lD = left.offsetLeft + 200 + 442 + 46 + 24 + 4 + 60
      lD = this.mousePosition(ev).x - lD
      if (lD <= 0) {
        lD = 0
      }
      if (lD >= 100) {
        lD = 100
      }
      this.soundsControl.style.left = lD + 'px'
      this.sounds.style.width = lD + 'px'
      this.soundsinfo.style.left = lD - 10 + 'px'
      this.volumes = lD
      this.audios.volume = lD / 100
    },
    mouseMove: function (ev) {
      if (this.moveCon) {
        this.audios.pause()
        clearInterval(this.t)
        let timeStart = document.querySelectorAll('.time span')
        let left = document.querySelector('.hello')
        let lD = left.offsetLeft + 200
        let l = this.mousePosition(ev).x - lD
        if (l <= 40) {
          l = 40
        }
        if (l >= 468) {
          l = 468
        }
        timeStart[2].style.left = l + 'px'
        let duration = parseInt(this.audios.duration)
        this.currTime = (l - 40) * duration / 428
        this.temp = this.currTime
        timeStart[1].style.width = l - 40 + 'px'
        this.timeChange(this.currTime, false)
      }
    },
    enend: function () {
      this.audios.addEventListener('loadeddata', () => {
        this.audios.play()
        this.time(this.audios, this.currTime)
        this.moveCon = true
      }, false)
      this.audios.addEventListener('play', () => {
        this.time(this.audios, this.currTime)
      }, false)
      this.audios.addEventListener('pause', () => {
        clearInterval(this.t)
        console.log('over audio')
      }, false)
      this.audios.addEventListener('ended', () => {
        this.playSrc = 'http://www.linkorg.club/onWeb/public/External/testImg/play.png'
        this.isPlay = true
        this.currTime = 0
        if (this.index === this.__songList.length - 1) {
          this.index = 0
        } else {
          this.index ++
        }
        this.src = this.__songList[this.index].url
        clearInterval(this.t)
        console.log('over audio')
      }, false)
    }
  },
  mounted: function () {
    bus.$on('songlength', (e) => {
      this.songlength = e
    })
    this.audios = document.querySelector('#audio')
    this.sounds = document.querySelectorAll('.sounds span')[1]
    this.soundsControl = document.querySelectorAll('.sounds span')[2]
    this.soundsinfo = document.querySelectorAll('.sounds span')[3]
    this.singControls = document.querySelectorAll('.singControls span')[2]
    this.audios.volume = 1
    this.moveControl()
    let cc = true
    this.singControls.addEventListener('click', () => {
      this.datas = this.__songList
      let songList = document.querySelector('.songList')
      if (cc) {
        songList.style.display = 'block'
        cc = false
      } else {
        songList.style.display = 'none'
        cc = true
      }
    })
    document.querySelectorAll('.songList_control p')[0].addEventListener('click', () => {
      for (let i = this.__songList.length - 1; i >= 0; i--) {
        this.__songList.splice(i, 1)
        this.datas.splice(i, 1)
      }
      this.songlength = 0
      this.index = 0
      this.currTime = 0
    })
    document.querySelectorAll('.playList span')[0].addEventListener('click', () => {
      let songList = document.querySelector('.songList')
      songList.style.display = 'none'
      cc = true
    })
    bus.$on('AudioSrc', (e) => {
      this.currTime = 0
      let playImg = document.getElementById('playImg')
      playImg.style.display = 'block'
      setTimeout(function () {
        playImg.style.display = 'none'
      }, 2000)
      this.src = e
      this.isPlay = false
      this.playSrc = 'http://www.linkorg.club/onWeb/public/External/testImg/pause.png'
      this.enend()
      // const playPromise = audios.play()
      // if (playPromise !== null) {
      //   playPromise.catch(() => {
      //     console.log('播放')
      //     audios.play()
      //   })
      // }
      // console.log(this.src)
    })
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


.play {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 48px;
  background-color: rgb(246,246,246);
  border: .5px solid #D3D3D3;
}

.left {
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 180px;
  height: 48px;
}
.left img {
  cursor: pointer;
}

#playImg {
  display: none;
  position: absolute;
  left: 25px;
  top: -41px;
  width: 36px;
  height: 36px;
  border: 2px solid rgb(59,168,125);
  border-radius: 50%;
  z-index: 1;
  animation: teaker 1s 2 alternate;
  animation-fill-mode: forwards;
}
@keyframes teaker {
  0% {
    width: 126px;
    height: 126px;
    opacity: 0;
  }
  50% {
    width: 36px;
    height: 36px;
    left: 70px;
    top: 4px;
  }
  100% {
    width: 126px;
    height: 126px;
    opacity: 1;
  }
}

.audio {
  display: flex;
  justify-content: space-between;
  align-content: center;
  position: absolute;
  left: 200px;
  top: 0;
  width: 534px;
  height: 48px;
}
.audio audio {
  position: absolute;
  left: 0;
  top: 0;
}
.audio p {
  margin: 0;
  padding: 0;
}
.time {
  width: 442px;
  height: 48px;
}
.time span {
  position: absolute;
  left: 50px;
  top: 20px;
  height: 6px;
  border-radius: 2px;
}
.time span:nth-child(1) {
  width: 428px;
  background-color: #ccc;
}
.time span:nth-child(2) {
  width: 0;
  background-color: rgb(93,200,138);
}
.time span:nth-child(3) {
  width: 8px;
  height: 8px;
  left: 40px;
  top: 14px;
  border-radius: 50%;
  border: 4px solid #fff;
  background-color: rgb(93,200,138);
  cursor: pointer;
}
.time span:nth-child(3):hover {
  box-shadow: 0 4px 8px #D3D3D3;
}

.timeStart, .timeDuation {
  width: 46px;
  height: 48px;
  line-height: 48px;
  font-size: 10pt;
}

.sound {
  display: flex;
  justify-content: space-between;
  align-content: center;
  position: absolute;
  left: 740px;
  top: 0;
  width: 140px;
  height: 48px;
}
.sound img {
  margin-top: 10px;
  width: 24px;
  height: 24px;
}
.sounds {
  position: relative;
  margin-top: 18px;
  margin-left: 4px;
  width: 110px;
  height: 6px;
}
.sounds span {
  height: 6px;
  position: absolute;
  left: 0;
  top: 0;
}
.sounds span:nth-child(1) {
  width: 100px;
  background-color: rgb(230,230,230);
}
.sounds span:nth-child(2) {
  width: 100px;
  background-color: rgb(93,200,138);
}
.sounds span:nth-child(3) {
  display: none;
  width: 6px;
  height: 6px;
  top: -2px;
  left: 90px;
  border-radius: 50%;
  border: 2px solid #fff;
  background-color: rgb(93,200,138);
  cursor: pointer;
}
.sounds span:nth-child(4) {
  left: 90px;
  top: 12px;
  width: 26px;
  height: 12px;
  line-height: 12px;
  font-size: 8pt;
  border: .5px solid #D3D3D3;
}

.singControls {
  position: absolute;
  right: 0;
  top: 0;
  width: 130px;
  height: 48px;
}
.singControls span:nth-child(3) {
  position: absolute;
  top: 14px;
  right: 22px;
  width: 46px;
  height: 14px;
  line-height: 14px;
  font-size: 8pt;
  text-indent: 8px;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
  background: rgb(225,225,225) url(../../assets/play/singList.jpg) no-repeat left;
  cursor: pointer;
}

.songList {
  display: none;
  position: absolute;
  right: 0;
  top: -400px;
  width: 460px;
  height: 400px;
  background-color: rgb(250,250,250);
  z-index: 2;
  box-shadow: -5px 5px 8px #ccc;
}
.playList {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 36px;
  background-color: rgb(244,244,244);
}
.playList div {
  margin: 5px auto 0;
  width: 100px;
  height: 26px;
  line-height: 26px;
  text-align: center;
  font-size: 10pt;
  color: white;
  border-radius: 6px;
  background-color: rgb(124,124,124);
}
.playList span {
  position: absolute;
  right: 12px;
  top: 12px;
  width: 16px;
  height: 16px;
  background: url(../../assets/play/shutdown.png) no-repeat;
  cursor: pointer;
}
.songList_control {
  position: absolute;
  left: 0;
  top: 36px;
  width: 100%;
  height: 26px;
  background-color: white;
}
.songList_control a {
  position: absolute;
  left: 36px;
  top: 4px;
  font-size: 8pt;
}
.songList_control p {
  display: inline;
  position: absolute;
  right: 36px;
  top: -8px;
  width: 68px;
  font-size: 8pt;
  background: url(../../assets/play/delete.png) no-repeat left;
  cursor: pointer;
}
.songlength_info {
  position: absolute;
  left: 0;
  top: 62px;
  width: 100%;
  height: 338px;
  overflow: auto;
  text-align: center;
}
.songlength_info ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
.songlength_info ul li {
  position: relative;
  width: 100%;
  height: 26px;
  font-size: 8pt;
  margin-top: 2px;
  background-color: white;
  cursor: pointer;
}
.songlength_info ul li:hover {
  background-color: rgb(235,235,235);
}
.state {
  background: url(../../assets/play/playState.png) no-repeat;
  background-position: 12px 4px;
}
.songlength_info ul li p {
  display: inline;
  top: -8px;
}
.songlength_info ul li p:nth-child(1) {
  position: absolute;
  left: 38px;
}
.songlength_info ul li p:nth-child(2) {
  position: absolute;
  left: 290px;
  color: rgb(136,136,136);
}
.songlength_info ul li p:nth-child(3) {
  position: absolute;
  right: 4px;
  color: rgb(102,102,102);
}
</style>
