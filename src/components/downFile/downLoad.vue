<template>
  <div class="downFile">
    <div class="downFileTitle">
      <ul>
        <li v-for="(item, index) in title" @click="AlredyDown(index)" v-bind:class="index === clickCount ? 'Alerdy' : 'Not'">{{ item }}</li>
      </ul>
    </div>

    <div v-show="isShowCount" class="downTable">
      <ul class="too">
        <li>音乐标题</li>
        <li>歌手</li>
        <li>专辑</li>
        <li>大小</li>
        <li>下载时间</li>
      </ul>
      <div class="result">
        <ul class="fto" v-for="(item, index) in resultSingle" @click="play(index)">
          <li class="ftoOjj">✔</li>
          <li>{{ item.songname }}</li>
          <li>{{ item.name }}</li>
          <li>未知专辑</li>
          <li>{{ '0' + (item.duration / 60).toFixed(2) + ' 分' }}</li>
          <li>{{ item.time }}</li>
        </ul>
      </div>
    </div>

    <div v-show="!isShowCount" class="downTable">
      <input type="text" name="song" placeholder="请输入您想下载的歌曲" ref="key" v-model="key">
      <div class="numCheck">
        <div class="numInfo">{{ (num + 1) * 6 }}</div>
        <ul>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
      <ul class="too">
        <li>音乐标题</li>
        <li>歌手</li>
        <li>歌曲时间</li>
      </ul>
      <div class="result">
        <ul class="foo" v-for="(item, index) in result" @click="setFilePath(index)">
          <li class="ftoOjj">↓</li>
          <li>{{ item.songname }}</li>
          <li>{{ item.name }}</li>
          <li>{{ '0' + (item.duration / 60).toFixed(2) + ' 分' }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import publicFn from '../Data/getData'
import bus from '../../router/eventBus'
import publicBox from '../Data/rightMenu'

export default {
  name: 'downFile',
  data () {
    return {
      title: ['已下载', '下载'],
      clickCount: 0,
      isShowCount: true,
      result: [],
      resultSingle: [],
      key: null,
      filePath: '',
      num: 0
    }
  },
  watch: {
    key: {
      handler: function (ovl, old) {
        for (let i = this.result.length - 1; i >= 0; i--) {
          this.result.splice(i, 1)
        }
        publicFn.serch(ovl, (this.num + 1) * 6, this.result)
      },
      deep: true
    },
    filePath: {
      handler: function (ovl, old) {
        publicBox.downLoadFile(ovl)
      },
      deep: true
    }
  },
  methods: {
    play: function (index) {
      publicFn.play(this.resultSingle[index].hash, true)
    },
    AlredyDown: function (index) {
      this.clickCount = index
      if (index === 0) {
        this.isShowCount = true
      } else {
        this.isShowCount = false
      }
    },
    setFilePath: function (index) {
      let data = new Date()
      this.getLoact()
      this.resultSingle.push({
        'name': this.result[index].name,
        'songname': this.result[index].songname,
        'duration': this.result[index].duration,
        'hash': this.result[index].hash,
        'time': data.getHours() + ' : ' + data.getMinutes()
      })
      window.localStorage.setItem('musicLink', JSON.stringify(this.resultSingle))
      publicFn.downFile(this.result[index].hash)
      bus.$on('setUrl', (e) => {
        // 设置时间
        this.filePath = e
        this.clickCount = 0
        this.isShowCount = true
      })
    },
    getLoact: function () {
      this.resultSingle = JSON.parse(window.localStorage.getItem('musicLink') || '[]')
    }
  },
  mounted: function () {
    let numCheck = document.querySelectorAll('.numCheck li')
    for (let i = 0; i < numCheck.length; i++) {
      numCheck[i].addEventListener('mouseenter', () => {
        for (var j = 0; j <= 4; j++) {
          if (j > i) {
            numCheck[j].style.borderLeftColor = '#ccc'
          } else {
            numCheck[j].style.borderLeftColor = '#000'
          }
        }
      })
      numCheck[i].addEventListener('mouseleave', () => {
        for (var j = 0; j <= 4; j++) {
          if (j > this.num) {
            numCheck[j].style.borderLeftColor = '#ccc'
          } else {
            numCheck[j].style.borderLeftColor = '#000'
          }
        }
      })
      numCheck[i].addEventListener('mousedown', () => {
        for (var j = 0; j <= i; j++) {
          numCheck[j].style.borderLeftColor = '#000'
        }
        this.num = i
        let value = this.$refs.key.value
        if (value !== '') {
          for (let i = this.result.length - 1; i >= 0; i--) {
            this.result.splice(i, 1)
          }
          publicFn.serch(value, (this.num + 1) * 6, this.result)
        }
      })
    }
    bus.$on('updataPlay', (e) => {
      let temp = document.querySelectorAll('.ftoOjj')
      for (var i = 0; i < temp.length; i++) {
        try {
          temp[i].style.color = global.colors
        } catch (e) {
          console.log('勾(未加载)')
        }
      }
    })
    this.getLoact()
    bus.$on('updated', (e) => {
      this.getLoact()
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

* {
  margin: 0;
  padding: 0;
}
.downFile {
  position: relative;
  left: 0;
  top: 0;
  width: 100%;
  height: 520px;
  overflow: hidden;
}

.downFileTitle {
  position: relative;
  width: 100%;
  height: 28px;
  margin: 0 auto 0;
  padding-bottom: 24px;
  padding-top: 24px;
  font-size: 11pt;
  border-bottom: 1px solid #cccccc;
}
.downFileTitle ul {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 30%;
  margin: 0 auto 0;
  height: 100%;
}
.downFileTitle li {
  list-style-type: none;
  width: 50%;
  height: 100%;
  line-height: 28px;
  cursor: pointer;
  border: 1px solid rgb(124,125,133);
}
.downFileTitle li:nth-child(1) {
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}
.downFileTitle li:nth-child(2) {
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}
.Alerdy {
  background-color: rgb(124,125,133);
  color: white;
}
.Not {
  background-color: white;
  color: rgb(136,136,136);
}
@keyframes init {
  0% {
    opacity: 0;
    left: 1022px;
  }
  100% {
    opacity: 1;
    left: 0;
  }
}
.downTable {
  position: absolute;
  width: 100%;
  height: 414px;
  font-size: 10pt;
  padding-top: 24px;
  opacity: 0;
  animation: init 1s;
  animation-fill-mode: forwards;
}

.downTable ul {
  position: relative;
  font-size: 8pt;
  top: 12px;
}
.fto {
  position: absolute;
  list-style-type: none;
  text-indent: 12px;
  width: 100%;
  height: 34px;
  cursor: pointer;
}
.foo {
  position: absolute;
  list-style-type: none;
  text-indent: 12px;
  width: 100%;
  height: 34px;
  cursor: pointer;
}
.fto li {
  position: absolute;
  height: 34px;
  line-height: 34px;
  width: 152px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  text-align: left;
}
.foo li {
  position: absolute;
  height: 34px;
  line-height: 34px;
  width: 260px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  text-align: left;
}
.fto li:nth-child(1) {
  left: 10px;
  width: 60px;
}
.fto li:nth-child(2) {
  left: 60px;
}
.fto li:nth-child(3) {
  left: 236px;
}
.fto li:nth-child(4) {
  left: 392px;
}
.fto li:nth-child(5) {
  left: 546px;
}
.fto li:nth-child(6) {
  left: 704px;
}
.foo li:nth-child(1) {
  left: 24px;
}
.foo li:nth-child(2) {
  left: 112px;
}
.foo li:nth-child(3) {
  left: 392px;
}
.foo li:nth-child(4) {
  left: 650px;
}
.fto:hover {
  background: rgb(245,245,245);
}

.foo:hover {
  background-color: rgb(245,245,245);
}
.downTable .too li {
  list-style-type: none;
  border-left: 1px solid #cccccc;
  text-indent: 12px;
  height: 24px;
  line-height: 24px;
}

.too {
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 1px solid #cccccc;
  border-bottom: 1px solid #cccccc;
}
.result {
  position: relative;
  width: 100%;
  height: 382px;
  top: 12px;
  overflow: auto;
  overflow-x: hidden;
}

.downTable input {
  position: absolute;
  right: 184px;
  top: 6px;
  width: 220px;
  height: 22px;
  border-radius: 12px;
  color: black;
  text-indent: 8px;
  border: 1px solid #cccccc;
  outline: none;
}
.numCheck {
  position: absolute;
  right: 56px;
  top: 0;
  width: 100px;
  height: 24px;
}
.numCheck ul {
  list-style-type: none;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.numCheck ul li {
  width: 0;
  height: 0;
  cursor: pointer;
  transition: all .4s;
  border-left: 12px solid #cccccc;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
}
.numCheck ul li:nth-child(1) {
  border-left-color: #000;
}
.numCheck ul li:hover {
  border-left-color: #000;
}
.numInfo {
  position: absolute;
  right: -36px;
  top: 6px;
  width: 24px;
  height: 24px;
  line-height: 24px;
  font-size: 10pt;
}
</style>
