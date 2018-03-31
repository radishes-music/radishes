<template>
  <div class="hello">
    <ExTitle></ExTitle>
    <FlexLeft v-show="isView && !isMvPlay"></FlexLeft>
    <FlexRight v-show="isView && !isMvPlay"></FlexRight>
    <lyc v-show="!isView && !isMvPlay"></lyc>
    <mvPlay v-show="isMvPlay"></mvPlay>
    <play></play>
    <div id="Illustrate">
      <img id="popShow" @click="change()" v-if="!isShowPop" src="http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/popRight.png">
      <ol v-if="isShowPop">
        <li>项目下载与说明</li>
        <li><a href="https://github.com/Linkontoask/radishes" target="_blank">GitHub传送门</a></li>
        <li><a href="https://download.csdn.net/download/chutianwu5552/10292566" target="_blank">CSDN传送门</a></li>
        <li><a href="https://www.zhihu.com/people/link-14-7/activities" target="_blank">知乎传送门</a></li>
        <li><a href="https://linkontoask.github.io/" target="_blank">GitHub文档</a></li>
      </ol>
      <ul>
        <li></li>
      </ul>
      <img id="popHidden" @click="popHidden()" v-if="isShowPop" src="http://linkorg.oss-cn-beijing.aliyuncs.com/musicRec/popLeft.png">
    </div>
  </div>
</template>

<script>

import title from './ExTitle'
import left from './FlexLeft'
import right from './foundMusic/FlexRight'
import play from './play/play'
import lyc from './lycLayout'
import mvPlay from './MV/MvPlay'
import bus from '../router/eventBus'

import publicBox from './Data/rightMenu'

export default {
  name: 'hello',
  data () {
    return {
      isView: true,
      isMvPlay: false,
      isShowPop: false
    }
  },
  components: {
    'ExTitle': title,
    'FlexLeft': left,
    'FlexRight': right,
    'play': play,
    'lyc': lyc,
    'mvPlay': mvPlay
  },
  methods: {
    onclick: function (obj) {
      obj.addEventListener('mousedown', () => {
        publicBox.startMouseScrool()
        try {
          publicBox.hideSelf()
        } catch (e) { }
      })
    },
    change: function () {
      this.isShowPop ? this.isShowPop = false : this.isShowPop = true
      if (this.isShowPop) {
        let obj = document.querySelector('#Illustrate')
        obj.style.width = '14%'
        obj.style.borderRadius = 0
        obj.style.left = '0'
      }
    },
    popHidden: function () {
      this.isShowPop = false
      let obj = document.querySelector('#Illustrate')
      obj.style.width = '134px'
      obj.style.borderRadius = '50%'
      obj.style.left = '-92px'
    }
  },
  mounted: function () {
    bus.$on('isLyc', (e) => {
      this.isView = e
    })
    bus.$on('isMvPlay', (e) => {
      this.isMvPlay = e
    })
    // 按下隐藏搜索弹出框
    this.onclick(document.querySelector('.right'))
    this.onclick(document.querySelector('.left'))
    this.onclick(document.querySelector('.title'))
    this.onclick(document.querySelector('.play'))
    this.onclick(document.querySelector('.left_box'))
    document.body.oncontextmenu = () => { return false }
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
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
}

#Illustrate {
  position: fixed;
  left: -92px;
  bottom: 0;
  width: 134px;
  height: 134px;
  background: #000;
  border-radius: 50%;
  transition: all .6s;
  opacity: .8;
  z-index: 999;
}
#Illustrate a {
  color: red;
}

#Illustrate img {
  cursor: pointer;
}

#popShow {
  position: absolute;
  left: 92px;
  top: 46px;
}

#Illustrate ol {
  position: relative;
  display: flex;
  width: 128px;
  height: 100%;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
}
#Illustrate ol li {
  width: 100%;
  height: 24px;
}
#popHidden {
  position: absolute;
  right: 4px;
  top: 46px;
}

.hello {
  position: relative;
  width: 1022px;
  height: 620px;
  max-width: 1022px;
  margin: 12px auto 0;
  overflow: hidden;
  box-shadow: -7px 11px 12px #ccc;
}
</style>
