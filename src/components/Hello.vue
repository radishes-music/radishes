<template>
  <div class="hello">
    <ExTitle></ExTitle>
    <FlexLeft v-show="isView && !isMvPlay"></FlexLeft>
    <FlexRight v-show="isView && !isMvPlay"></FlexRight>
    <lyc v-show="!isView && !isMvPlay"></lyc>
    <mvPlay v-show="isMvPlay"></mvPlay>
    <play></play>
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
      isMvPlay: false
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
